"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Something went wrong</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            {this.state.error?.message || "An unexpected error occurred while rendering this component."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false } as any);
              window.location.reload();
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
