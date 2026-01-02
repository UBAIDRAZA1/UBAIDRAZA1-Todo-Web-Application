from sqlmodel import create_engine, Session
from config.settings import settings
from models import Task

# Create the database engine
engine = create_engine(settings.DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)