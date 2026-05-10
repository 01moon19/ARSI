#register route
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from app.core.dependencies import get_db

from app.database.schemas.auth_schema import (
    UserRegister,
    UserLogin
)

from app.services.auth_service import (
    create_user,
    authenticate_user
)

from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):

    user = create_user(
        db,
        user_data.email,
        user_data.password
    )

    return {
        "message": "User created successfully"
    }

#login route
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        db,
        form_data.username,
        form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "email": user.email
    }