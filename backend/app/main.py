from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, roles, skills, roadmaps, projects, dashboard, resume

app = FastAPI(
    title="EduMind API",
    description="Backend API for EduMind career roadmap platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(roles.router, prefix="/api/roles", tags=["Roles"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(roadmaps.router, prefix="/api/roadmaps", tags=["Roadmaps"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])

@app.get("/")
async def root():
    return {"message": "Welcome to EduMind backend"}
