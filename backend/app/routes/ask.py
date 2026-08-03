import re
from collections import Counter
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from bson import ObjectId

from app.database.connection import db
from app.auth.security import decode_access_token
from app.routes.skills import SKILL_CATALOG, build_skill_payload

router = APIRouter()

STOP_WORDS = {
    "the", "and", "for", "with", "from", "that", "this", "about", "what", "when",
    "where", "why", "how", "into", "your", "you", "are", "can", "could", "would",
    "should", "then", "their", "there", "more", "than", "want", "like", "need",
    "give", "using", "learn", "build", "best", "help", "ask", "find", "show",
    "explain", "answer", "question", "about", "just", "these", "those", "have",
    "use", "used", "does", "tell", "me", "i", "a", "an", "of", "to", "be", "is",
}


class AskRequest(BaseModel):
    question: str
    history: list[dict[str, Any]] | None = None
    chat_id: str | None = None


class ChatMessage(BaseModel):
    role: str
    text: str


class ChatCreateRequest(BaseModel):
    title: str
    messages: list[ChatMessage] | None = None


class ChatUpdateRequest(BaseModel):
    title: str | None = None
    messages: list[ChatMessage] | None = None


def _tokenize(text: str) -> list[str]:
    tokens = re.findall(r"[a-z0-9][a-z0-9-]{1,}", text.lower())
    return [token for token in tokens if len(token) > 2 and token not in STOP_WORDS]


def _safe_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value)


