import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { ogWindow, OG_SIZE } from "@/lib/og";

export const alt = "Project - Carter Tull";
export const size = OG_SIZE;
export const contentType = "image/png";

// Prerenders all 9 cards at build time instead of rasterizing on every crawler fetch.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound(); // match the page route's guard
  return ogWindow(`${slug}.exe`, project.title, project.stack.join(", "));
}
