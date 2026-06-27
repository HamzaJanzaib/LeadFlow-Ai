# 05 — Project Setup Guide

> **LeadFlow AI** · Local Development Environment Setup
> Version 1.0 · Last Updated: 2026-06-27

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Repository Structure Overview](#2-repository-structure-overview)
3. [Step 1 — Clone the Repository](#step-1--clone-the-repository)
4. [Step 2 — Install Dependencies](#step-2--install-dependencies)
5. [Step 3 — Configure Environment Variables](#step-3--configure-environment-variables)
6. [Step 4 — Start Infrastructure Services](#step-4--start-infrastructure-services)
7. [Step 5 — Run Database Migrations](#step-5--run-database-migrations)
8. [Step 6 — Seed the Database](#step-6--seed-the-database)
9. [Step 7 — Start Development Servers](#step-7--start-development-servers)
10. [Step 8 — Verify Everything Works](#step-8--verify-everything-works)
11. [Useful Development Commands](#useful-development-commands)
12. [Troubleshooting](#troubleshooting)
13. [External API Keys Reference](#external-api-keys-reference)

---

## 1. Prerequisites

Ensure the following tools are installed before starting:

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 20.x LTS | [nodejs.org](https://nodejs.org) |
| **pnpm** | 9.x | `npm install -g pnpm` |
| **Docker** | 24+ | [docker.com](https://www.docker.com) |
| **Docker Compose** | v2+ | Included with Docker Desktop |
| **Git** | Any recent | [git-scm.com](https://git-scm.com) |

### Verify Installations

```bash
node --version      # Should print v20.x.x
pnpm --version      # Should print 9.x.x
docker --version    # Should print Docker version 24.x
docker compose version  # Should print Docker Compose version v2.x
git --version
```

---

## 2. Repository Structure Overview

The project is organized as a **pnpm monorepo**:

```
leadflow-ai/
├── apps/
│   ├── web/           <- Next.js frontend (dashboard + marketing)
│   ├── api/           <- Fastify backend (all service modules)
│   └── worker/        <- BullMQ background worker process
├── packages/
│   ├── ui/            <- Shared component library (shadcn/ui)
│   ├── db/            <- Prisma schema + generated client
│   ├── config/        <- Shared config (eslint, tsconfig, etc.)
│   └── ai/            <- LangGraph agents + tools
├── infra/
│   ├── docker/        <- Dockerfiles per app
│   └── k8s/           <- Kubernetes manifests
├── docker-compose.yml <- Local dev infrastructure
├── pnpm-workspace.yaml
├── package.json
└── turbo.json         <- Turborepo build orchestration
```

See [06 — Folder Structure](./06-folder-structure.md) for the complete file tree.

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/your-org/leadflow-ai.git
cd leadflow-ai
```

---

## Step 2 — Install Dependencies

The project uses **pnpm workspaces** with Turborepo for monorepo management.

```bash
pnpm install
```

This installs dependencies for all packages and apps simultaneously.

---

## Step 3 — Configure Environment Variables

### 3.1 Copy Environment Templates

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
```

### 3.2 Root `.env` Variables

```env
# Database
DATABASE_URL=postgresql://leadflow:leadflow@localhost:5432/leadflow_dev
REDIS_URL=redis://localhost:6379

# Object Storage (MinIO)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=leadflow-storage

# Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# Lead Data Providers
APOLLO_API_KEY=...
SERPAPI_KEY=...
HUNTER_API_KEY=...

# AI Observability
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_BASE_URL=http://localhost:3100

# App Config
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:4000
```

### 3.3 Frontend `apps/web/.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY=pk-lf-...
```

### 3.4 API `apps/api/.env`

```env
PORT=4000
DATABASE_URL=postgresql://leadflow:leadflow@localhost:5432/leadflow_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

---

## Step 4 — Start Infrastructure Services

```bash
docker compose up -d
```

This starts:

| Service | Port | Purpose |
|---------|------|---------|
| **PostgreSQL** | `5432` | Primary database |
| **Redis** | `6379` | Cache + job queue |
| **MinIO** | `9000` / `9001` | Object storage |
| **Meilisearch** | `7700` | Full-text search |
| **Langfuse** | `3100` | AI observability |

### Verify Services are Running

```bash
docker compose ps
```

All services should show `Up` status.

### Service Web UIs

| UI | URL | Credentials |
|----|-----|-------------|
| MinIO Console | http://localhost:9001 | `minioadmin` / `minioadmin` |
| Meilisearch | http://localhost:7700 | No auth in dev |
| Langfuse | http://localhost:3100 | Set up on first visit |

---

## Step 5 — Run Database Migrations

```bash
# Generate Prisma client
pnpm --filter @leadflow/db db:generate

# Run all pending migrations
pnpm --filter @leadflow/db db:migrate

# Shortcut from root
pnpm db:migrate
```

> Schema location: `packages/db/prisma/schema.prisma`

### Reset Database (Dev Only)

```bash
# WARNING: Deletes all data
pnpm db:reset
```

---

## Step 6 — Seed the Database

```bash
pnpm db:seed
```

The seed script creates:
- A demo organization and workspace
- A demo admin user
- Sample leads and CRM pipeline data
- Sample email templates
- Subscription plan records

**Default dev credentials:**

| Field | Value |
|-------|-------|
| Email | `admin@leadflow.dev` |
| Password | `Admin123!` |
| Organization | `Acme Agency` |
| Plan | `Professional (Trial)` |

---

## Step 7 — Start Development Servers

### Option A — Start Everything (Recommended)

```bash
pnpm dev
```

Starts all apps in parallel via Turborepo:
- Frontend: http://localhost:3000
- API: http://localhost:4000
- Worker: background process

### Option B — Start Individually

```bash
# Frontend only
pnpm --filter @leadflow/web dev

# API only
pnpm --filter @leadflow/api dev

# Worker only
pnpm --filter @leadflow/worker dev
```

---

## Step 8 — Verify Everything Works

### Health Checks

```bash
curl http://localhost:4000/health
# Expected: { "status": "ok", "version": "1.0.0" }

curl http://localhost:4000/health/db
# Expected: { "status": "ok", "latency": "12ms" }

curl http://localhost:4000/health/redis
# Expected: { "status": "ok" }
```

### Test the App

1. Open http://localhost:3000
2. Log in with `admin@leadflow.dev` / `Admin123!`
3. Navigate to **AI Assistant**
4. Type: `"Find 10 web design agencies in New York with poor SEO"`
5. Approve the AI plan and watch leads appear in real-time

---

## Useful Development Commands

### Build

```bash
pnpm build                             # Build all packages
pnpm --filter @leadflow/web build      # Build specific app
```

### Type Checking

```bash
pnpm typecheck
pnpm typecheck:watch
```

### Linting & Formatting

```bash
pnpm lint
pnpm lint:fix
pnpm format
```

### Testing

```bash
pnpm test                              # Run all tests
pnpm test:watch                        # Watch mode
pnpm test:e2e                          # End-to-end tests
pnpm --filter @leadflow/api test       # Specific package
```

### Database

```bash
pnpm db:studio                         # Open Prisma Studio (visual editor)
pnpm db:migrate:new <name>             # Create new migration
pnpm db:reset                          # Reset and reseed (dev only)
pnpm db:push                           # Push schema without migration
```

### AI & Agents

```bash
pnpm ai:eval                           # Run prompt evaluation suite
pnpm ai:test --agent lead_discovery    # Test a specific agent
```

---

## Troubleshooting

### Port Already in Use

```bash
npx kill-port 3000 4000 5432 6379
```

### Docker Services Won't Start

```bash
docker compose down
docker compose down -v               # Removes volumes (clears all data)
docker compose build --no-cache
docker compose up -d
```

### Database Migration Fails

```bash
pnpm --filter @leadflow/db db:status
pnpm db:reset                        # Dev only
```

### Prisma Client Out of Sync

```bash
pnpm --filter @leadflow/db db:generate
```

### AI Agent Errors

| Error | Solution |
|-------|---------|
| `OpenAI API key not found` | Set `OPENAI_API_KEY` in `.env` |
| `Rate limit exceeded` | Reduce concurrent workers |
| `Tool call timeout` | Increase `TOOL_TIMEOUT_MS` |
| `Vector search error` | Regenerate Prisma client + run migrations |

---

## External API Keys Reference

| Service | Purpose | Where to Get |
|---------|---------|-------------|
| **Clerk** | Authentication | [clerk.com](https://clerk.com) |
| **OpenAI** | LLM + Embeddings | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | Claude LLM | [console.anthropic.com](https://console.anthropic.com) |
| **Stripe** | Payments | [dashboard.stripe.com](https://dashboard.stripe.com) |
| **Resend** | Email delivery | [resend.com](https://resend.com) |
| **Apollo** | Lead database | [apollo.io](https://apollo.io) |
| **SerpAPI** | Google search | [serpapi.com](https://serpapi.com) |
| **Hunter.io** | Email finder | [hunter.io](https://hunter.io) |
| **Langfuse** | AI tracing | [langfuse.com](https://langfuse.com) |

> For local development, the free tiers of OpenAI, Stripe (test mode), and Clerk are sufficient to run the full application.

---

<- [Previous: AI Agent Architecture](./04-ai-agent-architecture.md) · [Back to Index](./README.md) · [Next: Folder Structure ->](./06-folder-structure.md)
