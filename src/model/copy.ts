/**
 * Player-facing strings. No em-dashes. Teaching beats live here so the
 * View cannot freelance a Hollywood carrier charge.
 */

import type { LossReport, ScenarioId, TurnReport } from "./types.ts";
import { COMPANY, fogEstimate } from "./balance.ts";

export const COPY = {
  runOmani: "US door, Omani corridor",
  runToll: "Iran door, pay the toll",
  wait: "Wait in the queue",
  waitHint: "Sit a night. Each leftover hull is $2M idle.",
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
    "Freight is the taxi. Trader bonus is the get-it-out bid when oil is fat. Idle is Oman-China you skipped, about $2M a hull a week. You still do not own the barrels.",
  policyBuy: "Buy war-risk for this hull",
  policyGone: "Underwriters walked. Cover is gone.",
  policyHint:
    "Check this before a door. Cover pays the hull if a mine hits. Families still sit on you. One boom kills the paper for the sitting.",
  mineKill: "mine kill",
  killHintOmani: "Mine kill on the US ribbon. Escort cuts boats, not devices.",
  killHintIran: "Iran did not mine its till. Pay is a promise they will not shoot. Mines still sit in the TSS, and they drift.",
  shotKill: "shot",
  lossTitle: "Hull gone",
  lossClose: "Read the books",
  lossMine:
    "That percent is mine kill on the track you picked. A device listened. Not a missile volley. Not an escort failing.",
  lossOmani: "The US ribbon is a sweep, not a destroyer beside you.",
  lossTollPaid: "You paid the IRGC. Boats waved. The mine did not. Pay does not sweep, mines drift.",
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
  waited: "Still in the queue. Idle booked. Navy sank minelayers. Iran seeded the TSS.",
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
  navyPunched: "Minelayers sunk",
  fogBlobs: "Fog blobs",
  holesOpen: "Sweeps",
  navyNote:
    "Green is this week's sweep. Red is unswept fog. Red does not sit inside green. Escort cuts the shot, not the mine.",
  sittingTitle: "This sitting",
  accountant: "Accountants",
  ceo: "CEO",
  accountantSit: "Sit. Expected is negative.",
  ceoWait: "Wait. Mine and shot are still hot.",
  ceoOmani: "Omani. Risk is low enough. We do not pay.",
  accountantNote: "Accountants still count EV. Tolls buy mines. We do not pay.",
  scenarioHelp: "Which sitting? Pick one. Weeks count. No clock.",
  scenarioReopen: "Twelve hulls. Wait the Navy, or pay and make the mines someone else's problem.",
  scenarioOne: "One hull. Idle still ticks. Send it when expected is fat.",
  scenarioOverplay: "Five hulls. Packed ribbon. Navy sweeps three patches a week. Red remains.",
  scenarioMine:
    "You are US. One hundred hulls, ten companies. Some count EV. Some wait for a sweep. Strike a yellow mark or sweep the ribbon.",
  scenarioAsk: "Which sitting?",
  tabIran: "Strikes",
  tabStrait: "Strait",
  usSweep: "Sweep the ribbon",
  usStrike: "Strike",
  strikeMarks: "Yellow marks. Hover, then click to strike.",
  magDrones: "Drones",
  magCounter: "Counter-drones",
  magLasers: "Lasers",
  magMines: "Mines",
  magBoats: "Boats",
  nodeDown: "Down",
  warHint: "Click a yellow mark to strike, or sweep the ribbon. Traffic moves after you act.",
  warLock:
    "You are US. One hundred hulls. Ten companies. Some count EV. Some wait for a sweep. Once the till is the hotter mine field, they flip.",
  trafficBooks: "Traffic",
  trafficNote: "One hundred traffic hulls, ten companies. You do not own them. Tolls still buy mines.",
  trafficWait: "Traffic sat.",
  trafficLive: "TRAFFIC LIVE",
  trafficGraze: "TRAFFIC GRAZED",
  trafficLost: "TRAFFIC LOST",
  outcomeCloseWar: "See the strait",
  outcomeBackStrikes: "Back to strikes",
  openStrait: "Open the strait",
  laneChip: "Lane",
  factoryPrints: "Mine factory still prints.",
  factoryDown: "Mine factory is down.",
  droneFactoryPrints: "Drone factory still prints.",
  droneFactoryDown: "Drone factory is down.",
  warehouseDown: "Mine warehouse is down.",
  droneWarehouseDown: "Drone warehouse is down.",
  radarDown: "Radar is down.",
  portDown: "Port is down.",
  spiderHole: "Spider hole",
  spiderTip: "Hidden mines and drones. Strike this week or they dump.",
  spiderDump: "The hole dumped mines into the TSS. Drones hit a Gulf state. Fear, not occupation.",
  matchOverHint: "Out of hulls. Replay or take a new seed.",
  scoreTitle: "Out of hulls",
  scoreReplay: "Replay this sitting",
  scoreFresh: "New seed",
  scoreClose: "Keep reading the books",
  chartLoading: "Chart loading",
  outcomeWait: "You sat.",
  outcomeLive: "SUCCESS",
  outcomeGraze: "SUCCESS, with damage",
  outcomeClose: "Next hull",
  booksDamage: "Damage",
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
  mineHole: "Navy sweep",
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
  "mine-warfare": { label: "Mine warfare", blurb: COPY.scenarioMine },
};

