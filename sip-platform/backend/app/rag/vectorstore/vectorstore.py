"""Vector store module for document embedding and retrieval"""

import os
from typing import List
import time
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from google.genai.errors import ClientError

from langchain_core.documents import Document

class EmbeddingCounter:
    count = 0

    @classmethod
    def increment(cls, n=1):
        cls.count += n

    @classmethod
    def reset(cls):
        cls.count = 0

    @classmethod
    def get_count(cls):
        return cls.count

class BatchGoogleGenerativeAIEmbeddings(GoogleGenerativeAIEmbeddings):
    def _parse_retry_delay(self, err):
        # in practice, Google error may include retry info in details; fallback to duration in message.
        if hasattr(err, 'details') and isinstance(err.details, dict):
            # errors structure may include retryInfo.retryDelay
            details = err.details.get('error', err.details)
            if isinstance(details, dict):
                for d in details.get('details', []):
                    if d.get('@type', '').endswith('RetryInfo'):
                        retry_delay = d.get('retryDelay')
                        if isinstance(retry_delay, str) and retry_delay.endswith('s'):
                            try:
                                return float(retry_delay[:-1])
                            except ValueError:
                                pass
        message = getattr(err, 'message', '')
        if isinstance(message, str) and 'retry in' in message.lower():
            import re
            m = re.search(r'retry in (\d+\.?\d*)s', message.lower())
            if m:
                return float(m.group(1))
        return None

    def _embed_with_retry(self, batch):
        max_attempts = 7
        base_delay = 1.0
        for attempt in range(1, max_attempts + 1):
            try:
                return super().embed_documents(batch)
            except ClientError as e:
                if e.code == 429 or (getattr(e, 'status', None) == 'RESOURCE_EXHAUSTED'):
                    retry_wait = self._parse_retry_delay(e) or min(base_delay * (2 ** (attempt - 1)), 60)
                    print(f"⚠️ 429/RESOURCE_EXHAUSTED received; attempt {attempt}/{max_attempts}; waiting {retry_wait:.1f}s")
                    time.sleep(retry_wait)
                    continue
                raise
            except Exception:
                raise
        raise RuntimeError('Embedding failed after retrying due to quota limits.')

    def embed_documents(self, texts, *args, **kwargs):
        batch_size = 8  # reduce batch size to stay under request quota boundaries
        embeddings = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            EmbeddingCounter.increment(len(batch))
            batch_embeddings = self._embed_with_retry(batch)
            embeddings.extend(batch_embeddings)
            # extra buffer between calls to avoid burst quota violations
            time.sleep(1.0)
        return embeddings

    def embed_query(self, text, *args, **kwargs):
        EmbeddingCounter.increment(1)
        return super().embed_query(text, *args, **kwargs)

class VectorStore:
    """Manages vector store application"""
    def __init__(self, faiss_path: str = "db/faiss_index"):
        self.embedding = BatchGoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001"
        )
        self.vectorstore = None
        self.retriever = None
        self.faiss_path = faiss_path

    def create_vectorstore(self, documents: List[Document]):
        """Load an existing vector store when available, otherwise create one."""
        if not documents:
            raise ValueError("No documents provided to create the vector store.")

        os.makedirs(self.faiss_path, exist_ok=True)
        index_file = os.path.join(self.faiss_path, "index.faiss")

        if os.path.exists(index_file):
            print(f"Loading existing vector store from {self.faiss_path}...")
            self.vectorstore = FAISS.load_local(
                self.faiss_path,
                self.embedding,
                allow_dangerous_deserialization=True
            )
        else:
            print(f"Creating vector store from {len(documents)} documents...")
            self.vectorstore = FAISS.from_documents(documents, self.embedding)
            self.vectorstore.save_local(self.faiss_path)

        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={
                "k": 5,
                "score_threshold": 0.5
            }
        )

    # def create_vectorstore(self, documents: List[Document]):
    #     """
    #     Create or load vector store from disk if available, otherwise from documents.
        
    #     Args:
    #         documents: List of documents to embed
    #     """
    #     if os.path.exists(self.faiss_path):
    #         self.vectorstore = FAISS.load_local(self.faiss_path, self.embedding)
    #     else:
    #         self.vectorstore = FAISS.from_documents(documents, self.embedding)
    #         self.vectorstore.save_local(self.faiss_path)
    #     self.retriever = self.vectorstore.as_retriever()
    def add_documents(self, documents: List[Document]):

        index_file = os.path.join(self.faiss_path, "index.faiss")

        if os.path.exists(index_file):
            print("🔄 Loading existing FAISS index...")
            self.vectorstore = FAISS.load_local(
                self.faiss_path,
                self.embedding,
                allow_dangerous_deserialization=True
            )

            print(f"➕ Adding {len(documents)} new documents...")
            self.vectorstore.add_documents(documents)

        else:
            print("🆕 Creating new FAISS index...")
            self.vectorstore = FAISS.from_documents(documents, self.embedding)

        # save updated index
        self.vectorstore.save_local(self.faiss_path)

        # 🔥 IMPORTANT: better retriever
        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={
                "k": 5,
                "score_threshold": 0.5
            }
        )

    # def create_vectorstore(self, documents: List[Document]):

    #     index_file = os.path.join(self.faiss_path, "index.faiss")

    #     if os.path.exists(index_file):
    #         print("Loading existing FAISS index...")
    #         self.vectorstore = FAISS.load_local(self.faiss_path, self.embedding, allow_dangerous_deserialization=True)
    #     else:
    #         print("Creating new FAISS index...")
    #         try:
    #             self.vectorstore = FAISS.from_documents(documents, self.embedding)
    #             self.vectorstore.save_local(self.faiss_path)
    #         except ClientError as err:
    #             print(f"❗ ERROR creating FAISS index: {err}")
    #             if err.code == 429 or getattr(err, 'status', None) == 'RESOURCE_EXHAUSTED':
    #                 raise RuntimeError(
    #                     "Quota exceeded while building embeddings. "
    #                     "Wait a moment, reduce docs/requests, or upgrade API quota, then retry."
    #                 ) from err
    #             raise

    #     # self.retriever = self.vectorstore.as_retriever()
    #     self.retriever = self.vectorstore.as_retriever(
    #         search_type="similarity_score_threshold",
    #         search_kwargs={
    #             "k": 5,
    #             "score_threshold": 0.5
    #         }
    #     )
        
    def get_retriever(self):
        """
        Get the retriever instance
        
        Returns:
            retriever instance
        """
        if self.retriever is None:
            raise ValueError("Vector store not initialized. Call create_vectorstore first.")
        return self.retriever
    
    def retrieve(self, query:str, k: int = 4) -> List[Document]:
        """
        Retrieve relevant documents for a query
        
        Args:
            query: search query
            k: Number of documents to retrieve
        
        Returns:
            List of relevant documents
        """
        if self.retriever is None:
            raise ValueError("Vector store not initialized. Call create_vectorstore first.")
        # return self.retriever.invoke(query)

        # 🔥 get docs + scores
        docs_and_scores = self.vectorstore.similarity_search_with_score(query, k=k)

        filtered_docs = []

        print("\n🔍 Retrieved Docs:")
        
        for doc, score in docs_and_scores:
            # lower score = better match (FAISS logic)
            if score < 1.0:
                doc.metadata["score"] = score   # ✅ STEP 4 (metadata)
                filtered_docs.append(doc)

                # ✅ STEP 3 (debug print)
                print(f"Score: {score}")
                print(doc.page_content[:200])
                print("-" * 50)

        return filtered_docs
