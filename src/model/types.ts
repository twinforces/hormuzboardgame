/**
 * Domain contract for Hormuz Toll.
 * Implementer fills engines against these shapes.
 * View and ViewModel import types only from here and from copy/receipts/balance.
 */

export type Role = "us" | "iran" | "tanker";

export type Phase =
  | "priceTick"
  | "hiddenPipeline"
  | "expandMines"
  | "usOrders"
  | "iranOrders"
  | "tankerOrders"
  | "resolve"
  | "bankExit"
  | "fuses"
  | "decay"
  | "matchOver";

export type ScenarioId = "reopen-lane" | "one-transit" | "overplay" | "mine-warfare";

/** Sim space. Never pixels. */
export type NmPoint = { xNm: number; yNm: number };
export type NmPolyline = NmPoint[];

export type DraftClass = "vlcc" | "suezmax" | "handy";

export type PriceBand = "cheap" | "tolerable" | "high" | "panic";
export type Insurance = "open" | "collapsed";

export type UsHormuzAction =
  | "strike-industry"
  | "strike-depots"
  | "whack-pits"
  | "sensing"
  | "clearance"
  | "boarding"
  | "commit-capital";

export type UsOffboardAction = "ukraine-pressure" | "china-tariff";

export type IranAction =
  | "lay-mines"
  | "surge"
  | "relocate"
  | "bribe-policy"
  | "request-package"
  | "neighbor-strike";

export type BribePolicy = "honor" | "skim" | "lose-control";

export type TankerDoor = "omani" | "iran" | "wait";

export type MineCircle = {
  id: string;
  center: NmPoint;
  /** Discrete expansion steps. 0 = just laid. */
  radiusSteps: number;
  laidTurn: number;
  /** Rented hole from US clearance. Next expansion can close it. */
  hole: null | { radiusNm: number; expiresTurn: number };
};

export type FuseState = {
  value: number;
  blown: boolean;
};

/** Greece, Inc. ledger. Units are USD millions. Oil is not on this paper. */
export type CompanyBooks = {
  hullsSent: number;
  hullsLive: number;
  hullsLost: number;
  freightUsdM: number;
  bonusUsdM: number;
  hullWriteoffUsdM: number;
  familyUsdM: number;
  crewUsdM: number;
  tollUsdM: number;
  premiumUsdM: number;
  recoverUsdM: number;
  idleUsdM: number;
  damageUsdM: number;
  omaniSent: number;
  iranSent: number;
  minesBought: number;
};

/** Why this hull died. View renders it. Model owns the numbers. */
export type LossReport = {
  id: string;
  turn: number;
  door: "omani" | "iran";
  killPct: number;
  mineId: string | null;
  paid: boolean;
  insured: boolean;
  premiumUsdM: number;
  recoverUsdM: number;
  tollUsdM: number;
  hullUsdM: number;
  familyUsdM: number;
  cargoUsdM: number;
  crewBonusUsdM: number;
  cause: "mine" | "shot";
};

/** In-your-face result of Wait or a door. Model owns the numbers. */
export type TurnReport = {
  id: string;
  turn: number;
  kind: "wait" | "live" | "graze" | "lost";
  door: TankerDoor;
  netDeltaUsdM: number;
  freightUsdM: number;
  bonusUsdM: number;
  tollUsdM: number;
  damageUsdM: number;
  idleUsdM: number;
  minesBought: number;
  usLine: string;
  iranLine: string;
  omaniMinePct: number;
  iranMinePct: number;
  omaniShotPct: number;
  iranShotPct: number;
  cause: "none" | "mine" | "shot";
  paid: boolean;
  /** Who is watching this report. Traffic results when the human is US. */
  watcher?: "tanker" | "us";
  /** One week of ten companies. Present on the US sitting. */
  wave?: {
    sent: number;
    waited: number;
    paid: number;
    omani: number;
    live: number;
    lost: number;
  };
  /** Stash that ran because you spent the week on something else. */
  dumped?: { mines: number; drones: number };
};

export type StrikeTarget =
  | "mine-factory"
  | "drone-factory"
  | "mine-warehouse"
  | "drone-warehouse"
  | "radar"
  | "port"
  | "spider-hole";

export type Industry = {
  mineFactoryAlive: boolean;
  droneFactoryAlive: boolean;
  mineDepotAlive: boolean;
  droneDepotAlive: boolean;
  radarAlive: boolean;
  portAlive: boolean;
  knownPits: number;
};

/** Revealed launch cell. Strike it this week or the stash dumps. */
export type SpiderHole = {
  id: string;
  pit: number;
  lat: number;
  lon: number;
  mines: number;
  drones: number;
  revealedTurn: number;
  alive: boolean;
  /** Set when the stash ran. Struck holes stay unset so the remnant is dump-only. */
  dumpedTurn?: number;
};

export type PriceComponents = {
  baseline: number;
  mines: number;
  insurance: number;
  waiting: number;
  flow: number;
  kill: number;
  gulf: number;
  contracts: number;
};

export type GameState = {
  scenario: ScenarioId;
  turn: number;
  maxTurns: number;
  phase: Phase;
  seed: number;
  price: number;
  priceComponents: PriceComponents;
  insurance: Insurance;
  mines: MineCircle[];
  tankerPath: NmPolyline;
  tankerAlive: boolean;
  tankerPaid: boolean;
  tankerExited: boolean;
  hullFactor: 0 | 1;
  draftClass: DraftClass;
  waitingHulls: number;
  exits: number;
  books: CompanyBooks;
  crewBonusUsdM: number;
  crewSour: boolean;
  buyPolicy: boolean;
  lastLoss: LossReport | null;
  lastReport: TurnReport | null;
  lastKillChance: number;
  lastDetonatedMineId: string | null;
  lastDoor: TankerDoor | null;
  lastUsLine: string;
  lastIranLine: string;
  navyPulled: number;
  log: string[];
  capitalCommitted: boolean;
  catastrophe: boolean;
  industry: Industry;
  iranPool: { boats: number; drones: number; mines: number };
  usPool: { counterDrones: number; lasers: number };
  secretSuspicion: number;
  packageQueue: number;
  contracts: FuseState;
  banks: FuseState;
  opposition: FuseState;
  steel: 0;
  tutor: {
    pitsOnlyWhileFactoriesLive: boolean;
  };
  lastOffboard: UsOffboardAction | null;
  bribePolicy: BribePolicy;
  gulfHits: number;
  spiderHoles: SpiderHole[];
  /** Hulls left per traffic company. Empty on tanker sittings. */
  trafficLeft: number[];
};

export type DebugSnapshot = {
  seed: number;
  turn: number;
  phase: Phase;
  price: number;
  priceBand: PriceBand;
  insurance: Insurance;
  circleRadii: Array<{ id: string; radiusSteps: number }>;
  packageQueue: number;
  secretSuspicion: number;
  contracts: number;
  banks: number;
  opposition: number;
  steel: 0;
  iranPool: GameState["iranPool"];
  waitingHulls: number;
  exits: number;
  books: CompanyBooks;
  lastKillChance: number;
  navyPulled: number;
  priceComponents: PriceComponents;
};

export const PHASE_ORDER: Phase[] = [
  "priceTick",
  "hiddenPipeline",
  "expandMines",
  "usOrders",
  "iranOrders",
  "tankerOrders",
  "resolve",
  "bankExit",
  "fuses",
  "decay",
];
