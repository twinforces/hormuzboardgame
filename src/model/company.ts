/**
 * Greece, Inc. books. A fleet, not one night. Freight is the taxi.
 * Trader bonus is the "get the barrels out" bid when oil is fat.
 * Oil is the trader's. A kill writes off the hull and pays the families.
 * A voyage policy can pay the hull back. Tolls and war-risk sit here.
 * Crew bonus sticks after blood.
 */

import { ATTACK, CEO, COMPANY, bandOf } from "./balance.ts";
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
    damageUsdM: 0,
    omaniSent: 0,
    iranSent: 0,
    minesBought: 0,
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

/** Expected value of sending a hull tonight. Crew only hits a live exit. Toll is paid either way. Shot is boats, not the mine. */
export function expectedVoyageUsdM(opts: {
  kill: number;
  payUsdM: number;
  crewUsdM: number;
  insured: boolean;
  premiumUsdM: number;
  tollUsdM?: number;
  shot?: number;
  grazeUsdM?: number;
}): number {
  const mine = Math.min(1, Math.max(0, opts.kill));
  const shot = Math.min(1, Math.max(0, opts.shot ?? 0));
  const shotKill = shot * ATTACK.killWeight;
  const deadP = 1 - (1 - mine) * (1 - shotKill);
  const grazeP = (1 - mine) * shot * ATTACK.grazeWeight;
  const liveP = 1 - deadP;
  const live = liveP * (opts.payUsdM - opts.crewUsdM);
  const graze = grazeP * (opts.grazeUsdM ?? 0);
  const dead = opts.insured
    ? deadP * COMPANY.familyUsdM
    : deadP * (COMPANY.hullUsdM + COMPANY.familyUsdM);
  const prem = opts.insured ? opts.premiumUsdM : 0;
  const toll = opts.tollUsdM ?? 0;
  return live - graze - dead - prem - toll;
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
  omaniShot?: number;
  iranShot?: number;
  grazeUsdM?: number;
}): AccountantPick {
  const shared = {
    payUsdM: opts.payUsdM,
    crewUsdM: opts.crewUsdM,
    insured: opts.insured,
    premiumUsdM: opts.premiumUsdM,
    grazeUsdM: opts.grazeUsdM ?? 0,
  };
  const omaniEv = expectedVoyageUsdM({
    ...shared,
    kill: opts.omaniKill,
    shot: opts.omaniShot ?? 0,
  });
  const iranEv = expectedVoyageUsdM({
    ...shared,
    kill: opts.iranKill,
    shot: opts.iranShot ?? 0,
    tollUsdM: opts.tollUsdM,
  });
  const best = Math.max(omaniEv, iranEv);
  if (opts.balk || best <= -opts.idleUsdM) {
    return { door: "wait", omaniEv, iranEv };
  }
  if (iranEv > omaniEv) return { door: "iran", omaniEv, iranEv };
  return { door: "omani", omaniEv, iranEv };
}

/**
 * CEO pick. Accountants still count EV. This one never pays.
 * Wait until Omani mine and shot are both under the bar, then Oman.
 */
export function ceoPick(opts: {
  balk: boolean;
  omaniKill: number;
  omaniShot: number;
  waitingHulls: number;
}): AccountantDoor {
  if (opts.balk) return "wait";
  const mineOk = opts.omaniKill <= CEO.maxMine;
  const shotOk = opts.omaniShot <= CEO.maxShot;
  const tired = opts.waitingHulls >= CEO.maxWaitWeeks;
  if ((mineOk && shotOk) || tired) return "omani";
  return "wait";
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
    b.idleUsdM -
    b.damageUsdM
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
  damageUsdM?: number;
  omaniSent?: number;
  iranSent?: number;
  minesBought?: number;
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
      damageUsdM: b.damageUsdM + (v.damageUsdM ?? 0),
      omaniSent: b.omaniSent + (v.omaniSent ?? 0),
      iranSent: b.iranSent + (v.iranSent ?? 0),
      minesBought: b.minesBought + (v.minesBought ?? 0),
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
    omaniSent: b.omaniSent + (v.omaniSent ?? 0),
    iranSent: b.iranSent + (v.iranSent ?? 0),
    minesBought: b.minesBought + (v.minesBought ?? 0),
  };
}
