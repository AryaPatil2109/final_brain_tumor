from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import User

from backend.app.schemas import LoginRequest
from backend.app.schemas import LoginResponse
from backend.app.schemas import SignupRequest
from backend.app.schemas import SignupResponse
from backend.app.schemas import ForgotPasswordRequest
from backend.app.schemas import ForgotPasswordResponse
from backend.app.schemas import ResetPasswordRequest

from backend.app.security import create_access_token
from backend.app.security import hash_password
from backend.app.security import verify_password
from backend.app.security import create_reset_token
from backend.app.security import decode_reset_token
from backend.app.services.email import send_reset_email


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# =====================================================
# SIGN UP
# =====================================================

@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db),
):
    """
    Create a new user account.
    """

    # -------------------------------------------------
    # Check whether email already exists
    # -------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == request.email.lower()
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # -------------------------------------------------
    # Create user
    # -------------------------------------------------

    user = User(
        name=request.name.strip(),
        email=request.email.lower(),
        password_hash=hash_password(
            request.password
        ),
        role="user",
    )

    # -------------------------------------------------
    # Save user
    # -------------------------------------------------

    db.add(user)

    db.commit()

    db.refresh(user)

    # -------------------------------------------------
    # Return user
    # -------------------------------------------------

    return SignupResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
    )


# =====================================================
# NORMAL LOGIN
# =====================================================

@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    """
    Normal JSON-based login.

    This endpoint is intended for the frontend.

    Request format:

    {
        "email": "user@example.com",
        "password": "password"
    }
    """

    # -------------------------------------------------
    # Find user
    # -------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == request.email.lower()
        )
        .first()
    )

    # -------------------------------------------------
    # Invalid credentials
    # -------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # -------------------------------------------------
    # Verify password
    # -------------------------------------------------

    if not verify_password(
        request.password,
        user.password_hash,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # -------------------------------------------------
    # Create JWT
    # -------------------------------------------------

    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=user.role,
    )

    # -------------------------------------------------
    # Return token + user
    # -------------------------------------------------

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=SignupResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            created_at=user.created_at,
        ),
    )


# =====================================================
# OAUTH2 TOKEN FOR SWAGGER
# =====================================================

@router.post(
    "/token",
)
def oauth2_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    OAuth2-compatible login endpoint.

    This endpoint is used by Swagger's
    OAuth2 Authorize button.

    Swagger sends:

        username = user's email
        password = user's password

    The username field is intentionally treated
    as the user's email address.
    """

    # -------------------------------------------------
    # Find user
    # -------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == form_data.username.lower()
        )
        .first()
    )

    # -------------------------------------------------
    # Invalid user
    # -------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # -------------------------------------------------
    # Verify password
    # -------------------------------------------------

    if not verify_password(
        form_data.password,
        user.password_hash,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # -------------------------------------------------
    # Create JWT
    # -------------------------------------------------

    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=user.role,
    )

    # -------------------------------------------------
    # OAuth2 standard response
    # -------------------------------------------------

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# =====================================================
# PASSWORD RESET
# =====================================================

@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Generate a password reset token for the specified email.
    """

    user = (
        db.query(User)
        .filter(
            User.email == request.email.lower()
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account associated with this email address was found.",
        )

    # Create password reset token
    reset_token = create_reset_token(user.id)

    # Send reset email
    email_sent = send_reset_email(user.email, reset_token)
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send password reset email. Please try again later or verify SMTP settings.",
        )

    return ForgotPasswordResponse(
        message="A password reset link has been sent to your email address.",
        reset_token=None,  # Reset token is sent via email, not returned in response body
    )


@router.post(
    "/reset-password",
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Reset password using a valid reset token.
    """

    payload = decode_reset_token(request.token)

    if not payload:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset link is invalid or has expired.",
        )

    user_id = payload.get("sub")

    if not user_id:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload.",
        )

    try:

        user_id = int(user_id)

    except ValueError:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload format.",
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    # Hash and update password
    user.password_hash = hash_password(
        request.new_password
    )

    db.commit()

    return {
        "message": "Your password has been reset successfully."
    }