/**
 * MapSession. The View asks this object to pick a door, wait, and label.
 * It never constructs the sim engine itself beyond this factory.
 * Subscribe is the V<-VM wire. Commands notify. The View must not bump.
 * omani / toll / wait are the chart doors. Subscribe is the V<-VM wire.
 */

import { bandOf, COMPANY } from "../model/balance.ts";
import { humanSeat } from "../model/scenarios.ts";
import { COPY, BAND_LABEL, SCENARIO_KIT, idleChargeLine, iranBrief, usBrief } from "../model/copy.ts";
import {
  accountantPick,
  captainsBalk,
  hullsLeft,
  idleThisWeek,
  netUsdM,
  policyAvailable,
  voyagePayUsdM,
  voyagePremiumUsdM,
} from "../model/company.ts";
import {
  createEngine,
  iranPath,
  omaniPath,
  type DispatchResult,
  type Engine,
} from "../model/engine.ts";
import { flyingDrones } from "../model/ai.ts";
import { grazeUsdM, shotChance } from "../model/combat.ts";
import { combinedKillChance } from "../model/geo.ts";
import type { DebugSnapshot, GameState, ScenarioId, SpiderHole, StrikeTarget } from "../model/types.ts";

export type RecommendedDoor = "wait" | "omani" | "iran" | "none";

export type SessionLabels = {
  price: string;
  band: string;
  insurance: string;
  turn: string;
  phase: string;
  seed: string;
  payWarning: string;
  steel: string;
  hint: string;
  omaniKill: string;
  iranKill: string;
  omaniShot: string;
  iranShot: string;
  omaniPct: number;
  iranPct: number;
  omaniEv: string;
  iranEv: string;
  usBrief: string;
  iranBrief: string;
  usAct: string;
  iranAct: string;
  recommended: RecommendedDoor;
  canAct: boolean;
  navyPunched: string;
  fogBlobs: string;
  holesOpen: string;
  scenarioBlurb: string;
  lastBeat: string;
  boardAct: string;
  booksSent: string;
  booksLive: string;
  booksLost: string;
  booksLeft: string;
  booksFreight: string;
  booksBonus: string;
  booksHulls: string;
  booksFamilies: string;
  booksCrew: string;
  booksQuote: string;
  booksNet: string;
  booksHot: boolean;
  booksToll: string;
  booksPremium: string;
  booksRecover: string;
  booksIdle: string;
  booksDamage: string;
  idleWhy: string;
  houseName: string;
  balk: boolean;
  doorsOpen: boolean;
  policyOn: boolean;
  policyOpen: boolean;
  policyCost: string;
  seat: "us" | "tanker" | "iran";
  magDrones: string;
  magCounter: string;
  magLasers: string;
  magMines: string;
  magBoats: string;
  factoryUp: boolean;
  droneFactoryUp: boolean;
  warehouseUp: boolean;
  droneWarehouseUp: boolean;
  radarUp: boolean;
  portUp: boolean;
  spiderHoles: SpiderHole[];
  dumpedHoles: SpiderHole[];
};

export type SessionSnapshot = {
  version: number;
  state: GameState;
  labels: SessionLabels;
  error: string | null;
};

function pct(n: number): number {
  return Math.round(n * 100);
}

