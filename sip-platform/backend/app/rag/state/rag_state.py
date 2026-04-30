"""RAG state definition for LangGraph"""

from typing import List, Optional
from pydantic import BaseModel
from langchain_core.documents import Document

class RAGState(BaseModel):
    """State Object for RAG workflow"""

    question: str
    retrieved_docs: List[Document] = []
    answer: str = ""

    sources: Optional[List[str]] = []
    confidence: Optional[float] = 0.0