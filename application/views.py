from datetime import datetime
from flask import current_app as app, session
from flask import current_app as app, jsonify, request, render_template, send_file
from flask.json import dump
from flask_security import auth_required, roles_required
from sqlalchemy import or_
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
from .models import User, db, Freelancer,Admin,ServiceRequest
from .sec import datastore

# from .sec import datastore

@app.get('/')
def index():
    return render_template('index.html')


@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "Email not provided"}), 400

    user = datastore.find_user(email=email)

    # if "member" not in user.roles:
    #     return jsonify({"message": "User Not a Member"}), 404

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email})
    else:
        return jsonify({"message": "Wrong Password"}), 400

@app.post('/user-register')
def user_register():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    if not email:
        return jsonify({"message": "email not provided"}), 400

    if not name:
        return jsonify({"message": "name not provided"}), 400

    if not password:
        return jsonify({"message": "password not provided"}), 400

    user_exists = User.query.filter_by(email=email).count()
    if user_exists:
        return jsonify({"message": "Email already taken, use another email"}), 401

    # Create user and add to the database
    user = datastore.create_user(
        email=email, name=name, password=generate_password_hash(password),
        active=True, roles=["member"]
    )

    db.session.add(user)
    db.session.commit()

    # Return user details with token
    return jsonify({
        "token": user.get_auth_token(),
        "email": user.email,
        "user_id": user.id
    }), 201

