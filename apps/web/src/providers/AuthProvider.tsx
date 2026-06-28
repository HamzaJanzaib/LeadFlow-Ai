"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "hsl(245, 82%, 58%)",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "bg-background border border-border shadow-card",
          headerTitle: "text-foreground font-sans",
          headerSubtitle: "text-muted-foreground font-sans",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          formFieldLabel: "text-foreground font-sans",
          formFieldInput: "bg-background border-border text-foreground focus:ring-ring",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
          socialButtonsBlockButton: "border-border text-foreground hover:bg-accent",
          socialButtonsBlockButtonText: "text-foreground font-sans",
          footerActionLink: "text-primary hover:text-primary/90",
        }
      } as any}
    >
      {children}
    </ClerkProvider>
  );
}
