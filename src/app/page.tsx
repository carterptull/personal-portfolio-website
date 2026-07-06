import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { CONTACT } from "@/lib/site";
import { SsrWindow } from "@/components/ssr/SsrWindow";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <SsrWindow title="Carter Tull — Welcome">
      <div className="space-y-6 text-[15px] leading-relaxed">
        <header>
          <h1 className="font-pixel text-2xl font-bold">{profile.name}</h1>
          <p className="mt-1 text-neutral-700">{profile.headline}</p>
        </header>

        <p>{profile.summary}</p>
        <p>
          This site is a working Windows 95–style desktop — with JavaScript
          enabled you get draggable windows, a taskbar, and an idle 3D Pipes
          screensaver. Everything also reads fine right here as plain pages:{" "}
          <Link href="/about" className="text-scarlet underline underline-offset-2">
            about me
          </Link>
          ,{" "}
          <Link href="/projects" className="text-scarlet underline underline-offset-2">
            projects
          </Link>
          , and{" "}
          <Link href="/contact" className="text-scarlet underline underline-offset-2">
            contact
          </Link>
          .
        </p>

        <section aria-labelledby="home-projects">
          <h2 id="home-projects" className="font-pixel text-lg font-bold">
            Projects
          </h2>
          <ul className="mt-2 space-y-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <h3 className="font-semibold">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="text-scarlet underline underline-offset-2"
                  >
                    {p.title}
                  </Link>
                </h3>
                <p>{p.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="home-contact">
          <h2 id="home-contact" className="font-pixel text-lg font-bold">
            Contact
          </h2>
          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-scarlet underline underline-offset-2"
            >
              {CONTACT.email}
            </a>
            <a href={CONTACT.linkedin} className="text-scarlet underline underline-offset-2">
              LinkedIn
            </a>
            <a href={CONTACT.github} className="text-scarlet underline underline-offset-2">
              GitHub
            </a>
          </p>
        </section>
      </div>
    </SsrWindow>
  );
}
