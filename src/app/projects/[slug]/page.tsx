import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { SsrWindow } from "@/components/ssr/SsrWindow";
import { ProjectContent } from "@/components/content/ProjectContent";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <SsrWindow title={project.title}>
      <h1 className="sr-only">{project.title}</h1>
      <ProjectContent project={project} />
      <p className="mt-4">
        <Link
          href="/projects"
          className="text-scarlet underline underline-offset-2"
        >
          ← All projects
        </Link>
      </p>
    </SsrWindow>
  );
}
