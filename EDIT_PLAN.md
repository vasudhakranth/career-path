# Redesign Plan: GeeksforGeeks-style Skill Learning Page

## Changes Required

### 1. Sidebar Redesign (GeeksforGeeks-style)
- **Search bar** at top to filter topics/subtopics
- **Beginner / Intermediate / Advanced sections** with collapsible groups
- **Tree structure** with proper indentation and level indicators
- **Progress checkmarks** (green check for completed topics)
- **Active topic highlighting** with left border accent
- **Topic count badges** (e.g., "3/5 completed")

### 2. Main Content Redesign (Article-style like GFG)
- **Breadcrumb navigation** showing path: Skill → Level → Topic → Subtopic
- **Article-like content layout** with proper headings, code blocks, and output sections
- **"Mark as Completed" button** with checkmark animation
- **Previous/Next navigation** at bottom for moving between topics
- **Topic progress bar** at top showing overall progress

### 3. Data Structure Changes
- Add `level` field to topics (beginner/intermediate/advanced)
- Restructure sidebar to group topics by level
- Add completion tracking state (localStorage based)

### 4. State Changes
- Add `searchQuery` state for filtering
- Add `completedTopics` state (Set of completed topic IDs, stored in localStorage)
- Add `sidebarCollapsed` state for mobile toggle

### Files to Edit
- `frontend/src/pages/SkillLearningPage.jsx` - Complete rewrite of component
- `frontend/src/pages/SkillLearningPage.css` - Complete rewrite of styles
