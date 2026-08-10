import pkg from "../../package.json";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

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
