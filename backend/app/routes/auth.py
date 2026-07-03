from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from app.models.schemas import UserCreate, UserLogin
from app.database.connection import db
from app.auth.security import get_password_hash, verify_password, create_access_token, decode_access_token
from bson import ObjectId

router = APIRouter()

class RoleUpdate(BaseModel):
    role_name: str

class ResumeUpdate(BaseModel):
    completion: int


def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "selected_role": user.get("selected_role"),
        "created_at": user.get("created_at"),
        "completed_skills": user.get("completed_skills", []),
        "completed_projects": user.get("completed_projects", []),
        "resume_completion": user.get("resume_completion", 0),
        "roadmap_completion": user.get("roadmap_completion", 0),
    }

async def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["user_id"]

@router.post("/register")
async def register_user(user: UserCreate):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email is already registered")

    hashed_password = get_password_hash(user.password)
    result = db.users.insert_one(
        {
            "name": user.name,
            "email": user.email,
            "password": hashed_password,
            "selected_role": None,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "completed_skills": [],
            "completed_projects": [],
            "resume_completion": 0,
            "roadmap_completion": 0,
        }
    )
    created_user = db.users.find_one({"_id": result.inserted_id})
    token = create_access_token({"user_id": str(result.inserted_id), "email": user.email})
    return {"user": serialize_user(created_user), "access_token": token}

@router.post("/login")
async def login_user(user: UserLogin):
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": str(db_user["_id"]), "email": db_user["email"]})
    return {"user": serialize_user(db_user), "access_token": token}

@router.get("/me")
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    db_user = db.users.find_one({"_id": ObjectId(user_id)})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_user(db_user)

@router.put("/me/role")
async def update_role(payload: RoleUpdate, user_id: str = Depends(get_current_user_id)):
    result = db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"selected_role": payload.role_name}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    db_user = db.users.find_one({"_id": ObjectId(user_id)})
    return serialize_user(db_user)

@router.put("/me/resume")
async def update_resume_progress(payload: ResumeUpdate, user_id: str = Depends(get_current_user_id)):
    if payload.completion < 0 or payload.completion > 100:
        raise HTTPException(status_code=400, detail="Completion must be between 0 and 100")

    result = db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"resume_completion": payload.completion}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    db_user = db.users.find_one({"_id": ObjectId(user_id)})
    return serialize_user(db_user)
