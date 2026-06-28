"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Briefcase, DollarSign } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const createDealSchema = z.object({
  pipelineId: z.string().uuid(),
  title: z.string().min(2, "Deal title is required"),
  value: z.coerce.number().optional(),
  stage: z.string(), // DealStage enum string
});

type DealFormValues = z.infer<typeof createDealSchema>;

export default function NewDealPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pipelineId = searchParams.get("pipelineId") || "";
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const form = useForm<DealFormValues>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      pipelineId,
      title: "",
      value: undefined,
      stage: "LEAD",
    },
  });

  const { mutate: createDeal, isPending } = useMutation({
    mutationFn: async (data: DealFormValues) => {
      const token = await getToken();
      return await apiClient.post("/crm/deals", data, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Deal created successfully");
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
      router.push("/dashboard/crm");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create deal");
    },
  });

  const onSubmit = (data: DealFormValues) => {
    createDeal(data);
  };

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8 pt-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/dashboard/crm" className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Add New Deal</h2>
          <p className="text-sm text-muted-foreground">Create a new opportunity in your pipeline.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b border-border pb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-500" /> Deal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Deal Title <span className="text-destructive">*</span></label>
                <input 
                  {...form.register("title")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g. Acme Corp Enterprise Plan"
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Deal Value ($)</label>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <input 
                    {...form.register("value")}
                    type="number"
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Stage</label>
                <select 
                  {...form.register("stage")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="LEAD">Lead</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border gap-4">
            <Link 
              href="/dashboard/crm"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card text-card-foreground hover:bg-muted h-10 px-4 py-2"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isPending || !pipelineId}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed h-10 px-6 py-2 shadow-sm"
            >
              {isPending ? "Creating..." : "Save Deal"}
            </button>
          </div>
          
          {!pipelineId && (
            <p className="text-xs text-destructive text-right mt-2">
              Missing Pipeline ID. Cannot create deal.
            </p>
          )}

        </form>
      </div>
    </div>
  );
}
