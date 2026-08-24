from datetime import datetime
from datetime import timedelta
from datetime import timezone

from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError
from jose import jwt

from pwdlib import PasswordHash

from sqlalchemy.orm import Session

from backend.app.config import JWT_ALGORITHM
from backend.app.config import JWT_SECRET_KEY
from backend.app.config import ACCESS_TOKEN_EXPIRE_MINUTES
from backend.app.database import get_db
from backend.app.models import User


# =====================================================
# PASSWORD HASHING
# =====================================================

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """
    Convert a plain-text password into a secure password hash.
    """

    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against the stored hash.
    """

    return password_hash.verify(
        plain_password,
        hashed_password,
    )


# =====================================================
# JWT
# =====================================================

def create_access_token(
    user_id: int,
    email: str,
    role: str,
) -> str:
    """
    Create a JWT access token for an authenticated user.
    """

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return token


def decode_access_token(
    token: str,
) -> dict | None:
    """
    Decode and validate a JWT access token.

    Returns:
        dict: decoded token payload
        None: if the token is invalid
    """

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

        return payload

    except JWTError:

        return None


# =====================================================
# OAUTH2 AUTHENTICATION
# =====================================================

# IMPORTANT:
#
# Swagger's OAuth2 Authorize button sends
# username/password as form data.
#
# Our normal /api/auth/login endpoint uses JSON.
#
# Therefore Swagger uses the separate:
#
#     /api/auth/token
#
# endpoint.

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/token"
)


# =====================================================
# CURRENT USER DEPENDENCY
# =====================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Get the currently authenticated user from the JWT.
    """

    # -------------------------------------------------
    # Decode JWT
    # -------------------------------------------------

    payload = decode_access_token(token)

    if payload is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # -------------------------------------------------
    # Get user ID from JWT
    # -------------------------------------------------

    user_id = payload.get("sub")

    if not user_id:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # -------------------------------------------------
    # Convert user ID to integer
    # -------------------------------------------------

    try:

        user_id = int(user_id)

    except (TypeError, ValueError):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # -------------------------------------------------
    # Find user in database
    # -------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    # -------------------------------------------------
    # User does not exist
    # -------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with this token was not found.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    return user


# =====================================================
# PASSWORD RESET TOKENS
# =====================================================

def create_reset_token(user_id: int) -> str:
    """
    Create a JWT password reset token for a user (valid for 15 minutes).
    """

    expire = (
        datetime.now(timezone.utc)
        + timedelta(minutes=15)
    )

    payload = {
        "sub": str(user_id),
        "scope": "password_reset",
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return token


def decode_reset_token(token: str) -> dict | None:
    """
    Decode and validate a JWT password reset token.
    """

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

        if payload.get("scope") != "password_reset":
            return None

        return payload

    except JWTError:

        return None