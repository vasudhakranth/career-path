# EduMind

EduMind is an AI-powered career roadmap and skill development platform built with React, FastAPI, MongoDB, JWT authentication, Tailwind CSS, and Recharts.

## Project Structure

- `backend/`: FastAPI backend and MongoDB integration
- `frontend/`: React application with routing, Tailwind UI, and charts

## Backend Setup

1. Navigate to `backend/`
2. Create a Python virtual environment
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Ensure MongoDB is running locally
5. Configure `.env` with `MONGODB_URI`, `JWT_SECRET`, `JWT_ALGORITHM`, and `ACCESS_TOKEN_EXPIRE_MINUTES`
6. Seed initial data:
   ```bash
   python seed_data.py
   ```
7. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Frontend Setup

1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/roles`
- `GET /api/roles/{id}`
- `GET /api/skills`
- `GET /api/skills/{id}`
- `GET /api/roadmaps`
- `GET /api/roadmaps/{role}`
- `GET /api/projects`
- `GET /api/projects/{id}`
- `GET /api/dashboard`

## Notes

- Dashboard currently uses JWT authorization header for `/api/dashboard`
- The chatbot page is a placeholder for future AI integration
- Tailwind and Recharts are used for responsive UI and charts
