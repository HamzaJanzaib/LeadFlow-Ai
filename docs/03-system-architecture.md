# 03 — System Architecture

> **LeadFlow AI** · System Architecture Reference
> Version 1.0 · Last Updated: 2026-06-27

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [High-Level System Diagram](#2-high-level-system-diagram)
3. [Layer Breakdown](#3-layer-breakdown)
4. [Full Technology Stack](#4-full-technology-stack)
5. [Database Design Principles](#5-database-design-principles)
6. [Caching Strategy](#6-caching-strategy)
7. [Queue & Background Workers](#7-queue--background-workers)
8. [Storage Architecture](#8-storage-architecture)
9. [Authentication & Security Layer](#9-authentication--security-layer)
10. [Real-Time Communication](#10-real-time-communication)
11. [Observability Stack](#11-observability-stack)
12. [Deployment Architecture](#12-deployment-architecture)
13. [External Integrations Map](#13-external-integrations-map)
14. [Scalability Considerations](#14-scalability-considerations)

---

## 1. Architecture Philosophy

LeadFlow AI follows a **Modular Monolith** architecture at launch, designed to be decomposed into microservices as scale demands. The core principles are:

| Principle | Implementation |
|-----------|---------------|
| **Domain-Driven Design** | Each feature domain (CRM, Leads, Campaigns) owns its data and logic |
| **Multi-Tenant Isolation** | Every query is scoped by `organizationId` — no cross-tenant leakage |
| **Event-Driven** | State changes emit events consumed by background workers and AI agents |
| **API-First** | All features exposed via versioned REST API before building UI |
| **AI-Native** | AI is not a bolt-on; it is woven into every feature domain |
| **Observable** | Every request, agent call, and tool invocation is traced |

---

## 2. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                           │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Marketing   │  │  Dashboard   │  │  Admin   │  │  Client   │  │
│  │  Website     │  │  (SaaS App)  │  │  Panel   │  │  Portal   │  │
│  └──────────────┘  └──────────────┘  └──────────┘  └───────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTPS / REST / WebSocket
┌─────────────────────────────▼───────────────────────────────────────┐
│                       API Gateway Layer                             │
│                                                                     │
│         Traefik / NGINX  ·  Rate Limiting  ·  SSL Termination       │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                    Application Services (Fastify)                   │
│                                                                     │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Auth     │  │   CRM    │  │  Leads   │  │  Campaign        │  │
│  │  Service   │  │ Service  │  │ Service  │  │  Service         │  │
│  └────────────┘  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                                     │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │    AI      │  │ Billing  │  │ Analytics│  │  Notification    │  │
│  │  Service   │  │ Service  │  │ Service  │  │  Service         │  │
│  └────────────┘  └──────────┘  └──────────┘  └──────────────────┘  │
└──────────┬──────────────┬──────────────┬────────────────────────────┘
           │              │              │
     ┌─────▼───┐    ┌─────▼─────┐  ┌────▼────────────────────────┐
     │PostgreSQL│    │   Redis   │  │       BullMQ                │
     │(Primary) │    │  (Cache)  │  │  (Background Job Queue)     │
     └─────────┘    └───────────┘  └────────────────────────────-┘
           │                                     │
     ┌─────▼──────────────────────────────────────▼──────────────┐
     │                   Background Workers                       │
     │                                                            │
     │  AI Processing · Website Scanning · Email Sending          │
     │  Report Generation · Scheduled Jobs · Data Enrichment      │
     └─────────────────────────────────────────────────────────---┘
           │
     ┌─────▼──────────────────────────────────────────────────────┐
     │              External Integrations                          │
     │                                                            │
     │  OpenAI · Anthropic · Stripe · Google Maps · Apollo        │
     │  LinkedIn · Twilio · Resend · HubSpot · Salesforce         │
     └────────────────────────────────────────────────────────────┘
```

---

## 3. Layer Breakdown

### 3.1 Presentation Layer

| Application | Technology | Purpose |
|-------------|-----------|---------|
| **Marketing Website** | Next.js (Static) | SEO-optimized landing pages, blog, pricing |
| **Dashboard (SaaS App)** | Next.js (App Router) | Main product UI for end users |
| **Admin Panel** | Next.js (internal) | Super-admin interface for platform operators |
| **Client Portal** | Next.js | Whitelabeled portal for end-clients |

All frontend apps share a **component library** built on `shadcn/ui` and Tailwind CSS.

---

### 3.2 API Layer

Built with **Node.js + Fastify** as a **Modular Monolith** — all domains live in one deployable unit, but are structured as independent modules with clear boundaries.

| Service Module | Responsibilities |
|---------------|-----------------|
| **Auth Service** | JWT issuance, OAuth flows, session management, RBAC enforcement |
| **Organization Service** | Tenant management, workspaces, teams, billing entitlements |
| **Lead Service** | Lead CRUD, enrichment triggers, scoring, deduplication |
| **CRM Service** | Pipelines, deals, tasks, meetings, notes, activities |
| **Campaign Service** | Outreach campaigns, sequences, scheduling, tracking |
| **AI Service** | Agent orchestration, prompt management, LLM calls |
| **Analytics Service** | Metric aggregation, report generation, dashboard data |
| **Billing Service** | Stripe webhooks, subscription management, usage tracking |
| **Notification Service** | Email, SMS, push, in-app, Slack, Discord routing |
| **Storage Service** | File upload, MinIO integration, presigned URL generation |

---

### 3.3 Background Workers

Long-running or async operations run outside the request cycle:

| Worker | Trigger | Responsibilities |
|--------|---------|-----------------|
| **AI Worker** | Job queue | Run AI agent pipelines, enrich leads, generate content |
| **Website Scanner** | Scheduled / on-demand | Run Lighthouse, check links, detect technologies |
| **Email Sender** | Queue-based | Deliver outreach emails via Resend/SES |
| **Sequence Runner** | Cron / event-based | Execute follow-up sequences at scheduled intervals |
| **Report Generator** | On-demand / scheduled | Build and store PDF reports |
| **Data Enrichment** | Post-lead-save event | Pull data from Apollo, LinkedIn, etc. |
| **Sync Worker** | Webhooks / polling | Sync external CRM data (HubSpot, Salesforce) |

---

### 3.4 Storage Layer

| Store | Technology | Usage |
|-------|-----------|-------|
| **Primary Database** | PostgreSQL 16 | All relational data, with pgvector for embeddings |
| **Cache** | Redis 7 | Session tokens, rate limit counters, hot data |
| **Object Storage** | MinIO (S3-compatible) | Files, PDFs, attachments, website screenshots |
| **Search Index** | Meilisearch or OpenSearch | Full-text search on leads, notes, emails |
| **Vector Database** | pgvector (default) / Qdrant (enterprise) | Semantic search, RAG retrieval |

---

## 4. Full Technology Stack

### Frontend

| Component | Technology | Reason |
|-----------|-----------|--------|
| Framework | Next.js 16 (App Router) | SSR + SSG, file-based routing, server actions |
| Language | TypeScript | Type safety across the entire codebase |
| UI Components | shadcn/ui + Radix UI | Accessible, unstyled primitives |
| Styling | Tailwind CSS | Utility-first, design system tokens |
| State Management | TanStack Query + Zustand | Server state + client state separation |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| Charts | Recharts | Composable, React-native charting |
| Real-Time | Socket.IO client | Live campaign updates, notifications |

---

### Backend

| Component | Technology | Reason |
|-----------|-----------|--------|
| Runtime | Node.js 20 LTS | Widely supported, async-native |
| Framework | Fastify | 2–3× faster than Express, plugin architecture |
| Language | TypeScript | End-to-end type safety |
| ORM | Prisma | Type-safe DB access, migrations, relations |
| Validation | Zod | Runtime schema validation on all API inputs |
| Queue | BullMQ (Redis-backed) | Reliable job queuing with retries |
| Scheduling | BullMQ + node-cron | Cron-based recurring jobs |

---

### AI / ML

| Component | Technology |
|-----------|-----------|
| Agent Framework | LangGraph |
| LLM Providers | OpenAI (GPT-4o) · Anthropic (Claude 3.5) · Google Gemini |
| Embeddings | OpenAI text-embedding-3-large · BGE-M3 (self-hosted) |
| RAG | LangChain Retrieval + LangGraph orchestration |
| Vector DB | pgvector (default) · Qdrant (enterprise) |
| AI Observability | Langfuse (LLM tracing, evaluation) |
| Web Automation | Puppeteer / Playwright (website scanning) |

---

### Infrastructure & DevOps

| Component | Technology |
|-----------|-----------|
| Containerization | Docker + Docker Compose |
| Orchestration | Kubernetes (enterprise / production) |
| Reverse Proxy | Traefik (auto TLS) or NGINX |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| Logging | Loki + Grafana |
| Tracing | OpenTelemetry |
| Hosting | AWS · DigitalOcean · Hetzner |

---

## 5. Database Design Principles

### Multi-Tenancy

Every table that holds tenant-specific data includes an `organizationId` foreign key:

```sql
-- Example: All lead queries are automatically scoped
SELECT * FROM leads
WHERE organization_id = $1
  AND status = 'active'
ORDER BY score DESC;
```

Row-Level Security (RLS) in PostgreSQL enforces this at the database level as a safety net.

### Core Data Models

```
Organization
  └── Workspaces
        └── Users (with Roles)
        └── Leads
              └── Contacts
              └── Activities
              └── Website Audits
              └── Lead Scores
        └── Campaigns
              └── Sequences
              └── Messages
              └── Tracking Events
        └── Deals (CRM Pipeline)
              └── Tasks
              └── Meetings
              └── Notes
        └── Workflows
              └── Workflow Steps
              └── Workflow Runs
        └── API Keys
        └── Subscriptions
```

### Indexes

- B-tree index on all `organization_id` + `status` combinations
- GIN index on `tags` (array type)
- HNSW index on embedding vectors (pgvector)
- Full-text search indexes via `tsvector` on company name, notes, emails

---

## 6. Caching Strategy

Redis is used for multiple caching layers:

| Cache Type | TTL | Use Case |
|-----------|-----|---------|
| **Session Cache** | 24h | Active user sessions |
| **Rate Limit Counters** | 1min rolling window | API rate limiting per user/IP |
| **Lead Enrichment Cache** | 7 days | Avoid redundant Apollo/LinkedIn API calls |
| **AI Response Cache** | 1h | Cache identical prompt results |
| **Dashboard Metrics** | 5min | Pre-computed analytics aggregations |
| **ICP Cache** | Session | Active ICP during planning stage |

---

## 7. Queue & Background Workers

All async operations go through **BullMQ** backed by Redis:

### Queue Categories

| Queue Name | Priority | Workers | Retry Policy |
|-----------|---------|---------|-------------|
| `ai.agent` | High | 4 | 3× with exponential backoff |
| `lead.enrich` | Medium | 8 | 3× with jitter |
| `email.send` | High | 4 | 5× with linear backoff |
| `website.scan` | Low | 2 | 2× |
| `report.generate` | Low | 2 | 1× |
| `crm.sync` | Medium | 2 | 3× |
| `notifications` | High | 4 | 3× |

### Job Lifecycle

```
Job Created → Queued → Processing → Completed
                  └──────────────► Failed → Retry (max N) → Dead Letter Queue
```

Failed jobs land in a **Dead Letter Queue** for manual inspection and replay.

---

## 8. Storage Architecture

### Object Storage (MinIO)

Bucket structure:

```
leadflow-storage/
├── {orgId}/
│   ├── leads/
│   │   └── {leadId}/
│   │       ├── website-screenshots/
│   │       └── audit-reports/
│   ├── proposals/
│   │   └── {dealId}/
│   │       └── proposal-v1.pdf
│   ├── uploads/
│   │   └── {userId}/
│   │       └── {filename}
│   └── exports/
│       └── leads-export-{date}.csv
```

All files are accessed via **presigned URLs** — never served directly. Presigned URLs expire in 1 hour.

---

## 9. Authentication & Security Layer

### Authentication Flow

```
User Login Request
  │
  ▼
Clerk / Auth.js Provider
  │  → Validates credentials, issues JWT
  ▼
JWT Stored (httpOnly cookie or localStorage)
  │
  ▼
Every API Request
  │  → JWT validated in Fastify middleware
  │  → organizationId extracted from token
  │  → RBAC permissions checked
  ▼
Database Query
     → Scoped by organizationId automatically
```

### Security Controls Summary

| Control | Detail |
|---------|--------|
| JWT | Short-lived access tokens (15min) + refresh tokens (7d) |
| HTTPS | TLS 1.3 enforced at reverse proxy |
| RBAC | Roles: Owner, Admin, Manager, Member, Viewer |
| Rate Limiting | 100 req/min per user, 1000 req/min per org |
| API Keys | SHA-256 hashed, scoped to read/write/admin |
| Audit Logs | Immutable append-only log of all mutations |
| Encryption at Rest | AES-256 for database, MinIO server-side encryption |
| GDPR | Data export endpoint, deletion cascade, consent logs |

---

## 10. Real-Time Communication

**Socket.IO** provides real-time updates for:

| Event | Subscriber | Description |
|-------|-----------|-------------|
| `lead.discovered` | Dashboard | New lead appears in real-time during search |
| `agent.status` | Dashboard | AI agent progress updates |
| `email.opened` | Campaign tracker | Live open event |
| `email.replied` | Campaign tracker | Inbound reply detected |
| `notification` | Notification bell | In-app alerts |
| `deal.updated` | CRM board | Kanban card moves |
| `workflow.completed` | Workflow builder | Execution finished |

All Socket.IO events are namespaced by `organizationId` for tenant isolation.

---

## 11. Observability Stack

```
Application Layer
  │
  ├── OpenTelemetry SDK (auto-instrumentation)
  │     → Traces exported to Grafana Tempo
  │
  ├── Prometheus Metrics
  │     → HTTP request rate, latency, error rate
  │     → Queue depths, job durations
  │     → AI token usage, cost per request
  │
  ├── Loki Log Aggregation
  │     → Structured JSON logs from all services
  │     → Correlation via traceId
  │
  └── Langfuse (AI-specific)
        → LLM call tracing
        → Token usage per agent per tenant
        → Hallucination scoring
        → Prompt version tracking
```

**Grafana Dashboards:**

- Platform Overview (requests/errors/latency)
- AI Usage Dashboard (tokens/cost per tenant)
- Queue Health (depth, throughput, failures)
- Business Metrics (leads, conversions, revenue)

---

## 12. Deployment Architecture

### Local Development

```
Docker Compose
├── app (Next.js frontend)
├── api (Fastify backend)
├── worker (BullMQ workers)
├── postgres
├── redis
├── minio
├── meilisearch
└── langfuse (AI tracing)
```

### Production (Kubernetes)

```
Kubernetes Cluster
├── Namespace: leadflow-prod
│   ├── Deployments
│   │   ├── frontend (3 replicas)
│   │   ├── api (5 replicas, HPA enabled)
│   │   └── worker (2 replicas, HPA enabled)
│   ├── StatefulSets
│   │   ├── postgres (primary + replica)
│   │   └── redis (cluster mode)
│   ├── Services & Ingress (Traefik)
│   └── ConfigMaps & Secrets (Vault or K8s Secrets)
├── Namespace: leadflow-monitoring
│   ├── Prometheus
│   ├── Grafana
│   ├── Loki
│   └── Langfuse
└── Namespace: leadflow-storage
    └── MinIO (distributed mode)
```

---

## 13. External Integrations Map

| Category | Service | Used For |
|----------|---------|---------|
| **AI Providers** | OpenAI, Anthropic, Google Gemini | LLM calls, embeddings |
| **Lead Data** | Apollo, Google Maps, LinkedIn | Lead discovery and enrichment |
| **Email Delivery** | Resend, Amazon SES | Transactional and campaign emails |
| **Calendar** | Google Calendar, Outlook | Meeting booking and sync |
| **Payments** | Stripe | Subscriptions, invoices, usage billing |
| **SMS** | Twilio | SMS outreach and notifications |
| **Communication** | Slack, Discord | Team notifications and alerts |
| **CRM Sync** | HubSpot, Salesforce | Bidirectional data sync |
| **Productivity** | Google Sheets, Airtable, Notion | Data import/export |
| **Automation** | Zapier, n8n | Webhook-based integration |
| **Developer Tools** | GitHub | Code integration triggers |

---

## 14. Scalability Considerations

### Horizontal Scaling

- **API servers** scale horizontally — all state is in Redis or PostgreSQL
- **Workers** scale independently based on queue depth
- **Frontend** is stateless and served via CDN

### Database Scaling

| Strategy | When to Apply |
|----------|--------------|
| Read replicas | >10K daily active users |
| Connection pooling (PgBouncer) | >500 concurrent connections |
| Partitioning (by org or date) | >100M lead records |
| Sharding | Enterprise-scale multi-region |

### AI Cost Management

| Strategy | Description |
|----------|-------------|
| Response caching | Cache identical prompts for 1h |
| Model tiering | Use GPT-4o-mini for cheap tasks, GPT-4o for complex |
| Token budgets | Per-org credit limits enforced before calling LLM |
| Batch processing | Group non-urgent AI jobs to reduce API calls |

---

← [Previous: Application Flow](./02-application-flow.md) · [Back to Index](./README.md) · [Next: AI Agent Architecture →](./04-ai-agent-architecture.md)