function usdM(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(Math.round(n))}M`;
}

function evUsd(n: number): string {
  const r = Math.round(n);
  if (r === 0) return "$0M";
  if (r > 0) return `+$${r}M`;
  return `-$${Math.abs(r)}M`;
}

export type MapSession = {
  state: () => GameState;
  debug: () => DebugSnapshot;
  error: () => string | null;
  omani: () => DispatchResult;
  toll: () => DispatchResult;
  wait: () => DispatchResult;
  usSweep: () => DispatchResult;
  usStrike: (target: StrikeTarget, pitId?: string) => DispatchResult;
  iranLay: () => DispatchResult;
  iranSurge: () => DispatchResult;
  iranHold: () => DispatchResult;
  setPolicy: (on: boolean) => DispatchResult;
  actRecommended: () => DispatchResult;
  reset: (seed?: number, scenario?: ScenarioId) => DispatchResult;
  labels: () => SessionLabels;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => SessionSnapshot;
};

function computeLabels(engine: Engine): SessionLabels {
  const s = engine.state();
  const sweep = omaniPath();
  const omani = combinedKillChance(sweep, s.mines, s.draftClass, sweep).chance;
  const iran = combinedKillChance(iranPath(), s.mines, s.draftClass, sweep).chance;
  const omaniShotP = shotChance({
    door: "omani",
    waitingHulls: s.waitingHulls,
    paid: false,
    radarAlive: s.industry.radarAlive,
    drones: flyingDrones(s),
    boats: s.iranPool.boats,
  });
  const iranShotP = shotChance({
    door: "iran",
    waitingHulls: s.waitingHulls,
    paid: true,
    radarAlive: s.industry.radarAlive,
    drones: flyingDrones(s),
    boats: s.iranPool.boats,
  });
  const holes = s.mines.filter((m) => m.hole).length;
  const omaniPct = pct(omani);
  const iranPct = pct(iran);
  const pay = voyagePayUsdM(s.price);
  const insured = s.buyPolicy && s.insurance === "open";
  const premium = voyagePremiumUsdM(s.price, s.insurance);
  const balk = captainsBalk(s);
  const pick = accountantPick({
    balk,
    omaniKill: omani,
    iranKill: iran,
    payUsdM: pay,
    crewUsdM: s.crewBonusUsdM,
    insured,
    premiumUsdM: premium,
    tollUsdM: COMPANY.tollUsdM,
    idleUsdM: idleThisWeek(s.scenario, s.books),
    omaniShot: omaniShotP,
    iranShot: iranShotP,
    grazeUsdM: grazeUsdM(s.price),
  });
  const brief = {
    turn: s.turn,
    omaniPct,
    iranPct,
    insurance: s.insurance,
    holeCount: holes,
    paidLast: s.tankerPaid,
    waiting: s.waitingHulls,
    omaniEv: pick.omaniEv,
  };
  const band = bandOf(s.price);
  const seat = humanSeat(s.scenario);
  const acting =
    s.phase === "tankerOrders" ||
    (seat === "us" && s.phase === "usOrders") ||
    (seat === "iran" && s.phase === "iranOrders");
  const left = hullsLeft(s.scenario, s.books);
  const recommended: RecommendedDoor = s.phase !== "tankerOrders" ? "none" : pick.door;
  const kit = SCENARIO_KIT[s.scenario];
  const resolveLine = [...s.log].reverse().find((line) => line.includes("Mine kill"));
  const lastBeat =
    seat === "us" || seat === "iran"
      ? !s.lastDoor
        ? seat === "iran"
          ? COPY.iranHint
          : COPY.warHint
        : `${s.lastUsLine} ${s.lastIranLine}`
      : !s.lastDoor
        ? COPY.lastBeatIdle
        : s.lastDoor === "wait"
          ? `${s.lastUsLine} ${s.lastIranLine}`
          : (resolveLine ?? s.log.at(-1) ?? COPY.lastBeatIdle);
  const boardAct =
    recommended === "wait"
      ? balk
        ? COPY.boardActBalk
        : COPY.accountantSit
      : recommended === "omani"
        ? `Omani. Expected ${evUsd(pick.omaniEv)}.`
        : recommended === "iran"
          ? `Iran. Expected ${evUsd(pick.iranEv)}.`
          : COPY.boardActNone;
  const quote = voyagePayUsdM(s.price);
  const policyOpen = policyAvailable(s.insurance);
  const policyCost = voyagePremiumUsdM(s.price, s.insurance);
  return {
    price: `$${s.price}`,
    band: BAND_LABEL[band],
    insurance: s.insurance === "open" ? COPY.insuranceOpen : COPY.insuranceCollapsed,
    turn: `Week ${s.turn}`,
    phase: s.phase,
    seed: `seed ${s.seed}`,
    payWarning: COPY.payWarning,
    steel: COPY.steel,
    hint:
      s.phase === "matchOver"
        ? COPY.matchOver
        : balk && seat !== "iran"
          ? COPY.balk
          : seat === "us"
            ? COPY.warHint
            : seat === "iran"
              ? COPY.iranHint
              : COPY.doorHint,
    omaniKill: `${omaniPct}%`,
    iranKill: `${iranPct}%`,
    omaniShot: `${pct(omaniShotP)}%`,
    iranShot: `${pct(iranShotP)}%`,
    omaniPct,
    iranPct,
    omaniEv: evUsd(pick.omaniEv),
    iranEv: evUsd(pick.iranEv),
    usBrief: usBrief(brief),
    iranBrief: iranBrief(brief),
    usAct: s.lastDoor ? s.lastUsLine : "",
    iranAct: s.lastDoor ? s.lastIranLine : "",
    recommended,
    canAct: acting,
    navyPunched: String(s.navyPulled),
    fogBlobs: String(s.mines.length),
    holesOpen: String(holes),
    scenarioBlurb: kit.blurb,
    lastBeat,
    boardAct,
    booksSent: String(s.books.hullsSent),
    booksLive: String(s.books.hullsLive),
    booksLost: String(s.books.hullsLost),
    booksLeft: String(left),
    booksFreight: usdM(s.books.freightUsdM),
    booksBonus: usdM(s.books.bonusUsdM),
    booksHulls: usdM(s.books.hullWriteoffUsdM),
    booksFamilies: usdM(s.books.familyUsdM),
    booksCrew: usdM(s.books.crewUsdM),
    booksQuote: usdM(quote),
    booksNet: usdM(netUsdM(s.books)),
    booksHot: netUsdM(s.books) < 0 || s.books.hullsLost > 0,
    booksToll: usdM(s.books.tollUsdM),
    booksPremium: usdM(s.books.premiumUsdM),
    booksRecover: usdM(s.books.recoverUsdM),
    booksIdle: usdM(s.books.idleUsdM),
    booksDamage: usdM(s.books.damageUsdM),
    idleWhy: idleChargeLine(left),
    houseName: seat === "us" ? COPY.roleUs : seat === "iran" ? COPY.roleIran : COPY.houseName,
    balk,
    doorsOpen: acting && !balk && left > 0 && seat === "tanker",
    policyOn: s.buyPolicy,
    policyOpen,
    policyCost: usdM(policyCost),
    seat,
    magDrones: String(s.iranPool.drones),
    magCounter: String(s.usPool.counterDrones),
    magLasers: String(s.usPool.lasers),
    magMines: String(s.iranPool.mines),
    magBoats: String(s.iranPool.boats),
    factoryUp: s.industry.mineFactoryAlive,
    droneFactoryUp: s.industry.droneFactoryAlive,
    warehouseUp: s.industry.mineDepotAlive,
    droneWarehouseUp: s.industry.droneDepotAlive,
    radarUp: s.industry.radarAlive,
    portUp: s.industry.portAlive,
    spiderHoles: s.spiderHoles.filter((h) => h.alive),
    dumpedHoles: s.spiderHoles.filter(
      (h) => !h.alive && h.dumpedTurn != null && s.turn <= h.dumpedTurn + 1,
    ),
  };
}

function inputPhase(phase: GameState["phase"]): boolean {
  return (
    phase === "tankerOrders" ||
    phase === "usOrders" ||
    phase === "iranOrders" ||
    phase === "matchOver"
  );
}

export function createSession(
  seed = 1,
  scenario: ScenarioId = "reopen-lane",
): MapSession {
  let engine: Engine = createEngine(seed, scenario);
  let lastError: string | null = null;
  const listeners = new Set<() => void>();
  let snap: SessionSnapshot = {
    version: 0,
    state: engine.state(),
    labels: computeLabels(engine),
    error: null,
  };

  function publish() {
    snap = {
      version: snap.version + 1,
      state: engine.state(),
      labels: computeLabels(engine),
      error: lastError,
    };
    for (const fn of listeners) fn();
  }

  function run(dispatch: () => DispatchResult): DispatchResult {
    const r = dispatch();
    lastError = r.ok ? null : r.reason;
    publish();
    return r;
  }

  return {
    state: () => engine.state(),
    debug: () => engine.debug(),
    error: () => lastError,
    omani() {
      return run(() => engine.dispatch({ type: "tanker-omani" }));
    },
    toll() {
      return run(() => engine.dispatch({ type: "tanker-toll" }));
    },
    wait() {
      return run(() => engine.dispatch({ type: "tanker-wait" }));
    },
    usSweep() {
      return run(() => engine.dispatch({ type: "us-sweep" }));
    },
    usStrike(target: StrikeTarget, pitId?: string) {
      return run(() => engine.dispatch({ type: "us-strike", target, pitId }));
    },
    iranLay() {
      return run(() => engine.dispatch({ type: "iran-lay" }));
    },
    iranSurge() {
      return run(() => engine.dispatch({ type: "iran-surge" }));
    },
    iranHold() {
      return run(() => engine.dispatch({ type: "iran-hold" }));
    },
    setPolicy(on: boolean) {
      return run(() => engine.dispatch({ type: "tanker-policy", on }));
    },
    actRecommended() {
      const rec = snap.labels.recommended;
      if (rec === "wait") return run(() => engine.dispatch({ type: "tanker-wait" }));
      if (rec === "omani") return run(() => engine.dispatch({ type: "tanker-omani" }));
      if (rec === "iran") return run(() => engine.dispatch({ type: "tanker-toll" }));
      return run(() => ({
        ok: false,
        reason: "No move.",
        state: engine.state(),
      }));
    },
    reset(nextSeed = engine.state().seed, nextScenario = engine.state().scenario) {
      return run(() => {
        const r = engine.dispatch({ type: "reset", seed: nextSeed, scenario: nextScenario });
        engine = createEngine(nextSeed, nextScenario);
        lastError = null;
        return r;
      });
    },
    labels: () => snap.labels,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snap,
  };
}

export { inputPhase };
