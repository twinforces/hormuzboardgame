/**
 * Sim space is nautical miles. Pixels are a View problem.
 * Clip tests never look at the NASA photo. The photo is scenery.
 */

import {
  CLEARANCE,
  DEEP_WATER,
  MAP,
  MINE,
  NM_PER_DEG_LAT,
  NM_PER_DEG_LON,
  killPerNm,
  radiusNm,
  type LonLat,
} from "./balance.ts";
import type { DraftClass, MineCircle, NmPoint, NmPolyline } from "./types.ts";

export function lonLatToNm(p: LonLat): NmPoint {
  return {
    xNm: (p.lon - MAP.westLon) * NM_PER_DEG_LON,
    yNm: (p.lat - MAP.southLat) * NM_PER_DEG_LAT,
  };
}

export function nmToLonLat(p: NmPoint): LonLat {
  return {
    lon: MAP.westLon + p.xNm / NM_PER_DEG_LON,
    lat: MAP.southLat + p.yNm / NM_PER_DEG_LAT,
  };
}

export function nmToPx(p: NmPoint): { x: number; y: number } {
  const { lon, lat } = nmToLonLat(p);
  return {
    x: ((lon - MAP.westLon) / (MAP.eastLon - MAP.westLon)) * MAP.widthPx,
    y: ((MAP.northLat - lat) / (MAP.northLat - MAP.southLat)) * MAP.heightPx,
  };
}

export function pxToNm(x: number, y: number): NmPoint {
  const lon = MAP.westLon + (x / MAP.widthPx) * (MAP.eastLon - MAP.westLon);
  const lat = MAP.northLat - (y / MAP.heightPx) * (MAP.northLat - MAP.southLat);
  return lonLatToNm({ lon, lat });
}

export function nmRadiusToPx(rNm: number): { rx: number; ry: number } {
  const widthNm = (MAP.eastLon - MAP.westLon) * NM_PER_DEG_LON;
  const heightNm = (MAP.northLat - MAP.southLat) * NM_PER_DEG_LAT;
  return {
    rx: (rNm / widthNm) * MAP.widthPx,
    ry: (rNm / heightNm) * MAP.heightPx,
  };
}

export function distNm(a: NmPoint, b: NmPoint): number {
  const dx = a.xNm - b.xNm;
  const dy = a.yNm - b.yNm;
  return Math.hypot(dx, dy);
}

/**
 * Tightest fog blob that contains p. Location fog, not Iran's magazine.
 * The View hovers with this so mine ellipses do not steal door clicks.
 */
export function pickMine(mines: MineCircle[], p: NmPoint): MineCircle | null {
  let best: MineCircle | null = null;
  let bestR = Infinity;
  for (const m of mines) {
    const r = radiusNm(m.radiusSteps);
    if (distNm(p, m.center) <= r && r < bestR) {
      best = m;
      bestR = r;
    }
  }
  return best;
}

export function polylineLengthNm(path: NmPolyline): number {
  let n = 0;
  for (let i = 1; i < path.length; i++) {
    n += distNm(path[i - 1]!, path[i]!);
  }
  return n;
}

/**
 * Length of segment AB that sits inside circle C,r.
 * Quadratic in the unit interval. Both-inside is the cheap path.
 */
export function segmentCircleClipNm(
  a: NmPoint,
  b: NmPoint,
  c: NmPoint,
  r: number,
): number {
  const dx = b.xNm - a.xNm;
  const dy = b.yNm - a.yNm;
  const len = Math.hypot(dx, dy);
  if (len === 0) return 0;

  const inside = (p: NmPoint) => distNm(p, c) <= r + 1e-9;
  if (inside(a) && inside(b)) return len;

  const fx = a.xNm - c.xNm;
  const fy = a.yNm - c.yNm;
  const A = dx * dx + dy * dy;
  const B = 2 * (fx * dx + fy * dy);
  const C = fx * fx + fy * fy - r * r;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return 0;

  const s = Math.sqrt(disc);
  let t1 = (-B - s) / (2 * A);
  let t2 = (-B + s) / (2 * A);
  if (t1 > t2) {
    const tmp = t1;
    t1 = t2;
    t2 = tmp;
  }
  const lo = Math.max(0, t1);
  const hi = Math.min(1, t2);
  if (hi <= lo) return 0;
  return (hi - lo) * len;
}

export function polylineCircleClipNm(
  path: NmPolyline,
  c: NmPoint,
  r: number,
): number {
  let n = 0;
  for (let i = 1; i < path.length; i++) {
    n += segmentCircleClipNm(path[i - 1]!, path[i]!, c, r);
  }
  return n;
}

