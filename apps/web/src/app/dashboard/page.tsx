"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Users, 
  Megaphone, 
  MousePointerClick, 
  MessageSquareReply, 
  ArrowRight, 
  Bot, 
  Target,
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Zap,
  MoreHorizontal
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

// --- Mock Data for UI demonstration ---
const mockLeads = [
  { id: 1, company: "TechCorp Solutions", score: 92, status: "New", time: "2h ago" },
  { id: 2, company: "Global Dynamics", score: 85, status: "Enriched", time: "4h ago" },
  { id: 3, company: "Acme Industries", score: 78, status: "Contacted", time: "5h ago" },
  { id: 4, company: "Stark Enterprises", score: 95, status: "New", time: "1d ago" },
  { id: 5, company: "Wayne Tech", score: 88, status: "Enriched", time: "1d ago" },
];

const mockCampaigns = [
  { id: 1, name: "Q3 Enterprise Outreach", status: "Active", sent: 1240, openRate: 42, replyRate: 8 },
  { id: 2, name: "Startup Founders Series", status: "Active", sent: 850, openRate: 38, replyRate: 5 },
  { id: 3, name: "Lost Deals Reactivation", status: "Paused", sent: 320, openRate: 25, replyRate: 2 },
];

const mockTasks = [
  { id: 1, title: "Follow up with TechCorp CTO", type: "Task", due: "Today, 2:00 PM" },
  { id: 2, title: "Product Demo: Global Dynamics", type: "Meeting", due: "Tomorrow, 10:30 AM" },
  { id: 3, title: "Send proposal to Acme", type: "Task", due: "Tomorrow, 4:00 PM" },
];

const mockActivities = [
  { id: 1, text: "AI Agent 'Lead Discovery' found 15 new prospects.", time: "1h ago", icon: <Bot className="w-4 h-4 text-brand-500" /> },
  { id: 2, text: "John Doe replied to 'Q3 Enterprise Outreach'.", time: "3h ago", icon: <MessageSquareReply className="w-4 h-4 text-success" /> },
  { id: 3, text: "Deal 'Stark Enterprises - Enterprise Plan' moved to Negotiation.", time: "5h ago", icon: <TrendingUp className="w-4 h-4 text-primary" /> },
  { id: 4, text: "Website Audit completed for Wayne Tech.", time: "1d ago", icon: <CheckCircle2 className="w-4 h-4 text-success" /> },
];

