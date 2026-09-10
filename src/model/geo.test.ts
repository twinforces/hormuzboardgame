import assert from "node:assert/strict";
import test from "node:test";
import {
  COUNTRY_LABELS,
  DEEP_WATER,
  IRANIAN_INBOUND,
  MAP,
  MINE,
  PLACES,
  WATER_LABELS,
  killPerNm,
  radiusNm,
} from "./balance.ts";
import {
  combinedKillChance,
  distNm,
  inDeepWater,
  killChanceForCircle,
  lonLatToNm,
  mineFogCovered,
  mineHoles,
  nmToLonLat,
  paintFogField,
  polylineCircleClipNm,
  polylineLengthNm,
  pickMine,
  pointSegDistNm,
  pxToNm,
  nmToPx,
  segmentCircleClipNm,
} from "./geo.ts";
import type { MineCircle, NmPoint } from "./types.ts";

const a: NmPoint = { xNm: 0, yNm: 0 };
const b: NmPoint = { xNm: 10, yNm: 0 };

test("clip: a path that misses a circle has kill chance 0", () => {
  const mine: MineCircle = {
    id: "x",
    center: { xNm: 0, yNm: 10 },
    radiusSteps: 0,
    laidTurn: 1,
    hole: null,
  };
  const { chance, clips } = combinedKillChance([a, b], [mine], "vlcc");
  assert.equal(clips[0]!.clipNm, 0);
  assert.equal(chance, 0);
});

test("pickMine prefers the tight blob and misses outside the fog", () => {
  const tight: MineCircle = {
    id: "tight",
    center: { xNm: 0, yNm: 0 },
    radiusSteps: 0,
    laidTurn: 1,
    hole: null,
  };
  const fat: MineCircle = {
    id: "fat",
    center: { xNm: 0, yNm: 0 },
    radiusSteps: 3,
    laidTurn: 1,
    hole: null,
  };
  assert.equal(pickMine([fat, tight], { xNm: 0, yNm: 0 })?.id, "tight");
  assert.equal(pickMine([fat], { xNm: 80, yNm: 80 }), null);
});

test("clip: a path through a circle uses the balance table", () => {
  const through: MineCircle = {
    id: "y",
    center: { xNm: 5, yNm: 0 },
    radiusSteps: 0,
    laidTurn: 1,
    hole: null,
  };
  const r = radiusNm(0);
  const clip = polylineCircleClipNm([a, b], through.center, r);
  assert.ok(Math.abs(clip - 2 * r) < 1e-6, `clip ${clip} vs diameter ${2 * r}`);
  const one = killChanceForCircle([a, b], through, "vlcc", []);
  const expected = Math.min(1, clip * killPerNm(0) * MINE.draftFactor.vlcc);
  assert.ok(Math.abs(one.chance - expected) < 1e-9);
  const { chance } = combinedKillChance([a, b], [through], "vlcc");
  assert.ok(chance > 0.15, `unswept field on the lane is red, got ${chance}`);
});

test("clip: radius-1 / 2 / 3 use the table, not a single fudge", () => {
  const steps = [1, 2, 3];
  const chances = steps.map((radiusSteps) => {
    const mine: MineCircle = {
      id: String(radiusSteps),
      center: { xNm: 5, yNm: 0 },
      radiusSteps,
      laidTurn: 1,
      hole: null,
    };
    return killChanceForCircle([a, b], mine, "vlcc", []).chance;
  });
  assert.ok(chances[0]! > chances[1]!, "tighter circle is deadlier per nm of path");
  assert.ok(chances[1]! > chances[2]!);
});

test("segment fully inside returns its length", () => {
  const len = segmentCircleClipNm(
    { xNm: 4, yNm: 0 },
    { xNm: 6, yNm: 0 },
    { xNm: 5, yNm: 0 },
    10,
  );
  assert.equal(len, 2);
});

test("lon/lat roundtrips through nm and pixels", () => {
  const p = { lat: 26.264, lon: 55.305 };
  const nm = lonLatToNm(p);
  const back = nmToLonLat(nm);
  assert.ok(Math.abs(back.lat - p.lat) < 1e-9);
  assert.ok(Math.abs(back.lon - p.lon) < 1e-9);
  const px = nmToPx(nm);
  const nm2 = pxToNm(px.x, px.y);
  assert.ok(distNm(nm, nm2) < 1e-6);
});

test("polyline length adds segments", () => {
  assert.equal(polylineLengthNm([a, b, { xNm: 10, yNm: 10 }]), 20);
});

test("chart labels sit inside the photo crop", () => {
  const all = [...PLACES, ...WATER_LABELS, ...COUNTRY_LABELS];
  for (const p of all) {
    assert.ok(p.lon > MAP.westLon && p.lon < MAP.eastLon, `${p.id} lon`);
    assert.ok(p.lat > MAP.southLat && p.lat < MAP.northLat, `${p.id} lat`);
  }
});

