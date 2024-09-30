# from main import app
# from application.sec import datastore
# from application.models import db, Role,User, Section, Freelancer  # Ensure Freelancer is imported
# from werkzeug.security import generate_password_hash

# with app.app_context():
#     # Create the database and tables
#     db.create_all()

#     # Create sample role
#     member_role = Role(name='member', description='User is a Member')

#     # Add role to the session
#     db.session.add(member_role)
#     db.session.commit()

#     # Create sample users
#     user1 = User(
#         name='John Doe',
#         email='john@example.com',
#         password='hashed_password1',  # Make sure to hash your passwords
#         active=True,
#         fav_book=1,
#         fs_uniquifier='unique_id_1'
#     )
    
#     user2 = User(
#         name='Jane Smith',
#         email='jane@example.com',
#         password='hashed_password2',
#         active=True,
#         fav_book=2,
#         fs_uniquifier='unique_id_2'
#     )

#     # Add users to the session
#     db.session.add(user1)
#     db.session.add(user2)
#     db.session.commit()

#     # Create sample freelancers
#     freelancer1 = Freelancer(
#         name='Alice Johnson',
#         email='alice@example.com',
#         password='hashed_password3',
#         experience='3 years of web development',
#         portfolio_url='http://portfolio-alice.com',
#         active=True,
#         fs_uniquifier='unique_id_3'
#     )

#     freelancer2 = Freelancer(
#         name='Bob Brown',
#         email='bob@example.com',
#         password='hashed_password4',
#         experience='5 years of graphic design',
#         portfolio_url='http://portfolio-bob.com',
#         active=True,
#         fs_uniquifier='unique_id_4'
#     )

#     # Add freelancers to the session
#     db.session.add(freelancer1)
#     db.session.add(freelancer2)
#     db.session.commit()

#     # Assign roles to users
#     user1.roles.append(member_role)
#     user2.roles.append(member_role)  # Both users are now members
    
#     # Commit the role assignments
#     db.session.commit()

#     print("Database setup complete with sample users and freelancers.")


from main import app
from application.models import db, Role, User, Freelancer, RolesUsers,Admin  # Import RolesUsers for associations
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

    # Create users and associate roles
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

    if not db.session.query(Freelancer).filter_by(email="freelancer1@email.com").first():
        freelancer1 = Freelancer(
            name="Freelancer One",
            email="freelancer1@email.com",
            password=generate_password_hash("pass123"),
            experience="5 years in web development",
            portfolio_url="https://portfolio-one.com",
            active=True,
            fs_uniquifier="freelancer1_unique_identifier"
        )
        db.session.add(freelancer1)
        db.session.commit()
        # Associate freelancer with the freelancer role
        db.session.add(RolesUsers(freelancer_id=freelancer1.id, role_id=role_freelancer.id))

    if not db.session.query(Freelancer).filter_by(email="freelancer2@email.com").first():
        freelancer2 = Freelancer(
            name="Freelancer Two",
            email="freelancer2@email.com",
            password=generate_password_hash("pass123"),
            experience="3 years in graphic design",
            portfolio_url="https://portfolio-two.com",
            active=True,
            fs_uniquifier="freelancer2_unique_identifier"
        )
        db.session.add(freelancer2)
        db.session.commit()
        # Associate freelancer with the freelancer role
        db.session.add(RolesUsers(freelancer_id=freelancer2.id, role_id=role_freelancer.id))

    db.session.commit()


    if not db.session.query(User).filter_by(email="stud1@email.com").first():
        student1 = User(
            name="Student 1",
            email="stud1@email.com",
            password=generate_password_hash("pass123"),
            active=True,
            fs_uniquifier="stud1_unique_identifier"
        )
        db.session.add(student1)
        db.session.commit()
        # Associate student1 with member role
        db.session.add(RolesUsers(user_id=student1.id, role_id=role_member.id))

    if not db.session.query(User).filter_by(email="stud2@email.com").first():
        student2 = User(
            name="Student 2",
            email="stud2@email.com",
            password=generate_password_hash("pass123"),
            active=True,
            fs_uniquifier="stud2_unique_identifier"
        )
        db.session.add(student2)
        db.session.commit()
        # Associate student2 with member role
        db.session.add(RolesUsers(user_id=student2.id, role_id=role_member.id))

    # Commit all associations
    db.session.commit()

