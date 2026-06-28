"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { Plus, Briefcase, Loader2, MoreHorizontal, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface Pipeline {
  id: string;
  name: string;
  stages: { name: string; color: string; order: number }[];
  currency: string;
}

interface Deal {
  id: string;
  title: string;
  value: number | null;
  currency: string;
  stage: string;
  probability: number | null;
  pipelineId: string;
}

export default function CRMPage() {
  const { isLoaded, userId, getToken } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Pipelines
  const { data: pipelines, isLoading: isLoadingPipelines } = useQuery<Pipeline[]>({
    queryKey: ["pipelines"],
    queryFn: async () => {
      const token = await getToken();
      return await apiClient.get<Pipeline[]>("/crm/pipelines", { ...(token && { token }) });
    },
    enabled: isLoaded && !!userId,
  });

  const activePipeline = pipelines?.[0]; // Default to first pipeline

  // Fetch Deals
  const { data: deals, isLoading: isLoadingDeals } = useQuery<Deal[]>({
    queryKey: ["deals", activePipeline?.id],
    queryFn: async () => {
      const token = await getToken();
      return await apiClient.get<Deal[]>(`/crm/deals?pipelineId=${activePipeline?.id}`, { ...(token && { token }) });
    },
    enabled: !!activePipeline?.id && isLoaded && !!userId,
  });

  // Mutation to update deal stage
  const { mutate: updateDealStage, isPending: isUpdatingStage } = useMutation({
    mutationFn: async ({ dealId, stage }: { dealId: string; stage: string }) => {
      const token = await getToken();
      return await apiClient.put(`/crm/deals/${dealId}/stage`, { stage }, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Deal stage updated");
      queryClient.invalidateQueries({ queryKey: ["deals", activePipeline?.id] });
    },
    onError: () => toast.error("Failed to update deal stage"),
  });

  if (isLoadingPipelines || isLoadingDeals) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!activePipeline) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-medium text-card-foreground">No Pipelines Found</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            You need to create a pipeline first to start managing deals.
          </p>
        </div>
      </div>
    );
  }

  // Group deals by stage
  const dealsByStage = activePipeline.stages.reduce((acc, stage) => {
    acc[stage.name.toUpperCase()] = deals?.filter(d => d.stage === stage.name.toUpperCase()) || [];
    return acc;
  }, {} as Record<string, Deal[]>);

  const getNextStage = (currentStage: string) => {
    const stages = activePipeline?.stages || [];
    if (!stages.length) return null;
    const currentIndex = stages.findIndex(s => s.name.toUpperCase() === currentStage);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      return stages[currentIndex + 1]?.name.toUpperCase() || null;
    }
    return null;
  };

  const getPrevStage = (currentStage: string) => {
    const stages = activePipeline?.stages || [];
    if (!stages.length) return null;
    const currentIndex = stages.findIndex(s => s.name.toUpperCase() === currentStage);
    if (currentIndex > 0) {
      return stages[currentIndex - 1]?.name.toUpperCase() || null;
    }
    return null;
  };

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8 pt-6 h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {activePipeline.name} Pipeline
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your deals across stages.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            href={`/dashboard/crm/new?pipelineId=${activePipeline.id}`} 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Deal
          </Link>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto mt-6 pb-4">
        <div className="flex gap-6 h-full min-h-[600px] items-start w-max">
          {activePipeline.stages.map((stage) => {
            const stageDeals = dealsByStage[stage.name.toUpperCase()] || [];
            const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

            return (
              <div key={stage.name} className="flex flex-col w-80 flex-shrink-0">
                {/* Column Header */}
                <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stage.color === 'gray' ? '#9ca3af' : stage.color === 'blue' ? '#3b82f6' : stage.color === 'green' ? '#22c55e' : stage.color === 'red' ? '#ef4444' : stage.color === 'yellow' ? '#eab308' : stage.color === 'purple' ? '#a855f7' : stage.color === 'pink' ? '#ec4899' : stage.color === 'orange' ? '#f97316' : stage.color }}
                    />
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{stage.name}</h3>
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                      {stageDeals.length}
                    </span>
                  </div>
                  {totalValue > 0 && (
                    <div className="text-xs font-medium text-muted-foreground">
                      ${totalValue.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Deals List */}
                <div className="flex flex-col gap-3">
                  {stageDeals.map((deal) => {
                    const nextStage = getNextStage(deal.stage);
                    const prevStage = getPrevStage(deal.stage);

                    return (
                      <div 
                        key={deal.id} 
                        className="bg-card border border-border rounded-xl shadow-sm p-4 hover:border-brand-300 dark:hover:border-brand-700 transition-colors group flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
                            {deal.title}
                          </h4>
                        </div>
                        
                        {deal.value != null && (
                          <div className="text-lg font-bold text-foreground mt-1">
                            ${deal.value.toLocaleString()}
                          </div>
                        )}
                        
                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => prevStage && updateDealStage({ dealId: deal.id, stage: prevStage })}
                            disabled={!prevStage || isUpdatingStage}
                            className={`p-1 rounded hover:bg-muted ${!prevStage ? 'invisible' : ''}`}
                            title="Move to previous stage"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          
                          <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => nextStage && updateDealStage({ dealId: deal.id, stage: nextStage })}
                            disabled={!nextStage || isUpdatingStage}
                            className={`p-1 rounded hover:bg-muted ${!nextStage ? 'invisible' : ''}`}
                            title="Move to next stage"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {stageDeals.length === 0 && (
                    <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
