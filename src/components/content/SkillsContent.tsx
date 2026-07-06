import { skillGroups } from "@/content/skills";

export function SkillsContent() {
  return (
    <div className="space-y-3">
      {skillGroups.map((group) => (
        <section
          key={group.label}
          aria-labelledby={`skills-${group.label.replace(/\W+/g, "-")}`}
          className="border border-chrome-dark p-2 shadow-[1px_1px_0_#fff_inset]"
        >
          <h3
            id={`skills-${group.label.replace(/\W+/g, "-")}`}
            className="font-pixel text-sm font-bold"
          >
            {group.label}
          </h3>
          <ul className="mt-1.5 flex flex-wrap gap-1">
            {group.items.map((item) => (
              <li
                key={item}
                className="bevel-thin-up bg-chrome px-1.5 py-0.5 font-pixel text-xs"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
