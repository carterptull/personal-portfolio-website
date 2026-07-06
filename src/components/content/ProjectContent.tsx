import type { Project } from "@/content/projects";

export function ProjectContent({ project }: { project: Project }) {
  return (
    <article className="space-y-4 text-[15px] leading-relaxed">
      <header className="space-y-1">
        <h2 className="font-pixel text-xl font-bold">{project.title}</h2>
        <p className="text-sm text-neutral-700">
          {project.role} · {project.timeframe}
        </p>
        <p className="flex flex-wrap gap-1 pt-1" aria-label="Tech stack">
          {project.stack.map((s) => (
            <span
              key={s}
              className="bevel-thin-up bg-chrome px-1.5 py-0.5 font-pixel text-xs"
            >
              {s}
            </span>
          ))}
        </p>
      </header>

      <section aria-labelledby={`${project.slug}-problem`}>
        <h3 id={`${project.slug}-problem`} className="font-pixel font-bold">
          Problem
        </h3>
        <p>{project.problem}</p>
      </section>

      <section aria-labelledby={`${project.slug}-approach`}>
        <h3 id={`${project.slug}-approach`} className="font-pixel font-bold">
          Approach
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          {project.approach.map((a) => (
            <li key={a.slice(0, 24)}>{a}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby={`${project.slug}-outcome`}>
        <h3 id={`${project.slug}-outcome`} className="font-pixel font-bold">
          Outcome
        </h3>
        <p>{project.outcome}</p>
      </section>

      <footer className="bevel-thin-down bg-white p-2 text-sm text-neutral-700">
        <p>Status: {project.status}</p>
        {project.links.repo && (
          <p>
            <a
              href={project.links.repo}
              className="text-scarlet underline underline-offset-2"
            >
              Source on GitHub
            </a>
          </p>
        )}
      </footer>
    </article>
  );
}
