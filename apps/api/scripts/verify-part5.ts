import { db } from "@leadflow/db";
import { CampaignsService } from "../src/modules/campaigns/campaigns.service";
import { SequencesService } from "../src/modules/campaigns/sequences.service";
import { TrackingService } from "../src/modules/campaigns/tracking.service";

async function main() {
  console.log("🚀 Starting Part 5 Verification...");
  
  // Create mock fastify app context
  const mockApp = { db, log: { error: console.error } } as any;
  const campaignsService = new CampaignsService(mockApp);
  const sequencesService = new SequencesService(mockApp);
  const trackingService = new TrackingService(mockApp);

  // 1. Create Mock Organization & Workspace
  const orgId = "org_verify_part5_" + Date.now();
  const org = await db.organization.create({
    data: {
      id: orgId,
      clerkOrgId: orgId,
      name: "Verify Part 5 Org",
      slug: "verify-part5-" + Date.now()
    }
  });

  const workspace = await db.workspace.create({
    data: {
      name: "Default Workspace",
      slug: "verify-ws-" + Date.now(),
      organizationId: orgId,
    }
  });

  console.log(`✅ Created Organization: ${org.name}`);

  // 2. Create 3 Mock Leads
  const leads = [];
  for (let i = 1; i <= 3; i++) {
    const lead = await db.lead.create({
      data: {
        organizationId: orgId,
        workspaceId: workspace.id,
        company: `Company ${i}`,
        email: `lead${i}@verify.com`,
        status: "NEW",
        source: "MANUAL"
      }
    });
    leads.push(lead);
  }
  console.log(`✅ Created 3 Leads: ${leads.map(l => l.email).join(', ')}`);

  // 3. Create Campaign
  const campaign = await campaignsService.createCampaign(orgId, {
    name: "Verification Campaign",
    channel: "EMAIL",
    fromEmail: "hello@verify.com"
  });
  console.log(`✅ Created Campaign: ${campaign.name} (${campaign.id})`);

  // 4. Create Sequence & Steps
  const sequence = await sequencesService.createSequence(orgId, campaign.id, { name: "Verification Sequence" });
  await sequencesService.addSequenceStep(orgId, campaign.id, sequence.id, {
    type: "EMAIL",
    subject: "Step 1: Introduction",
    content: "Hi {{firstName}}, this is step 1.",
    dayOffset: 0
  });
  await sequencesService.addSequenceStep(orgId, campaign.id, sequence.id, {
    type: "EMAIL",
    subject: "Step 2: Follow-up",
    content: "Hi {{firstName}}, this is step 2 (Day 3).",
    dayOffset: 3
  });
  console.log(`✅ Created Sequence with 2 steps (Day 0, Day 3)`);

  // 5. Launch Campaign FIRST
  await campaignsService.launchCampaign(orgId, campaign.id);
  console.log(`✅ Launched Campaign (Status: ACTIVE)`);

  // 6. Enroll Leads (since campaign is active, they will get sequence enrollments)
  for (const lead of leads) {
    await campaignsService.addLeadToCampaign(orgId, campaign.id, lead.id);
  }
  console.log(`✅ Enrolled 3 leads into campaign`);

  // 7. Verify Enrollments
  const enrollments = await db.sequenceEnrollment.findMany({
    where: { campaignLead: { campaignId: campaign.id } }
  });
  console.log(`✅ Verified ${enrollments.length} SequenceEnrollments are scheduled`);

  if (enrollments.length !== 3) {
    throw new Error("Expected 3 enrollments");
  }

  // 8. Simulate Pixel Open for Lead 1
  if (!leads[0]?.id || !leads[0]?.email) throw new Error("Lead 1 not found");
  
  const event = await db.emailEvent.create({
    data: {
      organizationId: orgId,
      campaignId: campaign.id,
      leadId: leads[0].id,
      event: "DELIVERED",
      recipientEmail: leads[0].email
    }
  });
  
  console.log(`✅ Simulating Email Sent & Pixel Open for Lead 1 (${leads[0].email})`);
  await trackingService.trackOpen(event.id, "Mozilla/5.0", "127.0.0.1");
  
  const updatedEvent = await db.emailEvent.findUnique({ where: { id: event.id } });
  if (updatedEvent?.event === "OPENED") {
    console.log(`✅ Track Open Success: Event changed to OPENED`);
  } else {
    throw new Error("Track open failed");
  }

  // 9. Simulate Reply for Lead 2
  if (!leads[1]?.email) throw new Error("Lead 2 email missing");
  console.log(`✅ Simulating Reply for Lead 2 (${leads[1].email})`);
  await trackingService.handleReply(leads[1].email, "Yes, I am interested!");

  // Verify Lead 2 Enrollment is stopped
  const lead2Campaign = await db.campaignLead.findFirst({
    where: { campaignId: campaign.id, leadId: leads[1].id },
    include: { enrollments: true }
  });

  if (lead2Campaign?.status === "STOPPED" && lead2Campaign.stoppedReason === "REPLIED") {
    console.log(`✅ Reply Success: CampaignLead status updated to STOPPED (Reason: REPLIED)`);
  } else {
    throw new Error("Reply handling failed: " + lead2Campaign?.status);
  }

  console.log("\n🎉 PART 5 VERIFICATION COMPLETED SUCCESSFULLY!");
}

main().catch(err => {
  console.error("❌ Verification Failed:", err);
  process.exit(1);
});
