# 04 — AI Agent Architecture

> **LeadFlow AI** · AI Agent System Design Reference
> Version 1.1 · Last Updated: 2026-06-27

---

## Table of Contents

1. [Vision & Philosophy](#1-vision--philosophy)
2. [Architecture Principles](#2-architecture-principles)
3. [Agent Operating System](#3-agent-operating-system)
4. [Agent Types & Responsibilities](#4-agent-types--responsibilities)
5. [Memory Architecture](#5-memory-architecture)
6. [RAG Architecture](#6-rag-architecture)
7. [Knowledge Sources](#7-knowledge-sources)
8. [Embedding Strategy](#8-embedding-strategy)
9. [Vector Database](#9-vector-database)
10. [LangGraph Workflow](#10-langgraph-workflow)
11. [Tool Calling System](#11-tool-calling-system)
12. [Agent Communication Protocol](#12-agent-communication-protocol)
13. [Prompt Management](#13-prompt-management)
14. [Human Approval Gates](#14-human-approval-gates)
15. [Observability & Tracing](#15-observability--tracing)
16. [Security & Guardrails](#16-security--guardrails)
17. [AI Tech Stack Summary](#17-ai-tech-stack-summary)
18. [Development Standards](#18-development-standards)
19. [Model Gateway](#19-model-gateway)
20. [Agent Registry](#20-agent-registry)
21. [MCP Integration Layer](#21-mcp-integration-layer)
22. [Evaluation Framework](#22-evaluation-framework)
23. [Hybrid Retrieval](#23-hybrid-retrieval)
24. [Knowledge Synchronization Pipeline](#24-knowledge-synchronization-pipeline)

---

## 1. Vision & Philosophy

LeadFlow AI is an **AI-native platform** — artificial intelligence is not added on top of the product; it is woven into every feature.

Instead of building one large general-purpose AI chatbot, the platform uses **multiple specialized autonomous agents** that collaborate through a shared workflow graph and memory system:

> **"One agent, one job. Done perfectly."**

Each agent is:
- **Specialized** — focused on a single domain (leads, research, outreach, CRM)
- **Stateless at the API level** — all state lives in shared memory stores
- **Observable** — every call, token, cost, and failure is traceable
- **Composable** — agents are nodes in a LangGraph workflow graph

---

## 2. Architecture Principles

| Principle | Description |
|-----------|-------------|
| **Multi-Agent System** | Multiple specialized agents, not one monolithic AI |
| **Supervisor Pattern** | A master agent coordinates others; none operate independently |
| **Stateful Memory** | Agents share structured memory across conversation turns |
| **RAG (Retrieval-Augmented Generation)** | Agents retrieve grounded context before generating responses |
| **Tool Calling** | Agents use deterministic, typed tools instead of hallucinating data |
| **Human-in-the-Loop** | Critical actions require explicit user approval before execution |
| **Event-Driven Workflows** | Agent steps emit events consumed by downstream agents |
| **Structured Outputs** | All agent responses are strongly typed JSON, not free-form text |
| **Observability** | Full distributed tracing across all agents, tools, and LLM calls |
| **Guardrails** | Policy enforcement, content filtering, and prompt injection protection |

---

## 3. Agent Operating System

```
User Input (natural language)
  │
  ▼
Gateway API
  │  (Authentication, rate limiting, tenant resolution)
  ▼
Supervisor Agent
  │  (Intent classification, task decomposition, delegation)
  ▼
Planner Agent
  │  (Execution plan, agent selection, cost estimation)
  ▼
Task Queue (BullMQ)
  │  (Prioritized, retryable job distribution)
  ▼
Specialized Agents (parallel where possible)
  │  Lead Discovery  │  Company Research  │  Contact Discovery
  │  Website Audit   │  Outreach          │  CRM              
  │  Analytics       │  Knowledge         │
  ▼
Shared Memory Layer
  │  Short-term (Redis) + Long-term (PostgreSQL) + Semantic (pgvector)
  ▼
Knowledge Base (RAG)
  │  Retrieved context injected into agent prompts
  ▼
External Tools
  │  APIs, browser automation, database queries
  ▼
Response Composer
  │  Merge outputs, validate structure, check quality
  ▼
User (structured response + UI update)
```

---

## 4. Agent Types & Responsibilities

### 4.1 Supervisor Agent

The **Supervisor** is the entry point for all user interactions. It never performs deep work itself — it coordinates.

| Responsibility | Description |
|---------------|-------------|
| **Intent Classification** | Determine if request is lead search, outreach, CRM update, etc. |
| **Task Decomposition** | Break complex goals into discrete, parallelizable subtasks |
| **Agent Delegation** | Route tasks to the appropriate specialized agents |
| **Output Validation** | Check that returned data meets quality thresholds |
| **Retry Coordination** | Re-dispatch failed tasks with adjusted instructions |
| **Result Merging** | Combine outputs from multiple agents into one coherent response |

> ⚠️ The Supervisor never calls external APIs or databases directly — it only orchestrates.

---

### 4.2 Planner Agent

The **Planner** translates a user's goal into a structured execution plan.

| Responsibility | Description |
|---------------|-------------|
| **Goal Analysis** | Parse ICP or user intent into a machine-readable plan |
| **Step Definition** | Define ordered, parallelizable steps |
| **Agent Selection** | Choose which agents are needed and in what order |
| **Cost Estimation** | Estimate AI token cost and execution time |
| **Task Prioritization** | High-value leads first, deferred enrichment second |

**Output Format**

```json
{
  "planId": "plan_abc123",
  "goal": "Find Shopify fashion stores in US with poor mobile UX",
  "steps": [
    { "step": 1, "agent": "lead_discovery", "action": "search_google_maps", "params": {...} },
    { "step": 2, "agent": "lead_discovery", "action": "search_apollo", "params": {...} },
    { "step": 3, "agent": "website_audit", "action": "run_lighthouse", "parallel": true },
    { "step": 4, "agent": "contact_discovery", "action": "find_decision_makers", "parallel": true },
    { "step": 5, "agent": "company_research", "action": "generate_summary", "parallel": true }
  ],
  "estimatedLeads": 85,
  "estimatedMinutes": 40,
  "estimatedCredits": 120
}
```

---

### 4.3 Lead Discovery Agent

Searches multiple data sources and normalizes results into a consistent schema.

| Tool Used | Data Retrieved |
|-----------|---------------|
| SerpAPI / Bing | Company names, websites, locations |
| Apollo.io API | Company size, industry, funding, contacts |
| LinkedIn Scraper | Employee profiles, decision-maker titles |
| Google Maps API | Local businesses, ratings, categories |
| CSV Import | Bulk user-provided leads |

**Deduplication Logic**

1. Normalize domain (strip `www.`, trailing slashes, https)
2. Fuzzy match company names (Levenshtein ≤ 2 on normalized form)
3. Merge fields from multiple sources (prefer highest-confidence source)
4. Flag high-confidence duplicates for user confirmation

---

### 4.4 Company Research Agent

Deeply analyzes each discovered company to build a rich intelligence profile.

| Action | Output |
|--------|--------|
| Fetch company homepage | Rendered HTML + text content |
| Extract business description | 2–3 sentence summary |
| Identify service offerings | List of products/services |
| Detect technology stack | CMS, frameworks, analytics, hosting |
| Find competitors | Named alternatives in the same niche |
| Identify pain points | Problems the user's service could solve |
| Generate opportunities | Specific upsell angles |
| Generate sales angles | Personalized pitch framing |

**Tools Used**: Playwright (web fetch) + LLM (GPT-4o for analysis)

---

### 4.5 Contact Discovery Agent

Finds the right human decision-makers at each company.

| Action | Tool |
|--------|------|
| Title-based LinkedIn search | LinkedIn API / scraper |
| Email pattern generation | Domain + name heuristics |
| Email verification | Hunter.io, NeverBounce |
| Phone lookup | Apollo, Clearbit |
| Confidence scoring | Signal strength from multiple sources |

**Output per contact**

```json
{
  "name": "Sarah Chen",
  "title": "Co-Founder",
  "email": "sarah@trendythreads.com",
  "emailConfidence": 0.94,
  "linkedinUrl": "linkedin.com/in/sarahchen",
  "phone": "+1-512-555-0123",
  "isDecisionMaker": true,
  "decisionMakerScore": 92
}
```

---

### 4.6 Website Audit Agent

Runs automated multi-dimensional audits using Lighthouse and custom checks.

| Dimension | Tool | Metric |
|-----------|------|--------|
| Performance | Lighthouse | LCP, FID, CLS, TTFB, Speed Index |
| SEO | Lighthouse + custom | Meta, headings, schema, sitemap |
| Accessibility | Axe / Lighthouse | WCAG 2.1 AA violations |
| Security | Custom HTTP checks | SSL, HSTS, security headers |
| Mobile | Lighthouse Mobile | Responsive layout score |
| UX | LLM analysis | CTA quality, navigation, readability |
| Links | Custom crawler | Broken internal/external links |
| Tech detection | Wappalyzer | Stack, CMS, analytics tools |

**Audit Output Schema**

```json
{
  "url": "https://trendythreads.com",
  "overallScore": 52,
  "dimensions": {
    "performance": { "score": 38, "issues": ["LCP: 8.4s", "JS blocking main thread"] },
    "seo": { "score": 61, "issues": ["Missing meta on 12 pages"] },
    "accessibility": { "score": 72, "issues": ["Low contrast on nav"] },
    "security": { "score": 90, "issues": [] },
    "mobile": { "score": 42, "issues": ["Layout breaks at 375px"] }
  },
  "opportunities": ["Performance redesign = +30% conversions"],
  "salesAngle": "Their poor mobile experience is costing them daily revenue."
}
```

---

### 4.7 Outreach Agent

Generates personalized, channel-appropriate messages for every lead.

| Output | Based On |
|--------|---------|
| Cold email subject + body | Lead data + website audit + pain points |
| LinkedIn message | Professional tone + mutual connections |
| Follow-up sequence | Day 3/7/14 with different angles |
| WhatsApp message | Casual, concise, personal |
| Sales script | Structured for phone/video call |
| Meeting agenda | Post-meeting-book briefing |

**Personalization Variables Available**

`{{company_name}}` · `{{founder_name}}` · `{{industry}}` · `{{pain_point}}` · `{{website_score}}` · `{{top_issue}}` · `{{opportunity}}` · `{{est_deal_value}}`

---

### 4.8 CRM Agent

Keeps the CRM automatically updated as events occur across the platform.

| Trigger | Action |
|---------|--------|
| Lead saved | Create CRM record at "Lead" stage |
| Email sent | Log activity + update "Last Contacted" |
| Email replied | Move to "Contacted," create follow-up task |
| Meeting booked | Move to "Meeting Scheduled," create brief |
| Proposal sent | Move to "Proposal Sent" |
| Meeting completed | Summarize notes, create next-step task |

---

### 4.9 Analytics Agent

Continuously monitors campaign and business performance.

| Capability | Description |
|-----------|-------------|
| KPI Calculation | Open rate, reply rate, conversion rate |
| Trend Detection | Identify week-over-week changes |
| Anomaly Detection | Flag unusual drops or spikes |
| Optimization Suggestions | "Your Tuesday sends have 2× higher open rate" |
| Cohort Analysis | Compare performance across time periods |

---

### 4.10 Knowledge Agent

Provides grounded context to all other agents via RAG.

| Capability | Description |
|-----------|-------------|
| Document Retrieval | Fetch relevant internal docs, wikis, playbooks |
| CRM Note Search | Retrieve past conversation context for a company |
| Semantic Search | Find similar past proposals, emails, or scripts |
| Context Building | Compose a grounded context block for other agents |

---

## 5. Memory Architecture

Agents access four types of memory:

```
┌─────────────────────────────────────────────────────┐
│                   Memory Layers                     │
│                                                     │
│  Short-Term Memory (Redis TTL: session)             │
│  ├── Active conversation turns                      │
│  └── Current workflow state                         │
│                                                     │
│  Session Memory (Redis TTL: 24h)                    │
│  ├── Current task plan                              │
│  ├── Intermediate agent outputs                     │
│  └── Temporary working variables                    │
│                                                     │
│  Long-Term Memory (PostgreSQL)                      │
│  ├── User preferences and ICP                       │
│  ├── Organization settings                          │
│  ├── Campaign and outreach history                  │
│  └── All lead and company data                      │
│                                                     │
│  Semantic Memory (pgvector / Qdrant)                │
│  ├── Embedding index of all documents               │
│  ├── Lead profile embeddings                        │
│  └── Knowledge base chunks                         │
│                                                     │
│  Procedural Memory (PostgreSQL)                     │
│  ├── Standard operating procedures                  │
│  ├── Prompt templates (versioned)                   │
│  └── Workflow templates                             │
└─────────────────────────────────────────────────────┘
```

---

## 6. RAG Architecture

Retrieval-Augmented Generation ensures agents generate **grounded, accurate** outputs rather than hallucinating data.

```
Data Sources (documents, notes, emails, CRM data)
  │
  ▼
Document Processing
  │  (Clean, extract text, preserve structure)
  ▼
Chunking
  │  (Chunk size: 512 tokens, 20% overlap)
  ▼
Metadata Extraction
  │  → tenant_id, document_type, source, created_at, permissions
  ▼
Embedding Generation
  │  (OpenAI text-embedding-3-large or BGE-M3)
  ▼
Vector Database
  │  (pgvector or Qdrant, indexed by HNSW)
  ▼
Query (user question or agent context request)
  │
  ▼
Retriever
  │  (Top-K semantic search, filtered by tenant + permissions)
  ▼
Reranker
  │  (Cross-encoder reranking to improve precision)
  ▼
Context Builder
  │  (Compose retrieved chunks into formatted context block)
  ▼
LLM (with context injected into system prompt)
  │
  ▼
Grounded Response
```

> ⚠️ **Every retrieved chunk includes metadata:** `tenant_id`, `document_type`, `permissions`, `source`, `timestamp`, and `confidence_score`. Chunks from another tenant are never retrieved.

---

## 7. Knowledge Sources

The following source types are indexed into the RAG system:

| Source | Indexed As | Use Case |
|--------|-----------|---------|
| Internal Wiki | Documents | Company-specific procedures |
| CRM Notes | Notes | Context on a specific lead/company |
| Meeting Notes | Documents | Relationship history |
| Email Threads | Email objects | Past outreach context |
| Sales Playbooks | Documents | Industry-specific strategies |
| Proposals | Documents | Past proposal templates |
| Contracts | Documents | Legal reference (read-only) |
| FAQs | Documents | Support and product knowledge |
| Uploaded PDFs | Documents | Any user-provided content |
| Website Content | Web pages | Company's own published content |
| Marketing Assets | Documents | Branded content and case studies |

---

## 8. Embedding Strategy

### What Gets Embedded

| Data Type | When Embedded |
|-----------|--------------|
| Lead profiles | On creation/update |
| Company summaries | After Company Research Agent runs |
| Website audit reports | After Website Audit Agent runs |
| Emails (sent/received) | On send/receive |
| CRM notes | On creation |
| Meeting summaries | After meeting completion |
| Prompt templates | When added to registry |
| Knowledge documents | On upload/creation |

### Recommended Models

| Model | Use Case |
|-------|---------|
| `text-embedding-3-large` | Highest quality (production default) |
| `text-embedding-3-small` | Cost-effective for high-volume tasks |
| `BAAI/bge-m3` | Self-hosted for data-residency requirements |
| `nomic-embed-text` | Open-source alternative |
| `jina-embeddings-v3` | Multilingual support |

> 💡 **Versioning:** All embeddings are versioned. When upgrading models, re-embed all documents safely without breaking existing indexes by maintaining a version column on all embedding records.

---

## 9. Vector Database

### Recommended Configuration

| Deployment | Database | Notes |
|-----------|---------|-------|
| **Default (MVP)** | PostgreSQL + pgvector | Simplest — no extra infra |
| **Enterprise** | Qdrant | High-performance, dedicated vector search |
| **Large Scale** | Weaviate | Multi-tenant, billions of vectors |
| **Cloud-managed** | Pinecone | Managed, no ops overhead |

### Vector Collections (namespaces)

| Collection | Contents |
|-----------|---------|
| `organizations` | Org-level settings and descriptions |
| `users` | User profiles and preferences |
| `leads` | Enriched lead profiles |
| `companies` | Company intelligence summaries |
| `emails` | Email content embeddings |
| `meetings` | Meeting notes and summaries |
| `crm_notes` | CRM activity notes |
| `knowledge` | All knowledge base documents |
| `website_audits` | Audit reports |
| `templates` | Email, workflow, and prompt templates |
| `playbooks` | Sales strategy documents |

---

## 10. LangGraph Workflow

LangGraph models the agent pipeline as a **directed graph** where each node is an agent step and edges define the execution order.

```
User Prompt
  │
  ▼
[Supervisor Node]
  │  → Classifies intent, routes to planner
  ▼
[Planner Node]
  │  → Creates task graph, estimates cost
  ▼
[Human Approval Gate] ← User reviews plan in UI
  │  (Approved → continue / Rejected → loop back to Planner)
  ▼
[Task Graph Executor]
  │  → Dispatches nodes in topological order
  ├──► [Lead Discovery Node] ────────────────────┐
  ├──► [Company Research Node] (parallel)         │
  ├──► [Website Audit Node] (parallel)            │ → merge
  ├──► [Contact Discovery Node] (parallel)        │
  └──► [Knowledge Context Node] (parallel) ───────┘
                                                  │
  ▼                                               │
[Reviewer Node] ←───────────────────────────────-┘
  │  → Validates output quality, checks completeness
  ▼
[Response Builder Node]
  │  → Formats final structured response
  ▼
User (via API + WebSocket)
```

**Every node produces a strongly typed output** that is automatically validated before being passed to the next node.

---

## 11. Tool Calling System

Agents call **deterministic, typed tools** instead of generating data from memory.

### Tool Design Principles

| Principle | Description |
|-----------|-------------|
| **Deterministic** | Same input always returns same output |
| **Typed Schema** | Input and output defined with Zod/JSON Schema |
| **Idempotent** | Safe to call multiple times without side effects |
| **Retryable** | Built-in retry with exponential backoff |
| **Timeout** | Hard timeout on every tool call (default: 30s) |
| **Logged** | Every call and response logged with `toolCallId` |

### Tool Categories

| Category | Tools |
|----------|-------|
| **Lead Search** | `searchGoogleMaps`, `searchApollo`, `searchLinkedIn` |
| **Web** | `fetchWebsite`, `runLighthouse`, `detectTechnologies` |
| **Email** | `findEmail`, `verifyEmail`, `sendEmail` |
| **CRM** | `createLead`, `updateDeal`, `createTask`, `logActivity` |
| **Calendar** | `createMeeting`, `getAvailability` |
| **Storage** | `uploadFile`, `generatePresignedUrl` |
| **Vector Search** | `semanticSearch`, `findSimilarLeads` |
| **Analytics** | `getCampaignMetrics`, `getLeadConversionRate` |
| **Payments** | `createInvoice`, `getSubscriptionStatus` |
| **Notifications** | `sendSlackMessage`, `sendEmailNotification` |
| **Internal APIs** | `getOrganizationContext`, `getUserPreferences` |
| **External APIs** | `callWebhook`, `triggerZapier` |

### Example Tool Definition

```typescript
const searchApolloTool = tool({
  name: "search_apollo",
  description: "Search Apollo.io for B2B companies matching given criteria",
  schema: z.object({
    industry: z.string(),
    location: z.string(),
    employeeMin: z.number().optional(),
    employeeMax: z.number().optional(),
    limit: z.number().max(100).default(50),
  }),
  execute: async (params) => {
    // Deterministic API call — no LLM involved
    const results = await apolloClient.searchCompanies(params);
    return {
      companies: results.companies,
      total: results.total,
      source: "apollo",
      fetchedAt: new Date().toISOString(),
    };
  },
});
```

---

## 12. Agent Communication Protocol

Agents communicate via **typed message contracts** — not raw text.

### Message Schema

```typescript
interface AgentMessage {
  taskId: string;           // Unique task identifier
  agentId: string;          // Which agent produced this
  organizationId: string;   // Tenant identifier
  workflowId: string;       // Parent workflow run
  priority: "low" | "medium" | "high" | "critical";
  context: Record<string, unknown>;  // Input context
  toolResults: ToolCallResult[];     // Tool call outputs
  confidence: number;       // 0.0–1.0 output quality estimate
  nextAction: string | null;         // Suggested next step
  status: "pending" | "running" | "completed" | "failed";
  createdAt: string;        // ISO timestamp
  completedAt?: string;
}
```

All messages are:
- **Persisted** to PostgreSQL for replay and debugging
- **Published** to BullMQ for async consumption
- **Traced** via OpenTelemetry with parent span linkage

---

## 13. Prompt Management

All prompts are managed through a **central prompt registry** — never hardcoded in application files.

### Prompt Record Schema

```typescript
interface PromptRecord {
  id: string;
  name: string;             // e.g., "lead_discovery_system_prompt"
  agentType: string;        // Which agent uses it
  version: number;          // Increment on every change
  content: string;          // The prompt template
  variables: string[];      // Required template variables
  expectedOutputSchema: object;  // JSON Schema for the output
  owner: string;            // Team member responsible
  changelog: string;        // What changed in this version
  isActive: boolean;        // Only one version active per agent
  createdAt: string;
}
```

### Prompt Types

| Type | Description |
|------|-------------|
| `system_prompt` | Agent persona and behavior definition |
| `agent_prompt` | Task-specific instructions per agent |
| `task_prompt` | One-off task instructions |
| `workflow_prompt` | Multi-step workflow coordination |
| `evaluation_prompt` | Quality assessment of agent outputs |

---

## 14. Human Approval Gates

The platform enforces **human review checkpoints** before high-impact actions:

| Action | Gate Type | UI Presentation |
|--------|-----------|----------------|
| Starting a lead search campaign | Plan review | Plan summary card with edit/approve buttons |
| Sending emails to leads | Campaign review | Preview all emails before batch send |
| Publishing a campaign | Final confirmation | Summary of recipients, schedule, cost |
| Exporting lead data | Export confirmation | Shows record count and fields included |
| Deleting records (bulk) | Confirmation dialog | Irreversible action warning |
| Executing high-cost AI jobs | Credit warning | Shows estimated cost before proceeding |
| Triggering external webhooks | Action review | Shows payload preview |

Human approvals are logged in the audit trail with the approving user and timestamp.

---

## 15. Observability & Tracing

Every agent execution is fully observable:

### What is Tracked

| Metric | Tool |
|--------|------|
| Agent execution time | OpenTelemetry + Grafana |
| LLM latency per call | Langfuse |
| Token usage (input + output) | Langfuse |
| Cost per agent per tenant | Langfuse |
| Tool call success/failure rates | OpenTelemetry |
| Retry count and reason | BullMQ metrics |
| Hallucination detection | Langfuse evaluations |
| User feedback on outputs | In-app rating |
| Workflow completion rate | Custom metrics |

### Trace Structure

```
TraceId: trace_xyz789
  │
  ├── Span: supervisor.classify_intent (12ms)
  ├── Span: planner.create_plan (340ms)
  │     └── LLM Call: gpt-4o (310ms, 1,200 tokens, $0.004)
  ├── Span: lead_discovery.search_apollo (2,100ms)
  │     └── Tool Call: search_apollo (2,080ms)
  ├── Span: website_audit.run_lighthouse (8,400ms)
  │     └── Tool Call: fetchWebsite (6,200ms)
  │     └── Tool Call: runLighthouse (2,200ms)
  └── Span: response_builder.compose (180ms)
        └── LLM Call: gpt-4o-mini (160ms, 800 tokens, $0.0004)
```

---

## 16. Security & Guardrails

### Tenant Isolation

Every agent operation includes `organizationId` as a mandatory parameter. The system enforces this at:

1. **API level** — JWT decoded, `organizationId` extracted
2. **Agent level** — Passed as mandatory context to every agent
3. **Tool level** — Every database and vector query filtered by `organizationId`
4. **Storage level** — MinIO bucket paths namespaced by org

### Prompt Security

| Threat | Mitigation |
|--------|-----------|
| Prompt injection | Input sanitization + system prompt hardening |
| Data exfiltration | Output validation — no cross-tenant data in responses |
| Model abuse | Per-org credit limits + rate limiting |
| Jailbreaking | Content filtering on all LLM outputs |
| Cost attacks | Hard token limits per request |

### Tool Permission Policies

Tools are categorized by risk level and require appropriate permissions:

| Tool Category | Required Permission |
|--------------|-------------------|
| Read-only lookups | `lead:read` |
| Create/update leads | `lead:write` |
| Send emails | `campaign:send` (+ human approval) |
| Delete records | `admin:delete` (+ human approval) |
| Export data | `data:export` (+ human approval) |
| Call external webhooks | `integration:write` (+ human approval) |

---

## 17. AI Tech Stack Summary

| Component | Technology | Notes |
|-----------|-----------|-------|
| **Agent Framework** | LangGraph | Stateful workflow graphs |
| **LLM SDK** | OpenAI Agents SDK / LangChain | Provider abstraction |
| **LLM — Primary** | OpenAI GPT-4o | Complex reasoning tasks |
| **LLM — Fast** | GPT-4o-mini | High-volume, lower-cost tasks |
| **LLM — Alternative** | Anthropic Claude 3.5 Sonnet | Backup provider |
| **LLM — Local** | Ollama / vLLM | Data-residency requirements |
| **Embeddings** | text-embedding-3-large | Default production |
| **Embeddings (self-hosted)** | BGE-M3 / Nomic Embed | On-premise option |
| **RAG** | LangChain Retrieval + LangGraph | Retrieval pipeline |
| **Vector DB (default)** | PostgreSQL + pgvector | Included in primary DB |
| **Vector DB (enterprise)** | Qdrant | Dedicated high-performance |
| **AI Observability** | Langfuse | LLM tracing and evaluation |
| **Workflow Engine** | LangGraph + BullMQ | State machine + job queue |
| **Web Automation** | Playwright / Puppeteer | Website scanning |
| **API** | Node.js + Fastify | Agent API endpoints |
| **Frontend** | Next.js | AI chat UI, real-time updates |
| **Monitoring** | OpenTelemetry + Grafana | Distributed tracing |

---

## 18. Development Standards

All agent and AI code must follow these standards:

| Standard | Requirement |
|----------|------------|
| **Single Responsibility** | One agent = one domain. No overlap. |
| **Typed Tool Interfaces** | All tools use Zod schemas for input and output |
| **Structured JSON Outputs** | No free-form text returned from agents |
| **Versioned Prompts** | Every prompt change increments a version number |
| **Event Sourcing** | All workflow state changes emitted as events |
| **Retry Policy** | Exponential backoff with jitter on all tool calls |
| **Evaluation Pipelines** | Automated prompt regression tests on CI |
| **Regression Tests** | Agent behavior tested against golden datasets |
| **Cost Budgets** | Hard token and dollar limits per agent run |
| **Monitoring** | Every agent registered in observability system |
| **Feedback Loops** | User ratings feed back into prompt quality scores |

---

## 19. Model Gateway

A **Model Gateway** sits between agents and LLM providers. It abstracts provider differences and intelligently routes each request to the most appropriate model based on task complexity, latency requirements, and cost budget.

### Routing Decision Matrix

| Task Type | Complexity | Latency | Recommended Model |
|-----------|-----------|---------|------------------|
| Intent classification | Low | <100ms | GPT-4o-mini / Claude Haiku |
| Company summary generation | Medium | <5s | GPT-4o-mini |
| Deep research + reasoning | High | <30s | GPT-4o / Claude 3.5 Sonnet |
| Proposal drafting | High | <60s | GPT-4o / Claude 3.5 Sonnet |
| Embedding generation | — | <500ms | text-embedding-3-small |
| Bulk enrichment | Low-Medium | Background | GPT-4o-mini (batch API) |
| Data-residency tenants | Any | Any | Ollama / vLLM (local) |

### Gateway Architecture

```
Agent Request
  │
  ▼
Model Gateway
  ├── [Task Classifier]   → Determines complexity tier
  ├── [Cost Estimator]    → Checks org credit balance
  ├── [Latency Checker]   → Reads current provider latency
  ├── [Provider Selector] → Picks optimal model + provider
  ├── [Rate Limiter]      → Enforces per-org token limits
  └── [Fallback Handler]  → On failure: tries next provider
          │
          ▼
  ┌───────────────────────────────┐
  │  Provider Adapters            │
  ├── OpenAI (GPT-4o, mini)       │
  ├── Anthropic (Claude 3.5)      │
  ├── Google (Gemini 1.5 Pro)     │
  └── Local (Ollama / vLLM)       │
  └───────────────────────────────┘
          │
          ▼
  Structured Response (normalized schema)
  + Usage Metrics → Langfuse
```

### Gateway Configuration Schema

```typescript
interface ModelGatewayConfig {
  defaultProvider: "openai" | "anthropic" | "gemini" | "local";
  fallbackChain: string[];          // Ordered list of fallback providers
  taskRoutingRules: {
    taskType: string;
    preferredModel: string;
    maxTokens: number;
    maxCostPerCall: number;         // USD hard cap
    timeoutMs: number;
  }[];
  orgOverrides: {
    organizationId: string;
    forcedProvider?: string;        // For data-residency requirements
    creditLimit: number;            // Monthly token budget
  }[];
}
```

### Key Capabilities

| Capability | Description |
|-----------|-------------|
| **Smart Routing** | Complexity-based model selection per task |
| **Cost Control** | Hard per-call and per-org monthly budgets |
| **Failover** | Automatic provider fallback on error or timeout |
| **Caching** | Identical prompts served from Redis cache (1h TTL) |
| **Rate Limiting** | Token-per-minute limits per organization |
| **Unified Response** | Normalized output schema regardless of provider |
| **Audit Trail** | Every LLM call logged with provider, model, cost, latency |

---

## 20. Agent Registry

The **Agent Registry** is a catalog of every agent in the system — their capabilities, versions, required permissions, resource budgets, and current health status.

### Registry Record Schema

```typescript
interface AgentRegistryEntry {
  id: string;                       // Unique agent identifier
  name: string;                     // Human-readable name
  version: string;                  // Semantic version (e.g., "2.1.0")
  description: string;              // What this agent does
  capabilities: string[];           // List of capability tags
  requiredTools: string[];          // Tool names this agent needs
  requiredPermissions: string[];    // RBAC permissions required
  inputSchema: JsonSchema;          // Zod-compatible input schema
  outputSchema: JsonSchema;         // Expected output structure
  resourceBudget: {
    maxTokensPerRun: number;
    maxCostUsd: number;
    maxExecutionMs: number;
    maxRetries: number;
  };
  routing: {
    preferredModel: string;
    fallbackModel: string;
    supportsStreaming: boolean;
    supportsBatch: boolean;
  };
  health: {
    status: "healthy" | "degraded" | "offline";
    successRate: number;            // Last 1000 runs
    avgLatencyMs: number;
    lastChecked: string;
  };
  metadata: {
    owner: string;
    createdAt: string;
    updatedAt: string;
    changelog: string;
  };
}
```

### Registered Agents

| Agent ID | Version | Capabilities | Status |
|----------|---------|-------------|--------|
| `supervisor` | 1.0 | orchestration, delegation | healthy |
| `planner` | 1.0 | planning, estimation | healthy |
| `lead_discovery` | 1.2 | search, dedup, normalize | healthy |
| `company_research` | 1.1 | web-scrape, summarize | healthy |
| `contact_discovery` | 1.0 | linkedin, email-find | healthy |
| `website_audit` | 1.3 | lighthouse, seo, ux | healthy |
| `outreach` | 1.1 | email-gen, linkedin-gen | healthy |
| `crm` | 1.0 | pipeline, tasks, notes | healthy |
| `analytics` | 1.0 | metrics, trends, kpi | healthy |
| `knowledge` | 1.0 | rag, retrieval, context | healthy |

### Registry API Endpoints

```
GET  /registry/agents              → List all agents with health
GET  /registry/agents/:id          → Get specific agent details
POST /registry/agents/:id/invoke   → Invoke an agent by ID
GET  /registry/agents/:id/health   → Get real-time health metrics
PUT  /registry/agents/:id          → Update agent config (admin only)
```

---

## 21. MCP Integration Layer

The **Model Context Protocol (MCP)** integration layer allows agents to securely access external systems through standardized connectors. MCP defines a universal protocol for exposing tools, resources, and prompts to AI models.

### Architecture Overview

```
Agent (LLM)
  │
  ▼
MCP Client (built into agent runtime)
  │
  ├──► MCP Server: CRM Connector
  │      └── Tools: read_lead, update_deal, create_task
  │      └── Resources: leads://{orgId}/{leadId}
  │
  ├──► MCP Server: File System Connector
  │      └── Tools: read_file, write_file, list_directory
  │      └── Resources: file://{orgId}/{path}
  │
  ├──► MCP Server: Calendar Connector
  │      └── Tools: get_availability, create_event
  │      └── Resources: calendar://{userId}/{date}
  │
  ├──► MCP Server: Knowledge Base Connector
  │      └── Tools: search_knowledge, get_document
  │      └── Resources: kb://{orgId}/{docId}
  │
  ├──► MCP Server: Email Connector
  │      └── Tools: send_email, get_thread, list_inbox
  │      └── Resources: email://{userId}/{threadId}
  │
  └──► MCP Server: Analytics Connector
         └── Tools: get_metrics, run_query
         └── Resources: analytics://{orgId}/{report}
```

### MCP Server Configuration

```typescript
interface MCPServerConfig {
  id: string;                       // Server identifier
  name: string;                     // Display name
  transport: "stdio" | "sse" | "websocket";
  endpoint?: string;                // For network transports
  authMethod: "none" | "api-key" | "oauth" | "jwt";
  scopes: string[];                 // Required OAuth scopes
  tenantIsolated: boolean;          // Must filter by organizationId
  tools: MCPToolDefinition[];       // Exposed tools
  resources: MCPResourceDefinition[]; // Accessible resources
  rateLimits: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
}
```

### Security Rules for MCP

| Rule | Enforcement |
|------|-------------|
| Every MCP call includes `organizationId` | Enforced at MCP middleware level |
| Tool invocations require RBAC permission | Checked before forwarding to MCP server |
| High-risk tools require human approval | Pause + notify user before execution |
| All MCP calls are logged | Persisted to audit log with full payload |
| MCP servers run in isolated containers | No host-level access |

### Native MCP Servers (Built-In)

| Server | Exposes | Used By |
|--------|---------|--------|
| `mcp-crm` | Lead/Deal/Task CRUD | CRM Agent |
| `mcp-knowledge` | RAG search, doc retrieval | Knowledge Agent |
| `mcp-email` | Send, read, thread | Outreach Agent |
| `mcp-calendar` | Events, availability | CRM Agent |
| `mcp-storage` | Files, presigned URLs | All agents |
| `mcp-analytics` | Metrics, reports | Analytics Agent |

### External MCP Servers (Community/Third-Party)

| Server | Provider | Purpose |
|--------|---------|--------|
| `mcp-hubspot` | HubSpot | CRM sync |
| `mcp-github` | GitHub | Code context |
| `mcp-notion` | Notion | Workspace docs |
| `mcp-slack` | Slack | Team comms |
| `mcp-google-drive` | Google | Cloud documents |

---

## 22. Evaluation Framework

The **Evaluation Framework** continuously measures agent quality and prevents regressions when prompts, models, or tools are updated.

### Evaluation Dimensions

| Dimension | What is Measured | Target |
|-----------|-----------------|--------|
| **Answer Quality** | LLM-judged correctness vs golden answers | > 90% |
| **Tool-Call Accuracy** | Correct tool selected + correct parameters | > 95% |
| **Retrieval Precision** | Retrieved chunks relevant to query (Precision@K) | > 0.80 |
| **Retrieval Recall** | All relevant chunks retrieved (Recall@K) | > 0.75 |
| **Latency** | P50, P95, P99 response times | P95 < 5s |
| **Cost** | Average cost per agent run | < $0.05 |
| **Hallucination Rate** | Responses containing fabricated facts | < 2% |
| **Schema Compliance** | Outputs matching expected JSON schema | 100% |

### Evaluation Pipeline

```
Code Change / Prompt Update / Model Upgrade
  │
  ▼
CI Trigger (GitHub Actions)
  │
  ▼
Golden Dataset Runner
  │  → Runs 100–500 pre-labeled test cases per agent
  ▼
Evaluator LLM (GPT-4o as judge)
  │  → Scores each output on quality rubric
  ▼
Metrics Aggregator
  │  → Computes pass rates, costs, latencies
  ▼
Comparison vs Baseline
  │  → Flags regressions (>5% quality drop)
  ▼
[PASS] → Auto-merge to main
[FAIL] → Block merge + notify author
```

### Golden Dataset Structure

```typescript
interface EvalCase {
  id: string;
  agentId: string;                  // Which agent to evaluate
  input: Record<string, unknown>;   // Agent input
  expectedOutput: Record<string, unknown>;  // Ground truth
  evaluationCriteria: {
    metric: "exact_match" | "llm_judge" | "schema_check" | "contains";
    threshold: number;
    rubric?: string;                // For llm_judge metric
  }[];
  tags: string[];                   // e.g., ["regression", "edge_case"]
  addedBy: string;
  addedAt: string;
}
```

### Evaluation Triggers

| Trigger | Scope | Action |
|---------|-------|--------|
| PR opened | Changed agents only | Run lightweight eval (fast suite) |
| Merge to main | All agents | Run full eval suite |
| Prompt version bump | Affected agent | Full eval for that agent |
| Model change | All agents using that model | Full eval |
| Weekly scheduled | All agents | Full regression suite |

### Evaluation Storage (Langfuse)

All evaluation results are stored in Langfuse with:
- Input, output, expected output
- Score per criterion
- Model used + token cost
- Pass/fail status
- Trend over time (improving vs degrading)

---

## 23. Hybrid Retrieval

**Hybrid Retrieval** combines three retrieval methods to maximize the quality of context provided to agents — far superior to either vector search or keyword search alone.

### Retrieval Methods

| Method | Best At | Technology |
|--------|---------|----------|
| **Dense Vector Search** | Semantic similarity, paraphrase matching | pgvector / Qdrant HNSW |
| **Sparse BM25 Search** | Exact terms, names, IDs, codes | Elasticsearch / Meilisearch |
| **Reranking** | Re-scoring top-K candidates for precision | Cohere Rerank / BGE Reranker |

### Hybrid Retrieval Pipeline

```
User Query / Agent Context Request
  │
  ▼
Query Preprocessor
  │  → Clean, expand, extract key terms
  ▼
Parallel Retrieval (concurrent)
  ├──► Dense Retrieval (Top-20)
  │      → Embed query → vector search pgvector/Qdrant
  │      → Filtered by: organizationId, doc_type, permissions
  │
  └──► Sparse Retrieval BM25 (Top-20)
         → Tokenize query → BM25 scoring → Meilisearch
         → Filtered by: organizationId, doc_type
  │
  ▼
Reciprocal Rank Fusion (RRF)
  │  → Merge and re-rank results from both pipelines
  │  → Score = Σ 1/(k + rank_i) for each source
  ▼
Cross-Encoder Reranker (Top-10 → Top-5)
  │  → Cohere Rerank v3 or BGE Reranker
  │  → Scores query-document relevance directly
  ▼
Context Builder
  │  → Select top-5 chunks
  │  → Append metadata (source, date, confidence)
  │  → Format as structured context block
  ▼
LLM with Grounded Context
```

### RRF Score Formula

```
RRF_score(doc) = Σ_i [ 1 / (k + rank_i(doc)) ]

Where:
  k  = 60  (smoothing constant)
  i  = each retrieval source (dense, sparse)
  rank_i = position of document in source i's results
```

### Retrieval Configuration

```typescript
interface HybridRetrievalConfig {
  topKDense: number;                // How many dense results (default: 20)
  topKSparse: number;               // How many BM25 results (default: 20)
  topKAfterRRF: number;             // After fusion (default: 10)
  topKAfterRerank: number;          // Final context (default: 5)
  rerankModel: "cohere-rerank-v3" | "bge-reranker-large" | "none";
  filters: {
    organizationId: string;         // REQUIRED — always applied
    documentTypes?: string[];       // e.g., ["crm_note", "playbook"]
    dateRange?: { from: string; to: string };
    minConfidence?: number;         // Minimum chunk confidence score
  };
}
```

### When to Use Each Mode

| Query Type | Best Mode |
|-----------|----------|
| "What are Sarah Chen's pain points?" | Dense (semantic) |
| "Find deal #PRO-2024-0182" | Sparse (exact ID match) |
| "Shopify agencies with poor mobile UX" | Hybrid + Rerank |
| "What did we discuss in last week's meeting?" | Hybrid + Rerank |
| "Our pricing page copy" | Hybrid + Rerank |

---

## 24. Knowledge Synchronization Pipeline

The **Knowledge Sync Pipeline** continuously ingests documents from all connected sources, processes them, and keeps the vector index up-to-date with incremental updates — without re-processing unchanged content.

### Supported Source Connectors

| Source | Connector | Sync Mode | Frequency |
|--------|-----------|-----------|----------|
| **CRM Notes** | Internal PostgreSQL | Event-driven | Real-time |
| **Email Threads** | Gmail / Outlook OAuth | Incremental poll | Every 15min |
| **Google Drive** | Google Drive API | Webhook + poll | Real-time |
| **Notion** | Notion API | Webhook | Real-time |
| **Confluence** | Confluence REST API | Incremental | Every 1h |
| **GitHub** | GitHub API | Webhook | On commit |
| **Support Tickets** | Internal DB | Event-driven | Real-time |
| **Uploaded Files** | MinIO events | Event-driven | On upload |
| **Website Audits** | Internal DB | Event-driven | On completion |
| **Meeting Notes** | Internal DB | Event-driven | On save |

### Pipeline Architecture

```
Source Connector
  │  (webhook / poll / event stream)
  ▼
Change Detector
  │  → Compute content hash
  │  → Compare with stored hash
  │  → Skip if unchanged (idempotent)
  ▼
Document Extractor
  │  → PDF: PyMuPDF / pdfplumber
  │  → DOCX: mammoth
  │  → HTML: readability + cheerio
  │  → CSV: papaparse
  │  → Plain text: direct
  ▼
Metadata Extractor
  │  → organizationId, userId, source, docType
  │  → created_at, updated_at, permissions, tags
  ▼
Chunker
  │  → Semantic chunking (prefer paragraph boundaries)
  │  → Chunk size: 512 tokens, 20% overlap
  │  → Preserve: headings, tables, code blocks intact
  ▼
Embedder
  │  → text-embedding-3-large (OpenAI)
  │  → BGE-M3 (self-hosted fallback)
  │  → Batch: up to 2,048 chunks per API call
  ▼
Vector Upsert
  │  → pgvector or Qdrant
  │  → Update existing chunks if content changed
  │  → Delete orphaned chunks (source doc deleted)
  ▼
BM25 Index Update
  │  → Meilisearch document upsert
  │  → Incremental — does not rebuild full index
  ▼
Sync Record
     → Log sync result: chunks added/updated/deleted
     → Update last_synced_at timestamp
     → Alert on errors
```

### Incremental Update Strategy

```typescript
interface SyncRecord {
  sourceId: string;                 // Unique source document ID
  organizationId: string;
  contentHash: string;              // SHA-256 of raw content
  chunkCount: number;               // How many chunks indexed
  embeddingModel: string;           // Which model was used
  embeddingVersion: number;         // For safe model upgrades
  lastSyncedAt: string;
  syncStatus: "synced" | "pending" | "error";
  errorMessage?: string;
}
```

**Hash-based deduplication ensures:**
- Unchanged documents are never re-embedded (saves cost)
- Deleted documents trigger chunk cleanup
- Updated documents replace only changed chunks
- Model upgrades rebuild index safely via version column

### Sync Queue Configuration

| Queue | Priority | Workers | Processing |
|-------|---------|---------|----------|
| `sync.realtime` | Critical | 4 | CRM notes, email, webhooks |
| `sync.scheduled` | Medium | 2 | Notion, Confluence, Drive |
| `sync.bulk` | Low | 1 | Initial full-index builds |
| `sync.reindex` | Low | 1 | Model upgrade re-indexing |

### Knowledge Graph (Optional — v2)

For advanced deployments, a **Knowledge Graph** layer sits on top of the vector index:

```
Entities extracted from documents
  → Company ←→ Person ←→ Deal ←→ Meeting ←→ Document
  → Stored as graph (Neo4j or PostgreSQL with recursive CTEs)
  → Enables: "What meetings involved TrendyThreads?"
             "Which leads came from the same referral?"
             "Who worked on proposals mentioning Shopify?"
```

---

← [Previous: System Architecture](./03-system-architecture.md) · [Back to Index](./README.md) · [Next: Project Setup →](./05-project-setup.md)
