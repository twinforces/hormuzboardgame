/**
 * Player-facing strings. No em-dashes. Teaching beats live here so the
 * View cannot freelance a Hollywood carrier charge.
 */

import type { LossReport, ScenarioId } from "./types.ts";
import { fogEstimate } from "./balance.ts";

export const COPY = {
  runOmani: "US door, Omani corridor",
  runToll: "Iran door, pay the toll",
  wait: "Wait in the queue",
  waitHint: "Sit a night. Idle hits the books. Fog still moves.",
  reset: "New seed",
  debug: "Debug overlay",
  payWarning: "Toll is a wave, not a sweep. TSS mines still exist.",
  steel: "STEEL  years, not turns",
  insuranceOpen: "INSURANCE OPEN",
  insuranceCollapsed: "INSURANCE COLLAPSED",
  doorHint:
    "Click the US ribbon near Oman, or the Iran track between Qeshm and Larak. Sit if expected is negative. Captains balk after blood.",
  roleLock:
    "Greece, Inc. Accountants pick the door. If expected is positive, go. Captains still balk after blood.",
  roleTanker: "Owner",
  houseName: "Greece, Inc.",
  roleUs: "US",
  roleIran: "Iran",
  roleYou: "you",
  roleNext: "talking",
  booksFreight: "Freight",
  booksBonus: "Trader bonus",
  booksHulls: "Hull writeoff",
  booksFamilies: "Families",
  booksCrew: "Crew bonus",
  booksQuote: "This voyage",
  booksNet: "Net",
  booksSent: "Hulls sent",
  booksLive: "Live exits",
  booksLost: "Lost",
  booksLeft: "Hulls left",
  booksToll: "Tolls",
  booksPremium: "War-risk",
  booksRecover: "Policy paid",
  booksIdle: "Idle",
  booksNote:
    "Freight is the taxi. Trader bonus is the get-it-out bid when oil is fat. Idle is hulls on the beach. You still do not own the barrels.",
  policyBuy: "Buy war-risk for this hull",
  policyGone: "Underwriters walked. Cover is gone.",
  policyHint:
    "Check this before a door. Cover pays the hull if a mine hits. Families still sit on you. One boom kills the paper for the sitting.",
  mineKill: "mine kill",
  killHintOmani: "Mine kill on the US ribbon. Not an escort.",
  killHintIran: "Iran did not mine its till. Mines sit in the TSS. Pay waves boats.",
  lossTitle: "Hull gone",
  lossClose: "Read the books",
  lossMine:
    "That percent is mine kill on the track you picked. A device listened. Not a missile volley. Not an escort failing.",
  lossOmani: "The US ribbon is a rented hole, not a destroyer beside you.",
  lossTollPaid: "You paid the IRGC. Boats waved. The mine did not. Pay does not sweep.",
  lossCovered:
    "War-risk paid the hull. Families still sit on you. Cargo was the trader's. The lane's paper died. Next hulls go naked.",
  lossNaked:
    "No policy. Hull writeoff plus families. Cargo was the trader's.",
  orientation:
    "North is Iran. The water in the middle is the strait. Musandam is Oman. Fujairah is the around-Hormuz door.",
  photoCredit:
    "Sentinel-2 cloudless 2024 by EOX. Contains modified Copernicus Sentinel data. CC BY 4.0. Same crop as the old Blue Marble. Photo is scenery. Overlay is the game.",
  notLive:
    "Price P is a seeded teaching index in USD/bbl flavor. It is not a live EIA tick.",
  minesGrow: "Mines drift. The uncertainty blob grows every turn.",
  tssNote:
    "Two nautical mile lanes, two nautical mile buffer. Six miles of usable corridor. Navy Decoded flavor, 21 nm at the narrows.",
  fujairah: "Fujairah is the around-Hormuz door. Petroline dumps on the Red Sea, not into Asia.",
  matchOver: "Sitting over. Read the books, not the smoke.",
  dead: "Hull gone. Ship plus families. Insurance does not do partials after a TSS mine kill.",
  lived: "Live exit. Freight and trader bonus booked. Hull factor 1.",
  waited: "Still in the queue. Idle booked. US punches. Iran lays.",
  collapsedNow: "One boom in the lane. Insurance collapsed for the rest of the match.",
  cargoNotYours:
    "Cargo was never yours. The trader ate $150M. That is why the paper dies.",
  crewBonusNow: "Crew bonus sticks. Next voyages pay danger money.",
  balk: "Captains refuse. Wait a turn after blood or they stay tied.",
  noHulls: "Out of hulls. Read the books.",
  usDoorNote: "Dashed blue is the US ribbon on the Omani side.",
  iranDoorNote: "Qeshm to Larak is the till. They did not mine their own cash register.",
  omaniDoor: "US",
  iranDoor: "IRAN",
  navyPunched: "Navy punched",
  fogBlobs: "Fog blobs",
  holesOpen: "Holes open",
  navyNote:
    "Green is this week's sweep. Red is unswept fog. Red does not sit inside green.",
  sittingTitle: "This sitting",
  accountant: "Accountants",
  accountantSit: "Sit. Expected is negative.",
  scenarioHelp: "A kit: hulls and fog. Weeks just count. Same two doors.",
  scenarioReopen: "Five hulls. Idle if you sit. Peak oil is the 2026 high, not a lottery.",
  scenarioOne: "One hull. Idle still ticks. Send it when expected is fat.",
  scenarioOverplay: "Five hulls. Packed ribbon. Navy punches three holes a week. Red remains.",
  matchOverHint: "Out of hulls. Replay or take a new seed.",
  scoreTitle: "Out of hulls",
  scoreReplay: "Replay this sitting",
  scoreFresh: "New seed",
  scoreClose: "Keep reading the books",
  lastBeatIdle: "Accountants named a door. Click it or sit.",
  boardActWait: "Sit. Expected is negative.",
  boardActSit: "Sit. Expected is negative.",
  boardActOmani: "Omani. Expected is positive.",
  boardActIran: "Iran. Expected is positive.",
  boardActBalk: "Captains refuse. Wait.",
  boardActNone: "Sitting over.",
  clickOmani: "US ribbon, Omani side",
  clickIran: "Iran track, Qeshm to Larak",
  hullYou: "YOUR HULL",
  hullWait: "WAITING",
  hullDead: "HULL GONE",
  hullExit: "LIVE EXIT",
  mineEst: "Mines est",
  mineFog: "Fog",
  mineHole: "Navy hole",
  mineSwept: "Swept this week",
  mineListen: "Fog returns when the hole expires",
} as const;

