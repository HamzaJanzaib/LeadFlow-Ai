"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Users, Building2, CreditCard, LayoutDashboard, Settings, ShieldAlert, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Organizations", href: "/admin/organizations", icon: Building2 },
    { name: "Billing", href: "/admin/billing", icon: CreditCard },
    { name: "Audit Logs", href: "/admin/logs", icon: Activity },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-red-600 dark:text-red-500">
          <ShieldAlert className="h-6 w-6" />
          <span className="hidden sm:inline-block">LeadFlow Admin</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Back to App
          </Link>
          <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
          <nav className="grid gap-1 px-4 py-6">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              Management
            </h2>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            <h2 className="mb-2 mt-6 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              System
            </h2>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
