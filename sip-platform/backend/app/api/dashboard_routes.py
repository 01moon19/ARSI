from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.core.security import (
    get_current_user
)

from app.services.dashboard_service import (
    DashboardService
)

from app.services.business_insights_service import (
    BusinessInsightService
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/data")
def get_dashboard_data(

    db: Session = Depends(get_db),

    current_user=Depends(
        get_current_user
    )
):

    response = {

        "business_insights":
            BusinessInsightService.generate_insights()
    }

    # ADMIN ONLY SYSTEM ANALYTICS

    if current_user.role == "admin":

        response[
            "system_analytics"
        ] = DashboardService.get_system_analytics(
            db
        )

    return response