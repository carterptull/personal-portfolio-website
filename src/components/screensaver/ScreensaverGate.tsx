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
  const Saver = useScreensaverStore((s) => s.Saver);
  const launch = useScreensaverStore((s) => s.launch);
  const exit = useScreensaverStore((s) => s.exit);

  useEffect(() => {
    if (reducedMotion || saveDataOn()) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(launch, IDLE_MS);
    };

    const onActivity = () => {
      exit();
      arm();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") exit();
      arm();
    };

    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, onActivity, { passive: true })
    );
    document.addEventListener("visibilitychange", onVisibility);
    arm();

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion, launch, exit]);

  if (!active || !Saver) return null;
  // eslint-disable-next-line react-hooks/static-components
  return <Saver onExit={exit} />;
}
