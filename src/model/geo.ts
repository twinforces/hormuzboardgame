/**
 * Sim space is nautical miles. Pixels are a View problem.
 * Clip tests never look at the NASA photo. The photo is scenery.
 */

import {
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
  let clipNm = polylineCircleClipNm(path, mine.center, r);
  const own = mine.hole
    ? [{ center: mine.center, radiusNm: mine.hole.radiusNm }, ...holes]
    : holes;
  const seen = new Set<string>();
  for (const h of own) {
    const key = `${h.center.xNm}:${h.center.yNm}:${h.radiusNm}`;
    if (seen.has(key)) continue;
    seen.add(key);
    clipNm = Math.max(0, clipNm - polylineCircleClipNm(path, h.center, h.radiusNm));
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

export function combinedKillChance(
  path: NmPolyline,
  mines: MineCircle[],
  draft: DraftClass,
): { chance: number; clips: Array<{ id: string; clipNm: number; chance: number }> } {
  const holes = mineHoles(mines);
  const clips = mines.map((m) => ({
    id: m.id,
    ...killChanceForCircle(path, m, draft, holes),
  }));
  // Independent mines. Survival is the product of (1 - each).
  let survive = 1;
  for (const c of clips) survive *= 1 - c.chance;
  return { chance: 1 - survive, clips };
}
