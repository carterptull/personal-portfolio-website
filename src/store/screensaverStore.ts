"use client";

import { create } from "zustand";
import type { ComponentType } from "react";
import type { SaverProps } from "@/components/screensaver/PipesScreensaver";

type ScreensaverStore = {
  active: boolean;
  Saver: ComponentType<SaverProps> | null;
  launch: () => void;
  exit: () => void;
};

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

export const useScreensaverStore = create<ScreensaverStore>((set, get) => ({
  active: false,
  Saver: null,
  launch: () => {
    if (document.visibilityState !== "visible" || !webglOk()) return;
    const { Saver } = get();
    if (Saver) {
      set({ active: true });
      return;
    }
    import("@/components/screensaver/PipesScreensaver").then((m) => {
      set({ Saver: m.default, active: true });
    });
  },
  exit: () => set({ active: false }),
}));
