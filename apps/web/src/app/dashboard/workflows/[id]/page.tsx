"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Play, Pause, GitMerge, Activity, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type WorkflowNode = {
  id: string;
  type: string;
  data: any;
};

type WorkflowRun = {
  id: string;
  status: string;
  startedAt: string;
  completedAt: string;
  error?: string;
  logs: any[];
};

type WorkflowType = {
  id: string;
  name: string;
  description: string;
  status: string;
  triggerType: string;
  nodes: WorkflowNode[];
  runs: WorkflowRun[];
};

const updateWorkflowSchema = z.object({
  actionType: z.string().min(1, "Action is required"),
});
type UpdateData = z.infer<typeof updateWorkflowSchema>;

export default function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"BUILDER" | "RUNS">("BUILDER");

  const { data: workflow, isLoading } = useQuery<WorkflowType>({
    queryKey: ["workflow", resolvedParams.id],
    queryFn: async () => {
      const token = await getToken();
      return apiClient.get<WorkflowType>(`/workflows/${resolvedParams.id}`, { ...(token && { token }) });
    },
  });

  const { register, handleSubmit, setValue } = useForm<UpdateData>({
    resolver: zodResolver(updateWorkflowSchema),
  });

  // Pre-fill if there is an existing node
  if (workflow?.nodes && workflow.nodes.length > 0) {
    const node = workflow.nodes.find(n => n.type === "action");
    if (node && node.data?.actionType) {
      setTimeout(() => setValue("actionType", node.data.actionType), 0);
    }
  }

  const { mutate: updateWorkflow, isPending: isUpdating } = useMutation({
    mutationFn: async (data: UpdateData) => {
      const token = await getToken();
      const nodes = [{ id: "action_1", type: "action", data: { actionType: data.actionType } }];
      return apiClient.put(`/workflows/${resolvedParams.id}`, { 
        name: workflow?.name,
        triggerType: workflow?.triggerType,
        nodes 
      }, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Workflow rules saved");
      queryClient.invalidateQueries({ queryKey: ["workflow", resolvedParams.id] });
    },
    onError: () => toast.error("Failed to save rules"),
  });

  const { mutate: activateWorkflow, isPending: isActivating } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiClient.post(`/workflows/${resolvedParams.id}/activate`, {}, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Workflow activated!");
      queryClient.invalidateQueries({ queryKey: ["workflow", resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: () => toast.error("Failed to activate"),
  });

  const { mutate: pauseWorkflow, isPending: isPausing } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiClient.post(`/workflows/${resolvedParams.id}/pause`, {}, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Workflow paused!");
      queryClient.invalidateQueries({ queryKey: ["workflow", resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: () => toast.error("Failed to pause"),
  });

  if (isLoading || !workflow) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/workflows" className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back to Workflows
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{workflow.name}</h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              workflow.status === "ACTIVE" ? "bg-success/10 text-success" : 
              workflow.status === "DRAFT" ? "bg-muted text-muted-foreground" :
              "bg-warning/10 text-warning"
            }`}>
              {workflow.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {workflow.status === "ACTIVE" ? (
            <button
              onClick={() => pauseWorkflow()}
              disabled={isPausing}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-warning/10 text-warning hover:bg-warning/20 disabled:opacity-50 h-9 px-4"
            >
              <Pause className="w-4 h-4 mr-2" /> Pause
            </button>
          ) : (
            <button
              onClick={() => activateWorkflow()}
              disabled={isActivating}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-success text-success-foreground hover:bg-success/90 disabled:opacity-50 h-9 px-4 shadow-sm"
            >
              <Play className="w-4 h-4 mr-2" /> Activate
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("BUILDER")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "BUILDER" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <div className="flex items-center gap-2"><GitMerge className="w-4 h-4"/> Rule Builder</div>
        </button>
        <button
          onClick={() => setActiveTab("RUNS")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "RUNS" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <div className="flex items-center gap-2"><Activity className="w-4 h-4"/> Runs History ({workflow.runs?.length || 0})</div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "BUILDER" && (
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 lg:p-8 max-w-3xl">
            <form onSubmit={handleSubmit((d) => updateWorkflow(d))} className="space-y-8">
              
              {/* Trigger */}
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 shadow-sm border border-brand-500/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-semibold text-foreground uppercase tracking-wider block">When this happens</label>
                    <div className="bg-muted/50 border border-border rounded-lg p-3 text-sm text-foreground">
                      <span className="font-medium">{workflow.triggerType}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">The trigger event was set during workflow creation.</p>
                  </div>
                </div>
                
                <div className="absolute left-5 top-12 bottom-[-2rem] w-px bg-border/80 border-dashed border-l-2" />
              </div>

              {/* Action */}
              <div className="relative pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20 z-10 bg-card">
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-semibold text-foreground uppercase tracking-wider block">Then do this</label>
                    <select
                      {...register("actionType")}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select an action...</option>
                      <option value="createTask">Create a Task in CRM</option>
                      <option value="enrichLead">Enrich Lead Data</option>
                      <option value="sendNotification">Send System Notification</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border mt-8">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10 px-6 shadow-sm"
                >
                  {isUpdating ? "Saving..." : "Save Workflow Rules"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "RUNS" && (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {!workflow.runs || workflow.runs.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <Activity className="w-10 h-10 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground">No runs yet</h3>
                <p className="text-muted-foreground mt-1 max-w-sm">This workflow hasn't been triggered yet. Make sure it's active.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 font-medium text-muted-foreground">Started</th>
                      <th className="px-6 py-3 font-medium text-muted-foreground">Completed</th>
                      <th className="px-6 py-3 font-medium text-muted-foreground">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {workflow.runs.map((run) => (
                      <tr key={run.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {run.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4 text-success" /> :
                             run.status === "FAILED" ? <XCircle className="w-4 h-4 text-destructive" /> :
                             <Clock className="w-4 h-4 text-warning" />}
                            <span className={`font-medium ${
                              run.status === "COMPLETED" ? "text-success" : 
                              run.status === "FAILED" ? "text-destructive" : "text-warning"
                            }`}>
                              {run.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(run.startedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {run.completedAt ? new Date(run.completedAt).toLocaleString() : "—"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                          {run.error || run.logs?.[run.logs.length - 1]?.message || "—"}
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