@app.post('/freelancer-register')
def freelancer_register():
    data = request.get_json()
    app.logger.debug(f"Received data: {data}")

    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    experience = data.get('experience', '')
    portfolio_url = data.get('portfolio_url', '')

    if not email or not name or not password or not experience:
        return jsonify({"message": "All fields are required"}), 400

    freelancer_exists = Freelancer.query.filter_by(email=email).first()
    if freelancer_exists:
        return jsonify({"message": "Email already taken, use another email"}), 401

    freelancer = Freelancer(
        email=email,
        name=name,
        password=generate_password_hash(password),
        experience=experience,
        portfolio_url=portfolio_url,
        active=True,
        fs_uniquifier=email
    )

    db.session.add(freelancer)

    try:
        db.session.commit()
        return jsonify({"email": freelancer.email, "role": "freelancer"}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error during registration: {str(e)}")
        return jsonify({"message": "Error occurred during registration"}), 400



def find_user(email):
    return Freelancer.query.filter_by(email=email).first()
@app.post('/freelancer-login')
def freelancer_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')  # Get the password from the request

    if not email or not password:
        return jsonify({"message": "Email or password not provided"}), 400

    # Fetch freelancer from the datastore
    freelancer = find_user(email=email)

    if not freelancer:
        return jsonify({"message": "Freelancer Not Found"}), 404

    # Check if the freelancer's account is active
    if not freelancer.active:
        return jsonify({"message": "Account is not active"}), 403

    # Verify the password
    if check_password_hash(freelancer.password, password):
        return jsonify({
            "email": freelancer.email,
            "freelancerId": freelancer.fs_uniquifier,
            "name": freelancer.name,
            "experience": freelancer.experience,
            "portfolioUrl": freelancer.portfolio_url,
            "role": "freelancer"
        }), 200
    else:
        return jsonify({"message": "Incorrect Password"}), 400



def find_admin(email):
    return Admin.query.filter_by(email=email).first()

# Admin login route
@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')  # Get the password from the request

    # Validate email and password
    if not email or not password:
        return jsonify({"message": "Email or password not provided"}), 400

    # Fetch admin from the datastore
    admin = find_admin(email=email)

    # If admin is not found
    if not admin:
        return jsonify({"message": "Admin not found"}), 404

    # Check if the admin's account is active
    if not admin.active:
        return jsonify({"message": "Account is not active"}), 403

    # Verify if the user has the 'admin' role
    # if not any(role.name.lower() == 'admin' for role in admin.roles):
    #     return jsonify({"message": "User is not an admin"}), 403

    # Verify the password
    if check_password_hash(admin.password, password):
        return jsonify({
            "email": admin.email,
            "adminId": admin.id,
            "name": admin.name,
            # "role": "admin"
        }), 200
    
    else:
        return jsonify({"message": "Incorrect password"}), 400


@app.post('/update_freelancer')
def update_freelancer():
    data = request.get_json()
    app.logger.debug(f"Received data for update: {data}")

    freelancer_id = data.get('freelancerId')
    name = data.get('name')
    email = data.get('email')
    experience = data.get('experience')
    portfolio_url = data.get('portfolio_url')

    freelancer = Freelancer.query.filter_by(fs_uniquifier=freelancer_id).first()

    if not freelancer:
        return jsonify({"message": "Freelancer not found"}), 404

    if not name or not email:
        return jsonify({"message": "Name and email are required fields"}), 400

    freelancer.name = name
    freelancer.email = email
    freelancer.experience = experience
    freelancer.portfolio_url = portfolio_url

    try:
        db.session.commit()
        return jsonify({
            "message": "Freelancer profile updated successfully",
            "name": freelancer.name,
            "experience": freelancer.experience,
            "portfolio_url": freelancer.portfolio_url
        }), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating freelancer: {str(e)}")
        return jsonify({"message": "Error occurred during update"}), 400
    
@app.route('/api/request-service', methods=['POST'])
def request_service():
    data = request.get_json()
    print("Incoming request data:", data)  

    user_id = data.get('user_id')
    freelancer_id = data.get('freelancer_id')  

    if user_id is None:
        return jsonify({'error': 'User ID is required'}), 400
    if freelancer_id is None:
        return jsonify({'error': 'Freelancer ID is required'}), 400  

    try:
        new_request = ServiceRequest(
            user_id=user_id,
            freelancer_id=freelancer_id,
            status='pending',
            request_date=datetime.now()
        )
        db.session.add(new_request)
        db.session.commit()
        
        return jsonify({'message': 'Service request created successfully'}), 201
    except Exception as e:
        print("Error creating service request:", e)  # Log any error that occurs
        return jsonify({'error': 'An error occurred while creating the service request'}), 500


@app.route('/api/request-service/<int:request_id>', methods=['PUT'])
def update_service_request(request_id):
    data = request.get_json()
    status = data.get('status')

    if status not in ['accepted', 'rejected']:
        return jsonify({'error': 'Invalid status'}), 400

    service_request = ServiceRequest.query.get_or_404(request_id)
    service_request.status = status
    db.session.commit()

    return jsonify({
        'message': 'Service request status updated',
        'service_request_id': service_request.id,
        'status': service_request.status
    }), 200



@app.route('/api/service-requests/freelancer/<string:uniquifier>', methods=['GET'])
def get_freelancer_service_requests(uniquifier):
    print(uniquifier)
    # freelancer = Freelancer.query.filter_by(fs_uniquifier=uniquifier).first()
    print(f"Uniquifier received: {uniquifier}")  # Debug line
    freelancer = Freelancer.query.filter_by(fs_uniquifier=uniquifier).first()
    print(f"Freelancer found: {freelancer}")  # Debug line

    if freelancer is None:
        return jsonify({'error': 'Freelancer not found'}), 404

    requests = ServiceRequest.query.filter_by(freelancer_id=freelancer.id).all()

    response = []
    for req in requests:
        user = User.query.get(req.user_id)  # Fetch the user who made the request
        if user:
            user_data = {
                'user_id': user.id,
                'user_name': user.name,  # Assuming 'name' exists in the User model
                'user_email': user.email,  # Assuming 'email' exists in the User model
            }
        else:
            user_data = {}

        response.append({
            'request_id': req.id,
            'status': req.status,
            'created_at': req.request_date,
            'user': user_data  # Add user details to the response
        })

    return jsonify(response), 200
