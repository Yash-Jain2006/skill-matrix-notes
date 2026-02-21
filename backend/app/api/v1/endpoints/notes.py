from fastapi import APIRouter, Depends, Query, Path, status
from typing import Optional
from app.api.dependencies import get_current_user, get_supabase
from app.repositories.note_repository import NoteRepository
from app.services.note_service import NoteService
from app.schemas.note import NoteResponse, NoteCreate, NoteUpdate
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/notes", tags=["Notes"])

def get_note_service(supabase_client = Depends(get_supabase)) -> NoteService:
    repo = NoteRepository(db_client=supabase_client)
    return NoteService(repository=repo)

@router.get("", response_model=PaginatedResponse[NoteResponse])
def get_public_notes(
    subject: Optional[str] = None,
    cursor: Optional[str] = Query(None, description="Cursor for pagination"),
    limit: int = Query(10, ge=1, le=50),
    service: NoteService = Depends(get_note_service)
):
    """Fetch paginated public notes, optionally filtered by subject."""
    return service.get_public_notes(subject=subject, cursor=cursor, limit=limit)

@router.get("/me", response_model=PaginatedResponse[NoteResponse])
def get_my_notes(
    cursor: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    """Fetch notes uploaded by the authenticated user."""
    return service.get_user_notes(user_id=current_user["sub"], cursor=cursor, limit=limit)

@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: str = Path(...),
    service: NoteService = Depends(get_note_service)
):
    """Fetch details of a single note by ID."""
    return service.get_note(note_id)

@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note_in: NoteCreate,
    current_user: dict = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    """Create a new note. User ID inferred from the JWT."""
    return service.create_note(user_id=current_user["sub"], note_create=note_in)

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_in: NoteUpdate,
    note_id: str = Path(...),
    current_user: dict = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    """Update a note. Fails if the user is not the owner."""
    return service.update_note(user_id=current_user["sub"], note_id=note_id, note_update=note_in)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: str = Path(...),
    current_user: dict = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    """Delete a note. Fails if the user is not the owner."""
    service.delete_note(user_id=current_user["sub"], note_id=note_id)
