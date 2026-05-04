from fastapi import APIRouter, HTTPException

from app.services.rag_service import rag_service
from app.database.schemas.chat_schema import ChatRequest

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/query")
def query_chat(chat_request: ChatRequest):

    try:

        result = rag_service.query(chat_request.question)

        if result is None:
            raise HTTPException(
                status_code=503,
                detail="RAG system not initialized."
            )

        return {
            "question": result.get("question", chat_request.question),
            "answer": result.get("answer"),
            "sources": result.get("sources", []),
            "confidence": result.get("confidence", 0.0)
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )