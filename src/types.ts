export type LinkCategory =
  | "reading"
  | "video"
  | "audio"
  | "guided"
  | "podcast";

export interface ContentLink {
  id: string;
  category: LinkCategory;
  title: string;
  description?: string;
  url: string;
}

export interface ProgressEntry {
  linkId: string;
  completedAt: string; // ISO date string
  notes?: string;
}

export interface ContentStore {
  links: ContentLink[];
  progress: ProgressEntry[];
} 