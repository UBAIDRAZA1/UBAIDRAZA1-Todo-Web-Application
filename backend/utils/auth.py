from fastapi import HTTPException, status, Request
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from config.settings import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer()


def verify_token(token: str) -> Optional[str]:
    """
    Verify JWT token and return user_id if valid
    """
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_id(request: Request) -> str:
    """
    Get current user ID from JWT token in request
    """
    from fastapi.security import HTTPAuthorizationCredentials
    # Get the credentials from the request
    token = None
    authorization: str = request.headers.get("Authorization")
    
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]  # Remove "Bearer " prefix
    else:
        # Check cookie
        token = request.cookies.get("better-auth.session_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = verify_token(token)
    
    # Verify that the user_id in the token matches the user_id in the path
    # Only if user_id is in the path
    path_user_id = request.path_params.get("user_id")
    if path_user_id and user_id != path_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    
    return user_id