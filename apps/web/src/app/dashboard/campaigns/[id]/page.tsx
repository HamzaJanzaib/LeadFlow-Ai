"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Play, Pause, Plus, Clock, Save, Edit2, Check, Send, Users, Settings } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Step = {
  id: string;
  stepNumber: number;
  dayDelay: number;
  subjectTemplate: string;
  bodyTemplate: string;
};

type Sequence = {
  id: string;
  name: string;
  steps: Step[];
};

type Lead = {
  id: string;
  company: string;
  contacts: any[];
  email: string;
};

type CampaignLead = {
  id: string;
  lead: Lead;
  status: string;
  enrolledAt: string;
};

type Campaign = {
  id: string;
  name: string;
  status: string;
  channel: string;
  totalSent: number;
  totalOpened: number;
  sequences: Sequence[];
  campaignLeads: CampaignLead[];
};

const stepSchema = z.object({
  subjectTemplate: z.string().min(1, "Subject is required"),
  bodyTemplate: z.string().min(1, "Body is required"),
  dayDelay: z.number().min(0, "Delay must be 0 or greater"),
});
type StepData = z.infer<typeof stepSchema>;

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"SEQUENCE" | "LEADS" | "SETTINGS">("SEQUENCE");

  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [isAddingStep, setIsAddingStep] = useState(false);

  const { register: registerStep, handleSubmit: handleSubmitStep, reset: resetStep, setValue } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: { dayDelay: 1, subjectTemplate: "", bodyTemplate: "" }
  });

  const { data: campaign, isLoading } = useQuery<Campaign>({
    queryKey: ["campaign", resolvedParams.id],
    queryFn: async () => {
      const token = await getToken();
      return apiClient.get<Campaign>(`/campaigns/${resolvedParams.id}`, { ...(token && { token }) });
    },
  });

  const { mutate: launchCampaign, isPending: isLaunching } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiClient.post(`/campaigns/${resolvedParams.id}/launch`, {}, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Campaign launched!");
      queryClient.invalidateQueries({ queryKey: ["campaign", resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Failed to launch"),
  });

  const { mutate: pauseCampaign, isPending: isPausing } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiClient.post(`/campaigns/${resolvedParams.id}/pause`, {}, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Campaign paused!");
      queryClient.invalidateQueries({ queryKey: ["campaign", resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: () => toast.error("Failed to pause"),
  });

  const { mutate: createSequence, isPending: isCreatingSeq } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiClient.post(`/campaigns/${resolvedParams.id}/sequences`, { name: "Default Sequence" }, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Sequence initialized");
      queryClient.invalidateQueries({ queryKey: ["campaign", resolvedParams.id] });
    },
  });

  const { mutate: addStep, isPending: isAdding } = useMutation({
    mutationFn: async (data: StepData) => {
      const token = await getToken();
      const seqId = campaign?.sequences?.[0]?.id;
      if (!seqId) throw new Error("No sequence found");
      const stepNumber = (campaign?.sequences?.[0]?.steps?.length || 0) + 1;
      return apiClient.post(`/campaigns/${resolvedParams.id}/sequences/${seqId}/steps`, { ...data, stepNumber }, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Step added");
      setIsAddingStep(false);
      resetStep();
      queryClient.invalidateQueries({ queryKey: ["campaign", resolvedParams.id] });
    },
  });

  const { mutate: updateStep, isPending: isUpdating } = useMutation({
    mutationFn: async (data: StepData & { stepId: string }) => {
      const token = await getToken();
      const seqId = campaign?.sequences?.[0]?.id;
      if (!seqId) throw new Error("No sequence found");
      return apiClient.put(`/campaigns/${resolvedParams.id}/sequences/${seqId}/steps/${data.stepId}`, data, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Step updated");
      setEditingStepId(null);
      resetStep();
      queryClient.invalidateQueries({ queryKey: ["campaign", resolvedParams.id] });
    },
  });

  if (isLoading || !campaign) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sequence = campaign.sequences?.[0];
  const leads = campaign.campaignLeads || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/campaigns" className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back to Campaigns
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{campaign.name}</h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              campaign.status === "ACTIVE" ? "bg-success/10 text-success" : 
              campaign.status === "DRAFT" ? "bg-muted text-muted-foreground" :
              "bg-warning/10 text-warning"
            }`}>
              {campaign.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {campaign.status === "ACTIVE" ? (
            <button
              onClick={() => pauseCampaign()}
              disabled={isPausing}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-warning/10 text-warning hover:bg-warning/20 disabled:opacity-50 h-9 px-4"
            >
              <Pause className="w-4 h-4 mr-2" /> Pause
            </button>
          ) : (
            <button
              onClick={() => launchCampaign()}
              disabled={isLaunching || !sequence || sequence.steps.length === 0}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 h-9 px-4 shadow-sm"
            >
              <Play className="w-4 h-4 mr-2" /> Launch Campaign
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("SEQUENCE")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "SEQUENCE" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <div className="flex items-center gap-2"><Send className="w-4 h-4"/> Sequence</div>
        </button>
        <button
          onClick={() => setActiveTab("LEADS")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "LEADS" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <div className="flex items-center gap-2"><Users className="w-4 h-4"/> Enrolled Leads ({leads.length})</div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        
        {/* SEQUENCE TAB */}
        {activeTab === "SEQUENCE" && (
          <div className="space-y-6">
            {!sequence ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center shadow-sm">
                <Send className="w-10 h-10 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground">No Sequence Found</h3>
                <p className="text-muted-foreground mt-1 mb-6 max-w-sm">Create a sequence to define the steps for your outreach campaign.</p>
                <button
                  onClick={() => createSequence()}
                  disabled={isCreatingSeq}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" /> Initialize Sequence
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sequence.steps.map((step, index) => {
                  const isEditing = editingStepId === step.id;
                  return (
                    <div key={step.id} className="relative">
                      {index > 0 && (
                        <div className="absolute -top-4 left-6 w-0.5 h-4 bg-border" />
                      )}
                      <div className={`bg-card border ${isEditing ? 'border-primary shadow-md' : 'border-border shadow-sm'} rounded-xl p-5 transition-all`}>
                        {isEditing ? (
                          <form onSubmit={handleSubmitStep((d) => updateStep({ ...d, stepId: step.id }))} className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                Step {step.stepNumber}
                              </div>
                              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Wait</span>
                                <input
                                  type="number"
                                  {...registerStep("dayDelay", { valueAsNumber: true })}
                                  className="w-16 bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-primary"
                                />
                                <span className="text-sm text-muted-foreground">days</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Subject</label>
                                <input
                                  {...registerStep("subjectTemplate")}
                                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="E.g. Quick question regarding {{company}}"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Body</label>
                                <textarea
                                  {...registerStep("bodyTemplate")}
                                  rows={6}
                                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                                  placeholder="Hi {{firstName}},\n\nI noticed {{company}}..."
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => { setEditingStepId(null); resetStep(); }}
                                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isUpdating}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 shadow-sm"
                              >
                                {isUpdating ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Step</>}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-sm">
                                  {step.stepNumber}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-foreground">{step.subjectTemplate}</h4>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5" />
                                    {index === 0 ? "Sends immediately" : `Waits ${step.dayDelay} days after previous step`}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingStepId(step.id);
                                  setIsAddingStep(false);
                                  setValue("subjectTemplate", step.subjectTemplate);
                                  setValue("bodyTemplate", step.bodyTemplate);
                                  setValue("dayDelay", step.dayDelay);
                                }}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="mt-3 pl-11">
                              <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-sm text-foreground/80 font-mono text-xs whitespace-pre-wrap">
                                {step.bodyTemplate}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add Step Form / Button */}
                {isAddingStep ? (
                  <div className="relative mt-4">
                    <div className="absolute -top-4 left-6 w-0.5 h-4 bg-border" />
                    <div className="bg-card border border-primary shadow-md rounded-xl p-5">
                      <form onSubmit={handleSubmitStep((d) => addStep(d))} className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            Step {(sequence.steps.length || 0) + 1}
                          </div>
                          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Wait</span>
                            <input
                              type="number"
                              {...registerStep("dayDelay", { valueAsNumber: true })}
                              className="w-16 bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-primary"
                            />
                            <span className="text-sm text-muted-foreground">days</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Subject</label>
                            <input
                              {...registerStep("subjectTemplate")}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="E.g. Following up regarding {{company}}"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Body</label>
                            <textarea
                              {...registerStep("bodyTemplate")}
                              rows={6}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                              placeholder="Hi {{firstName}},\n\nJust bubbling this up..."
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => { setIsAddingStep(false); resetStep(); }}
                            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isAdding}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 shadow-sm"
                          >
                            {isAdding ? "Adding..." : <><Plus className="w-4 h-4 mr-2" /> Add Step</>}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="relative mt-4">
                    {sequence.steps.length > 0 && <div className="absolute -top-4 left-6 w-0.5 h-4 bg-border" />}
                    <button
                      onClick={() => {
                        setIsAddingStep(true);
                        setEditingStepId(null);
                        resetStep({ dayDelay: sequence.steps.length > 0 ? 3 : 0, subjectTemplate: "", bodyTemplate: "" });
                      }}
                      className="w-full py-4 border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Step
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "LEADS" && (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {leads.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <Users className="w-10 h-10 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground">No leads enrolled</h3>
                <p className="text-muted-foreground mt-1 max-w-sm">Go to your Leads dashboard and select "Add to Campaign" to enroll them here.</p>
                <Link href="/dashboard/leads" className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4">
                  Go to Leads
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-medium text-muted-foreground">Lead</th>
                      <th className="px-6 py-3 font-medium text-muted-foreground">Email</th>
                      <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 font-medium text-muted-foreground">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leads.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{enrollment.lead.company}</td>
                        <td className="px-6 py-4 text-muted-foreground">{enrollment.lead.email || "No email"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            enrollment.status === "ACTIVE" ? "bg-brand-500/10 text-brand-600" : "bg-muted text-muted-foreground"
                          }`}>
                            {enrollment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
