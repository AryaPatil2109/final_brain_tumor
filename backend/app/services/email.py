import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from backend.app.config import (
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    FRONTEND_URL,
)

logger = logging.getLogger(__name__)

def send_reset_email(to_email: str, token: str) -> bool:
    """
    Send a password reset email using SMTP.
    """
    # Verify if SMTP is configured
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        logger.warning(
            "SMTP credentials not configured. Cannot send email. "
            "Simulated reset token: %s", token
        )
        return False

    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Reset Your Password - NeuroScan AI"
    message["From"] = SMTP_USERNAME
    message["To"] = to_email

    # HTML Body with a beautiful premium dark theme styling matching NeuroScan AI!
    html = f"""
    <html>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #061624; color: #fff; padding: 2rem; margin: 0;">
        <div style="max-width: 550px; margin: 0 auto; background-color: #0a1929; border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 2.5rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h1 style="color: #00d4ff; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; margin: 0;">NeuroScan AI</h1>
            <p style="color: rgba(160, 200, 240, 0.6); font-size: 0.875rem; margin-top: 0.25rem; margin-bottom: 0;">Advanced Brain Tumor Diagnostics</p>
          </div>
          
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-top: 0; margin-bottom: 1rem; text-align: center;">Reset Your Password</h2>
          
          <p style="color: rgba(160, 200, 240, 0.85); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 2rem; text-align: center;">
            You requested a password reset for your NeuroScan AI account. Click the button below to set a new password. This link is valid for 15 minutes.
          </p>
          
          <div style="text-align: center; margin-bottom: 2rem;">
            <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #00d4ff 0%, #090979 100%); color: #fff; text-decoration: none; padding: 0.875rem 2rem; border-radius: 8px; font-weight: 600; font-size: 0.9375rem; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3); border: none;">
              Reset Password
            </a>
          </div>
          
          <p style="color: rgba(160, 200, 240, 0.5); font-size: 0.8125rem; line-height: 1.5; margin-bottom: 0; text-align: center;">
            If you did not request this, you can safely ignore this email. Your password will remain unchanged.
          </p>
          
          <hr style="border: 0; border-top: 1px solid rgba(0, 212, 255, 0.1); margin: 2rem 0;">
          
          <p style="color: rgba(160, 200, 240, 0.4); font-size: 0.75rem; line-height: 1.4; word-break: break-all; text-align: center; margin: 0;">
            If the button doesn't work, copy and paste this URL into your browser:<br>
            <a href="{reset_link}" style="color: #00d4ff; text-decoration: none;">{reset_link}</a>
          </p>
        </div>
      </body>
    </html>
    """

    part = MIMEText(html, "html")
    message.attach(part)

    try:
        # Use TLS connection for port 587
        if SMTP_PORT == 587:
            server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
            server.starttls()
        else:
            # Use SSL connection for port 465
            server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10)
            
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_USERNAME, to_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        logger.error("Failed to send SMTP email: %s", e)
        return False
