from sqlalchemy import create_engine

from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from backend.app.config import DATABASE_URL


# =====================================================
# PostgreSQL Engine
# =====================================================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)


# =====================================================
# Database Session
# =====================================================

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# =====================================================
# Base
# =====================================================

Base = declarative_base()


# =====================================================
# FastAPI Dependency
# =====================================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()