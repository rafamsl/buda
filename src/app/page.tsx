"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [stats, setStats] = useState<{ total: number; completed: number; percentage: number } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [linksRes, progressRes] = await Promise.all([
        fetch("/api/links"),
        fetch("/api/progress"),
      ]);

      const linksData = await linksRes.json();
      const progressData = await progressRes.json();

      const total = linksData.links?.length || 0;
      const completed = progressData.progress?.length || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({ total, completed, percentage });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  return (
    <div className="space-y-8">
      {stats && (
        <div className="rounded-lg border p-5 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
          <h2 className="font-semibold text-lg mb-2">Your Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Completion</span>
                <span>{stats.completed} of {stats.total} items</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.percentage}%
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border p-5">
          <h2 className="font-semibold text-lg mb-2">Learning Hub</h2>
          <p className="text-sm opacity-80 mb-3">Read, watch, and listen — your core knowledge base.</p>
          <Link href="/learning" className="text-blue-600 hover:underline">Explore →</Link>
        </div>
        <div className="rounded-lg border p-5">
          <h2 className="font-semibold text-lg mb-2">Practice Lab</h2>
          <p className="text-sm opacity-80 mb-3">Meditation basics, guided tracks, and a simple timer.</p>
          <Link href="/practice" className="text-blue-600 hover:underline">Start practicing →</Link>
        </div>
        <div className="rounded-lg border p-5">
          <h2 className="font-semibold text-lg mb-2">Integration & Reflection</h2>
          <p className="text-sm opacity-80 mb-3">Daily prompts, reflections, and community links.</p>
          <Link href="/integration" className="text-blue-600 hover:underline">Open →</Link>
        </div>
      </div>
    </div>
  );
}
