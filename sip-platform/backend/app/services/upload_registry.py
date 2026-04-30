import json
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List, Optional


class UploadRegistry:
    """Simple local registry for uploaded documents and processing state."""

    _lock = Lock()
    _registry_path = Path("data/uploads/upload_registry.json")

    @classmethod
    def _ensure_registry(cls) -> None:
        cls._registry_path.parent.mkdir(parents=True, exist_ok=True)
        if not cls._registry_path.exists():
            cls._registry_path.write_text("[]", encoding="utf-8")

    @classmethod
    def _read_all(cls) -> List[Dict[str, Any]]:
        cls._ensure_registry()
        with cls._lock:
            payload = json.loads(cls._registry_path.read_text(encoding="utf-8"))
        return payload if isinstance(payload, list) else []

    @classmethod
    def _write_all(cls, records: List[Dict[str, Any]]) -> None:
        cls._ensure_registry()
        with cls._lock:
            cls._registry_path.write_text(
                json.dumps(records, indent=2),
                encoding="utf-8"
            )

    @classmethod
    def create_record(cls, record: Dict[str, Any]) -> Dict[str, Any]:
        records = cls._read_all()
        records.append(record)
        cls._write_all(records)
        return record

    @classmethod
    def update_record(cls, upload_id: str, **updates: Any) -> Optional[Dict[str, Any]]:
        records = cls._read_all()
        updated = None

        for record in records:
            if record.get("id") == upload_id:
                record.update(updates)
                updated = record
                break

        if updated is not None:
            cls._write_all(records)

        return updated

    @classmethod
    def get_record(cls, upload_id: str) -> Optional[Dict[str, Any]]:
        for record in cls._read_all():
            if record.get("id") == upload_id:
                return record
        return None

    @classmethod
    def list_records(cls) -> List[Dict[str, Any]]:
        return cls._read_all()
