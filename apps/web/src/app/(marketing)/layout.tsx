import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadFlow AI | Supercharge Your Sales Pipeline",
  description: "LeadFlow AI automates lead qualification, proposal generation, and follow-ups. Close deals faster without the busywork.",
  openGraph: {
    title: "LeadFlow AI | Supercharge Your Sales Pipeline",
    description: "LeadFlow AI automates lead qualification, proposal generation, and follow-ups. Close deals faster without the busywork.",
    url: "https://leadflow.ai",
    siteName: "LeadFlow AI",
    images: [
      {
        url: "https://leadflow.ai/og.png",
        width: 1200,
        height: 630,
        alt: "LeadFlow AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadFlow AI | Supercharge Your Sales Pipeline",
    description: "LeadFlow AI automates lead qualification, proposal generation, and follow-ups. Close deals faster without the busywork.",
    images: ["https://leadflow.ai/og.png"],
  },
};

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl inline-block text-primary">LeadFlow AI</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/pricing" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Pricing
              </Link>
              <Link href="/blog" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Blog
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              {!userId ? (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="mr-2">
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton />
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t bg-muted/40 py-12 md:py-16">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">LeadFlow AI</h3>
            <p className="text-sm text-muted-foreground">
              Automating your lead generation and sales pipelines with cutting-edge AI.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/integrations" className="hover:text-foreground">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
              <li><Link href="/support" className="hover:text-foreground">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LeadFlow AI Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
