from datetime import datetime
from flask import current_app as app, session
from flask import current_app as app, jsonify, request, render_template, send_file
from flask.json import dump
from flask_security import auth_required, roles_required
from sqlalchemy import or_
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
from .models import User, db, Professional,Admin,ServiceRequest,Feedback,Service
from .sec import datastore
from flask_cors import CORS
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from .mail_service import send_message
from flask import render_template_string
from datetime import timedelta

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
            "token": user.get_auth_token(),
            "email": user.email,
            "userId":user.fs_uniquifier,
            "name": user.name,
            "role": "User"
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
        "userId": user.fs_uniquifier,
        "role": "User"
    }), 201

@app.post('/professional-register')
def professional_register():
    data = request.get_json()
    app.logger.debug(f"Received data: {data}")

    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    experience = data.get('experience', '')
    location= data.get('location', '')
    portfolio_url = data.get('portfolio_url', '')
    service_name = data.get('service', '')
    service_price = data.get('service_price', 0)

    try:
        service_price = int(service_price)
    except ValueError:
        return jsonify({"message": "Service price must be a valid number."}), 400

    if not email or not name or not password or not experience:
        return jsonify({"message": "All fields are required"}), 400
    
    if portfolio_url and not portfolio_url.startswith('https://'):
        portfolio_url = 'https://' + portfolio_url

    service = Service.query.filter_by(name=service_name).first()
    if not service:
        return jsonify({"message": f"Service '{service_name}' does not exist."}), 404
    if service_price < service.base_price:
        return jsonify({
            "message": f"The minimum price for the '{service_name}' service is {service.base_price}. Please set a price greater than or equal to the minimum price."
        }), 400

    professional_exists = Professional.query.filter_by(email=email).first()
    if professional_exists:
        return jsonify({"message": "Email already taken, use another email"}), 401

    professional = Professional(
        email=email,
        name=name,
        password=generate_password_hash(password),
        experience=experience,
        portfolio_url=portfolio_url,
        location=location,
        service=service_name,
        service_price=service_price,
        active=True,
        is_approved=0,
        fs_uniquifier=email
    )

    db.session.add(professional)

    try:
        db.session.commit()
        return jsonify({
            # "token": professional.get_auth_token(),
            "professionalId": professional.fs_uniquifier,
            "name": professional.name,
            "email": professional.email, 
            "location": professional.location,
            "service": professional.service,
            "service_price": professional.service_price,
            "experience": professional.experience,
            "portfolioUrl": professional.portfolio_url,
            "role": "Professional"
        }), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error during registration: {str(e)}")
        return jsonify({"message": "Error occurred during registration"}), 400



def find_user(email):
    return Professional.query.filter_by(email=email).first()
@app.post('/professional-login')
def professional_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')  # Get the password from the request

    if not email or not password:
        return jsonify({"message": "Email or password not provided"}), 400

    # Fetch professional from the datastore
    professional = find_user(email=email)

    if not professional:
        return jsonify({"message": "Professional Not Found"}), 404

    if professional.is_approved == 0:
        return jsonify({
            "message": "Your account is pending admin approval. Please wait.",
            "is_approved": professional.is_approved
        }), 403
    elif professional.is_approved == -1:
        return jsonify({
            "message": "Your account was rejected by the admin. Please register a new account.",
            "is_approved": professional.is_approved
        }), 403
    
    # Check if the professional's account is active
    if not professional.active:
        return jsonify({"message": "Account is not active"}), 403
    
    if not professional.active:
        return jsonify({"message": "Account is not active"}), 403


    # Verify the password
    if check_password_hash(professional.password, password):
        return jsonify({
            "token": professional.get_auth_token(),
            "email": professional.email,
            "professionalId": professional.fs_uniquifier,
            "name": professional.name,
            "service": professional.service,
            "service_price": professional.service_price,
            "experience": professional.experience,
            "portfolioUrl": professional.portfolio_url,
            "role": "Professional",
            "is_approved": professional.is_approved
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
            "token": admin.get_auth_token(),
            "email": admin.email,
            "adminId": admin.id,
            "name": admin.name,
            "role": "Admin"
        }), 200
    else:
        return jsonify({"message": "Incorrect password"}), 400


