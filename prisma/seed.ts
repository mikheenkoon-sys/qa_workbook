import { PrismaClient } from "@prisma/client";
import { quizzes as copilotQuizzes } from "../content/github-copilot/questions";

const prisma = new PrismaClient();

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

  console.log("Seeding GitHub Copilot quizzes…");
  const copilotChapter = await prisma.chapter.findUniqueOrThrow({
    where: { slug: "github-copilot" },
  });

  for (const quiz of copilotQuizzes) {
    const created = await prisma.quiz.upsert({
      where: { slug: quiz.slug },
      update: {},
      create: {
        chapterId:   copilotChapter.id,
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

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
