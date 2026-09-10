/**
 * Every tunable lives here. If you feel an urge to put a magic number in
 * engine.ts, you are in the wrong file.
 *
 * Price P is a teaching index in USD/bbl flavor. It is not a live EIA tick.
 * Historical markers sit beside the formula so a critic can see what "high"
 * meant in 2008, 2022, and the 2026 Hormuz war without the tests fetching
 * the internet.
 */

import type { DraftClass, PriceBand } from "./types.ts";

/** Sentinel-2 cloudless mosaic. Same equirectangular crop as the retired Blue Marble plate. */
export const MAP = {
  imageSrc: "/maps/hormuz-sentinel.jpg",
  credit:
    "Sentinel-2 cloudless 2024 by EOX. Contains modified Copernicus Sentinel data. CC BY 4.0.",
  widthPx: 2016,
  heightPx: 1800,
  westLon: 54.6,
  eastLon: 57.4,
  southLat: 25.0,
  northLat: 27.5,
  meanLatDeg: 26.25,
} as const;

export const NM_PER_DEG_LAT = 60;
export const NM_PER_DEG_LON =
  60 * Math.cos((MAP.meanLatDeg * Math.PI) / 180);

export const MINE = {
  /** Tight circle just after a lay. */
  baseRadiusNm: 2,
  /** One discrete expansion step per expandMines. */
  stepRadiusNm: 2.5,
  /**
   * Kill density per nm of path inside the circle, by radiusSteps.
   * Tight circle = you are near the device. Fat circle = fog, thinner density.
   */
  killPerNm: [0.22, 0.12, 0.07, 0.045, 0.03, 0.02, 0.014, 0.01],
  draftFactor: {
    vlcc: 1,
    suezmax: 0.85,
    handy: 0.6,
  } satisfies Record<DraftClass, number>,
  /** Path within this of a TSS polyline counts as "in the lane" for insurance. */
  tssBandNm: 3,
  /**
   * Paint mines, punch holes, count remaining black. Overlaps are union.
   * Sample is nm per cell. Smaller is slower and closer to the picture.
   */
  fieldSampleNm: 0.35,
} as const;

export const PRICE = {
  /** 2024-ish Brent teaching zero. Not today's ticker. */
  baseline: 82,
  min: 40,
  max: 126,
  bands: {
    cheap: { max: 85, label: "CHEAP" },
    tolerable: { max: 110, label: "TOLERABLE" },
    high: { max: 125, label: "HIGH" },
    panic: { max: 999, label: "PANIC" },
  },
  /** Closed or heavily mined lane. 2026 war took ~72 to 126 at the peak. */
  perMineStep: 2.2,
  insuranceCollapsed: 18,
  waitingHull: 1.6,
  killSpike: 12,
  /**
   * One live VLCC out of the strait. A week's fog growth is ~11. Flow
   * has to beat that or the ticker never falls when the lane works.
   */
  exitRelief: 16,
  contractsRelief: 3,
  /** Drone dump on a Gulf state after you ignore a spider hole. */
  gulfDrone: 8,
} as const;

export function bandOf(price: number): PriceBand {
  if (price < PRICE.bands.cheap.max) return "cheap";
  if (price < PRICE.bands.tolerable.max) return "tolerable";
  if (price < PRICE.bands.high.max) return "high";
  return "panic";
}

export function radiusNm(radiusSteps: number): number {
  return MINE.baseRadiusNm + Math.max(0, radiusSteps) * MINE.stepRadiusNm;
}

/**
 * Tanker intel on a fog blob. One lay is one estimated device.
 * The circle is location fog, not Iran's magazine.
 */
export function fogEstimate(m: {
  radiusSteps: number;
  hole: null | { radiusNm: number };
}): { est: number; fogNm: number; holeNm: number | null } {
  return {
    est: 1,
    fogNm: Math.round(radiusNm(m.radiusSteps)),
    holeNm: m.hole ? Math.round(m.hole.radiusNm) : null,
  };
}

