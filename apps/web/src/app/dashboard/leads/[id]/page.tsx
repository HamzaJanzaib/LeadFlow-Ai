"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  Mail, 
  MapPin, 
  Zap, 
  Search,
  Users,
  Activity,
  Calendar,
  MoreHorizontal,
  Loader2,
  Megaphone,
  X
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { useState } from "react";
export default function LeadDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoaded, userId, getToken } = useAuth();
  
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");

  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const token = await getToken();
      return await apiClient.get<any>(`/leads/${id}`, { ...(token && { token }) });
    },
    enabled: isLoaded && !!userId && !!id,
  });

  const { mutate: enrichLead, isPending: isEnriching } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return await apiClient.post(`/leads/${id}/enrich`, undefined, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Enrichment job started");
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
    },
    onError: () => toast.error("Failed to start enrichment"),
  });

  const { mutate: scanWebsite, isPending: isScanning } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return await apiClient.post(`/leads/${id}/scan`, { url: lead?.website }, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Website scan job started");
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
    },
    onError: () => toast.error("Failed to start scan"),
  });

  const { mutate: deleteLead, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return await apiClient.delete(`/leads/${id}`, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Lead deleted");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      router.push("/dashboard/leads");
    },
  });

  const { data: campaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const token = await getToken();
      return await apiClient.get<any[]>("/campaigns", { ...(token && { token }) });
    },
    enabled: isLoaded && !!userId,
  });

  const { mutate: enrollInCampaign, isPending: isEnrolling } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return await apiClient.post(`/campaigns/${selectedCampaignId}/leads`, { leadId: id }, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Lead enrolled in campaign");
      setIsCampaignModalOpen(false);
      setSelectedCampaignId("");
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
    },
    onError: () => toast.error("Failed to enroll lead"),
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2">Lead not found</h2>
        <p className="text-muted-foreground mb-4">This lead may have been deleted or doesn't exist.</p>
        <Link href="/dashboard/leads" className="text-primary hover:underline">Return to Leads</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/leads" className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase">
              {lead.company.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {lead.company}
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border border-brand-200 dark:border-brand-800 uppercase tracking-wider">
                  {lead.status}
                </span>
              </h2>
              {lead.website && (
                <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-1">
                  <Globe className="w-3.5 h-3.5" /> {lead.website}
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => scanWebsite()}
            disabled={isScanning || !lead.website}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card text-card-foreground hover:bg-muted disabled:opacity-50 h-10 px-4 py-2"
          >
            {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
            Scan Site
          </button>
          <button 
            onClick={() => enrichLead()}
            disabled={isEnriching}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10 px-4 py-2 shadow-sm"
          >
            {isEnriching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
            Enrich Data
          </button>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this lead?")) {
                deleteLead();
              }
            }}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 h-10 px-4 py-2 ml-2"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-card-foreground">Company Intelligence</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Industry</div>
                  <div className="text-foreground">{lead.industry || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Employees</div>
                  <div className="text-foreground">{lead.employees ? `${lead.employees.toLocaleString()}` : "Unknown"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Revenue</div>
                  <div className="text-foreground">{lead.revenue ? `$${(lead.revenue / 1000000).toFixed(1)}M` : "Unknown"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> General Email</div>
                  <div className="text-foreground">{lead.email || "—"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> Location</div>
                  <div className="text-foreground">
                    {[lead.city, lead.country].filter(Boolean).join(", ") || "—"}
                  </div>
                </div>
              </div>
              
              {lead.description && (
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
                  <p className="text-sm text-foreground leading-relaxed">{lead.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-card-foreground">Decision Makers</h3>
              </div>
              <button className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">Add Contact</button>
            </div>
            <div className="p-6 text-center text-muted-foreground">
              <p>No contacts discovered yet.</p>
              <button 
                onClick={() => enrichLead()}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                <Zap className="w-4 h-4 mr-1" /> Run enrichment to find contacts
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Score & Activity */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-card-foreground mb-4">Lead Score</h3>
            <div className="flex items-end gap-4 mb-4">
              <div className="text-5xl font-bold text-foreground">{lead.score ?? "—"}</div>
              <div className="text-sm text-muted-foreground pb-1">out of 100</div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className={`h-3 rounded-full ${
                  (lead.score ?? 0) > 80 ? 'bg-success' : 
                  (lead.score ?? 0) > 50 ? 'bg-brand-500' : 'bg-warning'
                }`} 
                style={{ width: `${lead.score ?? 0}%` }}
              ></div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">AI Insight</div>
              {lead.aiSummary ? (
                <p className="text-sm text-foreground">{lead.aiSummary}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Run enrichment or website scan to generate insights.</p>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
             <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-card-foreground">Activity Timeline</h3>
            </div>
            <div className="p-6">
              <div className="relative border-l border-border ml-3 space-y-6">
                <div className="relative pl-6">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Lead created</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
