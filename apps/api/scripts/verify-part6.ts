import { db, WorkflowStatus, NotificationType } from "@leadflow/db";
import { AnalyticsService } from "../src/modules/analytics/analytics.service";
import { WorkflowsService } from "../src/modules/workflows/workflows.service";
import { NotificationsService } from "../src/modules/notifications/notifications.service";

async function main() {
  console.log("🚀 Starting Part 6 Verification...\n");
  
  const mockRedis = {
    get: async () => null,
    setex: async () => "OK",
  };

  // Create mock fastify app context
  const mockApp = { db, redis: mockRedis, log: { error: console.error } } as any;
  const analyticsService = new AnalyticsService(mockApp.db, mockApp.redis);
  const workflowsService = new WorkflowsService(mockApp.db);
  const notificationsService = new NotificationsService(mockApp.db);

  // 1. Create Mock Organization & Workspace
  const orgId = "org_verify_part6_" + Date.now();
  const org = await db.organization.create({
    data: {
      id: orgId,
      clerkOrgId: orgId,
      name: "Verify Part 6 Org",
      slug: "verify-part6-" + Date.now()
    }
  });

  const workspace = await db.workspace.create({
    data: {
      name: "Default Workspace",
      slug: "verify-ws-" + Date.now(),
      organizationId: orgId,
    }
  });
  
  const user = await db.user.create({
    data: {
      clerkUserId: "user_" + Date.now(),
      email: "test_" + Date.now() + "@verify6.com",
      name: "Test User",
      organizationId: orgId,
    }
  });

  await db.teamMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: "ADMIN"
    }
  });

  console.log(`✅ Created Organization: ${org.name}`);

  // 2. Setup Data for Analytics Dashboard
  // Create 5 Leads
  for (let i = 1; i <= 5; i++) {
    await db.lead.create({
      data: {
        organizationId: orgId,
        workspaceId: workspace.id,
        company: `Company ${i}`,
        email: `lead${i}@verify6.com`,
        status: "NEW",
        source: "MANUAL"
      }
    });
  }

  // Create 2 Campaigns
  const campaign = await db.campaign.create({
    data: {
      organizationId: orgId,
      workspaceId: workspace.id,
      name: "Test Campaign",
      status: "ACTIVE",
      channel: "EMAIL",
      fromEmail: "hello@verify6.com",
    }
  });

  await db.campaign.create({
    data: {
      organizationId: orgId,
      workspaceId: workspace.id,
      name: "Draft Campaign",
      status: "DRAFT",
      channel: "EMAIL",
      fromEmail: "hello@verify6.com",
    }
  });

  // Create Email Events
  await db.emailEvent.create({ data: { organizationId: orgId, campaignId: campaign.id, event: "DELIVERED", recipientEmail: "lead1@verify6.com" }});
  await db.emailEvent.create({ data: { organizationId: orgId, campaignId: campaign.id, event: "OPENED", recipientEmail: "lead1@verify6.com" }});
  await db.emailEvent.create({ data: { organizationId: orgId, campaignId: campaign.id, event: "REPLIED", recipientEmail: "lead2@verify6.com" }});
  
  console.log(`✅ Created 5 Leads, 2 Campaigns, and 3 Email Events`);

  // Verify Analytics
  console.log(`\n📊 Verifying Analytics...`);
  const overview = await analyticsService.getOverview(orgId);
  console.log(`- Total Leads: ${overview.totalLeads} (Expected: 5)`);
  console.log(`- Total Campaigns: ${overview.totalCampaigns} (Expected: 2)`);
  console.log(`- Emails Opened: ${overview.emails.opened} (Expected: 1)`);
  console.log(`- Emails Replied: ${overview.emails.replied} (Expected: 1)`);
  
  if (overview.totalLeads !== 5 || overview.totalCampaigns !== 2 || overview.emails.opened !== 1) {
    throw new Error("Analytics overview returned incorrect numbers!");
  }
  console.log(`✅ Analytics numbers match DB records!`);

  // 3. Workflow Automation Verification
  console.log(`\n⚙️ Verifying Workflow Automation...`);
  
  const workflow = await workflowsService.createWorkflow(orgId, workspace.id, {
    name: "Task on Open",
    description: "When email is opened -> create CRM task",
    triggerType: "email.opened",
    triggerConfig: {},
    nodes: [
      { id: "1", type: "trigger", data: { type: "email.opened" } },
      { id: "2", type: "action", data: { actionType: "createTask" } }
    ],
    edges: [{ source: "1", target: "2" }]
  });

  // Activate the workflow
  await workflowsService.setWorkflowStatus(orgId, workflow.id, WorkflowStatus.ACTIVE);
  console.log(`- Created & Activated Workflow: "${workflow.name}"`);

  // Simulate Trigger "email.opened"
  console.log(`- Simulating "email.opened" trigger...`);
  await workflowsService.processTrigger(orgId, "email.opened", { email: "lead1@verify6.com" });

  // Verify WorkflowRun was created and task created
  const run = await db.workflowRun.findFirst({
    where: { workflowId: workflow.id },
    orderBy: { startedAt: "desc" }
  });
  
  if (!run) throw new Error("WorkflowRun was not created!");
  console.log(`- Workflow History created with status: ${run.status}`);
  console.log(`- Run Logs:`, run.logs);

  const task = await db.task.findFirst({
    where: { organizationId: orgId, title: { contains: "email.opened" } }
  });
  
  if (!task) throw new Error("CRM task was not created by the workflow!");
  console.log(`✅ Workflow successfully executed steps and created CRM Task!`);

  // 4. Notification Service Verification
  console.log(`\n🔔 Verifying Notification Service...`);
  
  const notification = await notificationsService.createNotification(
    orgId,
    user.id,
    "LEAD_DISCOVERED",
    "Lead Discovered",
    "A new high-intent lead was discovered via AI scan.",
    "/leads"
  );
  
  const unreadCount = await notificationsService.getUnreadCount(user.id);
  console.log(`- Unread notifications count: ${unreadCount} (Expected: 1)`);
  
  if (unreadCount !== 1) throw new Error("Unread count is incorrect");
  
  await notificationsService.markAsRead(user.id, notification.id);
  const newCount = await notificationsService.getUnreadCount(user.id);
  console.log(`- Unread count after marking read: ${newCount} (Expected: 0)`);
  if (newCount !== 0) throw new Error("Mark as read failed!");
  
  console.log(`✅ In-app notification system is working!`);

  console.log("\n🎉 PART 6 VERIFICATION COMPLETED SUCCESSFULLY!");
}

main().catch(err => {
  console.error("❌ Verification Failed:", err);
  process.exit(1);
});
