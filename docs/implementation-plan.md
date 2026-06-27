# LeadFlow AI — Implementation Plan

> Full build roadmap divided into 7 parts, each a shippable milestone.
> Version 1.0 · Created: 2026-06-27

---

## How to Read This Plan

Each **Part** is a self-contained, shippable milestone. Complete one before starting the next. Parts are ordered so that every milestone builds on the previous one — no part has an unresolvable dependency on a future part.

**Status legend:**
- `[ ]` Not started
- `[/]` In progress
- `[x]` Complete

---

## Parts Overview

| Part | Name | Focus | Estimated Scope |
|------|------|-------|----------------|
| **Part 1** | Foundation & Infrastructure | Monorepo, Docker, DB schema, shared config | ~3–5 days |
| **Part 2** | Auth, Organizations & Multi-Tenancy | Users, orgs, workspaces, RBAC, billing | ~4–6 days |
| **Part 3** | Lead Management & CRM | Lead CRUD, pipeline, deals, contacts | ~5–7 days |
| **Part 4** | AI Agent System | Model gateway, agents, tools, RAG, MCP | ~7–10 days |
| **Part 5** | Outreach & Campaign Engine | Email campaigns, sequences, tracking | ~4–6 days |
| **Part 6** | Analytics, Workflows & Notifications | Dashboard, automation builder, alerts | ~4–6 days |
| **Part 7** | Frontend, Polish & Production | Full UI, portal, admin, deployment | ~5–8 days |

---

## Part 1 — Foundation & Infrastructure

**Goal:** A running monorepo with all infrastructure services, a complete database schema, and shared tooling that every other part will build on.

### 1.1 Monorepo Setup

- [ ] Initialize pnpm workspace with `pnpm-workspace.yaml`
- [ ] Create `turbo.json` with `build`, `dev`, `test`, `lint` pipelines
- [ ] Create root `package.json` with shared scripts
- [ ] Create `.env.example` with all required environment variables
- [ ] Set up `.gitignore`, `.editorconfig`, `.nvmrc`
- [ ] Create `packages/config/` with shared tsconfig, eslint, prettier configs
  - [ ] `packages/config/typescript/base.json`
  - [ ] `packages/config/typescript/next.json`
  - [ ] `packages/config/typescript/node.json`
  - [ ] `packages/config/eslint/base.js`
  - [ ] `packages/config/prettier/index.js`

### 1.2 Docker Compose Infrastructure

- [ ] Write `docker-compose.yml` with:
  - [ ] PostgreSQL 16 with pgvector extension enabled
  - [ ] Redis 7 (with persistence)
  - [ ] MinIO (S3-compatible object storage)
  - [ ] Meilisearch (full-text search)
  - [ ] Langfuse (AI tracing — optional but recommended early)
- [ ] Write `docker-compose.override.yml` (dev-specific hot-reload mounts)
- [ ] Test: `docker compose up -d` → all services healthy

### 1.3 Database Package (`packages/db`)

- [ ] Init `packages/db` with `package.json`, `tsconfig.json`
- [ ] Install Prisma, configure `prisma/schema.prisma`
- [ ] Write complete Prisma schema covering all domains:

  **Auth & Tenancy Models**
  - [ ] `Organization` (id, name, slug, plan, createdAt)
  - [ ] `Workspace` (id, orgId, name, slug)
  - [ ] `User` (id, orgId, workspaceId, email, role, name)
  - [ ] `TeamMember` (userId, workspaceId, role, invitedAt, joinedAt)
  - [ ] `ApiKey` (id, orgId, keyHash, scopes, lastUsedAt)
  - [ ] `AuditLog` (id, orgId, userId, action, resource, payload, ip, createdAt)
  - [ ] `Session` (id, userId, token, expiresAt)

  **Subscription & Billing Models**
  - [ ] `Subscription` (id, orgId, plan, status, stripeCustomerId, stripeSubId, currentPeriodEnd)
  - [ ] `UsageRecord` (id, orgId, metric, quantity, recordedAt)
  - [ ] `Invoice` (id, orgId, stripeInvoiceId, amount, status, paidAt)

  **Lead & Contact Models**
  - [ ] `Lead` (id, orgId, workspaceId, company, website, email, phone, industry, employees, revenue, status, score, tags, customFields, source, createdAt)
  - [ ] `Contact` (id, leadId, orgId, name, title, email, phone, linkedinUrl, isDecisionMaker, confidence)
  - [ ] `LeadScore` (id, leadId, score, factors, explanation, scoredAt)
  - [ ] `LeadActivity` (id, leadId, orgId, type, description, userId, createdAt)
  - [ ] `WebsiteAudit` (id, leadId, url, overallScore, dimensions, issues, opportunities, reportUrl, auditedAt)

  **CRM Models**
  - [ ] `Pipeline` (id, orgId, workspaceId, name, stages)
  - [ ] `Deal` (id, orgId, pipelineId, leadId, title, value, stage, ownerId, closedAt)
  - [ ] `Task` (id, orgId, dealId, title, dueDate, assignedTo, status)
  - [ ] `Meeting` (id, orgId, dealId, title, scheduledAt, duration, notes, calendarEventId)
  - [ ] `Note` (id, orgId, dealId, leadId, content, userId, createdAt)
  - [ ] `Attachment` (id, orgId, dealId, filename, fileUrl, uploadedBy)

  **Campaign & Outreach Models**
  - [ ] `Campaign` (id, orgId, workspaceId, name, status, channel, fromEmail, subjectTemplate, bodyTemplate)
  - [ ] `Sequence` (id, campaignId, name, steps)
  - [ ] `SequenceStep` (id, sequenceId, dayDelay, channel, subjectTemplate, bodyTemplate)
  - [ ] `CampaignLead` (id, campaignId, leadId, status, enrolledAt)
  - [ ] `EmailEvent` (id, orgId, campaignId, leadId, event, occurredAt, metadata)

  **Workflow Automation Models**
  - [ ] `Workflow` (id, orgId, name, status, triggerType, nodes, edges)
  - [ ] `WorkflowRun` (id, workflowId, triggeredBy, status, startedAt, completedAt, logs)

  **AI / Knowledge Models**
  - [ ] `AgentRun` (id, orgId, agentId, workflowId, status, input, output, tokenUsage, costUsd, startedAt, completedAt)
  - [ ] `PromptRecord` (id, agentId, version, content, variables, outputSchema, isActive)
  - [ ] `KnowledgeDocument` (id, orgId, sourceType, sourceId, title, contentHash, chunkCount, lastSyncedAt)
  - [ ] `KnowledgeChunk` (id, documentId, orgId, content, embedding, metadata, tokenCount)
  - [ ] `EvalCase` (id, agentId, input, expectedOutput, criteria, tags)
  - [ ] `EvalResult` (id, evalCaseId, runId, score, passed, output, model, costUsd)

  **Notifications**
  - [ ] `Notification` (id, orgId, userId, type, title, message, readAt, link)

