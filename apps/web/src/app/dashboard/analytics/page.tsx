"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { 
  BarChart3, 
  Users, 
  Megaphone, 
  Target, 
  Mail, 
  Eye, 
  MousePointerClick, 
  Reply, 
  AlertOctagon,
  ArrowUpRight
} from "lucide-react";

type AnalyticsOverview = {
  totalLeads: number;
  totalCampaigns: number;
  activeLeads: number;
  emails: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    bounced: number;
  };
};

export default function AnalyticsPage() {
  const { getToken } = useAuth();

  const { data, isLoading } = useQuery<AnalyticsOverview>({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const token = await getToken();
      return apiClient.get<AnalyticsOverview>("/analytics/overview", { ...(token && { token }) });
    },
  });

  if (isLoading || !data) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm">Compiling your metrics...</p>
        </div>
      </div>
    );
  }

  const { emails } = data;
  const calculateRate = (value: number, total: number) => {
    if (!total || total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Overview</h1>
        </div>
        <p className="text-muted-foreground">
          Gain insights into your funnels, active campaigns, and email performance.
        </p>
      </div>

      {/* Top-Line KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Leads */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Leads Discovered</p>
            <h3 className="text-3xl font-bold text-foreground">{data.totalLeads.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-lg text-brand-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Campaigns */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Campaigns Created</p>
            <h3 className="text-3xl font-bold text-foreground">{data.totalCampaigns.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Megaphone className="w-5 h-5" />
          </div>
        </div>

        {/* Active Leads in Sequences */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Leads Currently Active</p>
            <h3 className="text-3xl font-bold text-foreground">{data.activeLeads.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <Target className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Email Outreach Performance */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Email Outreach Performance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Sent */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Total Sent</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{emails.sent.toLocaleString()}</div>
          </div>

          {/* Opened */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Total Opened</span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-foreground">{emails.opened.toLocaleString()}</div>
              <div className="flex items-center text-xs font-medium text-success mb-1 bg-success/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {calculateRate(emails.opened, emails.sent)}% Rate
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-success/20 w-full">
               <div className="h-full bg-success" style={{ width: `${calculateRate(emails.opened, emails.sent)}%` }}></div>
            </div>
          </div>

          {/* Clicked */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <MousePointerClick className="w-4 h-4" />
              <span className="text-sm font-medium">Total Clicked</span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-foreground">{emails.clicked.toLocaleString()}</div>
              <div className="flex items-center text-xs font-medium text-brand-600 mb-1 bg-brand-500/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {calculateRate(emails.clicked, emails.sent)}% Rate
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-brand-500/20 w-full">
               <div className="h-full bg-brand-500" style={{ width: `${calculateRate(emails.clicked, emails.sent)}%` }}></div>
            </div>
          </div>

          {/* Replied */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <Reply className="w-4 h-4" />
              <span className="text-sm font-medium">Total Replied</span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-foreground">{emails.replied.toLocaleString()}</div>
              <div className="flex items-center text-xs font-medium text-primary mb-1 bg-primary/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {calculateRate(emails.replied, emails.sent)}% Rate
              </div>
            </div>
             <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
               <div className="h-full bg-primary" style={{ width: `${calculateRate(emails.replied, emails.sent)}%` }}></div>
            </div>
          </div>

          {/* Bounced */}
          <div className="bg-card border border-destructive/20 rounded-xl p-5 shadow-sm lg:col-start-4">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <AlertOctagon className="w-4 h-4 text-destructive/70" />
              <span className="text-sm font-medium">Total Bounced</span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-foreground">{emails.bounced.toLocaleString()}</div>
              <div className="flex items-center text-xs font-medium text-destructive mb-1 bg-destructive/10 px-1.5 py-0.5 rounded">
                {calculateRate(emails.bounced, emails.sent)}% Rate
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
