import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

test("viewmodel layer does not import react or DOM", () => {
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
  for (const f of files) {
    const src = readFileSync(join(dir, f), "utf8");
    assert.doesNotMatch(src, /from ["']react["']/, `${f} imports react`);
    assert.doesNotMatch(src, /from ["']react-dom["']/, `${f} imports react-dom`);
    assert.doesNotMatch(src, /document\./, `${f} touches document`);
  }
});
