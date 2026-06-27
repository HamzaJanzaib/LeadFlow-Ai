import * as React from "react";
import { cn } from "@/lib/utils";
import { FileQuestion, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onClick?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  actionHref,
  onClick,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-300 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#13151a]/50", className)}>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        {description}
      </p>
      
      {(actionLabel && actionHref) && (
        <Link 
          href={actionHref}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Link>
      )}
      
      {(actionLabel && onClick && !actionHref) && (
        <button 
          onClick={onClick}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
