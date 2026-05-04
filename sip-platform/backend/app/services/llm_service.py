import os
from langchain.chat_models import init_chat_model

from app.core.config import settings


def get_llm():

    os.environ["GOOGLE_API_KEY"] = settings.GOOGLE_API_KEY

    return init_chat_model(
        settings.LLM_MODEL,
        api_key=settings.GOOGLE_API_KEY,
        model_provider=settings.LLM_PROVIDER
    )