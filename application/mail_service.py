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


from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from smtplib import SMTP

# def send_message(to_email, subject, body):
#     SMTP_HOST = 'smtp.gmail.com'
#     SMTP_PORT = 587
#     USERNAME = 'mayurkawale4321@gmail.com'
#     PASSWORD = 'sjfz uzht dtsl lxkb' 

#     with SMTP(SMTP_HOST, SMTP_PORT) as client:
#         client.starttls() 
#         client.login(USERNAME, PASSWORD)  
#         msg = f"Subject: {subject}\n\n{body}"
#         client.sendmail(USERNAME, to_email, msg)
#         print("Email sent!")


def send_message(to_email, subject, body):
    SMTP_HOST = 'smtp.gmail.com'
    SMTP_PORT = 587
    USERNAME = 'mayurkawale4321@gmail.com'
    PASSWORD = 'sjfz uzht dtsl lxkb'
    
    # Create the email message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = USERNAME
    msg['To'] = to_email
    
    # Attach HTML content
    html_part = MIMEText(body, 'html')
    msg.attach(html_part)
    
    try:
        with SMTP(SMTP_HOST, SMTP_PORT) as client:
            client.starttls()
            client.login(USERNAME, PASSWORD)
            client.send_message(msg)
            print(f"Email sent successfully to {to_email}!")
            
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        raise e