@app.post('/update_professional')
def update_professional():
    data = request.get_json()
    app.logger.debug(f"Received data for update: {data}")

    professional_id = data.get('professionalId')
    name = data.get('name')
    email = data.get('email')
    experience = data.get('experience')
    service = data.get('service')
    service_price = data.get('service_price')
    portfolio_url = data.get('portfolio_url')

    professional = Professional.query.filter_by(fs_uniquifier=professional_id).first()

    if not professional:
        return jsonify({"message": "Professional not found"}), 404

    if not name or not email:
        return jsonify({"message": "Name and email are required fields"}), 400

    professional.name = name
    professional.email = email
    professional.service = service
    professional.service_price = service_price
    professional.experience = experience
    professional.portfolio_url = portfolio_url

    try:
        db.session.commit()
        return jsonify({
            "message": "Professional profile updated successfully",
            "name": professional.name,
            "service": professional.service,
            "service_price": professional.service_price,
            "experience": professional.experience,
            "portfolio_url": professional.portfolio_url
        }), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating professional: {str(e)}")
        return jsonify({"message": "Error occurred during update"}), 400
    
@app.route('/update_professional_by_admin', methods=['POST'])
def update_professional_by_admin():
    data = request.get_json()
    app.logger.debug(f"Received data for update: {data}")

    professional_id = data.get('professionalId')
    service = data.get('service')

    professional = Professional.query.filter_by(fs_uniquifier=professional_id).first()

    if not professional:
        return jsonify({"message": "Professional not found"}), 404

    professional.service = service

    try:
        db.session.commit()
        return jsonify({
            "message": "Professional profile updated successfully",
            "service": professional.service
        }), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating professional: {str(e)}")
        return jsonify({"message": "Error occurred during update"}), 400


@app.route('/api/request-service', methods=['POST'])
def request_service():
    data = request.get_json()
    user_id = data.get('userId')  # Ensure this matches the incoming request
    professional_id = data.get('professional_id')
    service_date = data.get('service_date')

    if not all([user_id, professional_id, service_date]):
        return jsonify({'error': 'All fields are required'}), 400
    try:
        # Convert date string to datetime
        service_date_parsed = datetime.strptime(service_date, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({'error': 'Invalid service date format. Expected format is YYYY-MM-DDTHH:MM'}), 400
    
    time_buffer = timedelta(minutes=30)

    # Check for conflicting requests
    conflicting_request = ServiceRequest.query.filter(
        ServiceRequest.professional_id == professional_id,
        ServiceRequest.status == "accepted",
        ServiceRequest.service_date.between(
            service_date_parsed - time_buffer, 
            service_date_parsed + time_buffer
        )
    ).first()

    if conflicting_request:
        return jsonify({"error": "Professional is busy during this time. Please choose another time."}), 409


    # Fetch full user details
    user = User.query.filter_by(fs_uniquifier=user_id).first()  # Adjusted to match your identifier
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        # Create a new service request
        new_request = ServiceRequest(
            user_id=user.id,
            professional_id=professional_id,
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
                'professional_id': new_request.professional_id,
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

    if status not in ['accepted', 'rejected','completed']:
        return jsonify({'error': 'Invalid status'}), 400

    service_request = ServiceRequest.query.get_or_404(request_id)
    service_request.status = status
    db.session.commit()

    return jsonify({
        'message': 'Service request status updated',
        'service_request_id': service_request.id,
        'status': service_request.status
    }), 200

@app.route('/api/request-service-by-user/<int:request_id>', methods=['PUT'])
def update_service_request_by_user(request_id):
    data = request.get_json()
    service_date = data.get('service_date')

    if not service_date:
        return jsonify({'error': 'Service date is required'}), 400

    # Fetch the service request by ID
    service_request = ServiceRequest.query.get_or_404(request_id)
    
    # Check if the service request is in 'pending' status
    if service_request.status != 'pending':
        return jsonify({'error': 'Service date can only be updated for pending requests'}), 400

    try:
        # Parse the service date and update
        service_request.service_date = datetime.strptime(service_date, '%Y-%m-%dT%H:%M')
        db.session.commit()

        return jsonify({
            'message': 'Service request updated successfully',
            'service_request_id': service_request.id,
            'service_date': service_request.service_date.isoformat()
        }), 200

    except ValueError:
        return jsonify({'error': 'Invalid service date format. Expected format is YYYY-MM-DDTHH:MM'}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An error occurred while updating the service request'}), 500



@app.route('/api/service-requests/professional/<string:uniquifier>', methods=['GET'])
def get_professional_service_requests(uniquifier):
    print(f"Uniquifier received: {uniquifier}")  
    professional = Professional.query.filter_by(fs_uniquifier=uniquifier).first()
    print(f"Professional found: {professional}")  

    if professional is None:
        return jsonify({'error': 'Professional not found'}), 404

    requests = ServiceRequest.query.filter_by(professional_id=professional.id).all()

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
        'professional_id': req.professional_id,
        'professional_name': Professional.query.get(req.professional_id).name,
        'service_date': req.service_date.isoformat(),
        'status': req.status,
        'request_date': req.request_date.isoformat(),
        'is_completed': req.is_completed
    } for req in requests]), 200



