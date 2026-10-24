import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const text = readFileSync(
  new URL("../../public/.well-known/security.txt", import.meta.url),
  "utf8"
);
const field = (name: string) => text.match(new RegExp(`^${name}: (.+)$`, "m"))?.[1];

test("security.txt has the fields RFC 9116 requires", () => {
  assert.match(field("Contact") ?? "", /^https:\/\//);
  assert.ok(field("Expires"), "Expires missing");
});

test("security.txt Expires is at least 30 days away", () => {
  // Fails ahead of expiry so CI is the renewal reminder; bump the date in the file.
  const expires = Date.parse(field("Expires") ?? "");
  assert.ok(Number.isFinite(expires), "Expires is not a date");
  assert.ok(expires - Date.now() > 30 * 86_400_000, "security.txt expires within 30 days");
});

test("security.txt Canonical is the production host", () => {
  assert.equal(
    field("Canonical"),
    "https://www.cartertull.com/.well-known/security.txt"
  );
});
