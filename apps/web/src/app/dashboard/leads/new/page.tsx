"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Building2, Globe, Mail, MapPin, Tag } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const createLeadSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  city: z.string().optional(),
  country: z.string().optional(),
});

type LeadFormValues = z.infer<typeof createLeadSchema>;

export default function NewLeadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { getToken } = useAuth();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      company: "",
      website: "",
      industry: "",
      email: "",
      city: "",
      country: "",
    },
  });

  const { mutate: createLead, isPending } = useMutation({
    mutationFn: async (data: LeadFormValues) => {
      const token = await getToken();
      return await apiClient.post("/leads", data, { ...(token && { token }) });
    },
    onSuccess: () => {
      toast.success("Lead created successfully");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      router.push("/dashboard/leads");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create lead");
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    createLead(data);
  };

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8 pt-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/dashboard/leads" className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Add New Lead</h2>
          <p className="text-sm text-muted-foreground">Enter the details to manually track a new prospect.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b border-border pb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-500" /> Company Info
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Name <span className="text-destructive">*</span></label>
                <input 
                  {...form.register("company")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g. Acme Corp"
                />
                {form.formState.errors.company && (
                  <p className="text-xs text-destructive">{form.formState.errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Website</label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <input 
                    {...form.register("website")}
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="https://acme.com"
                  />
                </div>
                {form.formState.errors.website && (
                  <p className="text-xs text-destructive">{form.formState.errors.website.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Industry</label>
                <div className="relative flex items-center">
                  <Tag className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <input 
                    {...form.register("industry")}
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="e.g. Software"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b border-border pb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" /> Contact Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">General Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <input 
                    {...form.register("email")}
                    type="email"
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="info@acme.com"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">City</label>
                <input 
                  {...form.register("city")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="San Francisco"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Country</label>
                <input 
                  {...form.register("country")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border gap-4">
            <Link 
              href="/dashboard/leads"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card text-card-foreground hover:bg-muted h-10 px-4 py-2"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed h-10 px-6 py-2 shadow-sm"
            >
              {isPending ? "Creating..." : "Save Lead"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
