import type { Metadata } from "next";
import { SsrWindow } from "@/components/ssr/SsrWindow";
import { ProjectsIndexContent } from "@/components/content/ProjectsIndexContent";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected software projects by Carter Tull: a full interpreter for the Quandary language, a cross-platform mobile capstone for NBBI, and an OSU class-schedule web scraper.",
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
