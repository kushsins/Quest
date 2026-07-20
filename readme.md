# Quest

> Modern Support Ticket Management Platform

Quest is a support ticket management application with a glassmorphism UI, a modular Express API, and PostgreSQL persistence. Milestone 1 (Foundation), Milestone 2 (Authentication), Milestone 3 (Ticket Management), and Milestone 4 (Dashboard) are complete.

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

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (environment validation)
- JWT (access tokens)
- bcrypt (password hashing)

### Infrastructure

- Docker Compose (PostgreSQL, Adminer)

## Folder Structure

```text
quest/
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
```

## Prerequisites

- Node.js 20+
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

### Frontend

Copy the example environment file:

```bash
cp client/.env.example client/.env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (default: `http://localhost:3000/api/v1`) |

Never commit `.env` files. Example files contain no secrets.

## Docker Setup

Start PostgreSQL and Adminer from the repository root:

```bash
docker compose -f docker/docker-compose.yml up -d
```

PostgreSQL runs on port `5433` with:

- User: `quest`
- Password: `quest`
- Database: `quest`

### Database UI (Adminer)

Adminer is available at [http://localhost:8081](http://localhost:8081).

Login with:

| Field | Value |
|-------|-------|
| System | PostgreSQL |
| Server | `postgres` |
| Username | `quest` |
| Password | `quest` |
| Database | `quest` |

Use `postgres` as the server hostname (Docker service name), not `localhost`.

Stop the database and Adminer:

```bash
docker compose -f docker/docker-compose.yml down
```

## Backend Setup

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The API listens on `http://localhost:3000`.

### Seed Users

After seeding, the following users are available:

| Email | Password | Role |
|-------|----------|------|
| `manager@quest.com` | `password123` | Manager |
| `member@quest.com` | `password123` | Member |

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

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

## Production Build Commands

From each application directory:

```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

Serve the frontend `dist/` output behind your preferred static host or reverse proxy in production.

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

The home route (`/`) displays the protected system status integration check. Unauthenticated users are redirected to `/login`.

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

## Documentation

Project documentation lives in `/docs`:

- [Product Requirements](docs/01-product-requirements.md)
- [UI/UX Specification](docs/02-ui-ux-specification.md)
- [System Architecture](docs/03-system-architecture.md)
- [Database Design](docs/04-database-design.md)
- [API Specification](docs/05-api-specification.md)
- [Project Plan](docs/06-project-plan.md)
- [Testing Strategy](docs/07-testing-strategy.md)

## Current Status

Milestone 1 (Foundation), Milestone 2 (Authentication), Milestone 3 (Ticket Management), and Milestone 4 (Dashboard) are complete.

### Ticket API (authenticated)

| Method | Endpoint |
|--------|----------|
| GET | `/api/v1/tickets` |
| GET | `/api/v1/tickets/:id` |
| POST | `/api/v1/tickets` |
| PATCH | `/api/v1/tickets/:id` |
| DELETE | `/api/v1/tickets/:id` |
| GET | `/api/v1/tickets/:id/comments` |
| POST | `/api/v1/tickets/:id/comments` |
| GET | `/api/v1/users` |
