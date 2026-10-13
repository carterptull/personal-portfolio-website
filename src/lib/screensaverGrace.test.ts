import assert from "node:assert/strict";
import { test } from "node:test";
import { inLaunchGrace } from "./screensaverGrace.ts";

const NOW = 10_000;
const LIVE = NOW + 800;
const EXPIRED = NOW - 1;

test("pointer-origin events inside the grace window do not dismiss", () => {
  // The second click of a double-click lands ~10ms after the saver mounts.
  for (const type of ["pointermove", "pointerdown", "touchstart"]) {
    assert.equal(inLaunchGrace(type, NOW, LIVE), true, type);
  }
});

test("keyboard and wheel input dismiss instantly, even inside the window", () => {
  for (const type of ["keydown", "wheel", "scroll"]) {
    assert.equal(inLaunchGrace(type, NOW, LIVE), false, type);
  }
});

test("pointer events dismiss once the window has expired", () => {
  assert.equal(inLaunchGrace("pointerdown", NOW, EXPIRED), false);
  assert.equal(inLaunchGrace("pointerdown", NOW, NOW), false);
});

test("the idle path (no grace set) is instant-dismiss on any activity", () => {
  assert.equal(inLaunchGrace("pointermove", NOW, 0), false);
  assert.equal(inLaunchGrace("pointerdown", NOW, 0), false);
});
