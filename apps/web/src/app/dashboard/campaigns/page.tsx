import Link from "next/link";
import { Plus, BarChart2, Mail, Users, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function CampaignsPage() {
  // In a real implementation, we'd fetch from API
  // const campaigns = await fetch(`${process.env.API_URL}/api/v1/campaigns`).then(res => res.json());
  
  // Mock data for UI development
  const campaigns = [
    {
      id: "cm123",
      name: "Q4 Outreach - Tech Founders",
      status: "ACTIVE",
      channel: "EMAIL",
      leadsCount: 1450,
      opens: 450,
      replies: 23,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cm124",
      name: "SaaS Enterprise Prospects",
      status: "DRAFT",
      channel: "LINKEDIN",
      leadsCount: 0,
      opens: 0,
      replies: 0,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and monitor your automated outreach sequences.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/campaigns/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Campaigns</h3>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">+1 from last month</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Emails Sent</h3>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground mt-1">+19% from last month</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Leads Enrolled</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">1,450</div>
            <p className="text-xs text-muted-foreground mt-1">+140 since yesterday</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="p-4">
          <h3 className="text-lg font-semibold">All Campaigns</h3>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Channel</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Leads</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Performance</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState 
                      title="No campaigns found"
                      description="Create a campaign to start reaching out to your leads."
                      actionLabel="Create Campaign"
                      actionHref="/campaigns/new"
                      className="border-0 bg-transparent rounded-none"
                    />
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 align-middle font-medium">
                      <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="p-4 align-middle">
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        campaign.status === 'ACTIVE' 
                          ? 'border-transparent bg-primary/10 text-primary hover:bg-primary/20'
                          : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}>
                        {campaign.status}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {campaign.channel}
                    </td>
                    <td className="p-4 align-middle">
                      {campaign.leadsCount}
                    </td>
                    <td className="p-4 align-middle">
                      {campaign.status === "ACTIVE" ? (
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Opens: <span className="font-medium text-foreground">{campaign.opens}</span></span>
                          <span>Replies: <span className="font-medium text-foreground">{campaign.replies}</span></span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Link 
                        href={`/campaigns/${campaign.id}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View Campaign</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
