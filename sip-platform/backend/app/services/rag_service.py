# from pathlib import Path
# from app.core.config import settings

# print("RAG SERVICE LOADED")


# class DocumentService:
#     @staticmethod
#     def process_pdf(file_path: str) -> str:
#         from app.rag.document_ingestion.document_processor import DocumentProcessor

#         source_path = Path(file_path)
#         processed_dir = Path(settings.PROCESSED_STORAGE_PATH)
#         processed_dir.mkdir(parents=True, exist_ok=True)

#         processor = DocumentProcessor()
#         documents = processor.load_from_pdf(source_path)

#         if not documents:
#             raise ValueError(f"No readable text found in PDF: {source_path.name}")

#         output_path = processed_dir / f"{source_path.stem}.txt"
#         text_content = "\n\n".join(
#             doc.page_content.strip()
#             for doc in documents
#             if doc.page_content and doc.page_content.strip()
#         )

#         if not text_content:
#             raise ValueError(f"No text content extracted from PDF: {source_path.name}")

#         output_path.write_text(text_content, encoding="utf-8")
#         return str(output_path)


# class RAGService:
#     def __init__(self):
#         self.rag = None
#         self.init_error = None

#     def initialize(self, sources):
#         from app.rag.rag_setup import setup_rag_system

#         self.init_error = None
#         try:
#             self.rag = setup_rag_system(sources)
#             if self.rag is None:
#                 self.init_error = "RAG setup did not produce a valid graph; no documents were loaded."
#         except Exception as exc:
#             self.rag = None
#             self.init_error = str(exc)
#             print(f"RAG initialization failed: {self.init_error}")
    
#     def load_existing_index(self):

#         from app.core.config import settings
#         from app.rag.vectorstore.vectorstore import VectorStore
#         from app.rag.graph_builder.graph_builder import GraphBuilder
#         from app.services.llm_service import get_llm

#         try:

#             vectorstore = VectorStore(
#                 faiss_path=str(
#                     Path(settings.VECTOR_STORAGE_PATH) / "faiss_index"
#                 )
#             )

#             index_file = Path(
#                 settings.VECTOR_STORAGE_PATH
#             ) / "faiss_index" / "index.faiss"

#             if not index_file.exists():

#                 print("⚠️ No existing FAISS index found.")

#                 return

#             vectorstore.create_vectorstore(
#                 documents=["startup_load"]
#             )

#             retriever = vectorstore.get_retriever()

#             llm = get_llm()

#             graph_builder = GraphBuilder(
#                 retriever,
#                 llm
#             )

#             graph_builder.build()

#             self.rag = graph_builder

#             self.init_error = None

#             print("✅ Existing FAISS index loaded.")

#         except Exception as exc:

#             self.rag = None

#             self.init_error = str(exc)

#             print(f"❌ Failed loading existing index: {exc}")
    
#     def ingest_processed_file(self, source: str, progress_callback=None):
#         from app.core.config import settings
#         from app.rag.document_ingestion.document_processor import DocumentProcessor
#         from app.rag.graph_builder.graph_builder import GraphBuilder
#         from app.rag.vectorstore.vectorstore import VectorStore
#         from app.services.llm_service import get_llm

#         if progress_callback is not None:
#             progress_callback("loading_documents")

#         processor = DocumentProcessor(
#             chunk_size=settings.CHUNK_SIZE,
#             chunk_overlap=settings.CHUNK_OVERLAP
#         )
#         documents = processor.load_documents([source])

#         if progress_callback is not None:
#             progress_callback("splitting_and_chunking")

#         chunks = processor.split_documents(documents)

#         if not chunks:
#             raise ValueError("No valid text extracted from uploaded document.")

#         vectorstore = VectorStore(
#             faiss_path=str(Path(settings.VECTOR_STORAGE_PATH) / "faiss_index")
#         )
#         index_file = Path(vectorstore.faiss_path) / "index.faiss"

#         if progress_callback is not None:
#             progress_callback("creating_embeddings")

#         if index_file.exists():
#             vectorstore.add_documents(chunks)
#         else:
#             vectorstore.create_vectorstore(chunks)

#         if progress_callback is not None:
#             progress_callback("saving_embeddings")

#         retriever = vectorstore.get_retriever()
#         llm = get_llm()

#         graph_builder = GraphBuilder(retriever, llm)
#         graph_builder.build()

#         self.rag = graph_builder
#         self.init_error = None

#         return {
#             "documents_loaded": len(documents),
#             "chunks_created": len(chunks)
#         }

#     def query(self, question: str):
#         if self.init_error:
#             raise ValueError("RAG initialization error: " + self.init_error)

#         if self.rag is None:
#             raise ValueError("RAG system is not initialized. Please ingest documents first.")

#         return self.rag.run(question)

# # Shared singleton instance
# rag_service = RAGService()


