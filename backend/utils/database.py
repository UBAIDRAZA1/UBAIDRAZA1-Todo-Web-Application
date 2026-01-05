from sqlmodel import create_engine, Session, SQLModel
from config.settings import settings
from sqlalchemy import text

# Create the database engine
engine = create_engine(settings.DATABASE_URL, echo=True, future=True)

def get_session():
    """
    Dependency to provide a database session
    """
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """
    Create all tables in the database
    """
    # Import models yahan taaki circular import na ho
    from models import Task, User

    # Yeh line tables create karegi (agar nahi hain to)
    SQLModel.metadata.create_all(engine)