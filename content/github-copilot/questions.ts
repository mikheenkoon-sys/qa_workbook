export type OptionData = { text: string; isCorrect: boolean };
export type QuestionData = {
  text: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  order: number;
  options: OptionData[];
};
export type QuizData = {
  slug: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  questions: QuestionData[];
};

export const quizzes: QuizData[] = [
  {
    slug: "github-copilot-introduction",
    title: "Introduction Quiz",
    description: "Test your knowledge of GitHub Copilot basics, history, and pricing.",
    difficulty: "BEGINNER",
    questions: [
      {
        text: "Who developed GitHub Copilot?",
        type: "MULTIPLE_CHOICE",
        order: 1,
        options: [
          { text: "GitHub alone", isCorrect: false },
          { text: "GitHub in collaboration with OpenAI", isCorrect: true },
          { text: "Microsoft alone", isCorrect: false },
          { text: "Google and GitHub", isCorrect: false },
        ],
      },
      {
        text: "Which of the following IDEs does GitHub Copilot support?",
        type: "MULTIPLE_CHOICE",
        order: 2,
        options: [
          { text: "Only Visual Studio Code", isCorrect: false },
          { text: "VS Code and JetBrains IDEs only", isCorrect: false },
          { text: "VS Code, JetBrains IDEs, Visual Studio, and Neovim", isCorrect: true },
          { text: "Only cloud-based IDEs", isCorrect: false },
        ],
      },
      {
        text: "What is GitHub Copilot Workspace?",
        type: "MULTIPLE_CHOICE",
        order: 3,
        options: [
          { text: "A browser extension for GitHub", isCorrect: false },
          { text: "A task-centric environment where you can implement GitHub Issues with AI assistance across multiple files", isCorrect: true },
          { text: "A collaborative live-coding environment for teams", isCorrect: false },
          { text: "A Docker-based cloud development container", isCorrect: false },
        ],
      },
      {
        text: "Which GitHub Copilot tier is available for free?",
        type: "MULTIPLE_CHOICE",
        order: 4,
        options: [
          { text: "The Professional tier for all developers", isCorrect: false },
          { text: "All GitHub users get Copilot free", isCorrect: false },
          { text: "Students and verified open-source maintainers via GitHub Education", isCorrect: true },
          { text: "Only users with a GitHub Pro subscription", isCorrect: false },
        ],
      },
      {
        text: "GitHub Copilot was first announced as a technical preview in 2021.",
        type: "TRUE_FALSE",
        order: 5,
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
      },
    ],
  },
  {
    slug: "github-copilot-features",
    title: "Features Quiz",
    description: "Check your understanding of Copilot Chat, CLI, slash commands, and integrations.",
    difficulty: "BEGINNER",
    questions: [
      {
        text: "What is the keyboard shortcut to accept a GitHub Copilot inline suggestion in VS Code?",
        type: "MULTIPLE_CHOICE",
        order: 1,
        options: [
          { text: "Enter", isCorrect: false },
          { text: "Ctrl + Space", isCorrect: false },
          { text: "Tab", isCorrect: true },
          { text: "Ctrl + Enter", isCorrect: false },
        ],
      },
      {
        text: "Which Copilot Chat slash command generates unit tests for selected code?",
        type: "MULTIPLE_CHOICE",
        order: 2,
        options: [
          { text: "/doc", isCorrect: false },
          { text: "/fix", isCorrect: false },
          { text: "/tests", isCorrect: true },
          { text: "/run", isCorrect: false },
        ],
      },
      {
        text: "What does the @workspace participant in Copilot Chat do?",
        type: "MULTIPLE_CHOICE",
        order: 3,
        options: [
          { text: "Switches your VS Code workspace configuration", isCorrect: false },
          { text: "Allows you to ask questions about your entire project codebase", isCorrect: true },
          { text: "Opens a new workspace window", isCorrect: false },
          { text: "Shares your workspace with another developer", isCorrect: false },
        ],
      },
      {
        text: "What is the primary purpose of GitHub Copilot CLI?",
        type: "MULTIPLE_CHOICE",
        order: 4,
        options: [
          { text: "To deploy applications to cloud providers via the terminal", isCorrect: false },
          { text: "To replace the GitHub CLI (gh) tool entirely", isCorrect: false },
          { text: "To bring AI assistance to terminal commands — explaining and suggesting shell commands", isCorrect: true },
          { text: "To generate GitHub Actions workflow files", isCorrect: false },
        ],
      },
      {
        text: "GitHub Copilot can automatically generate a pull request description based on the code diff.",
        type: "TRUE_FALSE",
        order: 5,
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
      },
    ],
  },
  {
    slug: "github-copilot-best-practices",
    title: "Best Practices Quiz",
    description: "Test your knowledge of effective prompting, privacy, security, and limitations.",
    difficulty: "INTERMEDIATE",
    questions: [
      {
        text: "Writing descriptive comments before your code helps GitHub Copilot generate more accurate suggestions.",
        type: "TRUE_FALSE",
        order: 1,
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
      },
      {
        text: "GitHub Copilot can browse the internet in real time to fetch up-to-date documentation.",
        type: "TRUE_FALSE",
        order: 2,
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true },
        ],
      },
      {
        text: "Opening related files (interfaces, utilities, examples) in your editor gives Copilot more context for better suggestions.",
        type: "TRUE_FALSE",
        order: 3,
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
      },
      {
        text: "Which of the following is a known limitation of GitHub Copilot?",
        type: "MULTIPLE_CHOICE",
        order: 4,
        options: [
          { text: "It only works with JavaScript and TypeScript", isCorrect: false },
          { text: "Its training data has a cutoff date, so it may suggest deprecated APIs", isCorrect: true },
          { text: "It requires a minimum of 100 lines of code before generating suggestions", isCorrect: false },
          { text: "It can only produce single-line completions", isCorrect: false },
        ],
      },
      {
        text: "What is the recommended best practice when using GitHub Copilot for security-critical code?",
        type: "MULTIPLE_CHOICE",
        order: 5,
        options: [
          { text: "Accept all suggestions without review since AI accuracy is very high", isCorrect: false },
          { text: "Never use Copilot for any backend code", isCorrect: false },
          { text: "Always review, test, and fully understand every suggestion before accepting it", isCorrect: true },
          { text: "Only use Copilot for frontend UI code", isCorrect: false },
        ],
      },
    ],
  },
];
