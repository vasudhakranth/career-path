from datetime import datetime
from app.database.connection import db

roles = [
    {"role_name": "Full Stack Developer", "description": "Build complete web applications with frontend and backend."},
    {"role_name": "Frontend Developer", "description": "Create user-facing interfaces with modern web tools."},
    {"role_name": "Backend Developer", "description": "Design APIs, services, and server-side systems."},
    {"role_name": "Data Analyst", "description": "Analyze business data and build reports."},
    {"role_name": "Data Scientist", "description": "Build predictive models and AI workflows."},
    {"role_name": "AI/ML Engineer", "description": "Create machine learning solutions and deploy models."},
    {"role_name": "DevOps Engineer", "description": "Automate infrastructure and deployment pipelines."},
    {"role_name": "Cybersecurity Analyst", "description": "Protect systems, monitor threats, and secure applications."},
    {"role_name": "Mobile App Developer", "description": "Develop mobile applications for iOS and Android."},
]

skills = [
    # Frontend Skills
    {"skill_name": "HTML", "category": "Frontend", "description": "Markup language for creating web page structure and content."},
    {"skill_name": "CSS", "category": "Frontend", "description": "Styling language for designing beautiful and responsive web pages."},
    {"skill_name": "Bootstrap", "category": "Frontend", "description": "Popular CSS framework for building responsive web designs quickly."},
    {"skill_name": "React", "category": "Frontend", "description": "A library for building interactive and dynamic user interfaces."},
    
    # Programming Languages
    {"skill_name": "JavaScript", "category": "Programming", "description": "The language of the web used for frontend and backend development."},
    {"skill_name": "Python", "category": "Programming", "description": "A versatile programming language used for backend and data science."},
    {"skill_name": "Java", "category": "Programming", "description": "Object-oriented language used for enterprise and Android development."},
    {"skill_name": "PHP", "category": "Programming", "description": "Server-side scripting language for web application development."},
    
    # Backend & Frameworks
    {"skill_name": "Node.js", "category": "Backend", "description": "JavaScript runtime used to build scalable backend services."},
    {"skill_name": "Django", "category": "Backend", "description": "Python web framework for building robust web applications."},
    
    # Databases
    {"skill_name": "MongoDB", "category": "Databases", "description": "A NoSQL document database for modern applications."},
    {"skill_name": "SQL", "category": "Databases", "description": "Query language for managing and manipulating relational databases."},
    {"skill_name": "MySQL", "category": "Databases", "description": "Popular open-source relational database management system."},
    
    # DevOps
    {"skill_name": "Docker", "category": "DevOps", "description": "Containerization platform for consistent deployments."},
]

roadmaps = [
    {"role_name": "Full Stack Developer", "phase": "Fundamentals", "skills": ["HTML", "CSS", "JavaScript", "Git"]},
    {"role_name": "Full Stack Developer", "phase": "Frontend", "skills": ["React.js", "Redux", "Tailwind CSS"]},
    {"role_name": "Full Stack Developer", "phase": "Backend", "skills": ["Python", "FastAPI", "Databases"]},
    {"role_name": "Full Stack Developer", "phase": "Databases", "skills": ["MongoDB", "PostgreSQL"]},
    {"role_name": "Full Stack Developer", "phase": "Deployment", "skills": ["Docker", "AWS"]},
    {"role_name": "Full Stack Developer", "phase": "Advanced Projects", "skills": ["Full Stack Capstone", "Performance Optimization"]},
]

projects = [
    {
        "project_name": "Attendance Management System",
        "description": "Build a full-stack attendance tracker with backend APIs and responsive UI.",
        "difficulty": "Intermediate",
        "technologies": ["React", "FastAPI", "MongoDB"],
    },
    {
        "project_name": "Resume Builder Portal",
        "description": "Create a resume builder with templates, ATS tips, and download functionality.",
        "difficulty": "Beginner",
        "technologies": ["React", "Tailwind CSS", "FastAPI"],
    },
    {
        "project_name": "Job Readiness Dashboard",
        "description": "Visualize skill progress, project completion, and readiness scores.",
        "difficulty": "Intermediate",
        "technologies": ["React", "Recharts", "FastAPI"],
    },
]


def seed_collection(collection, items, key_field):
    existing = list(collection.find())
    if existing:
        print(f"Skipping {collection.name}, already has data.")
        return
    collection.insert_many(items)
    print(f"Seeded {collection.name} with {len(items)} records.")


if __name__ == "__main__":
    seed_collection(db.roles, roles, "role_name")
    seed_collection(db.skills, skills, "skill_name")
    seed_collection(db.roadmaps, roadmaps, "role_name")
    seed_collection(db.projects, projects, "project_name")
    print("Seed script completed.")
