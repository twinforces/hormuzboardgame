import assert from "node:assert/strict";
import test from "node:test";
import { createEngine, iranPath, omaniPath } from "./engine.ts";
import { combinedKillChance, lonLatToNm } from "./geo.ts";
import { bandOf, COMPANY } from "./balance.ts";
import { COPY } from "./copy.ts";
import { voyagePayUsdM, voyagePremiumUsdM } from "./company.ts";

function throughMines() {
  return [
    lonLatToNm({ lat: 26.42, lon: 56.5 }),
    lonLatToNm({ lat: 26.4, lon: 56.3 }),
    lonLatToNm({ lat: 26.55, lon: 56.4 }),
    lonLatToNm({ lat: 26.2, lon: 56.1 }),
    lonLatToNm({ lat: 26.05, lon: 55.99 }),
  ];
}

function missSouth() {
  return [
    lonLatToNm({ lat: 25.15, lon: 56.2 }),
    lonLatToNm({ lat: 25.15, lon: 56.5 }),
  ];
}

test("expand: original circles grow one step on wait, Iran may lay extras", () => {
  const eng = createEngine(1, "reopen-lane");
  const before = eng.state().mines.map((m) => ({ id: m.id, steps: m.radiusSteps }));
  const r = eng.dispatch({ type: "tanker-wait" });
  assert.equal(r.ok, true);
  const after = eng.state().mines;
  assert.ok(after.length >= before.length);
  for (const b of before) {
    const found = after.find((m) => m.id === b.id);
    assert.ok(found, b.id);
    assert.equal(found!.radiusSteps, b.steps + 1);
  }
  const again = eng.dispatch({ type: "tanker-wait" });
  assert.equal(again.ok, true);
  const twice = eng.state().mines;
  for (const b of before) {
    const found = twice.find((m) => m.id === b.id);
    assert.ok(found, b.id);
    assert.equal(found!.radiusSteps, b.steps + 2);
  }
});

test("wait forces US holes so Omani risk is not stuck at 100%", () => {
  const eng = createEngine(1, "reopen-lane");
  const start = combinedKillChance(
    omaniPath(),
    eng.state().mines,
    eng.state().draftClass,
  ).chance;
  eng.dispatch({ type: "tanker-wait" });
  const holes = eng.state().mines.filter((m) => m.hole).length;
  assert.ok(holes > 0, "US must punch on a wait");
  const next = combinedKillChance(
    omaniPath(),
    eng.state().mines,
    eng.state().draftClass,
  ).chance;
  assert.ok(next < start, `omani kill should drop ${start} -> ${next}`);
  assert.ok(
    Math.round(next * 100) < 90,
    `displayed percent must leave 100, got ${Math.round(next * 100)}`,
  );
  assert.ok(eng.state().mines.length > 4, "Iran lays on the wait");
  assert.match(eng.state().lastUsLine, /hole/i);
  assert.match(eng.state().lastIranLine, /lays/i);
});

test("Iran left the Qeshm-Larak till unmined so the north door is tempting", () => {
  const eng = createEngine(1, "reopen-lane");
  assert.ok(!eng.state().mines.some((m) => m.id.includes("qeshm")));
  const omani = combinedKillChance(
    omaniPath(),
    eng.state().mines,
    eng.state().draftClass,
  ).chance;
  const iran = combinedKillChance(
    iranPath(),
    eng.state().mines,
    eng.state().draftClass,
  ).chance;
  assert.ok(iran < omani, `Iran ${iran} should beat Omani ${omani}`);
  assert.ok(iran < 0.35, `Iran till should be tempting, was ${(iran * 100).toFixed(0)}%`);
});

test("wait increments Navy punched without exposing Iran magazine as a total", () => {
  const eng = createEngine(1, "reopen-lane");
  const magazine = eng.state().iranPool.mines;
  assert.equal(eng.state().navyPulled, 0);
  eng.dispatch({ type: "tanker-wait" });
  assert.ok(eng.state().navyPulled > 0, "Navy must punch on a wait");
  assert.ok(eng.state().mines.some((m) => m.hole), "a wait must rent at least one hole");
  assert.notEqual(eng.state().mines.length, magazine);
});

test("wait books idle on leftover hulls", () => {
  const eng = createEngine(1, "reopen-lane");
  assert.equal(eng.state().books.idleUsdM, 0);
  eng.dispatch({ type: "tanker-wait" });
  assert.equal(eng.state().books.idleUsdM, COMPANY.idleUsdMPerHull * 5);
  assert.ok(eng.state().log.some((line) => /Idle/.test(line)));
});

