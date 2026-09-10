import { useState } from "react";
import { DRONES, IRAN_MAP, MAGAZINE, MAP, MINES, STRIKE, STRIKE_NODES } from "@/model/balance.ts";
import { COPY, clickToStrike, spiderTipLine } from "@/model/copy.ts";
import type { SpiderHole, StrikeTarget } from "@/model/types.ts";
import { cn } from "@/lib/cn.ts";

type Standing = (typeof STRIKE.targets)[number];

function nodePx(lat: number, lon: number): { x: number; y: number } {
  return {
    x: ((lon - IRAN_MAP.westLon) / (IRAN_MAP.eastLon - IRAN_MAP.westLon)) * IRAN_MAP.widthPx,
    y: ((IRAN_MAP.northLat - lat) / (IRAN_MAP.northLat - IRAN_MAP.southLat)) * IRAN_MAP.heightPx,
  };
}

function straitBox() {
  const x = ((MAP.westLon - IRAN_MAP.westLon) / (IRAN_MAP.eastLon - IRAN_MAP.westLon)) * IRAN_MAP.widthPx;
  const y = ((IRAN_MAP.northLat - MAP.northLat) / (IRAN_MAP.northLat - IRAN_MAP.southLat)) * IRAN_MAP.heightPx;
  const w = ((MAP.eastLon - MAP.westLon) / (IRAN_MAP.eastLon - IRAN_MAP.westLon)) * IRAN_MAP.widthPx;
  const h = ((MAP.northLat - MAP.southLat) / (IRAN_MAP.northLat - IRAN_MAP.southLat)) * IRAN_MAP.heightPx;
  return { x, y, w, h };
}

