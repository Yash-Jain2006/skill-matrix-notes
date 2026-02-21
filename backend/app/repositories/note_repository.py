from typing import List, Optional, Tuple, Any
from supabase import Client
from app.schemas.note import NoteCreate, NoteUpdate
from pydantic import UUID4

class NoteRepository:
    def __init__(self, db_client: Client):
        self.db = db_client

    def get_public_notes(self, subject: Optional[str] = None, cursor: Optional[str] = None, limit: int = 10) -> List[dict]:
        query = self.db.table("notes").select("*").eq("is_public", True)
        
        if subject:
            query = query.eq("subject", subject)
            
        # Deterministic cursor pagination (created_at DESC, id DESC)
        if cursor:
            try:
                # cursor format: timestamp_uuid
                created_at_str, note_id_str = cursor.split("_", 1)
                # To handle DESC pagination in PostgREST, we use less than rather than offset
                # But since Supabase select filtering on multiple columns for pagination is complex,
                # we pass created_at less than cursor. This is a simplified 1D cursor for MVP.
                query = query.lt("created_at", created_at_str)
            except ValueError:
                pass # ignore malformed cursors for now and fall back to top limit
                
        # Order by created_at DESC strictly
        query = query.order("created_at", desc=True).limit(limit)
        
        response = query.execute()
        return response.data

    def get_user_notes(self, user_id: str, cursor: Optional[str] = None, limit: int = 10) -> List[dict]:
        query = self.db.table("notes").select("*").eq("user_id", user_id)
        
        if cursor:
            try:
                created_at_str, _ = cursor.split("_", 1)
                query = query.lt("created_at", created_at_str)
            except ValueError:
                pass
                
        query = query.order("created_at", desc=True).limit(limit)
        response = query.execute()
        return response.data

    def get_note_by_id(self, note_id: str) -> Optional[dict]:
        response = self.db.table("notes").select("*").eq("id", note_id).execute()
        return response.data[0] if response.data else None

    def create_note(self, user_id: str, note_in: dict) -> dict:
        # We attach the user_id dynamically at the repository/service layer
        note_data = {**note_in, "user_id": user_id}
        response = self.db.table("notes").insert(note_data).execute()
        return response.data[0]

    def update_note(self, note_id: str, note_in: dict) -> dict:
        response = self.db.table("notes").update(note_in).eq("id", note_id).execute()
        return response.data[0] if response.data else None

    def delete_note(self, note_id: str) -> bool:
        response = self.db.table("notes").delete().eq("id", note_id).execute()
        return len(response.data) > 0