/** Twelve leftover hulls times $2M is $24M. Not a flat $2M sit. */
export function idleChargeLine(
  hulls: number,
  per = COMPANY.idleUsdMPerHull,
): string {
  if (hulls <= 0) return "No leftover hulls.";
  return `${hulls} leftover × $${per}M = $${hulls * per}M this week.`;
}

export function clickToStrike(label: string): string {
  return `Click to strike ${label}`;
}

export function usStrikeLine(opts: {
  turn: number;
  target: string;
  already: boolean;
  mineFactoryUp?: boolean;
  droneFactoryUp?: boolean;
}): string {
  if (opts.already) return `Week ${opts.turn}: ${opts.target} is already down.`;
  if (opts.target === "mine-factory") {
    return `Week ${opts.turn}: US struck the mine factory. The roof is gone.`;
  }
  if (opts.target === "drone-factory") {
    return `Week ${opts.turn}: US struck the drone factory. Shahed output goes toward zero.`;
  }
  if (opts.target === "mine-warehouse") {
    return `Week ${opts.turn}: US struck the mine warehouse. Ready mines are cut.`;
  }
  if (opts.target === "drone-warehouse") {
    return `Week ${opts.turn}: US struck the drone warehouse. Ready air is cut.`;
  }
  if (opts.target === "radar") {
    const leftover = opts.droneFactoryUp === false ? "" : " The drone plant still prints.";
    return `Week ${opts.turn}: US struck coastal radar. Drones guess. Mines still drift.${leftover}`;
  }
  if (opts.target === "spider-hole") {
    return `Week ${opts.turn}: US struck a spider hole. Hidden stores are gone.`;
  }
  const leftover = opts.mineFactoryUp === false ? "" : " The mine plant still prints.";
  return `Week ${opts.turn}: US struck the port. Pierside hulls are scrap. A spider hole showed itself.${leftover}`;
}

export function spiderRevealLine(opts: {
  turn: number;
  mines: number;
  drones: number;
}): string {
  const mines = Math.max(0, Math.round(opts.mines));
  const drones = Math.max(0, Math.round(opts.drones));
  return `Week ${opts.turn}: A hull got hit. A spider hole showed ${mines} mines and ${drones} drones. Strike it this week or they dump.`;
}

export function spiderTipLine(h: { mines: number; drones: number }): string {
  const mines = Math.max(0, Math.round(h.mines));
  const drones = Math.max(0, Math.round(h.drones));
  return `Hidden stash: ${mines} mines, ${drones} drones. Strike this week or they dump.`;
}

export function spiderDumpLine(opts: {
  turn: number;
  mines: number;
  drones?: number;
}): string {
  const n = Math.max(0, Math.round(opts.mines));
  const word = n === 1 ? "mine" : "mines";
  const d = Math.max(0, Math.round(opts.drones ?? 0));
  const air =
    d <= 0
      ? "No extra air this week"
      : d === 1
        ? "1 drone hit a Gulf state"
        : `${d} drones hit a Gulf state`;
  return `Week ${opts.turn}: The hole dumped ${n} ${word} into the TSS. ${air}. Fear, not occupation.`;
}

export function usSweepLine(opts: {
  turn: number;
  layers: number;
  nm2: number;
}): string {
  if (opts.layers <= 0) {
    return `Week ${opts.turn}: US Navy escorts held the Omani ribbon. No new minelayers in the south.`;
  }
  const ships = opts.layers === 1 ? "minelayer" : "minelayers";
  return `Week ${opts.turn}: US Navy sank ${opts.layers} ${ships}. Sweepers cleared ${opts.nm2} nm² of the southern lane.`;
}

