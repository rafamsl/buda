"use client";

import Link from "next/link";
import { useState } from "react";

interface LinkCardProps {
  id: string;
  title: string;
  description?: string;
  url: string;
  isCompleted?: boolean;
  onToggleComplete?: (id: string, completed: boolean) => void;
}

export function LinkCard({ id, title, description, url, isCompleted = false, onToggleComplete }: LinkCardProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId: id,
          action: completed ? "incomplete" : "complete",
        }),
      });

      if (response.ok) {
        const newCompleted = !completed;
        setCompleted(newCompleted);
        onToggleComplete?.(id, newCompleted);
      } else {
        console.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-lg border p-4 hover:shadow-sm transition relative ${
      completed ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "border-black/10 dark:border-white/10"
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1">
            <Link href={url} target="_blank" className="hover:underline">
              {title}
            </Link>
          </h3>
          {description && <p className="text-sm opacity-80">{description}</p>}
        </div>
        <button
          onClick={handleToggleComplete}
          disabled={loading}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            completed 
              ? "bg-green-500 border-green-500 text-white" 
              : "border-gray-300 dark:border-gray-600 hover:border-green-500"
          } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          title={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && !loading && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {loading && (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          )}
        </button>
      </div>
    </div>
  );
} 