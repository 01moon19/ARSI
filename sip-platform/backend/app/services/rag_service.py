from pathlib import Path


print("RAG SERVICE LOADED")


class DocumentService:
    @staticmethod
    def process_pdf(file_path: str) -> str:
        from app.rag.document_ingestion.document_processor import DocumentProcessor

        source_path = Path(file_path)
        processed_dir = Path("data/processed")
        processed_dir.mkdir(parents=True, exist_ok=True)

        processor = DocumentProcessor()
        documents = processor.load_from_pdf(source_path)

        if not documents:
            raise ValueError(f"No readable text found in PDF: {source_path.name}")

        output_path = processed_dir / f"{source_path.stem}.txt"
        text_content = "\n\n".join(
            doc.page_content.strip()
            for doc in documents
            if doc.page_content and doc.page_content.strip()
        )

        if not text_content:
            raise ValueError(f"No text content extracted from PDF: {source_path.name}")

        output_path.write_text(text_content, encoding="utf-8")
        return str(output_path)


class RAGService:
    def __init__(self):
        self.rag = None
        self.init_error = None

    def initialize(self, sources):
        from app.rag.rag_setup import setup_rag_system

        self.init_error = None
        try:
            self.rag = setup_rag_system(sources)
            if self.rag is None:
                self.init_error = "RAG setup did not produce a valid graph; no documents were loaded."
        except Exception as exc:
            self.rag = None
            self.init_error = str(exc)
            print(f"RAG initialization failed: {self.init_error}")

    def ingest_processed_file(self, source: str, progress_callback=None):
        from app.core.config import Config
        from app.rag.document_ingestion.document_processor import DocumentProcessor
        from app.rag.graph_builder.graph_builder import GraphBuilder
        from app.rag.vectorstore.vectorstore import VectorStore

        if progress_callback is not None:
            progress_callback("loading_documents")

        processor = DocumentProcessor(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP
        )
        documents = processor.load_documents([source])

        if progress_callback is not None:
            progress_callback("splitting_and_chunking")

        chunks = processor.split_documents(documents)

        if not chunks:
            raise ValueError("No valid text extracted from uploaded document.")

        vectorstore = VectorStore(faiss_path="db/faiss_index")
        index_file = Path(vectorstore.faiss_path) / "index.faiss"

        if progress_callback is not None:
            progress_callback("creating_embeddings")

        if index_file.exists():
            vectorstore.add_documents(chunks)
        else:
            vectorstore.create_vectorstore(chunks)

        if progress_callback is not None:
            progress_callback("saving_embeddings")

        retriever = vectorstore.get_retriever()
        llm = Config.get_llm()

        graph_builder = GraphBuilder(retriever, llm)
        graph_builder.build()

        self.rag = graph_builder
        self.init_error = None

        return {
            "documents_loaded": len(documents),
            "chunks_created": len(chunks)
        }

    def query(self, question: str):
        if self.init_error:
            raise ValueError("RAG initialization error: " + self.init_error)

        if self.rag is None:
            raise ValueError("RAG system is not initialized. Please ingest documents first.")

        return self.rag.run(question)
