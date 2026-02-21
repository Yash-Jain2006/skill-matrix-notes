from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class NoteCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    college: str = Field(..., min_length=1, max_length=255)
    stream: str = Field(..., min_length=1, max_length=255)
    branch: str = Field(..., min_length=1, max_length=255)
    semester: int = Field(..., ge=1, le=10)
    subject: str = Field(..., min_length=1, max_length=255)
    file_url: str = Field(..., min_length=1, max_length=1000)
    is_public: bool = True

class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    college: Optional[str] = Field(None, min_length=1, max_length=255)
    stream: Optional[str] = Field(None, min_length=1, max_length=255)
    branch: Optional[str] = Field(None, min_length=1, max_length=255)
    semester: Optional[int] = Field(None, ge=1, le=10)
    subject: Optional[str] = Field(None, min_length=1, max_length=255)
    file_url: Optional[str] = Field(None, min_length=1, max_length=1000)
    is_public: Optional[bool] = None

class NoteResponse(NoteCreate):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

class UploadUrlRequest(BaseModel):
    filename: str = Field(..., min_length=1, max_length=255)
    size_bytes: int = Field(..., le=52428800) # 50MB max file size enforced at API level
