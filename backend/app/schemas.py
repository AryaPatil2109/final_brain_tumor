from datetime import datetime

from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import Field


# =====================================================
# SIGNUP
# =====================================================

class SignupRequest(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=150,
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )


class SignupResponse(BaseModel):

    id: int
    name: str
    email: str
    role: str
    created_at: datetime


# =====================================================
# LOGIN
# =====================================================

class LoginRequest(BaseModel):

    email: EmailStr

    password: str = Field(
        min_length=1,
        max_length=128,
    )


class LoginResponse(BaseModel):

    access_token: str
    token_type: str

    user: SignupResponse


# =====================================================
# CURRENT USER
# =====================================================

class UserResponse(BaseModel):

    id: int
    name: str
    email: str
    role: str
    created_at: datetime