- [ ] Write `packages/db/src/client.ts` (Prisma singleton)
- [ ] Write `packages/db/src/index.ts` (barrel exports)
- [ ] Run `pnpm db:generate` → Prisma client generated
- [ ] Run first migration: `pnpm db:migrate`
- [ ] Write seed script `packages/db/prisma/seed.ts`:
  - [ ] Create demo Organization + Workspace
  - [ ] Create admin user
  - [ ] Create Free, Starter, Pro, Business, Enterprise plan records
  - [ ] Seed 10 sample leads with scores and activities
  - [ ] Seed 1 CRM pipeline with 5 stages and 3 sample deals

### 1.4 Shared UI Package (`packages/ui`)

- [ ] Init `packages/ui` with Next.js + Tailwind + shadcn/ui
- [ ] Install and configure shadcn/ui components:
  - [ ] Button, Input, Label, Textarea
  - [ ] Card, Badge, Avatar, Separator
  - [ ] Dialog, Sheet, Popover, Tooltip
  - [ ] Table, DataTable (with TanStack Table)
  - [ ] Select, Checkbox, Switch, RadioGroup
  - [ ] Toast (Sonner), Progress, Skeleton
  - [ ] DropdownMenu, ContextMenu, Command
  - [ ] Tabs, Accordion
- [ ] Create `packages/ui/src/styles/globals.css` with CSS variables (dark + light mode)
- [ ] Export all components from `packages/ui/src/index.ts`

### 1.5 Fastify API App (`apps/api`) — Shell

- [ ] Init `apps/api` with TypeScript + Fastify
- [ ] Configure `tsconfig.json` with path aliases (`@modules`, `@middleware`, `@shared`)
- [ ] Create `apps/api/src/server.ts` (Fastify app with plugins)
- [ ] Create `apps/api/src/index.ts` (startup entry point)
- [ ] Register core Fastify plugins:
  - [ ] `@fastify/cors` — CORS configuration
  - [ ] `@fastify/helmet` — Security headers
  - [ ] `@fastify/rate-limit` — Per-IP rate limiting
  - [ ] `@fastify/multipart` — File upload support
  - [ ] `@fastify/swagger` + `@fastify/swagger-ui` — OpenAPI docs
  - [ ] Custom: `plugins/prisma.ts` — Prisma client on `fastify.db`
  - [ ] Custom: `plugins/redis.ts` — Redis client on `fastify.redis`
- [ ] Create `GET /health` and `GET /health/db` and `GET /health/redis` endpoints
- [ ] Create `apps/api/src/shared/errors/AppError.ts` with typed error classes
- [ ] Create `apps/api/src/shared/errors/errorHandler.ts` Fastify error hook
- [ ] Create `apps/api/src/types/fastify.d.ts` (augment Request with `user`, `org`)

### 1.6 Next.js Frontend App (`apps/web`) — Shell

- [ ] Init `apps/web` with Next.js 15 App Router + TypeScript
- [ ] Configure Tailwind CSS with design system tokens
- [ ] Configure `tsconfig.json` with `@/*` alias
- [ ] Create `apps/web/src/app/layout.tsx` (root layout with fonts, providers)
- [ ] Create `apps/web/src/app/globals.css`
- [ ] Create `apps/web/src/providers/QueryProvider.tsx` (TanStack Query)
- [ ] Create `apps/web/src/lib/api-client.ts` (typed fetch wrapper)
- [ ] Create `apps/web/src/lib/constants.ts`

### 1.7 Worker App (`apps/worker`) — Shell

- [ ] Init `apps/worker` with TypeScript + BullMQ
- [ ] Create `apps/worker/src/index.ts` (starts all queue workers)
- [ ] Create `apps/worker/src/shared/logger.ts` (structured JSON logger)
- [ ] Create `apps/worker/src/shared/retry.ts` (exponential backoff utility)

### 1.8 CI/CD Setup

- [ ] Create `.github/workflows/ci.yml`:
  - [ ] Lint + type-check on every PR
  - [ ] Run unit tests on every PR
  - [ ] Build check on every merge to main
- [ ] Add `CODEOWNERS` file

**Part 1 Verification:**
- [ ] `docker compose up -d` → all 5 services healthy
- [ ] `pnpm db:migrate` → migrations applied cleanly
- [ ] `pnpm db:seed` → demo data visible in Prisma Studio
- [ ] `GET http://localhost:4000/health` → `{ "status": "ok" }`
- [ ] `pnpm typecheck` → zero errors across all packages

---

## Part 2 — Auth, Organizations & Multi-Tenancy

**Goal:** A working authentication system, organization setup flow, workspace management, RBAC enforcement, and Stripe billing integration.

### 2.1 Authentication (API)

- [ ] Install and configure Clerk SDK (or Auth.js as alternative)
- [ ] Create `apps/api/src/middleware/authenticate.ts`:
  - [ ] Verify JWT on every protected request
  - [ ] Attach `userId`, `organizationId`, `role` to `request.user`
- [ ] Create `apps/api/src/middleware/authorize.ts`:
  - [ ] Check RBAC permissions: Owner > Admin > Manager > Member > Viewer
  - [ ] Throw `403 Forbidden` on permission denied
- [ ] Create `apps/api/src/middleware/tenantScope.ts`:
  - [ ] Inject `organizationId` into all query contexts
  - [ ] Reject requests with missing or mismatched org ID
- [ ] Create `apps/api/src/modules/auth/`:
  - [ ] `auth.routes.ts` — `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`
  - [ ] `auth.service.ts` — token issuance, session management
  - [ ] `auth.schema.ts` — Zod validation for all auth inputs

### 2.2 Organization & Workspace Management (API)

