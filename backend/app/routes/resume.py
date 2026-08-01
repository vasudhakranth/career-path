from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File, Form
from datetime import datetime
from app.models.schemas import Resume
from app.database.connection import db
from app.auth.security import decode_access_token
from bson import ObjectId
from pydantic import BaseModel
import re
import io
from io import BytesIO
from typing import Any, Dict, List

try:
    from pypdf import PdfReader
except Exception:
    PdfReader = None

try:
    from docx import Document as DocxDocument
except Exception:
    DocxDocument = None


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


ROLE_SKILLS = {
    'Frontend Developer': ['React', 'TypeScript', 'Accessibility', 'Tailwind CSS', 'Vite', 'JavaScript'],
    'Backend Developer': ['Node.js', 'REST APIs', 'PostgreSQL', 'Microservices', 'Testing', 'Docker'],
    'Full Stack Developer': ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'System Design', 'REST APIs'],
    'Python Developer': ['Python', 'FastAPI', 'Async IO', 'Pandas', 'Docker', 'Flask'],
    'Java Developer': ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'JUnit', 'REST APIs'],
    'React Developer': ['React', 'Redux', 'Component Design', 'Testing Library', 'Next.js', 'JavaScript'],
    'Flutter Developer': ['Flutter', 'Dart', 'State Management', 'Firebase', 'CI/CD', 'UI Design'],
    'Data Analyst': ['SQL', 'Python', 'Power BI', 'Data Visualization', 'Statistics', 'Tableau'],
    'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    'UI/UX Designer': ['Figma', 'Design Systems', 'Wireframing', 'Accessibility', 'Prototyping', 'User Research'],
}

