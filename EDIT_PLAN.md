# Edit Plan

## Information Gathered
- `frontend/src/layouts/Layout.jsx` renders a left sidebar with links to:
  - Home, Dashboard, skills, resume builder, mentor, projects, smart time table.
- This sidebar is currently hidden on small screens (`hidden lg:block`) but still exists on `lg+` screens.
- User request: remove these sidebar pages: **Dashboard, Skills, Roadmap timetable, Mentor page, Resume builder pages**.
  (Roadmap timetable likely refers to `/smart-time-table`; however the sidebar currently does not include `/roadmap`.)

## Plan
1. Edit `frontend/src/layouts/Layout.jsx`:
   - Remove sidebar links for:
     - `/dashboard` (Dashboard)
     - `/skills` (skills)
     - `/smart-time-table` (smart time table / roadmap timetable)
     - `/mentor` (mentor)
     - `/resume` (resume builder)
   - Keep remaining links: Home and Projects.
2. Leave routing (`frontend/src/App.jsx`) unchanged.
3. Test by running the app and verifying sidebar items are gone.

## Dependent Files to edit
- `frontend/src/layouts/Layout.jsx`

## Followup steps
- (Already running) verify UI at `lg+` screen sizes.

<ask_followup_question>
Confirm whether to keep ONLY “Home” and “Projects” in the sidebar after removing Dashboard/Skills/Smart Time Table/Mentor/Resume Builder.
</ask_followup_question>

