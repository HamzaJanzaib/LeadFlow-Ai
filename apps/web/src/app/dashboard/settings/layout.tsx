import { Settings, Users, Key, CreditCard } from "lucide-react";
import Link from "next/link";

const navigation = [
  { name: "General", href: "/dashboard/settings", icon: Settings },
  { name: "Team", href: "/dashboard/settings/team", icon: Users },
  { name: "API Keys", href: "/dashboard/settings/api-keys", icon: Key },
  { name: "Billing", href: "/dashboard/settings/billing", icon: CreditCard },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Workspace Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization, team members, billing, and API keys.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 flex-shrink-0">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted/50 text-foreground"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  );
}
