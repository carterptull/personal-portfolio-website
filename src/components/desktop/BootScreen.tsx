"use client";

import { useEffect, useState } from "react";

const BIOS_LINES = [
  "CTULL BIOS v3.41 — Pixel Systems, Inc.",
  "Memory Test: 65536 KB ........ OK",
  "Detecting IDE drives ......... OK",
  "Loading CARTER.SYS",
  "Starting CarterOS ...",
];

const LINE_MS = 220;
const SPLASH_AT = BIOS_LINES.length * LINE_MS + 300;
const DONE_AT = SPLASH_AT + 1300;

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState(1);
  const [splash, setSplash] = useState(false);

  useEffect(() => {
    const timers = [
      ...BIOS_LINES.map((_, i) =>
        setTimeout(() => setLines(i + 1), i * LINE_MS)
      ),
      setTimeout(() => setSplash(true), SPLASH_AT),
      setTimeout(onDone, DONE_AT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="boot-screen" role="status" aria-label="Boot sequence">
      <button
        type="button"
        onClick={onDone}
        className="font-pixel absolute right-3 top-3 z-10 border border-[#d8d8d8] px-3 py-1.5 text-sm text-[#d8d8d8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        Skip ⏭
      </button>

      {splash ? (
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <svg viewBox="0 0 16 16" width="96" height="96" shapeRendering="crispEdges" aria-hidden="true">
            <rect x="1" y="1" width="14" height="10" fill="#C0C0C0" />
            <rect x="3" y="3" width="10" height="6" fill="#0A1A2E" />
            <rect x="6" y="4" width="4" height="1" fill="#BB0000" />
            <rect x="6" y="4" width="1" height="4" fill="#BB0000" />
            <rect x="6" y="7" width="4" height="1" fill="#BB0000" />
            <rect x="6" y="11" width="4" height="2" fill="#C0C0C0" />
            <rect x="4" y="13" width="8" height="2" fill="#C0C0C0" />
          </svg>
          <p className="font-pixel text-2xl font-bold text-white">Carter Tull</p>
          <div className="bevel-thin-down h-4 w-56 overflow-hidden bg-[#1a1a1e]">
            <div className="boot-bar-chip h-full w-1/4 bg-gradient-to-r from-scarlet to-scarlet-2" />
          </div>
        </div>
      ) : (
        <div className="p-6">
          {BIOS_LINES.slice(0, lines).map((line) => (
            <p key={line}>{line}</p>
          ))}
          <span className="boot-caret" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
