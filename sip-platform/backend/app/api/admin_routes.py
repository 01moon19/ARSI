from datetime import datetime, timezone
import math
import os
from pathlib import Path
import shutil
import uuid

from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile

from app.api import routes
from app.services.rag_service import DocumentService
from app.services.upload_registry import UploadRegistry

router = APIRouter()

RAW_DIR = "data/raw"
PROCESSED_DIR = "data/processed"
MINUTES_PER_DOCUMENT = 2


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _estimate_minutes(total_documents: int) -> int:
    return max(1, math.ceil(total_documents * MINUTES_PER_DOCUMENT))


def _process_uploaded_document(upload_id: str, raw_file_path: str):
    UploadRegistry.update_record(
        upload_id,
        status="processing",
        stage="loading_documents",
        notification=None
    )

    try:
        processed_path = DocumentService.process_pdf(raw_file_path)

        UploadRegistry.update_record(
            upload_id,
            processed_file=processed_path
        )

        ingestion_summary = routes.rag_service.ingest_processed_file(
            processed_path,
            progress_callback=lambda stage: UploadRegistry.update_record(upload_id, stage=stage)
        )

        UploadRegistry.update_record(
            upload_id,
            status="completed",
            stage="saved",
            processed_file=processed_path,
            documents_loaded=ingestion_summary["documents_loaded"],
            chunks_created=ingestion_summary["chunks_created"],
            completed_at=_utc_now(),
            notification="Your documents have been successfully processed!"
        )
        print(f"Upload {upload_id} completed successfully.")

    except Exception as exc:
        UploadRegistry.update_record(
            upload_id,
            status="failed",
            stage="failed",
            completed_at=_utc_now(),
            error=str(exc),
            notification=f"Document processing failed: {exc}"
        )
        print(f"Upload {upload_id} failed: {exc}")


@router.post("/upload")
async def upload(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        os.makedirs(RAW_DIR, exist_ok=True)
        os.makedirs(PROCESSED_DIR, exist_ok=True)

        suffix = Path(file.filename or "").suffix.lower()
        if suffix != ".pdf":
            raise HTTPException(
                status_code=400,
                detail="Only PDF uploads are supported."
            )

        upload_id = str(uuid.uuid4())
        stored_filename = f"{upload_id}{suffix}"
        raw_file_path = os.path.join(RAW_DIR, stored_filename)

        with open(raw_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        total_documents = len(UploadRegistry.list_records()) + 1
        eta_minutes = _estimate_minutes(total_documents)

        UploadRegistry.create_record({
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
        })

        background_tasks.add_task(_process_uploaded_document, upload_id, raw_file_path)

        return {
            "message": f"Your documents are being processed please come back after {eta_minutes} minutes",
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
def list_uploads():
    return {"documents": UploadRegistry.list_records()}


@router.get("/uploads/{upload_id}")
def get_upload(upload_id: str):
    record = UploadRegistry.get_record(upload_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Upload not found.")

    return record
