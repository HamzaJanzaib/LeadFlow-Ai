import React from "react";
import { Bot, Send, User, Sparkles, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            AI Assistant
          </h2>
          <p className="text-muted-foreground mt-1">
            Chat with your autonomous agents to find leads, research companies, and write outreach.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 h-full overflow-hidden">
        {/* Chat Interface */}
        <div className="flex flex-col flex-1 border rounded-xl bg-card shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* System Greeting */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                <p className="text-sm">
                  Hello! I'm your LeadFlow AI Assistant. You can ask me to:
                </p>
                <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                  <li>Find 5 Shopify stores in Austin with poor mobile UX</li>
                  <li>Draft a personalized email to the VP of Sales at Acme Corp</li>
                  <li>Research the recent funding history of TechStart Inc.</li>
                </ul>
              </div>
            </div>

            {/* Mock User Message */}
            <div className="flex items-start justify-end space-x-3">
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                <p className="text-sm">Find 5 Shopify stores in Austin with poor mobile UX</p>
              </div>
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>

            {/* Mock AI Response (Plan Generated) */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="bg-muted p-4 rounded-2xl rounded-tl-none w-full max-w-2xl border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-3 border-b">
                  <h4 className="font-semibold text-sm flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2 text-primary" />
                    Execution Plan Generated
                  </h4>
                  <span className="text-xs font-medium px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-full">Requires Approval</span>
                </div>
                
                <ol className="list-decimal pl-5 text-sm space-y-2 mb-4 text-muted-foreground">
                  <li>Use Lead Discovery Agent to query Google for Shopify stores in Austin.</li>
                  <li>Filter for companies with less than 50 employees.</li>
                  <li>Route URLs to Website Audit Agent to analyze mobile UX scores.</li>
                  <li>Compile top 5 leads with lowest UX scores into CRM.</li>
                </ol>

                <div className="flex space-x-3 pt-2">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 w-full">
                    Approve & Execute
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background hover:bg-accent h-9 px-4 w-full">
                    Edit Plan
                  </button>
                </div>
              </div>
            </div>
            
          </div>

          <div className="p-4 border-t bg-card">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask LeadFlow AI..."
                className="w-full h-12 pl-4 pr-12 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue="Find 5 Shopify stores in Austin with poor mobile UX"
              />
              <button className="absolute right-2 top-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar / Live Stream */}
        <div className="w-full md:w-80 flex flex-col space-y-4">
          <div className="border rounded-xl bg-card shadow-sm p-5 flex-1">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Active Agent Stream</h3>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-xs">Supervisor</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Routed to Lead Discovery</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-primary bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-primary/50 bg-primary/5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-xs text-primary">Lead Discovery</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Querying Google Search...</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