- [ ] Create `apps/api/src/modules/organizations/`:
  - [ ] `organizations.routes.ts` — CRUD for orgs + workspaces
  - [ ] `organizations.service.ts` — create org, add workspace, manage members
  - [ ] API: `POST /organizations` — create organization
  - [ ] API: `GET /organizations/:id` — get org details
  - [ ] API: `POST /organizations/:id/workspaces` — create workspace
  - [ ] API: `POST /organizations/:id/members/invite` — invite team member
  - [ ] API: `PUT /organizations/:id/members/:userId/role` — update role
  - [ ] API: `DELETE /organizations/:id/members/:userId` — remove member

### 2.3 API Key Management

- [ ] API: `POST /api-keys` — generate new API key (SHA-256 hashed on store)
- [ ] API: `GET /api-keys` — list org's API keys
- [ ] API: `DELETE /api-keys/:id` — revoke key
- [ ] Middleware: Support `Authorization: Bearer <api-key>` authentication path

### 2.4 Audit Logging

- [ ] Create `apps/api/src/shared/utils/auditLog.ts`:
  - [ ] `logEvent(action, resource, payload, request)` utility
- [ ] Attach audit logging hook to all mutating routes (POST, PUT, PATCH, DELETE)
- [ ] API: `GET /audit-logs` — paginated audit log viewer (admin only)

### 2.5 Billing Integration (Stripe)

- [ ] Create `apps/api/src/modules/billing/`:
  - [ ] `billing.service.ts` — create customer, manage subscriptions
  - [ ] `billing.webhooks.ts` — handle `invoice.paid`, `subscription.updated`, `subscription.deleted`
  - [ ] API: `POST /billing/checkout` — create Stripe checkout session
  - [ ] API: `GET /billing/subscription` — current subscription details
  - [ ] API: `POST /billing/portal` — Stripe customer portal redirect
  - [ ] API: `POST /webhooks/stripe` — Stripe webhook receiver (verify signature)
- [ ] Enforce feature limits based on subscription plan in middleware

### 2.6 Authentication Frontend (Next.js)

- [ ] Create `apps/web/src/app/(auth)/` route group:
  - [ ] `sign-in/page.tsx` — email + password login form
  - [ ] `sign-up/page.tsx` — registration form
  - [ ] `verify-email/page.tsx` — email verification page
  - [ ] `forgot-password/page.tsx`
  - [ ] `layout.tsx` — centered auth layout with branding
- [ ] Create `apps/web/src/providers/AuthProvider.tsx`
- [ ] Create `apps/web/src/lib/auth.ts` (Clerk or Auth.js helpers)
- [ ] Middleware: `apps/web/src/middleware.ts` — protect dashboard routes

### 2.7 Onboarding Flow Frontend

- [ ] Create `apps/web/src/app/(dashboard)/onboarding/page.tsx`:
  - [ ] **Step 1:** Create Organization (name, industry, type)
  - [ ] **Step 2:** Create Workspace name
  - [ ] **Step 3:** Choose plan (with Stripe checkout)
  - [ ] **Step 4:** Invite team (optional, skippable)
  - [ ] **Step 5:** Connect email (Gmail/Outlook OAuth)
  - [ ] **Step 6:** AI ICP Builder (conversational — covered in Part 4)
- [ ] Persist onboarding progress in local storage + API

### 2.8 Settings Pages Frontend

- [ ] `settings/page.tsx` — General workspace settings
- [ ] `settings/team/page.tsx` — Invite/manage members, roles
- [ ] `settings/billing/page.tsx` — Plan, usage, invoices
- [ ] `settings/api-keys/page.tsx` — Generate/revoke API keys
- [ ] `settings/integrations/page.tsx` — Connect external services (placeholder)

**Part 2 Verification:**
- [ ] User can register → verify email → create org → reach dashboard
- [ ] RBAC blocks Member from deleting leads (403 returned)
- [ ] Stripe webhook updates subscription status correctly
- [ ] Audit log records all mutations with correct userId + orgId

---

## Part 3 — Lead Management & CRM

**Goal:** Full lead lifecycle management — import, enrich, score, manage in a CRM pipeline — without AI agents (those come in Part 4).

### 3.1 Lead Service (API)

- [ ] Create `apps/api/src/modules/leads/`:
  - [ ] `leads.routes.ts` — full CRUD routes
  - [ ] `leads.service.ts` — business logic
  - [ ] `leads.schema.ts` — Zod schemas for all lead inputs/outputs
  - [ ] `leads.scoring.ts` — rule-based scoring (AI scoring in Part 4)
  - [ ] `leads.enrichment.ts` — enrichment job dispatcher

  **Endpoints:**
  - [ ] `GET /leads` — list with filters (status, score, tag, source, search)
  - [ ] `GET /leads/:id` — single lead with all related data
  - [ ] `POST /leads` — create lead (manual entry)
  - [ ] `PUT /leads/:id` — update lead fields
  - [ ] `DELETE /leads/:id` — soft-delete (archive)
  - [ ] `POST /leads/import` — bulk CSV import (multipart)
  - [ ] `GET /leads/export` — export as CSV
  - [ ] `POST /leads/:id/enrich` — trigger enrichment job
  - [ ] `POST /leads/:id/score` — trigger scoring job
  - [ ] `POST /leads/bulk` — bulk actions (tag, assign, archive, delete)
  - [ ] `GET /leads/:id/activities` — activity timeline

### 3.2 Contact Service (API)

- [ ] `GET /leads/:leadId/contacts` — list contacts for a lead
- [ ] `POST /leads/:leadId/contacts` — add contact manually
- [ ] `PUT /leads/:leadId/contacts/:contactId` — update contact
- [ ] `DELETE /leads/:leadId/contacts/:contactId` — remove contact

### 3.3 Lead Enrichment Worker

- [ ] Create `apps/worker/src/queues/enrich.queue.ts`
- [ ] Create `apps/worker/src/processors/enrich.processor.ts`:
  - [ ] Dispatch enrichment job when lead is created or manually triggered
  - [ ] Call Apollo API for company data (employees, revenue, industry)
  - [ ] Call Hunter.io for email discovery
  - [ ] Store enriched data back to lead record
  - [ ] Emit `lead.enriched` event

### 3.4 Website Audit Worker

