from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    selected_role: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        orm_mode = True

class Role(BaseModel):
    id: str
    role_name: str
    description: str

class Skill(BaseModel):
    id: str
    skill_name: str
    category: str
    description: str

class Roadmap(BaseModel):
    id: str
    role_name: str
    phase: str
    skills: List[str]

class Project(BaseModel):
    id: str
    project_name: str
    description: str
    difficulty: str
    technologies: List[str]

class Education(BaseModel):
    school: str
    degree: str
    field: str
    year: str
    details: Optional[str] = None

class Experience(BaseModel):
    company: str
    position: str
    duration: str
    description: Optional[str] = None
    achievements: Optional[str] = None

class ProjectExperience(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: Optional[str] = None
    link: Optional[str] = None
    achievements: Optional[str] = None

class Certification(BaseModel):
    name: str
    issuer: str
    date: Optional[str] = None
    credentialId: Optional[str] = None

class Language(BaseModel):
    language: str
    proficiency: str = "Intermediate"

class Resume(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    careerObjective: Optional[str] = None
    skills: List[str] = []
    education: List[Education] = []
    projects: List[ProjectExperience] = []
    experience: List[Experience] = []
    certifications: List[Certification] = []
    achievements: List[str] = []
    languages: List[Language] = []
    interests: Optional[str] = None

class ResumeOut(BaseModel):
    id: str
    user_id: str
    resume_data: Resume
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True
