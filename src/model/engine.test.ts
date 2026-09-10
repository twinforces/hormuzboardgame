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

function warehouseLaid(s: { mines: { id: string }[] }) {
  return s.mines.filter((m) => m.id.startsWith("m-lay-")).length;
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
  assert.ok(next > 0.05, `leftover mines must keep risk, got ${next}`);
  assert.ok(
    Math.round(next * 100) < 90,
    `displayed percent must leave 100, got ${Math.round(next * 100)}`,
  );
  assert.ok(eng.state().mines.length > 4, "Iran lays on the wait");
  assert.match(eng.state().lastUsLine, /minelayer|Sweepers|escorts/i);
  assert.match(eng.state().lastIranLine, /seeded/i);
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
  assert.equal(eng.state().books.idleUsdM, COMPANY.idleUsdMPerHull * 12);
  assert.ok(eng.state().log.some((line) => /12 leftover × \$2M = \$24M/.test(line)));
});

test("a live toll voyage buys Iran one mine", () => {
  const eng = createEngine(3, "one-transit");
  eng.dispatch({ type: "tanker-toll" });
  assert.equal(eng.state().books.minesBought, 1);
  assert.equal(eng.state().books.iranSent, 1);
  assert.equal(eng.state().books.omaniSent, 0);
  assert.equal(eng.state().books.tollUsdM, COMPANY.tollUsdM);
});

test("two waits accumulate sweeps so Oman is a real bet, not 0% with red leftover", () => {
  const eng = createEngine(1, "reopen-lane");
  const start = combinedKillChance(omaniPath(), eng.state().mines, eng.state().draftClass).chance;
  eng.dispatch({ type: "tanker-wait" });
  eng.dispatch({ type: "tanker-wait" });
  const next = combinedKillChance(omaniPath(), eng.state().mines, eng.state().draftClass).chance;
  assert.ok(next < start * 0.5, `two waits should cut mine risk ${start} -> ${next}`);
  assert.ok(next > 0, `unswept red still counts, got ${next}`);
  assert.ok(eng.state().lastReport, "wait needs an in-your-face report");
  assert.equal(eng.state().lastReport?.kind, "wait");
  assert.match(eng.state().lastUsLine, /sank|escorts/i);
});

