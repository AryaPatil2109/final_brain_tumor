from backend.app.database import Base
from backend.app.database import engine

from backend.app.models import User
from backend.app.models import TumorType
from backend.app.models import Prediction


def create_tables():

    print("========================================")
    print("Creating database tables")
    print("========================================")

    Base.metadata.create_all(
        bind=engine
    )

    print("Database tables created successfully.")

    print("========================================")


if __name__ == "__main__":

    create_tables()