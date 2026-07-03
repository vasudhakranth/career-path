# EduMind - Resume Upload (ATS Friendly) Feature

## Step 1: Backend API
- [ ] Add `POST /api/resume/upload` endpoint in `backend/app/routes/resume.py`
  - [ ] Accept multipart upload: `resume_file`
  - [ ] Validate extensions: pdf/doc/docx
  - [ ] Extract text from file (initial implementation)
  - [ ] Transform extracted text into structured `resume_data`
  - [ ] Save generated resume to DB and return `resume_data`

## Step 2: Backend dependencies
- [ ] Update `backend/requirements.txt` with required extraction libs (based on implementation)

## Step 3: Frontend API client
- [ ] Add `uploadResumeFile(formData)` in `frontend/src/services/api.js`

## Step 4: Frontend UI
- [ ] Update `frontend/src/pages/ResumePage.jsx`
  - [ ] Add file input (accept pdf/doc/docx)
  - [ ] Add “Analyze & Generate ATS Resume” button
  - [ ] Call upload endpoint and set `resumeData` from response
  - [ ] Show loading + error states

## Step 5: QA
- [ ] Run backend + frontend
- [ ] Upload PDF and DOCX and verify preview updates



