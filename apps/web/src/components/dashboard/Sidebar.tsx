"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Megaphone, 
  Bot, 
  Workflow, 
  BarChart3, 
  Settings,
  Boxes
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/global/Logo";

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

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <aside className={cn("fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform lg:translate-x-0 -translate-x-full", className)}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Boxes className="h-5 w-5 text-primary-foreground" />
            </div>
            <Logo className="h-6 w-auto text-primary" />
          </Link>
        </div>
        <ul className="space-y-2 font-medium flex-1 px-3 py-4">
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
