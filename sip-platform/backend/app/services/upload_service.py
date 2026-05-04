#upload creation logic
from sqlalchemy.orm import Session

from app.database.models.upload import Upload


def create_upload(
    db: Session,
    upload_data: dict
):

    upload = Upload(**upload_data)

    db.add(upload)

    db.commit()

    db.refresh(upload)

    return upload

#update logic
def update_upload(
    db: Session,
    upload_id: str,
    updates: dict
):

    upload = db.query(Upload).filter(
        Upload.id == upload_id
    ).first()

    if upload is None:
        return None

    for key, value in updates.items():
        setattr(upload, key, value)

    db.commit()

    db.refresh(upload)

    return upload

#get logic
def get_upload(
    db: Session,
    upload_id: str
):

    return db.query(Upload).filter(
        Upload.id == upload_id
    ).first()

#list logic
def list_uploads(db: Session):

    return db.query(Upload).all()