ROLE_PROJECTS = {
    'Frontend Developer': [
        {'title': 'Portfolio Website', 'difficulty': 'Intermediate', 'stack': 'React • Tailwind • Framer Motion', 'time': '5 days'},
        {'title': 'E-Commerce Website', 'difficulty': 'Advanced', 'stack': 'React • Redux • Node.js', 'time': '10 days'},
        {'title': 'AI Dashboard', 'difficulty': 'Advanced', 'stack': 'Next.js • TypeScript • Chart.js', 'time': '8 days'},
    ],
    'Backend Developer': [
        {'title': 'API Gateway', 'difficulty': 'Intermediate', 'stack': 'Node.js • Express • MongoDB', 'time': '7 days'},
        {'title': 'Realtime Chat System', 'difficulty': 'Advanced', 'stack': 'Socket.io • Redis • PostgreSQL', 'time': '11 days'},
        {'title': 'Microservices Platform', 'difficulty': 'Advanced', 'stack': 'FastAPI • Docker • Kafka', 'time': '12 days'},
    ],
    'Full Stack Developer': [
        {'title': 'Task Manager', 'difficulty': 'Intermediate', 'stack': 'React • Express • MongoDB', 'time': '6 days'},
        {'title': 'Learning Platform', 'difficulty': 'Advanced', 'stack': 'Next.js • Prisma • Supabase', 'time': '9 days'},
        {'title': 'SaaS Dashboard', 'difficulty': 'Advanced', 'stack': 'Vite • Node.js • Postgres', 'time': '10 days'},
    ],
    'Python Developer': [
        {'title': 'Automation Toolkit', 'difficulty': 'Intermediate', 'stack': 'Python • Flask • SQLite', 'time': '6 days'},
        {'title': 'Data Pipeline', 'difficulty': 'Advanced', 'stack': 'Python • Pandas • Airflow', 'time': '9 days'},
        {'title': 'ML Experiment Studio', 'difficulty': 'Advanced', 'stack': 'Python • Scikit-learn • Streamlit', 'time': '10 days'},
    ],
    'Java Developer': [
        {'title': 'Spring Boot API', 'difficulty': 'Intermediate', 'stack': 'Java • Spring Boot • PostgreSQL', 'time': '7 days'},
        {'title': 'Messaging Service', 'difficulty': 'Advanced', 'stack': 'Java • Kafka • Docker', 'time': '10 days'},
        {'title': 'Microservices Platform', 'difficulty': 'Advanced', 'stack': 'Spring Cloud • Kubernetes • REST', 'time': '12 days'},
    ],
    'React Developer': [
        {'title': 'Component Library', 'difficulty': 'Intermediate', 'stack': 'React • Storybook • TypeScript', 'time': '5 days'},
        {'title': 'Analytics Dashboard', 'difficulty': 'Advanced', 'stack': 'React • D3.js • Redux', 'time': '8 days'},
        {'title': 'Next.js SaaS App', 'difficulty': 'Advanced', 'stack': 'Next.js • Tailwind • Prisma', 'time': '9 days'},
    ],
    'Flutter Developer': [
        {'title': 'Productivity App', 'difficulty': 'Intermediate', 'stack': 'Flutter • Dart • Firebase', 'time': '6 days'},
        {'title': 'Onboarding Flow', 'difficulty': 'Intermediate', 'stack': 'Flutter • Provider • Firebase', 'time': '5 days'},
        {'title': 'Mobile Finance App', 'difficulty': 'Advanced', 'stack': 'Flutter • BLoC • SQLite', 'time': '10 days'},
    ],
    'Data Analyst': [
        {'title': 'Sales Insights Dashboard', 'difficulty': 'Intermediate', 'stack': 'SQL • Power BI • Python', 'time': '6 days'},
        {'title': 'Customer Analytics App', 'difficulty': 'Advanced', 'stack': 'Python • Tableau • Snowflake', 'time': '9 days'},
        {'title': 'ETL Automation Suite', 'difficulty': 'Advanced', 'stack': 'SQL • Pandas • Airflow', 'time': '8 days'},
    ],
    'DevOps Engineer': [
        {'title': 'Infrastructure Automation', 'difficulty': 'Intermediate', 'stack': 'Terraform • AWS • Ansible', 'time': '7 days'},
        {'title': 'Deployment Pipeline', 'difficulty': 'Advanced', 'stack': 'Jenkins • Docker • Kubernetes', 'time': '9 days'},
        {'title': 'Cloud Migration', 'difficulty': 'Advanced', 'stack': 'AWS • Azure • Terraform', 'time': '11 days'},
    ],
    'UI/UX Designer': [
        {'title': 'Design System Library', 'difficulty': 'Intermediate', 'stack': 'Figma • Design Tokens • Storybook', 'time': '5 days'},
        {'title': 'Mobile App Redesign', 'difficulty': 'Advanced', 'stack': 'Figma • Framer • Principle', 'time': '8 days'},
        {'title': 'Product Landing Experience', 'difficulty': 'Advanced', 'stack': 'Figma • Prototyping • Motion', 'time': '7 days'},
    ],
}

