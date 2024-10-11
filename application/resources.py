import base64
import random
from datetime import datetime
from io import BytesIO
import matplotlib

from application.instances import cache

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from flask import request, jsonify
from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import current_user, auth_required, roles_required
from sqlalchemy import text
from werkzeug.utils import secure_filename

from application.models import db


api = Api(prefix='/api')

user = {
    'id': fields.Integer,
    'name': fields.String,
    'email': fields.String
}
review = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'book_id': fields.Integer,
    'feedback': fields.String,
    'user': fields.Nested(user),
}

