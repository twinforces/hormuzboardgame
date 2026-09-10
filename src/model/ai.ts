/**
 * Scripted tendencies. Not a solver.
 * Traffic mix is four EV houses and six wait-for-sweep companies.
 */

import { COMPANY, DRONES, MINES, MAGAZINE, SPIDER, bandOf } from "./balance.ts";
import {
  tankerAiPick,
  tankerPersonas,
  voyagePayUsdM,
  voyagePremiumUsdM,
  type AccountantDoor,
} from "./company.ts";
import { grazeUsdM } from "./combat.ts";
import type { GameState } from "./types.ts";
import { humanSeat, isTrafficSitting } from "./scenarios.ts";

export { humanSeat, isTrafficSitting };

export function trafficDoor(
  s: GameState,
  omaniKill: number,
  iranKill: number,
  omaniShot: number,
  iranShot: number,
  companyIndex = 0,
): AccountantDoor {
  const personas = tankerPersonas(s.seed);
  const persona = personas[companyIndex] ?? "ceo";
  const insured = s.buyPolicy && s.insurance === "open";
  return tankerAiPick(
    persona,
    {
      balk: s.crewSour,
      omaniKill,
      iranKill,
      payUsdM: voyagePayUsdM(s.price),
      crewUsdM: s.crewBonusUsdM,
      insured,
      premiumUsdM: voyagePremiumUsdM(s.price, s.insurance),
      tollUsdM: COMPANY.tollUsdM,
      idleUsdM: 0,
      omaniShot,
      iranShot,
      grazeUsdM: grazeUsdM(s.price),
    },
    {
      balk: s.crewSour,
      omaniKill,
      omaniShot,
      waitingHulls: s.waitingHulls,
    },
  );
}

/** Mine factory prints this many into the mine warehouse. Stops when that roof is gone. Dead sheds cannot take the run. */
export function iranFactoryPrint(s: GameState): number {
  if (!s.industry.mineFactoryAlive) return 0;
  if (!isTrafficSitting(s.scenario)) {
    const band = bandOf(s.price);
    return band === "high" || band === "panic" ? 1 : 0;
  }
  if (!s.industry.mineDepotAlive) return 0;
  return MINES.factoryPerTurn;
}

/** Drone factory prints into the drone sheds. Separate plant from the mine roof. */
export function iranDronePrint(s: GameState): number {
  if (!isTrafficSitting(s.scenario)) return 0;
  if (!s.industry.droneFactoryAlive) return 0;
  if (!s.industry.droneDepotAlive) return 0;
  return DRONES.factoryPerTurn;
}

/** How many devices leave the mine warehouse for the TSS this week. */
export function iranWarehouseDump(s: GameState, pool: number): number {
  if (pool <= 0) return 0;
  if (!isTrafficSitting(s.scenario)) return 1;
  if (!s.industry.mineDepotAlive) return 0;
  return Math.min(MINES.warehouseLay, pool);
}

/**
 * Human Iran leftover after the sheds cannot dump.
 * Four coastal cells, no recycle. US sitting already has ignore-hole dumps.
 */
export function iranCoastalLeft(s: GameState): number {
  if (humanSeat(s.scenario) !== "iran") return 0;
  const used = new Set(s.spiderHoles.map((h) => h.pit));
  let n = 0;
  for (let i = 0; i < SPIDER.pits.length; i++) {
    if (!used.has(i)) n += 1;
  }
  return n;
}

export function nextIranPit(s: GameState): number | null {
  if (humanSeat(s.scenario) !== "iran") return null;
  const used = new Set(s.spiderHoles.map((h) => h.pit));
  for (let i = 0; i < SPIDER.pits.length; i++) {
    if (!used.has(i)) return i;
  }
  return null;
}

/** Drones that can still find. Radar and a living drone shed. */
export function flyingDrones(s: GameState): number {
  if (!s.industry.droneDepotAlive) return 0;
  return s.iranPool.drones;
}

/** @deprecated use iranFactoryPrint. Kept so old tests can point at the new faucet. */
export function iranRefillMines(s: GameState): number {
  return iranFactoryPrint(s);
}

/** Lasers first, then counter-drones. One drone a week while both sides have remaining. */
export function interceptDrones(s: GameState): GameState {
  if (s.iranPool.drones <= 0) return s;
  const effectors = s.usPool.lasers + s.usPool.counterDrones;
  if (effectors <= 0) return s;
  const spent = Math.min(MAGAZINE.interceptPerWeek, s.iranPool.drones, effectors);
  let lasers = s.usPool.lasers;
  let counter = s.usPool.counterDrones;
  let left = spent;
  const laserSpend = Math.min(lasers, left);
  lasers -= laserSpend;
  left -= laserSpend;
  counter -= Math.min(counter, left);
  return {
    ...s,
    iranPool: { ...s.iranPool, drones: s.iranPool.drones - spent },
    usPool: { lasers, counterDrones: counter },
  };
}