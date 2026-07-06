export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & Scripting",
    items: [
      "Python",
      "Java",
      "C",
      "C++",
      "C#",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "SQL",
      "Ruby",
      "Bash",
    ],
  },
  {
    label: "Frameworks & Tools",
    items: [
      "Angular",
      "NgRx",
      "React Native",
      "Expo",
      "Rails",
      "Docker",
      "Visual Studio",
      "VS Code",
      "IntelliJ",
    ],
  },
  {
    label: "Cloud & Databases",
    items: ["Azure", "AWS", "GCP", "Amazon Cognito", "SQL", "SSMS"],
  },
  {
    label: "Version Control & Collaboration",
    items: ["Git", "GitHub", "GitLab", "Azure DevOps"],
  },
];
