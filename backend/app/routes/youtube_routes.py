"""youtube_routes.py

FastAPI router that fetches REAL YouTube videos for a given skill/topic search
query, so the Skills page can show videos that match whatever the user is
currently learning (instead of hardcoded mock data).

Setup
-----
1. pip install httpx fastapi
2. Get a YouTube Data API v3 key: https://console.cloud.google.com/apis/library/youtube.googleapis.com
3. Add to your backend .env:
       YOUTUBE_API_KEY=your_key_here

4. In your main FastAPI app:

       from youtube_routes import router as youtube_router
       app.include_router(youtube_router, prefix="/api/youtube", tags=["youtube"])

Endpoint
--------
GET /api/youtube/search?query=Python+Variables+tutorial&max_results=4

Response
--------
{
  "query": "Python Variables tutorial",
  "videos": [
    {
      "id": "abc123",
      "title": "Python Variables Explained",
      "channel": "CodeAcademy Labs",
      "thumbnail": "https://i.ytimg.com/vi/abc123/mqdefault.jpg",
      "duration": "12:34",
      "views": "120K views",
      "publishedAt": "2024-03-10T00:00:00Z",
      "url": "https://www.youtube.com/watch?v=abc123"
    },
    ...
  ]
}
"""

import os
import re
import time
from typing import Optional


