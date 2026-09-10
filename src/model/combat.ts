/**
 * Shot vs mine. Escorts cut boats, not devices. Pay is a wave, not a sweep.
 * A VLCC usually reports light damage. It rarely dies from the shot.
 */

import { ATTACK, bandOf, radiusNm } from "./balance.ts";
import type { MineCircle, TankerDoor } from "./types.ts";

export type ShotKind = "none" | "miss" | "graze" | "kill";

export function escortCover(waitingHulls: number): number {
  return Math.min(
    ATTACK.escortCoverMax,
    Math.max(0, waitingHulls) * ATTACK.escortCoverPerWait,
  );
}

export function shotChance(opts: {
  door: TankerDoor;
  waitingHulls: number;
  paid: boolean;
  radarAlive?: boolean;
  drones?: number;
  boats?: number;
}): number {
  if (opts.door === "wait") return 0;
  const drones = opts.drones ?? 1;
  const boats = opts.boats ?? 1;
  const radar = opts.radarAlive === false ? ATTACK.radarBlind : 1;
  if (opts.door === "iran") {
    const drone = drones > 0 ? (opts.paid ? ATTACK.iranPaid : ATTACK.iranNakedDrone) * radar : 0;
    const boat = opts.paid || boats <= 0 ? 0 : ATTACK.iranNakedBoat;
    return drone + boat;
  }
  const drone = drones > 0 ? ATTACK.omaniDrone * radar : 0;
  const boat = boats > 0 ? ATTACK.omaniBoat * (1 - escortCover(opts.waitingHulls)) : 0;
  return drone + boat;
}

export function grazeUsdM(price: number): number {
  return ATTACK.grazeUsdMByBand[bandOf(price)];
}

export function rollShot(rng: () => number, chance: number): ShotKind {
  if (chance <= 0 || rng() >= chance) return "none";
  const r = rng();
  if (r < ATTACK.missWeight) return "miss";
  if (r < ATTACK.missWeight + ATTACK.grazeWeight) return "graze";
  return "kill";
}

export function clearedNm2(mines: MineCircle[]): number {
  let n = 0;
  for (const m of mines) {
    if (!m.hole) continue;
    const r = m.hole.radiusNm > 0 ? m.hole.radiusNm : radiusNm(m.radiusSteps);
    n += Math.PI * r * r;
  }
  return Math.round(n);
}
