# SIP Platform Frontend

A minimal static frontend to call the backend `GET /ask` endpoint.

## Run

1. Start backend:
   - `cd backend`
   - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

2. Start static server (in another terminal):
   - `cd frontend`
   - `python -m http.server 3000`

3. Open browser:
   - http://127.0.0.1:3000

## Usage

- Type a question in the textarea and click "Ask".
- Backend should be running with an initialized RAG index.

## Notes

- CORS already enabled for all origins in `backend/app/main.py`.
- If using other ports, update `backendUrl` in `app.js`.
