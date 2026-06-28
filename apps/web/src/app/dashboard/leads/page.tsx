"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { Plus, Download, Upload, Filter, Search, MoreHorizontal, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDebounce } from "use-debounce";

interface Lead {
  id: string;
  company: string;
  email: string | null;
  status: string;
  score: number | null;
  industry: string | null;
  createdAt: string;
}

interface LeadsResponse {
  items: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function LeadsPage() {
  const { isLoaded, userId, getToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError } = useQuery<LeadsResponse>({
    queryKey: ["leads", page, limit, debouncedSearch],
    queryFn: async () => {
      const token = await getToken();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      
      return await apiClient.get<LeadsResponse>(`/leads?${params.toString()}`, { ...(token && { token }) });
    },
    enabled: isLoaded && !!userId,
  });

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8 pt-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Leads</h2>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card text-card-foreground hover:bg-muted h-10 px-4 py-2">
            <Upload className="mr-2 h-4 w-4" /> Import
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card text-card-foreground hover:bg-muted h-10 px-4 py-2">
            <Download className="mr-2 h-4 w-4" /> Export
          </button>
          <Link href="/dashboard/leads/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="flex items-center border border-input bg-background rounded-md px-3 py-2 w-full max-w-md shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground text-foreground"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page on search
            }}
          />
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card text-card-foreground hover:bg-muted h-10 px-4 py-2 ml-4">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Industry</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex items-center justify-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading leads...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-destructive">
                    Failed to load leads. Please check your connection or try again later.
                  </td>
                </tr>
              ) : !data?.items || data.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0 border-b-0">
                    <EmptyState 
                      title="No leads found"
                      description={searchTerm ? "No leads matched your search query." : "You don't have any leads yet."}
                      actionLabel="Add Lead"
                      actionHref="/dashboard/leads/new"
                      className="border-0 bg-transparent rounded-none my-8"
                    />
                  </td>
                </tr>
              ) : (
                data.items.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <Link href={`/dashboard/leads/${lead.id}`} className="hover:underline hover:text-primary transition-colors">
                        {lead.company}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{lead.email || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2.5 mr-2 max-w-[60px] overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${
                              (lead.score ?? 0) > 80 ? 'bg-success' : 
                              (lead.score ?? 0) > 50 ? 'bg-brand-500' : 'bg-warning'
                            }`} 
                            style={{ width: `${lead.score ?? 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-foreground">{lead.score ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{lead.industry || "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * limit, data.total)}</span> of <span className="font-medium text-foreground">{data.total}</span> leads
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm font-medium border border-border rounded-md bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-3 py-1 text-sm font-medium border border-border rounded-md bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
