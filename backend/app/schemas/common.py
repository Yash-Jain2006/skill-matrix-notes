from pydantic import BaseModel, ConfigDict
from typing import Generic, TypeVar, List, Optional, Any

T = TypeVar("T")

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class ErrorResponse(BaseModel):
    error: ErrorDetail

class PaginationMeta(BaseModel):
    next_cursor: Optional[str]
    has_next: bool

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    meta: PaginationMeta
