import { PrismaClient, LeadStatus, LeadSource, DealStage, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ── Clean existing data ──────────────────────────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.knowledgeChunk.deleteMany();
  await prisma.knowledgeDocument.deleteMany();
  await prisma.emailEvent.deleteMany();
  await prisma.campaignLead.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.note.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.task.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.pipeline.deleteMany();
  await prisma.websiteAudit.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.leadScore.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // ── Organization ─────────────────────────────────────────────────────────
  console.log("  Creating organization...");
  const org = await prisma.organization.create({
    data: {
      name: "Acme Agency",
      slug: "acme-agency",
      industry: "Digital Marketing",
      size: "11-50",
      plan: SubscriptionPlan.PROFESSIONAL,
    },
  });

  // ── Workspace ─────────────────────────────────────────────────────────────
  const workspace = await prisma.workspace.create({
    data: {
      organizationId: org.id,
      name: "Main Workspace",
      slug: "main",
      description: "Primary sales workspace",
    },
  });

  // ── Admin User ────────────────────────────────────────────────────────────
  console.log("  Creating admin user...");
  const adminUser = await prisma.user.create({
    data: {
      organizationId: org.id,
      email: "admin@leadflow.dev",
      name: "Alex Admin",
      role: "OWNER",
      timezone: "America/New_York",
    },
  });

  // Link user to workspace
  await prisma.teamMember.create({
    data: {
      workspaceId: workspace.id,
      userId: adminUser.id,
      role: "OWNER",
      joinedAt: new Date(),
    },
  });

  // ── API Key ────────────────────────────────────────────────────────────────
  const rawKey = "lf_dev_test_key_12345678";
  await prisma.apiKey.create({
    data: {
      organizationId: org.id,
      name: "Development Key",
      keyHash: createHash("sha256").update(rawKey).digest("hex"),
      keyPrefix: rawKey.substring(0, 8),
      scopes: ["lead:read", "lead:write", "campaign:read"],
      createdBy: adminUser.id,
    },
  });

  // ── Subscription ──────────────────────────────────────────────────────────
  await prisma.subscription.create({
    data: {
      organizationId: org.id,
      plan: SubscriptionPlan.PROFESSIONAL,
      status: SubscriptionStatus.TRIALING,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // ── Sample Leads ──────────────────────────────────────────────────────────
  console.log("  Creating 10 sample leads...");
  const leadsData = [
    {
      company: "TrendyThreads",
      website: "https://trendythreads.com",
      industry: "E-commerce / Fashion",
      employees: 22,
      revenue: 2100000,
      email: "sarah@trendythreads.com",
      country: "US",
      city: "Austin",
      status: LeadStatus.ENRICHED,
      source: LeadSource.GOOGLE_MAPS,
      score: 87,
      tags: ["shopify", "fashion", "high-priority"],
      aiSummary: "Fashion e-commerce brand selling sustainable women's clothing. Founded 2021, using Shopify with outdated theme. Strong mobile traffic but poor conversion rate.",
      painPoints: ["Poor mobile page speed (38/100)", "No abandoned cart recovery", "Outdated Shopify theme"],
      opportunities: ["Performance redesign", "Email automation setup", "Conversion rate optimization"],
    },
    {
      company: "Bloom & Co",
      website: "https://bloomandco.com",
      industry: "Florist / E-commerce",
      employees: 8,
      revenue: 450000,
      email: "owner@bloomandco.com",
      country: "US",
      city: "Seattle",
      status: LeadStatus.NEW,
      source: LeadSource.APOLLO,
      score: 72,
      tags: ["shopify", "local-business"],
      aiSummary: "Local florist with e-commerce presence. Growing online sales but website has UX issues.",
      painPoints: ["Poor checkout UX", "No mobile optimization"],
      opportunities: ["UX redesign", "Mobile-first rebuild"],
    },
    {
      company: "NorthStar Marketing",
      website: "https://northstarmarketing.co",
      industry: "Digital Marketing Agency",
      employees: 35,
      revenue: 3200000,
      email: "hello@northstarmarketing.co",
      country: "CA",
      city: "Toronto",
      status: LeadStatus.QUALIFIED,
      source: LeadSource.LINKEDIN,
      score: 91,
      tags: ["agency", "b2b", "enterprise"],
      aiSummary: "Full-service digital marketing agency with 35 employees. Looking to expand their service offerings.",
      painPoints: ["No project management system", "Manual client reporting"],
      opportunities: ["Dashboard / reporting tool", "Project automation"],
    },
    {
      company: "PeakFit Studio",
      website: "https://peakfitstudio.com",
      industry: "Fitness / Wellness",
      employees: 12,
      revenue: 820000,
      email: "info@peakfitstudio.com",
      country: "AU",
      city: "Melbourne",
      status: LeadStatus.ENRICHED,
      source: LeadSource.GOOGLE_MAPS,
      score: 64,
      tags: ["fitness", "local", "bookings"],
      aiSummary: "Boutique fitness studio with in-person and online classes. Website needs modernization.",
      painPoints: ["Outdated booking system", "No online payment"],
      opportunities: ["Booking system redesign", "Payment integration"],
    },
    {
      company: "CloudStack Solutions",
      website: "https://cloudstack.io",
      industry: "SaaS / Cloud",
      employees: 60,
      revenue: 8500000,
      email: "sales@cloudstack.io",
      country: "US",
      city: "San Francisco",
      status: LeadStatus.QUALIFIED,
      source: LeadSource.APOLLO,
      score: 95,
      tags: ["saas", "enterprise", "high-value"],
      aiSummary: "B2B SaaS company providing cloud infrastructure tools. Looking for marketing automation.",
      painPoints: ["Manual lead qualification", "No outreach automation"],
      opportunities: ["Full sales automation", "AI-powered prospecting"],
    },
    {
      company: "SunBite Foods",
      website: "https://sunbitefoods.com",
      industry: "Food & Beverage",
      employees: 18,
      status: LeadStatus.NEW,
      source: LeadSource.CSV_IMPORT,
      score: 55,
      tags: ["food", "dtc", "shopify"],
      aiSummary: "DTC food brand selling healthy snacks online.",
      painPoints: ["Low repeat purchase rate", "No loyalty program"],
      opportunities: ["Email retention campaigns", "Loyalty program setup"],
    },
    {
      company: "Meridian Law Group",
      website: "https://meridianlaw.com",
      industry: "Legal Services",
      employees: 45,
      revenue: 6200000,
      email: "contact@meridianlaw.com",
      country: "US",
      city: "Chicago",
      status: LeadStatus.ENRICHED,
      source: LeadSource.MANUAL,
      score: 78,
      tags: ["legal", "professional-services"],
      aiSummary: "Mid-size law firm with digital presence. Website is outdated and lacks lead capture.",
      painPoints: ["No online lead capture", "Outdated website design"],
      opportunities: ["Website redesign", "Lead capture forms", "Chatbot"],
    },
    {
      company: "Volta Electric",
      website: "https://voltaelectric.ca",
      industry: "Home Services",
      employees: 28,
      revenue: 1800000,
      email: "info@voltaelectric.ca",
      country: "CA",
      city: "Vancouver",
      status: LeadStatus.NEW,
      source: LeadSource.GOOGLE_MAPS,
      score: 69,
      tags: ["trades", "local", "google-maps"],
      aiSummary: "Local electrical contractor with strong reviews but basic website.",
      painPoints: ["No online booking", "Missing reviews integration"],
      opportunities: ["Booking system", "Review automation"],
    },
    {
      company: "Aria Jewelry",
      website: "https://ariajewelry.com",
      industry: "Retail / Jewelry",
      employees: 14,
      revenue: 1100000,
      email: "hello@ariajewelry.com",
      country: "US",
      city: "New York",
      status: LeadStatus.ENRICHED,
      source: LeadSource.LINKEDIN,
      score: 83,
      tags: ["jewelry", "luxury", "shopify"],
      aiSummary: "Independent jewelry brand with Shopify store. Growing social following but low website conversion.",
      painPoints: ["Poor product photography display", "No size guide", "Slow checkout"],
      opportunities: ["Visual redesign", "UX optimization", "Upsell features"],
    },
    {
      company: "GreenLeaf Consulting",
      website: "https://greenleafconsulting.com",
      industry: "Management Consulting",
      employees: 9,
      revenue: 950000,
      email: "team@greenleafconsulting.com",
      country: "US",
      city: "Denver",
      status: LeadStatus.QUALIFIED,
      source: LeadSource.APOLLO,
      score: 88,
      tags: ["consulting", "b2b", "services"],
      aiSummary: "Boutique sustainability consulting firm. Strong thought leadership but weak digital presence.",
      painPoints: ["No content marketing", "Website not updated in 3 years"],
      opportunities: ["Content strategy", "Website rebuild", "LinkedIn outreach"],
    },
  ];

  const leads = [];
  for (const leadData of leadsData) {
    const lead = await prisma.lead.create({
      data: {
        organizationId: org.id,
        workspaceId: workspace.id,
        ownerId: adminUser.id,
        ...leadData,
      },
    });

    // Add contacts
    if (leadData.email) {
      await prisma.contact.create({
        data: {
          leadId: lead.id,
          organizationId: org.id,
          name: `${leadData.company} Owner`,
          title: "Founder",
          email: leadData.email,
          emailConfidence: 0.91,
          isDecisionMaker: true,
          decisionScore: 90,
          confidence: 0.88,
        },
      });
    }

    // Add lead score
    if (leadData.score) {
      await prisma.leadScore.create({
        data: {
          leadId: lead.id,
          score: leadData.score,
          factors: {
            industryMatch: 25,
            companySize: 20,
            websiteQuality: 15,
            budgetPotential: 15,
            technologyFit: 10,
            geographicMatch: 10,
            growthSignals: 5,
          },
          explanation: `This lead scores ${leadData.score}/100 based on industry fit, company size, and identified pain points that align with our services.`,
          model: "gpt-4o",
        },
      });
    }

    // Add activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        organizationId: org.id,
        userId: adminUser.id,
        type: "lead.created",
        description: `Lead discovered from ${leadData.source.toLowerCase().replace("_", " ")}`,
      },
    });

    leads.push(lead);
  }

  // ── CRM Pipeline ──────────────────────────────────────────────────────────
  console.log("  Creating CRM pipeline...");
  const pipeline = await prisma.pipeline.create({
    data: {
      organizationId: org.id,
      workspaceId: workspace.id,
      name: "Sales Pipeline",
      isDefault: true,
      currency: "USD",
      stages: [
        { id: "lead", name: "Lead", color: "#6B7280", order: 0 },
        { id: "qualified", name: "Qualified", color: "#3B82F6", order: 1 },
        { id: "contacted", name: "Contacted", color: "#8B5CF6", order: 2 },
        { id: "meeting_scheduled", name: "Meeting Scheduled", color: "#F59E0B", order: 3 },
        { id: "proposal_sent", name: "Proposal Sent", color: "#EC4899", order: 4 },
        { id: "negotiation", name: "Negotiation", color: "#EF4444", order: 5 },
        { id: "won", name: "Won", color: "#10B981", order: 6 },
        { id: "lost", name: "Lost", color: "#6B7280", order: 7 },
      ],
    },
  });

  // ── Sample Deals ──────────────────────────────────────────────────────────
  console.log("  Creating sample deals...");

  const deal1 = await prisma.deal.create({
    data: {
      organizationId: org.id,
      pipelineId: pipeline.id,
      leadId: leads[0]!.id, // TrendyThreads
      ownerId: adminUser.id,
      title: "TrendyThreads — Shopify Performance Redesign",
      value: 7500,
      currency: "USD",
      stage: DealStage.PROPOSAL_SENT,
      probability: 65,
      expectedCloseAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      description: "Performance redesign including mobile optimization and checkout flow improvements.",
      aiMeetingBrief: "Focus on their mobile speed issue (38/100). Mention the 53% conversion loss from slow mobile. Reference fashion brand redesign case study.",
    },
  });

  await prisma.note.create({
    data: {
      organizationId: org.id,
      dealId: deal1.id,
      userId: adminUser.id,
      content: "Sarah was very receptive to the audit findings. She mentioned they've been losing sales on mobile. Follow up with the proposal by EOW.",
      isPinned: true,
    },
  });

  await prisma.task.create({
    data: {
      organizationId: org.id,
      dealId: deal1.id,
      assignedTo: adminUser.id,
      title: "Follow up on proposal",
      description: "Check if Sarah has reviewed the proposal. Ask for feedback.",
      status: "TODO",
      priority: "high",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.deal.create({
    data: {
      organizationId: org.id,
      pipelineId: pipeline.id,
      leadId: leads[2]!.id, // NorthStar Marketing
      ownerId: adminUser.id,
      title: "NorthStar — Client Reporting Dashboard",
      value: 15000,
      currency: "USD",
      stage: DealStage.MEETING_SCHEDULED,
      probability: 45,
      expectedCloseAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      description: "Custom reporting dashboard with client portal and automated PDF reports.",
    },
  });

  await prisma.deal.create({
    data: {
      organizationId: org.id,
      pipelineId: pipeline.id,
      leadId: leads[4]!.id, // CloudStack
      ownerId: adminUser.id,
      title: "CloudStack — Full Sales Automation Setup",
      value: 45000,
      currency: "USD",
      stage: DealStage.QUALIFIED,
      probability: 30,
      expectedCloseAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      description: "End-to-end sales automation including AI prospecting, outreach, and CRM integration.",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("");
  console.log("  Organization:  Acme Agency");
  console.log("  Admin Email:   admin@leadflow.dev");
  console.log("  Admin Password: Admin123! (configure in Clerk)");
  console.log(`  Leads created: ${leads.length}`);
  console.log("  Deals created: 3");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