export function killPerNm(radiusSteps: number): number {
  const table = MINE.killPerNm;
  const i = Math.max(0, Math.min(table.length - 1, radiusSteps));
  return table[i] ?? table[table.length - 1]!;
}

/**
 * Historical Brent markers the ticker can point at.
 * These are citations, not inputs. The sim never reads them at runtime
 * to set P. That is the whole point of a seeded teaching index.
 */
export const HISTORY = [
  {
    year: 2008,
    label: "Demand spike",
    brentUsd: 147,
    note: "Pre-shale peak. Panic band analog.",
    receiptId: "eia-chokepoint",
  },
  {
    year: 2020,
    label: "COVID crash",
    brentUsd: 20,
    note: "Demand destruction. Not a chokepoint close.",
    receiptId: "eia-chokepoint",
  },
  {
    year: 2022,
    label: "Ukraine",
    brentUsd: 120,
    note: "Sanction shock. High band, not Hormuz.",
    receiptId: "eia-chokepoint",
  },
  {
    year: 2024,
    label: "Quiet baseline",
    brentUsd: 80,
    note: "Teaching zero. Sim P starts next to this.",
    receiptId: "eia-chokepoint",
  },
  {
    year: 2026,
    label: "Eve of war",
    brentUsd: 72,
    note: "NYT: $100 on 9 Sep is about 40 percent above the eve-of-war print.",
    receiptId: "nyt-brent-2026-09",
  },
  {
    year: 2026,
    label: "30 Apr peak",
    brentUsd: 126,
    note: "Reuters: Brent 126.41. Panic-band analog for a mined lane.",
    receiptId: "reuters-brent-2026-09",
  },
  {
    year: 2026,
    label: "June reopen talk",
    brentUsd: 72,
    note: "CNN: deal talk dumped the tape. Contracts move P. Steel does not.",
    receiptId: "nyt-brent-2026-09",
  },
  {
    year: 2026,
    label: "9 Sep print",
    brentUsd: 100,
    note: "The live market that day. This sim does not subscribe to it.",
    receiptId: "nyt-brent-2026-09",
  },
] as const;

export type LonLat = { lon: number; lat: number };

/**
 * JMIC Advisory 011-26 (27 Jun 2026) southern corridor waypoints.
 * This is the Omani-side rented lane after the IMO TSS got too hot.
 * It is not a surveyed chart. Overlay only.
 */
export const JMIC_INBOUND: LonLat[] = [
  { lat: 25.6083, lon: 56.439 },
  { lat: 25.9958, lon: 56.5775 },
  { lat: 26.3537, lon: 56.5808 },
  { lat: 26.386225, lon: 56.569875 },
  { lat: 26.407687, lon: 56.548928 },
  { lat: 26.427703, lon: 56.485472 },
  { lat: 26.4144, lon: 56.3558 },
  { lat: 26.326, lon: 56.2224 },
  { lat: 26.0543, lon: 55.9924 },
];

export const JMIC_OUTBOUND: LonLat[] = [
  { lat: 26.0455, lon: 56.0124 },
  { lat: 26.3191, lon: 56.2367 },
  { lat: 26.404333, lon: 56.359233 },
  { lat: 26.41655, lon: 56.4968 },
  { lat: 26.403533, lon: 56.540833 },
  { lat: 26.3495, lon: 56.5612 },
  { lat: 26.0, lon: 56.55 },
];

/**
 * North door. IRGC checkpoint water between Qeshm and Larak.
 * Iran did not mine this till. The field is the TSS.
 */
export const IRANIAN_INBOUND: LonLat[] = [
  { lat: 25.90, lon: 56.95 },
  { lat: 26.45, lon: 56.78 },
  { lat: 26.72, lon: 56.55 },
  { lat: 26.82, lon: 56.40 },
  { lat: 26.82, lon: 56.31 },
  { lat: 26.76, lon: 56.18 },
  { lat: 26.58, lon: 55.85 },
];

/** Extra lays stay in the TSS. Never the Qeshm-Larak till. */
export const LAY_SPOTS: LonLat[] = [
  { lat: 26.38, lon: 56.52 },
  { lat: 26.33, lon: 56.4 },
  { lat: 26.28, lon: 56.25 },
];

