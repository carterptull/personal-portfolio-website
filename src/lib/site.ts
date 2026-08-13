import pkg from "../../package.json";

// Falls back to Vercel's system vars so a forgotten NEXT_PUBLIC_SITE_URL can't ship
// localhost canonical URLs, and previews self-canonicalize instead of claiming prod.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;
  const vercelHost =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      : process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl().replace(/\/+$/, "");

export const SITE_VERSION = pkg.version;
export const COPYRIGHT = `© ${new Date().getFullYear()} Carter Tull`;

export const SITE_NAME = "Carter Tull";
export const SITE_TITLE = "Carter Tull - Software Engineer";
export const SITE_DESCRIPTION =
  "Carter Tull is a software engineer at ConstructConnect in Cincinnati, OH, working on AI platforms and cloud services on Google Cloud. Computer & Information Science graduate of The Ohio State University. Portfolio built as a retro Windows 95 desktop.";

export const CONTACT = {
  email: "carterptull@gmail.com",
  linkedin: "https://www.linkedin.com/in/cartertull/",
  github: "https://github.com/carterptull",
  youtube: "https://www.youtube.com/@cartertull",
} as const;