- [ ] Create `apps/worker/src/queues/scan.queue.ts`
- [ ] Create `apps/worker/src/processors/scan.processor.ts`:
  - [ ] Playwright: Fetch homepage, screenshot
  - [ ] Run Lighthouse via Node.js API for performance, SEO, accessibility
  - [ ] Wappalyzer: Detect technology stack
  - [ ] Custom: Check SSL, broken links, security headers
  - [ ] Store audit report to `WebsiteAudit` table
  - [ ] Upload screenshot to MinIO
  - [ ] Emit `lead.audited` event

### 3.5 CRM Service (API)

- [ ] Create `apps/api/src/modules/crm/`:

  **Pipeline management:**
  - [ ] `GET /crm/pipelines` — list org pipelines
  - [ ] `POST /crm/pipelines` — create pipeline with custom stages
  - [ ] `PUT /crm/pipelines/:id` — update stages
  - [ ] `DELETE /crm/pipelines/:id`

  **Deal management:**
  - [ ] `GET /crm/deals` — list deals with filters
  - [ ] `POST /crm/deals` — create deal (link to lead)
  - [ ] `GET /crm/deals/:id` — deal detail with full timeline
  - [ ] `PUT /crm/deals/:id` — update deal (stage, value, owner)
  - [ ] `PUT /crm/deals/:id/stage` — move stage (emits `deal.stage_changed` event)
  - [ ] `DELETE /crm/deals/:id`

  **Tasks, meetings, notes:**
  - [ ] `POST /crm/deals/:id/tasks` — create task with due date
  - [ ] `GET /crm/deals/:id/tasks` — list tasks
  - [ ] `PUT /crm/deals/:id/tasks/:taskId` — update/complete task
  - [ ] `POST /crm/deals/:id/meetings` — log meeting
  - [ ] `POST /crm/deals/:id/notes` — add note
  - [ ] `POST /crm/deals/:id/attachments` — upload attachment (to MinIO)

### 3.6 Lead Management Frontend

- [ ] `apps/web/src/app/(dashboard)/leads/page.tsx`:
  - [ ] `LeadTable.tsx` — sortable, filterable data table (TanStack Table)
  - [ ] `LeadFilters.tsx` — sidebar filters (status, score range, industry, source, tags)
  - [ ] `LeadScoreBadge.tsx` — color-coded score badge
  - [ ] `BulkActionBar.tsx` — floating bar for bulk operations
  - [ ] Import button → CSV upload modal
  - [ ] Export button → download CSV

- [ ] `apps/web/src/app/(dashboard)/leads/[id]/page.tsx`:
  - [ ] Lead detail header (company, score, status, owner)
  - [ ] `LeadEnrichmentPanel.tsx` — shows all enriched data fields
  - [ ] `WebsiteAuditCard.tsx` — audit score + key issues
  - [ ] `ContactsList.tsx` — decision makers
  - [ ] `ActivityTimeline.tsx` — all logged activities
  - [ ] AI Insights panel (placeholder until Part 4)
  - [ ] Action buttons: Add to Campaign, Create Deal, Assign

- [ ] `apps/web/src/app/(dashboard)/leads/new/page.tsx`:
  - [ ] Manual lead entry form (react-hook-form + Zod)

### 3.7 CRM Frontend

- [ ] `apps/web/src/app/(dashboard)/crm/page.tsx`:
  - [ ] `KanbanBoard.tsx` — drag-and-drop pipeline board (dnd-kit)
  - [ ] `PipelineColumn.tsx` — stage column with deal cards
  - [ ] `DealCard.tsx` — card with value, lead name, owner avatar
  - [ ] Pipeline selector (switch between multiple pipelines)

- [ ] `apps/web/src/app/(dashboard)/crm/deals/[id]/page.tsx`:
  - [ ] Deal detail panel
  - [ ] Task list with due date badges
  - [ ] Note editor
  - [ ] Meeting log
  - [ ] Attachment list
  - [ ] Stage progress tracker
  - [ ] AI meeting brief (placeholder until Part 4)

**Part 3 Verification:**
- [ ] Create a lead manually → enrichment job runs → Apollo data populated
- [ ] Upload CSV of 10 leads → all appear in lead table
- [ ] Website audit runs → score and issues visible on lead detail page
- [ ] Drag deal from "Contacted" to "Meeting Scheduled" → stage logged in timeline
- [ ] Bulk tag 5 leads → all tags updated

---

## Part 4 — AI Agent System

**Goal:** Full multi-agent system with Model Gateway, Agent Registry, all 10 specialized agents, LangGraph workflows, hybrid RAG, MCP integration, and evaluation framework.

### 4.1 AI Package Foundation (`packages/ai`)

- [ ] Init `packages/ai` with TypeScript
- [ ] Install: `@langchain/core`, `@langchain/openai`, `@langchain/anthropic`, `langgraph`, `zod`

### 4.2 Model Gateway

- [ ] Create `packages/ai/src/gateway/ModelGateway.ts`:
  - [ ] `route(task)` — selects model based on task type + complexity
  - [ ] `call(prompt, config)` — normalized LLM call
  - [ ] `callWithFallback(prompt, providers)` — provider chain fallback
- [ ] Create `packages/ai/src/gateway/providers/`:
  - [ ] `openai.provider.ts` — OpenAI adapter
  - [ ] `anthropic.provider.ts` — Anthropic adapter
  - [ ] `gemini.provider.ts` — Google Gemini adapter
  - [ ] `local.provider.ts` — Ollama/vLLM adapter
  - [ ] `provider.factory.ts` — selects adapter by name
- [ ] Create `packages/ai/src/gateway/costEstimator.ts`
- [ ] Create `packages/ai/src/gateway/cache.ts` (Redis-backed prompt cache, 1h TTL)

### 4.3 Agent Registry

- [ ] Create `packages/ai/src/registry/AgentRegistry.ts`:
  - [ ] `register(entry)` — register agent definition
  - [ ] `get(agentId)` — retrieve agent by ID
  - [ ] `list()` — list all registered agents
  - [ ] `invoke(agentId, input, context)` — invoke agent by ID
  - [ ] `getHealth(agentId)` — current health metrics
- [ ] Register all 10 agents at startup with capabilities, schemas, budgets

### 4.4 Tool System