test("fog drift reaches the Iran till and a TSS hole does not zero it", () => {
  const eng = createEngine(1, "reopen-lane");
  const sweep = omaniPath();
  for (let i = 0; i < 4; i++) eng.dispatch({ type: "tanker-wait" });
  const iran = combinedKillChance(
    iranPath(),
    eng.state().mines,
    eng.state().draftClass,
    sweep,
  ).chance;
  assert.ok(eng.state().mines.some((m) => m.hole), "Navy swept the ribbon");
  assert.ok(iran > 0.05, `drift should dirty the till, got ${iran}`);
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
  assert.match(reopen.state().log[0] ?? "", /Twelve hulls/);
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
  assert.ok(eng.debug().lastKillChance > 0.5);
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
  assert.ok(afterExit < start, `a live exit relieves P ${start} -> ${afterExit}`);

  const parked = createEngine(3, "reopen-lane");
  parked.dispatch({ type: "tanker-wait" });
  const waited = parked.state().price;
  parked.dispatch({ type: "tanker-run", path: missSouth() });
  const flowed = parked.state().price;
  assert.ok(waited > start, `a sit raises P ${start} -> ${waited}`);
  assert.ok(flowed < waited, `leaving after a sit cuts P ${waited} -> ${flowed}`);

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

test("mine-warfare starts at usOrders and tanker verbs are illegal", () => {
  const eng = createEngine(1, "mine-warfare");
  assert.equal(eng.state().phase, "usOrders");
  assert.equal(eng.state().scenario, "mine-warfare");
  assert.match(eng.state().log.join(" "), /circle/i);
  const late = eng.dispatch({ type: "tanker-wait" });
  assert.equal(late.ok, false);
  const sweep = eng.dispatch({ type: "us-sweep" });
  assert.equal(sweep.ok, true);
  assert.equal(eng.state().phase, "usOrders");
  assert.equal(eng.state().turn, 2);
  assert.ok(eng.state().mines.filter((m) => m.hole).length > 0, "sweep punches holes");
  assert.ok(eng.state().lastReport);
  assert.equal(eng.state().lastReport?.watcher, "us");
});

test("a mine factory strike does not punch Navy holes and kills only mine refill", () => {
  const eng = createEngine(1, "mine-warfare");
  const holes0 = eng.state().mines.filter((m) => m.hole).length;
  const drones0 = eng.state().iranPool.drones;
  const r = eng.dispatch({ type: "us-strike", target: "mine-factory" });
  assert.equal(r.ok, true);
  assert.equal(eng.state().industry.mineFactoryAlive, false);
  assert.equal(eng.state().industry.droneFactoryAlive, true);
  assert.equal(eng.state().mines.filter((m) => m.hole).length, holes0);
  assert.match(eng.state().lastUsLine, /roof is gone/);
  assert.ok(eng.state().iranPool.drones >= drones0, "drone plant is a different roof");
  const again = eng.dispatch({ type: "us-strike", target: "mine-factory" });
  assert.equal(again.ok, true);
  assert.match(eng.state().lastUsLine, /already down/);
});

test("mine warehouse zeros mines, drone warehouse zeros air, radar blinds shot not mines", () => {
  const warehouse = createEngine(2, "mine-warfare");
  const n0 = warehouseLaid(warehouse.state());
  const drones0 = warehouse.state().iranPool.drones;
  warehouse.dispatch({ type: "us-strike", target: "mine-warehouse" });
  assert.equal(warehouse.state().industry.mineDepotAlive, false);
  assert.equal(warehouse.state().industry.droneDepotAlive, true);
  assert.equal(warehouseLaid(warehouse.state()), n0, "mine warehouse down means no dump this week");
  assert.ok(
    warehouse.state().iranPool.drones >= drones0 - 1,
    "drone sheds are a different stack",
  );
  warehouse.dispatch({ type: "us-sweep" });
  assert.equal(warehouseLaid(warehouse.state()), n0, "dead mine warehouse does not dump later either");

  const sheds = createEngine(5, "mine-warfare");
  sheds.dispatch({ type: "us-strike", target: "drone-warehouse" });
  assert.equal(sheds.state().industry.droneDepotAlive, false);
  assert.equal(sheds.state().iranPool.drones, 0);
  assert.equal(sheds.state().industry.mineDepotAlive, true);

  const radar = createEngine(3, "mine-warfare");
  const mines0 = warehouseLaid(radar.state());
  radar.dispatch({ type: "us-strike", target: "radar" });
  assert.equal(radar.state().industry.radarAlive, false);
  assert.match(radar.state().lastUsLine, /Drones guess/);
  assert.match(radar.state().lastUsLine, /Mines still drift/);
  assert.equal(warehouseLaid(radar.state()), mines0 + 3, "radar does not stop the mine dump");
  const shot1 = radar.state().lastReport?.omaniShotPct ?? 99;
  assert.ok(shot1 < 32, `dead radar cuts drone shot, got ${shot1}`);

  const port = createEngine(4, "mine-warfare");
  port.dispatch({ type: "us-strike", target: "port" });
  assert.equal(port.state().industry.portAlive, false);
  assert.equal(port.state().iranPool.boats, 0);
  assert.equal(port.state().industry.mineFactoryAlive, true);
  assert.equal(port.state().industry.droneFactoryAlive, true);
  assert.match(port.state().lastUsLine, /plant still prints/);
  const hole = port.state().spiderHoles.find((h) => h.alive);
  assert.ok(hole, "hitting pierside ships lights a spider hole");
  assert.equal(hole!.mines, 4);
  assert.equal(hole!.drones, 3);
});

test("factory prints ten, warehouse dumps three, until those roofs are gone", () => {
  const eng = createEngine(1, "mine-warfare");
  const pool0 = eng.state().iranPool.mines;
  const n0 = warehouseLaid(eng.state());
  eng.dispatch({ type: "us-sweep" });
  assert.equal(warehouseLaid(eng.state()), n0 + 3);
  assert.ok(eng.state().iranPool.mines > pool0, "factory printed into the warehouse");
  eng.dispatch({ type: "us-strike", target: "mine-factory" });
  const n1 = warehouseLaid(eng.state());
  assert.equal(n1, n0 + 6, "warehouse still dumps the week the roof comes off");
  eng.dispatch({ type: "us-strike", target: "radar" });
  assert.equal(eng.state().industry.mineFactoryAlive, false);
  assert.equal(eng.state().industry.droneFactoryAlive, true);
  assert.equal(warehouseLaid(eng.state()), n1 + 3);
});

test("lasers eat a drone each week while both magazines last", () => {
  const eng = createEngine(1, "mine-warfare");
  const drones0 = eng.state().iranPool.drones;
  const lasers0 = eng.state().usPool.lasers;
  eng.dispatch({ type: "us-sweep" });
  assert.equal(eng.state().iranPool.drones, drones0 + 2 - 1);
  assert.equal(eng.state().usPool.lasers, lasers0 - 1);
});

test("a revealed spider hole eats a week or dumps mines and gulf drones", () => {
  const hit = createEngine(4, "mine-warfare");
  hit.dispatch({ type: "us-strike", target: "port" });
  const hole = hit.state().spiderHoles.find((h) => h.alive);
  assert.ok(hole);
  const n0 = hit.state().mines.length;
  const gulf0 = hit.state().gulfHits;
  const struckId = hole!.id;
  const strike = hit.dispatch({
    type: "us-strike",
    target: "spider-hole",
    pitId: struckId,
  });
  assert.equal(strike.ok, true);
  assert.equal(hit.state().turn, 3);
  assert.equal(hit.state().spiderHoles.find((h) => h.id === struckId)?.alive, false);
  assert.match(hit.state().lastUsLine, /Hidden stores are gone/);
  assert.equal(hit.state().gulfHits, gulf0);
  assert.ok(hit.state().mines.length <= n0 + 3, "striking the hole stops the stash dump");

  const dump = createEngine(4, "mine-warfare");
  dump.dispatch({ type: "us-strike", target: "port" });
  const live = dump.state().spiderHoles.find((h) => h.alive);
  assert.ok(live);
  const minesBefore = dump.state().mines.length;
  const dumpedId = live.id;
  dump.dispatch({ type: "us-sweep" });
  assert.equal(dump.state().spiderHoles.find((h) => h.id === dumpedId)?.alive, false);
  assert.ok(dump.state().mines.length >= minesBefore + 4, "ignored hole dumps extra mines");
  assert.equal(dump.state().gulfHits, 1);
  assert.match(dump.state().lastIranLine, /Gulf state/);
  assert.equal(dump.state().priceComponents.gulf, 8);
});

test("a lost traffic hull lights a spider hole, mine or shot", () => {
  const eng = createEngine(1, "mine-warfare");
  let weeks = 0;
  while (eng.state().books.hullsLost === 0 && weeks < 40) {
    const r = eng.dispatch({ type: "us-sweep" });
    assert.equal(r.ok, true);
    weeks += 1;
  }
  assert.ok(eng.state().books.hullsLost > 0, "need a dead hull to teach the hole");
  const cause = eng.state().lastLoss?.cause;
  assert.ok(cause === "mine" || cause === "shot", `lost hull cause ${cause}`);
  const hole = eng.state().spiderHoles.find((h) => h.alive);
  assert.ok(hole, `a lost hull (${cause}) must show a spider hole`);
  assert.equal(hole!.mines, 4);
  assert.equal(hole!.drones, 3);
  assert.match(eng.state().lastUsLine, /spider hole showed/);
});

test("a spent spider pit can light again after the dump", () => {
  const eng = createEngine(1, "mine-warfare");
  let weeks = 0;
  while (eng.state().spiderHoles.length < 2 && weeks < 40) {
    const r = eng.dispatch({ type: "us-sweep" });
    assert.equal(r.ok, true);
    weeks += 1;
  }
  assert.ok(eng.state().spiderHoles.length >= 2, "pits recycle after a dump");
  assert.equal(eng.state().spiderHoles.filter((h) => h.alive).length, 1);
});

test("mine-warfare traffic sitting ends after the hundred hulls go", () => {
  const eng = createEngine(1, "mine-warfare");
  const first = eng.dispatch({ type: "us-sweep" });
  assert.equal(first.ok, true);
  const wave = eng.state().lastReport?.wave;
  assert.ok(wave);
  assert.equal(wave!.sent + wave!.waited, 10);
  assert.equal(eng.state().books.hullsSent, wave!.sent);
  let n = 1;
  while (eng.state().phase !== "matchOver" && n < 80) {
    const r = eng.dispatch({ type: "us-sweep" });
    assert.equal(r.ok, true, `sweep ${n} failed: ${"reason" in r ? r.reason : ""}`);
    n += 1;
  }
  assert.equal(eng.state().phase, "matchOver");
  assert.equal(eng.state().books.hullsSent, 100);
  assert.ok(n >= 10);
});