ROLE_CERTS = {
    'Frontend Developer': [
        {'name': 'Frontend Developer Certificate', 'issuer': 'Meta', 'date': '2025', 'credentialId': 'META-FE-001'},
        {'name': 'Responsive Web Design Certificate', 'issuer': 'freeCodeCamp', 'date': '2025', 'credentialId': 'FCC-RWD-001'},
    ],
    'Backend Developer': [
        {'name': 'Backend Development Certificate', 'issuer': 'MongoDB University', 'date': '2025', 'credentialId': 'MDB-BE-001'},
        {'name': 'Database Design Certificate', 'issuer': 'Stanford Online', 'date': '2025', 'credentialId': 'SO-DB-001'},
    ],
    'Full Stack Developer': [
        {'name': 'Full Stack Web Development Certificate', 'issuer': 'The Odin Project', 'date': '2025', 'credentialId': 'TOP-FS-001'},
        {'name': 'Cloud Application Certificate', 'issuer': 'AWS', 'date': '2025', 'credentialId': 'AWS-CA-001'},
    ],
    'Python Developer': [
        {'name': 'Python Programming Certificate', 'issuer': 'University of Michigan', 'date': '2025', 'credentialId': 'UM-PY-001'},
        {'name': 'Data Engineering Certificate', 'issuer': 'Databricks', 'date': '2025', 'credentialId': 'DB-DE-001'},
    ],
    'Java Developer': [
        {'name': 'Java Programming Certificate', 'issuer': 'Oracle', 'date': '2025', 'credentialId': 'ORC-JV-001'},
        {'name': 'Spring Boot Certificate', 'issuer': 'VMware Tanzu', 'date': '2025', 'credentialId': 'VMW-SB-001'},
    ],
    'React Developer': [
        {'name': 'React Developer Certificate', 'issuer': 'Meta', 'date': '2025', 'credentialId': 'META-RC-001'},
        {'name': 'Advanced React Certificate', 'issuer': 'Frontend Masters', 'date': '2025', 'credentialId': 'FEM-AR-001'},
    ],
    'Flutter Developer': [
        {'name': 'Flutter Developer Certificate', 'issuer': 'Google', 'date': '2025', 'credentialId': 'GOOG-FL-001'},
        {'name': 'Mobile App Design Certificate', 'issuer': 'Coursera', 'date': '2025', 'credentialId': 'CRS-MD-001'},
    ],
    'Data Analyst': [
        {'name': 'Data Analytics Certificate', 'issuer': 'Google', 'date': '2025', 'credentialId': 'GOOG-DA-001'},
        {'name': 'SQL for Data Analysis Certificate', 'issuer': 'Mode Analytics', 'date': '2025', 'credentialId': 'MODE-SQL-001'},
    ],
    'DevOps Engineer': [
        {'name': 'AWS DevOps Certificate', 'issuer': 'Amazon Web Services', 'date': '2025', 'credentialId': 'AWS-DO-001'},
        {'name': 'Kubernetes Certification', 'issuer': 'CNCF', 'date': '2025', 'credentialId': 'CNCF-K8S-001'},
    ],
    'UI/UX Designer': [
        {'name': 'UX Design Certificate', 'issuer': 'Google', 'date': '2025', 'credentialId': 'GOOG-UX-001'},
        {'name': 'Figma Design Systems Certificate', 'issuer': 'Figma', 'date': '2025', 'credentialId': 'FIG-DS-001'},
    ],
}


def _clean_text(text: str) -> str:
    return (text or '').replace('\r\n', '\n').replace('\r', '\n').strip()


def _dedupe_preserve_order(items: List[str]) -> List[str]:
    seen = set()
    result = []
    for item in items:
        clean = item.strip()
        if not clean:
            continue
        key = clean.lower()
        if key not in seen:
            seen.add(key)
            result.append(clean)
    return result


def _extract_text_from_plain_bytes(data: bytes) -> str:
    """Fallback path for plain text payloads that do not require a real parser."""
    try:
        return data.decode('utf-8', errors='ignore').strip()
    except Exception:
        return ''


def _extract_text_from_pdf_bytes(data: bytes) -> str:
    if PdfReader is None:
        return _extract_text_from_plain_bytes(data)

    try:
        reader = PdfReader(BytesIO(data))
        text_chunks = []
        for page in reader.pages:
            page_text = page.extract_text() or ''
            if page_text.strip():
                text_chunks.append(page_text.strip())
        return '\n'.join(text_chunks).strip()
    except Exception:
        return _extract_text_from_plain_bytes(data)


def _extract_text_from_docx_bytes(data: bytes) -> str:
    if DocxDocument is None:
        return _extract_text_from_plain_bytes(data)

    try:
        doc = DocxDocument(BytesIO(data))
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text and p.text.strip()]
        return '\n'.join(paragraphs).strip()
    except Exception:
        return _extract_text_from_plain_bytes(data)


def _extract_text_from_bytes(file_name: str, data: bytes) -> str:
    lower_name = (file_name or '').lower()
    if lower_name.endswith('.pdf'):
        return _extract_text_from_pdf_bytes(data)
    if lower_name.endswith('.docx'):
        return _extract_text_from_docx_bytes(data)
    if lower_name.endswith('.doc'):
        return _extract_text_from_plain_bytes(data)
    return _extract_text_from_plain_bytes(data)