from sqlalchemy import and_
@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    user_id = data.get('userId')
    professional_id = data.get('professionalId')
    print(f"Professional ID after feedback submission: {professional_id}")
    print(f"User IDafter feedback submission : {user_id}")
    rating = data.get('rating')
    comments = data.get('comments')
    service_date = data.get('service_date')
    service_date = datetime.strptime(service_date, '%Y-%m-%dT%H:%M:%S') 
    print(f"Service date after feedback submission: {service_date}")
    user = User.query.filter_by(fs_uniquifier=user_id).first() 

    if not all([user_id, professional_id, rating]):
        return jsonify({'error': 'User ID, Professional ID, and rating are required'}), 400

    new_feedback = Feedback(
        user_id=user.id,
        professional_id=professional_id,
        rating=rating,
        comments=comments
    )
    
    db.session.add(new_feedback)


    print(f"User ID: {user.id}, Professional ID: {professional_id}, Service Date: {service_date}")

    service_request = ServiceRequest.query.filter(
        and_(
            ServiceRequest.user_id == user.id,
            ServiceRequest.professional_id == professional_id,
            ServiceRequest.service_date.between(service_date - timedelta(minutes=1), service_date + timedelta(minutes=1))
        )
    ).first()

    print(f"Service request found: {service_request}")

    if not service_request:
        return jsonify({'error': 'No matching service request found for the given details'}), 404

    service_request.is_completed = True
    db.session.commit()

    db.session.commit()

    # Fetch the professional and update their average rating
    professional = Professional.query.get(professional_id)
    if professional:
        professional.update_rating()  # Call the method to update the average rating

    return jsonify({
        'message': 'Feedback submitted successfully',
        'feedback_id': new_feedback.id
    }), 201


from flask import send_file
import matplotlib.pyplot as plt
import io
import base64
from matplotlib.figure import Figure
import json

# Modified route to return both data and chart for top professionals
@app.route('/api/top-rated-professionals', methods=['GET'])
def top_rated_professionals():
    # Get data from database
    top_professionals = (
        db.session.query(Professional)
        .filter(Professional.is_approved == 1)
        .order_by(Professional.rating.desc())
        .limit(5)
        .all()
    )
    
    # Prepare data
    names = [p.name for p in top_professionals]
    ratings = [p.rating for p in top_professionals]
    
    # Create the chart
    fig = Figure(figsize=(10, 6))
    ax = fig.add_subplot(111)
    ax.bar(names, ratings, color='skyblue')
    ax.set_title('Top 5 Rated Professionals')
    ax.set_ylabel('Rating')
    plt.xticks(rotation=45)
    
    # Save chart to bytes
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    chart_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    # Prepare response data
    response_data = {
        'chart': chart_data,
        'data': [{'name': p.name, 'rating': p.rating} for p in top_professionals]
    }
    
    return jsonify(response_data)

# Modified route for most booked services
@app.route('/api/most-booked-services', methods=['GET'])
def most_booked_services():
    # Get data from database
    most_booked = (
        db.session.query(Professional.service, func.count(ServiceRequest.id).label("service_count"))
        .join(ServiceRequest, ServiceRequest.professional_id == Professional.id)
        .group_by(Professional.service)
        .order_by(func.count(ServiceRequest.id).desc())
        .limit(5)
        .all()
    )
    
    # Prepare data
    services = [service for service, _ in most_booked]
    counts = [count for _, count in most_booked]
    
    # Create pie chart
    fig = Figure(figsize=(10, 10))
    ax = fig.add_subplot(111)
    ax.pie(counts, labels=services, autopct='%1.1f%%')
    ax.set_title('Most Booked Services')
    
    # Save chart to bytes
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    chart_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    # Prepare response data
    response_data = {
        'chart': chart_data,
        'data': [{'service': service, 'count': count} for service, count in most_booked]
    }
    
    return jsonify(response_data)

@app.route('/api/user-professional-counts', methods=['GET']) 
def user_professional_counts():     
    user_count = db.session.query(func.count(User.id)).scalar()     
    professional_count = db.session.query(func.count(Professional.id)).scalar()     
    return jsonify({'user_count': user_count, 'professional_count': professional_count})