# Topic-specific fallback videos for each skill — shown when YouTube API is unavailable
DEFAULT_FALLBACK_VIDEOS = {
    "python": {
        "introduction": [
            {
                "id": "python-intro-1",
                "title": "Python for Beginners - Full Masterclass",
                "channel": "CodeAcademy Labs",
                "thumbnail": "",
                "duration": "45:20",
                "views": "120K views",
                "url": "https://www.youtube.com/results?search_query=python+for+beginners",
            },
            {
                "id": "python-intro-2",
                "title": "What is Python? A Complete Beginner's Guide",
                "channel": "Programming Tutorials",
                "thumbnail": "",
                "duration": "15:30",
                "views": "89K views",
                "url": "https://www.youtube.com/results?search_query=what+is+python+beginners",
            },
        ],
        "variables": [
            {
                "id": "python-var-1",
                "title": "Python Variables Explained",
                "channel": "freeCodeCamp.org",
                "thumbnail": "",
                "duration": "18:40",
                "views": "450K views",
                "url": "https://www.youtube.com/results?search_query=python+variables+tutorial",
            },
            {
                "id": "python-var-2",
                "title": "Variable Assignment and Naming Rules in Python",
                "channel": "CS Dojo",
                "thumbnail": "",
                "duration": "12:15",
                "views": "320K views",
                "url": "https://www.youtube.com/results?search_query=python+variable+assignment",
            },
        ],
        "datatypes": [
            {
                "id": "python-dt-1",
                "title": "Python Data Types Explained - Strings, Lists, Tuples",
                "channel": "Corey Schafer",
                "thumbnail": "",
                "duration": "28:45",
                "views": "580K views",
                "url": "https://www.youtube.com/results?search_query=python+data+types+tutorial",
            },
            {
                "id": "python-dt-2",
                "title": "Understanding Dictionaries in Python",
                "channel": "Programming with Mosh",
                "thumbnail": "",
                "duration": "22:10",
                "views": "410K views",
                "url": "https://www.youtube.com/results?search_query=python+dictionaries+tutorial",
            },
        ],
        "operators": [
            {
                "id": "python-op-1",
                "title": "Python Operators - Arithmetic, Logical & Comparison",
                "channel": "Code Monkey",
                "thumbnail": "",
                "duration": "19:20",
                "views": "245K views",
                "url": "https://www.youtube.com/results?search_query=python+operators+tutorial",
            },
            {
                "id": "python-op-2",
                "title": "Bitwise Operators Explained in Python",
                "channel": "Edureka",
                "thumbnail": "",
                "duration": "24:50",
                "views": "156K views",
                "url": "https://www.youtube.com/results?search_query=python+bitwise+operators",
            },
        ],
        "loops": [
            {
                "id": "python-loop-1",
                "title": "Python Loops and Conditionals - Complete Guide",
                "channel": "Real Python",
                "thumbnail": "",
                "duration": "35:40",
                "views": "675K views",
                "url": "https://www.youtube.com/results?search_query=python+loops+conditionals+tutorial",
            },
            {
                "id": "python-loop-2",
                "title": "For Loops vs While Loops in Python",
                "channel": "Tech With Tim",
                "thumbnail": "",
                "duration": "16:25",
                "views": "298K views",
                "url": "https://www.youtube.com/results?search_query=python+for+loops+while+loops",
            },
        ],
        "functions": [
            {
                "id": "python-func-1",
                "title": "Python Functions - Parameters, Arguments, and Return Values",
                "channel": "Programming with Mosh",
                "thumbnail": "",
                "duration": "26:30",
                "views": "523K views",
                "url": "https://www.youtube.com/results?search_query=python+functions+tutorial",
            },
            {
                "id": "python-func-2",
                "title": "Lambda Functions in Python",
                "channel": "Corey Schafer",
                "thumbnail": "",
                "duration": "14:20",
                "views": "187K views",
                "url": "https://www.youtube.com/results?search_query=python+lambda+functions",
            },
        ],
        "oop": [
            {
                "id": "python-oop-1",
                "title": "Object-Oriented Programming in Python - Classes & Objects",
                "channel": "Corey Schafer",
                "thumbnail": "",
                "duration": "32:15",
                "views": "892K views",
                "url": "https://www.youtube.com/results?search_query=python+oop+classes+objects",
            },
            {
                "id": "python-oop-2",
                "title": "Inheritance and Polymorphism in Python",
                "channel": "Tech With Tim",
                "thumbnail": "",
                "duration": "28:40",
                "views": "445K views",
                "url": "https://www.youtube.com/results?search_query=python+inheritance+polymorphism",
            },
        ],
    },
    "sql": {
        "introduction": [
            {
                "id": "sql-intro-1",
                "title": "SQL for Beginners - Learn SQL in 1 Hour",
                "channel": "Programming with Mosh",
                "thumbnail": "",
                "duration": "58:10",
                "views": "2.1M views",
                "url": "https://www.youtube.com/results?search_query=sql+for+beginners",
            },
            {
                "id": "sql-intro-2",
                "title": "Why Databases Matter - Introduction to SQL",
                "channel": "Stanford Online",
                "thumbnail": "",
                "duration": "22:05",
                "views": "156K views",
                "url": "https://www.youtube.com/results?search_query=why+databases+sql+introduction",
            },
        ],
        "select": [
            {
                "id": "sql-select-1",
                "title": "SQL SELECT Queries - Filtering and Sorting",
                "channel": "Database Design Academy",
                "thumbnail": "",
                "duration": "31:20",
                "views": "289K views",
                "url": "https://www.youtube.com/results?search_query=sql+select+queries+filtering",
            },
            {
                "id": "sql-select-2",
                "title": "Using WHERE Clauses in SQL",
                "channel": "freeCodeCamp.org",
                "thumbnail": "",
                "duration": "18:45",
                "views": "412K views",
                "url": "https://www.youtube.com/results?search_query=sql+where+clause",
            },
        ],
        "joins": [
            {
                "id": "sql-join-1",
                "title": "SQL Joins Explained Clearly",
                "channel": "freeCodeCamp.org",
                "thumbnail": "",
                "duration": "21:04",
                "views": "880K views",
                "url": "https://www.youtube.com/results?search_query=sql+joins+tutorial",
            },
            {
                "id": "sql-join-2",
                "title": "INNER JOIN vs LEFT JOIN vs RIGHT JOIN",
                "channel": "Database Star",
                "thumbnail": "",
                "duration": "24:30",
                "views": "567K views",
                "url": "https://www.youtube.com/results?search_query=sql+joins+comparison",
            },
        ],
        "schema": [
            {
                "id": "sql-schema-1",
                "title": "Database Schema Design Best Practices",
                "channel": "Database Design Academy",
                "thumbnail": "",
                "duration": "38:50",
                "views": "234K views",
                "url": "https://www.youtube.com/results?search_query=database+schema+design",
            },
            {
                "id": "sql-schema-2",
                "title": "Primary Keys and Foreign Keys Explained",
                "channel": "freeCodeCamp.org",
                "thumbnail": "",
                "duration": "19:15",
                "views": "356K views",
                "url": "https://www.youtube.com/results?search_query=sql+primary+foreign+keys",
            },
        ],
        "functions": [
            {
                "id": "sql-func-1",
                "title": "SQL Aggregate Functions - COUNT, SUM, AVG, MIN, MAX",
                "channel": "SQLzap",
                "thumbnail": "",
                "duration": "26:40",
                "views": "421K views",
                "url": "https://www.youtube.com/results?search_query=sql+aggregate+functions",
            },
            {
                "id": "sql-func-2",
                "title": "Date Functions in SQL - DATE, YEAR, MONTH",
                "channel": "Database Design Academy",
                "thumbnail": "",
                "duration": "20:30",
                "views": "198K views",
                "url": "https://www.youtube.com/results?search_query=sql+date+functions",
            },
        ],
    },
    "javascript": {
        "introduction": [
            {
                "id": "js-intro-1",
                "title": "JavaScript Crash Course for Beginners",
                "channel": "Traversy Media",
                "thumbnail": "",
                "duration": "1:00:00",
                "views": "1.8M views",
                "url": "https://www.youtube.com/results?search_query=javascript+crash+course",
            },
            {
                "id": "js-intro-2",
                "title": "JavaScript Basics - Why Learn JavaScript?",
                "channel": "The Net Ninja",
                "thumbnail": "",
                "duration": "14:20",
                "views": "267K views",
                "url": "https://www.youtube.com/results?search_query=javascript+basics+beginners",
            },
        ],
        "dom": [
            {
                "id": "js-dom-1",
                "title": "JavaScript DOM Manipulation - Selecting Elements",
                "channel": "Traversy Media",
                "thumbnail": "",
                "duration": "24:15",
                "views": "634K views",
                "url": "https://www.youtube.com/results?search_query=javascript+dom+manipulation",
            },
            {
                "id": "js-dom-2",
                "title": "Event Listeners and Event Handling in JavaScript",
                "channel": "Code Monkey",
                "thumbnail": "",
                "duration": "19:50",
                "views": "478K views",
                "url": "https://www.youtube.com/results?search_query=javascript+event+listeners",
            },
        ],
        "async": [
            {
                "id": "js-async-1",
                "title": "Async JavaScript Explained",
                "channel": "freeCodeCamp.org",
                "thumbnail": "",
                "duration": "32:12",
                "views": "700K views",
                "url": "https://www.youtube.com/results?search_query=async+javascript+tutorial",
            },
            {
                "id": "js-async-2",
                "title": "Promises and Async/Await in JavaScript",
                "channel": "Traversy Media",
                "thumbnail": "",
                "duration": "28:40",
                "views": "592K views",
                "url": "https://www.youtube.com/results?search_query=javascript+promises+async+await",
            },
        ],
    },
}

