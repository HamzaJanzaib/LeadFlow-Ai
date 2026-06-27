"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { ArrowLeft, Save, Settings, Play, Bot, AlertTriangle } from "lucide-react";

export default function WorkflowBuilderPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  
  const { data: workflow, isLoading } = useQuery({
    queryKey: ["workflow", params.id],
    queryFn: async () => {
      if (isNew) return null;
      return await apiClient.get<any>(`/workflows/${params.id}`);
    },
    enabled: !isNew,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1c23]">
        <div className="flex items-center gap-4">
          <Link href="/workflows" className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{isNew ? "Create New Workflow" : workflow?.name || "Loading..."}</h1>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span> Draft
              </span>
              <span>•</span>
              <span>Unsaved changes</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 h-9 px-4 py-2 border border-gray-300 dark:border-gray-700">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2">
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-green-600 text-white shadow hover:bg-green-700 h-9 px-4 py-2">
            <Play className="w-4 h-4 mr-2" />
            Activate
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-gray-50 dark:bg-[#13151a] relative overflow-hidden flex">
        {/* Placeholder for React Flow */}
        <div className="absolute inset-0 pattern-dots pattern-gray-200 dark:pattern-gray-800 pattern-bg-transparent pattern-size-4 opacity-50"></div>
        
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 z-10">
          <div className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl p-8 max-w-lg shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <Bot className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Visual Workflow Builder</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The React Flow based drag-and-drop builder is ready to be implemented. For now, you can configure workflows via the API.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 text-left flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-400">
                <strong>Next Step:</strong> Install <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 py-0.5 rounded mx-0.5 text-xs">reactflow</code> and build custom nodes for Triggers, Filters, and Actions (Email, Webhook, AI).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
