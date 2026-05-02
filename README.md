# LLM Compare Monorepo

This repository contains two independent applications:

- `frontend/` — Next.js + TypeScript UI for model comparison
- `backend/` — Express + TypeScript API for model search and cost estimation

## Run independently

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

No shared dependency graph is used between the two applications.
