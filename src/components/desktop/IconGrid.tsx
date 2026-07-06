"use client";

import { DESKTOP_APP_IDS, getAppDef, openApp } from "./apps";

// Vertical flex column: a Resume icon can be appended later with no relayout.
export function IconGrid({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      role="group"
      aria-label="Desktop icons"
      className={
        mobile
          ? "grid grid-cols-3 content-start gap-2 p-4"
          : "flex h-full flex-col flex-wrap content-start items-start gap-1 p-2"
      }
    >
      {DESKTOP_APP_IDS.map((appId) => {
        const def = getAppDef(appId);
        if (!def) return null;
        return (
          <button
            key={appId}
            type="button"
            className="desktop-icon"
            onClick={(e) => openApp(appId, e.currentTarget)}
          >
            <def.Icon size={mobile ? 40 : 34} />
            <span className="icon-label">{def.title.split(" — ")[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
