import { CONTACT } from "@/lib/site";

const rows = [
  { label: "Email", href: `mailto:${CONTACT.email}`, text: CONTACT.email },
  { label: "LinkedIn", href: CONTACT.linkedin, text: "linkedin.com/in/cartertull" },
  { label: "GitHub", href: CONTACT.github, text: "github.com/carterptull" },
  { label: "YouTube", href: CONTACT.youtube, text: "youtube.com/@cartertull" },
];

export function ContactContent() {
  return (
    <div className="space-y-4 text-[15px]">
      <p>The best ways to reach me:</p>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.label} className="flex items-baseline gap-2">
            <span className="font-pixel w-20 shrink-0 font-bold">
              {row.label}
            </span>
            <a
              href={row.href}
              className="text-scarlet underline underline-offset-2 break-all"
            >
              {row.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
