from fastapi import APIRouter, HTTPException
from app.database.connection import db
from bson import ObjectId

router = APIRouter()

@router.get("/")
async def get_skills():
    skills = list(db.skills.find())
    return [
        {
            "id": str(skill["_id"]),
            "skill_name": skill["skill_name"],
            "category": skill["category"],
            "description": skill["description"],
        }
        for skill in skills
    ]

@router.get("/{skill_id}")
async def get_skill(skill_id: str):
    skill = db.skills.find_one({"_id": ObjectId(skill_id)})
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {
        "id": str(skill["_id"]),
        "skill_name": skill["skill_name"],
        "category": skill["category"],
        "description": skill["description"],
    }
