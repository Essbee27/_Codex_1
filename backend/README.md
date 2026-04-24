# LLM Compare Backend

Independent Express + TypeScript API application under `backend/`.

## Install and run

```bash
cd backend
npm install
npm run dev
```

## Registry configuration

This project uses the default npm registry via `backend/.npmrc`:

```ini
registry=https://registry.npmjs.org/
```

## Dependencies

Runtime dependencies are intentionally limited to:

- `express`
- `cors`
- `dotenv`
- `axios`
- `zod`
- `@supabase/supabase-js`

No frontend dependencies are used in backend runtime.

## Scripts

- `npm run dev` → `ts-node-dev --respawn src/index.ts`
- `npm run build` → compile TypeScript
- `npm run start` → run compiled app
- `npm run seed` → seed Supabase models table

## API

Base path defaults to `/v1`.

- `GET /v1/health`
- `GET /v1/models/search?query=customer%20support`
- `GET /v1/models/:id`
- `POST /v1/cost/estimate`

### Response format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "message": "...",
    "code": "..."
  }
}
```

## Database fallback behavior

- If Supabase env vars are missing, repository automatically falls back to in-memory mock models.
- If Supabase query fails at runtime, repository falls back to mock models and continues serving requests.
- `/v1/health` reports database mode (`connected`, `mock-fallback`, `degraded-fallback`).

## Environment

Copy `.env.example` to `.env` and provide values for:

- `SUPABASE_URL` (optional)
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

## Database

- schema: `scripts/schema.sql`
- seed: `scripts/seed-models.ts`
