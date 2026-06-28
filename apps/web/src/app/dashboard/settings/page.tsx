"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";

type Organization = {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  createdAt: string;
};

export default function GeneralSettingsPage() {
  const { getToken } = useAuth();

  const { data: org, isLoading } = useQuery<Organization>({
    queryKey: ["organization", "me"],
    queryFn: async () => {
      const token = await getToken();
      return apiClient.get<Organization>("/organizations/me", { ...(token && { token }) });
    },
  });

  if (isLoading || !org) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your organization's core details.
        </p>
      </div>

      <div className="border border-border rounded-xl bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Organization Profile</h3>
          <p className="text-sm text-muted-foreground mt-2">These details identify your workspace.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Workspace Name</label>
              <div className="px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground font-medium">
                {org.name}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Workspace URL Slug</label>
              <div className="px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground font-mono">
                {org.slug}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Industry</label>
              <div className="px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground">
                {org.industry || "Not specified"}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Member Since</label>
              <div className="px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground">
                {new Date(org.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border flex justify-end">
            <button disabled className="px-4 py-2 bg-primary/50 text-primary-foreground text-sm font-medium rounded-lg cursor-not-allowed">
              Save Changes
            </button>
            <p className="text-xs text-muted-foreground ml-3 self-center">Name changes are locked on your current plan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