export const CLEARANCE = {
  holeFactor: 1,
  /** Two weeks so a second wait can finish the leftover devices. */
  expiresInTurns: 2,
  maxHolesPerWait: 3,
  /**
   * Sweep ribbon width. TSS usable water is about 6 nm. Not the till.
   * Green holes clip to DEEP_WATER, not the whole disk.
   */
  sweepBandNm: 6,
} as const;

/**
 * Deep water the Navy actually sweeps: Omani TSS and the JMIC southern
 * corridor. North of ~26.52N is Qeshm-Larak shallows. Holes do not bleach it.
 */
export const DEEP_WATER: LonLat[] = [
  { lat: 25.45, lon: 56.90 },
  { lat: 26.15, lon: 56.78 },
  { lat: 26.40, lon: 56.68 },
  { lat: 26.52, lon: 56.55 },
  { lat: 26.52, lon: 56.28 },
  { lat: 26.38, lon: 56.08 },
  { lat: 26.10, lon: 55.90 },
  { lat: 25.55, lon: 55.88 },
  { lat: 25.40, lon: 56.15 },
  { lat: 25.40, lon: 56.55 },
];

/**
 * Shot is boats and TELs, not the mine. Pay is a promise they will not
 * shoot. Escort cuts the shot, not the mine. A VLCC usually eats a
 * graze. Kill from a shot is rare.
 */
export const ATTACK = {
  omaniDrone: 0.2,
  omaniBoat: 0.12,
  /** Sum of drone plus boat. Naked Omani shot with radar and boats up. */
  omaniShot: 0.32,
  iranPaid: 0.06,
  iranNakedDrone: 0.14,
  iranNakedBoat: 0.08,
  iranNaked: 0.22,
  escortCoverPerWait: 0.35,
  escortCoverMax: 0.7,
  missWeight: 0.62,
  grazeWeight: 0.33,
  killWeight: 0.05,
  /** Dead radar. Drones guess. Boats and mines do not use this. */
  radarBlind: 0.4,
  grazeUsdMByBand: {
    cheap: 2,
    tolerable: 3,
    high: 5,
    panic: 7,
  },
} as const;

export const PLACES: Array<LonLat & { id: string; label: string }> = [
  { id: "bandar-abbas", lat: 27.183, lon: 56.267, label: "Bandar Abbas" },
  { id: "qeshm", lat: 26.82, lon: 55.95, label: "Qeshm" },
  { id: "hormuz", lat: 27.067, lon: 56.47, label: "Hormuz I." },
  { id: "larak", lat: 26.853, lon: 56.356, label: "Larak" },
  { id: "greater-tunb", lat: 26.264, lon: 55.305, label: "Greater Tunb" },
  { id: "abu-musa", lat: 25.879, lon: 55.023, label: "Abu Musa" },
  { id: "khasab", lat: 26.164, lon: 56.247, label: "Khasab" },
  { id: "musandam", lat: 26.22, lon: 56.4, label: "Musandam" },
  { id: "fujairah", lat: 25.123, lon: 56.326, label: "Fujairah" },
];

/** Chart labels. Water names sit in the wet parts of the crop so the pinch reads. */
export const WATER_LABELS: Array<LonLat & { id: string; label: string }> = [
  { id: "persian-gulf", lat: 26.48, lon: 55.28, label: "PERSIAN GULF" },
  { id: "strait", lat: 26.56, lon: 56.42, label: "STRAIT OF HORMUZ" },
  { id: "gulf-oman", lat: 25.38, lon: 56.98, label: "GULF OF OMAN" },
];

export const COUNTRY_LABELS: Array<LonLat & { id: string; label: string }> = [
  { id: "iran", lat: 27.28, lon: 55.72, label: "IRAN" },
  { id: "uae", lat: 25.38, lon: 55.48, label: "UAE" },
  { id: "oman", lat: 25.95, lon: 56.38, label: "OMAN" },
];

