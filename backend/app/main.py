from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, roles, skills, roadmaps, projects, dashboard
from app.routes.youtube_routes import router as youtube_router


# NOTE: resume router includes endpoints that require multipart/form-data.
# Importing it eagerly can break startup if multipart dependencies are misconfigured.
# It will be included conditionally below.


app = FastAPI(
    title="EduMind API",
    description="Backend API for EduMind career roadmap platform",
    version="0.1.0",
)

# Configure CORS for local development, allowing any origin so the frontend can run on any local port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
app.include_router(youtube_router, prefix="/api/youtube", tags=["YouTube"])
from app.routes import execute
app.include_router(execute.router, prefix="/api/execute", tags=["Execute"])

# Import resume router only when multipart endpoints are required.
# This avoids startup failures if multipart dependency checks are misconfigured.
try:
    from app.routes import resume
    app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
except Exception:
    # Resume endpoints will be unavailable until dependencies are fixed.
    pass

# Interview questions (resume-aware)
from app.routes import interview
app.include_router(interview.router, prefix="/api/interview", tags=["Interview"])


@app.get("/")

async def root():
    return {"message": "Welcome to EduMind backend"}
