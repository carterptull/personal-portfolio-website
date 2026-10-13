import assert from "node:assert/strict";
import { test } from "node:test";
import { isKnownFiberClockWarning } from "./threeConsole.ts";

test("drops the Clock deprecation warning fiber triggers", () => {
  assert.equal(
    isKnownFiberClockWarning(
      "warn",
      "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead."
    ),
    true
  );
});

test("keeps every other three.js warning", () => {
  assert.equal(isKnownFiberClockWarning("warn", "THREE.WebGLRenderer: Context Lost."), false);
  assert.equal(
    isKnownFiberClockWarning("warn", "THREE.Timer: This module has been deprecated."),
    false
  );
});

test("only warnings are dropped, never errors or logs", () => {
  const message = "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.";
  assert.equal(isKnownFiberClockWarning("error", message), false);
  assert.equal(isKnownFiberClockWarning("log", message), false);
});
