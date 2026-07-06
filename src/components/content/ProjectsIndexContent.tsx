import Link from "next/link";
import { projects } from "@/content/projects";

export function ProjectsIndexContent({
  onOpenProject,
}: {
  onOpenProject?: (slug: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-700">
        Selected work — written up as project descriptions (problem, approach,
        outcome) rather than live demos.
      </p>
      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.slug}>
            <article className="bevel-thin-down bg-white p-3">
              <h3 className="font-pixel text-lg font-bold">
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-scarlet underline underline-offset-2"
                  onClick={
                    onOpenProject
                      ? (e) => {
                          e.preventDefault();
                          onOpenProject(p.slug);
                        }
                      : undefined
                  }
                >
                  {p.title}
                </Link>
              </h3>
              <p className="mt-1 text-[15px] leading-relaxed">{p.summary}</p>
              <p className="mt-2 flex flex-wrap gap-1" aria-label="Tech stack">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="bevel-thin-up bg-chrome px-1.5 py-0.5 font-pixel text-xs"
                  >
                    {s}
                  </span>
                ))}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
