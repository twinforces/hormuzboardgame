import assert from "node:assert/strict";
import test from "node:test";
import { DRONES, MAGAZINE, MINES } from "./balance.ts";
import { interceptDrones, iranCoastalLeft, iranDronePrint, iranFactoryPrint, iranRefillMines, iranWarehouseDump, nextIranPit } from "./ai.ts";
import { createState } from "./engine.ts";

test("dead factory stops the refill; live factory prints ten a week", () => {
  const cheap = createState(1, "mine-warfare");
  assert.equal(iranRefillMines(cheap), 10);
  const rubble = {
    ...cheap,
    industry: { ...cheap.industry, mineFactoryAlive: false },
  };
  assert.equal(iranRefillMines(rubble), 0);
  const tanker = createState(1, "reopen-lane");
  assert.equal(iranRefillMines(tanker), 0);
  const iran = createState(1, "iran-warfare");
  assert.equal(iranRefillMines(iran), 10);
  assert.equal(iranWarehouseDump(iran, 30), 3);
});

test("warehouse dumps three until the sheds are gone; tanker still lays one", () => {
  const war = createState(1, "mine-warfare");
  assert.equal(iranWarehouseDump(war, 30), 3);
  const rubble = {
    ...war,
    industry: { ...war.industry, mineDepotAlive: false },
  };
  assert.equal(iranWarehouseDump(rubble, 30), 0);
  const tanker = createState(1, "reopen-lane");
  assert.equal(iranWarehouseDump(tanker, 3), 1);
  const iran = createState(1, "iran-warfare");
  assert.equal(iranWarehouseDump(iran, 30), 3);
});

test("coastal leftover is human Iran only, four cells, no recycle", () => {
  const iran = createState(1, "iran-warfare");
  assert.equal(iranCoastalLeft(iran), 4);
  assert.equal(nextIranPit(iran), 0);
  const us = createState(1, "mine-warfare");
  assert.equal(iranCoastalLeft(us), 0);
  assert.equal(nextIranPit(us), null);
  const tanker = createState(1, "reopen-lane");
  assert.equal(iranCoastalLeft(tanker), 0);
});

test("drone factory is a different plant from the mine roof", () => {
  const war = createState(1, "mine-warfare");
  assert.equal(iranFactoryPrint(war), MINES.factoryPerTurn);
  assert.equal(iranDronePrint(war), DRONES.factoryPerTurn);
  const noMine = {
    ...war,
    industry: { ...war.industry, mineFactoryAlive: false },
  };
  assert.equal(iranFactoryPrint(noMine), 0);
  assert.equal(iranDronePrint(noMine), DRONES.factoryPerTurn);
  const noDrone = {
    ...war,
    industry: { ...war.industry, droneFactoryAlive: false },
  };
  assert.equal(iranDronePrint(noDrone), 0);
  assert.equal(iranFactoryPrint(noDrone), MINES.factoryPerTurn);
  const noMineShed = {
    ...war,
    industry: { ...war.industry, mineDepotAlive: false },
  };
  assert.equal(iranFactoryPrint(noMineShed), 0);
  assert.equal(iranDronePrint(noMineShed), DRONES.factoryPerTurn);
});

test("lasers spend first, then counter-drones", () => {
  const s = createState(1, "mine-warfare");
  const once = interceptDrones(s);
  assert.equal(once.iranPool.drones, MAGAZINE.iranDrones - 1);
  assert.equal(once.usPool.lasers, MAGAZINE.usLasers - 1);
  assert.equal(once.usPool.counterDrones, MAGAZINE.usCounterDrones);
  let cur = once;
  for (let i = 0; i < MAGAZINE.usLasers; i++) cur = interceptDrones(cur);
  assert.equal(cur.usPool.lasers, 0);
  assert.equal(cur.usPool.counterDrones, MAGAZINE.usCounterDrones - 1);
});
