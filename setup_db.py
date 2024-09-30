# from main import app
# from application.models import db, Role, User, Freelancer, RolesUsers,Admin  # Import RolesUsers for associations
# from flask_security import hash_password
# from werkzeug.security import generate_password_hash

# with app.app_context():
#     # Drop existing tables and create new ones
#     db.drop_all()
#     db.create_all()

#     # Create roles
#     role_admin = Role(name="admin", description="User is an admin")
#     role_member = Role(name="member", description="User is a Member")
#     role_freelancer = Role(name="freelancer", description="User is a Freelancer") 

#     db.session.add_all([role_admin, role_member, role_freelancer])
#     db.session.commit()

#     # Create users and associate roles
#     if not db.session.query(Admin).filter_by(email="admin@email.com").first():
#         admin_user = Admin(
#             name="Admin User",
#             email="admin@email.com",
#             password=generate_password_hash("pass123"),
#             active=True,
#             fs_uniquifier="admin_unique_identifier"
#         )
#         db.session.add(admin_user)
#         db.session.commit()
#         # Associate admin user with admin role
#         db.session.add(RolesUsers(user_id=admin_user.id, role_id=role_admin.id))

#     if not db.session.query(Freelancer).filter_by(email="freelancer1@email.com").first():
#         freelancer1 = Freelancer(
#             name="Freelancer One",
#             email="freelancer1@email.com",
#             password=generate_password_hash("pass123"),
#             experience="5 years in web development",
#             portfolio_url="https://portfolio-one.com",
#             active=True,
#             fs_uniquifier="freelancer1_unique_identifier"
#         )
#         db.session.add(freelancer1)
#         db.session.commit()
#         # Associate freelancer with the freelancer role
#         db.session.add(RolesUsers(freelancer_id=freelancer1.id, role_id=role_freelancer.id))

#     if not db.session.query(Freelancer).filter_by(email="freelancer2@email.com").first():
#         freelancer2 = Freelancer(
#             name="Freelancer Two",
#             email="freelancer2@email.com",
#             password=generate_password_hash("pass123"),
#             experience="3 years in graphic design",
#             portfolio_url="https://portfolio-two.com",
#             active=True,
#             fs_uniquifier="freelancer2_unique_identifier"
#         )
#         db.session.add(freelancer2)
#         db.session.commit()
#         # Associate freelancer with the freelancer role
#         db.session.add(RolesUsers(freelancer_id=freelancer2.id, role_id=role_freelancer.id))

#     db.session.commit()


#     if not db.session.query(User).filter_by(email="stud1@email.com").first():
#         student1 = User(
#             name="Student 1",
#             email="stud1@email.com",
#             password=generate_password_hash("pass123"),
#             active=True,
#             fs_uniquifier="stud1_unique_identifier"
#         )
#         db.session.add(student1)
#         db.session.commit()
#         # Associate student1 with member role
#         db.session.add(RolesUsers(user_id=student1.id, role_id=role_member.id))

#     if not db.session.query(User).filter_by(email="stud2@email.com").first():
#         student2 = User(
#             name="Student 2",
#             email="stud2@email.com",
#             password=generate_password_hash("pass123"),
#             active=True,
#             fs_uniquifier="stud2_unique_identifier"
#         )
#         db.session.add(student2)
#         db.session.commit()
#         # Associate student2 with member role
#         db.session.add(RolesUsers(user_id=student2.id, role_id=role_member.id))

#     # Commit all associations
#     db.session.commit()



from main import app
from application.models import db, Role, User, Freelancer, RolesUsers, Admin, ServiceRequest
from flask_security import hash_password
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
    if not db.session.query(Admin).filter_by(email="admin@email.com").first():
        admin_user = Admin(
            name="Admin User",
            email="admin@email.com",
            password=generate_password_hash("pass123"),
            active=True,
            fs_uniquifier="admin_unique_identifier"
        )
        db.session.add(admin_user)
        db.session.commit()
        # Associate admin user with admin role
        db.session.add(RolesUsers(user_id=admin_user.id, role_id=role_admin.id))

    # Create freelancer users
    freelancers = [
        {"name": "Freelancer One", "email": "freelancer1@email.com", "experience": "5 years in web development", "portfolio_url": "https://portfolio-one.com", "fs_uniquifier": "freelancer1_unique_identifier"},
        {"name": "Freelancer Two", "email": "freelancer2@email.com", "experience": "3 years in graphic design", "portfolio_url": "https://portfolio-two.com", "fs_uniquifier": "freelancer2_unique_identifier"},
        {"name": "Freelancer Three", "email": "freelancer3@email.com", "experience": "7 years in app development", "portfolio_url": "https://portfolio-three.com", "fs_uniquifier": "freelancer3_unique_identifier"}
    ]

    for freelancer_data in freelancers:
        if not db.session.query(Freelancer).filter_by(email=freelancer_data["email"]).first():
            freelancer = Freelancer(
                name=freelancer_data["name"],
                email=freelancer_data["email"],
                password=generate_password_hash("pass123"),
                experience=freelancer_data["experience"],
                portfolio_url=freelancer_data["portfolio_url"],
                active=True,
                fs_uniquifier=freelancer_data["fs_uniquifier"]
            )
            db.session.add(freelancer)
            db.session.commit()
            # Associate freelancer with the freelancer role
            db.session.add(RolesUsers(user_id=freelancer.id, role_id=role_freelancer.id))
    db.session.commit()

    # Create member users
    members = [
        {"name": "Student 1", "email": "stud1@email.com", "fs_uniquifier": "stud1_unique_identifier"},
        {"name": "Student 2", "email": "stud2@email.com", "fs_uniquifier": "stud2_unique_identifier"},
        {"name": "Student 3", "email": "stud3@email.com", "fs_uniquifier": "stud3_unique_identifier"}
    ]

    for member_data in members:
        if not db.session.query(User).filter_by(email=member_data["email"]).first():
            student = User(
                name=member_data["name"],
                email=member_data["email"],
                password=generate_password_hash("pass123"),
                active=True,
                fs_uniquifier=member_data["fs_uniquifier"]
            )
            db.session.add(student)
            db.session.commit()
            # Associate member with the member role
            db.session.add(RolesUsers(user_id=student.id, role_id=role_member.id))
    db.session.commit()

    # Create Service Requests
    user1 = db.session.query(User).filter_by(email="stud1@email.com").first()
    freelancer1 = db.session.query(Freelancer).filter_by(email="freelancer1@email.com").first()
    freelancer2 = db.session.query(Freelancer).filter_by(email="freelancer2@email.com").first()

    if user1 and freelancer1:
        service_request1 = ServiceRequest(user_id=user1.id, freelancer_id=freelancer1.id, status="pending")
        db.session.add(service_request1)

    if user1 and freelancer2:
        service_request2 = ServiceRequest(user_id=user1.id, freelancer_id=freelancer2.id, status="pending")
        db.session.add(service_request2)

    db.session.commit()
