from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from app.core.config import settings
from app.core.security import SupabaseAuth

# Global DB Instance (Using Service Role for backend privileged operations)
# Services use this to act on the database while enforcing RLS via set_config if needed,
# or for admin-level repository queries.
supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

# Initialize the Auth Verifier
auth_verifier = SupabaseAuth(settings.SUPABASE_URL)

# FastAPI HTTP Bearer security scheme
security = HTTPBearer()

def get_supabase() -> Client:
    """Dependency injection wrapper for the Supabase DB client."""
    return supabase_client

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verifies the JWT and returns the parsed payload.
    The 'sub' claim inside the payload is the Supabase User UUID.
    """
    token = credentials.credentials
    payload = auth_verifier.verify_token(token)
    return payload
