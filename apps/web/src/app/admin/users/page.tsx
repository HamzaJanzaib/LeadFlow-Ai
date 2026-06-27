"use client";

import { Search, MoreHorizontal, ShieldOff, UserX } from "lucide-react";
import { Button } from "@/components/ui/Button";

const mockUsers = [
  { id: "usr_1", name: "John Doe", email: "john@acme.com", org: "Acme Corp", role: "Owner", status: "Active", joinedAt: "2026-01-15" },
  { id: "usr_2", name: "Jane Smith", email: "jane@acme.com", org: "Acme Corp", role: "Member", status: "Active", joinedAt: "2026-02-20" },
  { id: "usr_3", name: "Tony Stark", email: "tony@stark.com", org: "Stark Ind", role: "Owner", status: "Active", joinedAt: "2025-11-05" },
  { id: "usr_4", name: "Bruce Wayne", email: "bruce@wayne.com", org: "Wayne Ent", role: "Owner", status: "Suspended", joinedAt: "2024-09-12" },
  { id: "usr_5", name: "Peter Parker", email: "peter@oscorp.com", org: "Oscorp", role: "Viewer", status: "Active", joinedAt: "2026-05-10" },
];

export default function AdminUsersPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all users across the platform.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search users by name, email or org..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>

      <div className="rounded-md border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Organization</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">
                  {user.org}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'}
                  `}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {user.joinedAt}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    Impersonate
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                    <ShieldOff className="h-4 w-4" />
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
