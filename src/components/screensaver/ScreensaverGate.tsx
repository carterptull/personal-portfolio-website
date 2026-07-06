"use client";

import { useEffect, useState, type ComponentType } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const IDLE_MS = 60_000;
const ACTIVITY_EVENTS = [
  "pointermove",
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

let webglSupport: boolean | null = null;
function webglOk(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function saveDataOn(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return nav.connection?.saveData === true;
}

type SaverProps = { onExit: () => void };

export function ScreensaverGate() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [Saver, setSaver] = useState<ComponentType<SaverProps> | null>(null);

  useEffect(() => {
    if (reducedMotion || saveDataOn()) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const fire = () => {
      if (document.visibilityState !== "visible" || !webglOk()) return;
      // The three.js chunk is not even requested until this first idle fire;
      // subsequent fires reuse the module cache.
      import("./PipesScreensaver").then((m) => {
        if (cancelled) return;
        setSaver(() => m.default);
        setActive(true);
      });
    };

    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(fire, IDLE_MS);
    };

    const onActivity = () => {
      setActive(false);
      arm();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") setActive(false);
      arm();
    };

    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, onActivity, { passive: true })
    );
    document.addEventListener("visibilitychange", onVisibility);
    arm();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  if (!active || !Saver) return null;
  return <Saver onExit={() => setActive(false)} />;
}
