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
  links: { repo?: string; live?: string; npm?: string };
  status: string;
};

export const projects: Project[] = [
  {
    slug: "ampline-claude",
    title: "Ampline — Color-Graded Statusline for Claude Code",
    role: "Sole developer",
    stack: ["JavaScript", "Node.js", "npm", "Developer Tools", "Claude Code"],
    timeframe: "August 2026 to Present",
    summary:
      "A zero-dependency statusline for Claude Code, published to npm. It maps the model and effort level onto a 16-step color wheel so you can tell what's running without reading the text.",
    problem:
      "The statusline is always on screen, so you end up glancing at it constantly to check which model and effort level are active. Reading it every time gets old. Color fixes that, but only if you're careful about it. If the model badge and the usage bars pull from the same palette, a red badge and a red context bar look the same, and the one that actually matters gets lost.",
    approach: [
      "Mapped model and effort level onto a 16-step color wheel, so every combination gets its own predictable hue.",
      "Gave context and rate-limit usage their own green-to-red ramp, kept separate from the model colors so the two can't be confused.",
      "Built around how Claude Code really runs these scripts. There's no TTY, the JSON arrives piped over stdin, and the script gets cancelled if it doesn't exit fast.",
      "Added a write-through cache so the rate-limit bars still show last-known values on a cold start, before the first API response comes back.",
      "Made each segment degrade on its own, so missing data just drops that piece and the rest of the line still renders.",
      "Wrote an installer and uninstaller that detect an existing statusline config and leave it alone.",
      "Kept the package at zero runtime dependencies.",
    ],
    outcome:
      "Published to npm and in active development. Most of the work went into the constraints around it, like the latency budget, the cold-start cache, and making sure a bad install couldn't wipe out someone's existing config.",
    links: {
      repo: "https://github.com/carterptull/ampline-claude",
      npm: "https://www.npmjs.com/package/ampline-claude",
    },
    status: "Published on npm, actively developed",
  },
  {
    slug: "blitzcast",
    title: "Blitzcast — AI/ML Football Matchup Predictor",
    role: "Sole developer",
    stack: ["Python", "XGBoost", "Scikit-Learn", "SHAP", "FastAPI", "Next.js", "PostgreSQL"],
    timeframe: "July 2026 to Present",
    summary:
      "A win-probability predictor for NFL and college football. An XGBoost model, calibrated with Platt scaling and walk-forward backtested against Vegas closing lines, served through a FastAPI backend and a Next.js frontend.",
    problem:
      "Closing lines are about the best public estimate of win probability you can get. They already account for injuries, weather, and where the money went. I wanted to see how close I could get to that using only public data, and I wanted to be able to explain any individual prediction afterward.",
    approach: [
      "Built a pipeline that pulls nflverse, odds, weather, and injury data into PostgreSQL on a schedule, covering both NFL and college football.",
      "Engineered 20 leakage-safe features across Elo ratings, rolling EPA, rest days, injuries, weather, and market odds.",
      "Trained an XGBoost classifier and calibrated it with Platt scaling, so a 70% prediction actually means about 70%.",
      "Backtested walk-forward, season by season, training only on data that existed at prediction time so the comparison against closing lines holds up.",
      "Added SHAP so I can see which features drove any given prediction.",
      "Wired in Claude to narrate the predictions in a broadcast style, with guardrails that keep it from touching the numbers.",
      "Shipped the FastAPI backend and Next.js frontend with Alembic migrations, Docker, and CI running a 39-test suite.",
    ],
    outcome:
      "The model gets close to closing-line accuracy on public data alone. Calibration and walk-forward validation were the parts that mattered most, since both are easy to skip and both are what make the benchmark mean anything. Live now at blitzcast.app, with the model and UI both still being actively improved.",
    links: {
      repo: "https://github.com/carterptull/blitzcast",
      live: "https://www.blitzcast.app",
    },
    status: "Live at blitzcast.app, actively improved",
  },
  {
    slug: "claude-code-workbench",
    title: "Claude Code Workbench — Agentic Developer Tooling Framework",
    role: "Sole developer",
    stack: [
      "Python",
      "Bash",
      "Git",
      "Claude Code",
      "Prompt Engineering",
      "GitHub Actions",
    ],
    timeframe: "May 2026 to Present",
    summary:
      "An open-source Claude Code configuration framework with 11 custom skills, 6 subagents routed across Opus, Sonnet, and Haiku, and 5 lifecycle hooks. The idea is to stay out of the way for anything reversible and ask for a human on the few things that aren't.",
    problem:
      "Most setups land on one of two defaults. Either everything is approved automatically, or every action prompts you. The second one sounds safer but trains you to click approve without reading, so the prompt that actually mattered gets waved through with the rest. The useful question is which actions are genuinely hard to undo, because those are the only ones worth interrupting for.",
    approach: [
      "Picked two actions worth stopping for, both hard to undo. A secret leaving a file, and code leaving the machine. Everything reversible runs without prompting.",
      "Matched the severity to the risk. Reading .env files, private keys, and credentials is a hard deny, since a secret in the context window can end up in a log or a summary. Git commit and push return ask, so there's a pause but I still make the call.",
      "Wrote every hook to fail open on bad input, so a broken guardrail can't wedge a session.",
      "Routed subagents by where the model choice changes the answer. Opus for RAG and LLM security review, Sonnet as the default, Haiku for the two agents that mostly parse and format.",
      "Built a checkpoint system around a gap in the platform. Plan-quota usage isn't exposed to any hook, so a PreCompact trigger handles context pressure and a manual command covers the quota case. The PROGRESS.md it writes keeps the dead ends that were already ruled out.",
      "Shipped a symlink-based installer that won't silently overwrite, with --dry-run and a required --force to replace anything already there.",
      "Added CI that checks frontmatter, allowed model and effort values, hook compilation, and that settings.json only points at hooks that exist.",
      "Ran a cross-platform pass before release that turned up 8 real bugs, including Windows path handling, CRLF and WSL issues, and a PATH resolution failure that made hooks silently never fire.",
      "Wrote up the known limitations, including a Windows symlink fallback that quietly turns into a plain copy.",
      "Included transcripts of each guardrail and agent actually running.",
    ],
    outcome:
      "A public, MIT-licensed framework that I install on my own machine and that doubles as a worked example. The decisions were the hard part. Which risks get a deny versus an ask, how to keep a guardrail from becoming the outage, and where the platform's own limits stop the design from going further.",
    links: { repo: "https://github.com/carterptull/claude-code-workbench" },
    status: "Published on GitHub, MIT licensed",
  },
  {
    slug: "personal-portfolio-website",
    title: "Personal Portfolio Website",
    role: "Sole developer",
    stack: ["Next.js", "TypeScript", "React", "Zustand", "react-three-fiber", "Three.js"],
    timeframe: "June 2026 to Present",
    summary:
      "This site. It's built as an interactive Windows 95/98 desktop with draggable windows, a boot sequence, and an idle 3D screensaver, sitting on top of a server-rendered site that stays fast and crawlable.",
    problem:
      "A resume and a list of links don't say much about how someone actually builds things. I wanted a portfolio that showed some front-end work directly, with real interactivity and some personality, without giving up a fast, crawlable site underneath it.",
    approach: [
      "Built the Windows 95 desktop as a presentation layer over a fully server-rendered content layer, so every page still reads with JavaScript off.",
      "Hand-built the drag-and-resize window system on Pointer Events, committing state only on release to keep dragging smooth.",
      "Gated the 3D screensaver behind an idle timer and a dynamic import, and skipped it for reduced-motion, low-power, and no-WebGL visitors.",
      "Used Next.js so the server-rendered and client-side layers could coexist without slowing down the initial load.",
      "Kept window, focus, and desktop state on the client with Zustand.",
      "Logged the architecture decisions and tradeoffs in a separate design-decisions file as I went.",
      "Ran a full security and accessibility review before launch, then shipped a Content-Security-Policy and the rest of the security headers, deriving each allowance from what the app actually does rather than copying a template.",
    ],
    outcome:
      "Live at cartertull.com, running the dual-layer setup described above. The interesting parts were the rendering architecture, the low-level pointer handling for drag and resize, keeping the 3D work off the critical path, and writing a CSP strict enough to be worth having without breaking the embedded PDF and video.",
    links: {
      repo: "https://github.com/carterptull/personal-portfolio-website",
      live: "https://cartertull.com",
    },
    status: "Live at cartertull.com, you're on it now",
  },
  {
    slug: "universal-web-scraper",
    title: "Universal Web Scraper — AI Discovery & Crawling Platform",
    role: "Team member (company hackfest, team of 5)",
    stack: ["Python", "FastAPI", "React.js", "TypeScript", "PostgreSQL"],
    timeframe: "April 2026",
    summary:
      "A full-stack platform built in a 98-hour company hackfest at ConstructConnect that finds, validates, and crawls websites publishing construction project data.",
    problem:
      "Construction project data sits on thousands of publisher websites with no shared structure. Finding and validating new sources by hand doesn't scale. The hackfest brief was to build something that could discover and crawl them automatically in about 98 hours.",
    approach: [
      "Built the tiered crawler layer with a Strategy pattern, escalating from plain HTTP requests up to headless Chromium for JavaScript-heavy sites.",
      "Covered that layer with 113 tests across strategy selection, escalation, and extraction.",
      "Wired the discovery, crawling, and analytics modules together end to end.",
      "Added xlsx export and applied ConstructConnect brand theming across the UI.",
      "Used FastAPI and PostgreSQL to stream crawl progress live into a React and TypeScript front end.",
      "Used the Anthropic Claude API for source discovery and content extraction.",
    ],
    outcome:
      "A working platform built from scratch in under 100 hours, and the team finished as a top-16 finalist out of 48. Good practice at owning a full stack on a hard deadline.",
    links: {},
    status: "Complete, company hackfest project (no public demo)",
  },
  {
    slug: "quandary-interpreter",
    title: "Quandary Interpreter",
    role: "Sole developer",
    stack: ["Java", "JFlex", "Java CUP", "Git"],
    timeframe: "January to April 2025",
    summary:
      "A complete interpreter for Quandary, a language that mixes functional and imperative features. Covers the lexer, parser, ASTs, concurrency, and a mark-sweep garbage collector.",
    problem:
      "Quandary is a teaching language from a programming-languages course at Ohio State. It has immutable and mutable data, recursion, and concurrent execution. The assignment was to build a working interpreter for all of it, from raw source text through to evaluated results, including memory management.",
    approach: [
      "Extended a JFlex lexer to tokenize the full language.",
      "Wrote a context-free grammar in Java CUP that parses token streams into ASTs.",
      "Built the AST node hierarchy around the visitor pattern, keeping traversal separate from the node structure.",
      "Implemented the evaluator with recursive functions and concurrent execution.",
      "Wrote a mark-sweep garbage collector to reclaim unreachable heap objects during interpretation.",
    ],
    outcome:
      "A full interpreter covering the language spec. This is the deepest computer-science work I've done, and the garbage collector and the visitor-pattern evaluator were the two pieces I learned the most from.",
    links: {},
    status: "Complete, course project write-up (no public demo)",
  },
  {
    slug: "e-commission-card",
    title: "E-Commission Card",
    role: "Team lead (capstone)",
    stack: ["JavaScript", "React Native", "Expo", "SQL", "AWS", "Amazon Cognito", "Git"],
    timeframe: "January to April 2025",
    summary:
      "A cross-platform mobile app built for NBBI to replace paper commission cards, with a React Native front end, Amazon Cognito auth, and a SQL backend.",
    problem:
      "The National Board of Boiler and Pressure Vessel Inspectors issues physical commission cards to certify inspectors. Tracking certifications, card details, and employee ID on paper is slow and easy to get wrong. Our senior capstone team at Ohio State was asked to move it onto phones.",
    approach: [
      "Led the team through the full lifecycle, from requirements with the NBBI stakeholders through delivery.",
      "Built the app in React Native with Expo so one codebase covers iOS and Android.",
      "Set up authentication with Amazon Cognito against a SQL database on AWS.",
      "Designed the UI so certifications, card details, and employee ID are all visible at a glance.",
    ],
    outcome:
      "Delivered a working app to a real client. I owned the coordination and the stakeholder relationship alongside the architecture decisions, which was as much of the work as the code.",
    links: {},
    status: "Complete, capstone write-up (client project, no public demo)",
  },
  {
    slug: "class-schedule-web-scraper",
    title: "Class-Schedule Web Scraper",
    role: "Sole developer",
    stack: ["JavaScript", "HTML", "CSS"],
    timeframe: "February to March 2024",
    summary:
      "A JavaScript scraper that pulls credit hours and meeting times off the Ohio State class-schedule site, with console, text-file, and CSV output plus a styled results page.",
    problem:
      "Ohio State's class-schedule site spreads the details you need for planning a term, credit hours and weekday meeting times, across a lot of pages, and there's no way to export any of it.",
    approach: [
      "Wrote a JavaScript scraper that parses the OSU class-schedule site.",
      "Pulled credit hours and weekday meeting schedules for the target courses.",
      "Added three output modes: console, text file, and CSV.",
      "Built an HTML results page with CSS styling to show the collected data.",
    ],
    outcome:
      "A small tool that turns a sprawling schedule site into one readable page and a CSV. Mostly an exercise in DOM parsing and shaping the same data into a few different output formats.",
    links: {},
    status: "Complete, write-up (no public demo)",
  },
  {
    slug: "maze-explorer",
    title: "Maze Explorer",
    role: "Sole developer",
    stack: ["Unity", "C#", "Git"],
    timeframe: "February to March 2025",
    summary:
      "A playable Unity game, built for a course at Ohio State, where a first-person character navigates a maze that gets regenerated every session.",
    problem:
      "A hand-built maze gets memorized after two playthroughs. The assignment called for one that stayed new every time, and it had to be played in first person, not from a top-down grid view.",
    approach: [
      "Built a first-person character controller in Unity with a mounted camera and custom input actions.",
      "Used Prim's algorithm to generate a unique, fully connected maze each session.",
      "Wrote an algorithm to drop collectible coins into every dead end of the generated maze.",
      "Used Git for version control throughout.",
    ],
    outcome:
      "A playable game where no two runs have the same maze. Good practice with procedural generation and first-person controls, and with finishing a complete gameplay loop.",
    links: {},
    status: "Complete, course project write-up (no public demo)",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