test("Iran inbound threads the water between Qeshm and Larak", () => {
  const channel = lonLatToNm({ lat: 26.82, lon: 56.31 });
  const path = IRANIAN_INBOUND.map(lonLatToNm);
  let nearest = Infinity;
  for (let i = 1; i < path.length; i++) {
    nearest = Math.min(nearest, pointSegDistNm(channel, path[i - 1]!, path[i]!));
  }
  assert.ok(nearest < 2, `channel dist ${nearest} nm`);
});

test("a green sweep that covers a red blob zeros its clip", () => {
  const fog: MineCircle = {
    id: "fog",
    center: { xNm: 5, yNm: 0 },
    radiusSteps: 0,
    laidTurn: 1,
    hole: { radiusNm: radiusNm(0), expiresTurn: 2 },
  };
  const holes = mineHoles([fog]);
  assert.equal(mineFogCovered(fog, holes), true);
  const { chance } = combinedKillChance([a, b], [fog], "vlcc");
  assert.equal(chance, 0);
});

test("a red blob sitting inside another mine's hole is gone", () => {
  const sweep: MineCircle = {
    id: "sweep",
    center: { xNm: 5, yNm: 0 },
    radiusSteps: 3,
    laidTurn: 1,
    hole: { radiusNm: radiusNm(3), expiresTurn: 2 },
  };
  const nested: MineCircle = {
    id: "nested",
    center: { xNm: 5, yNm: 0 },
    radiusSteps: 0,
    laidTurn: 1,
    hole: null,
  };
  const holes = mineHoles([sweep, nested]);
  assert.equal(mineFogCovered(nested, holes), true);
  const { chance, clips } = combinedKillChance([a, b], [sweep, nested], "vlcc");
  assert.equal(clips.find((c) => c.id === "nested")?.clipNm, 0);
  assert.equal(chance, 0);
});

test("an unswept mine still counts after a neighbor is swept", () => {
  const swept: MineCircle = {
    id: "swept",
    center: { xNm: 5, yNm: 0 },
    radiusSteps: 2,
    laidTurn: 1,
    hole: { radiusNm: radiusNm(2), expiresTurn: 4 },
  };
  const leftover: MineCircle = {
    id: "leftover",
    center: { xNm: 12, yNm: 0 },
    radiusSteps: 2,
    laidTurn: 1,
    hole: null,
  };
  const { chance, clips } = combinedKillChance(
    [a, { xNm: 20, yNm: 0 }],
    [swept, leftover],
    "vlcc",
  );
  assert.equal(clips.find((c) => c.id === "swept")?.chance, 0);
  assert.ok((clips.find((c) => c.id === "leftover")?.chance ?? 0) > 0);
  assert.ok(chance > 0, `leftover must keep risk, got ${chance}`);
});

test("a TSS sweep does not erase fog that drifted onto the till", () => {
  const tss: MineCircle = {
    id: "tss",
    center: { xNm: 10, yNm: 0 },
    radiusSteps: 3,
    laidTurn: 1,
    hole: { radiusNm: radiusNm(3), expiresTurn: 8 },
  };
  const omani = [a, { xNm: 20, yNm: 0 }];
  const till = [
    { xNm: 0, yNm: 8 },
    { xNm: 20, yNm: 8 },
  ];
  const swept = paintFogField(omani, [tss], "vlcc", omani);
  const north = paintFogField(till, [tss], "vlcc", omani);
  assert.ok(swept.chance < 0.1, `omani swept ${swept.chance}`);
  assert.ok(
    north.chance > 0.15,
    `till still fog ${north.chance} b${north.black} w${north.white}`,
  );
});

test("overlapping mines are union. Sweep one of two equal disks, about half remains.", () => {
  const left: MineCircle = {
    id: "left",
    center: { xNm: 4, yNm: 0 },
    radiusSteps: 0,
    laidTurn: 1,
    hole: { radiusNm: radiusNm(0), expiresTurn: 4 },
  };
  const right: MineCircle = {
    id: "right",
    center: { xNm: 16, yNm: 0 },
    radiusSteps: 0,
    laidTurn: 1,
    hole: null,
  };
  const path = [a, { xNm: 20, yNm: 0 }];
  const paint = paintFogField(path, [left, right], "vlcc");
  const frac = paint.black / (paint.black + paint.white);
  assert.ok(paint.white > 0, "hole paints white");
  assert.ok(paint.black > 0, "leftover paints black");
  assert.ok(frac > 0.35 && frac < 0.65, `union remaining ${frac}`);
  assert.ok(paint.chance > 0, `lane fraction ${paint.chance}`);
});

test("deep water is the Omani TSS, not Qeshm-Larak", () => {
  assert.ok(DEEP_WATER.length >= 6);
  assert.ok(inDeepWater(lonLatToNm({ lat: 26.42, lon: 56.5 })), "TSS in");
  assert.ok(inDeepWater(lonLatToNm({ lat: 26.10, lon: 56.35 })), "JMIC in");
  assert.equal(inDeepWater(lonLatToNm({ lat: 26.82, lon: 56.31 })), false, "till out");
  assert.equal(inDeepWater(lonLatToNm({ lat: 26.72, lon: 56.55 })), false, "Larak out");
});
