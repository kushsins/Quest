# Quest

> Modern Support Ticket Management Platform

Quest is a support ticket management application with a glassmorphism UI, a modular Express API, and PostgreSQL persistence. Milestones 1–4 (Foundation, Authentication, Ticket Management, Dashboard) and stretch goals (tests, Docker, CI, Swagger) are complete.

**Repository:** [github.com/kushsins/Quest](https://github.com/kushsins/Quest)

## Live Demo

| Service | URL |
|---------|-----|
| Frontend (Vercel) | [quest-phi-six.vercel.app](https://quest-phi-six.vercel.app/) |
| Backend API (Render) | [quest-ed8x.onrender.com](https://quest-ed8x.onrender.com/) |
| Swagger / OpenAPI | [quest-ed8x.onrender.com/api/docs](https://quest-ed8x.onrender.com/api/docs) |
| Health check | [quest-ed8x.onrender.com/api/v1/health](https://quest-ed8x.onrender.com/api/v1/health) |

Sign in with the [seed users](#seed-users) (`manager@quest.com` / `password123`). On Render’s free tier, the API may sleep; the first request after idle can take up to a minute. Swagger is available when `SWAGGER_ENABLED=true` on the backend.

## Features

- **Authentication** — JWT access tokens (in-memory), HttpOnly refresh cookies, silent session restore, role-based access (Manager / Member)
- **Ticket management** — Full CRUD, comments, activity timeline, search, filters (status, priority, assignee, reporter), sort, pagination, inline editing, resizable detail panel
- **Dashboard** — KPI cards, recent activity, assigned and recently updated tickets, status and priority distribution charts
- **UI** — Glassmorphism design system, light / dark / system themes, responsive sidebar and ticket workspace
- **API** — Versioned REST API (`/api/v1`), standardized success/error responses, optional Swagger docs
- **Quality** — Automated tests (Vitest + Supertest + React Testing Library), Docker Compose full stack, GitHub Actions CI

## Tech Stack

### Frontend

- React 19
- Vite
- TypeScript
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- React Hook Form
- Zod
- shadcn/ui (Radix UI primitives)
- Vitest + React Testing Library

### Backend

- Node.js 22
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (environment validation)
- JWT (access tokens)
- bcrypt (password hashing)
- Swagger (OpenAPI via swagger-jsdoc + swagger-ui-express)
- Vitest + Supertest

### Infrastructure

- Docker Compose (full stack: frontend, backend, PostgreSQL)
- Docker Compose (database-only dev setup: PostgreSQL, Adminer)
- GitHub Actions CI
- Vercel (frontend hosting)
- Render (backend API + PostgreSQL)

## Folder Structure

```text
quest/
├── .github/                # CI workflows
├── client/                 # React frontend
│   └── src/
│       ├── app/            # App shell, providers, router
│       ├── features/       # Feature modules (health, auth, tickets, ...)
│       ├── shared/         # Reusable UI, API client, auth utilities, theme, hooks
│       └── assets/         # Global styles and static assets
├── server/                 # Express API
│   ├── prisma/             # Schema and migrations
│   └── src/
│       ├── config/         # Environment and database
│       ├── middleware/     # Global middleware
│       ├── modules/        # Feature modules
│       └── shared/         # API response helpers, errors, logger
├── docker/                 # Docker Compose configuration
└── docs/                   # Product and engineering documentation
    └── assessment/         # JS AI Capability Exercise submission artifacts
```

## Prerequisites

- Node.js 22+ (see `.nvmrc`)
- npm 10+
- Docker Desktop (or Docker Engine with Compose)

## Environment Setup

### Backend

Copy the example environment file and adjust values if needed:

```bash
cp server/.env.example server/.env
```

| Variable | Description |
|----------|-------------|
| `PORT` | API server port (default: `3000`) |
| `NODE_ENV` | `development`, `production`, or `test` |
| `DATABASE_URL` | PostgreSQL connection string |
| `CORS_ORIGIN` | Allowed frontend origin |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens (min 32 characters) |
| `JWT_REFRESH_SECRET` | Server pepper for hashing refresh tokens (min 32 characters) |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token lifetime (e.g. `15m`) |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime (e.g. `7d`) |
| `SWAGGER_ENABLED` | Set to `true` to expose OpenAPI docs at `/api/docs` (off by default in production) |

### Frontend

Copy the example environment file:

```bash
cp client/.env.example client/.env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (default: `http://localhost:3000/api/v1`) |

Never commit `.env` files. Example files contain no secrets.

## Run the Full Stack with Docker

The entire application (frontend, backend, and PostgreSQL) runs with a single command.

### 1. Prepare environment files

```bash
# Root compose configuration (ports, DB credentials, seeding flag)
cp .env.docker.example .env

# Backend secrets (JWT, token lifetimes) — reused by the backend container
cp server/.env.example server/.env
```

The backend container reads `server/.env` for secrets and overrides `DATABASE_URL`
and `CORS_ORIGIN` to point at the Docker network. No secrets are hardcoded in the
Dockerfiles or compose file.

### 2. Start everything

```bash
docker compose up --build
```

This builds and starts three services:

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | [http://localhost:8080](http://localhost:8080) | Static build served by nginx |
| Backend API | [http://localhost:3000](http://localhost:3000) | Express + Prisma |
| PostgreSQL | `localhost:5432` | Persisted in the `quest_postgres_data` volume |

**Startup order** is enforced automatically:

1. `postgres` starts and becomes healthy (`pg_isready`).
2. `server` waits for the healthy database, then runs `prisma migrate deploy`
   and starts the API.
3. `client` (nginx) serves the frontend.

### 3. Seed the database (optional)

Seeding is off by default. Enable it for the initial run by setting `SEED_ON_START=true`
in `.env`, or run it once on demand:

```bash
docker compose run --rm -e SEED_ON_START=true server /bin/sh -c "npx prisma db seed"
```

After seeding, the [seed users](#seed-users) become available.

### 4. Stop the stack

```bash
docker compose down          # stop containers, keep data
docker compose down -v       # stop containers and delete the database volume
```

### Ports and configuration

All host ports and credentials are configurable via the root `.env` file
(`CLIENT_PORT`, `SERVER_PORT`, `POSTGRES_PORT`, `POSTGRES_USER`, etc.).
If you change `CLIENT_PORT`, also update `CORS_ORIGIN`, and rebuild the client if
you change `VITE_API_BASE_URL` (it is baked into the bundle at build time).

## Local Development

For local work, use `localhost` URLs in `server/.env` and `client/.env` (see [Environment Setup](#environment-setup)). The [Live Demo](#live-demo) links are for the hosted deployment only.

Recommended flow: start PostgreSQL with Docker, then run the API and Vite dev server.

### 1. Database (PostgreSQL)

```bash
docker compose -f docker/docker-compose.yml up -d
```

PostgreSQL listens on `localhost:5433` (`quest` / `quest` / database `quest`). Adminer UI: [http://localhost:8081](http://localhost:8081) (server hostname `postgres`).

### 2. Backend

```bash
cp server/.env.example server/.env   # adjust DATABASE_URL, secrets, CORS_ORIGIN
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

API: [http://localhost:3000](http://localhost:3000)

**Prisma commands**

| Command | Purpose |
|---------|---------|
| `npm run prisma:generate` | Regenerate Prisma Client after schema changes |
| `npm run prisma:migrate` | Create/apply migrations in development (`prisma migrate dev`) |
| `npm run prisma:seed` | Seed roles, permissions, users, and sample tickets |
| `npm run prisma:studio` | Open Prisma Studio |

Production and Docker use `prisma migrate deploy` (see [Docker](#run-the-full-stack-with-docker) and [Deployment](#deployment)).

### 3. Frontend

```bash
cp client/.env.example client/.env   # VITE_API_BASE_URL=http://localhost:3000/api/v1
cd client
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

### Seed Users

After seeding, the following users are available:

| Email | Password | Name | Role |
|-------|----------|------|------|
| `manager@quest.com` | `password123` | John Doe | Manager |
| `member@quest.com` | `password123` | Jane Smith | Member |

## Development Commands

### Backend (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with hot reload |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run production build |
| `npm run prisma:migrate` | Apply database migrations |
| `npm run prisma:seed` | Seed roles, permissions, users, and sample tickets |
| `npm run prisma:studio` | Open Prisma Studio |

### Frontend (`client/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run preview` | Preview production build |

See [Testing](#testing) for `npm run test` commands.

## Testing

Automated tests run in CI on every push and pull request. See [`docs/07-testing-strategy.md`](docs/07-testing-strategy.md) for manual checklists.

**Backend** (`server/`) — Vitest + Supertest; 66 tests (50 unit, 16 integration).

```bash
cd server
npm run test              # unit + integration
npm run test:unit         # unit only
npm run test:integration  # integration (requires PostgreSQL on port 5433)
npm run test:coverage
```

Integration tests use a dedicated `quest_test` database. Copy `server/.env.test.example` to `server/.env.test` if needed. The test runner creates the database and runs migrations automatically when PostgreSQL is available on `localhost:5433`.

**Frontend** (`client/`) — Vitest + React Testing Library; 89 tests.

```bash
cd client
npm run test
npm run test:coverage
```

**Full verification** (both apps):

```bash
cd server && npm run lint && npm run typecheck && npm run test && npm run build
cd ../client && npm run lint && npm run typecheck && npm run test && npm run build
```

## Deployment

Production is split across Vercel (frontend) and Render (API + PostgreSQL).

### Vercel — Frontend

| Setting | Value |
|---------|-------|
| Root directory | `client` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 22 (see `.nvmrc`) |

**Environment variable**

| Variable | Example |
|----------|---------|
| `VITE_API_BASE_URL` | `https://your-api.onrender.com/api/v1` |

`vercel.json` rewrites all routes to `index.html` for client-side routing. Rebuild after changing `VITE_API_BASE_URL` (value is baked into the bundle).

### Render — Backend + PostgreSQL

Create a **PostgreSQL** instance and a **Web Service** from the `server/` directory (or the monorepo with root directory `server`).

| Setting | Value |
|---------|-------|
| Build command | `npm ci && npx prisma generate && npm run build` |
| Start command | `npx prisma migrate deploy && npm start` |
| Node.js version | 22 |

**Environment variables** (set on the web service; link `DATABASE_URL` from the Render PostgreSQL instance):

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Render PostgreSQL internal URL |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | Your Vercel frontend URL (exact origin, no trailing slash) |
| `JWT_ACCESS_SECRET` | Min 32 characters |
| `JWT_REFRESH_SECRET` | Min 32 characters |
| `ACCESS_TOKEN_EXPIRES_IN` | e.g. `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | e.g. `7d` |
| `SWAGGER_ENABLED` | `true` to expose `/api/docs` |

After the first deploy, run the seed once (Render shell or one-off job):

```bash
npx prisma db seed
```

Both apps must use HTTPS in production so refresh cookies are sent with `Secure` flag.

## Verification

After starting Docker, the backend, and the frontend:

```bash
curl http://localhost:3000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "Service is healthy.",
  "data": {
    "status": "ok",
    "database": true,
    "timestamp": "..."
  }
}
```

The home route (`/`) redirects authenticated users to `/dashboard`. System health is available at `/health`. Unauthenticated users are redirected to `/login`.

## Authentication Flow

The frontend uses an in-memory access token and an HttpOnly refresh token cookie managed by the backend.

```text
Application Start
        │
        ▼
   Initializing
   (Auth Splash)
        │
        ▼
  Silent Refresh
  POST /auth/refresh
        │
        ├──────────────────────┐
        ▼                      ▼
 Authenticated           Unauthenticated
 (access token + user)    (no session)
        │                      │
        ▼                      ▼
 Protected routes         Login page
```

**Key behaviors:**

- Access token is stored in memory only (`shared/auth/accessToken.ts`).
- Refresh token is never accessible to JavaScript.
- Axios sends `withCredentials: true` on every request.
- A `401` on protected requests triggers a single queued refresh; concurrent requests wait for the same refresh.
- If refresh returns `401`, authentication state is cleared and the user is redirected to `/login`.
- After login, users return to the route they originally requested (for example `/tickets`).

### Authentication (API)

Login returns an access token in the JSON response and sets the refresh token as an HttpOnly cookie. API clients must send credentials (cookies) for refresh requests.

```bash
curl -c cookies.txt -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@quest.com","password":"password123"}'
```

Use the returned `accessToken` with `Authorization: Bearer <access_token>` for protected endpoints such as `GET /api/v1/auth/me`. Refresh with:

```bash
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/v1/auth/refresh
```

## API Overview

Authenticated endpoints use `Authorization: Bearer <access_token>`. Auth refresh uses the HttpOnly cookie (`withCredentials: true`).

| Area | Method | Endpoint |
|------|--------|----------|
| Health | GET | `/api/v1/health` |
| Auth | POST | `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/logout` |
| Auth | GET | `/api/v1/auth/me` |
| Dashboard | GET | `/api/v1/dashboard` |
| Tickets | GET, POST | `/api/v1/tickets` |
| Tickets | GET, PATCH, DELETE | `/api/v1/tickets/:id` |
| Comments | GET, POST | `/api/v1/tickets/:id/comments` |
| Users | GET | `/api/v1/users` |

Full contract: [`docs/05-api-specification.md`](docs/05-api-specification.md). Interactive docs: `/api/docs` when `SWAGGER_ENABLED=true`.

## Documentation

Project documentation lives in `/docs`:

- [Product Requirements](docs/01-product-requirements.md)
- [UI/UX Specification](docs/02-ui-ux-specification.md)
- [System Architecture](docs/03-system-architecture.md)
- [Database Design](docs/04-database-design.md)
- [API Specification](docs/05-api-specification.md)
- [Project Plan](docs/06-project-plan.md)
- [Testing Strategy](docs/07-testing-strategy.md)

### Assessment submission

Deliverables for the JS AI Capability Exercise are in [docs/assessment/](docs/assessment/README.md):

- [Candidate info](docs/assessment/candidate-info.md)
- [Prompt history](docs/assessment/prompt-history.md) — chronological AI-assisted development log
- [Test results](docs/assessment/test-results.md)
- [Final AI usage summary](docs/assessment/final-ai-usage-summary.md)