import csv
from flask import Response
from datetime import datetime



@app.route('/api/export-completed-services', methods=['GET'])
def export_completed_services():
    completed_requests = db.session.query(
        ServiceRequest, User, Professional, Feedback
    ).join(User, User.id == ServiceRequest.user_id) \
     .join(Professional, Professional.id == ServiceRequest.professional_id) \
     .join(Feedback, Feedback.professional_id == Professional.id) \
     .filter(ServiceRequest.is_completed == True) \
     .all()

    # Create a CSV response
    def generate_csv():
        # Write the CSV headers
        yield "Service Request ID,User Name,User Email,Professional Name,Professional Email,Service Type,Professional Location,Rating Given,Feedback,Service Date\n"
        
        # Write the data rows
        for service_request, user, professional, feedback in completed_requests:
            yield f"{service_request.id},{user.name},{user.email},{professional.name},{professional.email},{professional.service},{professional.location},{feedback.rating},{feedback.comments},{service_request.service_date.strftime('%Y-%m-%d %H:%M:%S')}\n"

    return Response(generate_csv(), mimetype='text/csv', headers={"Content-Disposition": "attachment;filename=completed_services.csv"})


@app.route("/api/send_reminder/<string:professional_id>", methods=["POST"])
def send_reminder(professional_id):
    professional = Professional.query.filter_by(email=professional_id).first()  
    if professional:
        pending_requests = ServiceRequest.query.filter_by(professional_id=professional.id, status="pending").count()
        approved_requests = ServiceRequest.query.filter_by(professional_id=professional.id, status="accepted").count()
        completed_requests = ServiceRequest.query.filter_by(professional_id=professional.id, status="completed").count()

        print(f"Professional: {professional.name}")
        print(f"Pending requests: {pending_requests}")
        print(f"Approved requests: {approved_requests}")
        print(f"Completed requests: {completed_requests}")

        email_content = render_template_string(
            open('email/daily_reminder.html').read(),  
            name=professional.name, 
            rating=professional.rating,
            pending=pending_requests,
            approved=approved_requests,
            completed=completed_requests
        )
        send_message(professional.email, "Your Daily Reminder", email_content)


        # Return the response with the counts
        return jsonify({
            "message": "Reminder sent successfully",
            "Rating": professional.rating,
            "pending_requests": pending_requests,
            "approved_requests": approved_requests,
            "completed_requests": completed_requests
        }), 200

    return jsonify({"error": "Professional not found"}), 404


@app.route("/api/user_dashboard/<string:user_id>", methods=["GET"])
def get_user_dashboard(user_id):
    # Query the User by the passed user_id (now treated as a string)
    user = User.query.filter_by(email=user_id).first()  # Use user_id for matching
    if user:
        # Query ServiceRequest table for this user's pending, accepted, and completed requests
        pending_requests = ServiceRequest.query.filter_by(user_id=user.id, status="pending").count()
        accepted_requests = ServiceRequest.query.filter_by(user_id=user.id, status="accepted").count()
        completed_requests = ServiceRequest.query.filter_by(user_id=user.id, status="completed").count()

        # Query Feedback table for all feedback given by this user
        feedbacks = Feedback.query.filter_by(user_id=user.id).all()
        feedback_list = [
            {
                "professional_id": feedback.professional_id,
                "comments": feedback.comments,
                "created_at": feedback.created_at
            }
            for feedback in feedbacks
        ]

        email_content = render_template_string(
            open('email/monthly_remainder_user.html').read(),  
            name=user.name, 
            pending=pending_requests,
            approved=accepted_requests,
            completed=completed_requests,
            feedbacks=feedback_list
        )
        send_message(user.email, "Your Daily Reminder", email_content)
        
        # Print the counts and feedback for testing (optional)
        print(f"User: {user.name}")
        print(f"Pending requests: {pending_requests}")
        print(f"Accepted requests: {accepted_requests}")
        print(f"Completed requests: {completed_requests}")
        print(f"Feedbacks: {feedback_list}")

        # Return the response with the counts and feedbacks
        return jsonify({
            "message": "User dashboard data retrieved successfully",
            "pending_requests": pending_requests,
            "accepted_requests": accepted_requests,
            "completed_requests": completed_requests,
            "feedbacks": feedback_list  # Return all feedbacks given by the user
        }), 200

    return jsonify({"error": "User not found"}), 404



