"use client";

import { Workflow } from "lucide-react";

export default function WorkflowsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Workflow className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Workflows</h1>
        </div>
        <p className="text-muted-foreground">
          Automate your processes visually using a drag-and-drop workflow builder.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Workflow className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-medium text-card-foreground">Automation Builder Placeholder</h3>
        <p className="text-muted-foreground max-w-md mt-2">
          Create complex if-this-then-that routing for inbound leads and activities using the workflow engine endpoints.
        </p>
      </div>
    </div>
  );
}
