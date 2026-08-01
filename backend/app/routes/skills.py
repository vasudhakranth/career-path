from fastapi import APIRouter, HTTPException
from app.database.connection import db
from bson import ObjectId

router = APIRouter()


def slugify(value: str) -> str:
    return value.lower().replace("/", "-").replace(" ", "-")


def build_generic_skill_payload(skill_name: str, category: str = "Programming"):
    return {
        "id": slugify(skill_name),
        "skill_name": skill_name,
        "category": category,
        "description": f"Learn {skill_name} from fundamentals to practical implementation.",
        "overview": f"{skill_name} is a core technology used to build modern products and tools.",
        "topics": [
            {
                "id": f"{slugify(skill_name)}-basics",
                "title": f"{skill_name} Fundamentals",
                "level": "Beginner",
                "summary": f"Get a strong foundation in {skill_name} and understand the core concepts.",
                "explanation": f"This topic introduces the core patterns and mental models behind {skill_name} so you can start building with confidence.",
                "examples": [f"Use {skill_name} in a small hands-on example", f"Apply the concept to a real project"],
                "useCases": ["Building a starter project", "Learning the workflow", "Solving beginner exercises"],
                "code": f"# Example for {skill_name}\nprint('Start learning {skill_name}')",
                "interviewQuestions": [f"Why is {skill_name} important in modern development?", f"How would you explain {skill_name} to a beginner?"],
                "videos": [],
                "subtopics": []
            },
            {
                "id": f"{slugify(skill_name)}-practice",
                "title": f"Practical {skill_name} Workflows",
                "level": "Intermediate",
                "summary": f"Move from theory to real-world application with guided workflows.",
                "explanation": f"This stage helps you connect the basics to production-style use cases, debugging, and iteration.",
                "examples": [f"Build a mini app with {skill_name}", f"Refactor a small project"],
                "useCases": ["Portfolio projects", "Team collaboration", "Debugging and refactoring"],
                "code": f"# Practice example for {skill_name}\nresult = 'ready for the next step'\nprint(result)",
                "interviewQuestions": [f"How would you improve reliability in {skill_name}?", f"What trade-offs matter when using {skill_name}?"],
                "videos": [],
                "subtopics": []
            }
        ],
        "recommended_videos": [
            {
                "id": f"{slugify(skill_name)}-video",
                "title": f"{skill_name} Learning Guide",
                "channel": "EduMind Studio",
                "duration": "45m",
                "views": "120K views",
                "upload_date": "Recently added",
                "thumbnail_url": "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
                "url": "https://www.youtube.com/watch?v=ScMzIvxBSi4"
            }
        ],
    }


def build_skill_catalog():
    built_in = [
        build_generic_skill_payload("Python", "Programming"),
        build_generic_skill_payload("JavaScript", "Programming"),
        build_generic_skill_payload("React", "Frontend"),
        build_generic_skill_payload("SQL", "Databases"),
    ]
    return built_in


@router.get("/")
async def get_skills():
    skills = list(db.skills.find({}, {"_id": 1, "skill_name": 1, "category": 1, "description": 1}))
    if skills:
        items = []
        for skill in skills:
            payload = build_generic_skill_payload(skill["skill_name"], skill.get("category", "Programming"))
            items.append({
                "id": str(skill["_id"]),
                "skill_name": skill["skill_name"],
                "category": skill["category"],
                "description": skill["description"],
                "topic_count": len(payload.get("topics", [])),
            })
        return items

    catalog = build_skill_catalog()
    return [
        {
            "id": skill["id"],
            "skill_name": skill["skill_name"],
            "category": skill["category"],
            "description": skill["description"],
            "topic_count": len(skill.get("topics", [])),
        }
        for skill in catalog
    ]


@router.get("/skill/{skill_name}")
async def get_skill_content(skill_name: str):
    skill = None
    for item in build_skill_catalog():
        if item["skill_name"].lower() == skill_name.lower():
            skill = item
            break

    if not skill:
        skill = build_generic_skill_payload(skill_name)

    return {
        "id": skill["id"],
        "skill_name": skill["skill_name"],
        "category": skill["category"],
        "description": skill["description"],
        "overview": skill["overview"],
        "topics": skill["topics"],
        "recommended_videos": skill["recommended_videos"],
    }


@router.get("/{skill_id}")
async def get_skill(skill_id: str):
    try:
        skill = db.skills.find_one({"_id": ObjectId(skill_id)})
    except Exception:
        skill = None

    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {
        "id": str(skill["_id"]),
        "skill_name": skill["skill_name"],
        "category": skill["category"],
        "description": skill["description"],
    }
