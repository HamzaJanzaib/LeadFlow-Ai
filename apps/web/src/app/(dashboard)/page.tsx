"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Users, Megaphone, MousePointerClick, MessageSquareReply, ArrowRight, Bot, Target } from "lucide-react";

export default function DashboardHomePage() {
  const { isLoaded, userId } = useAuth();
  
  const { data: overview, isLoading } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const data = await apiClient.get<any>("/analytics/overview");
      return data;
    },
    enabled: isLoaded && !!userId,
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here's a quick summary of what's happening in your LeadFlow workspace today.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Leads" 
            value={overview?.totalLeads ?? 0} 
            icon={<Users className="w-5 h-5 text-blue-500" />}
          />
          <StatCard 
            title="Active Campaigns" 
            value={overview?.totalCampaigns ?? 0} 
            icon={<Megaphone className="w-5 h-5 text-indigo-500" />}
          />
          <StatCard 
            title="Emails Opened" 
            value={overview?.emails.opened ?? 0} 
            icon={<MousePointerClick className="w-5 h-5 text-green-500" />}
          />
          <StatCard 
            title="Total Replies" 
            value={overview?.emails.replied ?? 0} 
            icon={<MessageSquareReply className="w-5 h-5 text-emerald-500" />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <Link href="/leads" className="block">
            <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-500 transition-colors flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-500">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Find Leads</h3>
                  <p className="text-sm text-gray-500">Discover new prospects</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
          
          <Link href="/campaigns/new" className="block">
            <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-indigo-500 transition-colors flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-indigo-500">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Create Campaign</h3>
                  <p className="text-sm text-gray-500">Launch a new sequence</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
          </Link>

          <Link href="/ai-assistant" className="block">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-5 hover:opacity-90 transition-opacity flex items-center justify-between group cursor-pointer text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium">AI Assistant</h3>
                  <p className="text-sm text-blue-100">Let AI do the work for you</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-100 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>

        {/* Placeholder for Recent Leads / Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col h-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link href="/analytics" className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                View Full Analytics
              </Link>
            </div>
            <div className="p-6 flex-1 flex items-center justify-center text-center">
              <div>
                <Bot className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No recent activity</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                  Run a lead discovery scan or launch a campaign to see your real-time feed update here.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link href="/ai-assistant" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Talk to AI
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value.toLocaleString()}</div>
      </div>
    </div>
  );
}
