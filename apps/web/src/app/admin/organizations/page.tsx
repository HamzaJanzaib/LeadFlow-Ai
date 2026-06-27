"use client";

import { Search, Building2, MoreHorizontal, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const mockOrgs = [
  { id: "org_1", name: "Acme Corp", slug: "acme-corp", plan: "Enterprise", users: 12, leads: 14500, status: "Active", createdAt: "2026-01-15" },
  { id: "org_2", name: "Stark Ind", slug: "stark-ind", plan: "Business", users: 4, leads: 5200, status: "Active", createdAt: "2025-11-05" },
  { id: "org_3", name: "Wayne Ent", slug: "wayne-ent", plan: "Pro", users: 2, leads: 850, status: "Past Due", createdAt: "2024-09-12" },
  { id: "org_4", name: "Oscorp", slug: "oscorp", plan: "Free", users: 1, leads: 42, status: "Active", createdAt: "2026-05-10" },
];

export default function AdminOrganizationsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground mt-1">
            Manage organizations, billing plans, and global limits.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search organizations by name or slug..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option>All Plans</option>
          <option>Free</option>
          <option>Pro</option>
          <option>Business</option>
          <option>Enterprise</option>
        </select>
      </div>

      <div className="rounded-md border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Organization</th>
              <th className="px-6 py-4 font-medium">Plan</th>
              <th className="px-6 py-4 font-medium">Users</th>
              <th className="px-6 py-4 font-medium">Total Leads</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockOrgs.map((org) => (
              <tr key={org.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{org.name}</div>
                      <div className="text-xs text-muted-foreground">{org.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {org.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {org.users}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {org.leads.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                    ${org.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'}
                  `}>
                    {org.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
