"use client";

import { create } from "zustand";
import type { ComponentType } from "react";
import type { SaverProps } from "@/components/screensaver/PipesScreensaver";

type LaunchOptions = {
  /** A deliberate click/keypress rather than the idle timer firing. */
  manual?: boolean;
};

type ScreensaverStore = {
  active: boolean;
  /** Launch requested, three/R3F chunk still downloading. */
  pending: boolean;
  /**
   * Timestamp before which an incidental `pointermove` must not dismiss.
   * Only ever in the future for a manual launch — the idle path stays
   * instant-dismiss-on-any-activity.
   */
  pointerGraceUntil: number;
  Saver: ComponentType<SaverProps> | null;
  launch: (options?: LaunchOptions) => void;
  exit: () => void;
};

// A manual launch happens with the hand still on the mouse over the icon, so
// the first stray drift must not close what the click just opened.
const POINTER_GRACE_MS = 800;

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

// Bumped by every launch/exit so a chunk load still in flight can tell it has
// been superseded and must not drop the screensaver onto a desktop in use.
let loadToken = 0;

export const useScreensaverStore = create<ScreensaverStore>((set, get) => ({
  active: false,
  pending: false,
  pointerGraceUntil: 0,
  Saver: null,
  launch: (options) => {
    if (document.visibilityState !== "visible" || !webglOk()) return;
    const token = ++loadToken;
    // Re-based on every phase change so a slow chunk load doesn't burn the
    // grace the user is owed once the pipes actually appear.
    const grace = () => (options?.manual ? Date.now() + POINTER_GRACE_MS : 0);

    const { Saver } = get();
    if (Saver) {
      set({ active: true, pending: false, pointerGraceUntil: grace() });
      return;
    }
    set({ pending: true, pointerGraceUntil: grace() });
    import("@/components/screensaver/PipesScreensaver")
      .then((m) => {
        set({ Saver: m.default });
        if (token !== loadToken) return;
        set({ active: true, pending: false, pointerGraceUntil: grace() });
      })
      .catch(() => {
        if (token === loadToken) set({ pending: false, pointerGraceUntil: 0 });
      });
  },
  exit: () => {
    loadToken++;
    set({ active: false, pending: false, pointerGraceUntil: 0 });
  },
}));
