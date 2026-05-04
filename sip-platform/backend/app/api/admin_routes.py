from datetime import datetime, timezone
import math
import os
from pathlib import Path
import shutil
import uuid

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    UploadFile
)

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import get_db
from app.core.security import get_current_admin

from app.database.db import SessionLocal

from app.services.rag_service import rag_service
from app.services.rag_service import DocumentService

from app.services.upload_service import (
    create_upload,
    update_upload,
    get_upload,
    list_uploads
)

router = APIRouter(
    tags=["Admin"]
)

RAW_DIR = settings.RAW_STORAGE_PATH

PROCESSED_DIR = settings.PROCESSED_STORAGE_PATH

MINUTES_PER_DOCUMENT = 2


def _utc_now():
    return datetime.now(timezone.utc)


def _estimate_minutes(total_documents: int):

    return max(
        1,
        math.ceil(total_documents * MINUTES_PER_DOCUMENT)
    )


def _process_uploaded_document(
    upload_id: str,
    raw_file_path: str
):

    db = SessionLocal()

    try:

        update_upload(
            db,
            upload_id,
            {
                "status": "processing",
                "stage": "loading_documents",
                "notification": None
            }
        )

        # Process PDF
        processed_path = DocumentService.process_pdf(
            raw_file_path
        )

        update_upload(
            db,
            upload_id,
            {
                "processed_file": processed_path
            }
        )

        # Ingest into RAG
        ingestion_summary = rag_service.ingest_processed_file(
            processed_path
        )

        update_upload(
            db,
            upload_id,
            {
                "status": "completed",
                "stage": "saved",
                "processed_file": processed_path,
                "documents_loaded": ingestion_summary.get(
                    "documents_loaded",
                    0
                ),
                "chunks_created": ingestion_summary.get(
                    "chunks_created",
                    0
                ),
                "completed_at": _utc_now(),
                "notification": "Document processed successfully!"
            }
        )

        print(f"Upload {upload_id} completed successfully.")

    except Exception as exc:

        update_upload(
            db,
            upload_id,
            {
                "status": "failed",
                "stage": "failed",
                "completed_at": _utc_now(),
                "error": str(exc),
                "notification": f"Processing failed: {exc}"
            }
        )

        print(f"Upload {upload_id} failed: {exc}")

    finally:

        db.close()


@router.post("/upload")
async def upload(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    try:

        os.makedirs(RAW_DIR, exist_ok=True)

        os.makedirs(PROCESSED_DIR, exist_ok=True)

        suffix = Path(
            file.filename or ""
        ).suffix.lower()

        if suffix != ".pdf":

            raise HTTPException(
                status_code=400,
                detail="Only PDF uploads are supported."
            )

        upload_id = str(uuid.uuid4())

        stored_filename = f"{upload_id}{suffix}"

        raw_file_path = os.path.join(
            RAW_DIR,
            stored_filename
        )

        # Save uploaded file
        with open(raw_file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        total_documents = len(
            list_uploads(db)
        ) + 1

        eta_minutes = _estimate_minutes(
            total_documents
        )

        # Save metadata to DB
        create_upload(
            db,
            {
                "id": upload_id,
                "original_filename": file.filename,
                "stored_filename": stored_filename,
                "raw_file": raw_file_path,
                "processed_file": None,
                "status": "queued",
                "stage": "queued",
                "uploaded_at": _utc_now(),
                "completed_at": None,
                "estimated_minutes": eta_minutes,
                "documents_loaded": 0,
                "chunks_created": 0,
                "error": None,
                "notification": None
            }
        )

        # Background processing
        background_tasks.add_task(
            _process_uploaded_document,
            upload_id,
            raw_file_path
        )

        return {
            "message": (
                "Your documents are being processed. "
                f"Please come back after {eta_minutes} minutes."
            ),
            "upload_id": upload_id,
            "status": "queued",
            "estimated_minutes": eta_minutes
        }

    except HTTPException:

        raise

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {exc}"
        )


@router.get("/uploads")
def get_all_uploads(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    uploads = list_uploads(db)

    return {
        "documents": uploads
    }


@router.get("/uploads/{upload_id}")
def get_single_upload(
    upload_id: str,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    upload = get_upload(
        db,
        upload_id
    )

    if upload is None:

        raise HTTPException(
            status_code=404,
            detail="Upload not found."
        )

    return upload