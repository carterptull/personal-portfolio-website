import { profile } from "@/content/profile";
import { CHANNEL_URL } from "@/content/videos";

export function AboutContent({ onWatch }: { onWatch?: () => void }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <header className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- static pixel SVG, no optimization needed */}
        <img src="/brand-mark.svg" alt="" width={48} height={48} />
        <div>
          <h2 className="font-pixel text-xl font-bold">{profile.name}</h2>
          <p className="text-neutral-700">{profile.headline}</p>
        </div>
      </header>

      {profile.bio.map((para) => (
        <p key={para.slice(0, 24)}>{para}</p>
      ))}

      <section aria-labelledby="education-heading">
        <h3 id="education-heading" className="font-pixel font-bold">
          Education
        </h3>
        <p>
          {profile.education.degree} — {profile.education.school},{" "}
          {profile.education.year}
        </p>
      </section>

      <section aria-labelledby="beyond-heading" className="space-y-2">
        <h3 id="beyond-heading" className="font-pixel font-bold">
          Beyond the keyboard
        </h3>
        <p>
          {profile.personality.band.lead} — {profile.personality.band.detail}{" "}
          {onWatch ? (
            <button
              type="button"
              onClick={onWatch}
              className="text-scarlet underline underline-offset-2 font-semibold"
            >
              ▶ watch the i-dots
            </button>
          ) : (
            <a
              href={CHANNEL_URL}
              className="text-scarlet underline underline-offset-2 font-semibold"
            >
              ▶ watch the i-dots
            </a>
          )}
        </p>
        <p>{profile.personality.scouting}</p>
        <p>{profile.personality.aside}</p>
      </section>
    </div>
  );
}
