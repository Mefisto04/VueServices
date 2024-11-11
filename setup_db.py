from main import app
from application.models import db, Role, User, Freelancer, RolesUsers, Admin, ServiceRequest, Feedback
from flask_security import hash_password
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

with app.app_context():
    # Drop existing tables and create new ones
    db.drop_all()
    db.create_all()

    # Create roles
    role_admin = Role(name="admin", description="User is an admin")
    role_member = Role(name="member", description="User is a Member")
    role_freelancer = Role(name="freelancer", description="User is a Freelancer")

    db.session.add_all([role_admin, role_member, role_freelancer])
    db.session.commit()

    # Create admin user
    if not db.session.query(Admin).filter_by(email="admin@gmail.com").first():
        admin_user = Admin(
            name="Admin User",
            email="admin@gmail.com",
            password=generate_password_hash("12345678"),
            active=True,
            fs_uniquifier="admin_unique_identifier"
        )
        db.session.add(admin_user)
        db.session.commit()
        # Associate admin user with admin role
        db.session.add(RolesUsers(user_id=admin_user.id, role_id=role_admin.id))

    # Create freelancer users
    freelancers = [
        {"name": "Freelancer One", "email": "freelancer1@gmail.com","location":"Nagpur","service":"Cleaning", "experience": "5 years in web development", "portfolio_url": "https://portfolio-one.com", "fs_uniquifier": "freelancer1@gmail.com", "is_approved": True},
        {"name": "Freelancer Two", "email": "freelancer2@gmail.com","location":"Mumbai","service":"Gardening", "experience": "3 years in graphic design", "portfolio_url": "https://portfolio-two.com", "fs_uniquifier": "freelancer2@gmail.com", "is_approved": False},
        {"name": "Freelancer Three", "email": "freelancer3@gmail.com","location":"Jodhpur","service":"Plumbing", "experience": "6 years in digital marketing", "portfolio_url": "https://portfolio-three.com", "fs_uniquifier": "freelancer3@gmail.com", "is_approved": True},
        {"name": "Freelancer Four", "email": "freelancer4@gmail.com","location":"Nagpur","service":"Handyman", "experience": "4 years in content writing", "portfolio_url": "https://portfolio-four.com", "fs_uniquifier": "freelancer4@gmail.com", "is_approved": False}
    ]

    for freelancer_data in freelancers:
        if not db.session.query(Freelancer).filter_by(email=freelancer_data["email"]).first():
            freelancer = Freelancer(
                name=freelancer_data["name"],
                email=freelancer_data["email"],
                password=generate_password_hash("12345678"),
                location=freelancer_data["location"],
                service=freelancer_data["service"],
                experience=freelancer_data["experience"],
                portfolio_url=freelancer_data["portfolio_url"],
                active=True,
                is_approved=freelancer_data["is_approved"],
                fs_uniquifier=freelancer_data["fs_uniquifier"]
            )
            db.session.add(freelancer)
            db.session.commit()
            # Associate freelancer with the freelancer role
            db.session.add(RolesUsers(user_id=freelancer.id, role_id=role_freelancer.id))

    db.session.commit()

    # Create member users
    members = [
        {"name": "User 1", "email": "user1@gmail.com", "fs_uniquifier": "user1@gmail.com"},
    ]

    for member_data in members:
        if not db.session.query(User).filter_by(email=member_data["email"]).first():
            student = User(
                name=member_data["name"],
                email=member_data["email"],
                password=generate_password_hash("12345678"),
                active=True,
                fs_uniquifier=member_data["fs_uniquifier"]
            )
            db.session.add(student)
            db.session.commit()
            # Associate member with the member role
            db.session.add(RolesUsers(user_id=student.id, role_id=role_member.id))

    db.session.commit()

    # Create Service Requests
    user1 = db.session.query(User).filter_by(email="user1@gmail.com").first()
    freelancer1 = db.session.query(Freelancer).filter_by(email="freelancer1@gmail.com").first()

    service_date1 = datetime.now() + timedelta(days=3)
    service_date1 = service_date1.replace(hour=10, minute=0)

    if user1 and freelancer1:
        service_request1 = ServiceRequest(
            user_id=user1.id,
            freelancer_id=freelancer1.id,
            status="pending",
            service_date=service_date1
        )
        db.session.add(service_request1)

        # Add feedback
        feedback = Feedback(
            user_id=user1.id,
            freelancer_id=freelancer1.id,
            rating=8,  # Example rating
            comments="Great service!"  # Example comments
        )
        db.session.add(feedback)
        db.session.commit()  # Commit the feedback to the database
        
        service_request1.is_completed = True  # Mark service request as completed
        db.session.commit()  

        # Update freelancer's average rating
        freelancer1.update_rating()  # This method should compute the average rating from feedback

    db.session.commit()
