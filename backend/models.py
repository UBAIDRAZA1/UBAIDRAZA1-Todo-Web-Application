from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: str = Field(primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    emailVerified: bool = Field(default=False)
    image: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    password: str  # Added for manual auth since we are implementing it ourselves


class Session(SQLModel, table=True):
    __tablename__ = "sessions"
    id: str = Field(primary_key=True)
    expiresAt: datetime
    token: str = Field(unique=True, index=True)
    createdAt: datetime
    updatedAt: datetime
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    userId: str = Field(foreign_key="users.id")


class Account(SQLModel, table=True):
    __tablename__ = "accounts"
    id: str = Field(primary_key=True)
    accountId: str
    providerId: str
    userId: str = Field(foreign_key="users.id")
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    idToken: Optional[str] = None
    accessTokenExpiresAt: Optional[datetime] = None
    refreshTokenExpiresAt: Optional[datetime] = None
    scope: Optional[str] = None
    password: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime


class Verification(SQLModel, table=True):
    __tablename__ = "verifications"
    id: str = Field(primary_key=True)
    identifier: str
    value: str
    expiresAt: datetime
    createdAt: datetime
    updatedAt: datetime


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # References users.id from Better Auth
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None


class TaskCreate(TaskBase):
    pass  # Don't include completed_at in creation


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskToggleComplete(SQLModel):
    completed: bool