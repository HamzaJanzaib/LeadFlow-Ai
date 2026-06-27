"use client";

import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, FileText, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/Button";

const activeProjects = [
  { id: "proj_1", name: "Website Redesign", status: "In Progress", progress: 65, nextMilestone: "Design Handoff", dueDate: "Oct 15, 2026" },
  { id: "proj_2", name: "SEO Audit Q4", status: "Review", progress: 90, nextMilestone: "Final Approval", dueDate: "Oct 05, 2026" },
];

const recentActivity = [
  { id: 1, action: "Invoice #INV-2026-001 generated", time: "2 hours ago", type: "invoice" },
  { id: 2, action: "New file 'homepage_v2.fig' uploaded", time: "1 day ago", type: "file" },
  { id: 3, action: "Project 'Website Redesign' status changed to In Progress", time: "3 days ago", type: "status" },
];

export default function PortalDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <FileText className="h-4 w-4" />
          Request New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <LayoutList className="h-5 w-5 text-primary" />
              Active Projects
            </h2>
          </div>

          <div className="grid gap-4">
            {activeProjects.map((project) => (
              <Link key={project.id} href={`/portal/projects/${project.id}`}>
                <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {project.status}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due {project.dueDate}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="flex-1 md:w-48 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{project.progress}% Complete</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors hidden md:block" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-tight">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 text-sm">
              View All Activity
            </Button>
          </div>

          <div className="rounded-xl border bg-primary/5 p-6 border-primary/20">
            <h3 className="font-semibold tracking-tight mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your account manager is available to answer any questions.
            </p>
            <Button className="w-full" variant="secondary">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
