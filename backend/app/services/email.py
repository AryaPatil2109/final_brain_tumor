import logging
import json
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from backend.app.config import (
    FRONTEND_URL,
)
import os

logger = logging.getLogger(__name__)

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("SMTP_USERNAME", "noreply@neuroscan.ai")
SENDER_NAME = os.getenv("SENDER_NAME", "NeuroScan AI")


def send_reset_email(to_email: str, token: str) -> tuple[bool, str]:
    """
    Send a password reset email using Brevo (Sendinblue) HTTP API.
    Returns (success: bool, error_message: str).
    """
    if not BREVO_API_KEY:
        logger.warning(
            "BREVO_API_KEY not configured. Cannot send email. "
            "Simulated reset token: %s", token
        )
        return False, "BREVO_API_KEY is not configured on the server."

    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    # HTML Body with premium dark theme styling matching NeuroScan AI
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

    payload = json.dumps({
        "sender": {
            "name": SENDER_NAME,
            "email": SENDER_EMAIL,
        },
        "to": [
            {"email": to_email}
        ],
        "subject": "Reset Your Password - NeuroScan AI",
        "htmlContent": html,
    }).encode("utf-8")

    req = Request(
        "https://api.brevo.com/v3/smtp/email",
        data=payload,
        headers={
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": BREVO_API_KEY,
        },
        method="POST",
    )

    try:
        with urlopen(req, timeout=15) as resp:
            resp_body = resp.read().decode("utf-8")
            logger.info("Brevo API response: %s", resp_body)
            return True, ""
    except HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        logger.error("Brevo HTTP error %s: %s", e.code, body)
        return False, f"Brevo API error ({e.code}): {body}"
    except URLError as e:
        logger.error("Brevo URL error: %s", e.reason)
        return False, f"Brevo connection error: {e.reason}"
    except Exception as e:
        logger.error("Failed to send email via Brevo: %s", e)
        return False, str(e)
