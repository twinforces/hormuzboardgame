/**
 * Scenario kits. First slice: dummy mines already in the water.
 * Factions come later. The argument this file makes is geometry.
 */

import { lonLatToNm } from "./geo.ts";
import type { MineCircle, Role, ScenarioId } from "./types.ts";

export const SCENARIO_TURNS: Record<ScenarioId, number> = {
  "reopen-lane": 0,
  "one-transit": 0,
  overplay: 0,
  "mine-warfare": 0,
};

export function humanSeat(scenario: ScenarioId): Role {
  return scenario === "mine-warfare" ? "us" : "tanker";
}

function mine(
  id: string,
  lat: number,
  lon: number,
  radiusSteps: number,
  laidTurn: number,
): MineCircle {
  return {
    id,
    center: lonLatToNm({ lat, lon }),
    radiusSteps,
    laidTurn,
    hole: null,
  };
}

/**
 * Dummy circles for the tanker-vs-fog slice.
 * Iran mined the TSS, not the Qeshm-Larak till. That gap is the cash
 * register. Flavor, then tests. Not a classified laydown.
 */
export function initialMines(scenario: ScenarioId): MineCircle[] {
  const base = [
    mine("m-narrows-east", 26.42, 56.5, 1, 1),
    mine("m-narrows-west", 26.4, 56.3, 2, 1),
    mine("m-gulf-turn", 26.2, 56.1, 0, 1),
    mine("m-tss-in", 26.38, 56.48, 2, 1),
  ];
  if (scenario === "one-transit") return base.slice(0, 3);
  if (scenario === "overplay") {
    return [
      ...base,
      mine("m-tss-east", 26.36, 56.56, 2, 1),
      mine("m-tss-mid", 26.33, 56.38, 1, 1),
    ];
  }
  return base;
}
