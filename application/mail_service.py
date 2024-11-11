# Imports
from flask import Flask, jsonify, request
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from application.models import ServiceRequest, Freelancer  # Adjust as per your models
from datetime import datetime

app = Flask(__name__)

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'donot-reply@bookquest.project'
SENDER_PASSWORD = ''

def send_message(to, subject, content_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))
    with SMTP(host=SMTP_HOST, port=SMTP_PORT) as client:
        client.send_message(msg)