import httpx
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")
SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"

# ---------------------------------------------------------------------------
# Tiny in-memory cache so repeated searches for the same topic (very common,
# since many students click the same skill) don't burn API quota.
# Swap this for Redis/Mongo-backed caching in production.
# ---------------------------------------------------------------------------
_CACHE: dict[str, tuple[float, dict]] = {}
_CACHE_TTL_SECONDS = 60 * 60 * 6  # 6 hours


def _cache_get(key: str):
    hit = _CACHE.get(key)
    if not hit:
        return None
    ts, value = hit
    if time.time() - ts > _CACHE_TTL_SECONDS:
        _CACHE.pop(key, None)
        return None
    return value


def _cache_set(key: str, value: dict):
    _CACHE[key] = (time.time(), value)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _format_duration(iso_duration: str) -> str:
    """Convert ISO 8601 duration (e.g. 'PT28M15S') to 'mm:ss' or 'h:mm:ss'."""
    match = re.match(
        r"PT(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?",
        iso_duration or "",
    )
    if not match:
        return "0:00"
    hours = int(match.group("hours") or 0)
    minutes = int(match.group("minutes") or 0)
    seconds = int(match.group("seconds") or 0)
    if hours:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes}:{seconds:02d}"


def _format_views(count_str: Optional[str]) -> str:
    """Convert '120345' -> '120K views'."""
    try:
        count = int(count_str or 0)
    except ValueError:
        return "0 views"
    if count >= 1_000_000:
        return f"{count / 1_000_000:.1f}M views".replace(".0M", "M")
    if count >= 1_000:
        return f"{count / 1_000:.1f}K views".replace(".0K", "K")
    return f"{count} views"


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------

