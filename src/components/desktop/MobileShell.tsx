"use client";

import { useEffect, useRef, useState } from "react";
import { useWindowStore } from "@/store/windowStore";
import { COPYRIGHT, SITE_VERSION } from "@/lib/site";
import { closeApp, getAppDef } from "./apps";
import { IconGrid } from "./IconGrid";
import { StartButton } from "./StartMenu";

function FullScreenApp({ id }: { id: string }) {
  const win = useWindowStore((s) => s.windows[id]);
  const ref = useRef<HTMLElement>(null);
  const def = win ? getAppDef(win.appId) : null;

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, [id]);

  if (!win || !def) return null;
  return (
    <section
      ref={ref}
      role="dialog"
      // No aria-modal: the taskbar outside stays reachable.
      aria-labelledby={`app-title-${id}`}
      tabIndex={-1}
      className="bevel-window absolute inset-x-0 top-0 bottom-12 z-40 flex flex-col bg-chrome p-0.5 focus:outline-none"
      onKeyDown={(e) => {
        if (e.key === "Escape") closeApp(id);
      }}
    >
      <header className="titlebar-active flex items-center gap-2 px-1 py-1">
        <def.Icon size={18} />
        <h2 id={`app-title-${id}`} className="font-pixel flex-1 truncate text-sm font-bold">
          {win.title}
        </h2>
        <button
          type="button"
          aria-label={`Close ${win.title}`}
          className="title-btn h-9 w-11"
          onClick={() => closeApp(id)}
        >
          <svg width="10" height="10" viewBox="0 0 8 8" aria-hidden="true">
            <path d="M0 0 L8 8 M8 0 L0 8" stroke="#0a0a0a" strokeWidth="1.5" />
          </svg>
        </button>
      </header>
      <div className="win-scroll bevel-field m-0.5 flex-1 overflow-auto bg-white p-3">
        {def.render?.()}
      </div>
    </section>
  );
}

export function MobileShell({
  crtOn,
  onToggleCrt,
}: {
  crtOn: boolean;
  onToggleCrt: () => void;
}) {
  const windows = useWindowStore((s) => s.windows);
  const order = useWindowStore((s) => s.order);
  const focusedId = useWindowStore((s) => s.focusedId);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const activeId =
    focusedId && windows[focusedId]?.state !== "minimized"
      ? focusedId
      : [...order].reverse().find((id) => windows[id]?.state !== "minimized") ?? null;

  return (
    <div id="desktop-main" tabIndex={-1} className="absolute inset-0 focus:outline-none">
      <h1 className="sr-only">Carter Tull desktop</h1>
      {/* inert: a full-screen app is modal here, so keep Tab out of the icons behind it */}
      <div inert={activeId ? true : undefined}>
        <IconGrid mobile />
      </div>
      {activeId && <FullScreenApp id={activeId} />}
      <nav
        aria-label="Taskbar"
        className="bevel-up absolute inset-x-0 bottom-0 z-50 flex h-12 items-center gap-1.5 bg-chrome px-2"
      >
        <StartButton />
        <span
          className="font-pixel ml-auto text-[10px] text-neutral-600"
          title={COPYRIGHT}
        >
          v{SITE_VERSION}
        </span>
        <button
          type="button"
          className="btn95 min-h-9 px-2 py-1 text-xs"
          aria-pressed={crtOn}
          onClick={onToggleCrt}
        >
          CRT
        </button>
        <span className="font-pixel bevel-thin-down px-2 py-1 text-xs tabular-nums">
          {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </span>
      </nav>
    </div>
  );
}
