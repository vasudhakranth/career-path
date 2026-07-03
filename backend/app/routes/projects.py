from fastapi import APIRouter, HTTPException, Depends
from app.database.connection import db
from app.auth.security import decode_access_token
from bson import ObjectId
from fastapi import Header

router = APIRouter()

async def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["user_id"]

@router.get("/")
async def get_projects():
    projects = list(db.projects.find())
    return [
        {
            "id": str(project["_id"]),
            "project_name": project["project_name"],
            "description": project["description"],
            "difficulty": project["difficulty"],
            "technologies": project.get("technologies", []),
        }
        for project in projects
    ]

@router.get("/{project_id}")
async def get_project(project_id: str):
    project = db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "id": str(project["_id"]),
        "project_name": project["project_name"],
        "description": project["description"],
        "difficulty": project["difficulty"],
        "technologies": project.get("technologies", []),
    }

@router.post("/{project_id}/complete")
async def complete_project(project_id: str, user_id: str = Depends(get_current_user_id)):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    project = db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    completed = user.get("completed_projects", [])
    if project_id not in completed:
        completed.append(project_id)
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"completed_projects": completed}})
    return {"message": "Project marked as completed", "completed_projects": completed}
