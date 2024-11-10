from celery.schedules import crontab
from flask import Flask, jsonify
from flask_security import Security

from application.instances import cache
from application.models import db,Freelancer,User
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


@app.route('/api/freelancer', methods=['GET'])
def get_freelancers():
    freelancers = Freelancer.query.all()  # Fetch all freelancers from the database
    freelancer_list = [
        {
            "id": f.id,
            "name": f.name,
            "email": f.email,
            "location": f.location,
            "experience": f.experience,
            "portfolio_url": f.portfolio_url,
            "rating": f.rating,
            "service": f.service,
            "is_approved": f.is_approved
        } for f in freelancers
    ]
    return jsonify(freelancer_list)  # Return the list of freelancers as JSON

@app.route('/api/freelancer/<int:freelancer_id>', methods=['DELETE'])
def delete_freelancer(freelancer_id):
    freelancer = Freelancer.query.get(freelancer_id)
    if not freelancer:
        return jsonify({"message": "Freelancer not found"}), 404

    db.session.delete(freelancer)
    db.session.commit()
    return jsonify({"message": "Freelancer deleted successfully"}), 200

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
    freelancers = Freelancer.query.all()
    
    # Fetch only the unapproved freelancers as requests
    unapproved_freelancers = Freelancer.query.filter_by(is_approved=False).all()
    
    users_data = [
        {'id': user.id, 'name': user.name, 'email': user.email, 'active': user.active}
        for user in users
    ]
    
    freelancers_data = [
        {'id': freelancer.id, 'name': freelancer.name, 'email': freelancer.email,
            'rating': freelancer.rating, 
         'service': freelancer.service, 'experience': freelancer.experience,
         'location': freelancer.location,
          'active': freelancer.active}
        for freelancer in freelancers
    ]
    
    freelancer_requests = [
        {
            'id': f.id,
            'name': f.name,
            'email': f.email,
            'service': f.service,
            'experience': f.experience,
            'portfolio_url': f.portfolio_url,
        } for f in unapproved_freelancers
    ]

    return jsonify({
        'users': users_data,
        'freelancers': freelancers_data,
        'freelancerRequests': freelancer_requests
    })

@app.route('/api/freelancer/<int:freelancer_id>/approve', methods=['POST'])
def approve_freelancer(freelancer_id):
    # Fetch the freelancer by ID
    freelancer = Freelancer.query.get(freelancer_id)
    
    # Check if the freelancer exists
    if not freelancer:
        return jsonify({"message": "Freelancer not found"}), 404
    
    # Update the is_approved field
    freelancer.is_approved = True
    
    # Commit the changes to the database
    db.session.commit()
    
    # Return a success message
    return jsonify({"message": "Freelancer approved successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
    # app.run(debug=True,host='192.168.0.8',port=5000)
