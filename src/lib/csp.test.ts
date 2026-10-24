import assert from "node:assert/strict";
import { test } from "node:test";
import nextConfig from "../../next.config.ts";

const entries = await nextConfig.headers!();
const csp = entries
  .find((entry) => entry.source === "/:path*")!
  .headers.find((header) => header.key === "Content-Security-Policy")!.value;

const directives = new Map(
  csp.split(";").map((part) => {
    const [name, ...values] = part.trim().split(/\s+/);
    return [name, values] as const;
  }),
);

test("frame-src allows the embedded sibling apps and nothing new", () => {
  assert.deepEqual(directives.get("frame-src"), [
    "'self'",
    "https://www.youtube-nocookie.com",
    "https://www.blitzcast.app",
    "https://ampline.js.org",
  ]);
});

test("frame-ancestors stays 'self'", () => {
  assert.deepEqual(directives.get("frame-ancestors"), ["'self'"]);
});
