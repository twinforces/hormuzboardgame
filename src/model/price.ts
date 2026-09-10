/**
 * Simulated oil meter. Never fetches. Tests pin it.
 *
 * P is a USD/bbl-flavored teaching index around a 2024 Brent ~$80 zero.
 * The HISTORY table in balance.ts is the correlation, not an input.
 */

import { PRICE } from "./balance.ts";
import { radiusNm } from "./balance.ts";
import type { GameState, PriceComponents } from "./types.ts";

export function priceComponents(state: Pick<
  GameState,
  "mines" | "insurance" | "waitingHulls" | "exits" | "hullFactor" | "contracts" | "tankerAlive"
>): PriceComponents {
  const mineFog = state.mines.reduce((n, m) => n + (m.radiusSteps + 1), 0);
  const mines = mineFog * PRICE.perMineStep;
  const insurance = state.insurance === "collapsed" ? PRICE.insuranceCollapsed : 0;
  const waiting = state.waitingHulls * PRICE.waitingHull;
  const kill = !state.tankerAlive && state.hullFactor === 0 ? PRICE.killSpike : 0;
  const flow = -state.exits * PRICE.exitRelief;
  const contracts = -state.contracts.value * PRICE.contractsRelief;
  return {
    baseline: PRICE.baseline,
    mines,
    insurance,
    waiting,
    flow,
    kill,
    contracts,
  };
}

export function sumPrice(parts: PriceComponents): number {
  const pressure =
    parts.baseline +
    parts.mines +
    parts.insurance +
    parts.waiting +
    parts.kill +
    parts.contracts;
  const capped = Math.min(PRICE.max, Math.max(PRICE.min, pressure));
  return Math.round(Math.max(PRICE.min, Math.min(PRICE.max, capped + parts.flow)));
}

export function tickPrice(state: GameState): GameState {
  const parts = priceComponents(state);
  return { ...state, price: sumPrice(parts), priceComponents: parts };
}
