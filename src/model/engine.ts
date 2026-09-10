/**
 * Turn engine. Tanker picks a door. Wait forces US clearance and an Iran lay.
 * Plotting a freehand track is a test hook, not the player verb.
 */

import {
  CLEARANCE,
  COMPANY,
  IRANIAN_INBOUND,
  JMIC_INBOUND,
  LAY_SPOTS,
  MAGAZINE,
  MATCH,
  MINES,
  SPIDER,
  TRAFFIC,
  bandOf,
  radiusNm,
} from "./balance.ts";
import { COPY, SCENARIO_KIT, idleChargeLine, iranSeedLine, spiderDumpLine, spiderRevealLine, usStrikeLine, usSweepLine } from "./copy.ts";
import { clearedNm2, grazeUsdM, rollShot, shotChance, type ShotKind } from "./combat.ts";
import {
  captainsBalk,
  emptyBooks,
  hullsLeft,
  idleThisWeek,
  netUsdM,
  postIdle,
  postVoyage,
  voyageFreightUsdM,
  voyageBonusUsdM,
  voyagePremiumUsdM,
} from "./company.ts";
import { combinedKillChance, lonLatToNm, polylineLengthNm } from "./geo.ts";
import { tickPrice } from "./price.ts";
import { mulberry32 } from "./rng.ts";
import { SCENARIO_TURNS, humanSeat, initialMines } from "./scenarios.ts";
import { flyingDrones, interceptDrones, iranDronePrint, iranFactoryPrint, iranWarehouseDump, trafficDoor } from "./ai.ts";
import type {
  DebugSnapshot,
  GameState,
  MineCircle,
  NmPolyline,
  Phase,
  ScenarioId,
  StrikeTarget,
  SpiderHole,
  TankerDoor,
  TurnReport,
} from "./types.ts";
import { PHASE_ORDER } from "./types.ts";

export type EngineAction =
  | { type: "tanker-run"; path: NmPolyline }
  | { type: "tanker-omani" }
  | { type: "tanker-toll" }
  | { type: "tanker-wait" }
  | { type: "tanker-policy"; on: boolean }
  | { type: "us-sweep" }
  | { type: "us-strike"; target: StrikeTarget; pitId?: string }
  | { type: "reset"; seed?: number; scenario?: ScenarioId };

export type DispatchResult =
  | { ok: true; state: GameState }
  | { ok: false; reason: string; state: GameState };

const EMPTY_FUSE = { value: 0, blown: false };

export function omaniPath(): NmPolyline {
  return JMIC_INBOUND.map(lonLatToNm);
}

export function iranPath(): NmPolyline {
  return IRANIAN_INBOUND.map(lonLatToNm);
}

export function createState(seed = MATCH.defaultSeed, scenario: ScenarioId = "reopen-lane"): GameState {
  const seat = humanSeat(scenario);
  const greeting = seat === "us" ? COPY.warHint : COPY.doorHint;
  return {
    scenario,
    turn: 1,
    maxTurns: SCENARIO_TURNS[scenario],
    phase: seat === "us" ? "usOrders" : "tankerOrders",
    seed,
    price: 82,
    priceComponents: {
      baseline: 82,
      mines: 0,
      insurance: 0,
      waiting: 0,
      flow: 0,
      kill: 0,
      gulf: 0,
      contracts: 0,
    },
    insurance: "open",
    mines: initialMines(scenario),
    tankerPath: [],
    tankerAlive: true,
    tankerPaid: false,
    tankerExited: false,
    hullFactor: 1,
    draftClass: MATCH.defaultDraft,
    waitingHulls: 0,
    exits: 0,
    books: emptyBooks(),
    crewBonusUsdM: 0,
    crewSour: false,
    buyPolicy: false,
    lastLoss: null,
    lastReport: null,
    lastKillChance: 0,
    lastDetonatedMineId: null,
    lastDoor: null,
    lastUsLine: COPY.usDoorNote,
    lastIranLine: COPY.iranDoorNote,
    navyPulled: 0,
    log: [
      `Week 1. ${greeting} ${SCENARIO_KIT[scenario].blurb}`,
    ],
    capitalCommitted: false,
    catastrophe: false,
    industry: {
      mineFactoryAlive: true,
      droneFactoryAlive: true,
      mineDepotAlive: true,
      droneDepotAlive: true,
      radarAlive: true,
      portAlive: true,
      knownPits: 0,
    },
    iranPool: {
      boats: MAGAZINE.iranBoats,
      drones: MAGAZINE.iranDrones,
      mines: seat === "us" ? MINES.warehouseStart : 3,
    },
    usPool: { counterDrones: MAGAZINE.usCounterDrones, lasers: MAGAZINE.usLasers },
    secretSuspicion: 0,
    packageQueue: 0,
    contracts: { ...EMPTY_FUSE },
    banks: { ...EMPTY_FUSE },
    opposition: { ...EMPTY_FUSE },
    steel: 0,
    tutor: { pitsOnlyWhileFactoriesLive: false },
    lastOffboard: null,
    bribePolicy: "honor",
    gulfHits: 0,
    spiderHoles: [],
    trafficLeft:
      seat === "us"
        ? Array(TRAFFIC.companies).fill(TRAFFIC.hulls / TRAFFIC.companies)
        : [],
  };
}

