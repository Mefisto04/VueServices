from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from smtplib import SMTP

def send_message(to_email, subject, body):
    SMTP_HOST = 'smtp.gmail.com'
    SMTP_PORT = 587
    USERNAME = 'your email'
    PASSWORD = 'password'
    
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
