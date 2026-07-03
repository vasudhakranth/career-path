from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File
from datetime import datetime
from app.models.schemas import Resume
from app.database.connection import db
from app.auth.security import decode_access_token
from bson import ObjectId
from pydantic import BaseModel
import re
import io


router = APIRouter()

async def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["user_id"]

def serialize_resume(resume):
    return {
        "id": str(resume["_id"]),
        "user_id": str(resume["user_id"]),
        "resume_data": resume.get("resume_data", {}),
        "created_at": resume.get("created_at"),
        "updated_at": resume.get("updated_at"),
    }

@router.post("/")
async def save_resume(resume_data: Resume, user_id: str = Depends(get_current_user_id)):
    """Save a new resume for the current user"""
    try:
        # Check if user already has a resume
        existing = db.resumes.find_one({"user_id": ObjectId(user_id)})
        
        resume_doc = {
            "user_id": ObjectId(user_id),
            "resume_data": resume_data.dict(),
            "created_at": existing.get("created_at") if existing else datetime.utcnow().isoformat() + "Z",
            "updated_at": datetime.utcnow().isoformat() + "Z",
        }
        
        if existing:
            # Update existing resume
            result = db.resumes.update_one(
                {"user_id": ObjectId(user_id)},
                {"$set": resume_doc}
            )
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Resume not found")
            resume = db.resumes.find_one({"_id": existing["_id"]})
        else:
            # Create new resume
            result = db.resumes.insert_one(resume_doc)
            resume = db.resumes.find_one({"_id": result.inserted_id})
        
        return serialize_resume(resume)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def get_resume(user_id: str = Depends(get_current_user_id)):
    """Get the resume for the current user"""
    resume = db.resumes.find_one({"user_id": ObjectId(user_id)})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found. Please create one first.")
    return serialize_resume(resume)

@router.put("/")
async def update_resume(resume_data: Resume, user_id: str = Depends(get_current_user_id)):
    """Update the resume for the current user"""
    try:
        resume_doc = {
            "resume_data": resume_data.dict(),
            "updated_at": datetime.utcnow().isoformat() + "Z",
        }
        
        result = db.resumes.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": resume_doc}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        resume = db.resumes.find_one({"user_id": ObjectId(user_id)})
        return serialize_resume(resume)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/")
