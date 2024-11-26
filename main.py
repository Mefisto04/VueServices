from celery.schedules import crontab
from flask import Flask, jsonify
from flask_security import Security

from application.instances import cache
from application.models import db,Professional,User
from application.sec import datastore
from config import DevelopmentConfig
from application.resources import api
from application.worker import celery_init_app

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app=app)
    api.init_app(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views

    return app


app = create_app()
celery_app = celery_init_app(app)


@app.route('/api/professional', methods=['GET'])
def get_professionals():
    professionals = Professional.query.all()  # Fetch all professionals from the database
    professional_list = [
        {
            "id": f.id,
            "name": f.name,
            "email": f.email,
            "location": f.location,
            "experience": f.experience,
            "service": f.service,
            "service_price": f.service_price,
            "portfolio_url": f.portfolio_url,
            "rating": f.rating,
            "service": f.service,
            "is_approved": f.is_approved
        } for f in professionals
    ]
    return jsonify(professional_list)  # Return the list of professionals as JSON

@app.route('/api/professional/<int:professional_id>', methods=['DELETE'])
def delete_professional(professional_id):
    professional = Professional.query.get(professional_id)
    if not professional:
        return jsonify({"message": "Professional not found"}), 404

    # db.session.delete(professional)
    #dont delete professional, just set active to -1
    professional.is_approved = -1
    db.session.commit()
    return jsonify({"message": "Professional deleted successfully"}), 200

@app.route('/api/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200


@app.route('/admin/data', methods=['GET'])
def get_admin_data():
    users = User.query.all()
    professionals = Professional.query.all()
    
    # Fetch only the unapproved professionals as requests
    unapproved_professionals = Professional.query.filter_by(is_approved=False).all()
    
    users_data = [
        {'id': user.id, 'name': user.name, 'email': user.email, 'active': user.active}
        for user in users
    ]
    
    professionals_data = [
        {'id': professional.id, 'name': professional.name, 'email': professional.email,
            'rating': professional.rating, 
         'service': professional.service,
         'service_price': professional.service_price,
        'experience': professional.experience,
         'location': professional.location,
          'active': professional.active}
        for professional in professionals
    ]
    
    professional_requests = [
        {
            'id': f.id,
            'name': f.name,
            'email': f.email,
            'service': f.service,
            'service_price': f.service_price,
            'experience': f.experience,
            'portfolio_url': f.portfolio_url,
        } for f in unapproved_professionals
    ]

    return jsonify({
        'users': users_data,
        'professionals': professionals_data,
        'professionalRequests': professional_requests
    })

@app.route('/api/professional/<int:professional_id>/approve', methods=['POST'])
def approve_professional(professional_id):
    # Fetch the professional by ID
    professional = Professional.query.get(professional_id)
    
    # Check if the professional exists
    if not professional:
        return jsonify({"message": "Professional not found"}), 404
    
    # Update the is_approved field
    professional.is_approved = True
    
    # Commit the changes to the database
    db.session.commit()
    
    # Return a success message
    return jsonify({"message": "Professional approved successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
    # app.run(debug=True,host='192.168.0.8',port=5000)
