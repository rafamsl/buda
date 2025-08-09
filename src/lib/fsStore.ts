import fs from "fs";
import path from "path";
import { ContentLink, ContentStore, LinkCategory, ProgressEntry } from "@/types";
import { randomUUID } from "crypto";

const dataDir = path.join(process.cwd(), "data");
const dataPath = path.join(dataDir, "content.json");

async function ensureDataFile(): Promise<void> {
  await fs.promises.mkdir(dataDir, { recursive: true });
  try {
    await fs.promises.access(dataPath, fs.constants.F_OK);
  } catch {
    const initial: ContentStore = { links: [], progress: [] };
    await fs.promises.writeFile(dataPath, JSON.stringify(initial, null, 2), "utf-8");
  }
}

export async function readStore(): Promise<ContentStore> {
  await ensureDataFile();
  const raw = await fs.promises.readFile(dataPath, "utf-8");
  try {
    const parsed = JSON.parse(raw) as ContentStore;
    // Ensure progress array exists for backward compatibility
    if (!parsed.progress) parsed.progress = [];
    return parsed;
  } catch {
    return { links: [], progress: [] };
  }
}

export async function writeStore(store: ContentStore): Promise<void> {
  await ensureDataFile();
  await fs.promises.writeFile(dataPath, JSON.stringify(store, null, 2), "utf-8");
}

export async function listLinks(category?: LinkCategory): Promise<ContentLink[]> {
  const store = await readStore();
  return category ? store.links.filter((l: ContentLink) => l.category === category) : store.links;
}

export async function createLink(partial: Omit<ContentLink, "id">): Promise<ContentLink> {
  const store = await readStore();
  const link: ContentLink = { id: randomUUID(), ...partial };
  store.links.push(link);
  await writeStore(store);
  return link;
}

export async function updateLink(id: string, updates: Partial<Omit<ContentLink, "id">>): Promise<ContentLink | null> {
  const store = await readStore();
  const idx = store.links.findIndex((l: ContentLink) => l.id === id);
  if (idx === -1) return null;
  const updated: ContentLink = { ...store.links[idx], ...updates, id };
  store.links[idx] = updated;
  await writeStore(store);
  return updated;
}

export async function deleteLink(id: string): Promise<boolean> {
  const store = await readStore();
  const initialLen = store.links.length;
  store.links = store.links.filter((l: ContentLink) => l.id !== id);
  const changed = store.links.length !== initialLen;
  if (changed) {
    // Also remove any progress for this link
    store.progress = store.progress.filter((p: ProgressEntry) => p.linkId !== id);
    await writeStore(store);
  }
  return changed;
}

// Progress tracking functions
export async function markAsCompleted(linkId: string, notes?: string): Promise<ProgressEntry> {
  const store = await readStore();
  
  // Remove existing progress for this link
  store.progress = store.progress.filter((p: ProgressEntry) => p.linkId !== linkId);
  
  // Add new progress entry
  const entry: ProgressEntry = {
    linkId,
    completedAt: new Date().toISOString(),
    notes,
  };
  
  store.progress.push(entry);
  await writeStore(store);
  return entry;
}

export async function markAsIncomplete(linkId: string): Promise<boolean> {
  const store = await readStore();
  const initialLen = store.progress.length;
  store.progress = store.progress.filter((p: ProgressEntry) => p.linkId !== linkId);
  const changed = store.progress.length !== initialLen;
  if (changed) await writeStore(store);
  return changed;
}

export async function getProgress(): Promise<ProgressEntry[]> {
  const store = await readStore();
  return store.progress;
}

export async function isCompleted(linkId: string): Promise<boolean> {
  const store = await readStore();
  return store.progress.some((p: ProgressEntry) => p.linkId === linkId);
}

export async function getProgressStats(): Promise<{ total: number; completed: number; percentage: number }> {
  const store = await readStore();
  const total = store.links.length;
  const completed = store.progress.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percentage };
} 