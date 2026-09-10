import assert from "node:assert/strict";
import test from "node:test";
import { ATTACK } from "./balance.ts";
import { escortCover, rollShot, shotChance } from "./combat.ts";

test("pay cuts the shot, escort cuts Omani shot, neither is a mine sweep", () => {
  const naked = shotChance({ door: "omani", waitingHulls: 0, paid: false });
  const escorted = shotChance({ door: "omani", waitingHulls: 2, paid: false });
  const paid = shotChance({ door: "iran", waitingHulls: 0, paid: true });
  assert.equal(naked, ATTACK.omaniShot);
  assert.ok(escorted < naked, `escort ${escorted} vs naked ${naked}`);
  assert.ok(paid < naked);
  assert.equal(paid, ATTACK.iranPaid);
  assert.ok(escortCover(2) >= 0.69);
});

test("most shots miss or graze. Kill is rare.", () => {
  let miss = 0;
  let graze = 0;
  let kill = 0;
  let none = 0;
  const rng = () => Math.random();
  for (let i = 0; i < 4000; i++) {
    const k = rollShot(rng, 1);
    if (k === "miss") miss += 1;
    else if (k === "graze") graze += 1;
    else if (k === "kill") kill += 1;
    else none += 1;
  }
  assert.equal(none, 0);
  assert.ok(miss > graze, `miss ${miss} graze ${graze}`);
  assert.ok(graze > kill, `graze ${graze} kill ${kill}`);
  assert.ok(kill > 0 && kill < 400, `kill ${kill} of 4000`);
});