def _fallback_videos_for_query(query: str, max_results: int = 4) -> dict:
    """
    Return topic-specific fallback videos based on the query string.
    Query format: "{skillName} {topicName} tutorial" e.g., "Python Variables tutorial"
    """
    normalized = (query or "").lower()
    
    # Map topic names to their keys in the fallback dictionary
    topic_mapping = {
        "introduction": "introduction",
        "install": "introduction",
        "setup": "introduction",
        "variables": "variables",
        "datatypes": "datatypes",
        "data types": "datatypes",
        "operators": "operators",
        "loops": "loops",
        "conditionals": "loops",
        "functions": "functions",
        "oop": "oop",
        "object-oriented": "oop",
        "select": "select",
        "queries": "select",
        "joins": "joins",
        "schema": "schema",
        "design": "schema",
        "dom": "dom",
        "async": "async",
    }
    
    # Identify skill
    skill_key = None
    for skill in DEFAULT_FALLBACK_VIDEOS.keys():
        if skill in normalized:
            skill_key = skill
            break
    
    if not skill_key:
        skill_key = "python"  # default fallback
    
    # Identify topic
    topic_key = "introduction"  # default topic
    for topic_name, topic_key_value in topic_mapping.items():
        if topic_name in normalized:
            topic_key = topic_key_value
            break
    
    # Get topic-specific videos
    skill_videos = DEFAULT_FALLBACK_VIDEOS.get(skill_key, {})
    topic_videos = skill_videos.get(topic_key, [])
    
    # If no topic-specific videos, fall back to first available topic
    if not topic_videos:
        topic_videos = next(iter(skill_videos.values()), [])
    
    return {"query": query, "videos": topic_videos[:max_results]}


@router.get("/search")
async def search_videos(
    query: str = Query(..., min_length=2, description="e.g. 'Python Variables tutorial'"),
    max_results: int = Query(4, ge=1, le=10),
):
    if not YOUTUBE_API_KEY:
        return _fallback_videos_for_query(query, max_results)

    cache_key = f"{query.lower().strip()}::{max_results}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    async with httpx.AsyncClient(timeout=10) as client:
        # Step 1: search for matching videos
        search_resp = await client.get(
            SEARCH_URL,
            params={
                "part": "snippet",
                "q": query,
                "type": "video",
                "maxResults": max_results,
                "relevanceLanguage": "en",
                "safeSearch": "strict",
                "videoEmbeddable": "true",
                "key": YOUTUBE_API_KEY,
            },
        )
        if search_resp.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"YouTube search failed: {search_resp.text}",
            )
        search_data = search_resp.json()
        items = search_data.get("items", [])
        video_ids = [item["id"]["videoId"] for item in items if item.get("id", {}).get("videoId")]

        if not video_ids:
            result = {"query": query, "videos": []}
            _cache_set(cache_key, result)
            return result

        # Step 2: fetch duration + view count for those videos
        details_resp = await client.get(
            VIDEOS_URL,
            params={
                "part": "contentDetails,statistics,snippet",
                "id": ",".join(video_ids),
                "key": YOUTUBE_API_KEY,
            },
        )
        if details_resp.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"YouTube video details failed: {details_resp.text}",
            )
        details_data = details_resp.json()

    videos = []
    for item in details_data.get("items", []):
        snippet = item.get("snippet", {})
        content_details = item.get("contentDetails", {})
        statistics = item.get("statistics", {})
        thumbnails = snippet.get("thumbnails", {})
        thumb = (
            thumbnails.get("medium", {}).get("url")
            or thumbnails.get("default", {}).get("url", "")
        )
        videos.append(
            {
                "id": item.get("id"),
                "title": snippet.get("title", "Untitled"),
                "channel": snippet.get("channelTitle", "Unknown channel"),
                "thumbnail": thumb,
                "duration": _format_duration(content_details.get("duration", "")),
                "views": _format_views(statistics.get("viewCount")),
                "publishedAt": snippet.get("publishedAt"),
                "url": f"https://www.youtube.com/watch?v={item.get('id')}",
            }
        )

    result = {"query": query, "videos": videos}
    _cache_set(cache_key, result)
    return result

