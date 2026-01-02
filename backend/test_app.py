"""
Test script to validate the backend functionality
"""
import asyncio
from sqlmodel import Session, select
from models import Task, TaskCreate
from utils.database import engine
from datetime import datetime


def test_database_connection():
    """Test database connection and basic operations"""
    print("Testing database connection...")
    
    try:
        # Create a session and test basic operations
        with Session(engine) as session:
            # Create a test task
            test_task = Task(
                title="Test Task",
                description="This is a test task",
                completed=False,
                user_id="test_user_123",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            session.add(test_task)
            session.commit()
            session.refresh(test_task)
            
            print(f"Created test task with ID: {test_task.id}")
            
            # Query the task back
            statement = select(Task).where(Task.id == test_task.id)
            result = session.exec(statement).first()
            
            if result:
                print(f"Successfully retrieved task: {result.title}")
            else:
                print("Failed to retrieve task")
                
            # Clean up - delete the test task
            session.delete(test_task)
            session.commit()
            
        print("Database test completed successfully!")
        return True
        
    except Exception as e:
        print(f"Database test failed: {str(e)}")
        return False


if __name__ == "__main__":
    success = test_database_connection()
    if success:
        print("\n✓ Backend validation passed!")
    else:
        print("\n✗ Backend validation failed!")