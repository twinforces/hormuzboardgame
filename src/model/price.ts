/**
 * Simulated oil meter. Never fetches. Tests pin it.
 *
 * P is a USD/bbl-flavored teaching index around a 2024 Brent ~$80 zero.
 * The HISTORY table in balance.ts is the correlation, not an input.
 */

import { PRICE } from "./balance.ts";
import { humanSeat } from "./scenarios.ts";
import type { GameState, PriceComponents, ScenarioId } from "./types.ts";

/** US traffic is ten hulls a week. Ten live exits equal one tanker-house hull. */
export function priceHullScale(scenario: ScenarioId): number {
  return humanSeat(scenario) === "tanker" ? 1 : PRICE.usFlowHulls;
}

export function priceComponents(state: Pick<
  GameState,
  | "mines"
  | "insurance"
  | "waitingHulls"
  | "exits"
  | "hullFactor"
  | "contracts"
  | "tankerAlive"
  | "gulfHits"
  | "scenario"
>): PriceComponents {
  const scale = priceHullScale(state.scenario);
  const mineFog = state.mines.reduce((n, m) => n + (m.radiusSteps + 1), 0);
  const mines = mineFog * PRICE.perMineStep;
  const insurance = state.insurance === "collapsed" ? PRICE.insuranceCollapsed : 0;
  const waiting = (state.waitingHulls * PRICE.waitingHull) / scale;
  const kill = !state.tankerAlive && state.hullFactor === 0 ? PRICE.killSpike : 0;
  const gulf = (state.gulfHits ?? 0) * PRICE.gulfDrone;
  const flow = -(state.exits * PRICE.exitRelief) / scale;
  const contracts = -state.contracts.value * PRICE.contractsRelief;
  return {
    baseline: PRICE.baseline,
    mines,
    insurance,
    waiting,
    flow,
    kill,
    gulf,
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
    parts.gulf +
    parts.contracts;
  const capped = Math.min(PRICE.max, Math.max(PRICE.min, pressure));
  return Math.round(Math.max(PRICE.min, Math.min(PRICE.max, capped + parts.flow)));
}

export function tickPrice(state: GameState): GameState {
  const parts = priceComponents(state);
  return { ...state, price: sumPrice(parts), priceComponents: parts };
}
