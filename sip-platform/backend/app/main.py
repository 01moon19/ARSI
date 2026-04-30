from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.api import routes
from app.api.admin_routes import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # initialize RAG
    try:
        routes.rag_service.initialize([
            "data/processed"
        ])
    except Exception as e:
        print(f"⚠️ RAG initialization failed during startup: {e}")
    yield


app = FastAPI(
    title="SIP Platform API",
    lifespan=lifespan
)

# ✅ include routers
app.include_router(routes.router)   # <-- IMPORTANT
app.include_router(admin_router)


@app.get("/")
def root():
    return {"message": "API is running"}