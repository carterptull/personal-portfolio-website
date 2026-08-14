"use client";

import { useEffect, useState } from "react";
import { useWindowStore } from "@/store/windowStore";
import { COPYRIGHT, SITE_VERSION } from "@/lib/site";
import { openApp } from "./apps";
import { StartButton } from "./StartMenu";

function Clock() {
  // Renders client-side only (inside the mounted desktop), so Date is safe here.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-pixel bevel-thin-down px-2 py-1 text-xs tabular-nums">
      {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
    </span>
  );
}

export function Taskbar({
  crtOn,
  onToggleCrt,
}: {
  crtOn: boolean;
  onToggleCrt: () => void;
}) {
  const windows = useWindowStore((s) => s.windows);
  const openOrder = useWindowStore((s) => s.openOrder);
  const focusedId = useWindowStore((s) => s.focusedId);
  const focus = useWindowStore((s) => s.focus);
  const minimize = useWindowStore((s) => s.minimize);

  return (
    <nav
      aria-label="Taskbar"
      className="bevel-up absolute inset-x-0 bottom-0 z-[8000] flex h-10 items-center gap-1 bg-chrome px-1"
    >
      <StartButton />

      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {openOrder.map((id) => {
          const win = windows[id];
          if (!win) return null;
          const active = focusedId === id && win.state !== "minimized";
          return (
            <button
              key={id}
              type="button"
              className="btn95 max-w-44 flex-shrink truncate py-1 text-xs"
              aria-pressed={active}
              onClick={(e) => {
                if (active) {
                  minimize(id);
                } else {
                  openApp(win.appId, e.currentTarget);
                  focus(id);
                }
              }}
            >
              {win.title}
            </button>
          );
        })}
      </div>

      <span
        className="font-pixel hidden px-1.5 text-[10px] text-neutral-600 sm:inline"
        title={`Created by Carter Tull, ${COPYRIGHT}`}
      >
        v{SITE_VERSION}
      </span>
      <button
        type="button"
        className="btn95 py-1 text-xs"
        aria-pressed={crtOn}
        onClick={onToggleCrt}
      >
        CRT
      </button>
      <Clock />
    </nav>
  );
}
