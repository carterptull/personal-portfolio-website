export const profile = {
  name: "Carter Tull",
  role: "Automation Developer",
  company: "ConstructConnect",
  location: "Cincinnati, OH",
  education: {
    degree: "B.S., Computer & Information Science",
    school: "The Ohio State University",
    year: 2025,
  },
  headline: "Automation Developer at ConstructConnect · Cincinnati, OH",
  summary:
    "Software engineer specializing in automation development, API integration, and data transformation. B.S. in Computer & Information Science from The Ohio State University, 2025.",
  bio: [
    "I'm a software engineer at ConstructConnect in Cincinnati, where I build automation for the Content division — TypeScript microservices that post construction project data (titles, locations, event dates, structures, contacts) to the UCMS API, and a contact-matching service that resolves project contacts against existing company and contact records so attribution stays accurate for owners, architects, and contract administrators.",
    "Before that I interned at the Federal Home Loan Bank of Cincinnati, working across scrum teams on C# and Angular applications with NgRx, tuning SQL queries, and contributing to UAT automation.",
    "I graduated from The Ohio State University in 2025 with a B.S. in Computer & Information Science. Coursework ran from programming languages and systems programming to networking, database systems, and cloud data management, and I was a member of the OSU Competitive Programming Club.",
  ],
  personality: {
    band: {
      lead: "The Ohio State University Marching Band (TBDBITL)",
      detail:
        "Sousaphone, 2021–2024, scholarship member — and a 3-time Script Ohio i-dotter.",
      watchNote: "POV clips of the i-dots are in the Media Player.",
    },
    scouting:
      "Eagle Scout — Bronze Palm, elected to the Order of the Arrow; led a service project building ten picnic tables for Fort Ancient Earthworks and Nature Preserve.",
    aside: "Off hours you'll usually find me around cars or a sousaphone.",
  },
} as const;
