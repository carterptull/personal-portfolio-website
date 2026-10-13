// @react-three/fiber (9.8.1, latest stable) still constructs `new THREE.Clock()`
// internally, which three has deprecated since r183, so every screensaver mount
// logged this warning. It's upstream's to fix; nothing here uses Clock.
const FIBER_CLOCK_WARNING = "THREE.Clock: This module has been deprecated";

export function isKnownFiberClockWarning(type: string, message: string): boolean {
  return type === "warn" && message.startsWith(FIBER_CLOCK_WARNING);
}
