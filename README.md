# Resume Analyzer

## Setup
1. **Backend**:
   - `cd backend`
   - `npm install`
   - Create `.env` with `GOOGLE_API_KEY` and `PORT=3001`
   - `npm start`
2. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. Ensure SQLite database (`resumes.db`) is created on first run.

## Dependencies
- Backend: express, sqlite3, multer, pdf-parse, @google/generative-ai, dotenv, cors
- Frontend: react, axios