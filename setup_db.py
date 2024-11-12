from main import app
from application.models import db, Role, User, Professional, RolesUsers, Admin, ServiceRequest, Feedback
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
    role_professional = Role(name="professional", description="User is a Professional")

    db.session.add_all([role_admin, role_member, role_professional])
    db.session.commit()
    print(role_admin.id)
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
        db.session.add(RolesUsers(user_id=admin_user.id, role_id=role_admin.id))
        # print(admin_user.id)
        # Associate admin user with admin role
    


    # Create professional users
    professionals = [
        {"name": "Professional One", "email": "professional1@gmail.com","location":"Nagpur","service":"Cleaning", "experience": "5 years in web development", "portfolio_url": "https://portfolio-one.com", "fs_uniquifier": "professional1@gmail.com", "is_approved": True},
        {"name": "Professional Two", "email": "professional2@gmail.com","location":"Mumbai","service":"Gardening", "experience": "3 years in graphic design", "portfolio_url": "https://portfolio-two.com", "fs_uniquifier": "professional2@gmail.com", "is_approved": False},
        {"name": "Professional Three", "email": "professional3@gmail.com","location":"Jodhpur","service":"Plumbing", "experience": "6 years in digital marketing", "portfolio_url": "https://portfolio-three.com", "fs_uniquifier": "professional3@gmail.com", "is_approved": True},
        {"name": "Professional Four", "email": "professional4@gmail.com","location":"Nagpur","service":"Handyman", "experience": "4 years in content writing", "portfolio_url": "https://portfolio-four.com", "fs_uniquifier": "professional4@gmail.com", "is_approved": False}
    ]

    for professional_data in professionals:
        if not db.session.query(Professional).filter_by(email=professional_data["email"]).first():
            professional = Professional(
                name=professional_data["name"],
                email=professional_data["email"],
                password=generate_password_hash("12345678"),
                location=professional_data["location"],
                service=professional_data["service"],
                experience=professional_data["experience"],
                portfolio_url=professional_data["portfolio_url"],
                active=True,
                is_approved=professional_data["is_approved"],
                fs_uniquifier=professional_data["fs_uniquifier"]
            )
            db.session.add(professional)
            db.session.commit()
            professional_record = db.session.query(Professional).filter_by(email=professional_data["email"]).first()
            if professional_record:
                # Add a role-user association in RolesUsers
                roles_user = RolesUsers(user_id=professional_record.id, role_id=role_professional.id)
                db.session.add(roles_user)
                db.session.commit()

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
            db.session.add(RolesUsers(user_id=student.id, role_id=role_member.id))

    db.session.commit()

    # Create Service Requests
    user1 = db.session.query(User).filter_by(email="user1@gmail.com").first()
    professional1 = db.session.query(Professional).filter_by(email="professional1@gmail.com").first()

    service_date1 = datetime.now() + timedelta(days=3)
    service_date1 = service_date1.replace(hour=10, minute=0)

    if user1 and professional1:
        service_request1 = ServiceRequest(
            user_id=user1.id,
            professional_id=professional1.id,
            status="pending",
            service_date=service_date1
        )
        db.session.add(service_request1)

        # Add feedback
        feedback = Feedback(
            user_id=user1.id,
            professional_id=professional1.id,
            rating=8,  # Example rating
            comments="Great service!"  # Example comments
        )
        db.session.add(feedback)
        db.session.commit()  # Commit the feedback to the database
        
        service_request1.is_completed = True  # Mark service request as completed
        db.session.commit()  

        # Update professional's average rating
        professional1.update_rating()  # This method should compute the average rating from feedback

    db.session.commit()
