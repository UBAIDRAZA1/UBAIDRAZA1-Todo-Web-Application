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
    from models.task import Task
    from models.user import User

    # Yeh line tables create karegi (agar nahi hain to)
    SQLModel.metadata.create_all(engine)

    # Check if completed_at column exists and add it if not
    with engine.connect() as conn:
        # Check if completed_at column exists in tasks table
        result = conn.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'task' AND column_name = 'completed_at'
        """))

        if not result.fetchone():
            # Add the completed_at column if it doesn't exist
            conn.execute(text("ALTER TABLE task ADD COLUMN completed_at TIMESTAMP"))
            conn.commit()