export const MATCH = {
  defaultSeed: 1,
  maxTurns: 12,
  defaultDraft: "vlcc" as DraftClass,
};

/**
 * Greece, Inc. Hull sticker is a 2026 newbuild teaching number. Freight
 * follows the price band, not a flat TCE. Family line is a lump claim.
 * Crew bonus is danger money after blood, not a payroll table. Cargo is
 * the trader's and does not sit on these books. Toll is the IRGC VLCC
 * floor. War-risk premium follows heat while paper is open. After a boom,
 * underwriters walk.
 */
export const COMPANY = {
  hullUsdM: 129,
  freightUsdM: 15,
  freightByBand: {
    cheap: 8,
    tolerable: 15,
    high: 22,
    panic: 28,
  },
  /**
   * Charterer "get the barrels out" bid. Not the oil. Scales with P
   * because 2 mb is worth more to the trader when Brent is fat.
   * High ~$9/bbl (TotalEnergies Hormuz extra). Panic is desperation.
   */
  traderBonusByBand: {
    cheap: 0,
    tolerable: 8,
    high: 18,
    panic: 20,
  },
  familyUsdM: 12,
  crew: 22,
  crewBonusUsdM: 2,
  cargoTraderUsdM: 150,
  /** IRGC VLCC floor. Bloomberg / Maritime Executive: about $1/bbl, $2M. */
  tollUsdM: 2,
  /**
   * Week you parked a leftover hull that could have been on Oman-China.
   * Not cash opex (~$10k/day, Moore 2024). Not MEG-China TCE (~$760k/day,
   * Lloyd's TD3C 8 Sep 2026). That TCE already sits in freight plus bonus
   * when a hull actually sails. Oil & Gas 360: Oman-China ~$220k/day.
   * Lloyd's GOO peak ~$358k. Teaching round $2M/week (~$286k/day).
   * Twelve leftover hulls still scale. You only send one a week. The other
   * eleven could have left the queue.
   */
  idleUsdMPerHull: 2,
  /**
   * Additional war-risk as percent of hull, turned into millions.
   * Cheap ~1.5% ($2M). Panic ~10% ($13M). Collapsed: cannot buy.
   */
  premiumByBand: {
    cheap: 2,
    tolerable: 6,
    high: 10,
    panic: 13,
  },
  fleet: {
    "reopen-lane": 12,
    "one-transit": 1,
    overplay: 5,
    "mine-warfare": 100,
  },
} as const;

/**
 * The owner, not the accountants. Never fund the next mine.
 * Wait until Omani mine and shot are both quiet, then sail Oman.
 * maxWaitWeeks is the charterer scream, not a third door.
 */
export const CEO = {
  maxMine: 0.15,
  maxShot: 0.12,
  maxWaitWeeks: 6,
} as const;

/**
 * Scripted traffic when the human is US or Iran, not the tanker.
 * Ten companies, 100 hulls. Four greedy houses count EV. Six wait for a
 * sweep. Once the till is the hotter mine field, even the greedy flip.
 */
export const TRAFFIC = {
  hulls: 100,
  companies: 10,
  pay: 4,
  wait: 6,
} as const;

/**
 * Factory prints into the warehouse. Warehouse dumps into the TSS.
 * Strike the plant, the +10 stops. Strike the sheds, the stack is gone
 * and the 3-at-a-time dump stops.
 */
export const MINES = {
  warehouseStart: 30,
  factoryPerTurn: 10,
  warehouseLay: 3,
} as const;

/**
 * Separate plant from the mine sheds. Radar blinds these, not mines.
 */
export const DRONES = {
  warehouseStart: 6,
  factoryPerTurn: 2,
} as const;

/**
 * Coastal cells, not Khojir glued onto the Hormuz photo.
 * Hit a ship, one of these shows. Strike it this week or it dumps.
 */
export const SPIDER = {
  stashMines: 4,
  stashDrones: 3,
  pits: [
    { lat: 26.82, lon: 55.95 },
    { lat: 26.264, lon: 55.305 },
    { lat: 25.879, lon: 55.023 },
    { lat: 25.64, lon: 57.77 },
  ] as const,
} as const;

