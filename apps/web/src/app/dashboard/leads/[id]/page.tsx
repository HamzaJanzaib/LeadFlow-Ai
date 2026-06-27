"use client";

import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Mail, ExternalLink, Activity, Globe, Sparkles } from "lucide-react";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  // Mock data for display
  const lead = {
    id: params.id,
    company: "Acme Corp",
    email: "contact@acme.com",
    status: "ENRICHED",
    score: 85,
    industry: "Technology",
    website: "https://acme.com",
    employees: 150,
    revenue: "$5M - $10M",
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/leads" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{lead.company}</h2>
          <p className="text-muted-foreground flex items-center mt-1">
            <Globe className="h-4 w-4 mr-1" />
            <a href={lead.website} target="_blank" rel="noreferrer" className="hover:underline">{lead.website}</a>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Mail className="mr-2 h-4 w-4" /> Email
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-destructive hover:text-destructive-foreground h-10 px-4 py-2 text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Lead Score</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-green-500">{lead.score} / 100</div>
          <p className="text-xs text-muted-foreground mt-1">High conversion probability</p>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Status</h3>
          </div>
          <div className="text-2xl font-bold">{lead.status}</div>
          <p className="text-xs text-muted-foreground mt-1">Ready for outreach</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Company Size</h3>
          </div>
          <div className="text-2xl font-bold">{lead.employees}</div>
          <p className="text-xs text-muted-foreground mt-1">Employees</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Est. Revenue</h3>
          </div>
          <div className="text-2xl font-bold">{lead.revenue}</div>
          <p className="text-xs text-muted-foreground mt-1">Annual recurring</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-4 p-6">
          <div className="flex flex-col space-y-1.5 pb-4">
            <h3 className="font-semibold leading-none tracking-tight">Enrichment Data</h3>
            <p className="text-sm text-muted-foreground">Data gathered from Apollo & Hunter.io</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Industry</p>
                <p className="text-base">{lead.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Primary Contact</p>
                <p className="text-base flex items-center">
                  {lead.email} <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Technologies Detected</p>
                <div className="flex flex-wrap gap-2">
                  {["React", "Vercel", "Tailwind CSS", "Stripe"].map((tech) => (
                    <span key={tech} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-3 p-6">
          <div className="flex flex-col space-y-1.5 pb-4">
            <h3 className="font-semibold leading-none tracking-tight">Website Audit</h3>
            <p className="text-sm text-muted-foreground">Latest scan results</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Performance</span>
              <span className="text-sm font-bold text-yellow-500">72</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "72%" }}></div>
            </div>

            <div className="flex justify-between items-center mb-2 mt-4">
              <span className="text-sm font-medium">SEO</span>
              <span className="text-sm font-bold text-green-500">95</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <p className="text-sm font-semibold flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                AI Sales Insight
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                "Their website performance is lagging due to heavy images. Pitch our fast-loading CDN integration services."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Outreach Panel */}
      <div className="rounded-xl border border-primary/20 bg-card text-card-foreground shadow-sm">
        <div className="p-6 pb-4 border-b bg-muted/30">
          <h3 className="font-semibold leading-none tracking-tight flex items-center text-lg">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Outreach Generator
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Generate a highly personalized email sequence based on {lead.company}'s data.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 transition-colors hover:bg-primary/90">
              Generate Draft
            </button>
            <div className="flex-1 bg-muted rounded-md border p-4 text-sm text-muted-foreground font-mono">
              // Click generate to see drafted email...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
