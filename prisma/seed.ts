import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { QuizSchema, type QuizData } from "../lib/quiz-schema";

const prisma = new PrismaClient();
const CONTENT_DIR = path.join(process.cwd(), "content");

// Loads and validates content/<chapter-slug>/quizzes/*.json
function loadQuizzes(chapterSlug: string): QuizData[] {
  const dir = path.join(CONTENT_DIR, chapterSlug, "quizzes");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const raw: unknown = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const result = QuizSchema.safeParse(raw);
      if (!result.success) {
        throw new Error(`Invalid quiz file ${chapterSlug}/quizzes/${file}:\n${result.error.message}`);
      }
      return result.data;
    });
}

const chapters = [
  { slug: "github-copilot",        title: "GitHub Copilot Tool",           description: "Learn to use GitHub Copilot, an AI-powered coding assistant.", icon: "🤖", order: 1  },
  { slug: "qa-theory",             title: "QA Theory",                      description: "Testing fundamentals, types, SDLC, and the bug lifecycle.",       icon: "📚", order: 2  },
  { slug: "qa-automation",         title: "QA Automation",                  description: "Test frameworks, automation strategies, and CI/CD integration.", icon: "⚙️", order: 3  },
  { slug: "qa-tools",              title: "QA Tools",                       description: "Jira, TestRail, Postman, Allure, and other essential QA tools.", icon: "🛠️", order: 4  },
  { slug: "web-frontend-testing",  title: "Web Frontend Testing",           description: "Playwright, Cypress, Selenium — browser automation & UI testing.", icon: "🌐", order: 5  },
  { slug: "backend-testing",       title: "Backend & API Testing",          description: "REST, GraphQL, contract testing, and integration test strategies.", icon: "🔌", order: 6  },
  { slug: "programming-languages", title: "Programming Languages for QA",   description: "JavaScript/TypeScript and Python essentials for test automation.", icon: "💻", order: 7  },
  { slug: "performance-testing",   title: "Performance & Load Testing",     description: "k6, JMeter, Gatling — measuring and validating system performance.", icon: "⚡", order: 8  },
  { slug: "security-testing",      title: "Security Testing Basics",        description: "OWASP Top 10, Burp Suite introduction, and security test techniques.", icon: "🔒", order: 9  },
  { slug: "mobile-testing",        title: "Mobile Testing",                 description: "Appium, device farms, and mobile-specific test strategies.", icon: "📱", order: 10 },
  { slug: "contract-testing",      title: "Contract Testing",               description: "Consumer-driven contracts, Pact, provider verification и CI/CD.", icon: "🤝", order: 11 },
];

async function main() {
  console.log("Seeding chapters…");
  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: { slug: chapter.slug },
      update: {},
      create: chapter,
    });
  }

  for (const chapter of chapters) {
    const quizzes = loadQuizzes(chapter.slug);
    if (quizzes.length === 0) continue;

    console.log(`Seeding ${chapter.title} quizzes…`);
    const dbChapter = await prisma.chapter.findUniqueOrThrow({
      where: { slug: chapter.slug },
    });

    for (const quiz of quizzes) {
      const created = await prisma.quiz.upsert({
        where: { slug: quiz.slug },
        update: {},
        create: {
          chapterId:   dbChapter.id,
          slug:        quiz.slug,
          title:       quiz.title,
          description: quiz.description,
          difficulty:  quiz.difficulty,
        },
      });

      // Only seed questions if none exist yet
      const existing = await prisma.question.count({ where: { quizId: created.id } });
      if (existing > 0) continue;

      for (const q of quiz.questions) {
        await prisma.question.create({
          data: {
            quizId: created.id,
            text:   q.text,
            type:   q.type,
            order:  q.order,
            options: { create: q.options },
          },
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
