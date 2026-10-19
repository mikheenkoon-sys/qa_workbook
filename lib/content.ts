import type { ChapterMeta } from "@/types";
import githubCopilotMeta from "@/content/github-copilot/meta";

// Register chapter metas here as new chapters are added
const registry: Record<string, ChapterMeta> = {
  "github-copilot": githubCopilotMeta,
};

export function getChapterMeta(slug: string): ChapterMeta | null {
  return registry[slug] ?? null;
}