async def delete_resume(user_id: str = Depends(get_current_user_id)):
    """Delete the resume for the current user"""
    result = db.resumes.delete_one({"user_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Resume deleted successfully"}


def _extract_text_from_plain_bytes(data: bytes) -> str:
    """Best-effort extraction without adding heavy deps.
    Works for text-based PDFs/DOCX that contain readable text, otherwise returns empty string.
    """
    try:
        # Try UTF-8 then fallback to latin-1
        return data.decode("utf-8", errors="ignore").strip()
    except Exception:
        return ""


def _simple_generate_ats_resume(extracted_text: str) -> dict:
    """Rules-based transform from extracted text into existing Resume schema."""
    text = (extracted_text or "").replace("\r\n", "\n").replace("\r", "\n")

    # Common field extraction heuristics
    email = None
    emails = re.findall(r"[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}", text)
    if emails:
        email = emails[0]

    linkedin = None
    m = re.search(r"https?://(?:www\.)?linkedin\.com/[^\s\n]+", text, re.IGNORECASE)
    if m:
        linkedin = m.group(0)

    github = None
    m = re.search(r"https?://(?:www\.)?github\.com/[^\s\n]+", text, re.IGNORECASE)
    if m:
        github = m.group(0)

    # Phone heuristic
    phone = None
    m = re.search(r"(?:\+?\d[\d\s\-()]{7,}\d)", text)
    if m:
        phone = m.group(0).strip()

    # Name heuristic: first non-empty line
    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
    name = lines[0] if lines else ""

    # Skills: take lines with keywords or after 'Skills' section
    skills = []
    skill_section = ""
    m = re.search(r"skills?\s*[:\n]([\s\S]{0,1200})", text, re.IGNORECASE)
    if m:
        skill_section = m.group(1)
    else:
        # fallback: look for any line containing typical skill separators
        for ln in lines[:60]:
            if re.search(r"(skill|technologies?)", ln, re.IGNORECASE):
                skill_section = ln
                break

    if skill_section:
        # split by commas/semicolons/newlines
        candidates = re.split(r"[,;\n]", skill_section)
        cleaned = []
        for c in candidates:
            v = c.strip()
            if not v:
                continue
            # remove section labels
            v = re.sub(r"^skills?\s*[:\s-]*", "", v, flags=re.IGNORECASE).strip()
            # keep reasonable tokens
            if 2 <= len(v) <= 40:
                cleaned.append(v)
        # dedupe while preserving order
        seen = set()
        for v in cleaned:
            key = v.lower()
            if key not in seen:
                seen.add(key)
                skills.append(v)

    # Career objective: look for Summary/Objective section
    career = ""
    m = re.search(r"(summary|objective)\s*[:\n]([\s\S]{0,600})", text, re.IGNORECASE)
    if m:
        career = (m.group(2) or "").strip().split("\n")[:6].join(" ")

    # Split into blocks for sections
    # We'll do minimal extraction for experience/projects by looking for headings.
    def _section_block(header_regex: str, max_chars: int = 1600) -> str:
        m = re.search(header_regex + r"\s*[:\n]([\s\S]{0," + str(max_chars) + r"})", text, re.IGNORECASE)
        return (m.group(1) or "").strip() if m else ""

    exp_block = _section_block(r"(experience|employment|work history)")
    proj_block = _section_block(r"(projects|project)")
    edu_block = _section_block(r"(education|academics)")
    cert_block = _section_block(r"(certifications|certification|credentials)")

    # Convert blocks to arrays with very basic heuristics.
    # For now: create single entry if block exists.
    experience = []
    if exp_block:
        # Use first line as company/position guess
        first = [ln.strip() for ln in exp_block.split("\n") if ln.strip()]
        if first:
            experience.append({
                "company": "",
                "position": first[0][:80],
                "duration": "",
                "description": " ".join(first[1:6]).strip()[:400] if len(first) > 1 else "",
                "achievements": "",
            })

    projects = []
    if proj_block:
        first = [ln.strip() for ln in proj_block.split("\n") if ln.strip()]
        if first:
            projects.append({
                "name": first[0][:80],
                "description": " ".join(first[1:5]).strip()[:400] if len(first) > 1 else "",
                "technologies": "",
                "link": "",
                "achievements": "",
            })

    education = []
    if edu_block:
        first = [ln.strip() for ln in edu_block.split("\n") if ln.strip()]
        if first:
            education.append({
                "school": "",
                "degree": first[0][:80],
                "field": "",
                "year": "",
                "details": " ".join(first[1:4]).strip()[:300] if len(first) > 1 else "",
            })

    certifications = []
    if cert_block:
        first = [ln.strip() for ln in cert_block.split("\n") if ln.strip()]
        if first:
            certifications.append({
                "name": first[0][:80],
                "issuer": "",
                "date": "",
                "credentialId": "",
            })

    # Achievements, languages, interests left empty in v1.
    return {
        "name": name,
        "email": email or "",
        "phone": phone or "",
        "linkedin": linkedin or "",
        "github": github or "",
        "portfolio": "",
        "careerObjective": career,
        "skills": skills,
        "education": education,
        "projects": projects,
        "experience": experience,
        "certifications": certifications,
        "achievements": [],
        "languages": [],
        "interests": "",
    }


@router.post("/upload")
async def upload_resume(
    resume_file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
):
    """Upload a resume (pdf/doc/docx), analyze text, generate ATS-friendly structured resume."""
    allowed = {".pdf", ".doc", ".docx"}
    filename = (resume_file.filename or "").lower()
    ext = ""
    for a in allowed:
        if filename.endswith(a):
            ext = a
            break
    if ext == "":
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload pdf/doc/docx only.")

    raw = await resume_file.read()
    extracted_text = _extract_text_from_plain_bytes(raw)

    if not extracted_text or len(extracted_text) < 20:
        # Not much text found; still generate empty structure with best-effort name/email parsing.
        extracted_text = extracted_text or ""

    resume_data = _simple_generate_ats_resume(extracted_text)

    # Validate/shape using the existing Resume model
    try:
        resume_model = Resume(**resume_data)
    except Exception as e:
        # If parsing fails, fall back to minimal required fields
        resume_model = Resume(
            name=resume_data.get("name", "") or "Your Name",
            email=resume_data.get("email", "") or "your.email@example.com",
            phone=resume_data.get("phone") or "",
            linkedin=resume_data.get("linkedin") or "",
            github=resume_data.get("github") or "",
            portfolio=resume_data.get("portfolio") or "",
            careerObjective=resume_data.get("careerObjective") or "",
            skills=resume_data.get("skills") or [],
            education=resume_data.get("education") or [],
            projects=resume_data.get("projects") or [],
            experience=resume_data.get("experience") or [],
            certifications=resume_data.get("certifications") or [],
            achievements=resume_data.get("achievements") or [],
            languages=resume_data.get("languages") or [],
            interests=resume_data.get("interests") or "",
        )

    existing = db.resumes.find_one({"user_id": ObjectId(user_id)})
    resume_doc = {
        "user_id": ObjectId(user_id),
        "resume_data": resume_model.dict(),
        "created_at": existing.get("created_at") if existing else datetime.utcnow().isoformat() + "Z",
        "updated_at": datetime.utcnow().isoformat() + "Z",
    }

    if existing:
        db.resumes.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": resume_doc},
        )
        saved = db.resumes.find_one({"_id": existing["_id"]})
    else:
        inserted = db.resumes.insert_one(resume_doc)
        saved = db.resumes.find_one({"_id": inserted.inserted_id})

    return {
        "resume_data": saved.get("resume_data", {}),
        "extracted_text": extracted_text[:20000],
    }

