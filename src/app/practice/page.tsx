"use client";

import { useEffect, useMemo, useState } from "react";
import { LinkCard } from "@/components/LinkCard";
import type { ContentLink, ProgressEntry } from "@/types";

export default function PracticePage() {
  const [guided, setGuided] = useState<ContentLink[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [linksRes, progressRes] = await Promise.all([
        fetch("/api/links?category=guided"),
        fetch("/api/progress"),
      ]);

      const linksData = await linksRes.json();
      const progressData = await progressRes.json();

      setGuided(linksData.links || []);
      setProgress(progressData.progress || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mmss = useMemo(() => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [seconds]);

  const isCompleted = (linkId: string) => {
    return progress.some(p => p.linkId === linkId);
  };

  const handleToggleComplete = (linkId: string, completed: boolean) => {
    if (completed) {
      setProgress(prev => [...prev, { linkId, completedAt: new Date().toISOString() }]);
    } else {
      setProgress(prev => prev.filter(p => p.linkId !== linkId));
    }
  };

  const completedCount = guided.filter(g => isCompleted(g.id)).length;
  const completionPercentage = guided.length > 0 ? Math.round((completedCount / guided.length) * 100) : 0;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Practice Lab</h1>
        <p className="opacity-80">Mindfulness of breath, body scan, walking, and loving-kindness.</p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-5">
          <h2 className="font-semibold mb-3">Meditation Timer</h2>
          <div className="text-4xl font-mono mb-4">{mmss}</div>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded border" onClick={() => setRunning((r) => !r)}>
              {running ? "Pause" : "Start"}
            </button>
            <button className="px-3 py-2 rounded border" onClick={() => setSeconds(300)}>Reset (5m)</button>
            <button className="px-3 py-2 rounded border" onClick={() => setSeconds(1200)}>20m</button>
          </div>
        </div>
        
        <div className="rounded-lg border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Guided Meditations</h2>
            <div className="text-sm opacity-70">
              {completedCount} of {guided.length} completed ({completionPercentage}%)
            </div>
          </div>
          <div className="grid gap-3 max-h-80 overflow-y-auto">
            {guided.map((g) => (
              <LinkCard 
                key={g.id} 
                id={g.id}
                title={g.title} 
                description={g.description} 
                url={g.url}
                isCompleted={isCompleted(g.id)}
                onToggleComplete={handleToggleComplete}
              />
            ))}
            {guided.length === 0 && <p className="opacity-70">No items yet. Add some in Admin.</p>}
          </div>
        </div>
      </section>
    </div>
  );
} 