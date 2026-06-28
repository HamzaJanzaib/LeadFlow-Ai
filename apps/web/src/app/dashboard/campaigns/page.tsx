"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { Megaphone, Plus, Search, Mail, Send, Activity, MoreVertical, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Types
type Campaign = {
  id: string;
  name: string;
  status: string;
  channel: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalReplied: number;
  createdAt: string;
};

// Form Schema
const createCampaignSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  channel: z.literal("EMAIL"), // Defaulting to EMAIL for now
  fromEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
});

type CreateCampaignData = z.infer<typeof createCampaignSchema>;

export default function CampaignsPage() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const token = await getToken();
      return apiClient.get<Campaign[]>("/campaigns", { ...(token && { token }) });
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateCampaignData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: { channel: "EMAIL" }
  });

  const { mutate: createCampaign, isPending } = useMutation({
    mutationFn: async (data: CreateCampaignData) => {
      const token = await getToken();
      return apiClient.post<Campaign>("/campaigns", data, { ...(token && { token }) });
    },
    onSuccess: (newCampaign) => {
      toast.success("Campaign created");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setIsModalOpen(false);
      reset();
      router.push(`/dashboard/campaigns/${newCampaign.id}`);
    },
    onError: () => toast.error("Failed to create campaign"),
  });

  const filteredCampaigns = campaigns?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-card p-2 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            Loading campaigns...
          </div>
        ) : filteredCampaigns?.length === 0 ? (
          <div className="col-span-full py-16 bg-card border border-border rounded-xl shadow-sm text-center flex flex-col items-center justify-center">
            <Megaphone className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No campaigns found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">Get started by creating your first automated outreach campaign.</p>
          </div>
        ) : (
          filteredCampaigns?.map((campaign) => (
            <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`} className="group block">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-card hover:border-brand-500/30 transition-all h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-brand-500 transition-colors">{campaign.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        campaign.status === "ACTIVE" ? "bg-success/10 text-success" : 
                        campaign.status === "DRAFT" ? "bg-muted text-muted-foreground" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {campaign.status}
                      </span>
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1" /> {campaign.channel}
                      </span>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Send className="w-3 h-3"/> Sent</p>
                    <p className="font-semibold text-foreground">{campaign.totalSent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Opened</p>
                    <p className="font-semibold text-foreground">{campaign.totalOpened}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
          <div className="bg-card border border-border shadow-lg rounded-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
              <h2 className="text-lg font-semibold text-foreground">Create Campaign</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit((d) => createCampaign(d))} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Campaign Name</label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. Q3 Startup Outreach"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">From Email <span className="text-muted-foreground font-normal">(Optional)</span></label>
                <input
                  {...register("fromEmail")}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="hello@yourcompany.com"
                />
                {errors.fromEmail && <p className="text-xs text-destructive">{errors.fromEmail.message}</p>}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 px-4 py-2 shadow-sm"
                >
                  {isPending ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
