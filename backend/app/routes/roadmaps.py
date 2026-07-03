from fastapi import APIRouter, HTTPException
from app.database.connection import db
from bson import ObjectId

router = APIRouter()

@router.get("/")
async def get_roadmaps():
    roadmaps = list(db.roadmaps.find())
    return [
        {
            "id": str(roadmap["_id"]),
            "role_name": roadmap["role_name"],
            "phase": roadmap["phase"],
            "skills": roadmap.get("skills", []),
        }
        for roadmap in roadmaps
    ]

@router.get("/{role_name}")
async def get_roadmap_by_role(role_name: str):
    roadmaps = list(db.roadmaps.find({"role_name": role_name}))
    if not roadmaps:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return [
        {
            "id": str(roadmap["_id"]),
            "role_name": roadmap["role_name"],
            "phase": roadmap["phase"],
            "skills": roadmap.get("skills", []),
        }
        for roadmap in roadmaps
    ]
