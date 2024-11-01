from datetime import datetime
from flask_login import current_user
from flask_security import RoleMixin, UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_security import current_user, auth_required

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))  # Link to User table
    freelancer_id = db.Column(db.Integer(), db.ForeignKey('freelancers.id'))  # Link to Freelancer table
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))  # Link to Role table

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    users = db.relationship('User', secondary='roles_users', backref=db.backref('roles', lazy='dynamic'),overlaps="freelancers,roles")
    freelancers = db.relationship('Freelancer', secondary='roles_users', backref=db.backref('roles', lazy='dynamic'),overlaps="freelancers,roles")

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(30))
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)

class Freelancer(db.Model, UserMixin):
    __tablename__ = 'freelancers'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(30))
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String(255))
    experience = db.Column(db.String(255))  # New field for experience
    portfolio_url = db.Column(db.String(255))  # New field for portfolio URL
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    rating = db.Column(db.Float, default=0)

    def update_rating(self):
        feedbacks = Feedback.query.filter_by(freelancer_id=self.id).all()
        if feedbacks:
            average_rating = sum(feedback.rating for feedback in feedbacks) / len(feedbacks)
            self.rating = average_rating
        else:
            self.rating = 0  # Set to 0 if no feedback
        db.session.commit()


class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    freelancer_id = db.Column(db.Integer, db.ForeignKey('freelancers.id'), nullable=False)
    status = db.Column(db.String(50), default="pending", nullable=False)
    request_date = db.Column(db.DateTime, default=datetime.utcnow)
    service_date = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"<ServiceRequest {self.id} from User {self.user_id} to Freelancer {self.freelancer_id}>"



# Admin model
class Admin(db.Model, UserMixin):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(30))
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    freelancer_id = db.Column(db.Integer, db.ForeignKey('freelancers.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # Rating out of 10
    comments = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='feedbacks')
    freelancer = db.relationship('Freelancer', backref='feedbacks')