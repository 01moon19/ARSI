from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.core.security import get_current_admin

from app.database.models.user import User


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# Get all users
@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin)
):

    users = db.query(User).all()

    return users


# Approve user
@router.patch("/users/{user_id}/approve")
def approve_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_active = True

    db.commit()

    return {
        "message": "User approved successfully"
    }


# Delete user
@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)

    db.commit()

    return {
        "message": "User deleted successfully"
    }