"use client";

import { useEffect, useRef } from "react";
import type { Win, WinRect } from "@/store/windowStore";
import { useWindowStore } from "@/store/windowStore";
import { closeApp, getAppDef, minimizeApp } from "./apps";

const MIN_W = 300;
const MIN_H = 180;
const TASKBAR_H = 40;

const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
type Handle = (typeof HANDLES)[number];

const handleClass: Record<Handle, string> = {
  n: "top-0 left-2 right-2 h-1 cursor-n-resize",
  s: "bottom-0 left-2 right-2 h-1 cursor-s-resize",
  e: "right-0 top-2 bottom-2 w-1 cursor-e-resize",
  w: "left-0 top-2 bottom-2 w-1 cursor-w-resize",
  ne: "top-0 right-0 h-2.5 w-2.5 cursor-ne-resize",
  nw: "top-0 left-0 h-2.5 w-2.5 cursor-nw-resize",
  se: "bottom-0 right-0 h-2.5 w-2.5 cursor-se-resize",
  sw: "bottom-0 left-0 h-2.5 w-2.5 cursor-sw-resize",
};

export function FloatingWindow({
  win,
  zIndex,
  focused,
}: {
  win: Win;
  zIndex: number;
  focused: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const focus = useWindowStore((s) => s.focus);
  const toggleMax = useWindowStore((s) => s.toggleMax);
  const move = useWindowStore((s) => s.move);
  const resize = useWindowStore((s) => s.resize);

  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const rsz = useRef<{ px: number; py: number; rect: WinRect; dir: Handle; last: WinRect } | null>(null);

  const def = getAppDef(win.appId);
  const Icon = def?.Icon;

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (focused && el && !el.contains(document.activeElement)) {
      el.focus({ preventScroll: true });
    }
  }, [focused]);

  function onTitleDown(e: React.PointerEvent<HTMLElement>) {
    if (win.state === "maximized") return;
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { px: e.clientX, py: e.clientY, x: win.rect.x, y: win.rect.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onTitleMove(e: React.PointerEvent<HTMLElement>) {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;
    // Write transform straight to the DOM node; the store is only updated on
    // pointerup so React never re-renders mid-drag.
    d.x = Math.max(
      -win.rect.w + 80,
      Math.min(d.x + e.clientX - d.px, window.innerWidth - 80)
    );
    d.y = Math.max(
      0,
      Math.min(d.y + e.clientY - d.py, window.innerHeight - TASKBAR_H - 24)
    );
    d.px = e.clientX;
    d.py = e.clientY;
    el.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`;
  }

  function onTitleUp() {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    move(win.id, d.x, d.y);
  }

  function onHandleDown(e: React.PointerEvent<HTMLDivElement>, dir: Handle) {
    e.stopPropagation();
    rsz.current = {
      px: e.clientX,
      py: e.clientY,
      rect: { ...win.rect },
      dir,
      last: { ...win.rect },
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onHandleMove(e: React.PointerEvent<HTMLDivElement>) {
    const r = rsz.current;
    const el = ref.current;
    if (!r || !el) return;
    const dx = e.clientX - r.px;
    const dy = e.clientY - r.py;
    let { x, y, w, h } = r.rect;
    if (r.dir.includes("e")) w = Math.max(MIN_W, r.rect.w + dx);
    if (r.dir.includes("s")) h = Math.max(MIN_H, r.rect.h + dy);
    if (r.dir.includes("w")) {
      w = Math.max(MIN_W, r.rect.w - dx);
      x = r.rect.x + (r.rect.w - w);
    }
    if (r.dir.includes("n")) {
      h = Math.max(MIN_H, r.rect.h - dy);
      y = Math.max(0, r.rect.y + (r.rect.h - h));
      h = r.rect.h + (r.rect.y - y);
    }
    r.last = { x, y, w, h };
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function onHandleUp() {
    const r = rsz.current;
    if (!r) return;
    rsz.current = null;
    resize(win.id, r.last);
  }

  const maximized = win.state === "maximized";
  const style: React.CSSProperties = maximized
    ? { left: 0, top: 0, width: "100%", height: "100%", zIndex }
    : {
        width: win.rect.w,
        height: win.rect.h,
        transform: `translate3d(${win.rect.x}px, ${win.rect.y}px, 0)`,
        zIndex,
      };
  if (win.state === "minimized") style.display = "none";

  return (
    <section
      ref={ref}
      role="dialog"
      aria-labelledby={`win-title-${win.id}`}
      tabIndex={-1}
      className="win-anim absolute left-0 top-0 flex flex-col bg-chrome p-0.5 bevel-window focus:outline-none"
      style={style}
      onPointerDownCapture={() => {
        if (!focused) focus(win.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          closeApp(win.id);
        }
      }}
    >
      <header
        className={`flex select-none items-center gap-1.5 px-1.5 py-1 ${
          focused ? "titlebar-active" : "titlebar-inactive"
        }`}
        style={{ touchAction: "none" }}
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onLostPointerCapture={onTitleUp} // also covers a cancelled pointer
        onDoubleClick={() => toggleMax(win.id)}
      >
        {Icon ? <Icon size={16} /> : null}
        <span
          id={`win-title-${win.id}`}
          className="font-pixel flex-1 truncate text-sm font-bold"
        >
          {win.title}
        </span>
        <button
          type="button"
          className="title-btn"
          aria-label={`Minimize ${win.title}`}
          onClick={() => minimizeApp(win.id)}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <rect x="1" y="6" width="6" height="2" fill="#0a0a0a" />
          </svg>
        </button>
        <button
          type="button"
          className="title-btn"
          aria-label={maximized ? `Restore ${win.title}` : `Maximize ${win.title}`}
          onClick={() => toggleMax(win.id)}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <rect x="0" y="0" width="8" height="8" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
            <rect x="0" y="0" width="8" height="2" fill="#0a0a0a" />
          </svg>
        </button>
        <button
          type="button"
          className="title-btn ml-0.5"
          aria-label={`Close ${win.title}`}
          onClick={() => closeApp(win.id)}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <path d="M0 0 L8 8 M8 0 L0 8" stroke="#0a0a0a" strokeWidth="1.5" />
          </svg>
        </button>
      </header>

      <div className="win-scroll bevel-field m-0.5 flex-1 overflow-auto bg-white p-3 sm:p-4">
        {def?.render?.()}
      </div>

      {!maximized &&
        HANDLES.map((dir) => (
          <div
            key={dir}
            aria-hidden="true"
            className={`absolute ${handleClass[dir]}`}
            style={{ touchAction: "none" }}
            onPointerDown={(e) => onHandleDown(e, dir)}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onLostPointerCapture={onHandleUp}
          />
        ))}
    </section>
  );
}