- [ ] Create `packages/ai/src/tools/` for each tool:

  **Search Tools:**
  - [ ] `searchApollo.tool.ts` — Apollo company search
  - [ ] `searchGoogle.tool.ts` — SerpAPI search
  - [ ] `searchGoogleMaps.tool.ts` — Google Maps place search

  **Web Tools:**
  - [ ] `fetchWebsite.tool.ts` — Playwright page fetch
  - [ ] `runLighthouse.tool.ts` — Lighthouse audit runner
  - [ ] `detectTechnologies.tool.ts` — Wappalyzer tech stack detection

  **Email Tools:**
  - [ ] `findEmail.tool.ts` — Hunter.io email discovery
  - [ ] `verifyEmail.tool.ts` — NeverBounce email verification

  **CRM Tools:**
  - [ ] `createLead.tool.ts` — save lead to database
  - [ ] `updateDeal.tool.ts` — update deal stage/value
  - [ ] `createTask.tool.ts` — create CRM task

  **Vector Tools:**
  - [ ] `semanticSearch.tool.ts` — vector + BM25 hybrid search
  - [ ] `upsertEmbedding.tool.ts` — embed and store document chunk

  **Analytics Tools:**
  - [ ] `getCampaignMetrics.tool.ts`

  Each tool must have:
  - [ ] Zod input schema
  - [ ] Zod output schema
  - [ ] Retry with exponential backoff (max 3)
  - [ ] 30-second hard timeout
  - [ ] Structured JSON return

### 4.5 Memory System

- [ ] `packages/ai/src/memory/shortTerm.memory.ts` — Redis TTL session state
- [ ] `packages/ai/src/memory/longTerm.memory.ts` — PostgreSQL user/org preferences
- [ ] `packages/ai/src/memory/semantic.memory.ts` — vector DB queries (pgvector)

### 4.6 Hybrid RAG Pipeline

- [ ] `packages/ai/src/rag/embedder.ts` — batch embedding generation
- [ ] `packages/ai/src/rag/indexer.ts` — chunk + embed + store documents
- [ ] `packages/ai/src/rag/retriever.ts`:
  - [ ] Dense retrieval (pgvector cosine similarity, Top-20)
  - [ ] Sparse BM25 retrieval (Meilisearch, Top-20)
  - [ ] Reciprocal Rank Fusion (RRF merge)
  - [ ] Cross-encoder reranking (Cohere Rerank v3, Top-5)
- [ ] `packages/ai/src/rag/contextBuilder.ts` — format retrieved chunks for LLM

### 4.7 Knowledge Sync Pipeline

- [ ] Create `apps/worker/src/processors/sync.processor.ts`:
  - [ ] Source connectors: CRM Notes, Email, Uploaded Files, Meeting Notes
  - [ ] Change detector (content hash comparison)
  - [ ] Document extractor (PDF, DOCX, HTML, CSV, plain text)
  - [ ] Chunker (512 tokens, 20% overlap, semantic boundaries)
  - [ ] Embedder (batch to OpenAI, fallback to BGE-M3)
  - [ ] Vector upsert (pgvector)
  - [ ] Meilisearch index update (BM25)
  - [ ] Sync record update
- [ ] Create `apps/worker/src/queues/sync.queue.ts` (4 sync queues)
- [ ] Create `apps/worker/src/schedulers/` for periodic sync triggers

### 4.8 Prompt Registry

- [ ] `packages/ai/src/prompts/registry.ts` — load prompts from database
- [ ] `packages/ai/src/prompts/versions/` — initial v1 prompts for all 10 agents:
  - [ ] `supervisor.v1.ts`
  - [ ] `planner.v1.ts`
  - [ ] `lead-discovery.v1.ts`
  - [ ] `company-research.v1.ts`
  - [ ] `contact-discovery.v1.ts`
  - [ ] `website-audit.v1.ts`
  - [ ] `outreach.v1.ts`
  - [ ] `crm.v1.ts`
  - [ ] `analytics.v1.ts`
  - [ ] `knowledge.v1.ts`

### 4.9 LangGraph Agent Implementations

- [ ] Implement each agent as a LangGraph node in `packages/ai/src/agents/`:
  - [ ] `supervisor/supervisor.agent.ts`
  - [ ] `planner/planner.agent.ts`
  - [ ] `lead-discovery/lead-discovery.agent.ts`
  - [ ] `company-research/company-research.agent.ts`
  - [ ] `contact-discovery/contact-discovery.agent.ts`
  - [ ] `website-audit/website-audit.agent.ts`
  - [ ] `outreach/outreach.agent.ts`
  - [ ] `crm/crm.agent.ts`
  - [ ] `analytics/analytics.agent.ts`
  - [ ] `knowledge/knowledge.agent.ts`

### 4.10 LangGraph Workflows

- [ ] `packages/ai/src/graph/lead-discovery.graph.ts`:
  - [ ] Nodes: supervisor → planner → [lead_discovery, company_research, contact_discovery, website_audit] → reviewer → response_builder
  - [ ] Edges: approval gate after planner node
  - [ ] Parallel execution for discovery nodes
- [ ] `packages/ai/src/graph/outreach.graph.ts`:
  - [ ] Nodes: supervisor → knowledge → outreach → approval → response_builder
- [ ] `packages/ai/src/graph/crm.graph.ts`:
  - [ ] Nodes: supervisor → crm → knowledge → response_builder

### 4.11 MCP Integration Layer

- [ ] Create `packages/ai/src/mcp/` directory
- [ ] `packages/ai/src/mcp/MCPClient.ts` — MCP protocol client
- [ ] `packages/ai/src/mcp/servers/`:
  - [ ] `mcp-crm.ts` — exposes lead/deal/task operations
  - [ ] `mcp-knowledge.ts` — exposes RAG search
  - [ ] `mcp-email.ts` — exposes email send/read
  - [ ] `mcp-storage.ts` — exposes file operations
  - [ ] `mcp-analytics.ts` — exposes metrics queries
- [ ] `packages/ai/src/mcp/MCPMiddleware.ts` — auth + audit + tenant isolation

### 4.12 AI Service API Endpoints

