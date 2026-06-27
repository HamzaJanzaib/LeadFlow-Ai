"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { 
  Users, 
  Megaphone, 
  Mail, 
  MousePointerClick, 
  MessageSquareReply, 
  AlertTriangle 
} from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";

export default function AnalyticsPage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const data = await apiClient.get<any>("/analytics/overview");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor your lead generation and outreach performance in real-time.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard 
          title="Total Leads" 
          value={overview?.totalLeads ?? 0} 
          icon={<Users className="w-5 h-5 text-blue-500" />}
          description="Total leads in database"
        />
        <KpiCard 
          title="Active Campaigns" 
          value={overview?.totalCampaigns ?? 0} 
          icon={<Megaphone className="w-5 h-5 text-indigo-500" />}
          description="Total campaigns created"
        />
        <KpiCard 
          title="Enrolled Leads" 
          value={overview?.activeLeads ?? 0} 
          icon={<Users className="w-5 h-5 text-violet-500" />}
          description="Currently active in sequences"
        />
        <KpiCard 
          title="Emails Sent" 
          value={overview?.emails.sent ?? 0} 
          icon={<Mail className="w-5 h-5 text-gray-500" />}
        />
        <KpiCard 
          title="Emails Opened" 
          value={overview?.emails.opened ?? 0} 
          icon={<MousePointerClick className="w-5 h-5 text-green-500" />}
        />
        <KpiCard 
          title="Replies Received" 
          value={overview?.emails.replied ?? 0} 
          icon={<MessageSquareReply className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      <AnalyticsCharts />
    </div>
  );
}

function KpiCard({ title, value, icon, description }: { title: string, value: number, icon: React.ReactNode, description?: string }) {
  return (
    <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
