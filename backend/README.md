# LLM Compare Backend (Node.js + Express + TypeScript)

Production-ready backend API for LLM model search, model detail retrieval, and monthly cost estimation.

## Stack

- Node.js + Express + TypeScript
- Supabase PostgreSQL via `@supabase/supabase-js`
- Zod request validation
- Axios adapter for optional enrichment
- Pino logging with secret redaction

## Architecture

```text
/src
  /routes
  /controllers
  /services
  /adapters
  /repositories
  /middlewares
  /utils
  /config
```

Separation of concerns:
- Routes: endpoint definitions only
- Controllers: HTTP request/response only
- Services: business logic and scoring
- Adapters: external API enrichment
- Repositories: database access only

## API Endpoints

Base prefix: `/v1` (configurable via `API_PREFIX`)

### `GET /v1/health`
Health check.

### `GET /v1/models/search?query=customer%20support`
Returns ranked models sorted by `relevance_score`.

Scoring formula:

```text
relevance_score =
  (capability_match * 0.5) +
  (price_score * 0.3) +
  (latency_score * 0.2)
```

### `GET /v1/models/:id`
Returns full model details.

### `POST /v1/cost/estimate`
Request:

```json
{
  "model_id": "gpt-4o",
  "monthly_tokens": 1000000
}
```

Response:

```json
{
  "success": true,
  "data": {
    "estimated_cost": 5
  }
}
```

## Security

- No hardcoded secrets.
- Service role key is loaded from environment variables only.
- `.env.example` includes placeholders.
- Logs are sanitized with Pino `redact`.
- No credential values are returned in API responses.

## Setup

1. Copy env template:

```bash
cp .env.example .env
```

2. Fill values in `.env`:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Install dependencies and run:

```bash
npm install
npm run dev
```

## Database

Run SQL in `scripts/schema.sql` in Supabase SQL editor.

Seed sample rows:

```bash
npm run seed
```

## Notes

- Adapter enrichment is optional and controlled by `ENRICHMENT_API_BASE_URL` + `ENRICHMENT_API_KEY`.
- If enrichment fails, the service falls back safely to DB values.
