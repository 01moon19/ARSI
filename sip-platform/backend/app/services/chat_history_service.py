import uuid
from datetime import datetime, timezone

from firebase_admin import firestore as fs

from app.integrations.firebase_client import get_firestore


def _ts_to_iso(ts) -> str | None:
    if ts is None:
        return None
    if hasattr(ts, "timestamp"):
        return datetime.fromtimestamp(ts.timestamp(), tz=timezone.utc).isoformat()
    if isinstance(ts, datetime):
        if ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)
        return ts.isoformat()
    return str(ts)


class ChatHistoryService:
    USERS_COLLECTION = "users"
    SESSIONS_SUBCOLLECTION = "chat_sessions"

    def create_session(self, owner_email: str, file_path: str) -> str:
        db = get_firestore()
        session_id = str(uuid.uuid4())
        ref = (
            db.collection(self.USERS_COLLECTION)
            .document(owner_email)
            .collection(self.SESSIONS_SUBCOLLECTION)
            .document(session_id)
        )
        ref.set(
            {
                "owner_email": owner_email,
                "file_path": file_path,
                "created_at": fs.SERVER_TIMESTAMP,
                "updated_at": fs.SERVER_TIMESTAMP,
            }
        )
        return session_id

    def list_sessions(self, owner_email: str, limit: int = 50) -> list[dict]:
        db = get_firestore()
        q = (
            db.collection(self.USERS_COLLECTION)
            .document(owner_email)
            .collection(self.SESSIONS_SUBCOLLECTION)
            .order_by("created_at", direction=fs.Query.DESCENDING)
            .limit(limit)
        )
        out = []
        for doc in q.stream():
            data = doc.to_dict() or {}
            out.append(
                {
                    "session_id": doc.id,
                    "file_path": data.get("file_path", ""),
                    "created_at": _ts_to_iso(data.get("created_at")),
                    "updated_at": _ts_to_iso(data.get("updated_at")),
                }
            )
        return out

    def get_session(self, owner_email: str, session_id: str) -> dict | None:
        db = get_firestore()
        ref = (
            db.collection(self.USERS_COLLECTION)
            .document(owner_email)
            .collection(self.SESSIONS_SUBCOLLECTION)
            .document(session_id)
        )
        snap = ref.get()
        if not snap.exists:
            return None
        data = snap.to_dict() or {}
        data["session_id"] = snap.id
        return data

    def append_message(
        self,
        session_id: str,
        owner_email: str,
        role: str,
        content: str,
        sources: list | None = None,
        confidence: float | None = None,
    ) -> None:
        db = get_firestore()
        session_ref = (
            db.collection(self.USERS_COLLECTION)
            .document(owner_email)
            .collection(self.SESSIONS_SUBCOLLECTION)
            .document(session_id)
        )
        snap = session_ref.get()
        if not snap.exists:
            raise ValueError("Session not found")

        payload = {
            "role": role,
            "content": content,
            "created_at": fs.SERVER_TIMESTAMP,
        }
        if role == "assistant":
            if sources is not None:
                payload["sources"] = sources
            if confidence is not None:
                payload["confidence"] = confidence

        session_ref.collection("messages").add(payload)
        session_ref.update({"updated_at": fs.SERVER_TIMESTAMP})

    def get_transcript(self, owner_email: str, session_id: str) -> tuple[dict, list[dict]]:
        session = self.get_session(owner_email, session_id)
        if session is None:
            return None, []

        db = get_firestore()
        msgs_ref = (
            db.collection(self.USERS_COLLECTION)
            .document(owner_email)
            .collection(self.SESSIONS_SUBCOLLECTION)
            .document(session_id)
            .collection("messages")
            .order_by("created_at")
        )
        messages = []
        for doc in msgs_ref.stream():
            m = doc.to_dict() or {}
            messages.append(
                {
                    "role": m.get("role", ""),
                    "content": m.get("content", ""),
                    "created_at": _ts_to_iso(m.get("created_at")),
                    "sources": m.get("sources"),
                    "confidence": m.get("confidence"),
                }
            )
        base = {
            "session_id": session_id,
            "file_path": session.get("file_path", ""),
        }
        return base, messages


chat_history_service = ChatHistoryService()