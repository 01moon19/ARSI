from pathlib import Path

from fastapi import HTTPException

from app.core.config import settings


def resolve_trusted_file_path(raw_path: str) -> Path:
    candidate = Path(raw_path).expanduser()
    try:
        resolved = candidate.resolve()
    except OSError:
        raise HTTPException(status_code=400, detail="Invalid file path.")

    roots = [
        Path(settings.PROCESSED_STORAGE_PATH).resolve(),
        Path(settings.RAW_STORAGE_PATH).resolve(),
    ]

    allowed = False
    for root in roots:
        try:
            resolved.relative_to(root)
            allowed = True
            break
        except ValueError:
            continue

    if not allowed:
        raise HTTPException(
            status_code=400,
            detail="File path must be under configured storage directories.",
        )

    if not resolved.is_file():
        raise HTTPException(status_code=400, detail="File does not exist or is not a file.")

    return resolved