export function iranSeedLine(opts: {
  turn: number;
  laid: number;
  shot: "none" | "miss" | "graze" | "kill";
}): string {
  const seed =
    opts.laid <= 0
      ? `Week ${opts.turn}: Iran's mine pool was empty.`
      : `Week ${opts.turn}: Iran seeded ${opts.laid} mine${opts.laid === 1 ? "" : "s"} in the TSS.`;
  if (opts.shot === "miss") return `${seed} Shot at a tanker and missed.`;
  if (opts.shot === "graze") return `${seed} Shot hit. Light damage. The hull lived.`;
  if (opts.shot === "kill") return `${seed} Shot holed a hull. Rare. Ugly.`;
  return `${seed} Pay is a promise they will not shoot. It does not sweep, mines drift.`;
}

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
    return "The paper is dead. Hull factor is 0 or 1. Escorts cut boats, not mines. Sit unless the trader bonus covers a naked hull.";
  }
  if (b.omaniEv < 0 && b.holeCount > 0) {
    return `Sweeps are patches, not a clean lane. Omani is still ${b.omaniPct}% mine kill. Expected is negative. Sit. Do not pay.`;
  }
  if (b.omaniEv < 0) {
    return `Do not pay. Omani is ${b.omaniPct}% mine kill. Wait. We sink minelayers. Trader bonus is not enough yet.`;
  }
  if (b.holeCount > 0) {
    return `Omani door is ${b.omaniPct}% mine kill tonight. The trader is paying up. Sweep is in. Do not pay.`;
  }
  if (b.waiting > 0) {
    return `Queue is ${b.waiting} hulls. Escorts are on station. Toll still funds the IRGC.`;
  }
  return `Do not pay. Omani door is ${b.omaniPct}% mine kill. Wait. We sink minelayers. The toll buys the next seed.`;
}

export function iranBrief(b: BriefInput): string {
  if (b.insurance === "collapsed") {
    return "Insurance is a Western habit. We still sell a wave. Pay and we do not shoot. The device still listens.";
  }
  if (b.paidLast) {
    return "The dollars landed. We did not shoot. The mines did not move. Come again.";
  }
  if (b.holeCount > 0) {
    return `They swept fog, not mines. Iran door is ${b.iranPct}% mine kill. Pay and we do not shoot.`;
  }
  return `Pay. We do not shoot the ones who pay. We cannot promise the mine. Omani is ${b.omaniPct}% mine kill.`;
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
  minesBought: number;
  omaniSent: number;
  iranSent: number;
  netUsdM: number;
  price: number;
  seat?: "tanker" | "us";
  factoryUp?: boolean;
  droneFactoryUp?: boolean;
  warehouseUp?: boolean;
  droneWarehouseUp?: boolean;
  radarUp?: boolean;
  portUp?: boolean;
};

export function scoreLines(s: ScoreInput): string[] {
  const mines = Math.max(0, Math.round(s.minesBought));
  const mineWord = mines === 1 ? "mine" : "mines";
  if (s.seat === "us") {
    const lines = [
      `Week ${s.weeks}. Oil $${s.price}. Peak on this meter is $126.`,
      `Traffic live ${s.live}. Lost ${s.lost}.`,
    ];
    if (s.tollUsdM > 0) {
      lines.push(
        `Traffic spent $${Math.round(s.tollUsdM)}M in tolls, buying Iran ${mines} ${mineWord}.`,
      );
    } else {
      lines.push("Traffic spent $0 in tolls. Nobody bought their next mine.");
    }
    lines.push(s.factoryUp === false ? COPY.factoryDown : COPY.factoryPrints);
    if (s.droneFactoryUp === false) lines.push(COPY.droneFactoryDown);
    if (s.warehouseUp === false) lines.push(COPY.warehouseDown);
    if (s.droneWarehouseUp === false) lines.push(COPY.droneWarehouseDown);
    if (s.radarUp === false) lines.push(COPY.radarDown);
    if (s.portUp === false) lines.push(COPY.portDown);
    return lines;
  }
  const net = Math.round(s.netUsdM);
  const netLabel = net < 0 ? `-$${Math.abs(net)}M` : `$${net}M`;
  const lines = [
    `Week ${s.weeks}. Oil $${s.price}. Peak on this meter is $126.`,
    `Live ${s.live}. Lost ${s.lost}.`,
    `Freight $${Math.round(s.freightUsdM)}M.`,
    `Traders paid you a bonus of $${Math.round(s.bonusUsdM)}M.`,
    `Idle $${Math.round(s.idleUsdM)}M.`,
  ];
  if (s.tollUsdM > 0) {
    lines.push(
      `You spent $${Math.round(s.tollUsdM)}M in tolls, buying Iran ${mines} ${mineWord}.`,
    );
  } else {
    lines.push("You spent $0 in tolls. You did not buy their next mine.");
  }
  lines.push(`Net ${netLabel}.`);
  if (s.iranSent > 0 && s.omaniSent === 0) {
    lines.push("You used the Iran till. The mines stayed someone else's problem.");
  } else if (s.iranSent > 0) {
    lines.push("You mixed doors. Every toll still bought a mine.");
  } else {
    lines.push("You waited the Navy and took the Omani ribbon.");
  }
  return lines;
}

