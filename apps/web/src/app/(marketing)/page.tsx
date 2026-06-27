"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, Zap, BarChart3, Users } from "lucide-react";

export default function MarketingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="px-4 py-24 md:py-32 lg:py-40 text-center max-w-5xl mx-auto flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              New: AI-Powered Deal Drafting
            </span>
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground"
          >
            Supercharge Your <span className="text-primary">Sales Pipeline</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            LeadFlow AI automates lead qualification, proposal generation, and follow-ups. Close deals faster without the busywork.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                Start for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8">
                View Pricing
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines traditional CRM features with advanced AI agents to put your sales on autopilot.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Lead Qualification",
                description: "Automatically score and qualify leads based on intent signals and firmographics.",
                icon: Zap,
              },
              {
                title: "Smart Proposals",
                description: "Generate tailored proposals in seconds using your successful past deals as templates.",
                icon: BarChart3,
              },
              {
                title: "Client Portal",
                description: "Give your clients a branded experience to review proposals and track project status.",
                icon: Users,
              },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-background rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">How LeadFlow works</h2>
              <div className="space-y-6">
                {[
                  "Connect your lead sources (website, LinkedIn, email)",
                  "Our AI agents instantly engage and qualify prospects",
                  "Automated proposals are generated for qualified leads",
                  "Close deals in the client portal and track revenue",
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <p className="text-lg pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-video bg-muted rounded-xl border overflow-hidden relative">
                {/* Placeholder for dashboard screenshot */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-muted">
                  <p className="text-muted-foreground font-medium flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" /> Dashboard Interface
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-lg border flex items-center gap-4">
                <CheckCircle2 className="text-green-500 h-8 w-8" />
                <div>
                  <p className="font-bold">Deal Closed</p>
                  <p className="text-sm text-muted-foreground">Just now • $12,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-3xl"></div>
        
        <div className="container relative z-10 px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your sales?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Join thousands of modern agencies and freelancers closing more deals with LeadFlow AI.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-primary hover:bg-white text-lg h-14 px-10">
              Get Started for Free
            </Button>
          </Link>
          <p className="mt-6 text-sm opacity-75">No credit card required. 14-day free trial.</p>
        </div>
      </section>
    </div>
  );
}