- [ ] Create `apps/api/src/modules/ai/`:
  - [ ] `POST /ai/chat` — conversational AI (streamed SSE response)
  - [ ] `POST /ai/plan` — generate search plan from ICP description
  - [ ] `PUT /ai/plan/:id/approve` — approve plan and start execution
  - [ ] `GET /ai/runs/:id` — get agent run status + progress
  - [ ] `GET /ai/runs` — list agent runs for org
  - [ ] `POST /ai/leads/:id/research` — trigger company research agent
  - [ ] `POST /ai/leads/:id/outreach` — generate personalized outreach
  - [ ] `POST /ai/deals/:id/meeting-brief` — generate meeting prep
  - [ ] `POST /ai/deals/:id/proposal` — generate proposal draft
  - [ ] `GET /registry/agents` — list all agents
  - [ ] `GET /registry/agents/:id/health` — agent health

### 4.13 Evaluation Framework

- [ ] `packages/ai/src/eval/EvalRunner.ts` — runs golden dataset against agents
- [ ] `packages/ai/src/eval/EvalJudge.ts` — LLM-as-judge scoring
- [ ] `packages/ai/src/eval/goldenDatasets/` — initial test cases per agent
- [ ] `.github/workflows/eval.yml` — CI evaluation pipeline

### 4.14 AI Frontend Components

- [ ] `apps/web/src/app/(dashboard)/ai-assistant/page.tsx`:
  - [ ] `AIChat.tsx` — streaming chat interface
  - [ ] `ThinkingIndicator.tsx` — animated typing/thinking indicator
  - [ ] `PlanReview.tsx` — interactive plan approval card
  - [ ] `AgentStatusCard.tsx` — real-time agent progress
  - [ ] `LeadDiscoveryStream.tsx` — leads appearing in real-time as discovered

- [ ] Update `leads/[id]/page.tsx` with live AI panels:
  - [ ] AI Company Research panel (call `POST /ai/leads/:id/research`)
  - [ ] AI Outreach Generator (call `POST /ai/leads/:id/outreach`)

**Part 4 Verification:**
- [ ] Chat: "Find 5 Shopify stores in Austin with poor mobile UX" → plan generated
- [ ] User approves plan → agents run → leads appear in real-time via WebSocket
- [ ] Lead detail shows AI-generated summary, pain points, sales angles
- [ ] Outreach generator produces personalized email from lead data
- [ ] Agent registry lists all 10 agents with health status

---

## Part 5 — Outreach & Campaign Engine

**Goal:** Multi-channel outreach campaigns with sequences, tracking, and automated follow-ups.

### 5.1 Campaign Service (API)

- [ ] Create `apps/api/src/modules/campaigns/`:
  - [ ] `POST /campaigns` — create campaign (channel, from email, template)
  - [ ] `GET /campaigns` — list campaigns with stats
  - [ ] `GET /campaigns/:id` — campaign detail + metrics
  - [ ] `PUT /campaigns/:id` — update campaign
  - [ ] `POST /campaigns/:id/leads` — add leads to campaign
  - [ ] `POST /campaigns/:id/launch` — launch campaign (human approval gate)
  - [ ] `POST /campaigns/:id/pause` — pause sending
  - [ ] `GET /campaigns/:id/leads` — list enrolled leads + status

### 5.2 Sequence Engine (API)

- [ ] `POST /campaigns/:id/sequences` — create follow-up sequence
- [ ] `GET /campaigns/:id/sequences` — list sequences
- [ ] `PUT /campaigns/:id/sequences/:seqId` — update sequence steps
- [ ] Sequence step types: email, LinkedIn, WhatsApp, SMS, delay, condition

### 5.3 Email Sending Worker

- [ ] Create `apps/worker/src/processors/email.processor.ts`:
  - [ ] Dequeue `email.send` jobs from BullMQ
  - [ ] Send via Resend API (or Amazon SES fallback)
  - [ ] Handle bounces + unsubscribes
  - [ ] Inject tracking pixel (open tracking)
  - [ ] Wrap links in tracking redirects (click tracking)
  - [ ] Log send event to `EmailEvent` table

### 5.4 Tracking Infrastructure

- [ ] Create `apps/api/src/modules/campaigns/campaigns.tracking.ts`:
  - [ ] `GET /track/open/:eventId` — 1x1 pixel tracker → records open event
  - [ ] `GET /track/click/:eventId?url=` — redirect tracker → records click + redirects
  - [ ] `POST /track/reply` — inbound reply webhook receiver (from email provider)
  - [ ] `POST /track/bounce` — bounce webhook receiver
  - [ ] `POST /track/unsubscribe` — unsubscribe handler

### 5.5 Sequence Runner (Worker Scheduler)

- [ ] Create `apps/worker/src/schedulers/sequence.scheduler.ts`:
  - [ ] Run every 15 minutes via cron
  - [ ] Find all active sequence enrollments past their send time
  - [ ] Check if lead has replied (stop if yes)
  - [ ] Queue next message in sequence
  - [ ] Handle day offsets (Day 3, Day 7, Day 14)

### 5.6 Inbox Rotation & Spam Score

- [ ] `apps/api/src/modules/campaigns/inboxRotation.ts`:
  - [ ] Round-robin across multiple connected sender accounts
  - [ ] Track sends per account per day
- [ ] Pre-send spam score check (integrate SpamAssassin or external API)

### 5.7 Campaign Frontend

- [ ] `apps/web/src/app/(dashboard)/campaigns/page.tsx`:
  - [ ] Campaign list with status badges, open rate, reply rate
  - [ ] Create campaign button → step-by-step builder

- [ ] `apps/web/src/app/(dashboard)/campaigns/new/page.tsx`:
  - [ ] **Step 1:** Select leads (from existing or new search)
  - [ ] **Step 2:** Choose channel (Email / LinkedIn / WhatsApp)
  - [ ] **Step 3:** AI generates personalized messages → user reviews each
  - [ ] **Step 4:** Configure sequence (timing, follow-up steps)
  - [ ] **Step 5:** Review + approve → launch

- [ ] `apps/web/src/app/(dashboard)/campaigns/[id]/page.tsx`:
  - [ ] Live stats: Sent, Delivered, Opened, Clicked, Replied, Bounced
  - [ ] Lead-by-lead status table with last event
  - [ ] `SequenceEditor.tsx` — visual sequence builder
  - [ ] `EmailPreview.tsx` — preview rendered email with tracking