test("Navy punches at most three holes a week, even on Packed TSS", () => {
  const packed = createEngine(1, "overplay");
  packed.dispatch({ type: "tanker-wait" });
  const holes = packed.state().mines.filter((m) => m.hole).length;
  assert.ok(holes <= 3, `punched ${holes}`);
  assert.ok(packed.state().mines.length > holes, "red remains");
});

test("scenario kits change hulls and fog, not a clock", () => {
  const reopen = createEngine(1, "reopen-lane");
  const one = createEngine(1, "one-transit");
  const over = createEngine(1, "overplay");
  assert.equal(reopen.state().maxTurns, 0);
  assert.equal(one.state().maxTurns, 0);
  assert.equal(over.state().maxTurns, 0);
  assert.equal(reopen.state().mines.length, 4);
  assert.equal(one.state().mines.length, 3);
  assert.ok(over.state().mines.length > reopen.state().mines.length);
  assert.match(reopen.state().log[0] ?? "", /Five hulls/);
  assert.match(one.state().log[0] ?? "", /One hull/);
  one.dispatch({ type: "tanker-wait" });
  assert.equal(one.state().phase, "tankerOrders");
  assert.equal(one.state().turn, 2);
});

test("toll funds the next wave and does not grant mine immunity", () => {
  const eng = createEngine(3, "reopen-lane");
  const minesBefore = eng.state().iranPool.mines;
  const r = eng.dispatch({ type: "tanker-toll" });
  assert.equal(r.ok, true);
  assert.equal(eng.state().tankerPaid, true);
  assert.equal(eng.state().lastDoor, "iran");
  assert.ok(eng.state().iranPool.mines >= minesBefore);
  assert.deepEqual(eng.state().tankerPath, iranPath());
  assert.equal(eng.state().books.tollUsdM, COMPANY.tollUsdM);
});

test("clip: a path that misses dummy circles does not kill", () => {
  const eng = createEngine(7, "reopen-lane");
  const quote = voyagePayUsdM(eng.state().price);
  const r = eng.dispatch({ type: "tanker-run", path: missSouth() });
  assert.equal(r.ok, true);
  assert.equal(eng.state().exits, 1);
  assert.equal(eng.debug().lastKillChance, 0);
  assert.equal(eng.state().insurance, "open");
  assert.equal(eng.state().books.hullsLive, 1);
  assert.equal(eng.state().books.hullsLost, 0);
  assert.equal(
    eng.state().books.freightUsdM + eng.state().books.bonusUsdM,
    quote,
  );
  assert.equal(bandOf(104), "tolerable");
});

test("one-boom-kills-insurance: a path through the dummy field collapses it", () => {
  const eng = createEngine(1, "reopen-lane");
  const r = eng.dispatch({ type: "tanker-run", path: throughMines() });
  assert.equal(r.ok, true);
  assert.equal(eng.debug().lastKillChance, 1);
  assert.equal(eng.state().insurance, "collapsed");
  assert.ok(eng.state().contracts.value >= 3);
  assert.ok(eng.state().price > 82);
  assert.equal(eng.state().books.hullsLost, 1);
  assert.equal(eng.state().books.freightUsdM, 0);
  assert.equal(eng.state().books.hullWriteoffUsdM, 129);
  assert.equal(eng.state().books.familyUsdM, 12);
  assert.equal(eng.state().books.crewUsdM, 0);
  assert.equal(eng.state().crewBonusUsdM, 2);
  assert.ok(eng.state().log.some((line) => line.includes("trader ate $150M")));
  assert.ok(eng.state().lastLoss);
  assert.equal(eng.state().lastLoss?.insured, false);
  assert.equal(eng.state().books.recoverUsdM, 0);
  const before = eng.state().insurance;
  const balked = eng.dispatch({ type: "tanker-run", path: throughMines() });
  assert.equal(balked.ok, false);
  assert.equal(balked.reason, COPY.balk);
  assert.equal(eng.state().insurance, before);
  assert.equal(eng.state().books.hullsSent, 1);
});

test("wait after blood opens a hole so captains will go", () => {
  const eng = createEngine(1, "reopen-lane");
  eng.dispatch({ type: "tanker-run", path: throughMines() });
  assert.equal(eng.state().books.hullsLost, 1);
  const blocked = eng.dispatch({ type: "tanker-omani" });
  assert.equal(blocked.ok, false);
  const waited = eng.dispatch({ type: "tanker-wait" });
  assert.equal(waited.ok, true);
  assert.equal(eng.state().books.hullsSent, 1);
  const go = eng.dispatch({ type: "tanker-omani" });
  assert.equal(go.ok, true);
  assert.equal(eng.state().books.hullsSent, 2);
});

