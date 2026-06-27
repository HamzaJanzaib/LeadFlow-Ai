"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    description: "Perfect for freelancers and solo agencies just getting started.",
    priceMonthly: 29,
    priceYearly: 24,
    features: [
      "Up to 500 leads/month",
      "Basic AI Lead Scoring",
      "3 Proposal Templates",
      "Email Support",
    ],
    limitations: [
      "No Client Portal",
      "No Custom Branding",
      "No API Access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    description: "Ideal for growing teams looking to automate their entire sales process.",
    priceMonthly: 99,
    priceYearly: 79,
    features: [
      "Unlimited leads",
      "Advanced AI Qualification",
      "Unlimited Proposals",
      "Client Portal Included",
      "Custom Branding",
      "Priority Support",
    ],
    limitations: [
      "No Dedicated Account Manager",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex workflows and custom needs.",
    priceMonthly: 299,
    priceYearly: 249,
    features: [
      "Everything in Pro",
      "Custom AI Agent Training",
      "API Access & Webhooks",
      "SSO & Advanced Security",
      "Dedicated Account Manager",
      "Custom SLA",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="py-20 md:py-28">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Annually <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative flex flex-col p-8 rounded-2xl border bg-background shadow-sm ${
                plan.popular ? "border-primary shadow-md scale-105 z-10" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground h-10">{plan.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline text-5xl font-extrabold">
                ${isYearly ? plan.priceYearly : plan.priceMonthly}
                <span className="text-xl font-normal text-muted-foreground ml-1">/mo</span>
              </div>
              
              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limit) => (
                  <li key={limit} className="flex items-start gap-3 opacity-50">
                    <X className="h-5 w-5 shrink-0" />
                    <span className="text-sm">{limit}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"} className="mt-auto">
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
