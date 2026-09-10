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

export type ScenarioId = "reopen-lane" | "one-transit" | "overplay";

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
};

export type Industry = {
  factoriesAlive: boolean;
  depotsAlive: boolean;
  knownPits: number;
};

export type PriceComponents = {
  baseline: number;
  mines: number;
  insurance: number;
  waiting: number;
  flow: number;
  kill: number;
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