export function outcomeTitle(r: TurnReport): string {
  if (r.watcher === "us") {
    if (r.kind === "wait") return COPY.trafficWait;
    if (r.kind === "graze") return COPY.trafficGraze;
    if (r.kind === "lost") return COPY.trafficLost;
    return COPY.trafficLive;
  }
  if (r.kind === "wait") return COPY.outcomeWait;
  if (r.kind === "graze") return COPY.outcomeGraze;
  if (r.kind === "lost") return COPY.lossTitle;
  return COPY.outcomeLive;
}

export function outcomeLines(r: TurnReport): string[] {
  if (r.watcher === "us") {
    const lines: string[] = [];
    if (r.wave) {
      lines.push(
        `${r.wave.sent} sailed. ${r.wave.waited} sat. Paid ${r.wave.paid}. Oman ${r.wave.omani}. Live ${r.wave.live}. Lost ${r.wave.lost}.`,
      );
      if (r.wave.paid > 0) {
        const n = Math.max(1, Math.round(r.minesBought));
        const word = n === 1 ? "mine" : "mines";
        lines.push(
          `Tolls $${Math.round(r.tollUsdM)}M bought Iran ${n} ${word}.`,
        );
      }
    } else if (r.kind === "wait") {
      lines.push("Traffic sat the ribbon.");
    } else if (r.kind === "lost") {
      const how = r.cause === "shot" ? "A shot holed a hull." : "A mine listened.";
      lines.push(`A traffic hull is gone. ${how}`);
      if (r.paid) {
        const n = Math.max(1, Math.round(r.minesBought));
        const word = n === 1 ? "mine" : "mines";
        lines.push(
          `They paid $${Math.round(r.tollUsdM)}M. That bought Iran ${n} ${word}.`,
        );
      }
    } else {
      const door = r.door === "iran" ? "Iran door" : "Omani door";
      lines.push(`A hull took the ${door}.`);
      if (r.paid) {
        const n = Math.max(1, Math.round(r.minesBought));
        const word = n === 1 ? "mine" : "mines";
        lines.push(
          `They paid $${Math.round(r.tollUsdM)}M. That bought Iran ${n} ${word}.`,
        );
      }
      if (r.damageUsdM > 0) {
        lines.push(`Light damage $${Math.round(r.damageUsdM)}M. The hull lived.`);
      }
    }
    lines.push(r.usLine);
    lines.push(r.iranLine);
    lines.push(
      `Omani mine risk is now ${r.omaniMinePct}%. Shot ${r.omaniShotPct}%. Iran mine ${r.iranMinePct}%.`,
    );
    return lines;
  }
  const net = Math.round(r.netDeltaUsdM);
  const netLabel = net < 0 ? `-$${Math.abs(net)}M` : `$${net}M`;
  const lines: string[] = [];
  if (r.kind === "wait") {
    lines.push(`Idle $${Math.round(r.idleUsdM)}M. You did not send a hull.`);
  } else if (r.kind === "lost") {
    const how = r.cause === "shot" ? "A shot holed you." : "A mine listened.";
    lines.push(`Hull gone. ${how}`);
    if (r.paid) {
      const n = Math.max(1, Math.round(r.minesBought));
      const word = n === 1 ? "mine" : "mines";
      lines.push(
        `You spent $${Math.round(r.tollUsdM)}M in tolls, buying Iran ${n} ${word}. Pay does not sweep, mines drift.`,
      );
    }
  } else {
    lines.push(`You made ${netLabel} net.`);
    lines.push(`Freight $${Math.round(r.freightUsdM)}M.`);
    if (r.bonusUsdM > 0) {
      lines.push(`Traders paid you a bonus of $${Math.round(r.bonusUsdM)}M.`);
    }
    if (r.tollUsdM > 0) {
      const n = Math.max(1, Math.round(r.minesBought));
      const word = n === 1 ? "mine" : "mines";
      lines.push(
        `You spent $${Math.round(r.tollUsdM)}M in tolls, buying Iran ${n} ${word}.`,
      );
    }
    if (r.damageUsdM > 0) {
      lines.push(`Light damage $${Math.round(r.damageUsdM)}M. The hull lived.`);
    }
  }
  lines.push(r.usLine);
  lines.push(r.iranLine);
  lines.push(
    `Omani mine risk is now ${r.omaniMinePct}%. Shot ${r.omaniShotPct}%.`,
  );
  return lines;
}