def _section_block(text: str, regex_patterns: List[str], max_chars: int = 1800) -> str:
    for regex in regex_patterns:
        match = re.search(regex + r'\s*[:\n]([\s\S]{0,' + str(max_chars) + r'})', text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return ''


def _paragraph_lines(text: str) -> List[str]:
    return [line.strip() for line in text.split('\n') if line.strip()]


def _simple_generate_ats_resume(extracted_text: str) -> dict:
    """Create a structured resume from the file text while keeping the original content intact."""
    text = _clean_text(extracted_text or '')
    lines = [ln.strip() for ln in text.split('\n') if ln.strip()]
    name = lines[0] if lines else ''

    email = None
    emails = re.findall(r'[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}', text)
    if emails:
        email = emails[0]

    linkedin = None
    linkedin_match = re.search(r'https?://(?:www\.)?linkedin\.com/[^\s\n]+', text, re.IGNORECASE)
    if linkedin_match:
        linkedin = linkedin_match.group(0)

    github = None
    github_match = re.search(r'https?://(?:www\.)?github\.com/[^\s\n]+', text, re.IGNORECASE)
    if github_match:
        github = github_match.group(0)

    portfolio = None
    portfolio_match = re.search(r'https?://[^\s\n]+', text, re.IGNORECASE)
    if portfolio_match and not any(domain in portfolio_match.group(0).lower() for domain in ['linkedin.com', 'github.com']):
        portfolio = portfolio_match.group(0)

    phone = None
    phone_match = re.search(r'(?:\+?\d[\d\s\-()]{7,}\d)', text)
    if phone_match:
        phone = phone_match.group(0).strip()

    career = ''
    summary_block = _section_block(text, [r'(summary|professional summary|objective|profile)'], 700)
    if summary_block:
        career = ' '.join(_paragraph_lines(summary_block)[:6])

    skills = []
    skill_block = _section_block(text, [r'skills?', r'technical skills', r'technologies'])
    if skill_block:
        candidate_tokens = re.split(r'[,;\n]+', skill_block)
        skills.extend([token.strip() for token in candidate_tokens if 2 <= len(token.strip()) <= 40])
    else:
        for line in lines[:80]:
            if re.search(r'\b(react|python|java|sql|aws|docker|node|javascript|typescript|figma|kubernetes|tailwind|spring|flutter|postgresql|redis|mongo|pandas|rest api|api|linux|html|css|git)\b', line, re.IGNORECASE):
                skills.append(line)

    skills = _dedupe_preserve_order(skills)

    experience = []
    exp_block = _section_block(text, [r'(experience|employment|work history|professional experience)'], 2500)
    if exp_block:
        experience_entries = []
        for part in re.split(r'\n\s*\n+', exp_block):
            clean = ' '.join([seg.strip() for seg in part.splitlines() if seg.strip()])
            if not clean:
                continue
            company_match = re.search(r'([A-Z][A-Za-z0-9&.\- ]{2,})', clean)
            position_match = re.search(r'([A-Z][A-Za-z0-9\- ]{2,})', clean)
            experience_entries.append({
                'company': company_match.group(1).strip() if company_match else '',
                'position': position_match.group(1).strip() if position_match else '',
                'duration': '',
                'description': clean[:400],
                'achievements': '',
            })
        experience = experience_entries[:5]

    projects = []
    proj_block = _section_block(text, [r'(projects|project work|selected projects|portfolio)'], 2500)
    if proj_block:
        for part in re.split(r'\n\s*\n+', proj_block):
            clean = ' '.join([seg.strip() for seg in part.splitlines() if seg.strip()])
            if not clean:
                continue
            project_name = clean.split(':')[0][:80] if ':' in clean else clean[:80]
            projects.append({
                'name': project_name,
                'description': clean[:400],
                'technologies': '',
                'link': '',
                'achievements': '',
            })

    education = []
    edu_block = _section_block(text, [r'(education|academics|qualification)'], 1800)
    if edu_block:
        for part in re.split(r'\n\s*\n+', edu_block):
            clean = ' '.join([seg.strip() for seg in part.splitlines() if seg.strip()])
            if clean:
                education.append({
                    'school': '',
                    'degree': clean[:120],
                    'field': '',
                    'year': '',
                    'details': clean[:300],
                })

    certifications = []
    cert_block = _section_block(text, [r'(certifications|certification|credentials)'], 1600)
    if cert_block:
        for part in re.split(r'\n\s*\n+', cert_block):
            clean = ' '.join([seg.strip() for seg in part.splitlines() if seg.strip()])
            if clean:
                certifications.append({
                    'name': clean[:120],
                    'issuer': '',
                    'date': '',
                    'credentialId': '',
                })

    achievements = []
    achievements_block = _section_block(text, [r'(achievements|awards|highlights)'], 1600)
    if achievements_block:
        achievements = _dedupe_preserve_order([item for item in _paragraph_lines(achievements_block) if len(item) > 15])

    languages = []
    lang_block = _section_block(text, [r'(languages|language)'], 600)
    if lang_block:
        lang_tokens = re.split(r'[,;\n]+', lang_block)
        for token in lang_tokens:
            clean = token.strip()
            if not clean:
                continue
            if 'language' not in clean.lower() and len(clean) < 60:
                languages.append({'language': clean, 'proficiency': 'Intermediate'})

    interests = ''
    interests_block = _section_block(text, [r'(interests|hobbies)'], 500)
    if interests_block:
        interests = ' '.join(_paragraph_lines(interests_block)[:4])

    return {
        'name': name or 'Your Name',
        'email': email or 'your.email@example.com',
        'phone': phone or '',
        'linkedin': linkedin or '',
        'github': github or '',
        'portfolio': portfolio or '',
        'careerObjective': career or '',
        'skills': skills,
        'education': education,
        'projects': projects,
        'experience': experience,
        'certifications': certifications,
        'achievements': achievements,
        'languages': languages,
        'interests': interests,
    }


def _build_analysis_payload(resume_data: Dict[str, Any], role: str, company: str) -> Dict[str, Any]:
    extracted_skills = {skill.lower() for skill in resume_data.get('skills', [])}
    role_skills = ROLE_SKILLS.get(role, [])
    role_keywords = [*role_skills[:5], role]
    company_keywords = [company] if company else []

    resume_blob = ' '.join([
        resume_data.get('name', ''),
        resume_data.get('careerObjective', ''),
        ' '.join(resume_data.get('skills', [])),
        ' '.join([exp.get('position', '') for exp in resume_data.get('experience', []) if isinstance(exp, dict)]),
        ' '.join([exp.get('description', '') for exp in resume_data.get('experience', []) if isinstance(exp, dict)]),
        ' '.join([project.get('name', '') for project in resume_data.get('projects', []) if isinstance(project, dict)]),
        ' '.join([project.get('description', '') for project in resume_data.get('projects', []) if isinstance(project, dict)]),
        ' '.join([cert.get('name', '') for cert in resume_data.get('certifications', []) if isinstance(cert, dict)]),
        ' '.join([achievement for achievement in resume_data.get('achievements', [])]),
    ]).lower()

    matched_keywords = [keyword for keyword in [*role_keywords, *company_keywords] if keyword and keyword.lower() in resume_blob]
    missing_keywords = [keyword for keyword in [*role_keywords, *company_keywords] if keyword and keyword.lower() not in resume_blob]
    missing_skills = [skill for skill in role_skills if skill.lower() not in extracted_skills][:5]

    skill_gap_analysis = []
    if missing_skills:
        skill_gap_analysis.append(f'Role alignment is missing: {", ".join(missing_skills)}')
    if not resume_data.get('projects'):
        skill_gap_analysis.append('Add at least one project that demonstrates measurable impact in the target domain.')
    if not resume_data.get('certifications'):
        skill_gap_analysis.append('Add role-relevant certifications or credential badges to strengthen credibility.')

    resume_strengths = []
    if resume_data.get('careerObjective'):
        resume_strengths.append('Professional summary is present and readable for ATS parsing.')
    if resume_data.get('skills'):
        resume_strengths.append('Core skills are listed clearly for keyword matching.')
    if resume_data.get('experience'):
        resume_strengths.append('Experience section is present and can be improved with measurable impact bullets.')
    if resume_data.get('projects'):
        resume_strengths.append('Project section gives the resume a concrete proof-of-work signal.')

    areas_for_improvement = []
    if missing_keywords:
        areas_for_improvement.append(f'Add the missing company-and-role keywords: {", ".join(missing_keywords)}.')
    if not resume_data.get('achievements'):
        areas_for_improvement.append('Expand achievements with action-driven metrics to improve recruiter confidence.')
    if not resume_data.get('certifications'):
        areas_for_improvement.append('Add industry-recognized certifications to increase relevancy for the selected role.')

    score = 72
    if resume_data.get('email') and '@' in resume_data['email']:
        score += 4
    if resume_data.get('careerObjective'):
        score += 4
    if resume_data.get('skills'):
        score += 6
    if resume_data.get('experience'):
        score += 5
    if resume_data.get('projects'):
        score += 4
    if resume_data.get('education'):
        score += 3
    if resume_data.get('certifications'):
        score += 2
    if len(matched_keywords) >= 2:
        score += 4
    if missing_skills:
        score -= 5
    if missing_keywords:
        score -= 5
    score = max(60, min(98, score))

    improvement_summary = [
        f'Improve the resume alignment for {role} at {company} by adding the missing keywords and role-backed capabilities.',
        'Keep the summary concise, measurable, and focus on outcomes. '
    ]
    if missing_skills:
        improvement_summary.append(f'Add missing role-aligned skills: {", ".join(missing_skills)}')
    if missing_keywords:
        improvement_summary.append(f'Include target keywords such as: {", ".join(missing_keywords[:4])}')

    keywords = _dedupe_preserve_order([
        *resume_data.get('skills', []),
        *role_skills[:4],
        company,
        role,
    ])

    return {
        'ats_score': score,
        'missing_keywords': _dedupe_preserve_order(missing_keywords[:8]),
        'matched_keywords': _dedupe_preserve_order(matched_keywords[:8]),
        'skill_gap_analysis': skill_gap_analysis,
        'recommended_skills': _dedupe_preserve_order(missing_skills + role_skills[:4]),
        'recommended_projects': ROLE_PROJECTS.get(role, [])[:3],
        'recommended_certifications': ROLE_CERTS.get(role, [])[:2],
        'resume_strengths': resume_strengths,
        'areas_for_improvement': areas_for_improvement,
        'improvement_summary': improvement_summary[:5],
        'keywords': keywords[:12],
    }


def _enhance_resume_with_role_targeting(resume_data: Dict[str, Any], role: str, company: str) -> Dict[str, Any]:
    enhanced = dict(resume_data)
    extracted_skills = {skill.lower() for skill in resume_data.get('skills', [])}
    role_skills = ROLE_SKILLS.get(role, [])
    missing_skills = [skill for skill in role_skills if skill.lower() not in extracted_skills]

    enhanced['skills'] = _dedupe_preserve_order([*(resume_data.get('skills', [])), *missing_skills[:4]])
    enhanced['careerObjective'] = enhanced.get('careerObjective') or f"Results-oriented {role} with a focus on scalable, user-centered solutions and measurable product impact at {company}."
    enhanced['title'] = f"{role} • {company}"
    if not enhanced.get('projects'):
        role_projects = ROLE_PROJECTS.get(role, [{'title': 'Portfolio Project', 'difficulty': 'Intermediate', 'stack': ', '.join(role_skills[:4]), 'time': '5 days'}])
        first_project = role_projects[0] if role_projects else {'title': 'Portfolio Project'}
        enhanced['projects'] = [{
            'name': first_project.get('title', 'Portfolio Project'),
            'description': f'Built a role-aligned project demonstrating practical delivery in {role} with a strong focus on business outcomes.',
            'technologies': first_project.get('stack', ', '.join(role_skills[:4])),
            'link': '',
            'achievements': f'Optimized the project for {company}-style hiring expectations using ATS-friendly structure.',
        }]
    if not enhanced.get('certifications'):
        role_certs = ROLE_CERTS.get(role, [{'name': 'Professional Certification', 'issuer': 'Industry Learning', 'date': '2025', 'credentialId': 'EDU-001'}])
        first_cert = role_certs[0] if role_certs else {'name': 'Professional Certification', 'issuer': 'Industry Learning', 'date': '2025', 'credentialId': 'EDU-001'}
        enhanced['certifications'] = [
            {'name': first_cert.get('name', 'Professional Certification'), 'issuer': first_cert.get('issuer', 'Industry Learning'), 'date': first_cert.get('date', '2025'), 'credentialId': first_cert.get('credentialId', 'EDU-001')}
        ]
    enhanced['achievements'] = _dedupe_preserve_order([
        *enhanced.get('achievements', []),
        f'Strengthened resume alignment for {company} by emphasizing role-relevant skills and measurable outcomes.',
        f'Improved ATS compatibility for a {role} application with a cleaner and more structured resume layout.',
    ])
    return enhanced


@router.post("/upload")
async def upload_resume(
    resume_file: UploadFile = File(...),
    role: str = Form('Frontend Developer'),
    company: str = Form('Google'),
    authorization: str = Header(None),
):
    """Upload a resume (pdf/doc/docx), analyze text, and generate an ATS-friendly structured resume preview.
    
    Authentication is optional - if a valid token is provided, the resume will be saved to the user's account.
    If no token is provided, the analysis still works but is not persisted.
    """
    print(f"[DEBUG] Upload endpoint called")
    print(f"[DEBUG] Resume file: {resume_file.filename}")

    allowed = {'.pdf', '.doc', '.docx'}
    filename = (resume_file.filename or '').lower()
    ext = ''
    for a in allowed:
        if filename.endswith(a):
            ext = a
            break
    if ext == '':
        raise HTTPException(status_code=400, detail='Unsupported file type. Upload pdf/doc/docx only.')

    raw = await resume_file.read()
    extracted_text = _extract_text_from_bytes(resume_file.filename or '', raw)
    if len(extracted_text) < 20:
        extracted_text = _extract_text_from_plain_bytes(raw)

    raw_resume_data = _simple_generate_ats_resume(extracted_text)
    enhanced_resume_data = _enhance_resume_with_role_targeting(raw_resume_data, role, company)
    analysis = _build_analysis_payload(enhanced_resume_data, role, company)

    try:
        resume_model = Resume(**enhanced_resume_data)
    except Exception:
        resume_model = Resume(
            name=enhanced_resume_data.get('name', '') or 'Your Name',
            email=enhanced_resume_data.get('email', '') or 'your.email@example.com',
            phone=enhanced_resume_data.get('phone') or '',
            linkedin=enhanced_resume_data.get('linkedin') or '',
            github=enhanced_resume_data.get('github') or '',
            portfolio=enhanced_resume_data.get('portfolio') or '',
            careerObjective=enhanced_resume_data.get('careerObjective') or '',
            skills=enhanced_resume_data.get('skills') or [],
            education=enhanced_resume_data.get('education') or [],
            projects=enhanced_resume_data.get('projects') or [],
            experience=enhanced_resume_data.get('experience') or [],
            certifications=enhanced_resume_data.get('certifications') or [],
            achievements=enhanced_resume_data.get('achievements') or [],
            languages=enhanced_resume_data.get('languages') or [],
            interests=enhanced_resume_data.get('interests') or '',
        )

    # Try to save to database if authenticated (optional)
    try:
        if authorization and authorization.startswith('Bearer '):
            auth_token = authorization.split(' ', 1)[1]
            payload = decode_access_token(auth_token)
            if payload and 'user_id' in payload:
                user_id = payload['user_id']
                print(f"[DEBUG] User ID extracted: {user_id}")
                existing = db.resumes.find_one({'user_id': ObjectId(user_id)})
                resume_doc = {
                    'user_id': ObjectId(user_id),
                    'resume_data': resume_model.dict(),
                    'created_at': existing.get('created_at') if existing else datetime.utcnow().isoformat() + 'Z',
                    'updated_at': datetime.utcnow().isoformat() + 'Z',
                }
                if existing:
                    db.resumes.update_one({'user_id': ObjectId(user_id)}, {'$set': resume_doc})
                else:
                    db.resumes.insert_one(resume_doc)
    except Exception as e:
        print(f"[DEBUG] Failed to save resume to DB (non-critical): {e}")
        pass

    return {
        'resume_data': resume_model.dict(),
        'analysis': analysis,
        'extracted_text': extracted_text[:20000],
    }

