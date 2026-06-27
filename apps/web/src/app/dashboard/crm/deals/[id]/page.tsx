import React from "react";

export default function DealDetailPage({ params }: { params: { id: string } }) {
  // In a real implementation, fetch data based on params.id
  const dealId = params.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Acme Corp Enterprise License</h2>
          <p className="text-muted-foreground">Lead: Acme Corp · Owner: Demo Admin</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Edit Deal</button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2">Mark as Won</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Deal Details</h3>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Value</p>
                  <p className="text-lg font-semibold text-foreground">$12,000</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stage</p>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">Proposal Sent</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Notes & Activity</h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-sm text-muted-foreground italic">No activities logged yet.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Tasks</h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-sm text-muted-foreground">No upcoming tasks.</p>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium underline-offset-4 hover:underline text-primary h-10 px-0">Add Task</button>
            </div>
          </div>
          
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold leading-none tracking-tight">AI Meeting Brief</h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-sm text-muted-foreground">Generate a brief before your next call.</p>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full mt-2">Generate Brief</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
