from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from app.api.v1.router import api_router
from app.schemas.common import ErrorResponse, ErrorDetail

app = FastAPI(
    title="Scalable Notes SaaS API", 
    version="1.0.0",
    description="Phase-1 MVP Architecture using Clean principles and Supabase JWT."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For MVP. Restrict in real production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers to match API Contract
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            error=ErrorDetail(
                code="VALIDATION_FAILED",
                message="Data validation failed",
                details=exc.errors()
            )
        ).model_dump()
    )

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            error=ErrorDetail(
                code="VALUE_ERROR",
                message=str(exc)
            )
        ).model_dump()
    )

# Include core routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["System"])
def health_check():
    """Lightweight hook for uptime monitoring (e.g. UptimeRobot)."""
    # Note: In a real system, you could check DB connectivity here
    return {"status": "healthy", "service": "notes-api"}
