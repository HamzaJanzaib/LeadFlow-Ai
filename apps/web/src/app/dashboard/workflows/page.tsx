"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { Workflow, Plus, Search, GitMerge, Activity, MoreVertical, X, Calendar } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Types
type WorkflowType = {
  id: string;
  name: string;
  description: string;
  status: string;
  triggerType: string;
  createdAt: string;
};

// Form Schema
const createWorkflowSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  triggerType: z.string().min(1, "Trigger type is required"),
});

type CreateWorkflowData = z.infer<typeof createWorkflowSchema>;

export default function WorkflowsPage() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: workflows, isLoading } = useQuery<WorkflowType[]>({
    queryKey: ["workflows"],
    queryFn: async () => {
      const token = await getToken();
      return apiClient.get<WorkflowType[]>("/workflows", { ...(token && { token }) });
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateWorkflowData>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: { triggerType: "LEAD_CREATED" }
  });

  const { mutate: createWorkflow, isPending } = useMutation({
    mutationFn: async (data: CreateWorkflowData) => {
      const token = await getToken();
      return apiClient.post<WorkflowType>("/workflows", data, { ...(token && { token }) });
    },
    onSuccess: (newWf) => {
      toast.success("Workflow created");
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      setIsModalOpen(false);
      reset();
      router.push(`/dashboard/workflows/${newWf.id}`);
    },
    onError: () => toast.error("Failed to create workflow"),
  });

  const filteredWorkflows = workflows?.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Workflow className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Workflows</h1>
          </div>
          <p className="text-muted-foreground">
            Automate tasks and orchestrate your entire lead funnel.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-card p-2 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workflows..."
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
            Loading workflows...
          </div>
        ) : filteredWorkflows?.length === 0 ? (
          <div className="col-span-full py-16 bg-card border border-border rounded-xl shadow-sm text-center flex flex-col items-center justify-center">
            <GitMerge className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No workflows found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">Get started by creating your first automation rule.</p>
          </div>
        ) : (
          filteredWorkflows?.map((wf) => (
            <Link key={wf.id} href={`/dashboard/workflows/${wf.id}`} className="group block">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-card hover:border-brand-500/30 transition-all h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-brand-500 transition-colors">{wf.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        wf.status === "ACTIVE" ? "bg-success/10 text-success" : 
                        wf.status === "DRAFT" ? "bg-muted text-muted-foreground" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {wf.status}
                      </span>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Activity className="w-4 h-4 text-brand-500" />
                    <span>Trigger: <span className="font-medium text-foreground">{wf.triggerType}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    Created {new Date(wf.createdAt).toLocaleDateString()}
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
              <h2 className="text-lg font-semibold text-foreground">Create Workflow</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit((d) => createWorkflow(d))} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Workflow Name</label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. Follow up after Lead creation"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description <span className="text-muted-foreground font-normal">(Optional)</span></label>
                <input
                  {...register("description")}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="What does this workflow do?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Trigger</label>
                <select
                  {...register("triggerType")}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="LEAD_CREATED">Lead Created</option>
                  <option value="DEAL_WON">Deal Won</option>
                  <option value="EMAIL_OPENED">Email Opened</option>
                </select>
                {errors.triggerType && <p className="text-xs text-destructive">{errors.triggerType.message}</p>}
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
                  {isPending ? "Creating..." : "Create Workflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
