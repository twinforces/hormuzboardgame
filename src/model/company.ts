/**
 * Greece, Inc. books. A fleet, not one night. Freight is the taxi.
 * Trader bonus is the "get the barrels out" bid when oil is fat.
 * Oil is the trader's. A kill writes off the hull and pays the families.
 * A voyage policy can pay the hull back. Tolls and war-risk sit here.
 * Crew bonus sticks after blood.
 */

import { COMPANY, bandOf } from "./balance.ts";
import type {
  CompanyBooks,
  GameState,
  Insurance,
  ScenarioId,
} from "./types.ts";

export function emptyBooks(): CompanyBooks {
  return {
    hullsSent: 0,
    hullsLive: 0,
    hullsLost: 0,
    freightUsdM: 0,
    bonusUsdM: 0,
    hullWriteoffUsdM: 0,
    familyUsdM: 0,
    crewUsdM: 0,
    tollUsdM: 0,
    premiumUsdM: 0,
    recoverUsdM: 0,
    idleUsdM: 0,
  };
}

export function fleetSize(scenario: ScenarioId): number {
  return COMPANY.fleet[scenario];
}

export function hullsLeft(scenario: ScenarioId, b: CompanyBooks): number {
  return Math.max(0, fleetSize(scenario) - b.hullsSent);
}

export function idleThisWeek(scenario: ScenarioId, b: CompanyBooks): number {
  return COMPANY.idleUsdMPerHull * hullsLeft(scenario, b);
}

export function postIdle(b: CompanyBooks, usdM: number): CompanyBooks {
  return { ...b, idleUsdM: b.idleUsdM + usdM };
}

export function voyageFreightUsdM(price: number): number {
  return COMPANY.freightByBand[bandOf(price)];
}

export function voyageBonusUsdM(price: number): number {
  return COMPANY.traderBonusByBand[bandOf(price)];
}

export function voyagePayUsdM(price: number): number {
  return voyageFreightUsdM(price) + voyageBonusUsdM(price);
}

export function voyagePremiumUsdM(price: number, insurance: Insurance): number {
  if (insurance === "collapsed") return 0;
  return COMPANY.premiumByBand[bandOf(price)];
}

export function policyAvailable(insurance: Insurance): boolean {
  return insurance === "open";
}

export function captainsBalk(s: Pick<GameState, "crewSour">): boolean {
  return s.crewSour;
}

/** Expected value of sending a hull tonight. Crew only hits a live exit. Toll is paid either way. */
export function expectedVoyageUsdM(opts: {
  kill: number;
  payUsdM: number;
  crewUsdM: number;
  insured: boolean;
  premiumUsdM: number;
  tollUsdM?: number;
}): number {
  const k = Math.min(1, Math.max(0, opts.kill));
  const live = (1 - k) * (opts.payUsdM - opts.crewUsdM);
  const dead = opts.insured
    ? k * COMPANY.familyUsdM
    : k * (COMPANY.hullUsdM + COMPANY.familyUsdM);
  const prem = opts.insured ? opts.premiumUsdM : 0;
  const toll = opts.tollUsdM ?? 0;
  return live - dead - prem - toll;
}

export type AccountantDoor = "wait" | "omani" | "iran";

export type AccountantPick = {
  door: AccountantDoor;
  omaniEv: number;
  iranEv: number;
};

/**
 * Greece, Inc. accountants. US and Iran talk. This pick ignores them.
 * Wait if both doors have negative expected value, or captains balk.
 */
export function accountantPick(opts: {
  balk: boolean;
  omaniKill: number;
  iranKill: number;
  payUsdM: number;
  crewUsdM: number;
  insured: boolean;
  premiumUsdM: number;
  tollUsdM: number;
  idleUsdM: number;
}): AccountantPick {
  const shared = {
    payUsdM: opts.payUsdM,
    crewUsdM: opts.crewUsdM,
    insured: opts.insured,
    premiumUsdM: opts.premiumUsdM,
  };
  const omaniEv = expectedVoyageUsdM({ ...shared, kill: opts.omaniKill });
  const iranEv = expectedVoyageUsdM({
    ...shared,
    kill: opts.iranKill,
    tollUsdM: opts.tollUsdM,
  });
  const best = Math.max(omaniEv, iranEv);
  if (opts.balk || best <= -opts.idleUsdM) {
    return { door: "wait", omaniEv, iranEv };
  }
  if (iranEv > omaniEv) return { door: "iran", omaniEv, iranEv };
  return { door: "omani", omaniEv, iranEv };
}

export function netUsdM(b: CompanyBooks): number {
  return (
    b.freightUsdM +
    b.bonusUsdM +
    b.recoverUsdM -
    b.hullWriteoffUsdM -
    b.familyUsdM -
    b.crewUsdM -
    b.tollUsdM -
    b.premiumUsdM -
    b.idleUsdM
  );
}

export type VoyagePost = {
  live: boolean;
  freightUsdM?: number;
  bonusUsdM?: number;
  crewUsdM?: number;
  tollUsdM?: number;
  premiumUsdM?: number;
  recoverUsdM?: number;
};

export function postVoyage(b: CompanyBooks, v: VoyagePost): CompanyBooks {
  const tollUsdM = b.tollUsdM + (v.tollUsdM ?? 0);
  const premiumUsdM = b.premiumUsdM + (v.premiumUsdM ?? 0);
  if (v.live) {
    return {
      ...b,
      hullsSent: b.hullsSent + 1,
      hullsLive: b.hullsLive + 1,
      freightUsdM: b.freightUsdM + (v.freightUsdM ?? 0),
      bonusUsdM: b.bonusUsdM + (v.bonusUsdM ?? 0),
      crewUsdM: b.crewUsdM + (v.crewUsdM ?? 0),
      tollUsdM,
      premiumUsdM,
    };
  }
  return {
    ...b,
    hullsSent: b.hullsSent + 1,
    hullsLost: b.hullsLost + 1,
    hullWriteoffUsdM: b.hullWriteoffUsdM + COMPANY.hullUsdM,
    familyUsdM: b.familyUsdM + COMPANY.familyUsdM,
    recoverUsdM: b.recoverUsdM + (v.recoverUsdM ?? 0),
    tollUsdM,
    premiumUsdM,
  };
}
