# Build Pa'l Norte

Hackathon landing site and member platform for Build Pa'l Norte (Matamoros, 2026).

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database setup

Member profiles and auth use **Neon Postgres**. Waitlist signups stay in **Firestore**.

Run migrations after setting `DATABASE_URL` in `.env` or `.env.local`:

```bash
pnpm auth:migrate   # Better Auth tables (user, session, …)
pnpm db:migrate     # Platform tables (members, …)
```

Run both in **every environment** (local, preview, production) before deploying profile features. Without `db:migrate`, `/profile` will fail with `relation "members" does not exist`.

## Platform docs

See [`docs/PLATFORM.md`](docs/PLATFORM.md) for the product roadmap, data models, and phased build plan.

## Deploy

On Vercel (or any host), add a build or release step that runs:

```bash
pnpm auth:migrate && pnpm db:migrate
```

Ensure `DATABASE_URL`, `BETTER_AUTH_SECRET`, and Google OAuth env vars are configured.
