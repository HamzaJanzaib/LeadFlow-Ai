# 02 — Application Flow

> **LeadFlow AI** · Complete User Journey & System Flow
> Version 1.0 · Last Updated: 2026-06-27

---

## Table of Contents

1. [High-Level User Journey](#1-high-level-user-journey)
2. [Registration & Onboarding Flow](#2-registration--onboarding-flow)
3. [AI Onboarding Conversation](#3-ai-onboarding-conversation)
4. [AI Planning Stage](#4-ai-planning-stage)
5. [AI Tool-Calling Pipeline](#5-ai-tool-calling-pipeline)
6. [Lead Discovery Flow](#6-lead-discovery-flow)
7. [Lead Enrichment](#7-lead-enrichment)
8. [Website Intelligence Flow](#8-website-intelligence-flow)
9. [AI Lead Scoring](#9-ai-lead-scoring)
10. [Lead Review & Actions](#10-lead-review--actions)
11. [Outreach Campaign Flow](#11-outreach-campaign-flow)
12. [AI Follow-Up Sequences](#12-ai-follow-up-sequences)
13. [CRM Pipeline](#13-crm-pipeline)
14. [Meeting Preparation](#14-meeting-preparation)
15. [Proposal Generation](#15-proposal-generation)
16. [Post-Sale Automation](#16-post-sale-automation)
17. [Review & Referral](#17-review--referral)
18. [Analytics Dashboard](#18-analytics-dashboard)

---

## 1. High-Level User Journey

This is the complete, end-to-end path a user takes from first visit to closing deals and generating referrals:

```
Visitor
  │
  ▼
Marketing Website
  │  (Value proposition, social proof, pricing)
  ▼
Sign Up
  │  (Email + password, or social login)
  ▼
Email Verification
  │
  ▼
Create Organization
  │  (Company name, workspace name)
  ▼
Choose Subscription Plan
  │  (Free trial or paid plan via Stripe)
  ▼
Create Workspace
  │
  ▼
Invite Team Members
  │  (Optional — can skip)
  ▼
AI Onboarding
  │  (Conversational setup — describes ideal customer)
  ▼
Dashboard
  │
  ├──► Describe Ideal Customer Profile (ICP)
  │
  ▼
AI Generates Search Plan
  │  (User reviews and approves or edits)
  ▼
AI Collects Leads
  │  (Multi-source: Google Maps, Apollo, LinkedIn, etc.)
  ▼
Lead Enrichment
  │  (Technologies, decision makers, contacts, revenue)
  ▼
Lead Scoring
  │  (AI-computed 0–100 score with explanation)
  ▼
Website Analysis
  │  (SEO, performance, UX, security audit per lead)
  ▼
AI Recommendations
  │  (Sales angles, pain points, opportunities)
  ▼
Lead Review
  │  (User approves, tags, assigns, or archives)
  ▼
CRM
  │  (Lead moves into pipeline stage)
  ▼
Campaign Builder
  │  (Select leads, choose strategy, generate messages)
  ▼
Personalized Outreach
  │  (Email, LinkedIn, WhatsApp with AI-generated copy)
  ▼
Follow-Up Automation
  │  (Day 3, 7, 14 sequences — auto-stops on reply)
  ▼
Meeting Booking
  │  (Calendar integration, AI meeting prep brief)
  ▼
Proposal Generation
  │  (AI-drafted scope, pricing, contract)
  ▼
Deal Won ✅
  │
  ▼
Post-Sale Automation
  │  (Client workspace, welcome email, project setup)
  ▼
Review Request → Referral Campaign
  │
  ▼
Analytics & Reporting
```

---

## 2. Registration & Onboarding Flow

### Step-by-Step

| Step | Action | Notes |
|------|--------|-------|
| **1** | User visits marketing site | SEO-optimized landing page with clear CTA |
| **2** | Clicks "Start Free Trial" | Redirects to `/signup` |
| **3** | Enters name, email, password | Or uses Google / GitHub login |
| **4** | Email verification sent | Confirm via link in inbox |
| **5** | Redirect to Organization setup | Prompted to enter company name |
| **6** | Creates Workspace | Default workspace is created |
| **7** | Chooses subscription | Free trial auto-selected; upgrade option shown |
| **8** | Invites team members | Optional; can be done later |
| **9** | Selects industry | Used to personalize AI recommendations |
| **10** | Selects business type | Agency, SaaS, Freelancer, etc. |
| **11** | Connects email | Gmail or Outlook OAuth for outreach |
| **12** | Connects calendar | Google Calendar or Outlook Calendar |
| **13** | Connects existing CRM (Optional) | HubSpot, Salesforce sync |
| **14** | Enters AI Onboarding | Conversational ICP builder |
| **15** | Arrives at Dashboard | Personalized based on onboarding answers |

---

## 3. AI Onboarding Conversation

Instead of lengthy forms, the platform starts a **natural language conversation** to build the user's **Ideal Customer Profile (ICP)**.

### Example Conversation

```
AI:   "Welcome! What type of customers are you looking for?"

User: "I build Shopify stores for fashion brands."

AI:   "Great! Which countries should we focus on?"

User: "United States, Canada, and Australia."

AI:   "What company size works best for your services?"

User: "Anywhere from 5 to 50 employees."

AI:   "What specific problems do you help your clients solve?"

User: "Improve conversion rates, redesign outdated stores, and increase sales."

AI:   "What is your average project value?"

User: "$5,000"

AI:   "Perfect. I've built your Ideal Customer Profile. 
       I'll now search for fashion brand Shopify stores in 
       US, CA, and AU with 5–50 employees who have low-converting 
       or poorly designed storefronts. Shall I start?"
```

### What the AI Creates

After the conversation, the system creates a structured **ICP record** stored per-workspace:

```json
{
  "industry": "E-commerce / Fashion",
  "platform": "Shopify",
  "locations": ["US", "CA", "AU"],
  "employeeRange": { "min": 5, "max": 50 },
  "painPoints": ["low conversion rate", "outdated design", "poor mobile UX"],
  "avgDealValue": 5000,
  "targetDecisionMaker": "Founder / Head of E-commerce",
  "signals": ["recently launched", "using outdated themes", "low page speed"]
}
```

This ICP is reusable and can be refined over time.

---

## 4. AI Planning Stage

Before collecting any leads, the **Planner Agent** analyzes the ICP and creates an **execution plan** for user review.

### Example Plan Output

```
Research Plan for: Fashion Shopify Stores (US/CA/AU)
──────────────────────────────────────────────────────
Step 1  Search Google for fashion brand Shopify stores
Step 2  Cross-reference Apollo for company data
Step 3  Detect outdated Shopify themes via website analysis
Step 4  Find store owners / e-commerce managers
Step 5  Collect verified email addresses
Step 6  Score leads by opportunity potential
Step 7  Generate website audits for top 20 leads
Step 8  Prepare personalized outreach for top 10 leads

Estimated: ~85 leads · ~40 minutes · Cost: 120 AI credits
```

The user can:
- ✅ **Approve** and start execution
- ✏️ **Edit** the plan (adjust scope, sources, or limits)
- ❌ **Cancel** and refine the ICP

---

## 5. AI Tool-Calling Pipeline

Once the plan is approved, the **Supervisor Agent** orchestrates a sequence of tool calls:

```
Planner Agent
  │
  ▼
Search Tool (Google / Bing / SerpAPI)
  │  → Returns: company names, websites, locations
  ▼
Company Discovery (Apollo / LinkedIn)
  │  → Returns: company size, revenue, industry
  ▼
Website Analyzer (Puppeteer / Playwright)
  │  → Returns: tech stack, CMS, design quality
  ▼
Technology Detector (BuiltWith / Wappalyzer)
  │  → Returns: frameworks, tools, analytics, hosting
  ▼
Email Finder (Hunter.io / Apollo)
  │  → Returns: verified email addresses
  ▼
LinkedIn Finder
  │  → Returns: decision-maker LinkedIn profiles
  ▼
Google Maps Search
  │  → Returns: location data, reviews, hours
  ▼
SEO Analyzer (Lighthouse / custom)
  │  → Returns: SEO score, issues
  ▼
Performance Scanner (Lighthouse)
  │  → Returns: Core Web Vitals, load time
  ▼
AI Summary Generator (LLM)
  │  → Returns: company summary, pain points, angles
  ▼
CRM Storage (PostgreSQL)
  │  → Saves structured lead record
  ▼
Lead Score Engine
  │  → Returns: 0–100 score with explanation
  ▼
Campaign Builder
     → Ready for outreach
```

Each tool returns **typed JSON** that becomes input to the next step. All calls are logged, traced, and retried on failure.

---

## 6. Lead Discovery Flow

```
User Prompt / ICP
  │
  ▼
AI Planning
  │  → Choose sources, define filters
  ▼
Select Data Sources
  │  (Google Maps, Apollo, LinkedIn, CSV)
  ▼
Execute Searches (parallel)
  │
  ▼
Collect Raw Companies
  │
  ▼
Remove Duplicates
  │  (fuzzy domain matching + name normalization)
  ▼
Validate Domains
  │  (DNS check, HTTP reachability)
  ▼
Find Decision Makers
  │  (LinkedIn title matching, company hierarchy)
  ▼
Find Contact Details
  │  (Email verification, phone lookup)
  ▼
Enrich Company Data
  │  (Revenue, headcount, funding, technologies)
  ▼
Save to Database
     (Structured lead record with all fields)
```

**Deduplication Strategy**

- Domain normalization (remove `www.`, trailing slashes)
- Company name similarity matching (Levenshtein distance)
- Email address deduplication
- Cross-source merging (prefer highest-confidence data)

---

## 7. Lead Enrichment

Every saved lead includes the following structured data:

| Field Category | Fields |
|---------------|--------|
| **Company** | Name, website, industry, description |
| **Size** | Employee count, revenue estimate |
| **Technology** | CMS, framework, analytics, hosting, CDN |
| **Social** | LinkedIn, Twitter, Facebook, Instagram |
| **Contacts** | Owner name, email, phone, LinkedIn URL |
| **Decision Makers** | Title-matched contacts with confidence score |
| **AI Insights** | Company summary, pain points, opportunities |
| **Scoring** | Lead score (0–100), confidence score |

---

## 8. Website Intelligence Flow

For each lead, the **Website Audit Agent** runs a full analysis:

**Analysis Checklist**

| Dimension | Tool / Method |
|-----------|--------------|
| Page Speed | Google Lighthouse API |
| Core Web Vitals | LCP, CLS, FID / INP |
| SEO | Meta tags, headings, sitemap, canonical |
| Accessibility | WCAG 2.1 AA checker |
| Security | SSL, HSTS, security headers |
| Mobile Experience | Responsive layout testing |
| UX | CTA presence, navigation, readability |
| Forms | Form fields, validation, conversion friction |
| Broken Links | Internal and external link checker |
| Third-Party Tools | GA4, Pixel, CRMs, live chat |

**Generated Report**

```
Website Audit: fashionstore.com
────────────────────────────────
Overall Score: 52/100

🔴 Critical Issues (3)
  - Mobile layout breaks below 375px
  - Page load time: 8.4s (target: <3s)
  - No SSL on checkout page

🟡 Moderate Issues (5)
  - Missing meta descriptions on 12 pages
  - H1 tag missing on product pages
  - No alt text on 45% of images

🟢 Strengths (4)
  - SSL certificate valid
  - Google Analytics installed
  - Fast server response time (TTFB: 180ms)

💡 Opportunity: This store would benefit from a performance 
   redesign. Their page speed alone costs them ~30% of 
   conversions. Strong sales angle for your services.
```

The full report is exportable as a **PDF** and can be attached to outreach emails.

---

## 9. AI Lead Scoring

The Lead Score Engine computes a **0–100 score** with a natural-language explanation.

**Scoring Factors**

| Factor | Weight |
|--------|--------|
| Industry match to ICP | High |
| Company size match | High |
| Website quality (inverse) | High |
| Budget / revenue potential | Medium |
| Technology fit | Medium |
| Geographic match | Medium |
| Growth signals (hiring, funding) | Medium |
| Social media activity | Low |
| SEO score (inverse — poor SEO = more opportunity) | Low |

**Example Score Explanation**

```
Lead Score: 87/100

This lead scores highly because:
✅ Fashion e-commerce brand (perfect ICP match)
✅ 22 employees (within 5–50 target range)
✅ Based in Austin, TX (US market)
✅ Using outdated Shopify theme (2019 free theme)
✅ Mobile page speed: 38/100 (strong opportunity signal)
✅ No live chat or email capture (conversion gap)
⚠️  Revenue estimate unavailable (data gap)
```

---

## 10. Lead Review & Actions

Once enriched and scored, the user sees a **Lead Review Card**:

```
┌─────────────────────────────────────────────────┐
│  TrendyThreads.com          Score: 87/100 🔥    │
│  Fashion E-Commerce · Austin, TX · 22 employees │
├─────────────────────────────────────────────────┤
│  👤 Sarah Chen · Co-Founder                    │
│  📧 sarah@trendythreads.com                    │
│  🔗 linkedin.com/in/sarahchen                  │
├─────────────────────────────────────────────────┤
│  💡 AI Insight: Their mobile speed score is 38. │
│  Strong opportunity for performance redesign.   │
│  Est. deal value: $5,000–$8,000                │
├─────────────────────────────────────────────────┤
│  [Save to CRM] [Add to Campaign] [Archive]     │
│  [View Full Audit] [Assign] [Tag]              │
└─────────────────────────────────────────────────┘
```

**Available Actions**

| Action | Description |
|--------|-------------|
| Save to CRM | Add to pipeline at "Lead" stage |
| Add to Campaign | Immediately enroll in outreach sequence |
| Archive | Remove from active list |
| Assign | Delegate to a team member |
| Tag | Label for filtering and segmentation |
| Export | Download record as CSV |
| View Full Audit | Open website audit PDF |

---

## 11. Outreach Campaign Flow

```
Select Leads (from review or CRM)
  │
  ▼
Choose AI Strategy
  │  (Cold intro, audit-based, pain point, value-add)
  ▼
AI Generates Personalized Messages
  │  (Uses lead data, website audit, pain points)
  ▼
User Reviews Messages
  │  (Edit any message before sending)
  ▼
Approve Campaign
  │
  ▼
Schedule Sending
  │  (Optimal time per timezone)
  ▼
Track Delivery
  │  → Sent / Bounced / Blocked
  ▼
Track Opens
  │  → Pixel tracking
  ▼
Track Replies
  │  → Inbound detection
  ▼
CRM Auto-Updated
     → Stage moves to "Contacted"
```

**Example AI-Generated Cold Email**

```
Subject: Your Shopify store is costing you sales, Sarah

Hi Sarah,

I ran a quick audit of TrendyThreads.com and noticed your 
mobile load time is sitting at 8.4 seconds — industry 
standard is under 3s, and Google research shows this alone 
can reduce conversions by up to 53%.

I specialize in Shopify performance redesigns for fashion 
brands in the US. My last client in this space went from 
a 38 to a 91 mobile score, and saw a 34% lift in 
checkout completions.

Would you be open to a 15-minute call this week to see 
if there's a fit?

Best,
[Your Name]

P.S. — I can send over the full audit report. It's yours 
either way.
```

---

## 12. AI Follow-Up Sequences

When there is no reply, the AI executes a structured follow-up sequence:

| Day | Message Type | Content Strategy |
|-----|-------------|-----------------|
| **Day 3** | Helpful Insight | Share one actionable tip relevant to their business |
| **Day 7** | Case Study | Share a relevant client success story |
| **Day 14** | Final Follow-Up | Polite closing message, leave the door open |

**Smart Sequence Rules**

- ✅ Sequence **stops automatically** when a reply is detected
- ✅ Sequence **pauses** if contact unsubscribes
- ✅ AI **adjusts tone** based on previous engagement signals
- ✅ Each message is **uniquely personalized** — not a template blast

---

## 13. CRM Pipeline

Leads progress through a visual, customizable pipeline:

```
Lead
  │  (Discovered, not yet contacted)
  ▼
Qualified
  │  (Reviewed, confirmed ICP match)
  ▼
Contacted
  │  (First outreach sent)
  ▼
Meeting Scheduled
  │  (Call / demo booked)
  ▼
Proposal Sent
  │  (Quote/scope delivered)
  ▼
Negotiation
  │  (Price or scope discussion)
  ▼
Won ✅  ──────►  Post-Sale Automation
  │
  ▼
Lost ❌  ──────►  Re-engage workflow (optional)
```

**CRM Features**

- Every stage transition is logged with timestamp
- AI generates a summary of all activity per lead
- Tasks and reminders auto-created based on stage
- Forecasting based on deal values and stage probabilities

---

## 14. Meeting Preparation

When a meeting is booked, the **CRM Agent** automatically generates a **Meeting Brief**:

```
Meeting Brief: TrendyThreads.com
────────────────────────────────
Date: Thursday, July 3 · 2:00 PM CST

Company Summary
TrendyThreads.com is a Shopify-based fashion retailer 
selling sustainable women's clothing, founded in 2021 
with 22 employees, averaging $2.1M annual revenue.

Decision Maker: Sarah Chen, Co-Founder
  LinkedIn: linkedin.com/in/sarahchen
  Background: Ex-Nordstrom buyer, 8 years in fashion retail

Key Challenges
- Mobile experience is significantly underperforming
- No email capture or abandoned cart flow
- Shopify theme is 2019 vintage — missing modern UX patterns

Recommended Talking Points
1. Show the mobile speed comparison (38 vs industry 75+)
2. Mention the abandoned cart opportunity (est. $30K/yr)
3. Reference the sustainable fashion brand you redesigned last year

Questions to Ask
- What's your current monthly traffic?
- Have you run any conversion optimization experiments?
- What does your current tech team look like?

Suggested Proposal Outline
- Discovery & audit phase: 1 week · $500
- Shopify redesign: 6 weeks · $5,000
- Optional: email flow setup · $1,000 add-on
```

---

## 15. Proposal Generation

The AI drafts a complete, client-ready proposal:

| Section | Description |
|---------|-------------|
| **Executive Summary** | Why you're reaching out and what you'll deliver |
| **Scope of Work** | Detailed deliverables with acceptance criteria |
| **Timeline** | Week-by-week project phases |
| **Pricing** | Line-item breakdown |
| **Milestones** | Payment-tied project checkpoints |
| **Contract Summary** | Key terms, revision policy, IP ownership |

Users can edit any section and send directly from the platform.

---

## 16. Post-Sale Automation

Once a deal is marked **Won**, the platform automatically:

| Action | Trigger |
|--------|---------|
| Create client workspace | Deal marked Won |
| Generate onboarding checklist | Workspace created |
| Send welcome email to client | Workspace created |
| Create project in project tracker | Deal Won |
| Schedule kickoff meeting | Within 48h of Won |
| Assign internal team members | Project created |
| Generate first invoice | Based on payment schedule |

---

## 17. Review & Referral

After project completion:

```
Project Marked Complete
  │
  ▼
Auto-send Review Request
  │  (Email with Google / Trustpilot / G2 link)
  ▼
Client Leaves Review ──────► Testimonial saved to asset library
  │
  ▼
Referral Campaign Triggered
  │  (Personal referral link with reward tracking)
  ▼
Referral Converted ──────► Reward issued, new lead created
```

---

## 18. Analytics Dashboard

The analytics dashboard gives a complete view of the entire funnel:

| Widget | Metric |
|--------|--------|
| Leads Generated | Total leads by source and time period |
| Qualified Rate | % of leads meeting ICP criteria |
| Contact Rate | % of leads successfully contacted |
| Reply Rate | Email and LinkedIn reply rate |
| Meeting Rate | Meetings booked per 100 contacts |
| Conversion Rate | % of meetings becoming deals |
| Revenue Generated | Won deal values |
| Top Industries | Best-performing target segments |
| Campaign Performance | Per-campaign metrics |
| AI Usage | Credits consumed by module |
| Workflow Executions | Automation run volume and success rate |
| Team Productivity | Per-member activity scores |

---

← [Previous: Product Overview](./01-product-overview.md) · [Back to Index](./README.md) · [Next: System Architecture →](./03-system-architecture.md)
