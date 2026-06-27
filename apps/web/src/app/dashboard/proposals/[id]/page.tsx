"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Send, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { toast } from "sonner";

export default function ProposalEditorPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"executive" | "scope" | "terms">("executive");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Mock state
  const [proposal, setProposal] = useState({
    title: "Enterprise SEO Retainer",
    executiveSummary: "<p>Thank you for considering LeadFlow AI for your upcoming project.</p><p>We understand that your company is looking to automate lead generation and streamline the sales pipeline. Our proposed solution is designed specifically to address these challenges.</p>",
    scopeOfWork: "<h3>Phase 1: Discovery & Strategy</h3><p>We will conduct a comprehensive audit of your current processes.</p><h3>Phase 2: Implementation</h3><p>Deployment of the AI agents and integration with your existing CRM.</p><h3>Phase 3: Training</h3><p>Onboarding your team to maximize the platform's utility.</p>",
    terms: "<p>This proposal is valid for 30 days from the date of issue. Payment terms are Net 30.</p>",
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Proposal saved successfully");
    }, 1000);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("PDF generated and downloaded");
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b bg-background p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/proposals">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">{proposal.title}</h1>
            <p className="text-xs text-muted-foreground">Draft • Last edited just now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <Send className="h-4 w-4 mr-2" />
            Send to Client
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar tabs */}
        <div className="w-64 border-r bg-muted/20 p-4 space-y-2 overflow-y-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Sections</h3>
          <button
            onClick={() => setActiveTab("executive")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === "executive" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab("scope")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === "scope" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
            }`}
          >
            Scope of Work
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === "terms" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
            }`}
          >
            Contract & Terms
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {activeTab === "executive" && "Executive Summary"}
                {activeTab === "scope" && "Scope of Work"}
                {activeTab === "terms" && "Contract & Terms"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Edit the content below. Changes are auto-saved locally.
              </p>
            </div>
            
            {activeTab === "executive" && (
              <RichTextEditor
                value={proposal.executiveSummary}
                onChange={(val) => setProposal({ ...proposal, executiveSummary: val })}
                className="border-0 rounded-none rounded-b-lg min-h-[400px]"
              />
            )}
            
            {activeTab === "scope" && (
              <RichTextEditor
                value={proposal.scopeOfWork}
                onChange={(val) => setProposal({ ...proposal, scopeOfWork: val })}
                className="border-0 rounded-none rounded-b-lg min-h-[400px]"
              />
            )}
            
            {activeTab === "terms" && (
              <RichTextEditor
                value={proposal.terms}
                onChange={(val) => setProposal({ ...proposal, terms: val })}
                className="border-0 rounded-none rounded-b-lg min-h-[400px]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
