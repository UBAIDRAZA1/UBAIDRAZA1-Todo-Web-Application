from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Index


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class Task(TaskBase, table=True):
    id: int = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})  # ← FIXED: autoincrement + int
    user_id: str = Field(index=True)   # user.id is STRING (uuid)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    completed_at: Optional[datetime] = Field(default=None, index=True)

    __table_args__ = (Index('idx_user_completed', 'user_id', 'completed'),)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskPublic(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None


class TaskResponse(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None