export function pointSegDistNm(p: NmPoint, a: NmPoint, b: NmPoint): number {
  const dx = b.xNm - a.xNm;
  const dy = b.yNm - a.yNm;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return distNm(p, a);
  let t = ((p.xNm - a.xNm) * dx + (p.yNm - a.yNm) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return distNm(p, { xNm: a.xNm + t * dx, yNm: a.yNm + t * dy });
}

export function pathNearPolyline(
  path: NmPolyline,
  line: NmPolyline,
  bandNm: number,
): boolean {
  for (const p of path) {
    for (let i = 1; i < line.length; i++) {
      if (pointSegDistNm(p, line[i - 1]!, line[i]!) <= bandNm) return true;
    }
  }
  return false;
}

export function killChanceForCircle(
  path: NmPolyline,
  mine: MineCircle,
  draft: DraftClass,
  holes: Array<{ center: NmPoint; radiusNm: number }> = [],
): { clipNm: number; chance: number } {
  const r = radiusNm(mine.radiusSteps);
  if (mineFogCovered(mine, holes)) return { clipNm: 0, chance: 0 };
  let clipNm = polylineCircleClipNm(path, mine.center, r);
  if (mine.hole) {
    clipNm = Math.max(
      0,
      clipNm - polylineCircleClipNm(path, mine.center, mine.hole.radiusNm),
    );
  }
  if (clipNm <= 0) return { clipNm: 0, chance: 0 };
  const chance = Math.min(
    1,
    clipNm * killPerNm(mine.radiusSteps) * MINE.draftFactor[draft],
  );
  return { clipNm, chance };
}

export function mineHoles(
  mines: MineCircle[],
): Array<{ center: NmPoint; radiusNm: number }> {
  return mines.flatMap((m) =>
    m.hole ? [{ center: m.center, radiusNm: m.hole.radiusNm }] : [],
  );
}

/** True when a green sweep fully covers this fog blob. Red should not exist. */
export function mineFogCovered(
  mine: MineCircle,
  holes: Array<{ center: NmPoint; radiusNm: number }>,
): boolean {
  const r = radiusNm(mine.radiusSteps);
  return holes.some(
    (h) => distNm(mine.center, h.center) + r <= h.radiusNm + 1e-6,
  );
}

export function minDistToPath(p: NmPoint, path: NmPolyline): number {
  if (path.length === 0) return Infinity;
  if (path.length === 1) return distNm(p, path[0]!);
  let d = Infinity;
  for (let i = 1; i < path.length; i++) {
    d = Math.min(d, pointSegDistNm(p, path[i - 1]!, path[i]!));
  }
  return d;
}

/** Ray-cast. Sim space. Deep water is a lon/lat polygon converted once. */
export function pointInPoly(p: NmPoint, poly: NmPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!;
    const b = poly[j]!;
    const hit =
      a.yNm > p.yNm !== b.yNm > p.yNm &&
      p.xNm < ((b.xNm - a.xNm) * (p.yNm - a.yNm)) / (b.yNm - a.yNm + 1e-12) + a.xNm;
    if (hit) inside = !inside;
  }
  return inside;
}

const DEEP_WATER_NM: NmPoint[] = DEEP_WATER.map(lonLatToNm);

export function inDeepWater(p: NmPoint): boolean {
  return pointInPoly(p, DEEP_WATER_NM);
}

/** Navy sweep: Omani ribbon or the deep-water polygon. Not the till. */
export function inSweepZone(p: NmPoint, sweepPath: NmPolyline): boolean {
  if (inDeepWater(p)) return true;
  return minDistToPath(p, sweepPath) <= CLEARANCE.sweepBandNm;
}

export type FogPaint = {
  black: number;
  white: number;
  chance: number;
};

/**
 * Remaining mine fog on this door. Walk the lane. Paint unswept fog
 * black, punch Navy holes white only on the sweep ribbon. Water in the
 * fog neighborhood counts so a grazed till is not 100%. Overlaps are
 * union. No canvas. Model cannot import DOM.
 */
export function paintFogField(
  path: NmPolyline,
  mines: MineCircle[],
  draft: DraftClass,
  sweepPath: NmPolyline = path,
): FogPaint {
  if (path.length < 2 || mines.length === 0) {
    return { black: 0, white: 0, chance: 0 };
  }
  const holes = mineHoles(mines);
  const band = MINE.tssBandNm;
  const step = MINE.fieldSampleNm;
  const disks = mines.map((m) => ({
    center: m.center,
    r: radiusNm(m.radiusSteps),
  }));
  let black = 0;
  let white = 0;
  let open = 0;

  function nearField(p: NmPoint): boolean {
    for (const d of disks) {
      if (distNm(p, d.center) <= d.r + band) return true;
    }
    return false;
  }

  function classify(p: NmPoint) {
    if (!nearField(p)) return;
    let inMine = false;
    for (const d of disks) {
      if (distNm(p, d.center) <= d.r + 1e-9) {
        inMine = true;
        break;
      }
    }
    if (!inMine) {
      open += 1;
      return;
    }
    let swept = false;
    for (const h of holes) {
      if (distNm(p, h.center) > h.radiusNm + 1e-9) continue;
      if (inSweepZone(p, sweepPath)) {
        swept = true;
        break;
      }
    }
    if (swept) white += 1;
    else black += 1;
  }

  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]!;
    const b = path[i]!;
    const dx = b.xNm - a.xNm;
    const dy = b.yNm - a.yNm;
    const len = Math.hypot(dx, dy);
    if (len < 1e-9) continue;
    const nx = -dy / len;
    const ny = dx / len;
    for (let s = 0; s <= len; s += step) {
      const t = s / len;
      const cx = a.xNm + t * dx;
      const cy = a.yNm + t * dy;
      for (let o = -band; o <= band; o += step) {
        classify({ xNm: cx + nx * o, yNm: cy + ny * o });
      }
    }
  }
  const lane = black + white + open;
  if (lane <= 0) return { black: 0, white: 0, chance: 0 };
  const chance = Math.min(1, (black / lane) * MINE.draftFactor[draft]);
  return { black, white, chance };
}

export function combinedKillChance(
  path: NmPolyline,
  mines: MineCircle[],
  draft: DraftClass,
  sweepPath?: NmPolyline,
): { chance: number; clips: Array<{ id: string; clipNm: number; chance: number }> } {
  const holes = mineHoles(mines);
  const clips = mines.map((m) => ({
    id: m.id,
    ...killChanceForCircle(path, m, draft, holes),
  }));
  const { chance } = paintFogField(path, mines, draft, sweepPath ?? path);
  return { chance, clips };
}