**Part 5 Verification:**
- [ ] Create email campaign for 3 leads → AI generates 3 personalized emails
- [ ] User reviews and approves → emails sent via Resend
- [ ] Open tracking pixel fires → open recorded in DB
- [ ] Day 3 follow-up auto-queued → sent when no reply
- [ ] Lead replies → sequence stops automatically

---

## Part 6 — Analytics, Workflows & Notifications

**Goal:** Real-time analytics dashboards, visual workflow automation builder, and multi-channel notifications.

### 6.1 Analytics Service (API)

- [ ] Create `apps/api/src/modules/analytics/`:
  - [ ] `GET /analytics/overview` — KPI summary (leads, deals, revenue, conversion)
  - [ ] `GET /analytics/leads` — lead source breakdown, volume over time
  - [ ] `GET /analytics/campaigns` — campaign performance (open, click, reply rates)
  - [ ] `GET /analytics/funnel` — stage conversion funnel
  - [ ] `GET /analytics/revenue` — MRR/ARR, revenue per customer
  - [ ] `GET /analytics/ai-usage` — token consumption per module

- [ ] Create `apps/worker/src/schedulers/analytics.scheduler.ts`:
  - [ ] Pre-compute daily metrics aggregations → cache in Redis (5min TTL)

### 6.2 Analytics Frontend

- [ ] `apps/web/src/app/(dashboard)/analytics/page.tsx`:
  - [ ] KPI cards row (leads generated, meetings booked, conversion rate, revenue)
  - [ ] `FunnelChart.tsx` — stage conversion funnel (Recharts funnel)
  - [ ] `RevenueChart.tsx` — MRR trend over time (Recharts area chart)
  - [ ] `LeadSourceChart.tsx` — source breakdown (Recharts pie/donut)
  - [ ] `CampaignPerformanceTable.tsx` — per-campaign stats table
  - [ ] `AIUsageWidget.tsx` — token usage by module
  - [ ] Date range picker (last 7d, 30d, 90d, custom)
  - [ ] Export report button → PDF download

### 6.3 Dashboard Home

- [ ] `apps/web/src/app/(dashboard)/page.tsx`:
  - [ ] Welcome card with user name
  - [ ] Quick stats row
  - [ ] Recent leads (last 5 discovered)
  - [ ] Recent activities feed
  - [ ] Active campaigns with mini stats
  - [ ] Upcoming tasks and meetings
  - [ ] AI usage summary

### 6.4 Workflow Automation Service (API)

- [ ] Create `apps/api/src/modules/workflows/`:
  - [ ] `POST /workflows` — create workflow from JSON definition
  - [ ] `GET /workflows` — list workflows
  - [ ] `PUT /workflows/:id` — update workflow
  - [ ] `POST /workflows/:id/activate` — activate workflow
  - [ ] `POST /workflows/:id/deactivate` — pause
  - [ ] `GET /workflows/:id/runs` — execution history
  - [ ] `POST /workflows/trigger` — manually trigger a workflow

  **Trigger types:**
  - `lead.created`, `lead.score_changed`, `email.replied`, `email.opened`, `deal.stage_changed`, `webhook`

  **Action types:**
  - `send_email`, `update_lead`, `create_task`, `move_deal_stage`, `add_to_campaign`, `call_webhook`, `ai_generate_content`, `send_notification`

- [ ] Create `apps/worker/src/processors/workflow.processor.ts`:
  - [ ] Execute workflow steps in order
  - [ ] Evaluate conditions (branch logic)
  - [ ] Handle delays (schedule next step via BullMQ delay)
  - [ ] Loop support (iterate over lead lists)
  - [ ] Log each step to `WorkflowRun`

### 6.5 Workflow Builder Frontend

- [ ] `apps/web/src/app/(dashboard)/workflows/page.tsx`:
  - [ ] List of workflows with status, run count, last run
  - [ ] Pre-built templates section

- [ ] `apps/web/src/app/(dashboard)/workflows/[id]/page.tsx`:
  - [ ] Visual node-based workflow builder (React Flow)
  - [ ] Node types: Trigger, Action, Condition, Delay, Loop
  - [ ] Side panel: configure selected node
  - [ ] Run history tab
  - [ ] Real-time execution progress (WebSocket)

### 6.6 Notification Service (API + Worker)

- [ ] Create `apps/api/src/modules/notifications/`:
  - [ ] `GET /notifications` — list user notifications (paginated)
  - [ ] `PUT /notifications/:id/read` — mark as read
  - [ ] `PUT /notifications/read-all` — mark all as read
  - [ ] `GET /notifications/preferences` — get user notification settings
  - [ ] `PUT /notifications/preferences` — update settings (which channels, which events)

- [ ] Create `apps/worker/src/processors/notification.processor.ts`:
  - [ ] Email notifications via Resend
  - [ ] Slack notifications via Slack API
  - [ ] In-app via WebSocket push to connected clients

- [ ] Frontend: notification bell icon + dropdown in Header

### 6.7 Real-Time WebSocket

- [ ] Create `apps/api/src/plugins/websocket.ts` (Socket.IO):
  - [ ] Namespace: `/{organizationId}` for tenant isolation
  - [ ] Events: `lead.discovered`, `agent.status`, `email.opened`, `deal.updated`, `notification`, `workflow.completed`
- [ ] Create `apps/web/src/providers/RealtimeProvider.tsx` (Socket.IO client)
- [ ] Create `apps/web/src/hooks/useRealtime.ts`

**Part 6 Verification:**
- [ ] Analytics dashboard shows correct numbers matching DB records
- [ ] Create workflow: "When email is opened → create CRM task" → test by opening tracked email
- [ ] Workflow history shows all steps executed with timestamps
- [ ] In-app notification appears in bell when lead is discovered
- [ ] Real-time: open a second browser tab → both update when deal moves stage

---

## Part 7 — Frontend Polish, Admin Panel, Client Portal & Production

**Goal:** Complete the UI, add admin panel, client portal, review/referral system, marketplace, and deploy to production.

### 7.1 UI Polish & Design System

- [ ] Audit all pages for design consistency
- [ ] Add loading states (Skeleton components) to all data-fetching pages
- [ ] Add empty states with helpful CTAs to all list pages
- [ ] Add error boundaries with retry buttons
- [ ] Ensure all pages are responsive (mobile-first)
- [ ] Add keyboard shortcuts (cmd+k command palette)
- [ ] Dark mode support (Tailwind dark class strategy)
- [ ] Add micro-animations (Framer Motion):
  - [ ] Page transitions
  - [ ] Card hover effects
  - [ ] Sidebar open/close
  - [ ] Toast notifications

