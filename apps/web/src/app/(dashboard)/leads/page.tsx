"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Download, Upload, Filter, Search, MoreHorizontal } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

const DUMMY_LEADS = [
  { id: "1", company: "Acme Corp", email: "contact@acme.com", status: "NEW", score: 85, industry: "Technology" },
  { id: "2", company: "Globex", email: "info@globex.io", status: "ENRICHED", score: 92, industry: "Finance" },
  { id: "3", company: "Soylent", email: "hello@soylent.co", status: "QUALIFIED", score: 78, industry: "Food & Bev" },
];

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = DUMMY_LEADS.filter(lead => 
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Leads</h2>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Upload className="mr-2 h-4 w-4" /> Import
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Download className="mr-2 h-4 w-4" /> Export
          </button>
          <Link href="/leads/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="flex items-center border border-input bg-background rounded-md px-3 py-2 w-1/3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </button>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Industry</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState 
                      title="No leads found"
                      description="You don't have any leads matching your criteria yet."
                      actionLabel="Add Lead"
                      actionHref="/leads/new"
                      className="border-0 bg-transparent rounded-none"
                    />
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors group">
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/leads/${lead.id}`} className="hover:underline hover:text-primary">
                        {lead.company}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-secondary rounded-full h-2.5 mr-2 max-w-[60px]">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${lead.score}%` }}></div>
                        </div>
                        <span className="text-xs font-medium">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{lead.industry}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
