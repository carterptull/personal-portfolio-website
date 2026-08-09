import type { Metadata } from "next";
import { SsrWindow } from "@/components/ssr/SsrWindow";
import { ProjectsIndexContent } from "@/components/content/ProjectsIndexContent";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software projects by Carter Tull, including Ampline, a color-graded statusline for Claude Code published to npm, Blitzcast, a football win-probability predictor, Claude Code Workbench, an open-source agentic developer tooling framework, and a full interpreter for the Quandary language.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <SsrWindow title="Projects">
      <h1 className="font-pixel mb-3 text-xl font-bold">Projects</h1>
      <ProjectsIndexContent />
    </SsrWindow>
  );
}
