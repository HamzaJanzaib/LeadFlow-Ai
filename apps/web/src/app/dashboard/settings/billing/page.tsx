"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { CreditCard, CheckCircle2, Zap } from "lucide-react";

export default function BillingSettingsPage() {
  const { getToken } = useAuth();

  const { mutate: createCheckoutSession, isPending } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      // Use the Stripe test price ID that would normally be environment-configured
      // Using a placeholder price ID for demonstration purposes
      const response = await apiClient.post<{ url: string }>(
        "/billing/checkout",
        {
          priceId: "price_1PlaceholderId",
          successUrl: `${window.location.origin}/dashboard/settings/billing?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/settings/billing?canceled=true`,
        },
        { ...(token && { token }) }
      );
      return response;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan, payment methods, and billing history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Plan */}
        <div className="border border-border rounded-xl bg-card text-card-foreground shadow-sm">
          <div className="p-6 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Current Plan</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Free Tier</h4>
                <p className="text-sm text-muted-foreground">Perfect for exploring the platform.</p>
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Leads</span>
                <span className="font-medium text-foreground">50 / 100</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/2"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Campaigns</span>
                <span className="font-medium text-foreground">1 / 1</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-warning w-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Plan */}
        <div className="border-2 border-brand-500/50 rounded-xl bg-brand-500/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
            Recommended
          </div>
          <div className="p-6 border-b border-brand-500/10">
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-500" />
              Pro Plan
            </h3>
            <p className="text-3xl font-bold mt-4">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </div>
          <div className="p-6 space-y-4">
            <ul className="space-y-3">
              {['Unlimited Active Leads', 'Unlimited Campaigns', 'Advanced Analytics', 'Priority Support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => createCheckoutSession()}
              disabled={isPending}
              className="w-full mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 h-10 px-4 shadow-sm"
            >
              {isPending ? "Connecting to Stripe..." : "Upgrade to Pro"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
