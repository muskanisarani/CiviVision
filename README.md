# CiviVision - Full-Stack AI Municipal Portal

CiviVision is a full-stack civic portal enabling citizens to report sanitation, roads, and water issues, using a custom computer vision AI that automatically detects, prioritizes, and routes dispatches to ward crews.

This project is organized into two standalone directories:
1. [Frontend (Vite / React)](file:///c:/Users/m/OneDrive/Desktop/CiviVision/frontend) - Client application built using React and styled with Bootstrap & custom CSS.
2. [Backend (Express / Node.js)](file:///c:/Users/m/OneDrive/Desktop/CiviVision/backend) - API server utilizing Prisma and PostgreSQL database.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Supabase pooler configured in backend)

### Run Everything in One Command (Terminal)
At the root directory, simply run:
```bash
npm start
```
This will automatically launch the Express backend (on port 5000) and the Vite frontend (on port 5173) concurrently in a single terminal.

---

### Run Separately

#### 1. Running the Backend Server
Go to the `backend/` directory, set up your `.env`, install dependencies, and run the dev server:
```bash
cd backend
npm run dev
```

#### 2. Running the Frontend Client
Go to the `frontend/` directory, install dependencies, and run the Vite dev server:
```bash
cd frontend
npm run dev
```

---

## Tech Stack
- **Frontend**: React, React Router v7, Bootstrap, Vanilla CSS, Vite.
- **Backend**: Node.js, Express, Prisma ORM, JSON Web Tokens (JWT), Cookie-based authentication.
- **AI**: Computer vision models for civic issue categorization and duplicate detection.
