import React from "react";

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan, payment methods, and billing history.
        </p>
      </div>

      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Current Plan</h3>
          <p className="text-sm text-muted-foreground">You are currently on the Pro plan.</p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">$49/mo</p>
              <p className="text-sm text-muted-foreground">Next billing date: Jan 1, 2027</p>
            </div>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Manage in Stripe</button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Usage this month</h3>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">AI Agent Tokens</span>
              <span className="text-muted-foreground">45k / 100k</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">Email Sends</span>
              <span className="text-muted-foreground">1,200 / 5,000</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "24%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