/**
 * US strike nouns on the Iran board. Ideal order is for tests and
 * after-action only. Never print this sequence in player copy.
 * Spider holes are revealed, not a standing sixth lesson.
 */
export const STRIKE = {
  targets: [
    "mine-factory",
    "drone-factory",
    "mine-warehouse",
    "drone-warehouse",
    "radar",
    "port",
  ] as const,
  ideal: [
    "mine-factory",
    "drone-factory",
    "mine-warehouse",
    "drone-warehouse",
    "radar",
    "port",
  ] as const,
} as const;

/** Iran hinterland board. Not the strait crop. Hormuz sits in the SE corner. */
export const IRAN_MAP = {
  imageSrc: "/maps/iran-sentinel.jpg",
  credit:
    "Sentinel-2 cloudless 2024 by EOX. Contains modified Copernicus Sentinel data. CC BY 4.0.",
  widthPx: 1600,
  heightPx: 1400,
  westLon: 47,
  eastLon: 62,
  southLat: 25,
  northLat: 38,
} as const;

/**
 * Teaching nodes. Names only. Not a numbered plan.
 * Shahroud drones, Parchin mines, Isfahan drone sheds, Bandar mine sheds,
 * coastal radar, Bandar Abbas pier.
 */
export const STRIKE_NODES: Record<
  (typeof STRIKE.targets)[number],
  LonLat & { label: string }
> = {
  "mine-factory": { lat: 35.52, lon: 51.77, label: "Mine factory" },
  "drone-factory": { lat: 36.42, lon: 55.02, label: "Drone factory" },
  "mine-warehouse": { lat: 27.35, lon: 56.1, label: "Mine warehouse" },
  "drone-warehouse": { lat: 32.65, lon: 51.68, label: "Drone warehouse" },
  radar: { lat: 26.95, lon: 56.15, label: "Radar" },
  port: { lat: 27.183, lon: 56.267, label: "Port" },
};

/**
 * Magazines as remaining integers. A strike cuts refill or the stack.
 * Lasers spend first, then counter-drones. One intercept a week.
 */
export const MAGAZINE = {
  iranDrones: DRONES.warehouseStart,
  iranBoats: 4,
  iranMines: MINES.warehouseStart,
  usCounterDrones: 8,
  usLasers: 5,
  interceptPerWeek: 1,
} as const;

/**
 * Architect locks, 2026-09-09. These close ingest conflicts without
 * averaging transcripts. The sim uses one number per knob, cited here.
 * 1.4 vs 1.6 mb/d is the same faucet. Destroyer stickers and mine prices
 * are families (year, flight, weapon), not contradictions. Hull-count
 * flavor that said "120 warships" is speedboats. 17 is the pierside
 * warship slice at match start.
 */
export const FORCE = {
  /** Bandar Abbas slice. Real warships at the pier when the match starts. */
  warshipsPiersideStart: 17,
  /** Speedboats on the water. Resolves the 120-hull flavor. */
  facOnWater: 120,
  /** Shed inventory. A hull without the missile is a fishing boat. */
  facSheds: 1500,
  /** Iranian export through the door it sealed. 1.4 and 1.6 round to this. */
  exportMbd: 1.5,
} as const;

export const COST_FAMILY = {
  /** Contact mine, Samuel B. Roberts class. */
  mineM08Usd: 1500,
  /** Rocket-rising EM52 class. */
  mineEm52Usd: 15_000,
  /** Influence mine band. */
  mineInfluenceUsd: { min: 15_000, max: 60_000 },
  /**
   * Arleigh Burke sticker is a family by flight and year, not one number.
   * $1.8B, $2.1B, $2.5B can all be true.
   */
  destroyerUsdBn: { low: 1.8, high: 2.5 },
} as const;

export const OPEN_RESEARCH = {
  avenger:
    "Open. Navy Decoded LCS says last four left Bahrain Sep 2025. WarVision and Navy Response still put Pioneer and Chief in theater. Clearance stays rented either way.",
} as const;
