import React from "react";

export default function ApiKeysSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Generate and manage API keys to programmatically interact with your workspace.
        </p>
      </div>

      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Your API Keys</h3>
          <p className="text-sm text-muted-foreground">Do not share your API keys with anyone.</p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2">Generate New Key</button>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground italic">You haven't generated any API keys yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
