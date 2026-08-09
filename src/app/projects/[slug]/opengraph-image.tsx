import { getProject } from "@/content/projects";
import { ogWindow, OG_SIZE } from "@/lib/og";

export const alt = "Project - Carter Tull";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return ogWindow(
    `${slug}.exe`,
    project?.title ?? "Project",
    project ? project.stack.join(", ") : "Carter Tull"
  );
}
