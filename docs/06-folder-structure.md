# 06 — Folder Structure

> **LeadFlow AI** · Complete Directory Layout & File Organization
> Version 1.0 · Last Updated: 2026-06-27

---

## Table of Contents

1. [Monorepo Overview](#1-monorepo-overview)
2. [Root Level Files](#2-root-level-files)
3. [apps/web — Next.js Frontend](#3-appsweb--nextjs-frontend)
4. [apps/api — Fastify Backend](#4-appsapi--fastify-backend)
5. [apps/worker — Background Worker](#5-appsworker--background-worker)
6. [packages/db — Database Package](#6-packagesdb--database-package)
7. [packages/ai — AI Agents Package](#7-packagesai--ai-agents-package)
8. [packages/ui — Shared Component Library](#8-packagesui--shared-component-library)
9. [packages/config — Shared Configuration](#9-packagesconfig--shared-configuration)
10. [infra/ — Infrastructure](#10-infra--infrastructure)
11. [docs/ — Documentation](#11-docs--documentation)
12. [Naming Conventions](#12-naming-conventions)
13. [Import Alias Reference](#13-import-alias-reference)

---

## 1. Monorepo Overview

```
leadflow-ai/                          # Monorepo root
├── apps/
│   ├── web/                          # Next.js App (dashboard + marketing)
│   ├── api/                          # Fastify API Server
│   └── worker/                       # BullMQ Background Worker
├── packages/
│   ├── db/                           # Prisma schema + DB client
│   ├── ai/                           # LangGraph agents + tools
│   ├── ui/                           # Shared UI components
│   └── config/                       # Shared tooling config
├── infra/
│   ├── docker/                       # Per-service Dockerfiles
│   └── k8s/                          # Kubernetes manifests
├── docs/                             # Project documentation (you are here)
├── .github/                          # GitHub Actions CI/CD workflows
├── docker-compose.yml                # Local dev services
├── docker-compose.override.yml       # Dev environment overrides
├── turbo.json                        # Turborepo pipeline config
├── pnpm-workspace.yaml               # pnpm workspace definition
├── package.json                      # Root scripts
├── .env.example                      # Environment variable template
└── README.md                         # Project root readme
```

---

## 2. Root Level Files

| File | Purpose |
|------|---------|
| `turbo.json` | Turborepo build pipeline — defines task order and caching |
| `pnpm-workspace.yaml` | Declares all workspace packages for pnpm |
| `docker-compose.yml` | Starts PostgreSQL, Redis, MinIO, Meilisearch, Langfuse |
| `.env.example` | Template for all environment variables |
| `.github/workflows/` | CI pipelines: test, lint, build, deploy |

---

## 3. apps/web — Next.js Frontend

```
apps/web/
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (marketing)/              # Route group: public pages
│   │   │   ├── page.tsx              # Landing page (/)
│   │   │   ├── pricing/page.tsx      # Pricing page
│   │   │   ├── blog/                 # Blog section
│   │   │   └── layout.tsx            # Marketing layout
│   │   │
│   │   ├── (auth)/                   # Route group: auth pages
│   │   │   ├── sign-in/page.tsx
│   │   │   ├── sign-up/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Route group: main app (protected)
│   │   │   ├── layout.tsx            # Dashboard shell (sidebar + header)
│   │   │   ├── page.tsx              # Dashboard home (/)
│   │   │   ├── leads/                # Lead management
│   │   │   │   ├── page.tsx          # Lead list view
│   │   │   │   ├── [id]/page.tsx     # Lead detail view
│   │   │   │   └── new/page.tsx      # Create lead
│   │   │   ├── campaigns/            # Outreach campaigns
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── crm/                  # CRM pipeline
│   │   │   │   ├── page.tsx          # Kanban board
│   │   │   │   ├── deals/[id]/page.tsx
│   │   │   │   └── contacts/page.tsx
│   │   │   ├── workflows/            # Workflow builder
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── analytics/            # Analytics dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── ai-assistant/         # AI chat interface
│   │   │   │   └── page.tsx
│   │   │   ├── proposals/            # Proposal generator
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── settings/             # Workspace settings
│   │   │   │   ├── page.tsx
│   │   │   │   ├── team/page.tsx
│   │   │   │   ├── billing/page.tsx
│   │   │   │   ├── integrations/page.tsx
│   │   │   │   └── api-keys/page.tsx
│   │   │   └── onboarding/           # First-run onboarding flow
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/                  # Route group: super-admin panel
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Admin dashboard
│   │   │   ├── users/page.tsx
│   │   │   ├── organizations/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   └── logs/page.tsx
│   │   │
│   │   ├── (portal)/                 # Route group: client portal
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── projects/[id]/page.tsx
│   │   │   └── invoices/page.tsx
│   │   │
│   │   ├── api/                      # Next.js API routes
│   │   │   ├── webhooks/stripe/route.ts
│   │   │   └── health/route.ts
│   │   │
│   │   ├── globals.css               # Global styles + Tailwind directives
│   │   └── layout.tsx                # Root layout (fonts, providers)
│   │
│   ├── components/                   # Reusable React components
│   │   ├── layout/                   # Structural components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Footer.tsx
│   │   ├── leads/                    # Lead-specific components
│   │   │   ├── LeadCard.tsx
│   │   │   ├── LeadTable.tsx
│   │   │   ├── LeadFilters.tsx
│   │   │   ├── LeadEnrichmentPanel.tsx
│   │   │   └── LeadScoreBadge.tsx
│   │   ├── campaigns/                # Campaign components
│   │   │   ├── CampaignBuilder.tsx
│   │   │   ├── SequenceEditor.tsx
│   │   │   └── EmailPreview.tsx
│   │   ├── crm/                      # CRM components
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── DealCard.tsx
│   │   │   └── PipelineColumn.tsx
│   │   ├── ai/                       # AI-related components
│   │   │   ├── AIChat.tsx
│   │   │   ├── PlanReview.tsx
│   │   │   ├── AgentStatusCard.tsx
│   │   │   └── ThinkingIndicator.tsx
│   │   ├── analytics/                # Chart components
│   │   │   ├── FunnelChart.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── ConversionWidget.tsx
│   │   └── shared/                   # General-purpose components
│   │       ├── DataTable.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── ExportButton.tsx
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useLeads.ts
│   │   ├── useCampaign.ts
│   │   ├── useAgentStatus.ts
│   │   ├── useOrganization.ts
│   │   └── useRealtime.ts
│   │
│   ├── lib/                          # Frontend utilities
│   │   ├── api-client.ts             # Typed API client (fetch wrapper)
│   │   ├── auth.ts                   # Clerk helper functions
│   │   ├── format.ts                 # Formatters (currency, date, etc.)
│   │   ├── validators.ts             # Shared Zod schemas
│   │   └── constants.ts              # App-wide constants
│   │
│   ├── providers/                    # React context providers
│   │   ├── QueryProvider.tsx         # TanStack Query
│   │   ├── ThemeProvider.tsx
│   │   └── RealtimeProvider.tsx      # Socket.IO context
│   │
│   └── types/                        # TypeScript type definitions
│       ├── api.ts                    # API response types
│       ├── lead.ts
│       ├── campaign.ts
│       └── crm.ts
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
└── package.json
```

---

## 4. apps/api — Fastify Backend

```
apps/api/
├── src/
│   ├── server.ts                     # Fastify app entry point
│   ├── index.ts                      # Server startup
│   │
│   ├── modules/                      # Feature modules (domain-driven)
│   │   │
│   │   ├── auth/                     # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schema.ts        # Zod schemas for this module
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── organizations/            # Multi-tenancy module
│   │   │   ├── organizations.controller.ts
│   │   │   ├── organizations.service.ts
│   │   │   ├── organizations.routes.ts
│   │   │   └── organizations.schema.ts
│   │   │
│   │   ├── leads/                    # Lead management module
│   │   │   ├── leads.controller.ts
│   │   │   ├── leads.service.ts
│   │   │   ├── leads.routes.ts
│   │   │   ├── leads.schema.ts
│   │   │   ├── leads.enrichment.ts   # Enrichment orchestration
│   │   │   └── leads.scoring.ts      # Scoring logic
│   │   │
│   │   ├── campaigns/                # Outreach campaign module
│   │   │   ├── campaigns.controller.ts
│   │   │   ├── campaigns.service.ts
│   │   │   ├── campaigns.routes.ts
│   │   │   ├── campaigns.tracking.ts # Open/click/reply tracking
│   │   │   └── campaigns.schema.ts
│   │   │
│   │   ├── crm/                      # CRM module
│   │   │   ├── crm.controller.ts
│   │   │   ├── crm.service.ts
│   │   │   ├── crm.routes.ts
│   │   │   ├── pipelines/
│   │   │   │   └── pipelines.service.ts
│   │   │   └── deals/
│   │   │       └── deals.service.ts
│   │   │
│   │   ├── ai/                       # AI orchestration module
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── ai.routes.ts
│   │   │   └── ai.schema.ts
│   │   │
│   │   ├── analytics/                # Analytics module
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── analytics.routes.ts
│   │   │
│   │   ├── billing/                  # Stripe billing module
│   │   │   ├── billing.controller.ts
│   │   │   ├── billing.service.ts
│   │   │   ├── billing.routes.ts
│   │   │   └── billing.webhooks.ts   # Stripe webhook handlers
│   │   │
│   │   ├── notifications/            # Notification dispatch module
│   │   │   ├── notifications.service.ts
│   │   │   └── notifications.routes.ts
│   │   │
│   │   └── storage/                  # File storage module
│   │       ├── storage.service.ts
│   │       └── storage.routes.ts
│   │
│   ├── middleware/                   # Fastify middleware/hooks
│   │   ├── authenticate.ts           # JWT verification
│   │   ├── authorize.ts              # RBAC enforcement
│   │   ├── rateLimiter.ts
│   │   ├── tenantScope.ts            # Injects organizationId
│   │   └── requestLogger.ts
│   │
│   ├── plugins/                      # Fastify plugins
│   │   ├── cors.ts
│   │   ├── swagger.ts                # OpenAPI docs generation
│   │   ├── redis.ts                  # Redis connection plugin
│   │   ├── prisma.ts                 # Prisma client plugin
│   │   └── websocket.ts              # Socket.IO integration
│   │
│   ├── shared/                       # Shared utilities
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   └── errorHandler.ts
│   │   ├── utils/
│   │   │   ├── pagination.ts
│   │   │   ├── crypto.ts
│   │   │   └── slugify.ts
│   │   └── constants.ts
│   │
│   └── types/                        # Shared TypeScript types for API
│       ├── fastify.d.ts              # Fastify augmentation (user, org on request)
│       └── index.ts
│
├── tsconfig.json
├── .env.example
└── package.json
```

---

## 5. apps/worker — Background Worker

```
apps/worker/
├── src/
│   ├── index.ts                      # Worker entry point, starts all queues
│   │
│   ├── queues/                       # Queue definitions
│   │   ├── ai.queue.ts               # AI processing jobs
│   │   ├── email.queue.ts            # Email sending jobs
│   │   ├── enrich.queue.ts           # Lead enrichment jobs
│   │   ├── scan.queue.ts             # Website scanning jobs
│   │   ├── report.queue.ts           # Report generation jobs
│   │   └── sync.queue.ts             # External CRM sync jobs
│   │
│   ├── processors/                   # Job processor functions
│   │   ├── ai.processor.ts           # Runs AI agent pipelines
│   │   ├── email.processor.ts        # Sends outreach emails
│   │   ├── enrich.processor.ts       # Enriches lead data
│   │   ├── scan.processor.ts         # Runs Lighthouse + tech detection
│   │   ├── report.processor.ts       # Generates and stores PDFs
│   │   └── sync.processor.ts         # Syncs HubSpot/Salesforce data
│   │
│   ├── schedulers/                   # Cron-based recurring jobs
│   │   ├── sequence.scheduler.ts     # Triggers follow-up sequences
│   │   ├── analytics.scheduler.ts    # Pre-computes daily metrics
│   │   └── cleanup.scheduler.ts      # Removes expired sessions/tokens
│   │
│   └── shared/                       # Worker utilities
│       ├── logger.ts
│       └── retry.ts
│
└── package.json
```

---

## 6. packages/db — Database Package

```
packages/db/
├── prisma/
│   ├── schema.prisma                 # Master Prisma schema
│   ├── migrations/                   # Auto-generated migration files
│   │   ├── 20260101_init/
│   │   │   └── migration.sql
│   │   ├── 20260115_add_leads/
│   │   │   └── migration.sql
│   │   └── ...
│   └── seed.ts                       # Database seed script
│
├── src/
│   ├── client.ts                     # Prisma client singleton
│   ├── index.ts                      # Package exports
│   └── types.ts                      # Re-exported Prisma types
│
├── package.json
└── tsconfig.json
```

### Key Prisma Models

```
Organization
  Workspace
    User (with Role)
    Lead
      Contact
      LeadScore
      WebsiteAudit
      Activity
    Deal
      Task
      Meeting
      Note
      Attachment
    Campaign
      Sequence
      Email
      TrackingEvent
    Workflow
      WorkflowStep
      WorkflowRun
    ApiKey
    Subscription
    AuditLog
```

---

## 7. packages/ai — AI Agents Package

```
packages/ai/
├── src/
│   ├── index.ts                      # Package exports
│   │
│   ├── agents/                       # Individual agent implementations
│   │   ├── supervisor/
│   │   │   ├── supervisor.agent.ts
│   │   │   └── supervisor.prompts.ts
│   │   ├── planner/
│   │   │   ├── planner.agent.ts
│   │   │   └── planner.prompts.ts
│   │   ├── lead-discovery/
│   │   │   ├── lead-discovery.agent.ts
│   │   │   └── lead-discovery.prompts.ts
│   │   ├── company-research/
│   │   │   ├── company-research.agent.ts
│   │   │   └── company-research.prompts.ts
│   │   ├── contact-discovery/
│   │   │   ├── contact-discovery.agent.ts
│   │   │   └── contact-discovery.prompts.ts
│   │   ├── website-audit/
│   │   │   ├── website-audit.agent.ts
│   │   │   └── website-audit.prompts.ts
│   │   ├── outreach/
│   │   │   ├── outreach.agent.ts
│   │   │   └── outreach.prompts.ts
│   │   ├── crm/
│   │   │   ├── crm.agent.ts
│   │   │   └── crm.prompts.ts
│   │   ├── analytics/
│   │   │   ├── analytics.agent.ts
│   │   │   └── analytics.prompts.ts
│   │   └── knowledge/
│   │       ├── knowledge.agent.ts
│   │       └── knowledge.prompts.ts
│   │
│   ├── tools/                        # Deterministic tools used by agents
│   │   ├── search/
│   │   │   ├── searchApollo.tool.ts
│   │   │   ├── searchGoogle.tool.ts
│   │   │   └── searchLinkedIn.tool.ts
│   │   ├── web/
│   │   │   ├── fetchWebsite.tool.ts
│   │   │   ├── runLighthouse.tool.ts
│   │   │   └── detectTechnologies.tool.ts
│   │   ├── email/
│   │   │   ├── findEmail.tool.ts
│   │   │   ├── verifyEmail.tool.ts
│   │   │   └── sendEmail.tool.ts
│   │   ├── crm/
│   │   │   ├── createLead.tool.ts
│   │   │   ├── updateDeal.tool.ts
│   │   │   └── createTask.tool.ts
│   │   ├── vector/
│   │   │   ├── semanticSearch.tool.ts
│   │   │   └── upsertEmbedding.tool.ts
│   │   └── analytics/
│   │       └── getCampaignMetrics.tool.ts
│   │
│   ├── memory/                       # Memory management
│   │   ├── shortTerm.memory.ts       # Redis-backed session state
│   │   ├── longTerm.memory.ts        # PostgreSQL-backed persistent memory
│   │   └── semantic.memory.ts        # Vector database queries
│   │
│   ├── rag/                          # RAG pipeline components
│   │   ├── indexer.ts                # Document ingestion + chunking
│   │   ├── retriever.ts              # Semantic search + reranking
│   │   ├── embedder.ts               # Embedding generation
│   │   └── contextBuilder.ts         # Compose context for LLM
│   │
│   ├── graph/                        # LangGraph workflow definitions
│   │   ├── lead-discovery.graph.ts
│   │   ├── outreach.graph.ts
│   │   └── crm.graph.ts
│   │
│   ├── prompts/                      # Prompt registry
│   │   ├── registry.ts               # Central prompt store
│   │   └── versions/                 # Versioned prompt files
│   │       ├── supervisor.v1.ts
│   │       ├── planner.v1.ts
│   │       └── lead-discovery.v1.ts
│   │
│   ├── providers/                    # LLM provider abstraction
│   │   ├── openai.provider.ts
│   │   ├── anthropic.provider.ts
│   │   ├── gemini.provider.ts
│   │   └── provider.factory.ts       # Selects provider based on config
│   │
│   └── utils/
│       ├── tokenCounter.ts
│       ├── costCalculator.ts
│       └── structuredOutput.ts
│
├── package.json
└── tsconfig.json
```

---

## 8. packages/ui — Shared Component Library

```
packages/ui/
├── src/
│   ├── index.ts                      # Barrel exports
│   │
│   ├── components/                   # shadcn/ui + custom components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Avatar.tsx
│   │   ├── Tooltip.tsx
│   │   └── ...
│   │
│   ├── icons/                        # Icon wrapper components
│   │   └── index.ts
│   │
│   └── styles/
│       └── globals.css               # Base styles + CSS variables
│
├── package.json
└── tsconfig.json
```

---

## 9. packages/config — Shared Configuration

```
packages/config/
├── eslint/
│   ├── base.js                       # Base ESLint rules
│   ├── next.js                       # Next.js-specific rules
│   └── node.js                       # Node.js-specific rules
│
├── typescript/
│   ├── base.json                     # Base tsconfig
│   ├── next.json                     # Next.js tsconfig
│   └── node.json                     # Node.js tsconfig
│
├── prettier/
│   └── index.js                      # Prettier config
│
└── package.json
```

---

## 10. infra/ — Infrastructure

```
infra/
├── docker/
│   ├── web.Dockerfile                # Production Dockerfile for Next.js
│   ├── api.Dockerfile                # Production Dockerfile for Fastify
│   └── worker.Dockerfile             # Production Dockerfile for worker
│
└── k8s/                              # Kubernetes manifests
    ├── namespace.yaml
    ├── deployments/
    │   ├── frontend.yaml
    │   ├── api.yaml
    │   └── worker.yaml
    ├── services/
    │   ├── frontend.svc.yaml
    │   └── api.svc.yaml
    ├── ingress/
    │   └── traefik.ingress.yaml
    ├── configmaps/
    │   └── app.configmap.yaml
    ├── secrets/
    │   └── app.secrets.yaml          # Sealed secrets (encrypted)
    └── hpa/
        ├── api.hpa.yaml              # Horizontal Pod Autoscaler
        └── worker.hpa.yaml
```

---

## 11. docs/ — Documentation

```
docs/                                 # Project documentation (you are here)
├── README.md                         # Documentation index
├── 01-product-overview.md            # Product vision, modules, roadmap
├── 02-application-flow.md            # Complete user journey
├── 03-system-architecture.md         # System design + tech stack
├── 04-ai-agent-architecture.md       # AI agents, RAG, LangGraph
├── 05-project-setup.md               # Local setup guide
└── 06-folder-structure.md            # This file
```

---

## 12. Naming Conventions

### Files

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `LeadCard.tsx` |
| Pages (Next.js) | `page.tsx` | `app/leads/page.tsx` |
| Hooks | camelCase + `use` prefix | `useLeads.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| API controllers | camelCase + `.controller` | `leads.controller.ts` |
| Services | camelCase + `.service` | `leads.service.ts` |
| Schemas | camelCase + `.schema` | `leads.schema.ts` |
| AI agents | kebab-case + `.agent` | `lead-discovery.agent.ts` |
| AI tools | camelCase + `.tool` | `searchApollo.tool.ts` |
| Database migrations | timestamp + description | `20260115_add_leads` |

### Variables & Functions

| Type | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `leadScore`, `isLoading` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_LEADS_PER_SEARCH` |
| Functions | camelCase, verb prefix | `getLeads()`, `createDeal()` |
| Classes | PascalCase | `LeadService`, `PlannerAgent` |
| Interfaces | PascalCase | `LeadProfile`, `AgentMessage` |
| Type aliases | PascalCase | `LeadStatus`, `PlanStep` |
| Enum values | SCREAMING_SNAKE_CASE | `LeadStatus.IN_PROGRESS` |

### Database

| Type | Convention | Example |
|------|-----------|---------|
| Table names | snake_case (plural) | `leads`, `campaign_emails` |
| Column names | snake_case | `organization_id`, `created_at` |
| Prisma models | PascalCase (singular) | `Lead`, `CampaignEmail` |
| Indexes | `idx_{table}_{column}` | `idx_leads_org_id` |
| FK constraints | `fk_{table}_{ref}` | `fk_leads_org` |

---

## 13. Import Alias Reference

Each package configures TypeScript path aliases to avoid deep relative imports:

### `apps/web` (Next.js)

```typescript
import { LeadCard } from "@/components/leads/LeadCard";
import { useLeads } from "@/hooks/useLeads";
import { apiClient } from "@/lib/api-client";
```

### `apps/api` (Fastify)

```typescript
import { LeadsService } from "@modules/leads/leads.service";
import { authenticate } from "@middleware/authenticate";
import { AppError } from "@shared/errors/AppError";
```

### Cross-Package Imports

```typescript
// From any app, import shared packages
import { db } from "@leadflow/db";
import { SupervisorAgent } from "@leadflow/ai";
import { Button } from "@leadflow/ui";
```

**Alias Mapping (tsconfig.json)**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@modules/*": ["./src/modules/*"],
      "@middleware/*": ["./src/middleware/*"],
      "@shared/*": ["./src/shared/*"],
      "@leadflow/db": ["../../packages/db/src"],
      "@leadflow/ai": ["../../packages/ai/src"],
      "@leadflow/ui": ["../../packages/ui/src"]
    }
  }
}
```

---

<- [Previous: Project Setup](./05-project-setup.md) · [Back to Index](./README.md)
