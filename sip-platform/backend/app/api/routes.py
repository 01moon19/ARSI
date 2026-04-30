from fastapi import APIRouter, HTTPException
from app.services.rag_service import RAGService

router = APIRouter()

rag_service = RAGService()

print("ROUTES FILE LOADED")


@router.get("/ask")
def ask(query: str):
    try:
        result = rag_service.query(query)

        if result is None:
            raise HTTPException(
                status_code=503,
                detail="RAG system not initialized or no data available."
            )

        if isinstance(result, dict):
            return {
                "question": result.get("question", query),
                "answer": result.get("answer", "No answer generated."),
                "sources": result.get("sources", []),
                "confidence": result.get("confidence", 0.0)
            }

        return {
            "question": getattr(result, "question", query),
            "answer": getattr(result, "answer", "No answer generated."),
            "sources": getattr(result, "sources", []),
            "confidence": getattr(result, "confidence", 0.0)
        }

    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error during query: {str(e)}"
        )