export default function DashboardHomePage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  
  const { data: overview, isLoading } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      try {
        return await apiClient.get<any>("/analytics/overview");
      } catch (e) {
        // Fallback data if endpoint is not ready
        return {
          totalLeads: 1248,
          totalCampaigns: 3,
          emails: { opened: 843, replied: 156 }
        };
      }
    },
    enabled: isLoaded && !!userId,
  });

  const firstName = user?.firstName || "there";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {firstName}! 👋</h1>
        <p className="text-muted-foreground">
          Here's a quick summary of what's happening in your LeadFlow workspace today.
        </p>
      </div>

      {/* Quick Stats Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 rounded-xl bg-card border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Leads" 
            value={overview?.totalLeads ?? 1248} 
            icon={<Users className="w-5 h-5 text-brand-500" />}
            trend="+12% this week"
            trendUp={true}
          />
          <StatCard 
            title="Active Campaigns" 
            value={overview?.totalCampaigns ?? 3} 
            icon={<Megaphone className="w-5 h-5 text-indigo-500" />}
            trend="1 paused"
            trendUp={false}
          />
          <StatCard 
            title="Emails Opened" 
            value={overview?.emails?.opened ?? 843} 
            icon={<MousePointerClick className="w-5 h-5 text-success" />}
            trend="+5% this week"
            trendUp={true}
          />
          <StatCard 
            title="Total Replies" 
            value={overview?.emails?.replied ?? 156} 
            icon={<MessageSquareReply className="w-5 h-5 text-brand-500" />}
            trend="+2% this week"
            trendUp={true}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions & Recent Leads & Upcoming */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/leads" className="block group">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition-all cursor-pointer h-full">
                <div className="bg-brand-50 dark:bg-brand-900/20 p-3 rounded-lg w-fit mb-4">
                  <Target className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="font-semibold text-card-foreground">Find Leads</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Discover new prospects with AI</p>
                <div className="flex items-center text-sm font-medium text-brand-500 group-hover:text-brand-600">
                  Get started <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link href="/campaigns/new" className="block group">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-card-hover hover:border-indigo-300 transition-all cursor-pointer h-full">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg w-fit mb-4">
                  <Megaphone className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="font-semibold text-card-foreground">Create Campaign</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Launch a new email sequence</p>
                <div className="flex items-center text-sm font-medium text-indigo-500 group-hover:text-indigo-600">
                  Draft now <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/ai-assistant" className="block group">
              <div className="bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl p-5 shadow-glow hover:opacity-95 transition-all cursor-pointer h-full text-primary-foreground relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Bot className="w-24 h-24" />
                </div>
                <div className="bg-white/20 p-3 rounded-lg w-fit mb-4 backdrop-blur-sm relative z-10">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white relative z-10">AI Assistant</h3>
                <p className="text-sm text-white/80 mt-1 mb-4 relative z-10">Let AI automate your workflow</p>
                <div className="flex items-center text-sm font-medium text-white relative z-10">
                  Talk to AI <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Leads */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-card-foreground">Recent Leads</h2>
              </div>
              <Link href="/leads" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
                View All
              </Link>
            </div>
            <div className="divide-y divide-border">
              {mockLeads.map(lead => (
                <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                  <div>
                    <h4 className="font-medium text-foreground">{lead.company}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Added {lead.time}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-medium text-muted-foreground">Score</span>
                      <span className={`text-sm font-bold ${lead.score > 90 ? 'text-success' : 'text-brand-500'}`}>{lead.score}</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {lead.status}
                    </span>
                    <button className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Active Campaigns */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-card-foreground">Active Campaigns</h2>
              </div>
              <Link href="/campaigns" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
                View All
              </Link>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCampaigns.map(campaign => (
                <div key={campaign.id} className="border border-border rounded-lg p-4 hover:border-brand-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-sm text-foreground truncate pr-2">{campaign.name}</h4>
                    <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${campaign.status === 'Active' ? 'bg-success animate-pulse-ring' : 'bg-warning'}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Sent</span>
                      <span className="font-medium text-foreground">{campaign.sent.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${campaign.openRate}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Open Rate</span>
                      <span className="font-medium text-foreground">{campaign.openRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed & Upcoming */}
        <div className="space-y-8">
          
          {/* Upcoming Tasks & Meetings */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-card-foreground">Upcoming</h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {mockTasks.map(task => (
                <div key={task.id} className="flex gap-3">
                  <div className="mt-0.5">
                    {task.type === "Meeting" ? (
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
                        <Users className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {task.due}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-card-foreground">Recent Activity</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="relative border-l border-border ml-3 space-y-6">
                {mockActivities.map(activity => (
                  <div key={activity.id} className="relative pl-6">
                    <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  View Full Feed
                </Link>
              </div>
            </div>
          </div>

          {/* AI Usage Summary */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                <h2 className="text-lg font-semibold text-card-foreground">AI Usage</h2>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground font-medium">Monthly Tokens</span>
                  <span className="text-foreground font-medium">1.2M / 2M</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-brand-500 h-2 rounded-full" style={{ width: `60%` }}></div>
                </div>
              </div>
              <div className="pt-2 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Agents active</span>
                <span className="font-bold text-foreground">3</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp }: { title: string, value: number, icon: React.ReactNode, trend: string, trendUp: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-muted/50 rounded-lg shrink-0">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-card-foreground">{value.toLocaleString()}</div>
        <div className="flex items-center mt-1">
          <span className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-warning'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}
