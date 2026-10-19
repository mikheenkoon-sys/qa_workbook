import type { ChapterMeta } from "@/types";

const meta: ChapterMeta = {
  slug: "contract-testing",
  title: "Contract Testing",
  description:
    "Consumer-driven contracts, Pact, provider verification, Pact Broker и интеграция контрактных тестов в CI/CD.",
  icon: "🤝",
  order: 11,
  articles: [
    {
      slug: "introduction",
      title: "Основы Contract Testing",
      description:
        "Зачем нужны контракты, роли consumer и provider, место в пирамиде тестов, отличие от E2E.",
    },
    {
      slug: "approaches-and-tools",
      title: "Подходы и инструменты",
      description:
        "Consumer-driven vs provider-driven, schema validation, bi-directional contracts, Pact и альтернативы.",
    },
    {
      slug: "pact-consumer-tests",
      title: "Pact: consumer tests",
      description:
        "Пишем consumer test на TypeScript: interactions, matchers, pact-файл и негативные сценарии.",
    },
    {
      slug: "pact-provider-verification",
      title: "Pact: provider verification",
      description:
        "Verifier, provider states, разбор ошибок верификации и breaking changes.",
    },
    {
      slug: "pact-broker-workflow",
      title: "Pact Broker и рабочий процесс",
      description:
        "Публикация контрактов, версии и ветки, selectors, pending/WIP pacts, can-i-deploy, webhooks.",
    },
    {
      slug: "http-and-async",
      title: "HTTP-статусы, Promise и async/await",
      description:
        "Что фиксировать в HTTP-контракте, статус-коды и корректные async-тесты на TypeScript.",
    },
    {
      slug: "auth-and-ci",
      title: "requestFilter, аутентификация и CI/CD",
      description:
        "Токены при verification, негативные auth-сценарии и пример pipeline в GitHub Actions.",
    },
    {
      slug: "contract-evolution",
      title: "Эволюция контрактов",
      description:
        "Breaking и non-breaking изменения, tolerant reader, expand and contract, deprecation.",
    },
    {
      slug: "best-practices",
      title: "Best practices и anti-patterns",
      description:
        "Что делает контракты устойчивыми, типичные ошибки, чек-лист ревью и план внедрения.",
    },
    {
      slug: "messaging-and-advanced",
      title: "Сообщения и другие протоколы",
      description:
        "Message pacts для Kafka/очередей, gRPC, GraphQL и роль QA в contract testing.",
    },
    {
      slug: "interview-cheatsheet",
      title: "Шпаргалка и вопросы для собеседования",
      description:
        "Краткий словарь, команды и ответы на частые вопросы по contract testing.",
    },
  ],
};

export default meta;
