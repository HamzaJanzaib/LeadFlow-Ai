"use client";

import { Search, Download, Filter, FileJson } from "lucide-react";
import { Button } from "@/components/ui/Button";

const mockLogs = [
  { id: "log_1", action: "auth.login", user: "john@acme.com", org: "Acme Corp", ip: "192.168.1.1", time: "2 mins ago", status: "Success" },
  { id: "log_2", action: "organization.created", user: "tony@stark.com", org: "Stark Ind", ip: "10.0.0.5", time: "1 hour ago", status: "Success" },
  { id: "log_3", action: "billing.payment_failed", user: "system", org: "Wayne Ent", ip: "-", time: "3 hours ago", status: "Failure" },
  { id: "log_4", action: "user.invited", user: "peter@oscorp.com", org: "Oscorp", ip: "172.16.0.4", time: "5 hours ago", status: "Success" },
  { id: "log_5", action: "api_key.created", user: "bruce@wayne.com", org: "Wayne Ent", ip: "192.168.1.12", time: "1 day ago", status: "Success" },
  { id: "log_6", action: "auth.login", user: "unknown", org: "-", ip: "45.22.1.99", time: "1 day ago", status: "Failure" },
];

export default function AdminLogsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System & Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Review security events, access logs, and system errors.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by action, user email, IP address..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Organization</th>
              <th className="px-6 py-4 font-medium">IP Address</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Time</th>
              <th className="px-6 py-4 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-semibold">
                  {log.action}
                </td>
                <td className="px-6 py-4">
                  {log.user}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {log.org}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  {log.ip}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider
                    ${log.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'}
                  `}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                  {log.time}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FileJson className="h-4 w-4" />
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
