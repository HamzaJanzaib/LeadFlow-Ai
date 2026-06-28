"use client";

import { Megaphone } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Megaphone className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Campaigns</h1>
        </div>
        <p className="text-muted-foreground">
          Design, launch, and monitor automated outbound sequences.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Megaphone className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-medium text-card-foreground">Sequence Builder Incoming</h3>
        <p className="text-muted-foreground max-w-md mt-2">
          Connect your sender domains, generate AI sequences, and review launch metrics here.
        </p>
      </div>
    </div>
  );
}
