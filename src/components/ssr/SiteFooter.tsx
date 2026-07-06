import { CONTACT } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bevel-up mt-4 bg-chrome px-3 py-2 text-sm">
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-2">
          Email
        </a>
        <a href={CONTACT.github} className="underline underline-offset-2">
          GitHub
        </a>
        <a href={CONTACT.linkedin} className="underline underline-offset-2">
          LinkedIn
        </a>
        <a href={CONTACT.youtube} className="underline underline-offset-2">
          YouTube
        </a>
      </p>
      <p className="mt-1 text-neutral-700">
        © {new Date().getFullYear()} Carter Tull. Cookieless, anonymous
        analytics only — no cookies, no tracking.
      </p>
    </footer>
  );
}
