from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.tasks import router as tasks_router
from api.auth import router as auth_router
from config.settings import settings
from utils.database import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context to create database tables on startup
    """
    # Ensure all tables are created before handling requests
    create_db_and_tables()
    yield

app = FastAPI(
    title="Todo API",
    description="A full-stack todo application API with authentication",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hafizubaid-todo-wep-app.hf.space",  # Frontend URL
        "http://localhost:3000",  # Local frontend
        "http://localhost:7860",  # Backend self
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router, prefix="/api/auth")
app.include_router(tasks_router, prefix="/api/{user_id}/tasks")

@app.get("/")
def read_root():
    return {"message": "Todo API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    import os
    
    # IMPORTANT: Port environment variable se lelo, default 7860
    port = int(os.getenv("PORT", "7860"))
    uvicorn.run(app, host="0.0.0.0", port=port)