from fastapi import APIRouter, HTTPException, Depends, Header
from app.services.dashboard import get_dashboard_for_user
from app.auth.security import decode_access_token

router = APIRouter()

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["user_id"]

@router.get("/")
async def dashboard(user_id: str = Depends(get_current_user)):
    dashboard_data = get_dashboard_for_user(user_id)
    if not dashboard_data:
        raise HTTPException(status_code=404, detail="Dashboard data not found")
    return dashboard_data
