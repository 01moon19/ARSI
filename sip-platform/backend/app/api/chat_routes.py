from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.security import get_current_user
from app.database.models.user import User
from app.database.schemas.chat_schema import (
    ChatSessionCreate,
    ChatSessionSummary,
    ChatTranscriptResponse,
    ChatMessageOut,
    ChatQueryRequest,
)
from app.core.path_utils import resolve_trusted_file_path
from app.services.chat_history_service import chat_history_service
from app.services.rag_service import rag_service


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("/sessions", response_model=ChatSessionSummary)
def create_chat_session(
    body: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
):
    path = resolve_trusted_file_path(body.file_path)
    session_id = chat_history_service.create_session(
        owner_email=current_user.email,
        file_path=str(path),
    )
    return ChatSessionSummary(
        session_id=session_id,
        file_path=str(path),
        created_at=None,
        updated_at=None,
    )


@router.get("/sessions", response_model=list[ChatSessionSummary])
def list_chat_sessions(
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
):
    rows = chat_history_service.list_sessions(current_user.email, limit=limit)
    return [ChatSessionSummary(**row) for row in rows]


@router.get("/sessions/{session_id}", response_model=ChatTranscriptResponse)
def get_chat_transcript(
    session_id: str,
    current_user: User = Depends(get_current_user),
):
    base, messages = chat_history_service.get_transcript(current_user.email, session_id)
    if base is None:
        raise HTTPException(status_code=404, detail="Session not found.")
    return ChatTranscriptResponse(
        session_id=base["session_id"],
        file_path=base["file_path"],
        messages=[ChatMessageOut(**m) for m in messages],
    )


@router.post("/query")
def query_chat(
    chat_request: ChatQueryRequest,
    current_user: User = Depends(get_current_user),
):
    session = chat_history_service.get_session(current_user.email, chat_request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found.")

    try:
        chat_history_service.append_message(
            chat_request.session_id,
            current_user.email,
            "user",
            chat_request.question,
        )
    except PermissionError:
        raise HTTPException(status_code=403, detail="Forbidden.")
    except ValueError:
        raise HTTPException(status_code=404, detail="Session not found.")

    try:
        result = rag_service.query(chat_request.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if result is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized.")

    answer_payload = {
        "question": result.get("question", chat_request.question),
        "answer": result.get("answer"),
        "sources": result.get("sources", []),
        "confidence": result.get("confidence", 0.0),
    }

    try:
        chat_history_service.append_message(
            chat_request.session_id,
            current_user.email,
            "assistant",
            str(answer_payload.get("answer") or ""),
            sources=answer_payload.get("sources"),
            confidence=answer_payload.get("confidence"),
        )
    except (PermissionError, ValueError):
        pass

    return answer_payload