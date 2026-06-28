"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Megaphone, 
  Bot, 
  Workflow, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "CRM", href: "/dashboard/crm", icon: Briefcase },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot },
  { name: "Workflows", href: "/dashboard/workflows", icon: Workflow },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const BOTTOM_LINKS = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full md:translate-x-0 border-r border-border bg-card">
      <div className="flex flex-col h-full px-3 py-4">
        <Link href="/" className="flex items-center pl-2.5 mb-8">
          <span className="self-center text-xl font-bold whitespace-nowrap text-primary">LeadFlow AI</span>
        </Link>
        <ul className="space-y-2 font-medium flex-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center p-2 rounded-lg group transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className="ml-3">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="space-y-2 font-medium border-t border-border pt-4">
          {BOTTOM_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center p-2 rounded-lg group transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className="ml-3">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
