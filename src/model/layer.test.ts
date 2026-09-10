import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PHASE_ORDER } from "./types.ts";

const dir = dirname(fileURLToPath(import.meta.url));

test("model layer does not import react, DOM, or SVG", () => {
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
  assert.ok(files.length > 0, "model has no implementation files");
  for (const f of files) {
    const src = readFileSync(join(dir, f), "utf8");
    assert.doesNotMatch(src, /from ["']react["']/, `${f} imports react`);
    assert.doesNotMatch(src, /from ["']react-dom["']/, `${f} imports react-dom`);
    assert.doesNotMatch(src, /document\./, `${f} touches document`);
    assert.doesNotMatch(src, /from ["'][^"']*\.tsx["']/, `${f} imports tsx`);
  }
});

test("turn order has ten phases before matchOver", () => {
  assert.equal(PHASE_ORDER.length, 10);
  assert.equal(PHASE_ORDER[0], "priceTick");
  assert.equal(PHASE_ORDER[9], "decay");
});
