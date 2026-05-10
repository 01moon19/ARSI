from typing import Any

from pydantic import BaseModel, Field


class ChatSessionCreate(BaseModel):
    title: str


class ChatSessionSummary(BaseModel):
    session_id: str
    
    created_at: str | None = None
    updated_at: str | None = None


class ChatMessageOut(BaseModel):
    role: str
    content: str
    created_at: str | None = None
    sources: list[Any] | None = None
    confidence: float | None = None


class ChatTranscriptResponse(BaseModel):
    session_id: str
    
    messages: list[ChatMessageOut]


class ChatQueryRequest(BaseModel):
    session_id: str
    question: str