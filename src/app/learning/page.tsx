"use client";

import { useEffect, useState } from "react";
import { LinkCard } from "@/components/LinkCard";
import type { ContentLink, ProgressEntry } from "@/types";

export default function LearningPage() {
  const [reading, setReading] = useState<ContentLink[]>([]);
  const [video, setVideo] = useState<ContentLink[]>([]);
  const [audio, setAudio] = useState<ContentLink[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [linksRes, progressRes] = await Promise.all([
        fetch("/api/links"),
        fetch("/api/progress"),
      ]);

      const linksData = await linksRes.json();
      const progressData = await progressRes.json();

      const allLinks = linksData.links || [];
      setReading(allLinks.filter((l: ContentLink) => l.category === "reading"));
      setVideo(allLinks.filter((l: ContentLink) => l.category === "video"));
      setAudio(allLinks.filter((l: ContentLink) => l.category === "audio"));
      setProgress(progressData.progress || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getCompletionStats = (items: ContentLink[]) => {
    const completed = items.filter(item => isCompleted(item.id)).length;
    return { completed, total: items.length, percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0 };
  };

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Learning Hub</h1>
        <p className="opacity-80">Curated texts, talks, and podcasts to build foundations.</p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Core Texts & Articles</h2>
          <div className="text-sm opacity-70">
            {getCompletionStats(reading).completed} of {getCompletionStats(reading).total} completed ({getCompletionStats(reading).percentage}%)
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reading.map((l) => (
            <LinkCard 
              key={l.id} 
              id={l.id}
              title={l.title} 
              description={l.description} 
              url={l.url}
              isCompleted={isCompleted(l.id)}
              onToggleComplete={handleToggleComplete}
            />
          ))}
          {reading.length === 0 && <p className="opacity-70">No items yet. Add some in Admin.</p>}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Video Resources</h2>
          <div className="text-sm opacity-70">
            {getCompletionStats(video).completed} of {getCompletionStats(video).total} completed ({getCompletionStats(video).percentage}%)
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {video.map((l) => (
            <LinkCard 
              key={l.id} 
              id={l.id}
              title={l.title} 
              description={l.description} 
              url={l.url}
              isCompleted={isCompleted(l.id)}
              onToggleComplete={handleToggleComplete}
            />
          ))}
          {video.length === 0 && <p className="opacity-70">No items yet. Add some in Admin.</p>}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Audio & Podcasts</h2>
          <div className="text-sm opacity-70">
            {getCompletionStats(audio).completed} of {getCompletionStats(audio).total} completed ({getCompletionStats(audio).percentage}%)
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audio.map((l) => (
            <LinkCard 
              key={l.id} 
              id={l.id}
              title={l.title} 
              description={l.description} 
              url={l.url}
              isCompleted={isCompleted(l.id)}
              onToggleComplete={handleToggleComplete}
            />
          ))}
          {audio.length === 0 && <p className="opacity-70">No items yet. Add some in Admin.</p>}
        </div>
      </section>
    </div>
  );
} 