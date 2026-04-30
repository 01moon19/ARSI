"""
RAG Setup Module

Connects:
- DocumentProcessor
- VectorStore (FAISS)
- Retriever
- LLM (Gemini)
- LangGraph workflow
"""

from platform import processor
from typing import List

from app.rag.document_ingestion.document_processor import DocumentProcessor
from app.rag.vectorstore.vectorstore import VectorStore
from app.rag.graph_builder.graph_builder import GraphBuilder
from app.core.config import Config


def setup_rag_system(sources: List[str]):
    """
    Initialize complete RAG pipeline

    Args:
        sources: list of file paths / URLs

    Returns:
        GraphBuilder instance
    """

    print("\n🚀 Initializing RAG system...\n")

    # =========================
    # 1. Load + Split Documents
    # =========================
    print("📄 Loading documents...")

    processor = DocumentProcessor(
        chunk_size=Config.CHUNK_SIZE,
        chunk_overlap=Config.CHUNK_OVERLAP
    )

    documents = processor.load_documents(sources)

    # documents = [
    #     doc for doc in documents
    #     if doc.page_content and len(doc.page_content.strip()) > 5
    # ]

    chunks = processor.split_documents(documents)

    if not chunks:
        print("⚠️ No valid text extracted from documents. RAG engine will remain uninitialized until data is available.")
        return None

    print(f"✅ Loaded {len(documents)} documents")
    print(f"✅ Created {len(chunks)} chunks\n")

    # =========================
    # 2. Vector Store (FAISS)
    # =========================
    print("🧠 Creating / Loading Vector Store...")

    vectorstore = VectorStore(faiss_path="db/faiss_index")
    vectorstore.create_vectorstore(chunks)

    retriever = vectorstore.get_retriever()

    print("✅ Vector store ready\n")

    # =========================
    # 3. Initialize LLM
    # =========================
    print("🤖 Initializing LLM...")

    llm = Config.get_llm()

    print("✅ LLM ready\n")

    # =========================
    # 4. Build LangGraph
    # =========================
    print("🔗 Building LangGraph workflow...")

    graph_builder = GraphBuilder(retriever, llm)
    graph_builder.build()

    print("✅ RAG system ready!\n")

    return graph_builder