import { create } from "zustand";

export type WinRect = { x: number; y: number; w: number; h: number };

export type Win = {
  id: string;
  appId: string;
  title: string;
  rect: WinRect;
  state: "normal" | "minimized" | "maximized";
  prevRect?: WinRect;
};

type WindowStore = {
  windows: Record<string, Win>;
  /** Z-order: index = stacking order, back to front. Reshuffles on focus. */
  order: string[];
  /** Taskbar order: append-only by first-opened, never reordered by focus. */
  openOrder: string[];
  focusedId: string | null;
  open: (win: Omit<Win, "state">) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, rect: WinRect) => void;
};

function topVisible(windows: Record<string, Win>, order: string[]): string | null {
  for (let i = order.length - 1; i >= 0; i--) {
    if (windows[order[i]]?.state !== "minimized") return order[i];
  }
  return null;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: {},
  order: [],
  openOrder: [],
  focusedId: null,

  open: (win) =>
    set((s) => {
      const existing = s.windows[win.id];
      const order = [...s.order.filter((id) => id !== win.id), win.id];
      const openOrder = existing
        ? s.openOrder
        : [...s.openOrder.filter((id) => id !== win.id), win.id];
      if (existing) {
        const restored: Win =
          existing.state === "minimized" ? { ...existing, state: "normal" } : existing;
        return {
          windows: { ...s.windows, [win.id]: restored },
          order,
          openOrder,
          focusedId: win.id,
        };
      }
      return {
        windows: { ...s.windows, [win.id]: { ...win, state: "normal" } },
        order,
        openOrder,
        focusedId: win.id,
      };
    }),

  close: (id) =>
    set((s) => {
      const windows = { ...s.windows };
      delete windows[id];
      const order = s.order.filter((x) => x !== id);
      const openOrder = s.openOrder.filter((x) => x !== id);
      return { windows, order, openOrder, focusedId: topVisible(windows, order) };
    }),

  focus: (id) =>
    set((s) => {
      if (!s.windows[id]) return s;
      return {
        order: [...s.order.filter((x) => x !== id), id],
        focusedId: id,
      };
    }),

  minimize: (id) =>
    set((s) => {
      const win = s.windows[id];
      if (!win) return s;
      const windows = { ...s.windows, [id]: { ...win, state: "minimized" as const } };
      return { windows, focusedId: topVisible(windows, s.order) };
    }),

  toggleMax: (id) =>
    set((s) => {
      const win = s.windows[id];
      if (!win) return s;
      const next: Win =
        win.state === "maximized"
          ? { ...win, state: "normal", rect: win.prevRect ?? win.rect, prevRect: undefined }
          : { ...win, state: "maximized", prevRect: win.rect };
      return {
        windows: { ...s.windows, [id]: next },
        order: [...s.order.filter((x) => x !== id), id],
        focusedId: id,
      };
    }),

  move: (id, x, y) =>
    set((s) => {
      const win = s.windows[id];
      if (!win) return s;
      return { windows: { ...s.windows, [id]: { ...win, rect: { ...win.rect, x, y } } } };
    }),

  resize: (id, rect) =>
    set((s) => {
      const win = s.windows[id];
      if (!win) return s;
      return { windows: { ...s.windows, [id]: { ...win, rect } } };
    }),
}));
