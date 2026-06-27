"use client";

import { Users, Building2, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stats = [
  {
    name: "Total MRR",
    value: "$145,000",
    change: "+12%",
    trend: "up",
    icon: CreditCard,
  },
  {
    name: "Active Users",
    value: "1,240",
    change: "+18%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Organizations",
    value: "342",
    change: "+8%",
    trend: "up",
    icon: Building2,
  },
  {
    name: "System Health",
    value: "99.9%",
    change: "-0.1%",
    trend: "down",
    icon: Activity,
  },
];

const recentSignups = [
  { id: 1, org: "Acme Corp", user: "john@acme.com", plan: "Enterprise", date: "2 mins ago" },
  { id: 2, org: "Stark Ind", user: "tony@stark.com", plan: "Business", date: "1 hour ago" },
  { id: 3, org: "Wayne Ent", user: "bruce@wayne.com", plan: "Pro", date: "3 hours ago" },
  { id: 4, org: "Oscorp", user: "norman@oscorp.com", plan: "Free", date: "5 hours ago" },
];

export default function AdminOverviewPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor system metrics and recent platform activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">{stat.name}</h3>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-bold">{stat.value}</div>
              <span className={`text-xs font-medium flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-6 pb-4 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Recent Signups</h3>
            <p className="text-sm text-muted-foreground mt-2">Latest organizations joining the platform.</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-6 mt-4">
              {recentSignups.map((signup) => (
                <div key={signup.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{signup.org}</p>
                    <p className="text-sm text-muted-foreground">{signup.user}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {signup.plan}
                    </span>
                    <span className="text-muted-foreground">{signup.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-6 pb-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold leading-none tracking-tight">System Status</h3>
              <p className="text-sm text-muted-foreground mt-2">Service health overview.</p>
            </div>
            <Button variant="outline" size="sm">View Logs</Button>
          </div>
          <div className="p-6 pt-0 mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">API Server</span>
              <span className="inline-flex items-center text-xs font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Database (PostgreSQL)</span>
              <span className="inline-flex items-center text-xs font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Worker Queues (BullMQ)</span>
              <span className="inline-flex items-center text-xs font-medium text-yellow-600">
                <span className="h-2 w-2 rounded-full bg-yellow-600 mr-2"></span>
                High Load
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Email Provider (Resend)</span>
              <span className="inline-flex items-center text-xs font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
