from datetime import datetime
from bson import ObjectId
from app.database.connection import db


def get_dashboard_for_user(user_id: str) -> dict:
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {}

    completed_skills = len(user.get("completed_skills", []))
    completed_projects = len(user.get("completed_projects", []))
    resume_completion = user.get("resume_completion", 0)
    roadmap_completion = user.get("roadmap_completion", 0)

    score = (
        completed_skills * 0.4
        + completed_projects * 0.3
        + roadmap_completion * 0.2
        + resume_completion * 0.1
    )

    return {
        "selected_role": user.get("selected_role"),
        "skills_completed": completed_skills,
        "projects_completed": completed_projects,
        "resume_completion": resume_completion,
        "roadmap_completion": roadmap_completion,
        "job_readiness_score": min(100, int(score)),
        "last_updated": datetime.utcnow().isoformat() + "Z",
    }
