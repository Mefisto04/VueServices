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
    professional_id = db.Column(db.Integer(), db.ForeignKey('professionals.id'))  # Link to Professional table
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))  # Link to Role table

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    users = db.relationship('User', secondary='roles_users', backref=db.backref('roles', lazy='dynamic'),overlaps="professionals,roles")
    professionals = db.relationship('Professional', secondary='roles_users', backref=db.backref('roles', lazy='dynamic'),overlaps="professionals,roles")

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(30))
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.String(50), default='User') 

class Professional(db.Model, UserMixin):
    __tablename__ = 'professionals'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(30))
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String(255))
    location = db.Column(db.String(255))  
    service = db.Column(db.String(255))
    service_price = db.Column(db.Integer)
    experience = db.Column(db.String(255))  # New field for experience
    portfolio_url = db.Column(db.String(255))  # New field for portfolio URL
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    rating = db.Column(db.Float, default=0)
    is_approved = db.Column(db.Integer, default=0)
    role = db.Column(db.String(50), default='Professional') 

    def update_rating(self):
        feedbacks = Feedback.query.filter_by(professional_id=self.id).all()
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
    professional_id = db.Column(db.Integer, db.ForeignKey('professionals.id'), nullable=False)
    status = db.Column(db.String(50), default="pending", nullable=False)
    request_date = db.Column(db.DateTime, default=datetime.utcnow)
    service_date = db.Column(db.DateTime, nullable=False)
    is_completed = db.Column(db.Boolean, default=False)


    def __repr__(self):
        return f"<ServiceRequest {self.id} from User {self.user_id} to Professional {self.professional_id}>"



# Admin model
class Admin(db.Model, UserMixin):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(30))
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.String(50), default='Admin') 
    

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('professionals.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # Rating out of 10
    comments = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='feedbacks')
    professional = db.relationship('Professional', backref='feedbacks')


class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    base_price = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    num_professionals = db.Column(db.Integer, default=0)

    def __init__(self, name,base_price,description, num_professionals=0):
        self.name = name
        self.base_price = base_price
        self.description = description
        self.num_professionals = num_professionals
