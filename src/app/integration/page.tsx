"use client";

import { useEffect, useState } from "react";
import { LinkCard } from "@/components/LinkCard";
import type { ContentLink, ProgressEntry } from "@/types";

export default function IntegrationPage() {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [podcasts, setPodcasts] = useState<ContentLink[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    const j = localStorage.getItem("dharma_journal");
    if (j) setSaved(JSON.parse(j));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [linksRes, progressRes] = await Promise.all([
        fetch("/api/links?category=podcast"),
        fetch("/api/progress"),
      ]);

      const linksData = await linksRes.json();
      const progressData = await progressRes.json();

      setPodcasts(linksData.links || []);
      setProgress(progressData.progress || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  function saveEntry() {
    const next = [entry, ...saved].slice(0, 50);
    setSaved(next);
    localStorage.setItem("dharma_journal", JSON.stringify(next));
    setEntry("");
  }

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

  const completedCount = podcasts.filter(p => isCompleted(p.id)).length;
  const completionPercentage = podcasts.length > 0 ? Math.round((completedCount / podcasts.length) * 100) : 0;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Integration & Reflection</h1>
        <p className="opacity-80">Daily prompts, quick check-ins, and ways to connect.</p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-5">
          <h2 className="font-semibold mb-2">Dharma Journal</h2>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="What did you notice today?"
            className="w-full h-28 p-2 rounded border mb-2"
          />
          <button className="px-3 py-2 rounded border" onClick={saveEntry} disabled={!entry.trim()}>
            Save Entry
          </button>
          <div className="mt-4 space-y-2 max-h-64 overflow-auto">
            {saved.map((s, i) => (
              <div key={i} className="p-2 rounded border text-sm whitespace-pre-wrap">{s}</div>
            ))}
            {saved.length === 0 && <p className="opacity-70">No entries yet.</p>}
          </div>
        </div>

        <div className="rounded-lg border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Community & Talks</h2>
            <div className="text-sm opacity-70">
              {completedCount} of {podcasts.length} completed ({completionPercentage}%)
            </div>
          </div>
          <div className="grid gap-3 max-h-80 overflow-y-auto">
            {podcasts.map((p) => (
              <LinkCard 
                key={p.id} 
                id={p.id}
                title={p.title} 
                description={p.description} 
                url={p.url}
                isCompleted={isCompleted(p.id)}
                onToggleComplete={handleToggleComplete}
              />
            ))}
            {podcasts.length === 0 && <p className="opacity-70">No items yet. Add some in Admin.</p>}
          </div>
        </div>
      </section>
    </div>
  );
} 