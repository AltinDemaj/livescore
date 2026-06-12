<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

LiveScore is a single Next.js 16 (App Router, Turbopack) web app — there are no separate backend services. It runs fully on **mock data without any env vars or API keys**, so `npm run dev` works out of the box; `FOOTBALL_API_KEY` and the `NEXT_PUBLIC_SUPABASE_*` keys are optional (Supabase only powers auth/favorites/dashboard).

- Run dev server: `npm run dev` (serves http://localhost:3000).
- Lint: `npm run lint`. Note: lint currently reports pre-existing errors (e.g. `@typescript-eslint/no-explicit-any` in `src/services/football-api.ts`, a `react-hooks/set-state-in-effect` issue) unrelated to environment setup.
- Build/start: `npm run build` / `npm run start`.
- Football data flows through Next.js route handlers under `src/app/api/football/*`; `src/services/football.ts` falls back to `src/services/mock-data.ts` when no API key is set.
