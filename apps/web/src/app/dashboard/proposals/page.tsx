"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Download, Mail, MoreHorizontal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

// This is a mockup. In reality, you'd fetch from /api/proposals using react-query
const mockProposals = [
  {
    id: "prop_123",
    title: "Enterprise SEO Retainer",
    dealName: "Acme Corp - Q3 Expansion",
    status: "draft",
    value: 12500,
    createdAt: "2026-06-25T10:00:00Z",
  },
  {
    id: "prop_456",
    title: "Web App Development",
    dealName: "Stark Ind - New Portal",
    status: "sent",
    value: 45000,
    createdAt: "2026-06-20T14:30:00Z",
  }
];

export default function ProposalsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock function to simulate generating a proposal
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // In reality, this would make a POST to /api/proposals and redirect to the new ID
      window.location.href = "/proposals/new-generated-id";
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
          <p className="text-muted-foreground">Manage and generate AI-drafted proposals.</p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate from Deal
            </span>
          )}
        </Button>
      </div>

      <div className="border rounded-lg bg-background">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Proposal</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Value</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockProposals.map((proposal) => (
              <tr key={proposal.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{proposal.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">Deal: {proposal.dealName}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${proposal.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' : ''}
                    ${proposal.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' : ''}
                  `}>
                    {proposal.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">
                  ${proposal.value.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/proposals/${proposal.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      Edit
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {mockProposals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No proposals found. Generate one from a deal to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
