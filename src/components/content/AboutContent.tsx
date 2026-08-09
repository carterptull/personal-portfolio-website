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
          {profile.education.degree} from {profile.education.school},{" "}
          {profile.education.year}
        </p>
      </section>

      <section aria-labelledby="training-heading">
        <h3 id="training-heading" className="font-pixel font-bold">
          Certifications &amp; training
        </h3>
        <ul className="mt-1 space-y-1">
          {profile.certifications.map((cert) => (
            <li key={cert.name}>
              <span className="font-semibold">{cert.name}</span> ({cert.year}).{" "}
              {cert.detail}
              {"courses" in cert && cert.courses.length > 0 && (
                <ul className="mt-1.5 flex flex-wrap gap-1" aria-label={`${cert.name} courses`}>
                  {cert.courses.map((course) => (
                    <li
                      key={course}
                      className="bevel-thin-up bg-chrome px-1.5 py-0.5 font-pixel text-xs"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="beyond-heading" className="space-y-2">
        <h3 id="beyond-heading" className="font-pixel font-bold">
          Beyond the keyboard
        </h3>
        <p>
          {profile.personality.band.lead}. {profile.personality.band.detail}{" "}
          {onWatch ? (
            <button
              type="button"
              onClick={onWatch}
              className="text-scarlet underline underline-offset-2 font-semibold"
            >
              ▶ watch the i-Dots
            </button>
          ) : (
            <a
              href={CHANNEL_URL}
              className="text-scarlet underline underline-offset-2 font-semibold"
            >
              ▶ watch the i-Dots
            </a>
          )}
        </p>
        <p>{profile.personality.scouting}</p>
        <p>{profile.personality.aside}</p>
      </section>
    </div>
  );
}
