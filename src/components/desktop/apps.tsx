"use client";

import type { ComponentType, ReactNode } from "react";
import dynamic from "next/dynamic";
import { getProject, projects } from "@/content/projects";
import { useScreensaverStore } from "@/store/screensaverStore";
import { useWindowStore } from "@/store/windowStore";
import {
  IconComputer,
  IconContact,
  IconDocument,
  IconFolder,
  IconMedia,
  IconScreensaver,
  IconSkills,
  IconWordDoc,
} from "./icons";

const loading = () => (
  <p className="font-pixel p-3 text-sm" role="status">
    Loading…
  </p>
);

const AboutContent = dynamic(
  () => import("@/components/content/AboutContent").then((m) => m.AboutContent),
  { loading }
);
const ProjectsIndexContent = dynamic(
  () =>
    import("@/components/content/ProjectsIndexContent").then(
      (m) => m.ProjectsIndexContent
    ),
  { loading }
);
const ProjectContent = dynamic(
  () => import("@/components/content/ProjectContent").then((m) => m.ProjectContent),
  { loading }
);
const SkillsContent = dynamic(
  () => import("@/components/content/SkillsContent").then((m) => m.SkillsContent),
  { loading }
);
const ContactContent = dynamic(
  () => import("@/components/content/ContactContent").then((m) => m.ContactContent),
  { loading }
);
const MediaPlayerContent = dynamic(
  () =>
    import("@/components/content/MediaPlayerContent").then(
      (m) => m.MediaPlayerContent
    ),
  { loading }
);
const ResumeContent = dynamic(
  () => import("@/components/content/ResumeContent").then((m) => m.ResumeContent),
  { loading }
);

// An app either opens a window (w/h/render) or takes over the screen itself
// (launch) — never both. openApp() honours `launch` so the distinction can't be
// forgotten at a call site.
export type AppDef = {
  title: string;
  Icon: ComponentType<{ size?: number }>;
  route?: string;
} & (
  | { launch?: never; w: number; h: number; render: () => ReactNode }
  | { launch: () => void; w?: never; h?: never; render?: never }
);

export const DESKTOP_APP_IDS = [
  "about",
  "media",
  "projects",
  "skills",
  "screensaver",
  "resume",
  "contact",
] as const;

const APPS: Record<string, AppDef> = {
  about: {
    title: "About Me",
    Icon: IconComputer,
    w: 580,
    h: 480,
    route: "/about",
    render: () => <AboutContent onWatch={() => openApp("media")} />,
  },
  media: {
    title: "Media Player",
    Icon: IconMedia,
    w: 480,
    h: 520,
    render: () => <MediaPlayerContent />,
  },
  projects: {
    title: "Projects",
    Icon: IconFolder,
    w: 560,
    h: 460,
    route: "/projects",
    render: () => (
      <ProjectsIndexContent onOpenProject={(slug) => openApp(`project:${slug}`)} />
    ),
  },
  skills: {
    title: "Skills",
    Icon: IconSkills,
    w: 460,
    h: 480,
    render: () => <SkillsContent />,
  },
  screensaver: {
    title: "3D Pipes",
    Icon: IconScreensaver,
    launch: () => useScreensaverStore.getState().launch({ manual: true }),
  },
  resume: {
    title: "Resume",
    Icon: IconWordDoc,
    w: 640,
    h: 720,
    render: () => <ResumeContent />,
  },
  contact: {
    title: "Contact",
    Icon: IconContact,
    w: 440,
    h: 340,
    route: "/contact",
    render: () => <ContactContent />,
  },
};

export function getAppDef(appId: string): AppDef | null {
  if (APPS[appId]) return APPS[appId];
  if (appId.startsWith("project:")) {
    const project = getProject(appId.slice("project:".length));
    if (!project) return null;
    return {
      title: project.title,
      Icon: IconDocument,
      w: 620,
      h: 520,
      route: `/projects/${project.slug}`,
      render: () => <ProjectContent project={project} />,
    };
  }
  return null;
}

export function appIdForPath(pathname: string): string | null {
  if (pathname === "/about") return "about";
  if (pathname === "/projects") return "projects";
  if (pathname === "/contact") return "contact";
  const match = pathname.match(/^\/projects\/([\w-]+)\/?$/);
  if (match && getProject(match[1])) return `project:${match[1]}`;
  return null;
}

// Remembers which element opened each window so close can return focus to it.
const triggers = new Map<string, HTMLElement>();

export function openApp(appId: string, trigger?: HTMLElement | null) {
  const def = getAppDef(appId);
  if (!def) return;
  // Screen-takeover apps never become a window (or a taskbar button).
  if (def.launch) {
    def.launch();
    return;
  }
  if (trigger) triggers.set(appId, trigger);

  const store = useWindowStore.getState();
  const existing = store.windows[appId];
  let rect = existing?.rect;
  if (!rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(def.w, vw - 16);
    const h = Math.min(def.h, vh - 72);
    // Cascade starts right of the icon column so icons stay clickable.
    const offset = (store.order.length % 6) * 28;
    rect = {
      x: Math.max(8, Math.min(120 + offset, vw - w - 8)),
      y: Math.max(8, Math.min(32 + offset, vh - h - 56)),
      w,
      h,
    };
  }
  store.open({ id: appId, appId, title: def.title, rect });
}

/** Minimizing the last window leaves focus on <body>, so hand it somewhere. */
export function minimizeApp(appId: string) {
  useWindowStore.getState().minimize(appId);
  requestAnimationFrame(() => {
    if (useWindowStore.getState().focusedId) return;
    document.getElementById("desktop-main")?.focus();
  });
}

export function closeApp(appId: string) {
  useWindowStore.getState().close(appId);
  const trigger = triggers.get(appId);
  requestAnimationFrame(() => {
    // Re-check here: closing a taskbar-triggered window unmounts the trigger, but
    // React hasn't committed that yet at call time.
    if (trigger?.isConnected) {
      trigger.focus();
      return;
    }
    document.getElementById("desktop-main")?.focus();
  });
}

export { projects };
