from main import app
from application.models import db, Role, User, Professional, RolesUsers, Admin, ServiceRequest, Feedback, Service
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

    # Create professional users
    professionals = [
        {"name": "Professional One", "email": "professional1@gmail.com", "location": "Nagpur", "service": "Cleaning","service_price":"1150", "experience": "5 years", "portfolio_url": "https://portfolio-one.com", "fs_uniquifier": "professional1@gmail.com", "is_approved": 1},
        {"name": "Professional Two", "email": "professional2@gmail.com", "location": "Mumbai", "service": "Gardening","service_price":"2350", "experience": "3 years", "portfolio_url": "https://portfolio-two.com", "fs_uniquifier": "professional2@gmail.com", "is_approved": 1},
        {"name": "Professional Three", "email": "professional3@gmail.com", "location": "Jodhpur", "service": "Plumbing","service_price":"3170", "experience": "6 years", "portfolio_url": "https://portfolio-three.com", "fs_uniquifier": "professional3@gmail.com", "is_approved": 1},
        {"name": "Professional Four", "email": "professional4@gmail.com", "location": "Nagpur", "service": "Handyman","service_price":"5550", "experience": "4 years", "portfolio_url": "https://portfolio-four.com", "fs_uniquifier": "professional4@gmail.com", "is_approved": 0},
    ]

    for professional_data in professionals:
        if not db.session.query(Professional).filter_by(email=professional_data["email"]).first():
            professional = Professional(
                name=professional_data["name"],
                email=professional_data["email"],
                password=generate_password_hash("12345678"),
                location=professional_data["location"],
                service=professional_data["service"],
                service_price=professional_data["service_price"],
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
                roles_user = RolesUsers(user_id=professional_record.id, role_id=role_professional.id)
                db.session.add(roles_user)
                db.session.commit()

    # Create member users
    members = [
        {"name": "User 1", "email": "user1@gmail.com", "fs_uniquifier": "user1@gmail.com"},
        {"name": "User 2", "email": "user2@gmail.com", "fs_uniquifier": "user2@gmail.com"},
        {"name": "User 3", "email": "user3@gmail.com", "fs_uniquifier": "user3@gmail.com"},
    ]

    for member_data in members:
        if not db.session.query(User).filter_by(email=member_data["email"]).first():
            member = User(
                name=member_data["name"],
                email=member_data["email"],
                password=generate_password_hash("12345678"),
                active=True,
                fs_uniquifier=member_data["fs_uniquifier"]
            )
            db.session.add(member)
            db.session.commit()
            db.session.add(RolesUsers(user_id=member.id, role_id=role_member.id))

    # Add predefined services
    services = [
        {"name": "Cleaning",
         "base_price": 1000,
         "description": "Cleaning service description",
        },
        {"name": "Gardening",
         "base_price": 2000,
         "description": "Gardening service description",
         },
        {"name": "Plumbing",
         "base_price": 3000,
            "description": "Plumbing service description",
         },
        {"name": "Electrical Work",
         "base_price": 4000,
         "description": "Electrical work service description",},
        {"name": "Handyman",
         "base_price": 5000,
         "description": "Handyman service description",},
        {"name": "Painting",
         "base_price": 6000,
         "description": "Painting service description",
        },
        {"name": "Moving",
            "base_price": 7000,
            "description": "Moving service description",
        },
        {"name": "Others",
         "base_price": 8000,
         "description": "Others service description",
        },
    ]

    for service_data in services:
        if not db.session.query(Service).filter_by(name=service_data["name"]).first():
            service_count = Professional.query.filter_by(service=service_data["name"]).count()
            service = Service(
                name=service_data["name"],
                base_price=service_data["base_price"],
                description=service_data["description"],
                num_professionals=service_count
            )
            db.session.add(service)
            db.session.commit()

    # Create service requests and feedback
    user1 = db.session.query(User).filter_by(email="user1@gmail.com").first()
    user2 = db.session.query(User).filter_by(email="user2@gmail.com").first()
    professional1 = db.session.query(Professional).filter_by(email="professional1@gmail.com").first()
    professional2 = db.session.query(Professional).filter_by(email="professional2@gmail.com").first()

    # Pending service request
    service_request1 = ServiceRequest(
        user_id=user1.id,
        professional_id=professional1.id,
        status="pending",
        service_date=datetime.now() + timedelta(days=3)
    )
    db.session.add(service_request1)

    # Completed service request with feedback
    service_request2 = ServiceRequest(
        user_id=user2.id,
        professional_id=professional2.id,
        status="completed",
        service_date=datetime.now() - timedelta(days=5)
    )
    db.session.add(service_request2)
    db.session.commit()

    feedback = Feedback(
        user_id=user2.id,
        professional_id=professional2.id,
        rating=9,
        comments="Excellent service!"
    )
    db.session.add(feedback)
    db.session.commit()

    professional2.update_rating()  # Update professional's average rating
    db.session.commit()

print("Setup completed!")
