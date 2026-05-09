#user creation logic 
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.models.user import User
from app.core.security import (
    hash_password,
    verify_password
)


def create_user(
    db: Session,
    email: str,
    password: str,
    is_active: bool = False
):

    hashed_password = hash_password(password)

    user = User(
        email=email,
        password_hash=hashed_password,
        is_active=is_active
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

#user authentication logic
def authenticate_user(
    db: Session,
    email: str,
    password: str,
    
    ):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None
    
    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Wait for admin approval"
        )

    return user