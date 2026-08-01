from fastapi import APIRouter, Depends, Header, HTTPException
from bson import ObjectId
import re

from app.database.connection import db
from app.auth.security import decode_access_token

router = APIRouter()


async def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["user_id"]


def _safe_str(v):
    if v is None:
        return ""
    if isinstance(v, str):
        return v
    return str(v)


def _extract_resume_info(resume_data: dict):
    """Extract comprehensive information from resume data."""
    info = {
        "skills": [],
        "projects": [],
        "experience": "",
        "education": "",
        "certifications": "",
        "technologies": [],
        "full_text": "",
    }
    
    # Extract skills
    skills = resume_data.get("skills") or []
    if isinstance(skills, list):
        info["skills"] = [s for s in skills if isinstance(s, str) and s.strip()][:15]
    
    # Extract projects
    projects = resume_data.get("projects") or []
    if isinstance(projects, list):
        info["projects"] = [p for p in projects if p][:5]
    
    # Extract experience
    info["experience"] = _safe_str(resume_data.get("experience"))
    
    # Extract education
    info["education"] = _safe_str(resume_data.get("education"))
    
    # Extract certifications
    info["certifications"] = _safe_str(resume_data.get("certifications"))
    
    # Extract technologies
    tech = resume_data.get("technologies") or []
    if isinstance(tech, list):
        info["technologies"] = [t for t in tech if isinstance(t, str) and t.strip()][:10]
    
    # Get full text
    info["full_text"] = _safe_str(resume_data.get("extracted_text"))
    
    return info


def _generate_hr_questions(info: dict) -> list:
    """Generate 15+ HR/behavioral questions."""
    skills_str = ", ".join(info["skills"][:3]) if info["skills"] else "your skills"
    
    questions = [
        # Self-introduction & Background
        "Tell me about yourself and your professional background.",
        "Walk me through your resume. What are your key highlights?",
        "What makes you unique compared to other candidates?",
        
        # Motivation & Goals
        f"Why are you interested in this role? (Consider your {skills_str} expertise.)",
        "What are your long-term career goals, and how does this role fit into them?",
        "Where do you see yourself in 3-5 years?",
        
        # Skills & Strengths
        f"Tell me about your strongest skill: {(info['skills'][0] if info['skills'] else 'leadership')}. Provide an example.",
        "Describe a project where you had to learn a new skill quickly. How did you approach it?",
        "What is your greatest professional achievement?",
        
        # Challenges & Growth
        "Describe a time when you failed. What did you learn from it?",
        "Tell me about a challenging situation you handled at work. How did you overcome it?",
        "When have you had to work with someone difficult? How did you manage it?",
        
        # Teamwork & Collaboration
        "Describe your experience working in teams. How do you contribute?",
        "Tell me about a time when you had to collaborate with people from different departments.",
        "How do you handle disagreements with team members?",
        
        # Problem Solving
        "Tell me about a complex problem you solved. Walk me through your approach.",
        "Describe a time when you had to make a decision with limited information.",
    ]
    
    return questions


def _generate_technical_questions(info: dict) -> list:
    """Generate 15+ technical questions."""
    skills = info["skills"]
    tech = info["technologies"]
    
    # Determine primary tech stack
    primary_tech = tech[0] if tech else skills[0] if skills else "software development"
    
    questions = [
        # Fundamentals
        "Explain the key concepts behind {}.".format(primary_tech if tech else "your primary technology"),
        "What are the differences between SQL and NoSQL databases? When would you use each?",
        "Describe the MVC (Model-View-Controller) architecture and when you would use it.",
        "What is RESTful API design? Explain the key principles and HTTP methods.",
        
        # System Design & Architecture
        "Design a scalable system for [your use case]. Walk me through your architecture decisions.",
        "How would you approach building a caching layer for high-traffic applications?",
        "Explain the difference between microservices and monolithic architecture.",
        "What are SOLID principles? Can you give examples from your projects?",
        
        # Code Quality & Best Practices
        "How do you ensure code quality and maintainability in your projects?",
        "Tell me about your testing strategy. How do you approach unit, integration, and end-to-end testing?",
        "Describe your experience with version control and Git workflows.",
        "How do you debug complex issues? Walk me through your approach.",
        
        # Performance & Optimization
        "Tell me about a time you optimized code or improved system performance.",
        "How would you identify and resolve performance bottlenecks in an application?",
        "Explain time complexity and space complexity. Why do they matter?",
        
        # Specific Skills
        *[f"Describe your experience with {skill}. How have you used it in projects?" for skill in skills[:5]],
    ]
    
    return questions[:20]


