"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Mail, 
  Settings, 
  Workflow, 
  BarChart, 
  Plus 
} from "lucide-react";
import { useTheme } from "next-themes";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white dark:bg-[#1a1c23] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <Command label="Global Command Menu" className="w-full h-full flex flex-col overflow-hidden bg-transparent">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-3 py-2">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <Command.Input 
              autoFocus
              placeholder="Type a command or search..." 
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            />
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">esc</span>
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200 mt-1"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-500" />
                Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/leads"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200"
              >
                <Users className="w-4 h-4 text-gray-500" />
                Leads
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/campaigns"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200"
              >
                <Mail className="w-4 h-4 text-gray-500" />
                Campaigns
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/analytics"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200"
              >
                <BarChart className="w-4 h-4 text-gray-500" />
                Analytics
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/workflows"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200"
              >
                <Workflow className="w-4 h-4 text-gray-500" />
                Workflows
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/leads/new"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200 mt-1"
              >
                <Plus className="w-4 h-4 text-gray-500" />
                Add Lead
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/campaigns/new"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200"
              >
                <Plus className="w-4 h-4 text-gray-500" />
                Create Campaign
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Theme" className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("light"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200 mt-1"
              >
                <div className="w-4 h-4 rounded-full border border-gray-300 bg-white" />
                Light Mode
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("dark"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200"
              >
                <div className="w-4 h-4 rounded-full border border-gray-600 bg-gray-900" />
                Dark Mode
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("system"))}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-200"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                System Theme
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
      
      {/* Invisible overlay for click-outside to close */}
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={() => setOpen(false)}
      />
    </div>
  );
}
