"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWindowStore } from "@/store/windowStore";
import { appIdForPath, getAppDef, openApp } from "./apps";
import { BootScreen } from "./BootScreen";
import { FloatingWindow } from "./FloatingWindow";
import { IconGrid } from "./IconGrid";
import { MobileShell } from "./MobileShell";
import { Taskbar } from "./Taskbar";
import { ScreensaverGate } from "@/components/screensaver/ScreensaverGate";

function WindowLayer() {
  const order = useWindowStore((s) => s.order);
  const windows = useWindowStore((s) => s.windows);
  const focusedId = useWindowStore((s) => s.focusedId);
  return (
    <>
      {order.map((id, i) => {
        const win = windows[id];
        if (!win) return null;
        return (
          <FloatingWindow key={id} win={win} zIndex={100 + i} focused={focusedId === id} />
        );
      })}
    </>
  );
}

function DesktopRoot() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const [booted, setBooted] = useState(
    () => sessionStorage.getItem("booted") === "1"
  );
  const [crtOn, setCrtOn] = useState(
    () => localStorage.getItem("crt") !== "off"
  );

  const finishBoot = useCallback(() => {
    sessionStorage.setItem("booted", "1");
    setBooted(true);
  }, []);

  const toggleCrt = useCallback(() => {
    setCrtOn((v) => {
      localStorage.setItem("crt", v ? "off" : "on");
      return !v;
    });
  }, []);

  // Deep link → matching window; bare desktop gets the About window opened.
  useEffect(() => {
    const path = window.location.pathname;
    const appId = appIdForPath(path);
    if (appId) {
      if (appId.startsWith("project:")) openApp("projects");
      openApp(appId);
    } else if (path === "/" && !window.matchMedia("(max-width: 767px)").matches) {
      openApp("about");
    }
  }, []);

  // Keep the URL in sync with the focused window so views stay shareable.
  const focusedId = useWindowStore((s) => s.focusedId);
  useEffect(() => {
    const route = focusedId ? getAppDef(focusedId)?.route : "/";
    if (route && window.location.pathname !== route) {
      window.history.replaceState(null, "", route);
    }
  }, [focusedId]);

  const showBoot = !booted && !reducedMotion;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <a className="skip-link" href="#desktop-main">
        Skip to content
      </a>
      {isMobile ? (
        <MobileShell />
      ) : (
        <div id="desktop-main" tabIndex={-1} className="absolute inset-0 bottom-10 focus:outline-none">
          <h1 className="sr-only">Carter Tull desktop</h1>
          <IconGrid />
          <WindowLayer />
        </div>
      )}
      {!isMobile && <Taskbar crtOn={crtOn} onToggleCrt={toggleCrt} />}
      {crtOn && !reducedMotion && <div className="crt-overlay" aria-hidden="true" />}
      {showBoot && <BootScreen onDone={finishBoot} />}
      <ScreensaverGate />
    </div>
  );
}

const noopSubscribe = () => () => {};

export function DesktopChrome() {
  // false during SSR/hydration, true afterwards — no setState-in-effect needed.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  // Hide the server-rendered document layer only once the desktop exists;
  // without JS the semantic pages remain the whole site.
  useEffect(() => {
    if (!mounted) return;
    document.body.classList.add("desktop-active");
    return () => document.body.classList.remove("desktop-active");
  }, [mounted]);

  if (!mounted) return null;
  return <DesktopRoot />;
}
