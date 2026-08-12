import os

from pathlib import Path

from dotenv import load_dotenv


# =====================================================
# Environment
# =====================================================

BASE_DIR = Path(
    __file__
).resolve().parent.parent


ENV_FILE = BASE_DIR / ".env"


load_dotenv(
    ENV_FILE
)


# =====================================================
# Database
# =====================================================

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)


if not DATABASE_URL:

    raise RuntimeError(
        "DATABASE_URL is not configured. "
        "Please create backend/.env."
    )


# =====================================================
# JWT Authentication
# =====================================================

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)


if not JWT_SECRET_KEY:

    raise RuntimeError(
        "JWT_SECRET_KEY is not configured "
        "in backend/.env."
    )


JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256",
)


ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60",
    )
)