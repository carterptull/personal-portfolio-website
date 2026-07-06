"use client";

import dynamic from "next/dynamic";

// ssr:false keeps the whole desktop layer (store, windows, taskbar) out of the
// server HTML and the critical script set; the SSR pages are the content.
const DesktopChrome = dynamic(
  () => import("./DesktopChrome").then((m) => m.DesktopChrome),
  { ssr: false }
);

export function DesktopBoundary() {
  return <DesktopChrome />;
}
