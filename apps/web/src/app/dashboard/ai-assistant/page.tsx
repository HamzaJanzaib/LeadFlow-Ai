"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Bot, Send, User, Sparkles, Check, Play, Loader2, ListChecks } from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  isPlan?: boolean;
  planData?: {
    planId: string;
    steps: string[];
    status: string;
  };
  runId?: string;
};

export default function AIAssistantPage() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I am your AI Assistant. I can help answer questions or generate automated execution plans for lead discovery and outreach. What would you like to do?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isPlanMode, setIsPlanMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat Mutation
  const { mutate: sendChat, isPending: isChatting } = useMutation({
    mutationFn: async (message: string) => {
      const token = await getToken();
      return await apiClient.post<any>("/ai/chat", { message }, { ...(token && { token }) });
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "ai", content: data.message }
      ]);
    },
    onError: () => toast.error("Failed to send message"),
  });

  // Plan Mutation
  const { mutate: generatePlan, isPending: isPlanning } = useMutation({
    mutationFn: async (goal: string) => {
      const token = await getToken();
      return await apiClient.post<any>("/ai/plan", { goal }, { ...(token && { token }) });
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now().toString(), 
          role: "ai", 
          content: "I have generated an execution plan for your goal. Please review and approve it.",
          isPlan: true,
          planData: {
            planId: data.planId,
            steps: data.steps,
            status: data.status,
          }
        }
      ]);
    },
    onError: () => toast.error("Failed to generate plan"),
  });

  // Approve Plan Mutation
  const { mutate: approvePlan, isPending: isApproving } = useMutation({
    mutationFn: async (planId: string) => {
      const token = await getToken();
      return await apiClient.put<any>(`/ai/plan/${planId}/approve`, undefined, { ...(token && { token }) });
    },
    onSuccess: (data, variables) => {
      toast.success("Plan approved! Execution started.");
      // Update the specific plan message with the runId
      setMessages(prev => prev.map(msg => {
        if (msg.isPlan && msg.planData?.planId === variables) {
          return {
            ...msg,
            runId: data.runId,
            planData: { ...msg.planData, status: "approved" }
          };
        }
        return msg;
      }));
    },
    onError: () => toast.error("Failed to approve plan"),
  });

  // Get active runId from messages to poll
  const activeRunId = messages.find(m => m.runId && m.planData?.status === "approved")?.runId;

  // Poll Run Status
  const { data: runStatus } = useQuery({
    queryKey: ["aiRun", activeRunId],
    queryFn: async () => {
      const token = await getToken();
      return await apiClient.get<any>(`/ai/runs/${activeRunId}`, { ...(token && { token }) });
    },
    enabled: !!activeRunId,
    refetchInterval: 3000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMessage }
    ]);
    setInput("");

    if (isPlanMode) {
      generatePlan(userMessage);
    } else {
      sendChat(userMessage);
    }
  };

  return (
    <div className="flex flex-col -my-8 bg-background" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground leading-none">AI Studio</h1>
            <p className="text-xs text-muted-foreground mt-1">Autonomous Agent Workspace</p>
          </div>
        </div>
        
        {/* Active Run Status Indicator */}
        {activeRunId && runStatus && (
          <div className="flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 px-3 py-1.5 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Running Plan: {runStatus.progress}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === "ai" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
            }`}>
              {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-2xl ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-card border border-border text-foreground shadow-sm rounded-tl-sm"
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>

              {/* Plan Card */}
              {msg.isPlan && msg.planData && (
                <div className="w-full mt-2 bg-card border border-border rounded-xl shadow-card overflow-hidden">
                  <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-brand-500" />
                    <span className="font-semibold text-sm text-foreground">Proposed Execution Plan</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {msg.planData.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-muted/20 border-t border-border flex justify-end">
                    {msg.planData.status === "pending_approval" ? (
                      <button
                        onClick={() => approvePlan(msg.planData!.planId)}
                        disabled={isApproving}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 h-9 px-4 shadow-sm"
                      >
                        {isApproving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                        Approve & Execute
                      </button>
                    ) : (
                      <div className="inline-flex items-center text-sm font-medium text-success">
                        <Check className="w-4 h-4 mr-1" /> Plan Approved
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}

        {(isChatting || isPlanning) && (
          <div className="flex gap-4 max-w-4xl mx-auto flex-row">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-4 rounded-2xl bg-card border border-border text-foreground shadow-sm rounded-tl-sm flex items-center gap-2">
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background">
        <div className="max-w-4xl mx-auto flex flex-col">
          
          <div className="flex items-center gap-2 mb-3 px-1">
            <button
              onClick={() => setIsPlanMode(false)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!isPlanMode ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setIsPlanMode(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${isPlanMode ? 'bg-brand-500 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Plan Mode
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-card border border-border shadow-sm rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isPlanMode ? "Enter a goal to generate an execution plan (e.g. Find 50 SaaS startups)" : "Message AI Studio..."}
              className="w-full max-h-32 min-h-[56px] resize-none bg-transparent px-4 py-4 text-sm text-foreground focus:outline-none scrollbar-hide leading-relaxed"
              rows={1}
            />
            <div className="p-2 flex-shrink-0">
              <button
                type="submit"
                disabled={!input.trim() || isChatting || isPlanning}
                className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
             <p className="text-[10px] text-muted-foreground">AI Studio can make mistakes. Verify important information.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
