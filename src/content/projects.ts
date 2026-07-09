export type Project = {
  slug: string;
  title: string;
  role: string;
  stack: string[];
  timeframe: string;
  summary: string;
  problem: string;
  approach: string[];
  outcome: string;
  links: { repo?: string; live?: string };
  status: string;
};

export const projects: Project[] = [
  {
    slug: "blitzcast-nfl-predictor",
    title: "Blitzcast — AI/ML NFL Matchup Predictor",
    role: "Sole developer",
    stack: ["Python", "XGBoost", "Scikit-Learn", "FastAPI", "Next.js", "PostgreSQL"],
    timeframe: "July 2026 – Present",
    summary:
      "An AI/ML-powered NFL win-probability predictor — an XGBoost classifier calibrated and backtested against Vegas closing lines, served through a FastAPI backend and Next.js frontend with Claude-generated broadcast-style narration.",
    problem:
      "Sportsbook closing lines are widely considered the sharpest public estimate of NFL win probability, folding in injuries, weather, market money, and everything in between. The goal was to see how close a model built entirely on public data could get to that benchmark, and to make its reasoning legible instead of a black box.",
    approach: [
      "Built a data pipeline that ingests nflverse, odds, weather, and injury feeds into PostgreSQL on a recurring basis.",
      "Engineered 20 leakage-safe features spanning Elo ratings, rolling EPA, rest days, injuries, weather, and market odds.",
      "Trained and calibrated an XGBoost classifier, backtesting season by season against Vegas closing lines to benchmark accuracy.",
      "Added SHAP-based explainability so each prediction's feature contributions are inspectable, not just the output probability.",
      "Integrated Claude to narrate predictions in a broadcaster style, with guardrails that let it explain the model's numbers but never alter them.",
      "Shipped a FastAPI backend and Next.js frontend, with Alembic migrations, Docker, and a CI pipeline running a 39-test suite.",
    ],
    outcome:
      "A predictor that approaches closing-line accuracy using only public data, with a full production-style stack around it: versioned schema migrations, containerized deployment, and automated testing. Demonstrates applied ML (feature engineering, calibration, explainability) alongside full-stack and LLM-integration engineering.",
    links: {},
    status: "In progress — personal project (no public demo)",
  },
  {
    slug: "personal-portfolio-website",
    title: "Personal Portfolio Website",
    role: "Sole developer",
    stack: ["Next.js", "TypeScript", "React", "Zustand", "react-three-fiber", "Three.js"],
    timeframe: "June 2026 – Present",
    summary:
      "This site — a personal portfolio built as a Windows 95 inspired desktop, with a hand-built drag-and-resize window system and a gated 3D screensaver.",
    problem:
      "A resume and static project list don't capture much about the engineer behind them. The goal was a portfolio that doubles as a demonstration of front-end craft: real interactivity, careful performance and accessibility tradeoffs, and enough personality to be memorable, without sacrificing a fast, crawlable, content-first site underneath.",
    approach: [
      "Designed and built a Windows 95 inspired desktop interface as a presentation layer over a fully server-rendered content layer, so every page is readable with JavaScript disabled.",
      "Hand-built a drag-and-resize floating window system using Pointer Events, committing state only on release to keep dragging smooth.",
      "Implemented a gated 3D screensaver with react-three-fiber, loaded on a delay via dynamic import and skipped for reduced-motion, low-power, or no-WebGL visitors.",
      "Used Next.js for a dual server-rendered and client-side architecture, keeping initial loads fast while layering in rich desktop interactivity.",
      "Managed window, focus, and desktop state on the client with Zustand.",
      "Documented architecture decisions and tradeoffs throughout development in a dedicated design-decisions log.",
    ],
    outcome:
      "A live, production site running the dual-layer architecture, drag/resize window system, and gated screensaver described above. Demonstrates full-stack front-end engineering: performance-conscious rendering architecture, low-level interaction handling, 3D graphics integration, and disciplined documentation of tradeoffs.",
    links: {},
    status: "Live — you're on it now",
  },
  {
    slug: "universal-web-scraper",
    title: "Universal Web Scraper — AI Discovery & Crawling Platform",
    role: "Team member (company hackfest, team of 5)",
    stack: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Redis", "Anthropic Claude API"],
    timeframe: "April 2026",
    summary:
      "AI-powered full-stack platform built in a ~98-hour company hackfest at ConstructConnect, automatically discovering, validating, and crawling websites that publish construction project data.",
    problem:
      "Construction project data is scattered across thousands of publisher websites with no consistent structure, and finding, validating, and extracting from new sources by hand doesn't scale. ConstructConnect's company-wide hackfest challenged teams to build a platform that could discover and crawl these sources automatically, end to end, in roughly 98 hours.",
    approach: [
      "Built the tiered crawler abstraction layer using a Strategy pattern, with automatic escalation from fast HTTP requests up to headless Chromium rendering for JavaScript-heavy sites.",
      "Backed the crawler layer with 113 tests covering strategy selection, escalation, and extraction correctness.",
      "Wired the full-stack integration connecting the discovery, crawling, and analytics modules end to end.",
      "Implemented xlsx export of collected data and applied full ConstructConnect brand theming across the UI.",
      "Integrated FastAPI, PostgreSQL, and Redis for live streaming of crawl progress, with a React and TypeScript front end.",
      "Used the Anthropic Claude API to drive AI-based source discovery and content extraction from crawled pages.",
    ],
    outcome:
      "A working AI-driven discovery-and-crawling platform built from scratch in under 100 hours, with the team shortlisted as a top-16 finalist out of 48 competing teams company-wide. Demonstrated full-stack ownership under a hard deadline, applied design-pattern architecture (Strategy-based crawler escalation), and practical use of an LLM API for source discovery and extraction.",
    links: {},
    status: "Complete — company hackfest project (no public demo)",
  },
  {
    slug: "quandary-interpreter",
    title: "Quandary Interpreter",
    role: "Sole developer",
    stack: ["Java", "JFlex", "Java CUP", "Git"],
    timeframe: "January – April 2025",
    summary:
      "A full interpreter for Quandary, a programming language blending functional and imperative paradigms — lexer, parser, ASTs, concurrency, and a mark-sweep garbage collector.",
    problem:
      "Quandary is a teaching language, used in a programming-languages course at The Ohio State University, that mixes functional and imperative features: immutable and mutable data, recursion, and concurrent execution. The task was to build a complete, working interpreter for it — every stage from raw source text to evaluated results, including automatic memory management.",
    approach: [
      "Extended a JFlex lexical analyzer to tokenize the full Quandary language.",
      "Designed a context-free grammar in Java CUP that parses token streams into abstract syntax trees.",
      "Built the AST node class hierarchy around the visitor design pattern, keeping traversal and evaluation logic separate from the node structure.",
      "Implemented the evaluator with support for recursive functions and concurrent execution.",
      "Wrote a mark-sweep garbage collector to reclaim unreachable heap objects during interpretation.",
    ],
    outcome:
      "A complete interpreter covering the language spec end to end. The deepest computer-science work in my portfolio: language implementation, parsing theory, the visitor pattern at scale, concurrency, and manual memory management.",
    links: {},
    status: "Complete — course project write-up (no public demo)",
  },
  {
    slug: "e-commission-card",
    title: "E-Commission Card",
    role: "Team lead (capstone)",
    stack: ["JavaScript", "React Native", "Expo", "SQL", "AWS", "Amazon Cognito", "Git"],
    timeframe: "January – April 2025",
    summary:
      "Cross-platform mobile app built for NBBI to digitize commission-card management — React Native front end, Amazon Cognito auth, SQL backend.",
    problem:
      "The National Board of Boiler and Pressure Vessel Inspectors (NBBI) issues physical commission cards to certify inspectors. Managing certifications, card details, and employee identification on paper is slow and error-prone. Our senior capstone team at The Ohio State University was asked to move it to mobile.",
    approach: [
      "Led the development team through the full project lifecycle, from requirements with the NBBI stakeholders to delivery.",
      "Engineered a cross-platform mobile application in React Native with Expo, so one codebase serves both iOS and Android.",
      "Implemented secure authentication with Amazon Cognito backed by a SQL database on AWS.",
      "Designed a UI that surfaces certifications, commission-card details, and employee ID at a glance.",
    ],
    outcome:
      "A working cross-platform app delivered to a real client. Equal parts full-stack engineering and leadership: I owned coordination, architecture decisions, and the stakeholder relationship.",
    links: {},
    status: "Complete — capstone write-up (client project, no public demo)",
  },
  {
    slug: "class-schedule-web-scraper",
    title: "Class-Schedule Web Scraper",
    role: "Sole developer",
    stack: ["JavaScript", "HTML", "CSS"],
    timeframe: "February – March 2024",
    summary:
      "A JavaScript scraper that parses the Ohio State class-schedule site for credit hours and meeting times, with console, text-file, and CSV output plus a styled results page.",
    problem:
      "Ohio State's class-schedule site buries the details that actually matter when planning a term — credit hours and weekday meeting times — across many pages, with no export.",
    approach: [
      "Constructed a JavaScript-based scraper that parses the OSU class-schedule site.",
      "Extracted credit hours and weekday meeting schedules for target courses.",
      "Implemented three output modes: console display, text-file export, and CSV formatting.",
      "Built an HTML results page with CSS styling to present the collected data cleanly.",
    ],
    outcome:
      "A small, practical tool: one command turns a sprawling schedule site into a readable page and a CSV. A good exercise in DOM parsing, data shaping, and multi-format output.",
    links: {},
    status: "Complete — write-up (no public demo)",
  },
  {
    slug: "maze-explorer",
    title: "Maze Explorer",
    role: "Sole developer",
    stack: ["Unity", "C#", "Git"],
    timeframe: "February – March 2025",
    summary:
      "A fully playable Unity game, built for a course at The Ohio State University, where a first-person character navigates a maze that's procedurally regenerated every session.",
    problem:
      "A static, hand-built maze gets memorized after a couple of playthroughs. The assignment called for a maze game that stayed genuinely new each time it was played, with real first-person navigation rather than a top-down grid view.",
    approach: [
      "Built a first-person character controller in Unity with a character-mounted camera and custom input actions.",
      "Implemented Prim's algorithm to procedurally generate a unique, fully connected maze on every session.",
      "Developed an algorithm to seed collectible coins into every dead end of the generated maze.",
      "Used Git for version control throughout development.",
    ],
    outcome:
      "A playable game where no two sessions have the same maze. Good practice in procedural generation, first-person control schemes, and shipping a complete, playable loop in Unity.",
    links: {},
    status: "Complete — course project write-up (no public demo)",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