def _get_user_id(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["user_id"]


def _serialize_chat(chat: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(chat.get("_id", "")),
        "title": chat.get("title", "New Chat"),
        "messages": chat.get("messages", []),
        "updated_at": chat.get("updated_at"),
    }


def _build_skill_docs() -> list[dict[str, Any]]:
    docs: list[dict[str, Any]] = []
    for skill_key, (display_name, category, description, topics) in SKILL_CATALOG.items():
        payload = build_skill_payload(skill_key) or {}
        for topic in topics[:8]:
            title = _safe_text(topic.get("title", ""))
            summary = _safe_text(topic.get("summary", ""))
            explanation = _safe_text(topic.get("explanation", ""))
            examples = " ".join(_safe_text(item) for item in topic.get("examples", [])[:2])
            use_cases = " ".join(_safe_text(item) for item in topic.get("useCases", [])[:2])
            interview_questions = " ".join(_safe_text(item) for item in topic.get("interviewQuestions", [])[:2])
            practice = _safe_text(topic.get("practice", ""))
            doc_text = " ".join(filter(None, [
                display_name,
                category,
                description,
                payload.get("overview", ""),
                title,
                summary,
                explanation,
                examples,
                use_cases,
                interview_questions,
                practice,
            ]))
            docs.append({
                "type": "skill",
                "title": f"{display_name} — {title}",
                "category": category,
                "text": doc_text,
                "summary": summary,
                "explanation": explanation,
                "examples": examples,
                "practice": practice,
                "meta": {"skill": display_name},
            })
    return docs


def _build_role_docs() -> list[dict[str, Any]]:
    docs: list[dict[str, Any]] = []
    roles = list(db.roles.find({}, {"role_name": 1, "description": 1}))
    for role in roles:
        title = _safe_text(role.get("role_name", ""))
        description = _safe_text(role.get("description", ""))
        docs.append({
            "type": "role",
            "title": title,
            "category": "Role",
            "text": f"{title} {description}",
            "meta": {"role": title},
        })

    roadmaps = list(db.roadmaps.find({}, {"role_name": 1, "phase": 1, "skills": 1}))
    for roadmap in roadmaps:
        title = _safe_text(roadmap.get("role_name", ""))
        phase = _safe_text(roadmap.get("phase", ""))
        skills = list(roadmap.get("skills", []))
        docs.append({
            "type": "roadmap",
            "title": title,
            "category": phase,
            "text": f"{title} {phase} {', '.join(skills)}",
            "skills": skills,
            "meta": {"role": title, "phase": phase},
        })
    return docs


def _score_document(question_tokens: list[str], doc: dict[str, Any]) -> float:
    title_tokens = Counter(_tokenize(doc["title"]))
    doc_tokens = Counter(_tokenize(doc["text"]))
    q_counter = Counter(question_tokens)

    overlap = sum(min(doc_tokens[token], q_counter[token]) for token in set(doc_tokens) & set(q_counter))
    title_overlap = sum(min(title_tokens[token], q_counter[token]) for token in set(title_tokens) & set(q_counter))
    unique_terms = len(set(question_tokens) & set(doc_tokens))

    if overlap == 0 and title_overlap == 0:
        return 0.0

    boost = 0.0
    title = doc["title"].lower()
    question = " ".join(question_tokens)
    if title in question:
        boost += 12.0
    elif any(token in title for token in question_tokens[:3]):
        boost += 4.0

    if doc["type"] == "skill" and any(token in title for token in question_tokens[:2]):
        boost += 2.5

    return (overlap * 2.5) + (unique_terms * 1.5) + (title_overlap * 5.0) + boost


def _retrieve_context(question: str, history: list[dict[str, Any]] | None = None, limit: int = 8) -> list[dict[str, Any]]:
    history_terms = []
    if history:
        for entry in history[-4:]:
            if isinstance(entry, dict):
                history_terms.extend(_tokenize(_safe_text(entry.get("text", ""))))

    query_tokens = _tokenize(question) + history_terms
    if not query_tokens:
        query_tokens = _tokenize(question)

    docs = _build_skill_docs() + _build_role_docs()
    scored = []
    for doc in docs:
        score = _score_document(query_tokens, doc)
        if score > 0:
            scored.append((doc, score))

    scored.sort(key=lambda item: item[1], reverse=True)

    if not scored:
        return []

    return [doc for doc, _ in scored[:limit]]


def _summarize_role_answer(question: str, docs: list[dict[str, Any]]) -> str:
    role_doc = next((doc for doc in docs if doc["type"] == "role"), None)
    roadmap_docs = [doc for doc in docs if doc["type"] == "roadmap"]

    if role_doc and roadmap_docs:
        ordered_skills: list[str] = []
        seen: set[str] = set()
        for roadmap in roadmap_docs:
            for skill in roadmap.get("skills", []):
                if skill and skill not in seen:
                    ordered_skills.append(skill)
                    seen.add(skill)

        if ordered_skills:
            joined = ", ".join(ordered_skills)
            return (
                f"For {role_doc['title']}, the key skills in EduMind's roadmap are: {joined}. "
                "A solid full-stack path usually combines frontend fundamentals, backend services, database work, deployment, and hands-on project practice."
            )

        return (
            f"Based on the role data in EduMind, {role_doc['title']} is a career track focused on building practical products and solving real business problems. "
            "A strong learning path for this role typically starts with fundamentals and then advances into implementation and deployment skills."
        )

    if role_doc:
        return (
            f"{role_doc['title']} is centered around {role_doc['text'][:140].strip()}... "
            "Use the role description to clarify the expected responsibilities, then build your learning sequence around the skills that directly support those responsibilities."
        )
    return "I could not find a strong role match in the knowledge base, so the safest answer is to ask for the specific role or skill name you want to explore."


def _summarize_skill_answer(question: str, docs: list[dict[str, Any]]) -> str:
    top_skill = next((doc for doc in docs if doc["type"] == "skill"), None)
    if top_skill:
        summary = top_skill.get("summary") or top_skill.get("explanation") or top_skill.get("text", "")
        explanation = top_skill.get("explanation") or top_skill.get("text", "")
        examples = top_skill.get("examples") or ""
        practice = top_skill.get("practice") or ""
        summary = summary[:220].strip()
        explanation = explanation[:260].strip()

        return (
            f"The best matched knowledge entry is {top_skill['title']}. "
            f"{summary}. "
            f"{explanation}. "
            f"A small example is: {examples}. "
            f"A next practice step is: {practice}."
        )
    return "I could not locate a highly relevant skill reference for that question in the knowledge base. Try using the skill name exactly as it appears in the catalog."


def _generate_answer(question: str, docs: list[dict[str, Any]]) -> str:
    lower = question.lower()
    role_skill_patterns = [
        "skills are required for",
        "skills required for",
        "skills needed for",
        "skill required for",
        "skill needed for",
        "what skills",
        "which skills",
    ]

    if any(keyword in lower for keyword in ["roadmap", "plan", "path", "role"] + role_skill_patterns):
        return _summarize_role_answer(question, docs)
    if any(keyword in lower for keyword in ["what is", "what are", "explain", "definition", "learn"]):
        return _summarize_skill_answer(question, docs)
    if docs:
        first = docs[0]
        if first["type"] == "skill":
            return _summarize_skill_answer(question, docs)
        return (
            f"Using the retrieved EduMind knowledge, the strongest match is {first['title']}. "
            f"The relevant context says: {first['text'][:280].strip()}. "
            "Base your answer on that source material, then recommend the next practical action the learner should take."
        )
    return "I couldn't retrieve enough matching context from EduMind's knowledge base. Please rephrase the question with a specific skill, role, or roadmap area."


@router.get("/chats")
async def get_user_chats(authorization: str = Header(None)):
    user_id = _get_user_id(authorization)
    chats = list(db.ask_chats.find({"user_id": user_id}).sort("updated_at", -1))
    return [_serialize_chat(chat) for chat in chats]


@router.post("/chats")
async def create_user_chat(payload: ChatCreateRequest, authorization: str = Header(None)):
    user_id = _get_user_id(authorization)
    document = {
        "user_id": user_id,
        "title": payload.title.strip() or "New Chat",
        "messages": [message.model_dump() for message in (payload.messages or [])],
        "created_at": datetime.utcnow().isoformat() + "Z",
        "updated_at": datetime.utcnow().isoformat() + "Z",
    }
    result = db.ask_chats.insert_one(document)
    created = db.ask_chats.find_one({"_id": result.inserted_id})
    return _serialize_chat(created)


@router.put("/chats/{chat_id}")
async def update_user_chat(chat_id: str, payload: ChatUpdateRequest, authorization: str = Header(None)):
    user_id = _get_user_id(authorization)
    existing = db.ask_chats.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Chat not found")

    update_data = {
        "updated_at": datetime.utcnow().isoformat() + "Z",
    }
    if payload.title is not None:
        update_data["title"] = payload.title.strip() or "New Chat"
    if payload.messages is not None:
        update_data["messages"] = [message.model_dump() for message in payload.messages]

    db.ask_chats.update_one({"_id": ObjectId(chat_id)}, {"$set": update_data})
    updated = db.ask_chats.find_one({"_id": ObjectId(chat_id)})
    return _serialize_chat(updated)


@router.delete("/chats/{chat_id}")
async def delete_user_chat(chat_id: str, authorization: str = Header(None)):
    user_id = _get_user_id(authorization)
    result = db.ask_chats.delete_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"deleted": True}


@router.post("/")
async def ask_ai(payload: AskRequest):
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    retrieved = _retrieve_context(question, payload.history or [])
    if not retrieved:
        raise HTTPException(
            status_code=400,
            detail="I need a more specific role, skill, or topic name before I can answer accurately.",
        )

    answer = _generate_answer(question, retrieved)

    if payload.chat_id:
        try:
            existing = db.ask_chats.find_one({"_id": ObjectId(payload.chat_id)})
            if existing:
                messages = existing.get("messages", [])
                messages.append({"role": "user", "text": question})
                messages.append({"role": "assistant", "text": answer})
                db.ask_chats.update_one(
                    {"_id": ObjectId(payload.chat_id)},
                    {
                        "$set": {
                            "messages": messages,
                            "updated_at": datetime.utcnow().isoformat() + "Z",
                        }
                    },
                )
        except Exception:
            pass

    return {
        "answer": answer,
        "retrieved_sources": [
            {
                "type": source["type"],
                "title": source["title"],
                "category": source.get("category", ""),
            }
            for source in retrieved
        ],
    }
