import type { ChapterMeta } from "@/types";

const meta: ChapterMeta = {
  slug: "github-copilot",
  title: "GitHub Copilot Tool",
  description:
    "Learn how to use GitHub Copilot, an AI-powered coding assistant, to boost your development productivity.",
  icon: "🤖",
  order: 1,
  articles: [
    {
      slug: "introduction",
      title: "Introduction to GitHub Copilot",
      description:
        "What GitHub Copilot is, how it works, its history, and why it matters for QA engineers.",
    },
    {
      slug: "features",
      title: "GitHub Copilot Features",
      description:
        "Code completion, Copilot Chat, CLI, PR summaries, slash commands, and Copilot Workspace.",
    },
    {
      slug: "usage-tips",
      title: "Usage Tips & Best Practices",
      description:
        "How to get the most out of Copilot with prompting techniques, limitations, and security considerations.",
    },
  ],
};

export default meta;
