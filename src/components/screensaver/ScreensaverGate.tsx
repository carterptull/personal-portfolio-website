"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScreensaverStore } from "@/store/screensaverStore";

const IDLE_MS = 60_000;
const ACTIVITY_EVENTS = [
  "pointermove",
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

function saveDataOn(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return nav.connection?.saveData === true;
}

export function ScreensaverGate() {
  const reducedMotion = usePrefersReducedMotion();
  const active = useScreensaverStore((s) => s.active);
  const pending = useScreensaverStore((s) => s.pending);
  const pointerGraceUntil = useScreensaverStore((s) => s.pointerGraceUntil);
  const Saver = useScreensaverStore((s) => s.Saver);
  const launch = useScreensaverStore((s) => s.launch);
  const exit = useScreensaverStore((s) => s.exit);

  // Idle arming only — never armed for reduced-motion/Save-Data users.
  useEffect(() => {
    if (reducedMotion || saveDataOn()) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => launch(), IDLE_MS);
    };

    // capture: scroll doesn't bubble, so in-window scrolling wouldn't count.
    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, arm, { passive: true, capture: true })
    );
    document.addEventListener("visibilitychange", arm);
    arm();

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, arm, { capture: true })
      );
      document.removeEventListener("visibilitychange", arm);
    };
  }, [reducedMotion, launch]);

  // Dismissal, deliberately *not* gated on reduced-motion/Save-Data: launch()
  // bypasses those preferences for a manual trigger, so a user who never gets
  // the idle timer armed would otherwise be trapped with no way out. Runs while
  // the chunk is still loading too, so activity cancels a launch mid-download.
  useEffect(() => {
    if (!active && !pending) return;

    const dismiss = (e: Event) => {
      if (e.type === "pointermove" && Date.now() < pointerGraceUntil) return;
      exit();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") exit();
    };

    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, dismiss, { passive: true, capture: true })
    );
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      ACTIVITY_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, dismiss, { capture: true })
      );
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, pending, pointerGraceUntil, exit]);

  if (!active || !Saver) return null;
  // eslint-disable-next-line react-hooks/static-components
  return <Saver onExit={exit} />;
}
