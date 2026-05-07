"""Configuration module for Agentic RAG system"""

# import os
# from dotenv import load_dotenv
# from langchain.chat_models import init_chat_model

# #load environment varibles
# load_dotenv(override=True)  # Override existing env vars with .env values


# class Config:
#     # API Keys
#     # OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
#     GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
#     # GROQ_API_KEY removed

#     # Model Configuration
#     # LLM_MODEL = "openai:gpt-4o"
#     LLM_MODEL = "gemini-2.5-flash"
#     LLM_PROVIDER = "google_genai"

#     # Document Processing
#     CHUNK_SIZE = 800
#     CHUNK_OVERLAP = 150

#     # Default URLs
#     DEFAULT_URLS = [
#         "https://commoncrawl.org/2022/03/host-and-domain-level-web-graphs-oct-nov-jan-2021-2022/",
#         "https://commoncrawl.github.io/cc-crawl-statistics/",
#         "https://www.businessinsider.com/?r=US&IR=T",
#         "https://www.hola.com/",
#         "https://www.orange.fr/portail",
#         "http://go.com/",
#         "https://www.nbcnews.com/"
#     ]

#     @classmethod
#     def get_llm(cls):
#         """Initialize and return the LLM model using Google API key and provider"""
#         if not cls.GOOGLE_API_KEY or not isinstance(cls.GOOGLE_API_KEY, str):
#             raise ValueError("GOOGLE_API_KEY is not set or is not a string. Please check your .env file.")
#         os.environ["GOOGLE_API_KEY"] = cls.GOOGLE_API_KEY
#         return init_chat_model(cls.LLM_MODEL, api_key=cls.GOOGLE_API_KEY, model_provider=cls.LLM_PROVIDER)


# # from app.core.config import Config
# # print("GOOGLE_API_KEY:", Config.GOOGLE_API_KEY)

from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from pathlib import Path

BACKEND_DIR = Path(__file__).parent.parent

load_dotenv()


class Settings(BaseSettings):

    # =========================
    # APP
    # =========================
    APP_NAME: str = "SIP Platform"

    # =========================
    # GOOGLE GEMINI
    # =========================
    GOOGLE_API_KEY: str

    LLM_MODEL: str = "gemini-2.5-flash"
    LLM_PROVIDER: str = "google_genai"

    # =========================
    # DOCUMENT PROCESSING
    # =========================
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 150

    # =========================
    # DATABASE
    # =========================
    DATABASE_URL: str

    # =========================
    # JWT AUTH
    # =========================
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # =========================
    # STORAGE PATHS
    # =========================
    RAW_STORAGE_PATH: str = str(BACKEND_DIR / "storage/raw")
    PROCESSED_STORAGE_PATH: str = str(BACKEND_DIR / "storage/processed")
    VECTOR_STORAGE_PATH: str = str(BACKEND_DIR / "storage/vectors")

    # =========================
    # FIREBASE (Firestore via firebase-admin)
    # =========================
    FIREBASE_CREDENTIALS_PATH: str | None = None
    
    class Config:
        env_file = ".env"


settings = Settings()