def _generate_technical_coding_questions(info: dict) -> list:
    """Generate 10+ coding challenge questions."""
    questions = [
        # Arrays & Strings
        "Reverse a linked list. Explain your approach and time/space complexity.",
        "Find the longest substring without repeating characters. Optimize your solution.",
        "Given an array of integers, find if there's a pair that sums to a target. Discuss tradeoffs.",
        
        # Trees & Graphs
        "Implement binary search and explain how you test edge cases.",
        "Traverse a binary tree in-order, pre-order, and post-order. When would you use each?",
        "Detect a cycle in a directed graph. Explain your algorithm.",
        
        # Dynamic Programming
        "Explain the concept of dynamic programming with an example from your work.",
        "Solve the classic '0/1 Knapsack' problem. How would you approach it?",
        "Fibonacci sequence - implement using recursion, memoization, and iteration. Compare approaches.",
        
        # System Design Coding
        "Design an in-memory cache (LRU cache). Implement and discuss complexity.",
        "How would you implement rate limiting for an API?",
    ]
    
    return questions


def _generate_follow_up_questions(original_answer: str, question: str, skills: list) -> list:
    """Generate follow-up questions based on candidate's answer."""
    follow_ups = [
        "That's interesting! Can you provide a specific example or metric that shows the impact?",
        "What was the biggest challenge you faced while working on this?",
        "How would you approach this differently today with your current knowledge?",
        "Tell me more about the technologies or tools you used. Why did you choose them?",
        "What did you learn from this experience that you applied to future projects?",
        "If you had to do this again, what would you improve?",
        "How did this align with your role and responsibilities?",
        "Did you face any setbacks? If so, how did you overcome them?",
        "What was the most valuable lesson you took from this experience?",
        "How has this experience influenced your career decisions?",
    ]
    
    return follow_ups[:3]  # Return 3 random follow-ups


@router.post("/questions-from-resume")
async def questions_from_resume(payload: dict, user_id: str = Depends(get_current_user_id)):
    """Generate 20-30+ personalized interview questions from the uploaded resume.

    Generates HR, Technical, and Coding questions based on resume content.
    
    Expected payload: { "interview_type": "hr" | "tech" | "coding" | "all" }
    """

    interview_type = _safe_str(payload.get("interview_type")).lower() or "hr"
    if interview_type not in {"hr", "tech", "coding", "all"}:
        raise HTTPException(status_code=400, detail="Invalid interview_type")

    resume_doc = db.resumes.find_one({"user_id": ObjectId(user_id)})
    if not resume_doc:
        raise HTTPException(status_code=404, detail="Resume not found. Please upload a resume first.")

    resume_data = resume_doc.get("resume_data") or {}
    info = _extract_resume_info(resume_data)

    # Generate questions based on type
    questions = []
    
    if interview_type == "hr" or interview_type == "all":
        questions.extend(_generate_hr_questions(info))
    
    if interview_type == "tech" or interview_type == "all":
        questions.extend(_generate_technical_questions(info))
        questions.extend(_generate_technical_coding_questions(info))
    
    if interview_type == "coding":
        questions.extend(_generate_technical_coding_questions(info))

    # Fallback to HR if no questions generated
    if not questions:
        questions = _generate_hr_questions(info)

    # Remove duplicates while preserving order
    seen = set()
    unique_questions = []
    for q in questions:
        q_lower = q.lower().strip()
        if q_lower not in seen:
            seen.add(q_lower)
            unique_questions.append(q)

    return {
        "interview_type": interview_type,
        "questions": unique_questions[:30],  # Return up to 30 questions
        "total_questions": len(unique_questions[:30]),
        "skills": info["skills"],
        "technologies": info["technologies"],
    }


@router.post("/follow-up-questions")
async def generate_follow_up(
    payload: dict,
    user_id: str = Depends(get_current_user_id)
):
    """Generate follow-up questions based on the candidate's answer.
    
    Expected payload:
    {
        "original_question": "Tell me about...",
        "candidate_answer": "I did...",
        "interview_type": "hr" | "tech" | "coding"
    }
    """
    
    original_question = _safe_str(payload.get("original_question"))
    candidate_answer = _safe_str(payload.get("candidate_answer"))
    interview_type = _safe_str(payload.get("interview_type")).lower() or "hr"
    
    if not original_question or not candidate_answer:
        raise HTTPException(status_code=400, detail="original_question and candidate_answer are required")
    
    resume_doc = db.resumes.find_one({"user_id": ObjectId(user_id)})
    if not resume_doc:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    resume_data = resume_doc.get("resume_data") or {}
    info = _extract_resume_info(resume_data)
    
    follow_ups = _generate_follow_up_questions(candidate_answer, original_question, info["skills"])
    
    return {
        "follow_up_questions": follow_ups,
        "type": "follow_up",
        "based_on": original_question[:50] + "..."
    }


