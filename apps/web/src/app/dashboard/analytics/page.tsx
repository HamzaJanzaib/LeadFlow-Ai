"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        </div>
        <p className="text-muted-foreground">
          Gain insights into your funnels, active campaigns, and overall revenue metrics.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-medium text-card-foreground">Metrics Dashboard Preparing</h3>
        <p className="text-muted-foreground max-w-md mt-2">
          Charts and graphs mapping to the /analytics API endpoints will be visualized here.
        </p>
      </div>
    </div>
  );
}