from pathlib import Path
from app.core.config import settings

from pathlib import Path

from langchain.schema import Document

from llama_parse import LlamaParse

from llama_index.core.node_parser import (
    MarkdownElementNodeParser,
    SentenceSplitter
)

from llama_index.llms.google_genai import GoogleGenAI

import os

print("RAG SERVICE LOADED")


class DocumentService:
    @staticmethod
    def process_pdf(file_path: str) -> str:
        from app.rag.document_ingestion.document_processor import DocumentProcessor

        source_path = Path(file_path)
        processed_dir = Path(settings.PROCESSED_STORAGE_PATH)
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
        self.semantic_splitter = SentenceSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )

        self.llama_parser = LlamaParse(
            api_key=os.getenv("LLAMA_CLOUD_API_KEY"),
            result_type="markdown",
            parsing_instruction="""
            Preserve tables carefully.
            Maintain sheet and section hierarchy.
            """
        )

        self.markdown_parser = MarkdownElementNodeParser(
            llm=GoogleGenAI(
                model="gemini-2.5-flash",
                temperature=0
            ),
            num_workers=4
        )

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
    
    def load_existing_index(self):

        from app.core.config import settings
        from app.rag.vectorstore.vectorstore import VectorStore
        from app.rag.graph_builder.graph_builder import GraphBuilder
        from app.services.llm_service import get_llm

        try:

            vectorstore = VectorStore(
                faiss_path=str(
                    Path(settings.VECTOR_STORAGE_PATH) / "faiss_index"
                )
            )

            index_file = Path(
                settings.VECTOR_STORAGE_PATH
            ) / "faiss_index" / "index.faiss"

            if not index_file.exists():

                print("⚠️ No existing FAISS index found.")

                return

            vectorstore.create_vectorstore(
                documents=["startup_load"]
            )

            retriever = vectorstore.get_retriever()

            llm = get_llm()

            graph_builder = GraphBuilder(
                retriever,
                llm
            )

            graph_builder.build()

            self.rag = graph_builder

            self.init_error = None

            print("[OK] Existing FAISS index loaded.")

        except Exception as exc:

            self.rag = None

            self.init_error = str(exc)

            print(f"[ERROR] Failed loading existing index: {exc}")
    
    def  ingest_processed_file(self, source: str, progress_callback=None):
        from app.core.config import settings
        from app.rag.document_ingestion.document_processor import DocumentProcessor
        from app.rag.graph_builder.graph_builder import GraphBuilder
        from app.rag.vectorstore.vectorstore import VectorStore
        from app.services.llm_service import get_llm

        if progress_callback is not None:
            progress_callback("loading_documents")

        processor = DocumentProcessor(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        documents = processor.load_documents([source])

        if progress_callback is not None:
            progress_callback("splitting_and_chunking")

        # chunks = processor.split_documents(documents)

        chunks = self.process_documents_semantically(
        [source])

        if not chunks:
            raise ValueError("No valid text extracted from uploaded document.")

        vectorstore = VectorStore(
            faiss_path=str(Path(settings.VECTOR_STORAGE_PATH) / "faiss_index")
        )
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
        llm = get_llm()

        graph_builder = GraphBuilder(retriever, llm)
        graph_builder.build()

        self.rag = graph_builder
        self.init_error = None

        return {
            "documents_loaded": len(documents),
            "chunks_created": len(chunks)
        }
    
    def process_documents_semantically(
        self,
        sources: list[str]
    ):
        from app.rag.document_ingestion.document_processor import DocumentProcessor
        

        final_documents = []

        for source in sources:

            path = Path(source)

            suffix = path.suffix.lower()

            # Use semantic parsing only for structured docs
            if suffix in [".pdf", ".xlsx"]:

                llama_docs = self.llama_parser.load_data(
                    str(path)
                )

                nodes = self.markdown_parser.get_nodes_from_documents(
                    llama_docs
                )

                split_nodes = self.semantic_splitter.get_nodes_from_nodes(
                    nodes
                )

                for node in split_nodes:

                    metadata = node.metadata or {}

                    metadata["source"] = path.name
                    metadata["document_type"] = suffix

                    final_documents.append(
                        Document(
                            page_content=node.text,
                            metadata=metadata
                        )
                    )

            # Fallback to existing flow
            else:
                processor = DocumentProcessor(
                    chunk_size=settings.CHUNK_SIZE,
                    chunk_overlap=settings.CHUNK_OVERLAP
                )

                docs = processor.load_documents([source])

                chunks = processor.split_documents(docs)

                final_documents.extend(chunks)

        return final_documents
    

    def query(self, question: str):
        if self.init_error:
            raise ValueError("RAG initialization error: " + self.init_error)

        if self.rag is None:
            raise ValueError("RAG system is not initialized. Please ingest documents first.")

        return self.rag.run(question)

# Shared singleton instance
rag_service = RAGService()