export const SCENARIO_KIT: Record<
  ScenarioId,
  { label: string; blurb: string }
> = {
  "reopen-lane": { label: "Reopen the lane", blurb: COPY.scenarioReopen },
  "one-transit": { label: "One transit", blurb: COPY.scenarioOne },
  overplay: { label: "Packed TSS", blurb: COPY.scenarioOverplay },
};

export function fogTip(m: {
  radiusSteps: number;
  hole: null | { radiusNm: number };
}): string[] {
  const intel = fogEstimate(m);
  const lines = [`${COPY.mineEst} ${intel.est}`, `${COPY.mineFog} ${intel.fogNm} nm`];
  if (intel.holeNm != null) {
    lines.push(`${COPY.mineHole} ${intel.holeNm} nm`);
    lines.push(COPY.mineSwept);
  }
  return lines;
}

export const BAND_LABEL = {
  cheap: "CHEAP",
  tolerable: "TOLERABLE",
  high: "HIGH",
  panic: "PANIC",
} as const;

export type BriefInput = {
  turn: number;
  omaniPct: number;
  iranPct: number;
  insurance: "open" | "collapsed";
  holeCount: number;
  paidLast: boolean;
  waiting: number;
  omaniEv: number;
};

export function usBrief(b: BriefInput): string {
  if (b.insurance === "collapsed") {
    return "The paper is dead. Hull factor is 0 or 1. We still will not put a destroyer beside you. Sit unless the trader bonus covers a naked hull.";
  }
  if (b.omaniEv < 0 && b.holeCount > 0) {
    return `Holes are rented, not swept. Omani is still ${b.omaniPct}% mine kill. Expected is negative. Sit. Do not pay.`;
  }
  if (b.omaniEv < 0) {
    return `Do not pay. Omani is ${b.omaniPct}% before we punch. Wait. We rent a hole. Trader bonus is not enough yet.`;
  }
  if (b.holeCount > 0) {
    return `Omani door is ${b.omaniPct}% tonight. The trader is paying up. A hole is rented. Do not pay.`;
  }
  if (b.waiting > 0) {
    return `Queue is ${b.waiting} hulls. We punch on the wait. Toll still funds the IRGC.`;
  }
  return `Do not pay. Omani door is ${b.omaniPct}% before we punch. Wait. We rent a hole. The toll buys the next lay.`;
}

export function iranBrief(b: BriefInput): string {
  if (b.insurance === "collapsed") {
    return "Insurance is a Western habit. We still sell a wave. Pay and we look the other way. The device still listens.";
  }
  if (b.paidLast) {
    return "The dollars landed. The mines did not move. Come again.";
  }
  if (b.holeCount > 0) {
    return `They punched fog, not mines. Iran door is ${b.iranPct}%. Pay and we wave. The Omani ribbon is still a trap.`;
  }
  return `Pay. We wave the ones who pay. Omani is ${b.omaniPct}% and we did not agree to a hole. Insurance is paper.`;
}

export function lossLines(r: LossReport): string[] {
  const door = r.door === "iran" ? "Iran door" : "Omani door";
  const lines = [
    `${door}. Mine kill was ${r.killPct}%. ${COPY.lossMine}`,
    r.door === "iran" ? COPY.lossTollPaid : COPY.lossOmani,
    r.insured ? COPY.lossCovered : COPY.lossNaked,
    `Hull $${r.hullUsdM}M. Families $${r.familyUsdM}M. Cargo $${r.cargoUsdM}M was never yours.`,
  ];
  if (r.insured) {
    lines.push(`Policy paid $${r.recoverUsdM}M. Premium was $${r.premiumUsdM}M.`);
  }
  if (r.paid) {
    lines.push(`Toll $${r.tollUsdM}M still funded the next wave.`);
  }
  lines.push(COPY.balk);
  lines.push(COPY.crewBonusNow);
  return lines;
}

export type ScoreInput = {
  weeks: number;
  live: number;
  lost: number;
  freightUsdM: number;
  bonusUsdM: number;
  idleUsdM: number;
  tollUsdM: number;
  netUsdM: number;
  price: number;
};

export function scoreLines(s: ScoreInput): string[] {
  const net = Math.round(s.netUsdM);
  const netLabel = net < 0 ? `-$${Math.abs(net)}M` : `$${net}M`;
  return [
    `Week ${s.weeks}. Oil $${s.price}. Peak on this meter is $126.`,
    `Live ${s.live}. Lost ${s.lost}.`,
    `Freight $${Math.round(s.freightUsdM)}M. Trader bonus $${Math.round(s.bonusUsdM)}M.`,
    `Idle $${Math.round(s.idleUsdM)}M. Tolls $${Math.round(s.tollUsdM)}M.`,
    `Net ${netLabel}.`,
  ];
}
