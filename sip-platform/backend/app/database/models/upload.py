from sqlalchemy import Column, Integer, String, DateTime

from app.database.db import Base


class Upload(Base):

    __tablename__ = "uploads"

    id = Column(String, primary_key=True, index=True)

    original_filename = Column(String, nullable=False)

    stored_filename = Column(String, nullable=False)

    raw_file = Column(String, nullable=False)

    processed_file = Column(String, nullable=True)

    status = Column(String, default="queued")

    stage = Column(String, default="queued")

    uploaded_at = Column(DateTime)

    completed_at = Column(DateTime, nullable=True)

    estimated_minutes = Column(Integer, default=0)

    documents_loaded = Column(Integer, default=0)

    chunks_created = Column(Integer, default=0)

    error = Column(String, nullable=True)

    notification = Column(String, nullable=True)