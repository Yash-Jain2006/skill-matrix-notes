import jwt
import httpx
from fastapi import HTTPException, status
from typing import Dict, Any

class SupabaseAuth:
    def __init__(self, supabase_url: str):
        self.jwks_url = f"{supabase_url}/auth/v1/.well-known/jwks.json"
        
        # We manually fetch JWKS cache if needed or let PyJWKClient do it.
        # PyJWKClient will handle caching the public keys for us.
        self.jwks_client = jwt.PyJWKClient(self.jwks_url)

    def verify_token(self, token: str) -> Dict[str, Any]:
        try:
            # This fetches the public key corresponding to the token's 'kid' header
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            
            # Decode and validate the token asymmetrically
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience="authenticated", # Supabase tokens use 'authenticated' role as audience when logged in
                options={
                    "verify_exp": True,
                    "verify_aud": True
                }
            )
            return payload
            
        except jwt.PyJWKClientError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Unable to fetch JWKS to verify token"
            )
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Token has expired"
            )
        except jwt.InvalidAudienceError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token audience"
            )
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token signature"
            )
