import assert from "node:assert/strict";
import test from "node:test";
import { ATTACK, COMPANY, COST_FAMILY, DRONES, FORCE, IRAN_VERB, MAGAZINE, MAP, MINES, OPEN_RESEARCH, PRICE, SPIDER, STRIKE, STRIKE_NODES, TRAFFIC } from "./balance.ts";

test("company books use a cited VLCC newbuild", () => {
  assert.equal(COMPANY.hullUsdM, 129);
  assert.equal(COMPANY.freightUsdM, 15);
  assert.equal(COMPANY.freightByBand.tolerable, 15);
  assert.equal(COMPANY.freightByBand.panic, 28);
  assert.equal(COMPANY.familyUsdM, 12);
  assert.equal(COMPANY.crew, 22);
  assert.equal(COMPANY.crewBonusUsdM, 2);
  assert.equal(COMPANY.traderBonusByBand.cheap, 0);
  assert.ok(COMPANY.traderBonusByBand.panic > COMPANY.traderBonusByBand.high);
  assert.equal(COMPANY.idleUsdMPerHull, 2);
});

test("architect locks split hulls by size and do not average transcripts", () => {
  assert.equal(FORCE.warshipsPiersideStart, 17);
  assert.equal(FORCE.facOnWater, 120);
  assert.equal(FORCE.facSheds, 1500);
  assert.equal(FORCE.exportMbd, 1.5);
  assert.ok(FORCE.facOnWater > FORCE.warshipsPiersideStart);
  assert.ok(FORCE.facSheds > FORCE.facOnWater);
});

test("cost families stay ranges, not a blended sticker", () => {
  assert.equal(COST_FAMILY.mineM08Usd, 1500);
  assert.equal(COST_FAMILY.mineEm52Usd, 15_000);
  assert.ok(COST_FAMILY.mineInfluenceUsd.min >= COST_FAMILY.mineEm52Usd);
  assert.ok(COST_FAMILY.destroyerUsdBn.low < COST_FAMILY.destroyerUsdBn.high);
  assert.ok(COST_FAMILY.mineM08Usd < COST_FAMILY.mineEm52Usd);
});

test("Avenger status stays open research", () => {
  assert.match(OPEN_RESEARCH.avenger, /Open/);
  assert.match(OPEN_RESEARCH.avenger, /rented/);
});

test("scripted traffic is ten companies, four EV, six waiters, 100 hulls", () => {
  assert.equal(TRAFFIC.pay, 4);
  assert.equal(TRAFFIC.wait, 6);
  assert.equal(TRAFFIC.companies, TRAFFIC.pay + TRAFFIC.wait);
  assert.equal(TRAFFIC.hulls, 100);
  assert.equal(MINES.factoryPerTurn, 10);
  assert.equal(MINES.warehouseLay, 3);
  assert.equal(MINES.warehouseStart, MAGAZINE.iranMines);
});

test("strike order is a lock, not player copy", () => {
  assert.deepEqual(
    [...STRIKE.ideal],
    ["mine-factory", "drone-factory", "mine-warehouse", "drone-warehouse", "radar", "port"],
  );
  assert.equal(COMPANY.fleet["mine-warfare"], TRAFFIC.hulls);
  assert.equal(COMPANY.fleet["iran-warfare"], TRAFFIC.hulls);
  assert.equal(IRAN_VERB.surgeDrones, 3);
  assert.equal(MAGAZINE.interceptPerWeek, 1);
  assert.ok(MAGAZINE.usLasers > 0);
  assert.equal(MAGAZINE.iranDrones, DRONES.warehouseStart);
  assert.equal(ATTACK.omaniDrone + ATTACK.omaniBoat, ATTACK.omaniShot);
  assert.equal(SPIDER.pits.length, 4);
  assert.ok(SPIDER.stashMines > 0);
  assert.equal(PRICE.usFlowHulls, 10);
  const marks = STRIKE.targets.map((id) => STRIKE_NODES[id].emoji);
  assert.equal(new Set(marks).size, marks.length);
  assert.ok(marks.every((e) => e.length > 0));
});

test("water mask is a view plate, not a sweep polygon", () => {
  assert.match(MAP.waterMaskSrc, /hormuz-water-mask/);
  assert.notEqual(MAP.waterMaskSrc, MAP.imageSrc);
});
