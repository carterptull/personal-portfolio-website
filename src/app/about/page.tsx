import type { Metadata } from "next";
import { SsrWindow } from "@/components/ssr/SsrWindow";
import { AboutContent } from "@/components/content/AboutContent";
import { SkillsContent } from "@/components/content/SkillsContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Carter Tull, software engineer at ConstructConnect, Ohio State CIS graduate (2025), Eagle Scout, and 3-time Script Ohio i-Dotter in the OSU Marching Band.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <SsrWindow title="About Me">
        <h1 className="sr-only">About Carter Tull</h1>
        <AboutContent />
      </SsrWindow>
      <SsrWindow title="Skills">
        <section id="skills" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="font-pixel mb-3 text-xl font-bold">
            Technical Skills
          </h2>
          <SkillsContent />
        </section>
      </SsrWindow>
    </div>
  );
}
