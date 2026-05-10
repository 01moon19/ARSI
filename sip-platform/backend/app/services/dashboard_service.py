from sqlalchemy.orm import Session

from app.database.models.upload import Upload
from app.database.models.user import User


class DashboardService:

    @staticmethod
    def get_system_analytics(
        db: Session
    ):

        total_documents = (
            db.query(Upload)
            .count()
        )

        total_users = (
            db.query(User)
            .count()
        )

        processed_documents = (

            db.query(Upload)

            .filter(
                Upload.status == "completed"
            )

            .count()
        )

        failed_documents = (

            db.query(Upload)

            .filter(
                Upload.status == "failed"
            )

            .count()
        )

        processing_documents = (

            db.query(Upload)

            .filter(
                Upload.status == "processing"
            )

            .count()
        )

        recent_uploads = (

            db.query(Upload)

            .order_by(
                Upload.uploaded_at.desc()
            )

            .limit(5)

            .all()
        )

        return {

            "total_documents":
                total_documents,

            "total_users":
                total_users,

            "processed_documents":
                processed_documents,

            "failed_documents":
                failed_documents,

            "processing_documents":
                processing_documents,

            "recent_uploads": [

                {
                    "id": upload.id,

                    "filename":
                        upload.original_filename,

                    "status":
                        upload.status,

                    "uploaded_at":
                        upload.uploaded_at,

                    "chunks":
                        upload.chunks_created,
                }

                for upload in recent_uploads
            ]
        }