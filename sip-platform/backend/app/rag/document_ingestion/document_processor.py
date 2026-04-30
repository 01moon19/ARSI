
"""Document processing module for loading and splitting documents"""

from typing import List, Union
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from pathlib import Path
from langchain_community.document_loaders import (
    WebBaseLoader,
    PyMuPDFLoader,
    TextLoader,
    PyPDFDirectoryLoader
)

class DocumentProcessor:
    """Handles document loading and processing"""

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        """
        Initialize document processor

        Args:
            chunk_size: Size of text chunks
            chunk_overlap: Overlap between chunks
        """

        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
    
    def load_from_url(self, url: str) -> List[Document]:
        """Load documents from url"""
        loader = WebBaseLoader(
            [url],
            header_template={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64;)'}
        )
        return loader.load()
    
    def load_from_pdf_dir(self, directory: Union[str, Path]) -> List[Document]:
        """Load documents from all pdfs inside a directory"""
        loader = PyPDFDirectoryLoader(str(directory))
        return loader.load()
    
    def load_from_txt(self, file_path: Union[str, Path]) -> List[Document]:
        """Load documents from a txt file"""
        loader = TextLoader(str(file_path), encoding="utf-8")
        return loader.load()

    def load_from_pdf(self, file_path):
        try:
            loader = PyMuPDFLoader(str(file_path))

            docs = []
            for i, doc in enumerate(loader.lazy_load()):
                try:
                    if doc.page_content and len(doc.page_content.strip()) > 20:
                        docs.append(doc)
                except Exception as e:
                    print(f"⚠️ Skipping bad page {i}: {e}")
                    continue

            return docs

        except Exception as e:
            print(f"⚠️ Error loading PDF: {e}")
        return []
    
    def load_documents(self, sources: List[str]) -> List[Document]:
        """
        Load documents from URLs, PDF directories, or TXT files
        
        Args:
            sources: List of URLs, PDF folder paths, or TXT/PDF file paths
            
        Returns: 
            List of loaded documents
        """
        docs: List[Document] = []

        for src in sources:

            # URL
            if src.startswith("http://") or src.startswith("https://"):
                docs.extend(self.load_from_url(src))
                continue

            path = Path(src)

            # PDF Directory
            if path.is_dir():
                for file in path.iterdir():
                    if file.suffix.lower() == ".pdf":
                        docs.extend(self.load_from_pdf(file))
                    elif file.suffix.lower() == ".txt":
                        docs.extend(self.load_from_txt(file))
            
            # Single PDF
            elif path.suffix.lower() == ".pdf":
                docs.extend(self.load_from_pdf(path))

            # TXT File
            elif path.suffix.lower() == ".txt":
                docs.extend(self.load_from_txt(path))

            else:
                raise ValueError(
                    f"Unsupported source types: {src}. "
                    "Use URL, .pdf file, .txt file, or PDF directory."
                )

        return docs
    
    def split_documents(self, documents: List[Document]) -> List[Document]:
        """
        Split Documents into chunks
        
        Args:
            documents: List of documents to split
            
        Returns:
            List of split documents
        """
        return self.splitter.split_documents(documents)
    
    def process_urls(self, urls: List[str]) -> List[Document]:
        """
        Complete pipeline to load and split documents
        
        Args:
            urls: list of urls to process
        
        returns:
            list of processed document chunks
        """
        docs = self.load_documents(urls)
        return self.split_documents(docs)