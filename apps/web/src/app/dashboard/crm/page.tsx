"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

// Mock kanban data
const INITIAL_STAGES = [
  { id: "s1", name: "Lead", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "s2", name: "Contacted", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "s3", name: "Meeting", color: "bg-purple-100 dark:bg-purple-900" },
  { id: "s4", name: "Proposal", color: "bg-orange-100 dark:bg-orange-900" },
  { id: "s5", name: "Won", color: "bg-green-100 dark:bg-green-900" },
];

const INITIAL_DEALS = [
  { id: "d1", title: "Website Redesign", company: "Acme Corp", value: "$12,000", stageId: "s1" },
  { id: "d2", title: "SEO Optimization", company: "Globex", value: "$5,500", stageId: "s2" },
  { id: "d3", title: "Marketing Retainer", company: "Soylent", value: "$3,000/mo", stageId: "s4" },
];

export default function CRMPage() {
  const [deals] = useState(INITIAL_DEALS);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Sales Pipeline</h2>
          <p className="text-muted-foreground mt-1">Manage your active deals and track progress.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow">
            <Plus className="mr-2 h-4 w-4" /> New Deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex h-full gap-4 min-w-max">
          {INITIAL_STAGES.map((stage) => (
            <div key={stage.id} className="flex flex-col w-80 shrink-0">
              <div className={`flex items-center justify-between p-3 rounded-t-lg border border-b-0 font-medium ${stage.color}`}>
                <span className="text-sm">{stage.name}</span>
                <span className="text-xs bg-background/50 px-2 py-0.5 rounded-full">
                  {deals.filter(d => d.stageId === stage.id).length}
                </span>
              </div>
              <div className="flex-1 border border-t-0 rounded-b-lg bg-muted/30 p-3 space-y-3">
                {deals.filter(d => d.stageId === stage.id).map(deal => (
                  <div key={deal.id} className="group relative bg-card p-4 rounded-lg border shadow-sm cursor-grab hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold text-sm mb-1">{deal.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{deal.company}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">{deal.value}</span>
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                        {deal.company.charAt(0)}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full py-2 flex items-center justify-center text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-dashed border-transparent hover:border-input">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
