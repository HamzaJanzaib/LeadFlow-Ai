"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle"; // We will create this or use existing

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full justify-between items-center bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-x-4 md:gap-x-6">
        {/* Mobile menu toggle could go here */}
        <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
          {/* Optional breadcrumbs or page title */}
        </div>
        <div className="flex items-center gap-x-4 md:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <div className="hidden md:block w-px h-6 bg-border" aria-hidden="true" />
          
          <ThemeToggle />

          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full border border-border"
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
