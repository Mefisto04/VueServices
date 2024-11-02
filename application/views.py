from datetime import datetime
from flask import current_app as app, session
from flask import current_app as app, jsonify, request, render_template, send_file
from flask.json import dump
from flask_security import auth_required, roles_required
from sqlalchemy import or_
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
from .models import User, db, Freelancer,Admin,ServiceRequest,Feedback
from .sec import datastore
from flask_cors import CORS

CORS(app)
# from .sec import datastore

@app.get('/')
def index():
    return render_template('index.html')


def find_user(email):
    return User.query.filter_by(email=email).first()

@app.route('/user-login', methods=['POST'])
def user_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email or password not provided"}), 400

    # Fetch user from the database
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Verify the password
    if check_password_hash(user.password, password):
        return jsonify({
            "token": user.get_auth_token(),  # Replace with actual token generation
            "email": user.email,
            "userId":user.fs_uniquifier,
            "name": user.name
        }), 200
    else:
        return jsonify({"message": "Incorrect password"}), 400

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
        email=email, name=name, 
        password=generate_password_hash(password),
        active=True, roles=["member"],
        fs_uniquifier=email
    )

    db.session.add(user)
    db.session.commit()

    # Return user details with token
    return jsonify({
        "token": user.get_auth_token(),
        "email": user.email,
        "userId": user.fs_uniquifier
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
    service = data.get('service', '')

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
        service=service,
        active=True,
        is_approved=False,
        fs_uniquifier=email
    )

    db.session.add(freelancer)

    try:
        db.session.commit()
        return jsonify({
            "token": freelancer.get_auth_token(),
            "freelancerId": freelancer.fs_uniquifier,
            "name": freelancer.name,
            "email": freelancer.email, 
            "experience": freelancer.experience,
            "portfolioUrl": freelancer.portfolio_url,
            "role": "freelancer"
        }), 201
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
    # Log to check if this function is called
    print("Finding admin with email:", email)
    return Admin.query.filter_by(email=email).first()

# Admin login route
@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Log the received data
    print("Received email:", email)
    print("Received password:", password)

    if not email or not password:
        return jsonify({"message": "Email or password not provided"}), 400

    admin = find_admin(email=email)

    if not admin:
        return jsonify({"message": "Admin not found"}), 404

    if not admin.active:
        return jsonify({"message": "Account is not active"}), 403

    print("Stored hash:", admin.password)  # Log the hashed password from the database
    print("Provided password:", password)   # Log the provided password

    # Check password
    if check_password_hash(admin.password, password):
        return jsonify({
            "email": admin.email,
            "adminId": admin.id,
            "name": admin.name,
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
    user_id = data.get('userId')  # Ensure this matches the incoming request
    freelancer_id = data.get('freelancer_id')
    service_date = data.get('service_date')

    if not all([user_id, freelancer_id, service_date]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        # Convert date string to datetime
        service_date_parsed = datetime.strptime(service_date, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({'error': 'Invalid service date format. Expected format is YYYY-MM-DDTHH:MM'}), 400

    # Fetch full user details
    user = User.query.filter_by(fs_uniquifier=user_id).first()  # Adjusted to match your identifier
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        # Create a new service request
        new_request = ServiceRequest(
            user_id=user.id,
            freelancer_id=freelancer_id,
            status='pending',
            request_date=datetime.now(),
            service_date=service_date_parsed
        )
        db.session.add(new_request)
        db.session.commit()

        # Return the user details with the service request
        return jsonify({
            'message': 'Service request created successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                # Include additional user fields here
            },
            'service_request': {
                'id': new_request.id,
                'freelancer_id': new_request.freelancer_id,
                'service_date': new_request.service_date.isoformat(),
                'status': new_request.status
            }
        }), 201

    except Exception as e:
        db.session.rollback()
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
    print(f"Uniquifier received: {uniquifier}")  
    freelancer = Freelancer.query.filter_by(fs_uniquifier=uniquifier).first()
    print(f"Freelancer found: {freelancer}")  

    if freelancer is None:
        return jsonify({'error': 'Freelancer not found'}), 404

    requests = ServiceRequest.query.filter_by(freelancer_id=freelancer.id).all()

    response = []
    for req in requests:
        user = User.query.get(req.user_id)  # Adjusted to match your actual model's field
        user_data = {
            'user_id': user.id if user else None,
            'user_name': user.name if user else None, 
            'user_email': user.email if user else None,
        }

        response.append({
            'request_id': req.id,
            'status': req.status,
            'created_at': req.request_date,
            'service_date': req.service_date,
            'user': user_data  
        })

    return jsonify(response), 200


@app.route('/api/service-requests/<string:user_id>', methods=['GET'])
def get_service_requests(user_id):
    # Find the user by email (assuming email is used as user_id)
    user = User.query.filter_by(email=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    requests = ServiceRequest.query.filter_by(user_id=user.id).all()
    return jsonify([{
        'id': req.id,
        'freelancer_id': req.freelancer_id,
        'service_date': req.service_date.isoformat(),
        'status': req.status,
        'request_date': req.request_date.isoformat(),
    } for req in requests]), 200


@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    user_id = data.get('userId')
    freelancer_id = data.get('freelancerId')
    rating = data.get('rating')
    comments = data.get('comments')
    user = User.query.filter_by(fs_uniquifier=user_id).first() 

    if not all([user_id, freelancer_id, rating]):
        return jsonify({'error': 'User ID, Freelancer ID, and rating are required'}), 400

    new_feedback = Feedback(
        user_id=user.id,
        freelancer_id=freelancer_id,
        rating=rating,
        comments=comments
    )
    
    db.session.add(new_feedback)
    db.session.commit()

    # Fetch the freelancer and update their average rating
    freelancer = Freelancer.query.get(freelancer_id)
    if freelancer:
        freelancer.update_rating()  # Call the method to update the average rating

    return jsonify({
        'message': 'Feedback submitted successfully',
        'feedback_id': new_feedback.id
    }), 201

