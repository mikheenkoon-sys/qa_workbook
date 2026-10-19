import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export function getArticleContent(chapterSlug: string, articleSlug: string) {
  const chapterDir = path.join(contentDir, chapterSlug);
  const filePath = path.join(chapterDir, `${articleSlug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data: frontmatter } = matter(raw);
  return { content, frontmatter };
}

export function getChapterArticleSlugs(chapterSlug: string): string[] {
  const chapterDir = path.join(contentDir, chapterSlug);
  if (!fs.existsSync(chapterDir)) return [];

  return fs
    .readdirSync(chapterDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
