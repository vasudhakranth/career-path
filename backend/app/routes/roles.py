from fastapi import APIRouter, HTTPException
from app.database.connection import db
from bson import ObjectId

router = APIRouter()

@router.get("/")
async def get_roles():
    roles = list(db.roles.find())
    return [{"id": str(role["_id"]), "role_name": role["role_name"], "description": role["description"]} for role in roles]

@router.get("/{role_id}")
async def get_role(role_id: str):
    role = db.roles.find_one({"_id": ObjectId(role_id)})
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return {"id": str(role["_id"]), "role_name": role["role_name"], "description": role["description"]}
