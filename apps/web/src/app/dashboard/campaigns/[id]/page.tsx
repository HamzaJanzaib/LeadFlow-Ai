"use client";

import { useState } from "react";
import { ArrowLeft, Play, Pause, Settings, BarChart } from "lucide-react";
import Link from "next/link";
import SequenceBuilder from "@/components/campaigns/SequenceBuilder";

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock campaign data
  const campaign = {
    id: params.id,
    name: "Q4 SaaS Founders Outreach",
    status: "DRAFT",
    channel: "EMAIL",
    fromEmail: "hello@example.com",
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b bg-background px-8 py-4">
        <div className="flex items-center space-x-4 mb-4">
          <Link 
            href="/campaigns"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
              <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                campaign.status === 'ACTIVE' 
                  ? 'border-transparent bg-primary/10 text-primary'
                  : 'border-transparent bg-secondary text-secondary-foreground'
              }`}>
                {campaign.status}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {campaign.status === "DRAFT" || campaign.status === "PAUSED" ? (
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                  <Play className="mr-2 h-4 w-4" />
                  Launch Campaign
                </button>
              ) : (
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 text-sm font-medium text-muted-foreground">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`pb-3 border-b-2 transition-colors ${activeTab === "overview" ? "border-primary text-foreground" : "border-transparent hover:text-foreground"}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("sequence")}
            className={`pb-3 border-b-2 transition-colors ${activeTab === "sequence" ? "border-primary text-foreground" : "border-transparent hover:text-foreground"}`}
          >
            Sequence Builder
          </button>
          <button 
            onClick={() => setActiveTab("leads")}
            className={`pb-3 border-b-2 transition-colors ${activeTab === "leads" ? "border-primary text-foreground" : "border-transparent hover:text-foreground"}`}
          >
            Leads
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`pb-3 border-b-2 transition-colors ${activeTab === "settings" ? "border-primary text-foreground" : "border-transparent hover:text-foreground"}`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-muted/20">
        {activeTab === "overview" && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <h3 className="text-lg font-semibold">Campaign Metrics</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              {[
                { label: "Sent", value: campaign.stats.sent },
                { label: "Delivered", value: campaign.stats.delivered },
                { label: "Opened", value: `${campaign.stats.opened}%` },
                { label: "Clicked", value: `${campaign.stats.clicked}%` },
                { label: "Replied", value: `${campaign.stats.replied}%` },
                { label: "Bounced", value: `${campaign.stats.bounced}%` },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                  <h4 className="text-sm font-medium text-muted-foreground">{stat.label}</h4>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center justify-center h-64 text-muted-foreground">
              <BarChart className="h-12 w-12 mb-4 opacity-20" />
              <p>Launch campaign to see detailed timeline analytics.</p>
            </div>
          </div>
        )}

        {activeTab === "sequence" && (
           <SequenceBuilder campaignId={campaign.id} />
        )}

        {activeTab === "leads" && (
          <div className="p-8 max-w-6xl mx-auto">
            <div className="rounded-md border bg-card">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Enrolled Leads</h3>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2">
                  Add Leads
                </button>
              </div>
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                <p>No leads enrolled in this campaign yet.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-8 max-w-3xl mx-auto space-y-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-semibold">General Settings</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name</label>
                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={campaign.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">From Email</label>
                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={campaign.fromEmail} disabled />
              </div>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Save Changes
              </button>
            </div>
            
            <div className="rounded-xl border border-destructive/50 bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">Once you delete a campaign, there is no going back. Please be certain.</p>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                Delete Campaign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
