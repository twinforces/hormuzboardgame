import assert from "node:assert/strict";
import test from "node:test";
import { HISTORY, PRICE, bandOf } from "./balance.ts";
import { createEngine, createState } from "./engine.ts";
import { priceComponents, sumPrice } from "./price.ts";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

test("price meter is a seeded formula, not a live fetch", () => {
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "price.ts"), "utf8");
  assert.doesNotMatch(src, /fetch\(/);
  assert.doesNotMatch(src, /eia\.gov/);
  assert.equal(PRICE.baseline, 82);
});

test("historical markers exist so P can be compared, not streamed", () => {
  assert.ok(HISTORY.length >= 6);
  assert.ok(HISTORY.some((h) => h.brentUsd === 147));
  assert.ok(HISTORY.some((h) => h.brentUsd === 126));
  assert.ok(HISTORY.some((h) => h.brentUsd === 100 && h.year === 2026));
  for (const h of HISTORY) {
    assert.doesNotMatch(h.note, /\u2014/);
    assert.doesNotMatch(h.label, /\u2014/);
  }
});

test("insurance collapse and mine fog raise P; exits cut it", () => {
  const s = createState(1, "reopen-lane");
  const open = sumPrice(priceComponents(s));
  const collapsed = sumPrice(
    priceComponents({ ...s, insurance: "collapsed", hullFactor: 0, tankerAlive: false }),
  );
  assert.ok(collapsed > open);
  const flowed = sumPrice(priceComponents({ ...s, exits: 3 }));
  assert.ok(flowed < open);
  assert.equal(PRICE.exitRelief, 16);
});

test("band edges match the teaching table", () => {
  assert.equal(bandOf(80), "cheap");
  assert.equal(bandOf(100), "tolerable");
  assert.equal(bandOf(120), "high");
  assert.equal(bandOf(126), "panic");
  assert.equal(PRICE.max, 126);
});

test("a long sit cannot print oil above the 2026 peak", () => {
  const eng = createEngine(1, "reopen-lane");
  for (let i = 0; i < 8; i++) eng.dispatch({ type: "tanker-wait" });
  assert.ok(eng.state().price <= PRICE.max);
  assert.equal(PRICE.max, 126);
});

test("a live exit still cuts P after the meter hits the peak", () => {
  const eng = createEngine(3, "reopen-lane");
  for (let i = 0; i < 3; i++) eng.dispatch({ type: "tanker-wait" });
  const peaked = eng.state().price;
  assert.equal(peaked, PRICE.max);
  eng.dispatch({
    type: "tanker-run",
    path: [
      { xNm: 40, yNm: 8 },
      { xNm: 80, yNm: 8 },
    ],
  });
  assert.equal(eng.state().books.hullsLive, 1);
  assert.ok(
    eng.state().price < peaked,
    `flow should bite the cap ${peaked} -> ${eng.state().price}`,
  );
});

test("a gulf drone raid after an ignored spider hole raises P", () => {
  const s = createState(1, "mine-warfare");
  const calm = sumPrice(priceComponents(s));
  const hit = sumPrice(priceComponents({ ...s, gulfHits: 1 }));
  assert.equal(hit, calm + PRICE.gulfDrone);
});
