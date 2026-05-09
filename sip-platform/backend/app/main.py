# from fastapi import FastAPI
# from contextlib import asynccontextmanager

# from app.api import routes
# from app.api.admin_routes import router as admin_router

# from app.database.db import Base, engine
# from app.database.models.user import User

# Base.metadata.create_all(bind=engine)

# from app.api.auth_routes import router as auth_router

# app.include_router(auth_router)

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # initialize RAG
#     try:
#         routes.rag_service.initialize([
#             "data/processed"
#         ])
#     except Exception as e:
#         print(f"⚠️ RAG initialization failed during startup: {e}")
#     yield


# app = FastAPI(
#     title="SIP Platform API",
#     lifespan=lifespan
# )

# # ✅ include routers
# app.include_router(routes.router)   # <-- IMPORTANT
# app.include_router(admin_router)


# @app.get("/")
# def root():
#     return {"message": "API is running"}

from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.api.admin_routes import router as admin_router
from app.api.auth_routes import router as auth_router
from app.api.chat_routes import router as chat_router
from app.api.upload_routes import router as upload_router

from app.services.rag_service import rag_service
from app.database.models.upload import Upload

from app.database.db import Base, engine
from app.database.models.user import User

from app.core.config import settings

from app.integrations.firebase_client import init_firebase


# Create database tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):

    try:

        init_firebase()
        rag_service.load_existing_index()

    except Exception as e:

         # Keep output ASCII-only (Windows consoles may default to cp1252).
        print(f"[WARN] Startup initialization failed: {e}")

    yield


app = FastAPI(
    title="SIP Platform API",
    lifespan=lifespan
)


# Routers
app.include_router(admin_router)

app.include_router(auth_router)

app.include_router(chat_router)

app.include_router(upload_router)


@app.get("/")
def root():

    return {
        "message": "API is running"
    }