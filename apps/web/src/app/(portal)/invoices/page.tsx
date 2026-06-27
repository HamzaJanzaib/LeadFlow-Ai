"use client";

import { Download, CreditCard, Receipt, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

const clientInvoices = [
  { id: "INV-2026-001", description: "Website Redesign - 50% Deposit", amount: "$7,500.00", status: "Unpaid", dueDate: "Oct 15, 2026", date: "Oct 01, 2026" },
  { id: "INV-2026-002", description: "Monthly Retainer - SEO", amount: "$2,000.00", status: "Paid", dueDate: "Sep 01, 2026", date: "Aug 25, 2026" },
  { id: "INV-2026-003", description: "Brand Identity Package", amount: "$5,000.00", status: "Paid", dueDate: "Jul 15, 2026", date: "Jul 01, 2026" },
  { id: "INV-2026-004", description: "Monthly Retainer - SEO", amount: "$2,000.00", status: "Paid", dueDate: "Aug 01, 2026", date: "Jul 25, 2026" },
];

export default function PortalInvoicesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices & Billing</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          View and manage your project invoices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Outstanding Balance</h3>
          </div>
          <div className="text-3xl font-bold text-foreground mt-4">$7,500.00</div>
          <Button className="w-full mt-6">Pay Balance Now</Button>
        </div>
        
        <div className="md:col-span-2 rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-center">
          <h3 className="font-semibold mb-2">Payment Methods</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your saved payment methods for automatic retainer billing.
          </p>
          <div className="flex items-center justify-between border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="h-10 w-14 bg-white border rounded flex items-center justify-center font-bold text-blue-800 text-xs">VISA</div>
              <div>
                <p className="text-sm font-medium">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/28</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold tracking-tight">Invoice History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice ID</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clientInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4">
                    {invoice.description}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                      ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500'}
                    `}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {invoice.status === 'Unpaid' && (
                      <Button variant="default" size="sm" className="h-8">
                        Pay
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
