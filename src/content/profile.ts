export const profile = {
  name: "Carter Tull",
  role: "Software Engineer",
  company: "ConstructConnect",
  location: "Cincinnati, OH",
  education: {
    degree: "B.S., Computer & Information Science",
    school: "The Ohio State University",
    year: 2025,
  },
  certifications: [
    {
      name: "Anthropic Academy",
      detail: "11 completed courses, March to April 2026.",
      year: 2026,
      courses: [
        "Claude 101",
        "Claude Code 101",
        "Claude Code in Action",
        "Claude with the Anthropic API",
        "Introduction to Claude Cowork",
        "Introduction to Model Context Protocol",
        "Model Context Protocol: Advanced Topics",
        "Introduction to Agent Skills",
        "Introduction to Subagents",
        "AI Fluency: Framework & Foundations",
        "AI Fluency: AI Capabilities & Limitations",
      ],
    },
    {
      name: "ConstructConnect AI Enablement Program",
      detail:
        "Wave 1 Hackfest participant on a 5-member team, selected among the top 16 of 48.",
      year: 2026,
    },
    {
      name: "Microsoft Python Programming Fundamentals",
      detail: "Coursera.",
      year: 2026,
    },
  ],
  headline: "Software Engineer at ConstructConnect in Cincinnati, OH",
  summary:
    "Software engineer working on AI platforms and cloud services on Google Cloud, mostly turning messy construction documents into structured data a business can use. B.S. in Computer & Information Science from The Ohio State University, 2025.",
  bio: [
    "Software engineer based in Cincinnati, Ohio. I have a little over a year of professional experience building automation focused backend systems, mainly API integrations, data transformation pipelines, and AI powered content extraction. I like taking messy, high volume data and turning it into something a business can actually use, and I try to understand the reasoning behind a system, not just get it working.",
    "Outside of my day job I build full projects so I can go deeper on applied ML, full stack work, and AI assisted engineering. You can check those out under Projects. Before this I interned at the Federal Home Loan Bank of Cincinnati, and I graduated from Ohio State in 2025 with a B.S. in Computer & Information Science.",
  ],
  personality: {
    band: {
      lead: "The Ohio State University Marching Band (TBDBITL)",
      detail:
        "Sousaphone player from 2021 to 2024 on scholarship, and a 3-time i-Dotter in The Incomparable Script Ohio.",
      watchNote: "POV clips of the i-Dots are in the Media Player.",
    },
    scouting:
      "Eagle Scout with a Bronze Palm, elected to the Order of the Arrow. My service project built ten picnic tables for Fort Ancient Earthworks & Nature Preserve in Oregonia, Ohio.",
    aside: "Off hours you'll usually find me at a car show, playing the tuba, or on the golf course.",
  },
} as const;
