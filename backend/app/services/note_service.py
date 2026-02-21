from typing import List, Optional, Tuple
from fastapi import HTTPException, status
from app.repositories.note_repository import NoteRepository
from app.schemas.note import NoteCreate, NoteUpdate
from app.schemas.common import PaginatedResponse, PaginationMeta

class NoteService:
    def __init__(self, repository: NoteRepository):
        self.repository = repository

    def _format_paginated_response(self, items: List[dict], limit: int) -> PaginatedResponse:
        has_next = len(items) == limit
        next_cursor = None
        
        if items and has_next:
            last_item = items[-1]
            # Construct deterministic cursor for next page
            next_cursor = f"{last_item['created_at']}_{last_item['id']}"

        return PaginatedResponse(
            data=items,
            meta=PaginationMeta(next_cursor=next_cursor, has_next=has_next)
        )

    def get_public_notes(self, subject: Optional[str] = None, cursor: Optional[str] = None, limit: int = 10) -> PaginatedResponse:
        limit = min(limit, 50) # Cap limit
        notes = self.repository.get_public_notes(subject=subject, cursor=cursor, limit=limit)
        return self._format_paginated_response(notes, limit)

    def get_user_notes(self, user_id: str, cursor: Optional[str] = None, limit: int = 10) -> PaginatedResponse:
        limit = min(limit, 50)
        notes = self.repository.get_user_notes(user_id=user_id, cursor=cursor, limit=limit)
        return self._format_paginated_response(notes, limit)

    def get_note(self, note_id: str) -> dict:
        note = self.repository.get_note_by_id(note_id)
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        return note

    def create_note(self, user_id: str, note_create: NoteCreate) -> dict:
        # Pydantic validation already happened at router layer
        note_dict = note_create.model_dump()
        return self.repository.create_note(user_id=user_id, note_in=note_dict)

    def update_note(self, user_id: str, note_id: str, note_update: NoteUpdate) -> dict:
        # 1. Fetch note to verify ownership
        note = self.get_note(note_id)
        if str(note["user_id"]) != str(user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this note")
        
        # 2. Extract only updated fields
        update_data = note_update.model_dump(exclude_unset=True)
        if not update_data:
            return note
            
        return self.repository.update_note(note_id=note_id, note_in=update_data)

    def delete_note(self, user_id: str, note_id: str) -> None:
        note = self.get_note(note_id)
        if str(note["user_id"]) != str(user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this note")
            
        self.repository.delete_note(note_id)

    def generate_upload_url(self, user_id: str, filename: str, size_bytes: int, supabase_client) -> str:
        # The schema limit of 50MB is enforced at router layer
        file_path = f"{user_id}/{filename}"
        
        # In a real MVP, one might generate a signed upload URL here using supabase_client
        # supabase_client.storage.from_("notes-files").create_signed_upload_url(file_path)
        # However, supabase-py doesn't currently fully expose `create_signed_upload_url` 
        # seamlessly natively in v2.4.0, so the client-side approach using standard Auth token 
        # is generally preferred for direct-to-S3 style uploads.
        # For this MVP architecture we'll instruct the frontend to upload directly 
        # utilizing their active session token & RLS policies we've written.
        
        raise NotImplementedError("Frontend should upload directly utilizing Supabase Storage hooks and session RLS.")
