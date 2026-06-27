"use client";

import { useState } from "react";
import { Download, Search, Star, Workflow, Mail, Sparkles, Filter, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

const MOCK_TEMPLATES = [
  {
    id: "tpl_1",
    name: "Cold Outreach B2B",
    description: "A highly converting 4-step email sequence tailored for SaaS founders.",
    type: "EMAIL",
    author: "LeadFlow Official",
    installs: "1.4k",
    rating: 4.8,
    isOfficial: true,
  },
  {
    id: "tpl_2",
    name: "Lead Scoring (SaaS)",
    description: "Automated workflow to qualify leads based on intent signals and tech stack.",
    type: "WORKFLOW",
    author: "Acme Agency",
    installs: "890",
    rating: 4.9,
    isOfficial: false,
  },
  {
    id: "tpl_3",
    name: "Meeting Summarizer",
    description: "AI prompt to extract action items and next steps from a sales call transcript.",
    type: "PROMPT",
    author: "LeadFlow Official",
    installs: "3.2k",
    rating: 5.0,
    isOfficial: true,
  },
  {
    id: "tpl_4",
    name: "E-commerce Abandoned Cart",
    description: "3-part email sequence to recover lost sales with dynamic discount codes.",
    type: "EMAIL",
    author: "Growth Labs",
    installs: "2.1k",
    rating: 4.7,
    isOfficial: false,
  },
  {
    id: "tpl_5",
    name: "Competitor Analysis",
    description: "AI prompt to compare a lead's tech stack against competitors.",
    type: "PROMPT",
    author: "TechSales Pro",
    installs: "450",
    rating: 4.5,
    isOfficial: false,
  },
  {
    id: "tpl_6",
    name: "New Lead Routing",
    description: "Round-robin workflow for distributing new leads to the sales team.",
    type: "WORKFLOW",
    author: "LeadFlow Official",
    installs: "5.6k",
    rating: 4.9,
    isOfficial: true,
  },
];

export default function MarketplacePage() {
  const [filter, setFilter] = useState<"ALL" | "WORKFLOW" | "EMAIL" | "PROMPT">("ALL");

  const filteredTemplates = filter === "ALL" 
    ? MOCK_TEMPLATES 
    : MOCK_TEMPLATES.filter(t => t.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case "WORKFLOW": return <Workflow className="h-5 w-5 text-blue-500" />;
      case "EMAIL": return <Mail className="h-5 w-5 text-green-500" />;
      case "PROMPT": return <Sparkles className="h-5 w-5 text-purple-500" />;
      default: return null;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "WORKFLOW": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "EMAIL": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "PROMPT": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Marketplace</h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            Discover and import pre-built workflows, email sequences, and AI prompts created by the community and LeadFlow experts.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline">Publish Template</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <Button 
            variant={filter === "ALL" ? "default" : "ghost"} 
            onClick={() => setFilter("ALL")}
            className="rounded-full"
          >
            All Templates
          </Button>
          <Button 
            variant={filter === "WORKFLOW" ? "default" : "ghost"} 
            onClick={() => setFilter("WORKFLOW")}
            className="rounded-full gap-2"
          >
            <Workflow className="h-4 w-4" />
            Workflows
          </Button>
          <Button 
            variant={filter === "EMAIL" ? "default" : "ghost"} 
            onClick={() => setFilter("EMAIL")}
            className="rounded-full gap-2"
          >
            <Mail className="h-4 w-4" />
            Emails
          </Button>
          <Button 
            variant={filter === "PROMPT" ? "default" : "ghost"} 
            onClick={() => setFilter("PROMPT")}
            className="rounded-full gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Prompts
          </Button>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search templates..."
            className="flex h-9 w-full rounded-full border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="p-6 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  {getIcon(template.type)}
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBadgeColor(template.type)}`}>
                  {template.type}
                </span>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>
            
            <div className="p-6 pt-0 mt-auto border-t bg-muted/20">
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    {template.author}
                    {template.isOfficial && <ShieldCheck className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {template.installs}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {template.rating}
                    </span>
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Download className="h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
