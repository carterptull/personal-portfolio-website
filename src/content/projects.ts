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
    slug: "quandary-interpreter",
    title: "Quandary Interpreter",
    role: "Sole developer",
    stack: ["Java", "JFlex", "Java CUP", "Git"],
    timeframe: "January – April 2025",
    summary:
      "A full interpreter for Quandary, a programming language blending functional and imperative paradigms — lexer, parser, ASTs, concurrency, and a mark-sweep garbage collector.",
    problem:
      "Quandary is a teaching language that mixes functional and imperative features: immutable and mutable data, recursion, and concurrent execution. The task was to build a complete, working interpreter for it — every stage from raw source text to evaluated results, including automatic memory management.",
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
    stack: ["JavaScript", "React Native", "Expo", "SQL", "AWS", "Amazon Cognito"],
    timeframe: "January – April 2025",
    summary:
      "Cross-platform mobile app built for NBBI to digitize commission-card management — React Native front end, Amazon Cognito auth, SQL backend.",
    problem:
      "The National Board of Boiler and Pressure Vessel Inspectors (NBBI) issues physical commission cards to certify inspectors. Managing certifications, card details, and employee identification on paper is slow and error-prone. Our capstone team was asked to move it to mobile.",
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
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
