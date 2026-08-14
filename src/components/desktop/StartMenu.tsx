"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT, COPYRIGHT, SITE_VERSION } from "@/lib/site";
import { DESKTOP_APP_IDS, getAppDef, openApp } from "./apps";

function StartFlag() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" fill="#BB0000" />
      <rect x="9" y="1" width="6" height="6" fill="#808080" />
      <rect x="1" y="9" width="6" height="6" fill="#808080" />
      <rect x="9" y="9" width="6" height="6" fill="#BB0000" />
    </svg>
  );
}

function StartMenu({
  onClose,
  startRef,
}: {
  onClose: () => void;
  startRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    items?.[0]?.focus();
  }, []);

  useEffect(() => {
    function onDocDown(e: PointerEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !startRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("pointerdown", onDocDown);
    return () => document.removeEventListener("pointerdown", onDocDown);
  }, [onClose, startRef]);

  function onKeyDown(e: React.KeyboardEvent) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    );
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      onClose();
      startRef.current?.focus();
    }
  }

  const links = [
    { label: "LinkedIn", href: CONTACT.linkedin },
    { label: "GitHub", href: CONTACT.github },
    { label: "YouTube", href: CONTACT.youtube },
  ];

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Start menu"
      onKeyDown={onKeyDown}
      // dvh, not vh: the menu is taller than a phone in landscape, and iOS vh
      // measures the URL-bar-hidden viewport.
      className="bevel-up absolute bottom-full left-0 z-[8500] mb-0.5 flex max-h-[70dvh] w-60 overflow-y-auto bg-chrome p-0.5"
    >
      <div className="w-6 shrink-0 bg-gradient-to-t from-scarlet to-scarlet-2" aria-hidden="true">
        <span className="font-pixel block rotate-180 py-2 text-center text-xs font-bold text-white [writing-mode:vertical-lr]">
          Carter Tull
        </span>
      </div>
      <div className="flex-1 py-1">
        {DESKTOP_APP_IDS.map((appId) => {
          const def = getAppDef(appId);
          if (!def) return null;
          return (
            <button
              key={appId}
              type="button"
              role="menuitem"
              className="font-pixel flex w-full items-center gap-2 px-2 py-1.5 pointer-coarse:min-h-11 text-left text-sm hover:bg-scarlet hover:text-white focus-visible:bg-scarlet focus-visible:text-white focus-visible:outline-none"
              onClick={() => {
                onClose();
                openApp(appId, startRef.current);
              }}
            >
              <def.Icon size={20} />
              {def.title}
            </button>
          );
        })}
        <hr className="my-1 border-t border-chrome-dark" aria-hidden="true" />
        {links.map((link) => (
          <a
            key={link.label}
            role="menuitem"
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="font-pixel flex w-full items-center gap-2 px-2 py-1.5 pointer-coarse:min-h-11 text-sm hover:bg-scarlet hover:text-white focus-visible:bg-scarlet focus-visible:text-white focus-visible:outline-none"
            onClick={onClose}
          >
            {link.label} ↗
          </a>
        ))}
        <hr className="my-1 border-t border-chrome-dark" aria-hidden="true" />
        <p className="font-pixel px-2 py-1 text-[10px] text-neutral-600">
          v{SITE_VERSION}, {COPYRIGHT}
        </p>
      </div>
    </div>
  );
}

/** Start button plus its menu. Shared verbatim by the desktop and mobile taskbars. */
export function StartButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <button
        ref={startRef}
        type="button"
        className="btn95 font-pixel flex items-center gap-1.5 px-2 py-1 text-sm font-bold pointer-coarse:min-h-11"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <StartFlag />
        Start
      </button>
      {menuOpen && <StartMenu onClose={() => setMenuOpen(false)} startRef={startRef} />}
    </div>
  );
}
