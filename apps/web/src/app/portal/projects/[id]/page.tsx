"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, MessageSquare, Paperclip, CalendarDays, ExternalLink, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

const projectTimeline = [
  { id: 1, stage: "Discovery & Planning", status: "Completed", date: "Sep 01 - Sep 15" },
  { id: 2, stage: "Design & Wireframes", status: "Completed", date: "Sep 16 - Sep 30" },
  { id: 3, stage: "Development", status: "In Progress", date: "Oct 01 - Oct 20" },
  { id: 4, stage: "Testing & QA", status: "Upcoming", date: "Oct 21 - Oct 25" },
  { id: 5, stage: "Launch", status: "Upcoming", date: "Oct 30" },
];

const sharedFiles = [
  { id: 1, name: "Project_Proposal_Signed.pdf", size: "2.4 MB", date: "Sep 05", type: "pdf" },
  { id: 2, name: "Brand_Assets.zip", size: "14.2 MB", date: "Sep 10", type: "zip" },
  { id: 3, name: "Homepage_v2_Mockup.fig", size: "8.1 MB", date: "Sep 28", type: "figma" },
];

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/portal" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Website Redesign</h1>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                In Progress
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Complete overhaul of the corporate marketing website including new branding, CMS migration to Next.js, and SEO optimization.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Message Team
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Project Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {projectTimeline.map((item, index) => (
                  <div key={item.id} className="flex gap-4 relative">
                    {index !== projectTimeline.length - 1 && (
                      <div className="absolute left-[11px] top-7 bottom-[-24px] w-[2px] bg-muted"></div>
                    )}
                    <div className="relative z-10 mt-1">
                      {item.status === 'Completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500 bg-card rounded-full" />
                      ) : item.status === 'In Progress' ? (
                        <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-muted bg-card" />
                      )}
                    </div>
                    <div className="space-y-1 pb-2">
                      <h3 className={`font-medium ${item.status === 'Upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {item.stage}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {item.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold tracking-tight">Project Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-muted-foreground">Start Date</div>
                <div className="font-medium text-right">Sep 01, 2026</div>
                
                <div className="text-muted-foreground">Est. Delivery</div>
                <div className="font-medium text-right">Oct 30, 2026</div>

                <div className="text-muted-foreground">Budget</div>
                <div className="font-medium text-right">$15,000</div>

                <div className="text-muted-foreground">Manager</div>
                <div className="font-medium text-right flex items-center justify-end gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">AS</div>
                  Alice Smith
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                Shared Files
              </h2>
            </div>
            <div className="p-0">
              {sharedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 rounded bg-primary/10 flex flex-shrink-0 items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground hover:text-primary">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
