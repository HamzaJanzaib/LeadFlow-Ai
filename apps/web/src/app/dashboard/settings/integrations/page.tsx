import React from "react";

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect LeadFlow AI to your favorite tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Apollo.io</h3>
            <p className="text-sm text-muted-foreground">Connect Apollo to enrich your leads automatically.</p>
          </div>
          <div className="p-6 pt-0">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Connect Apollo</button>
          </div>
        </div>

        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Hunter.io</h3>
            <p className="text-sm text-muted-foreground">Connect Hunter to find email addresses for contacts.</p>
          </div>
          <div className="p-6 pt-0">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Connect Hunter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
