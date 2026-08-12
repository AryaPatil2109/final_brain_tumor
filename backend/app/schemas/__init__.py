from datetime import datetime

from pydantic import BaseModel, Field


# =====================================================
# SIGNUP REQUEST
# =====================================================

class SignupRequest(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    email: str = Field(
        min_length=5,
        max_length=255,
    )

    password: str = Field(
        min_length=6,
        max_length=128,
    )


# =====================================================
# SIGNUP RESPONSE
# =====================================================

class SignupResponse(BaseModel):
    id: int

    name: str

    email: str

    role: str

    created_at: datetime


# =====================================================
# LOGIN REQUEST
# =====================================================

class LoginRequest(BaseModel):
    email: str = Field(
        min_length=5,
        max_length=255,
    )

    password: str = Field(
        min_length=1,
        max_length=128,
    )


# =====================================================
# LOGIN RESPONSE
# =====================================================

class LoginResponse(BaseModel):
    access_token: str

    token_type: str

    user: SignupResponse