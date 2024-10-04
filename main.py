from celery.schedules import crontab
from flask import Flask, jsonify
from flask_security import Security

from application.instances import cache
from application.models import db,Freelancer,User
from application.sec import datastore
from config import DevelopmentConfig
from application.resources import api
from application.worker import celery_init_app
from application.tasks import daily_reminder, mark_overdue_requests_as_revoked, send_monthly_report

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


@celery_app.on_after_configure.connect
def automated_tasks(sender, **kwargs):
    # daily at 6 30
    sender.add_periodic_task(
        30,
        # crontab(hour=19,minute=58),
        # daily_reminder.s(),
    )

    # revoke overdue books
    sender.add_periodic_task(
        60,
        # crontab(hour=0, minute=1),
        mark_overdue_requests_as_revoked.s(),
    )

    # monthly report
    sender.add_periodic_task(
        30,
        # crontab(day_of_month=1, hour=0, minute=1),
        send_monthly_report.s(),
    )



@app.route('/api/freelancer', methods=['GET'])
def get_freelancers():
    freelancers = Freelancer.query.all()  # Fetch all freelancers from the database
    freelancer_list = [
        {
            "id": f.id,
            "name": f.name,
            "email": f.email,
            "experience": f.experience,
            "portfolio_url": f.portfolio_url
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

    users_data = [{'id': user.id, 'name': user.name, 'email': user.email, 'active': user.active} for user in users]
    freelancers_data = [{'id': freelancer.id, 'name': freelancer.name, 'email': freelancer.email, 'active': freelancer.active} for freelancer in freelancers]

    return jsonify({
        'users': users_data,
        'freelancers': freelancers_data
    })



if __name__ == '__main__':
    app.run(debug=True)
    # app.run(debug=True,host='192.168.0.8',port=5000)
