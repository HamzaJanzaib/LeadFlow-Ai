"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth, useUser } from "@clerk/nextjs";
import { Users } from "lucide-react";

type TeamMember = {
  id: string;
  userId: string;
  role: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
};

export default function TeamSettingsPage() {
  const { getToken } = useAuth();
  const { user: currentUser } = useUser();

  const { data: members, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["team-members"],
    queryFn: async () => {
      const token = await getToken();
      return apiClient.get<TeamMember[]>("/organizations/me/members", { ...(token && { token }) });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Team Management</h3>
        <p className="text-sm text-muted-foreground">
          View your active workspace members and their roles.
        </p>
      </div>
      
      <div className="border border-border rounded-xl bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Invite Member</h3>
          <p className="text-sm text-muted-foreground mt-2">Send an invitation to join this workspace.</p>
        </div>
        <div className="p-6">
          <div className="flex space-x-2">
            <input 
              disabled
              className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm max-w-md cursor-not-allowed text-muted-foreground" 
              placeholder="Email address" 
            />
            <button 
              disabled
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary/50 text-primary-foreground h-10 px-4 py-2 cursor-not-allowed"
            >
              Send Invite
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Note: User invitations are managed via your central identity provider in the current configuration.
          </p>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Active Members</h3>
          <p className="text-sm text-muted-foreground mt-2">People with access to this workspace.</p>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !members || members.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Users className="w-10 h-10 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No members found</h3>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {members.map((member) => (
                <div key={member.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      {member.user?.name || "Unknown User"}
                      {member.userId === currentUser?.id && (
                        <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">You</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                  </div>
                  <div className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {member.role.replace("org:", "")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