export function IranBoard({
  canAct,
  mineFactoryUp,
  droneFactoryUp,
  mineWarehouseUp,
  droneWarehouseUp,
  radarUp,
  portUp,
  spiderHoles,
  price,
  omaniKill,
  waiting,
  live,
  lost,
  magDrones,
  magCounter,
  magLasers,
  magMines,
  magBoats,
  onStrike,
  onOpenStrait,
}: {
  canAct: boolean;
  mineFactoryUp: boolean;
  droneFactoryUp: boolean;
  mineWarehouseUp: boolean;
  droneWarehouseUp: boolean;
  radarUp: boolean;
  portUp: boolean;
  spiderHoles: SpiderHole[];
  price: string;
  omaniKill: string;
  waiting: string;
  live: string;
  lost: string;
  magDrones: string;
  magCounter: string;
  magLasers: string;
  magMines: string;
  magBoats: string;
  onStrike: (target: StrikeTarget, pitId?: string) => void;
  onOpenStrait: () => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const up: Record<Standing, boolean> = {
    "mine-factory": mineFactoryUp,
    "drone-factory": droneFactoryUp,
    "mine-warehouse": mineWarehouseUp,
    "drone-warehouse": droneWarehouseUp,
    radar: radarUp,
    port: portUp,
  };
  const box = straitBox();
  const mineMax = Math.max(MINES.warehouseStart + MINES.factoryPerTurn, Number(magMines) || 0);
  const droneMax = Math.max(DRONES.warehouseStart + DRONES.factoryPerTurn, Number(magDrones) || 0);
  const spiderHover = spiderHoles.find((h) => h.id === hover) ?? null;
  const standingHover = (STRIKE.targets as readonly string[]).includes(hover ?? "")
    ? (hover as Standing)
    : null;

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-bg aspect-[1600/1400]">
      <img
        src={IRAN_MAP.imageSrc}
        alt="Iran hinterland. Shahroud north, Bandar Abbas on the south lip, Hormuz in the southeast corner."
        className="map-photo pointer-events-none absolute inset-0 size-full object-cover object-center"
      />
      <svg
        viewBox={`0 0 ${IRAN_MAP.widthPx} ${IRAN_MAP.heightPx}`}
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 size-full"
        role="img"
        aria-label="Iran strike nodes"
      >
        <title>Iran industry</title>
        <rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          className="fill-lane/10 stroke-lane"
          strokeWidth={4}
          strokeDasharray="14 10"
        />
        <text
          x={box.x + box.w / 2}
          y={box.y - 16}
          textAnchor="middle"
          className="fill-lane"
          fontSize={28}
          fontFamily="IBM Plex Sans, sans-serif"
        >
          {COPY.tabStrait}
        </text>
        {STRIKE.targets.map((id) => {
          const n = STRIKE_NODES[id];
          const p = nodePx(n.lat, n.lon);
          const liveNode = up[id];
          const hot = hover === id && liveNode;
          return (
            <g key={id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hot ? 42 : 32}
                className={
                  liveNode
                    ? hot
                      ? "fill-accent stroke-accent-fg"
                      : "fill-accent/80 stroke-accent-fg"
                    : "fill-faint/80 stroke-border"
                }
                strokeWidth={hot ? 5 : 3}
              />
              <text
                x={p.x}
                y={p.y - 52}
                textAnchor="middle"
                className="fill-fg"
                fontSize={28}
                fontFamily="IBM Plex Sans, sans-serif"
              >
                {liveNode ? n.label : `${n.label} ${COPY.nodeDown}`}
              </text>
            </g>
          );
        })}
        {spiderHoles.map((h) => {
          const p = nodePx(h.lat, h.lon);
          const hot = hover === h.id;
          return (
            <g key={h.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hot ? 40 : 30}
                className={hot ? "fill-danger stroke-accent-fg" : "fill-danger/80 stroke-danger"}
                strokeWidth={hot ? 5 : 3}
              />
              <text
                x={p.x}
                y={p.y - 48}
                textAnchor="middle"
                className="fill-fg"
                fontSize={26}
                fontFamily="IBM Plex Sans, sans-serif"
              >
                {COPY.spiderHole}
              </text>
            </g>
          );
        })}
      </svg>
      {STRIKE.targets.map((id) => {
        const n = STRIKE_NODES[id];
        const p = nodePx(n.lat, n.lon);
        const liveNode = up[id];
        return (
          <button
            key={`hit-${id}`}
            type="button"
            disabled={!canAct || !liveNode}
            onClick={() => onStrike(id)}
            onPointerEnter={() => setHover(id)}
            onPointerLeave={() => setHover(null)}
            className={cn(
              "absolute z-10 min-h-14 min-w-14 -translate-x-1/2 -translate-y-1/2 rounded-full",
              canAct && liveNode ? "cursor-pointer" : "cursor-default",
            )}
            style={{
              left: `${(p.x / IRAN_MAP.widthPx) * 100}%`,
              top: `${(p.y / IRAN_MAP.heightPx) * 100}%`,
            }}
            aria-label={clickToStrike(n.label)}
          />
        );
      })}
      {spiderHoles.map((h) => {
        const p = nodePx(h.lat, h.lon);
        return (
          <button
            key={`hit-${h.id}`}
            type="button"
            disabled={!canAct}
            onClick={() => onStrike("spider-hole", h.id)}
            onPointerEnter={() => setHover(h.id)}
            onPointerLeave={() => setHover(null)}
            className="absolute z-10 min-h-14 min-w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${(p.x / IRAN_MAP.widthPx) * 100}%`,
              top: `${(p.y / IRAN_MAP.heightPx) * 100}%`,
            }}
            aria-label={clickToStrike(COPY.spiderHole)}
          />
        );
      })}
      {standingHover && up[standingHover] ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-20 w-max max-w-[14rem] -translate-x-1/2 -translate-y-[calc(100%+1.75rem)] rounded-md border border-accent bg-bg/95 px-2 py-1.5 text-fg shadow-sm"
          style={{
            left: `${(nodePx(STRIKE_NODES[standingHover].lat, STRIKE_NODES[standingHover].lon).x / IRAN_MAP.widthPx) * 100}%`,
            top: `${(nodePx(STRIKE_NODES[standingHover].lat, STRIKE_NODES[standingHover].lon).y / IRAN_MAP.heightPx) * 100}%`,
          }}
        >
          <p className="font-mono text-xs text-accent">{clickToStrike(STRIKE_NODES[standingHover].label)}</p>
        </div>
      ) : null}
      {spiderHover ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-20 w-max max-w-[14rem] -translate-x-1/2 -translate-y-[calc(100%+1.75rem)] rounded-md border border-danger bg-bg/95 px-2 py-1.5 text-fg shadow-sm"
          style={{
            left: `${(nodePx(spiderHover.lat, spiderHover.lon).x / IRAN_MAP.widthPx) * 100}%`,
            top: `${(nodePx(spiderHover.lat, spiderHover.lon).y / IRAN_MAP.heightPx) * 100}%`,
          }}
        >
          <p className="font-mono text-xs text-danger">{clickToStrike(COPY.spiderHole)}</p>
          <p className="mt-1 font-mono text-2xs text-muted">{spiderTipLine(spiderHover)}</p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={onOpenStrait}
        className="absolute z-10 min-h-11 -translate-x-1/2 rounded-md border border-lane bg-bg/90 px-3 font-mono text-xs text-lane"
        style={{
          left: `${((box.x + box.w / 2) / IRAN_MAP.widthPx) * 100}%`,
          top: `${((box.y + box.h / 2) / IRAN_MAP.heightPx) * 100}%`,
        }}
      >
        {COPY.openStrait}
      </button>
      <div className="absolute left-2 top-2 z-10 max-w-[11rem] rounded-md border border-border bg-surface/90 px-3 py-2">
        <p className="font-mono text-2xs uppercase tracking-widest text-accent">{COPY.laneChip}</p>
        <dl className="mt-1 space-y-0.5 font-mono text-2xs tabular-nums">
          <div className="flex justify-between gap-3">
            <dt className="text-faint">P</dt>
            <dd>{price}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-faint">Omani</dt>
            <dd>{omaniKill}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-faint">Waiting</dt>
            <dd>{waiting}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-faint">Live</dt>
            <dd>
              {live} · {lost} lost
            </dd>
          </div>
        </dl>
      </div>
      <div className="absolute right-2 top-2 z-10 w-[11rem] space-y-1.5 rounded-md border border-border bg-surface/90 px-3 py-2">
        <MagBar k={COPY.magMines} v={Number(magMines)} max={mineMax} tone="danger" />
        <MagBar k={COPY.magDrones} v={Number(magDrones)} max={droneMax} tone="danger" />
        <MagBar k={COPY.magBoats} v={Number(magBoats)} max={MAGAZINE.iranBoats} tone="danger" />
        <MagBar k={COPY.magCounter} v={Number(magCounter)} max={MAGAZINE.usCounterDrones} tone="lane" />
        <MagBar k={COPY.magLasers} v={Number(magLasers)} max={MAGAZINE.usLasers} tone="ok" />
      </div>
      <p className="absolute bottom-[7.25rem] left-2 right-2 z-10 font-mono text-2xs text-accent sm:bottom-[7.5rem]">
        {COPY.strikeMarks}
      </p>
      <div className="absolute bottom-2 left-2 right-2 z-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STRIKE.targets.map((id) => {
          const n = STRIKE_NODES[id];
          const liveNode = up[id];
          return (
            <button
              key={`chip-${id}`}
              type="button"
              disabled={!canAct || !liveNode}
              onPointerEnter={() => setHover(id)}
              onPointerLeave={() => setHover(null)}
              onClick={() => onStrike(id)}
              className={cn(
                "min-h-11 rounded-md border px-3 text-sm",
                liveNode
                  ? "border-accent bg-surface/90 text-fg disabled:opacity-50"
                  : "border-border bg-surface-2 text-faint",
              )}
            >
              {liveNode ? `${COPY.usStrike} ${n.label}` : `${n.label} ${COPY.nodeDown}`}
            </button>
          );
        })}
        {spiderHoles.map((h) => (
          <button
            key={`chip-${h.id}`}
            type="button"
            disabled={!canAct}
            onPointerEnter={() => setHover(h.id)}
            onPointerLeave={() => setHover(null)}
            onClick={() => onStrike("spider-hole", h.id)}
            className="min-h-11 rounded-md border border-danger bg-surface/90 px-3 text-sm text-fg disabled:opacity-50"
          >
            {COPY.usStrike} {COPY.spiderHole}
          </button>
        ))}
      </div>
    </div>
  );
}

function MagBar({
  k,
  v,
  max,
  tone,
}: {
  k: string;
  v: number;
  max: number;
  tone: "ok" | "danger" | "lane";
}) {
  const pct = max <= 0 ? 0 : Math.min(100, (Math.max(0, v) / max) * 100);
  return (
    <div>
      <div className="flex justify-between font-mono text-2xs">
        <span className="text-faint">{k}</span>
        <span className="tabular-nums">{v}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-sm bg-bg">
        <div
          className={cn(
            "h-full rounded-sm",
            tone === "danger" ? "bg-danger" : tone === "ok" ? "bg-ok" : "bg-lane",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
