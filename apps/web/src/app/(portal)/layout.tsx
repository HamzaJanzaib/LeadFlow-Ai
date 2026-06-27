"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Receipt, Bell, Search, Menu, LogOut } from "lucide-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Projects", href: "/portal", icon: Briefcase },
    { name: "Invoices", href: "/portal/invoices", icon: Receipt },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <Link href="/portal" className="flex items-center gap-2 font-bold text-primary">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl">A</div>
          <span className="hidden sm:inline-block tracking-tight text-lg">Agency Portal</span>
        </Link>

        <nav className="hidden md:flex ml-8 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <button className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs cursor-pointer border border-primary/20">
            JD
          </div>
          <button className="md:hidden text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
