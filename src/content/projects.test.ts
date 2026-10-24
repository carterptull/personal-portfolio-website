import assert from "node:assert/strict";
import { test } from "node:test";
import { getProject } from "./projects.ts";

test("ampline links cover the package, its website, and the live site", () => {
  assert.deepEqual(getProject("ampline-claude")?.links, {
    repo: "https://github.com/carterptull/ampline-claude",
    siteRepo: "https://github.com/carterptull/ampline-website",
    npm: "https://www.npmjs.com/package/ampline-claude",
    live: "https://ampline.js.org/",
  });
});

test("ampline status names the live site", () => {
  assert.match(getProject("ampline-claude")?.status ?? "", /ampline\.js\.org/);
});
