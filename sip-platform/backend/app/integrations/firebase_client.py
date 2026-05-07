import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings
def init_firebase() -> None:
    if firebase_admin._apps:
        return
    if settings.FIREBASE_CREDENTIALS_PATH:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()
def get_firestore():
    init_firebase()
    return firestore.client()