export type Engine = {
  state: () => GameState;
  dispatch: (action: EngineAction) => DispatchResult;
  debug: () => DebugSnapshot;
};

export function createEngine(seed = MATCH.defaultSeed, scenario: ScenarioId = "reopen-lane"): Engine {
  let state = tickPrice(createState(seed, scenario));
  let rng = mulberry32(seed);
  let pendingShot: ShotKind = "none";

  function snapshot(): GameState {
    return state;
  }

  function debug(): DebugSnapshot {
    return {
      seed: state.seed,
      turn: state.turn,
      phase: state.phase,
      price: state.price,
      priceBand: bandOf(state.price),
      insurance: state.insurance,
      circleRadii: state.mines.map((m) => ({ id: m.id, radiusSteps: m.radiusSteps })),
      packageQueue: state.packageQueue,
      secretSuspicion: state.secretSuspicion,
      contracts: state.contracts.value,
      banks: state.banks.value,
      opposition: state.opposition.value,
      steel: 0,
      iranPool: state.iranPool,
      waitingHulls: state.waitingHulls,
      exits: state.exits,
      books: state.books,
      lastKillChance: state.lastKillChance,
      navyPulled: state.navyPulled,
      priceComponents: state.priceComponents,
    };
  }

  function nextPhase(phase: Phase): Phase {
    if (phase === "matchOver") return "matchOver";
    const i = PHASE_ORDER.indexOf(phase);
    if (i < 0 || i === PHASE_ORDER.length - 1) {
      return "priceTick";
    }
    return PHASE_ORDER[i + 1]!;
  }

  function applyUsOrders(s: GameState): GameState {
    const path = omaniPath();
    const { clips } = combinedKillChance(path, s.mines, s.draftClass);
    const hot = clips
      .filter((c) => c.chance > 0.04)
      .sort((a, b) => b.chance - a.chance)
      .slice(0, CLEARANCE.maxHolesPerWait);
    if (hot.length === 0) {
      const line = `Week ${s.turn}: US sensing. Omani ribbon is quiet enough. Do not pay.`;
      return { ...s, phase: "usOrders", lastUsLine: line, log: [...s.log, line] };
    }
    const mines = s.mines.map((m) => {
      if (!hot.some((c) => c.id === m.id)) return m;
      return {
        ...m,
        hole: {
          radiusNm: radiusNm(m.radiusSteps) * CLEARANCE.holeFactor,
          expiresTurn: s.turn + CLEARANCE.expiresInTurns,
        },
      };
    });
    const punched = hot.length;
    const navyPulled = s.navyPulled + punched;
    const nm2 = clearedNm2(mines.filter((m) => hot.some((c) => c.id === m.id)));
    const line = usSweepLine({ turn: s.turn, layers: punched, nm2 });
    return { ...s, phase: "usOrders", mines, navyPulled, lastUsLine: line, log: [...s.log, line] };
  }

  function revealSpider(s: GameState): GameState {
    if (humanSeat(s.scenario) !== "us") return s;
    if (s.spiderHoles.some((h) => h.alive)) return s;
    // Cycle coastal cells. Four pits is a map, not a sitting cap.
    // One live hole at a time is the cap (ADR-022).
    const pit = s.spiderHoles.length % SPIDER.pits.length;
    const loc = SPIDER.pits[pit]!;
    const hole: SpiderHole = {
      id: `pit-${s.turn}-${pit}`,
      pit,
      lat: loc.lat,
      lon: loc.lon,
      mines: SPIDER.stashMines,
      drones: SPIDER.stashDrones,
      revealedTurn: s.turn,
      alive: true,
    };
    const line = spiderRevealLine({
      turn: s.turn,
      mines: hole.mines,
      drones: hole.drones,
    });
    const alreadyNamed = s.lastUsLine.includes("spider hole showed");
    return {
      ...s,
      spiderHoles: [...s.spiderHoles, hole],
      industry: { ...s.industry, knownPits: s.industry.knownPits + 1 },
      lastUsLine: alreadyNamed ? s.lastUsLine : `${s.lastUsLine} ${line}`.trim(),
      log: [...s.log, line],
    };
  }

  function dumpSpiders(s: GameState): GameState {
    const ripe = s.spiderHoles.filter((h) => h.alive && h.revealedTurn < s.turn);
    if (ripe.length === 0) return s;
    const laid: MineCircle[] = [];
    let dumped = 0;
    let air = 0;
    const holes = s.spiderHoles.map((h) => {
      if (!(h.alive && h.revealedTurn < s.turn)) return h;
      for (let i = 0; i < h.mines; i++) {
        const spot = LAY_SPOTS[(s.turn - 1 + dumped + i) % LAY_SPOTS.length]!;
        laid.push({
          id: `m-pit-${s.turn}-${h.pit}-${i}`,
          center: lonLatToNm(spot),
          radiusSteps: 0,
          laidTurn: s.turn,
          hole: null,
        });
      }
      dumped += h.mines;
      air += h.drones;
      return { ...h, alive: false, mines: 0, drones: 0 };
    });
    const line = spiderDumpLine({ turn: s.turn, mines: dumped, drones: air });
    const iranLine = s.lastIranLine ? `${s.lastIranLine} ${line}` : line;
    return {
      ...s,
      spiderHoles: holes,
      mines: [...s.mines, ...laid],
      gulfHits: s.gulfHits + ripe.length,
      lastIranLine: iranLine,
      log: [...s.log, line],
    };
  }

  function applyUsStrike(s: GameState, target: StrikeTarget, pitId?: string): GameState {
    if (target === "spider-hole") {
      const hole = s.spiderHoles.find((h) => h.alive && (pitId ? h.id === pitId : true));
      const already = !hole;
      const line = usStrikeLine({ turn: s.turn, target, already });
      if (already || !hole) {
        return { ...s, phase: "usOrders", lastUsLine: line, log: [...s.log, line] };
      }
      return {
        ...s,
        phase: "usOrders",
        spiderHoles: s.spiderHoles.map((h) =>
          h.id === hole.id ? { ...h, alive: false, mines: 0, drones: 0 } : h,
        ),
        lastUsLine: line,
        log: [...s.log, line],
      };
    }
    const already =
      (target === "mine-factory" && !s.industry.mineFactoryAlive) ||
      (target === "drone-factory" && !s.industry.droneFactoryAlive) ||
      (target === "mine-warehouse" && !s.industry.mineDepotAlive) ||
      (target === "drone-warehouse" && !s.industry.droneDepotAlive) ||
      (target === "radar" && !s.industry.radarAlive) ||
      (target === "port" && !s.industry.portAlive);
    const line = usStrikeLine({
      turn: s.turn,
      target,
      already,
      mineFactoryUp: s.industry.mineFactoryAlive,
      droneFactoryUp: s.industry.droneFactoryAlive,
    });
    if (already) {
      return { ...s, phase: "usOrders", lastUsLine: line, log: [...s.log, line] };
    }
    let industry = { ...s.industry };
    let iranPool = { ...s.iranPool };
    let next = s;
    if (target === "mine-factory") industry = { ...industry, mineFactoryAlive: false };
    if (target === "drone-factory") industry = { ...industry, droneFactoryAlive: false };
    if (target === "mine-warehouse") {
      industry = { ...industry, mineDepotAlive: false };
      iranPool = { ...iranPool, mines: 0 };
    }
    if (target === "drone-warehouse") {
      industry = { ...industry, droneDepotAlive: false };
      iranPool = { ...iranPool, drones: 0 };
    }
    if (target === "radar") industry = { ...industry, radarAlive: false };
    if (target === "port") {
      industry = { ...industry, portAlive: false };
      iranPool = { ...iranPool, boats: 0 };
      next = revealSpider({ ...s, industry, iranPool });
      return {
        ...next,
        phase: "usOrders",
        lastUsLine: line,
        log: [...next.log, line],
      };
    }
    return {
      ...s,
      phase: "usOrders",
      industry,
      iranPool,
      lastUsLine: line,
      log: [...s.log, line],
    };
  }

  function applyIranOrders(s: GameState, shot: ShotKind = "none"): GameState {
    let pool = s.iranPool.mines + iranFactoryPrint(s);
    const drones = s.iranPool.drones + iranDronePrint(s);
    const dump = iranWarehouseDump(s, pool);
    if (dump <= 0) {
      const line = iranSeedLine({ turn: s.turn, laid: 0, shot });
      return {
        ...s,
        phase: "iranOrders",
        iranPool: { ...s.iranPool, mines: pool, drones },
        lastIranLine: line,
        log: [...s.log, line],
      };
    }
    const laidMines: MineCircle[] = [];
    for (let i = 0; i < dump; i++) {
      const spot = LAY_SPOTS[(s.turn - 1 + i) % LAY_SPOTS.length]!;
      laidMines.push({
        id: `m-lay-${s.turn}-${i}`,
        center: lonLatToNm(spot),
        radiusSteps: 0,
        laidTurn: s.turn,
        hole: null,
      });
    }
    pool -= dump;
    const line = iranSeedLine({ turn: s.turn, laid: dump, shot });
    return {
      ...s,
      phase: "iranOrders",
      mines: [...s.mines, ...laidMines],
      iranPool: { ...s.iranPool, mines: pool, drones },
      lastIranLine: line,
      log: [...s.log, line],
    };
  }

  function applyPhase(s: GameState, phase: Phase): GameState {
    switch (phase) {
      case "priceTick":
        return tickPrice({ ...s, phase });
      case "hiddenPipeline":
        return { ...s, phase };
      case "expandMines": {
        const mines = s.mines.map((m) => {
          const hole =
            m.hole && m.hole.expiresTurn <= s.turn ? null : m.hole;
          const radiusSteps =
            m.laidTurn < s.turn ? m.radiusSteps + 1 : m.radiusSteps;
          return { ...m, radiusSteps, hole };
        });
        return { ...s, phase, mines };
      }
      case "usOrders":
        if (humanSeat(s.scenario) === "us") return { ...s, phase };
        return applyUsOrders({ ...s, phase });
      case "iranOrders":
        return applyIranOrders({ ...s, phase }, pendingShot);
      case "tankerOrders":
        return { ...s, phase };
      case "resolve":
        return { ...s, phase };
      case "bankExit":
        return { ...s, phase };
      case "fuses": {
        if (s.insurance === "collapsed" && !s.contracts.blown) {
          return {
            ...s,
            phase,
            contracts: { value: s.contracts.value + 3, blown: false },
          };
        }
        return { ...s, phase };
      }
      case "decay":
        return { ...s, phase };
      case "matchOver":
        return { ...s, phase };
    }
  }

  function advancePastAuto(s: GameState): GameState {
    let cur = s;
    const needsInput = (p: Phase) => {
      if (p === "matchOver") return true;
      if (humanSeat(s.scenario) === "us") return p === "usOrders";
      return p === "tankerOrders";
    };
    let guard = 0;
    while (!needsInput(cur.phase) && guard++ < 40) {
      if (cur.phase === "decay") {
        const turn = cur.turn + 1;
        if (cur.maxTurns > 0 && turn > cur.maxTurns) {
          cur = { ...cur, turn, phase: "matchOver" };
          break;
        }
        cur = applyPhase({ ...cur, turn, phase: "priceTick" }, "priceTick");
        continue;
      }
      const nxt = nextPhase(cur.phase);
      cur = applyPhase({ ...cur, phase: nxt }, nxt);
    }
    if (
      cur.phase === "tankerOrders" ||
      cur.phase === "usOrders" ||
      cur.phase === "matchOver"
    ) {
      cur = tickPrice(cur);
    }
    return cur;
  }

  function doorShot(s: GameState, door: TankerDoor, paid: boolean): number {
    return shotChance({
      door,
      waitingHulls: s.waitingHulls,
      paid,
      radarAlive: s.industry.radarAlive,
      drones: flyingDrones(s),
      boats: s.iranPool.boats,
    });
  }

  function doorRisk(s: GameState) {
    const sweep = omaniPath();
    const mineO = combinedKillChance(sweep, s.mines, s.draftClass, sweep).chance;
    const mineI = combinedKillChance(iranPath(), s.mines, s.draftClass, sweep).chance;
    return {
      omaniMinePct: Math.round(mineO * 100),
      iranMinePct: Math.round(mineI * 100),
      omaniShotPct: Math.round(doorShot(s, "omani", false) * 100),
      iranShotPct: Math.round(doorShot(s, "iran", true) * 100),
    };
  }

  function attachReport(
    s: GameState,
    opts: {
      kind: TurnReport["kind"];
      door: TankerDoor;
      netDeltaUsdM: number;
      freightUsdM: number;
      bonusUsdM: number;
      tollUsdM: number;
      damageUsdM: number;
      idleUsdM: number;
      minesBought: number;
      cause: TurnReport["cause"];
      paid: boolean;
      wave?: TurnReport["wave"];
    },
  ): GameState {
    const report: TurnReport = {
      id: `${s.seed}-t${s.turn}-${opts.kind}-${s.books.hullsSent}-${s.books.idleUsdM}`,
      turn: s.turn,
      ...opts,
      usLine: s.lastUsLine,
      iranLine: s.lastIranLine,
      ...doorRisk(s),
      watcher: humanSeat(s.scenario) === "us" ? "us" : "tanker",
    };
    return { ...s, lastReport: report };
  }

  function runResolve(
    s: GameState,
    path: NmPolyline,
    door: TankerDoor,
    paid: boolean,
  ): GameState {
    const { chance, clips } = combinedKillChance(path, s.mines, s.draftClass, omaniPath());
    const mineHit = chance > 0 && rng() < chance;
    const shotP = doorShot(s, door, paid);
    let shot: ShotKind = "none";
    if (!mineHit) shot = rollShot(rng, shotP);
    pendingShot = shot;
    const hullDead = mineHit || shot === "kill";
    const graze = shot === "graze";
    const damage = graze ? grazeUsdM(s.price) : 0;
    const hitClip = mineHit
      ? clips.filter((c) => c.chance > 0).sort((a, b) => b.chance - a.chance)[0]
      : null;
    let insurance = s.insurance;
    let log = s.log;
    let tankerAlive = true;
    let hullFactor: 0 | 1 = 1;
    let tankerExited = false;
    let exits = s.exits;
    let lastDetonatedMineId: string | null = null;
    const nm = Math.round(polylineLengthNm(path));
    const doorWord = door === "iran" ? "Iran door" : "Omani door";
    const crewRate = s.crewBonusUsdM;
    const freight = hullDead ? 0 : voyageFreightUsdM(s.price);
    const bonus = hullDead ? 0 : voyageBonusUsdM(s.price);
    const insured = s.buyPolicy && s.insurance === "open";
    const premium = insured ? voyagePremiumUsdM(s.price, s.insurance) : 0;
    const toll = paid ? COMPANY.tollUsdM : 0;
    const recover = hullDead && insured ? COMPANY.hullUsdM : 0;
    const books = postVoyage(s.books, {
      live: !hullDead,
      freightUsdM: freight,
      bonusUsdM: bonus,
      crewUsdM: hullDead ? 0 : crewRate,
      tollUsdM: toll,
      premiumUsdM: premium,
      recoverUsdM: recover,
      damageUsdM: damage,
      omaniSent: door === "omani" ? 1 : 0,
      iranSent: door === "iran" ? 1 : 0,
      minesBought: paid ? 1 : 0,
    });
    const crewBonusUsdM = hullDead ? COMPANY.crewBonusUsdM : s.crewBonusUsdM;
    const crewSour = hullDead ? true : s.crewSour;
    if (hullDead) {
      tankerAlive = false;
      hullFactor = 0;
      lastDetonatedMineId = hitClip?.id ?? null;
      insurance = "collapsed";
      const how = mineHit
        ? `Mine kill ${(chance * 100).toFixed(0)}%. Boom.`
        : `Shot kill. Rare.`;
      log = [
        ...log,
        `Week ${s.turn}: ${doorWord}, ${nm} nm. ${how} ${COPY.dead}`,
        COPY.cargoNotYours,
        COPY.crewBonusNow,
      ];
      if (insured) {
        log = [...log, COPY.lossCovered];
      }
      if (s.insurance === "open") {
        log = [...log, COPY.collapsedNow];
      }
    } else {
      tankerExited = true;
      exits += 1;
      const shotBit =
        shot === "miss"
          ? " Shot missed."
          : graze
            ? ` Light damage $${damage}M.`
            : "";
      log = [
        ...log,
        `Week ${s.turn}: ${doorWord}, ${nm} nm. Mine ${(chance * 100).toFixed(0)}%. Shot ${(shotP * 100).toFixed(0)}%. ${COPY.lived}${shotBit}`,
      ];
    }
    if (paid) {
      log = [...log, COPY.payWarning];
    }
    const iranPool = paid
      ? {
          ...s.iranPool,
          mines: s.iranPool.mines + 1,
          boats: s.industry.portAlive ? s.iranPool.boats + 1 : s.iranPool.boats,
        }
      : s.iranPool;
    const lastLoss = hullDead
      ? {
          id: `${s.seed}-t${s.turn}-lost${books.hullsLost}`,
          turn: s.turn,
          door: door === "iran" ? ("iran" as const) : ("omani" as const),
          killPct: Math.round((mineHit ? chance : shotP) * 100),
          mineId: lastDetonatedMineId,
          paid,
          insured,
          premiumUsdM: premium,
          recoverUsdM: recover,
          tollUsdM: toll,
          hullUsdM: COMPANY.hullUsdM,
          familyUsdM: COMPANY.familyUsdM,
          cargoUsdM: COMPANY.cargoTraderUsdM,
          crewBonusUsdM: COMPANY.crewBonusUsdM,
          cause: mineHit ? ("mine" as const) : ("shot" as const),
        }
      : s.lastLoss;
    return {
      ...s,
      phase: "resolve",
      tankerPath: path,
      tankerAlive,
      tankerExited,
      tankerPaid: paid,
      hullFactor,
      exits,
      books,
      crewBonusUsdM,
      crewSour,
      buyPolicy: false,
      lastLoss,
      insurance,
      iranPool,
      lastKillChance: chance,
      lastDetonatedMineId,
      lastDoor: door,
      log,
    };
  }

  function applyTankerWait(s: GameState): GameState {
    const idle = idleThisWeek(s.scenario, s.books);
    const leftover = hullsLeft(s.scenario, s.books);
    const line = `Week ${s.turn}: ${COPY.waited} ${idleChargeLine(leftover)}`.trim();
    return {
      ...s,
      waitingHulls: s.waitingHulls + 1,
      lastKillChance: 0,
      tankerPath: [],
      tankerExited: false,
      tankerPaid: false,
      lastDoor: "wait",
      crewSour: false,
      books: postIdle(s.books, idle),
      log: [...s.log, line],
      phase: "resolve",
    };
  }

  function afterUsVerb(s: GameState): GameState {
    let cur = applyIranOrders({ ...s, phase: "iranOrders" }, pendingShot);
    cur = dumpSpiders(cur);
    cur = interceptDrones(cur);
    pendingShot = "none";
    if (hullsLeft(cur.scenario, cur.books) <= 0) {
      return { ...cur, phase: "matchOver", log: [...cur.log, COPY.noHulls] };
    }
    const wave = { sent: 0, waited: 0, paid: 0, omani: 0, live: 0, lost: 0 };
    const before = netUsdM(cur.books);
    const dmg0 = cur.books.damageUsdM;
    const fr0 = cur.books.freightUsdM;
    const bo0 = cur.books.bonusUsdM;
    const to0 = cur.books.tollUsdM;
    let lastDoor: TankerDoor = "wait";
    let lastPaid = false;
    let lastCause: TurnReport["cause"] = "none";
    let shipHit = false;
    for (let i = 0; i < TRAFFIC.companies; i++) {
      if ((cur.trafficLeft[i] ?? 0) <= 0) continue;
      if (hullsLeft(cur.scenario, cur.books) <= 0) break;
      const risk = doorRisk(cur);
      const door = trafficDoor(
        cur,
        risk.omaniMinePct / 100,
        risk.iranMinePct / 100,
        risk.omaniShotPct / 100,
        risk.iranShotPct / 100,
        i,
      );
      if (door === "wait" || captainsBalk(cur)) {
        cur = {
          ...cur,
          waitingHulls: cur.waitingHulls + 1,
          lastDoor: "wait",
          tankerPath: [],
          tankerExited: false,
          tankerPaid: false,
        };
        wave.waited += 1;
        lastDoor = "wait";
        continue;
      }
      const paid = door === "iran";
      const path = paid ? iranPath() : omaniPath();
      const lost0 = cur.books.hullsLost;
      cur = runResolve(cur, path, door, paid);
      const left = cur.trafficLeft.slice();
      left[i] = (left[i] ?? 1) - 1;
      cur = { ...cur, trafficLeft: left };
      wave.sent += 1;
      if (paid) wave.paid += 1;
      else wave.omani += 1;
      if (cur.books.hullsLost > lost0) {
        wave.lost += 1;
        lastCause = cur.lastLoss?.cause ?? "mine";
        // ADR-022: a mine kill is still a hit. The hole is blood in the water, not a launch cell.
        shipHit = true;
      } else {
        wave.live += 1;
        if (cur.books.damageUsdM > dmg0) shipHit = true;
      }
      lastDoor = door;
      lastPaid = paid;
    }
    if (shipHit) {
      cur = revealSpider(cur);
    }
    if (wave.waited > 0) {
      cur = { ...cur, crewSour: false };
    }
    cur = finishTurn(cur);
    const kind: TurnReport["kind"] =
      wave.lost > 0
        ? "lost"
        : cur.books.damageUsdM > dmg0
          ? "graze"
          : wave.sent > 0
            ? "live"
            : "wait";
    return attachReport(cur, {
      kind,
      door: lastDoor,
      netDeltaUsdM: netUsdM(cur.books) - before,
      freightUsdM: cur.books.freightUsdM - fr0,
      bonusUsdM: cur.books.bonusUsdM - bo0,
      tollUsdM: cur.books.tollUsdM - to0,
      damageUsdM: cur.books.damageUsdM - dmg0,
      idleUsdM: 0,
      minesBought: wave.paid,
      cause: lastCause,
      paid: lastPaid,
      wave,
    });
  }

  function finishTurn(s: GameState): GameState {
    let cur = applyPhase({ ...s, phase: "bankExit" }, "bankExit");
    cur = applyPhase({ ...cur, phase: "fuses" }, "fuses");
    cur = applyPhase({ ...cur, phase: "decay" }, "decay");
    cur = advancePastAuto(cur);
    if (hullsLeft(cur.scenario, cur.books) <= 0 && cur.phase !== "matchOver") {
      cur = {
        ...cur,
        phase: "matchOver",
        log: [...cur.log, COPY.noHulls],
      };
    }
    return cur;
  }

  function dispatch(action: EngineAction): DispatchResult {
    if (action.type === "reset") {
      const seed = action.seed ?? state.seed;
      const scenario = action.scenario ?? state.scenario;
      rng = mulberry32(seed);
      state = tickPrice(createState(seed, scenario));
      return { ok: true, state };
    }

    if (state.phase === "matchOver") {
      return { ok: false, reason: "Match over.", state };
    }

    if (action.type === "us-sweep" || action.type === "us-strike") {
      if (state.phase !== "usOrders") {
        return { ok: false, reason: `Illegal in phase ${state.phase}.`, state };
      }
      state =
        action.type === "us-sweep"
          ? applyUsOrders(state)
          : applyUsStrike(state, action.target, action.type === "us-strike" ? action.pitId : undefined);
      state = afterUsVerb(state);
      return { ok: true, state };
    }

    if (state.phase !== "tankerOrders") {
      return { ok: false, reason: `Illegal in phase ${state.phase}.`, state };
    }

    const sending =
      action.type === "tanker-omani" ||
      action.type === "tanker-toll" ||
      action.type === "tanker-run";
    if (sending) {
      if (hullsLeft(state.scenario, state.books) <= 0) {
        return { ok: false, reason: COPY.noHulls, state };
      }
      if (captainsBalk(state)) {
        return { ok: false, reason: COPY.balk, state };
      }
    }

    if (action.type === "tanker-policy") {
      if (action.on && state.insurance === "collapsed") {
        return { ok: false, reason: COPY.policyGone, state };
      }
      state = { ...state, buyPolicy: action.on };
      return { ok: true, state };
    }

    if (action.type === "tanker-wait") {
      pendingShot = "none";
      const idle = idleThisWeek(state.scenario, state.books);
      const leftover = hullsLeft(state.scenario, state.books);
      const before = netUsdM(state.books);
      const line = `Week ${state.turn}: ${COPY.waited} ${idleChargeLine(leftover)}`.trim();
      let s: GameState = {
        ...state,
        waitingHulls: state.waitingHulls + 1,
        lastKillChance: 0,
        tankerPath: [],
        tankerExited: false,
        tankerPaid: false,
        lastDoor: "wait",
        crewSour: false,
        books: postIdle(state.books, idle),
        log: [...state.log, line],
        phase: "resolve",
      };
      state = finishTurn(s);
      pendingShot = "none";
      state = attachReport(state, {
        kind: "wait",
        door: "wait",
        netDeltaUsdM: netUsdM(state.books) - before,
        freightUsdM: 0,
        bonusUsdM: 0,
        tollUsdM: 0,
        damageUsdM: 0,
        idleUsdM: idle,
        minesBought: 0,
        cause: "none",
        paid: false,
      });
      return { ok: true, state };
    }

    if (action.type === "tanker-omani" || action.type === "tanker-toll" || action.type === "tanker-run") {
      if (action.type === "tanker-run" && action.path.length < 2) {
        return { ok: false, reason: "Need two fixes to run.", state };
      }
      const paid = action.type === "tanker-toll";
      const path = action.type === "tanker-omani"
        ? omaniPath()
        : action.type === "tanker-toll"
          ? iranPath()
          : action.path;
      const door: TankerDoor = action.type === "tanker-toll" ? "iran" : "omani";
      const before = netUsdM(state.books);
      const lost0 = state.books.hullsLost;
      const dmg0 = state.books.damageUsdM;
      const fr0 = state.books.freightUsdM;
      const bo0 = state.books.bonusUsdM;
      const to0 = state.books.tollUsdM;
      state = finishTurn(runResolve(state, path, door, paid));
      const lost = state.books.hullsLost > lost0;
      const grazed = state.books.damageUsdM > dmg0;
      const kind: TurnReport["kind"] = lost ? "lost" : grazed ? "graze" : "live";
      const cause: TurnReport["cause"] = lost
        ? (state.lastLoss?.cause ?? "mine")
        : "none";
      pendingShot = "none";
      state = attachReport(state, {
        kind,
        door,
        netDeltaUsdM: netUsdM(state.books) - before,
        freightUsdM: state.books.freightUsdM - fr0,
        bonusUsdM: state.books.bonusUsdM - bo0,
        tollUsdM: state.books.tollUsdM - to0,
        damageUsdM: state.books.damageUsdM - dmg0,
        idleUsdM: 0,
        minesBought: paid ? 1 : 0,
        cause,
        paid,
      });
      return { ok: true, state };
    }

    return { ok: false, reason: "Unknown action.", state };
  }

  return { state: snapshot, dispatch, debug };
}
