"use client";

import { useEffect, useRef, useState } from "react";
import { useWindowStore } from "@/store/windowStore";
import { COPYRIGHT, SITE_VERSION } from "@/lib/site";
import { closeApp, getAppDef } from "./apps";
import { IconGrid } from "./IconGrid";

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
      aria-labelledby={`app-title-${id}`}
      tabIndex={-1}
      className="bevel-window absolute inset-x-0 top-0 bottom-12 z-40 flex flex-col bg-chrome p-0.5 focus:outline-none"
      onKeyDown={(e) => {
        if (e.key === "Escape") closeApp(id);
      }}
    >
      <header className="titlebar-active flex items-center gap-2 px-1 py-1">
        <button
          type="button"
          aria-label={`Close ${win.title} and go back`}
          className="title-btn h-8 w-9 text-base"
          onClick={() => closeApp(id)}
        >
          ←
        </button>
        <def.Icon size={18} />
        <h2 id={`app-title-${id}`} className="font-pixel flex-1 truncate text-sm font-bold">
          {win.title}
        </h2>
      </header>
      <div className="win-scroll bevel-field m-0.5 flex-1 overflow-auto bg-white p-3">
        {def.render()}
      </div>
    </section>
  );
}

export function MobileShell() {
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
    <div className="absolute inset-0">
      <h1 className="sr-only">Carter Tull desktop</h1>
      <IconGrid mobile />
      {activeId && <FullScreenApp id={activeId} />}
      <div
        role="toolbar"
        aria-label="Taskbar"
        className="bevel-up absolute inset-x-0 bottom-0 z-50 flex h-12 items-center justify-between bg-chrome px-2"
      >
        <button
          type="button"
          aria-label="Home, show desktop"
          className="btn95 font-pixel flex items-center gap-1.5 px-2 py-1.5 text-sm font-bold"
          onClick={() => {
            const s = useWindowStore.getState();
            s.order.forEach((id) => {
              if (s.windows[id]?.state !== "minimized") s.minimize(id);
            });
          }}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" shapeRendering="crispEdges" aria-hidden="true">
            <rect x="1" y="1" width="6" height="6" fill="#BB0000" />
            <rect x="9" y="1" width="6" height="6" fill="#808080" />
            <rect x="1" y="9" width="6" height="6" fill="#808080" />
            <rect x="9" y="9" width="6" height="6" fill="#BB0000" />
          </svg>
          Carter Tull
        </button>
        <span
          className="font-pixel text-[10px] text-neutral-600"
          title={COPYRIGHT}
        >
          v{SITE_VERSION}
        </span>
        <span className="font-pixel bevel-thin-down px-2 py-1 text-xs tabular-nums">
          {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
