# LLM Compare Frontend

Production-quality Next.js app for searching, comparing, filtering, and estimating cost across large language models.

This app lives under `frontend/` and is installed independently from the backend.

## Tech Stack

- Next.js + React + TypeScript
- Tailwind CSS
- Zustand state management
- Local mock dataset (`/data/models.ts`)

## Features

- Use-case search with local relevance scoring (no backend)
- Sort by relevance or cost
- Filter by provider, capability, and max price slider
- Comparison cards for top 3 matches with badges:
  - Best match
  - Cheapest
  - Fastest
- Results table with model specs and pricing
- Cost simulator from monthly token input
- Sticky search bar, loading skeletons, responsive SaaS UI
- Empty state support when no filters match

## Mock Data Providers

The app includes models from:

- OpenAI
- Hugging Face
- Google Vertex AI
- Amazon Bedrock
- Azure OpenAI

Each model includes:

- `id`
- `name`
- `provider`
- `capabilities`
- `price_per_1k_tokens`
- `context_window`
- `latency`
- `description`
- `documentation_url`

## Relevance Logic (frontend-only)

Keyword mapping:

- `customer support` → `chat` + low latency boost
- `coding` → `code generation`
- `analysis` → `reasoning`
- `summary` terms → `summarization`

Scoring runs entirely in-browser using the mock dataset.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run production server
- `npm run lint` – lint checks

## Security

- No backend code
- No API keys
- No external credential references
