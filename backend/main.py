from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
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
    lifespan=lifespan,
    docs_url=None,  # Hugging Face pe docs disable karo
    redoc_url=None
)

# ✅ IMPORTANT: Fix for HTTPS redirect issue - only for Hugging Face deployment
@app.middleware("http")
async def fix_scheme(request: Request, call_next):
    """
    Handle proxy headers properly for Hugging Face deployment
    """
    # Check if we're behind a proxy (Hugging Face Spaces)
    forwarded_proto = request.headers.get("x-forwarded-proto")
    if forwarded_proto:
        request.scope["scheme"] = forwarded_proto
    else:
        request.scope["scheme"] = "http"
    response = await call_next(request)
    return response

# ✅ TrustedHostMiddleware for proxy
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Allow all hosts for Hugging Face
)

# ✅ CORS middleware - UPDATED for Hugging Face
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Temporary - all allow
        # "https://your-frontend.vercel.app",
        # "http://localhost:3000",
        # "http://localhost:8001",
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
    return {"message": "Todo API is running on Hugging Face"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "environment": "huggingface",
        "cors_enabled": True
    }

# ✅ Test endpoint for debugging
@app.get("/api/test")
def test_endpoint():
    return {
        "message": "API is working",
        "scheme": "http",
        "cors": "enabled",
        "timestamp": "now"
    }

if __name__ == "__main__":
    import uvicorn
    
    # ✅ Hugging Face ka fixed port
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=7860,  # Hugging Face ka fixed port
        proxy_headers=True,  # IMPORTANT for Hugging Face
        forwarded_allow_ips="*",  # Allow all forwarded IPs
        log_level="info"
    )