test("seed: two engines with seed 1 and identical orders match", () => {
  const a = createEngine(1, "reopen-lane");
  const b = createEngine(1, "reopen-lane");
  a.dispatch({ type: "tanker-wait" });
  b.dispatch({ type: "tanker-wait" });
  a.dispatch({ type: "tanker-omani" });
  b.dispatch({ type: "tanker-omani" });
  const sa = a.state();
  const sb = b.state();
  assert.equal(sa.price, sb.price);
  assert.equal(sa.insurance, sb.insurance);
  assert.equal(sa.exits, sb.exits);
  assert.equal(sa.lastKillChance, sb.lastKillChance);
  assert.deepEqual(
    sa.mines.map((m) => m.radiusSteps),
    sb.mines.map((m) => m.radiusSteps),
  );
});

test("steel-never-fills: STEEL stays 0 after contracts tick", () => {
  const eng = createEngine(1, "reopen-lane");
  eng.dispatch({ type: "tanker-run", path: throughMines() });
  assert.equal(eng.state().steel, 0);
  assert.ok(eng.state().contracts.value > 0);
});

test("price rises with mine fog and a kill, falls with exits", () => {
  const safe = createEngine(3, "reopen-lane");
  const start = safe.state().price;
  safe.dispatch({ type: "tanker-run", path: missSouth() });
  const afterExit = safe.state().price;
  assert.ok(afterExit < start, "a live exit relieves P");

  const dead = createEngine(1, "reopen-lane");
  dead.dispatch({ type: "tanker-run", path: throughMines() });
  assert.equal(dead.state().insurance, "collapsed");
  assert.ok(dead.state().price > start);
  assert.equal(bandOf(dead.state().price) === "cheap", false);
});

test("illegal tanker-run outside tankerOrders is rejected", () => {
  const eng = createEngine(1, "one-transit");
  eng.dispatch({ type: "tanker-run", path: missSouth() });
  assert.equal(eng.state().phase, "matchOver");
  const r = eng.dispatch({ type: "tanker-wait" });
  assert.equal(r.ok, false);
});

test("tanker-naked-hull: after collapse, hull_factor is 0 or 1", () => {
  const eng = createEngine(1, "reopen-lane");
  eng.dispatch({ type: "tanker-run", path: throughMines() });
  assert.equal(eng.state().insurance, "collapsed");
  eng.dispatch({ type: "tanker-run", path: missSouth() });
  const h = eng.state().hullFactor;
  assert.ok(h === 0 || h === 1);
});

test("omani door uses the JMIC inbound, not a freehand plot", () => {
  const eng = createEngine(4, "reopen-lane");
  eng.dispatch({ type: "tanker-wait" });
  eng.dispatch({ type: "tanker-omani" });
  assert.deepEqual(eng.state().tankerPath, omaniPath());
  assert.equal(eng.state().tankerPaid, false);
});

test("opening log points at the clickable tracks", () => {
  const log = createEngine(1).state().log.join(" ");
  assert.match(log, /Click the US ribbon/);
  assert.match(log, /Larak/);
  assert.doesNotMatch(log, /Two doors/);
  assert.doesNotMatch(log, /draw a track/i);
});

test("a checked policy pays the hull then the paper dies", () => {
  const eng = createEngine(1, "reopen-lane");
  const prem = voyagePremiumUsdM(eng.state().price, "open");
  const bought = eng.dispatch({ type: "tanker-policy", on: true });
  assert.equal(bought.ok, true);
  assert.equal(eng.state().buyPolicy, true);
  eng.dispatch({ type: "tanker-run", path: throughMines() });
  assert.equal(eng.state().insurance, "collapsed");
  assert.equal(eng.state().buyPolicy, false);
  assert.equal(eng.state().books.recoverUsdM, COMPANY.hullUsdM);
  assert.equal(eng.state().books.premiumUsdM, prem);
  assert.equal(eng.state().lastLoss?.insured, true);
  assert.equal(eng.state().lastLoss?.recoverUsdM, COMPANY.hullUsdM);
  const again = eng.dispatch({ type: "tanker-policy", on: true });
  assert.equal(again.ok, false);
  assert.equal(again.reason, COPY.policyGone);
});
