"use client";

import { Search, Download, CreditCard, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const mockInvoices = [
  { id: "inv_1A2B3C", org: "Acme Corp", amount: "$1250.00", status: "Paid", date: "2026-06-25", method: "Visa ending in 4242" },
  { id: "inv_2D3E4F", org: "Stark Ind", amount: "$890.00", status: "Paid", date: "2026-06-24", method: "Mastercard ending in 5555" },
  { id: "inv_3G4H5I", org: "Wayne Ent", amount: "$450.00", status: "Failed", date: "2026-06-22", method: "Amex ending in 1234" },
  { id: "inv_4J5K6L", org: "Daily Planet", amount: "$120.00", status: "Refunded", date: "2026-06-20", method: "Visa ending in 9876" },
  { id: "inv_5M6N7O", org: "Oscorp", amount: "$1250.00", status: "Paid", date: "2026-06-15", method: "Visa ending in 1111" },
];

export default function AdminBillingPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Billing</h1>
          <p className="text-muted-foreground mt-1">
            Monitor incoming revenue, failed payments, and process refunds.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="gap-2 bg-[#635BFF] hover:bg-[#5249EB] text-white">
            <CreditCard className="h-4 w-4" />
            Stripe Dashboard
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Monthly Recurring Revenue (MRR)</h3>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-bold">$145,000</div>
            <span className="text-xs font-medium flex items-center text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12%
            </span>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Failed Payments (Last 30d)</h3>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-red-600">12</div>
            <span className="text-xs font-medium text-muted-foreground">
              Across 8 organizations
            </span>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Refunds (Last 30d)</h3>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-bold">$1,240</div>
            <span className="text-xs font-medium text-muted-foreground">
              3 transactions
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by invoice ID or organization..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option>All Statuses</option>
          <option>Paid</option>
          <option>Failed</option>
          <option>Refunded</option>
        </select>
      </div>

      <div className="rounded-md border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Invoice ID</th>
              <th className="px-6 py-4 font-medium">Organization</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">
                  {invoice.id}
                </td>
                <td className="px-6 py-4 font-medium">
                  {invoice.org}
                </td>
                <td className="px-6 py-4 font-medium">
                  {invoice.amount}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {invoice.status === 'Paid' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {invoice.status === 'Failed' && <XCircle className="h-4 w-4 text-red-500" />}
                    {invoice.status === 'Refunded' && <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center text-[10px] text-muted-foreground font-bold">R</div>}
                    <span className="text-sm">{invoice.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {invoice.date}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    View
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
