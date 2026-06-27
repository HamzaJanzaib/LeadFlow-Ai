import React from "react";

export default function TeamSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Team Management</h3>
        <p className="text-sm text-muted-foreground">
          Invite new members and manage their roles within the workspace.
        </p>
      </div>
      
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Invite Member</h3>
          <p className="text-sm text-muted-foreground">Send an invitation to join this workspace.</p>
        </div>
        <div className="p-6 pt-0">
          <form className="flex space-x-2">
            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm max-w-md" placeholder="Email address" type="email" required />
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2" type="submit">Send Invite</button>
          </form>
        </div>
      </div>

      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Active Members</h3>
          <p className="text-sm text-muted-foreground">People with access to this workspace.</p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium text-foreground">Demo Admin</p>
                <p className="text-sm text-muted-foreground">admin@example.com</p>
              </div>
              <div className="text-sm text-muted-foreground">Owner</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