@app.route('/admin/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    services_data = [
        {
            "id": service.id,
            "name": service.name,
            "base_price": service.base_price,
            "description": service.description,
            "numProfessionals": service.num_professionals
        }
        for service in services
    ]
    return jsonify({"services": services_data})

@app.route('/admin/services', methods=['POST'])
def add_service():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Service name is required"}), 400

    service_name = data['name']
    base_price = data.get('base_price', 0)
    description = data.get('description', '')

    # Count the number of professionals offering this service
    professional_count = Professional.query.filter_by(service=service_name).count()

    # Add the service to the Service table
    new_service = Service(
        name=service_name,
        base_price=base_price,
        description=description,
        num_professionals=professional_count
    )
    db.session.add(new_service)
    db.session.commit()

    return jsonify({"success": True, "message": "Service added successfully"})


@app.route('/admin/services/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    data = request.json
    service = Service.query.get(service_id)
    
    if not service:
        return jsonify({"error": "Service not found"}), 404

    # Update the service name
    if 'name' in data:
        service.name = data['name']

    if 'base_price' in data:
        service.base_price = data['base_price']

    # Update the number of professionals based on the updated service name
    professional_count = Professional.query.filter_by(service=service.name).count()
    service.num_professionals = professional_count
    
    db.session.commit()

    return jsonify({"success": True, "message": "Service updated successfully"})


@app.route('/admin/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    service = Service.query.get(service_id)
    
    if not service:
        return jsonify({"error": "Service not found"}), 404
    
    db.session.delete(service)
    db.session.commit()
    
    return jsonify({"success": True, "message": "Service deleted successfully"})



@app.route('/api/professional/analytics/<string:professional_email>', methods=['GET'])
def get_professional_analytics(professional_email):
    try:
        # Fetch the professional by email
        professional = Professional.query.filter_by(email=professional_email).first()

        if not professional:
            return jsonify({"error": "Professional not found"}), 404

        # Fetch service request counts
        pending_requests = ServiceRequest.query.filter_by(professional_id=professional.id, status="pending").count()
        accepted_requests = ServiceRequest.query.filter_by(professional_id=professional.id, status="accepted").count()
        rejected_requests = ServiceRequest.query.filter_by(professional_id=professional.id, status="rejected").count()
        completed_requests = ServiceRequest.query.filter_by(professional_id=professional.id, is_completed=True).count()

        # Fetch feedback and calculate average rating
        feedbacks = Feedback.query.filter_by(professional_id=professional.id).all()
        feedback_list = [
            {
                "user_id": feedback.user_id,
                "rating": feedback.rating,
                "comments": feedback.comments,
                "created_at": feedback.created_at
            }
            for feedback in feedbacks
        ]
        analytics = {
            "professional_name": professional.name,
            # "rating": round(average_rating, 2),
            "total_requests": pending_requests + accepted_requests + completed_requests+rejected_requests,
            "pending_requests": pending_requests,
            "accepted_requests": accepted_requests,
            "rejected_requests": rejected_requests,
            "completed_requests": completed_requests,
            "feedbacks": feedback_list,
        }

        print(f"Analytics for {professional.name}:")
        print(f"Pending requests: {pending_requests}")
        print(f"Accepted requests: {accepted_requests}")
        print(f"Rejected requests: {rejected_requests}")
        print(f"Completed requests: {completed_requests}")
        # print(f"Average rating: {average_rating}")

        return jsonify(analytics), 200

    except Exception as e:
        # Handle unexpected errors
        print(f"Error fetching analytics: {e}")
        return jsonify({"error": str(e)}), 500





@app.route('/api/locations', methods=['GET'])
def get_locations():
    locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata","Nagpur"]
    return jsonify({"locations": locations})


@app.route('/api/services', methods=['GET'])
def get_services_by_user():
    try:
        services = Service.query.all()
        return jsonify({
            'services': [{'id': service.id, 'name': service.name, 'num_professionals': service.num_professionals} 
                        for service in services]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/admin/feedbacks', methods=['GET'])
def get_feedbacks():
    feedbacks = Feedback.query.all()
    feedback_data = []
    
    for feedback in feedbacks:
        feedback_data.append({
            "id": feedback.id,
            "user": feedback.user.name if feedback.user else "Unknown User",
            "professional": feedback.professional.name if feedback.professional else "Unknown Professional",
            "service": feedback.professional.service if feedback.professional else "Unknown Service",
            "service_date": feedback.created_at.strftime('%Y-%m-%d'),
            "rating": feedback.rating,
            "comments": feedback.comments
        })
    
    return jsonify({"feedbacks": feedback_data})