### 7.2 Marketing Website

- [ ] `apps/web/src/app/(marketing)/page.tsx` — landing page:
  - [ ] Hero section with CTA
  - [ ] Feature highlights
  - [ ] How it works (steps)
  - [ ] Social proof / logos
  - [ ] Pricing section (links to billing)
  - [ ] FAQ
  - [ ] Footer

- [ ] `apps/web/src/app/(marketing)/pricing/page.tsx`
- [ ] `apps/web/src/app/(marketing)/blog/` (MDX-powered)

### 7.3 Proposal Generator

- [ ] `apps/api/src/modules/proposals/`:
  - [ ] `POST /proposals` — generate proposal from deal (AI-drafted)
  - [ ] `GET /proposals/:id` — get proposal
  - [ ] `PUT /proposals/:id` — edit proposal
  - [ ] `POST /proposals/:id/export-pdf` — generate PDF

- [ ] `apps/web/src/app/(dashboard)/proposals/page.tsx`:
  - [ ] List proposals with status
  - [ ] "Generate from deal" action

- [ ] `apps/web/src/app/(dashboard)/proposals/[id]/page.tsx`:
  - [ ] Rich text editor for proposal content
  - [ ] Sections: Scope, Timeline, Pricing, Contract
  - [ ] PDF preview and download
  - [ ] Send to client via email

### 7.4 Admin Panel

- [ ] `apps/web/src/app/(admin)/layout.tsx` — admin-only protected layout
- [ ] `apps/web/src/app/(admin)/page.tsx` — platform overview stats
- [ ] `apps/web/src/app/(admin)/users/page.tsx` — all users, suspend, impersonate
- [ ] `apps/web/src/app/(admin)/organizations/page.tsx` — all orgs, usage, plan override
- [ ] `apps/web/src/app/(admin)/billing/page.tsx` — payment records, refunds
- [ ] `apps/web/src/app/(admin)/logs/page.tsx` — system and audit log viewer

### 7.5 Client Portal

- [ ] `apps/web/src/app/(portal)/layout.tsx` — client-facing layout
- [ ] `apps/web/src/app/(portal)/page.tsx` — project overview
- [ ] `apps/web/src/app/(portal)/projects/[id]/page.tsx` — project details
- [ ] `apps/web/src/app/(portal)/invoices/page.tsx` — invoice list + download

### 7.6 Review & Referral System

- [ ] `apps/api/src/modules/reviews/`:
  - [ ] `POST /reviews/request` — send review request email to client
  - [ ] `POST /referrals` — create referral campaign
  - [ ] `GET /referrals/:code` — track referral conversion
  - [ ] `GET /referrals` — list referrals with status + rewards

### 7.7 Marketplace

- [ ] `apps/api/src/modules/marketplace/`:
  - [ ] `GET /marketplace/templates` — list workflow/email/prompt templates
  - [ ] `POST /marketplace/templates` — publish template
  - [ ] `POST /marketplace/templates/:id/import` — import into workspace

- [ ] `apps/web/src/app/(dashboard)/marketplace/page.tsx`:
  - [ ] Template grid with categories
  - [ ] One-click import

### 7.8 Dockerfiles & Production Config

- [ ] `infra/docker/web.Dockerfile` — multi-stage Next.js production build
- [ ] `infra/docker/api.Dockerfile` — multi-stage Fastify production build
- [ ] `infra/docker/worker.Dockerfile` — worker production image
- [ ] Update `docker-compose.yml` with production-ready configs

### 7.9 Kubernetes Manifests

- [ ] `infra/k8s/namespace.yaml`
- [ ] `infra/k8s/deployments/frontend.yaml` (3 replicas)
- [ ] `infra/k8s/deployments/api.yaml` (5 replicas + HPA)
- [ ] `infra/k8s/deployments/worker.yaml` (2 replicas + HPA)
- [ ] `infra/k8s/ingress/traefik.ingress.yaml` (auto TLS)
- [ ] `infra/k8s/hpa/api.hpa.yaml`

### 7.10 Monitoring Setup

- [ ] Add Prometheus metrics endpoint to Fastify API
- [ ] Add OpenTelemetry instrumentation (auto-instrument HTTP, DB, Redis)
- [ ] Configure Grafana dashboards:
  - [ ] Platform overview
  - [ ] AI usage per tenant
  - [ ] Queue health
- [ ] Configure Loki log forwarding from all services
- [ ] Set up alerting rules (error rate > 5%, queue depth > 500)

### 7.11 Final CI/CD

- [ ] `.github/workflows/deploy.yml`:
  - [ ] Build Docker images on merge to main
  - [ ] Push to container registry
  - [ ] Apply K8s manifests (`kubectl apply`)
  - [ ] Run smoke tests after deploy
  - [ ] Rollback on failure

**Part 7 Verification:**
- [ ] Marketing landing page is live and SEO-ready
- [ ] Proposal generated from deal → PDF downloadable
- [ ] Admin can view all orgs and users
- [ ] Client portal accessible via shared link
- [ ] Review request email sent after deal marked Won
- [ ] Marketplace workflow template imported in one click
- [ ] `kubectl get pods -n leadflow-prod` → all pods Running
- [ ] Grafana dashboard shows live traffic

---

## Build Sequence Summary

```
Part 1: Foundation
  └── Infrastructure + DB Schema + Shared Packages + App Shells

Part 2: Auth & Multi-Tenancy
  └── Requires: Part 1

Part 3: Lead Management & CRM
  └── Requires: Part 1 + Part 2

Part 4: AI Agent System
  └── Requires: Part 1 + Part 2 + Part 3

Part 5: Outreach & Campaigns
  └── Requires: Part 1 + Part 2 + Part 3 + Part 4 (AI message generation)

Part 6: Analytics, Workflows & Notifications
  └── Requires: Parts 1–5

Part 7: Polish, Admin, Portal, Production
  └── Requires: All previous parts
```

---

## Next Action

**Start with Part 1.** Run the following to begin:

```bash
mkdir leadflow-ai
cd leadflow-ai
git init
```

Then follow Part 1 tasks in order from top to bottom.
