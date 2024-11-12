# from smtplib import SMTP
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText

# SMTP_HOST = "localhost"
# SMTP_PORT = 1025
# SENDER_EMAIL = 'donot-reply@bookquest.project'
# SENDER_PASSWORD = ''

# def send_message(to, subject, content_body):
#     msg = MIMEMultipart()
#     msg["To"] = to
#     msg["Subject"] = subject
#     msg["From"] = SENDER_EMAIL
#     msg.attach(MIMEText(content_body, 'html'))
    
#     with SMTP(host=SMTP_HOST, port=SMTP_PORT) as client:
#         client.send_message(msg)


from smtplib import SMTP

def send_message(to_email, subject, body):
    SMTP_HOST = 'smtp.gmail.com'
    SMTP_PORT = 587
    USERNAME = 'your_email@gmail.com'
    PASSWORD = 'your_password'  # Or an app-specific password

    with SMTP(SMTP_HOST, SMTP_PORT) as client:
        client.starttls()  # Upgrade the connection to a secure one
        client.login(USERNAME, PASSWORD)  # Login with credentials
        msg = f"Subject: {subject}\n\n{body}"
        client.sendmail(USERNAME, to_email, msg)  # Send the email
        print("Email sent!")
