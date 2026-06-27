import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LeadFlow AI — AI-Powered Lead Generation & Sales Automation",
    template: "%s | LeadFlow AI",
  },
  description:
    "Discover high-quality leads, run personalized outreach campaigns, and close more deals — powered by AI agents that work autonomously on your behalf.",
  keywords: [
    "lead generation",
    "sales automation",
    "AI CRM",
    "outreach automation",
    "B2B sales",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://leadflow.ai",
    siteName: "LeadFlow AI",
    title: "LeadFlow AI — AI-Powered Lead Generation",
    description:
      "Discover leads, run personalized outreach, close more deals with AI agents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadFlow AI",
    description: "AI-powered lead generation and sales automation",
    creator: "@leadflowai",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/global/ErrorBoundary";
import { CommandPalette } from "@/components/global/CommandPalette";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <AuthProvider>
              <QueryProvider>
                <CommandPalette />
                {children}
                <Toaster
                  position="bottom-right"
                  richColors
                  expand={false}
                  duration={4000}
                />
              </QueryProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
