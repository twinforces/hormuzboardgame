import assert from "node:assert/strict";
import test from "node:test";
import { COMPANY, COST_FAMILY, FORCE, OPEN_RESEARCH } from "./balance.ts";

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
