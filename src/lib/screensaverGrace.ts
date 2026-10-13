// Events produced by the same hand that clicked the icon. A double-click lands
// its second pointerdown ~10ms after a cached saver mounts, and would otherwise
// dismiss it before a frame is drawn. Keyboard/wheel stay instant-dismiss.
const POINTER_ORIGIN = new Set(["pointermove", "pointerdown", "touchstart"]);

export function inLaunchGrace(
  eventType: string,
  now: number,
  graceUntil: number
): boolean {
  return POINTER_ORIGIN.has(eventType) && now < graceUntil;
}
