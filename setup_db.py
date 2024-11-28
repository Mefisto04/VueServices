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
    {"name": "Rahul Arora", "email": "rahularora@gmail.com", "location": "Nagpur", "service": "Cleaning", "service_price": "1150", "experience": "5 years", "portfolio_url": "https://portfolio-one.com", "fs_uniquifier": "rahularora@gmail.com", "is_approved": 1},
    {"name": "Sumit Arora", "email": "sumitarora@gmail.com", "location": "Mumbai", "service": "Gardening", "service_price": "2350", "experience": "3 years", "portfolio_url": "https://portfolio-two.com", "fs_uniquifier": "sumitarora@gmail.com", "is_approved": 1},
    {"name": "Uday Singh", "email": "udaysingh@gmail.com", "location": "Jodhpur", "service": "Plumbing", "service_price": "3170", "experience": "6 years", "portfolio_url": "https://portfolio-three.com", "fs_uniquifier": "udaysingh@gmail.com", "is_approved": 1},
    {"name": "Tina Singh", "email": "tinasingh@gmail.com", "location": "Nagpur", "service": "Handyman", "service_price": "5550", "experience": "4 years", "portfolio_url": "https://portfolio-four.com", "fs_uniquifier": "tinasingh@gmail.com", "is_approved": 0},
    {"name": "Amit Verma", "email": "amitverma@gmail.com", "location": "Delhi", "service": "Electrician", "service_price": "2000", "experience": "7 years", "portfolio_url": "https://portfolio-five.com", "fs_uniquifier": "amitverma@gmail.com", "is_approved": 1},
    {"name": "Sneha Sharma", "email": "snehasharma@gmail.com", "location": "Pune", "service": "Painting", "service_price": "4500", "experience": "5 years", "portfolio_url": "https://portfolio-six.com", "fs_uniquifier": "snehasharma@gmail.com", "is_approved": 1},
    {"name": "Karan Mehta", "email": "karanmehta@gmail.com", "location": "Ahmedabad", "service": "Carpentry", "service_price": "3200", "experience": "4 years", "portfolio_url": "https://portfolio-seven.com", "fs_uniquifier": "karanmehta@gmail.com", "is_approved": 1},
    {"name": "Priya Das", "email": "priyadas@gmail.com", "location": "Bangalore", "service": "Interior Design", "service_price": "6000", "experience": "8 years", "portfolio_url": "https://portfolio-eight.com", "fs_uniquifier": "priyadas@gmail.com", "is_approved": 1},
    {"name": "Manoj Kumar", "email": "manojkumar@gmail.com", "location": "Chennai", "service": "Landscaping", "service_price": "3500", "experience": "6 years", "portfolio_url": "https://portfolio-nine.com", "fs_uniquifier": "manojkumar@gmail.com", "is_approved": 0},
    {"name": "Richa Jain", "email": "richajain@gmail.com", "location": "Hyderabad", "service": "Photography", "service_price": "8000", "experience": "10 years", "portfolio_url": "https://portfolio-ten.com", "fs_uniquifier": "richajain@gmail.com", "is_approved": 1}
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
    {"name": "Alice Johnson", "email": "alicejohnson@gmail.com", "fs_uniquifier": "alicejohnson@gmail.com"},
    {"name": "Bob Smith", "email": "bobsmith@gmail.com", "fs_uniquifier": "bobsmith@gmail.com"},
    {"name": "Charlie Brown", "email": "charliebrown@gmail.com", "fs_uniquifier": "charliebrown@gmail.com"},
    {"name": "Diana Lee", "email": "dianalee@gmail.com", "fs_uniquifier": "dianalee@gmail.com"},
    {"name": "Edward Miller", "email": "edwardmiller@gmail.com", "fs_uniquifier": "edwardmiller@gmail.com"},
    {"name": "Fiona Carter", "email": "fionacarter@gmail.com", "fs_uniquifier": "fionacarter@gmail.com"},
    {"name": "George Harris", "email": "georgeharris@gmail.com", "fs_uniquifier": "georgeharris@gmail.com"},
    {"name": "Hannah Wilson", "email": "hannahwilson@gmail.com", "fs_uniquifier": "hannahwilson@gmail.com"},
    {"name": "Ian Wright", "email": "ianwright@gmail.com", "fs_uniquifier": "ianwright@gmail.com"},
    {"name": "Julia Roberts", "email": "juliaroberts@gmail.com", "fs_uniquifier": "juliaroberts@gmail.com"}
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


    # Retrieve users and professionals
    user1 = db.session.query(User).filter_by(email="alicejohnson@gmail.com").first()
    user2 = db.session.query(User).filter_by(email="bobsmith@gmail.com").first()
    user3 = db.session.query(User).filter_by(email="charliebrown@gmail.com").first()
    user4 = db.session.query(User).filter_by(email="dianalee@gmail.com").first()

    professional1 = db.session.query(Professional).filter_by(email="rahularora@gmail.com").first()
    professional2 = db.session.query(Professional).filter_by(email="sumitarora@gmail.com").first()
    professional3 = db.session.query(Professional).filter_by(email="udaysingh@gmail.com").first()
    professional4 = db.session.query(Professional).filter_by(email="amitverma@gmail.com").first()

    # Accepted and completed service requests with feedback
    service_requests = [
        ServiceRequest(
            user_id=user1.id,
            professional_id=professional1.id,
            status="completed",
            service_date=datetime.now() - timedelta(days=10)
        ),
        ServiceRequest(
            user_id=user2.id,
            professional_id=professional2.id,
            status="completed",
            service_date=datetime.now() - timedelta(days=8)
        ),
        ServiceRequest(
            user_id=user3.id,
            professional_id=professional3.id,
            status="completed",
            service_date=datetime.now() - timedelta(days=7)
        ),
        ServiceRequest(
            user_id=user4.id,
            professional_id=professional4.id,
            status="completed",
            service_date=datetime.now() - timedelta(days=6)
        )
    ]

    # Add service requests to the session
    for service_request in service_requests:
        db.session.add(service_request)

    # Commit service requests
    db.session.commit()

    # Adding feedback for completed requests
    feedbacks = [
        Feedback(
            user_id=user1.id,
            professional_id=professional1.id,
            rating=10,
            comments="Outstanding work!"
        ),
        Feedback(
            user_id=user2.id,
            professional_id=professional2.id,
            rating=9,
            comments="Excellent service, very professional!"
        ),
        Feedback(
            user_id=user3.id,
            professional_id=professional3.id,
            rating=8,
            comments="Good work but a little late."
        ),
        Feedback(
            user_id=user4.id,
            professional_id=professional4.id,
            rating=7,
            comments="Decent service, could improve communication."
        )
    ]

    # Add feedback to the session
    for feedback in feedbacks:
        db.session.add(feedback)

    # Commit feedbacks
    db.session.commit()

    # Update professional ratings
    professionals = [professional1, professional2, professional3, professional4]
    for professional in professionals:
        professional.update_rating()

    # Commit rating updates
    db.session.commit()


print("Setup completed!")
