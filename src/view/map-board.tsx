import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { GameState, MineCircle, NmPolyline } from "@/model/types.ts";
import { IRANIAN_INBOUND, JMIC_INBOUND, JMIC_OUTBOUND, DEEP_WATER, MAP, PLACES, WATER_LABELS, COUNTRY_LABELS, radiusNm } from "@/model/balance.ts";
import { COPY, fogTip } from "@/model/copy.ts";
import { lonLatToNm, mineHoles, nmRadiusToPx, nmToPx, pickMine, pxToNm } from "@/model/geo.ts";
import { cn } from "@/lib/cn.ts";

/** Visible crop height in viewBox units. Matches aspect-[2016/1220] + object-top. */
const CHART_VIEW_H = 1220;

type Props = {
  state: GameState;
  price: string;
  band: string;
  insurance: string;
  turn: string;
  navyPunched: string;
  fogBlobs: string;
  holesOpen: string;
  beat: string;
  canAct: boolean;
  doorsOpen: boolean;
  recommended: "wait" | "omani" | "iran" | "none";
  boardAct: string;
  omaniKill: string;
  iranKill: string;
  omaniShot: string;
  iranShot: string;
  onWait: () => void;
  onOmani: () => void;
  onIran: () => void;
  onBoardAct: () => void;
  onPlanStrikes?: () => void;
};

function polyPoints(path: NmPolyline): string {
  return path
    .map((p) => {
      const { x, y } = nmToPx(p);
      return `${x},${y}`;
    })
    .join(" ");
}

function polyD(path: NmPolyline): string {
  return path
    .map((p, i) => {
      const { x, y } = nmToPx(p);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

const DOOR_LABELS = [
  { id: "omani-door", label: COPY.omaniDoor, lat: 26.14, lon: 56.25, fill: "fill-lane" },
  { id: "iran-door", label: COPY.iranDoor, lat: 26.82, lon: 56.31, fill: "fill-danger" },
] as const;

const OMANI_PARK = lonLatToNm({ lat: 26.12, lon: 56.22 });

export function MapBoard({
  state,
  price,
  band,
  insurance,
  turn,
  navyPunched,
  fogBlobs,
  holesOpen,
  beat,
  canAct,
  doorsOpen,
  recommended,
  boardAct,
  omaniKill,
  iranKill,
  omaniShot,
  iranShot,
  onOmani,
  onIran,
  onBoardAct,
  onPlanStrikes,
}: Props) {
  const lastPath = state.tankerPath;
  const scale = nmRadiusToPx(10);
  const scaleOrigin = { x: 90, y: 1140 };
  const collapsed = state.insurance === "collapsed";
  const running = lastPath.length >= 2 && (state.lastDoor === "omani" || state.lastDoor === "iran");
  const [hoverMine, setHoverMine] = useState<string | null>(null);
  const [pinnedMine, setPinnedMine] = useState<string | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const activeMineId = hoverMine ?? pinnedMine;
  const activeMine = state.mines.find((m) => m.id === activeMineId) ?? null;

  useEffect(() => {
    if (imgRef.current?.complete) setChartReady(true);
  }, []);

  function toggleMine(id: string) {
    setPinnedMine((cur) => (cur === id ? null : id));
  }

  function pointerNm(e: PointerEvent<HTMLDivElement> | { currentTarget: HTMLDivElement; clientX: number; clientY: number }) {
    return pointerToNm(e.currentTarget, e.clientX, e.clientY);
  }

  return (
    <figure className="relative overflow-hidden rounded-lg border border-border bg-surface">
      {onPlanStrikes ? (
        <div className="flex justify-center border-b border-border px-3 py-2">
          <button
            type="button"
            onClick={onPlanStrikes}
            className="min-h-11 rounded-md border border-accent bg-surface-2 px-4 font-mono text-xs text-accent transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            {COPY.planStrikes}
          </button>
        </div>
      ) : null}
      <div
        className="relative aspect-[2016/1220] w-full"
        onPointerMove={(e) => {
          const hit = pickMine(state.mines, pointerNm(e));
          const id = hit?.id ?? null;
          setHoverMine((cur) => (cur === id ? cur : id));
        }}
        onPointerLeave={() => setHoverMine(null)}
        onClick={(e) => {
          const hit = pickMine(state.mines, pointerNm(e));
          if (hit) toggleMine(hit.id);
          else setPinnedMine(null);
        }}
      >
        <img
          ref={imgRef}
          src={MAP.imageSrc}
          alt="Sentinel-2 crop of the Strait of Hormuz. Iran north, UAE southwest, Musandam is Oman."
          width={MAP.widthPx}
          height={CHART_VIEW_H}
          className="map-photo absolute inset-0 size-full object-cover object-top"
          draggable={false}
          onLoad={() => setChartReady(true)}
        />
        {!chartReady ? (
          <div className="absolute inset-0 z-20 grid place-items-center bg-surface/80 font-mono text-sm text-muted">
            {COPY.chartLoading}
          </div>
        ) : null}
        <svg
          viewBox={`0 0 ${MAP.widthPx} ${CHART_VIEW_H}`}
          preserveAspectRatio="xMidYMin slice"
          className="absolute inset-0 size-full"
          role="img"
          aria-label="Hormuz doors, tanker hull, and mine fog"
        >
          <title>Strait of Hormuz doors</title>
          <g className="pointer-events-none">
          <defs>
            <clipPath id="deep-water-clip">
              <polygon
                points={DEEP_WATER.map((p) => {
                  const c = nmToPx(lonLatToNm(p));
                  return `${c.x},${c.y}`;
                }).join(" ")}
              />
            </clipPath>
            <mask
              id="water-clip"
              maskUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={MAP.widthPx}
              height={CHART_VIEW_H}
            >
              <image
                href={MAP.waterMaskSrc}
                x={0}
                y={0}
                width={MAP.widthPx}
                height={CHART_VIEW_H}
                preserveAspectRatio="none"
              />
            </mask>
          </defs>
          {(() => {
            const holes = mineHoles(state.mines);
            return (
              <>
                <g mask="url(#water-clip)">
                {state.mines.map((m) => {
                  const c = nmToPx(m.center);
                  const r = nmRadiusToPx(radiusNm(m.radiusSteps));
                  const hot = state.lastDetonatedMineId === m.id;
                  const inspect = m.id === activeMineId;
                  const laidNow = m.laidTurn === state.turn;
                  return (
                    <ellipse
                      key={m.id}
                      cx={c.x}
                      cy={c.y}
                      rx={r.rx}
                      ry={r.ry}
                      className={cn(
                        hot
                          ? "fill-danger/30 stroke-danger"
                          : inspect
                            ? "fill-danger/20 stroke-accent"
                            : "fill-danger/10 stroke-danger/75",
                        laidNow && "fog-laid",
                      )}
                      strokeWidth={hot || inspect ? 4 : 3}
                    />
                  );
                })}
                </g>
                <g clipPath="url(#deep-water-clip)">
                  {holes.map((h, i) => {
                    const hc = nmToPx(h.center);
                    const hr = nmRadiusToPx(h.radiusNm);
                    return (
                      <ellipse
                        key={`hole-${i}`}
                        cx={hc.x}
                        cy={hc.y}
                        rx={hr.rx}
                        ry={hr.ry}
                        className="fog-hole fill-ok/25 stroke-ok"
                        strokeWidth={4}
                        strokeDasharray="10 7"
                      />
                    );
                  })}
                </g>
              </>
            );
          })()}
          </g>
          <CorridorHit
            path={JMIC_INBOUND}
            canAct={doorsOpen}
            label={COPY.clickOmani}
            tone="lane"
            dash="16 10"
            onPick={onOmani}
          />
          <g className="pointer-events-none fill-none stroke-lane" strokeWidth={4} opacity={0.45}>
            <polyline
              points={polyPoints(JMIC_OUTBOUND.map(lonLatToNm))}
              strokeDasharray="6 10"
            />
          </g>
          <CorridorHit
            path={IRANIAN_INBOUND}
            canAct={doorsOpen}
            label={COPY.clickIran}
            tone="danger"
            dash="5 10"
            onPick={onIran}
          />
          <g className="pointer-events-none">
          {lastPath.length >= 2 ? (
            <path
              id="tanker-run"
              d={polyD(lastPath)}
              fill="none"
              className={state.hullFactor === 0 ? "stroke-danger" : "stroke-ok"}
              strokeWidth={6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}
          {COUNTRY_LABELS.map((place) => {
            const c = nmToPx(lonLatToNm(place));
            return (
              <ChartLabel
                key={place.id}
                x={c.x}
                y={c.y}
                size={34}
                fill="fill-fg/85"
                anchor="middle"
              >
                {place.label}
              </ChartLabel>
            );
          })}
          {WATER_LABELS.map((place) => {
            const c = nmToPx(lonLatToNm(place));
            return (
              <ChartLabel
                key={place.id}
                x={c.x}
                y={c.y}
                size={30}
                fill="fill-lane"
                anchor="middle"
                tracking
              >
                {place.label}
              </ChartLabel>
            );
          })}
          {PLACES.map((place) => {
            const c = nmToPx(lonLatToNm(place));
            const below = place.lat > 27.05;
            return (
              <g key={place.id}>
                <circle cx={c.x} cy={c.y} r={3} className="fill-fg/80 stroke-bg" strokeWidth={1} />
                <ChartLabel
                  x={c.x + 8}
                  y={below ? c.y + 28 : c.y - 8}
                  size={26}
                  fill="fill-fg/90"
                >
                  {place.label}
                </ChartLabel>
              </g>
            );
          })}
          {DOOR_LABELS.map((place) => {
            const c = nmToPx(lonLatToNm(place));
            return (
              <ChartLabel
                key={place.id}
                x={c.x}
                y={c.y}
                size={32}
                fill={place.fill}
                anchor="middle"
                tracking
              >
                {place.label}
              </ChartLabel>
            );
          })}
          <HullMarker
            running={running}
            path={lastPath}
            door={state.lastDoor}
            alive={state.hullFactor === 1}
            turn={state.turn}
          />
          <g>
            <line
              x1={scaleOrigin.x}
              y1={scaleOrigin.y}
              x2={scaleOrigin.x + scale.rx}
              y2={scaleOrigin.y}
              className="stroke-accent"
              strokeWidth={4}
            />
            <text
              x={scaleOrigin.x}
              y={scaleOrigin.y - 12}
              className="fill-accent stroke-bg"
              fontSize={28}
              fontFamily="IBM Plex Mono, monospace"
              strokeWidth={4}
              paintOrder="stroke"
            >
              10 nm
            </text>
          </g>
          </g>
        </svg>
        <IntelHud
          navyPunched={navyPunched}
          fogBlobs={fogBlobs}
          holesOpen={holesOpen}
          beat={beat}
        />
        <PriceOverlay
          price={price}
          band={band}
          insurance={insurance}
          turn={turn}
          collapsed={collapsed}
        />
        {activeMine ? <MineTip mine={activeMine} /> : null}
        <DoorChip
          lat={26.14}
          lon={56.25}
          label={COPY.omaniDoor}
          sub={`${omaniKill} ${COPY.mineKill} · ${omaniShot} ${COPY.shotKill}`}
          tone="lane"
          canAct={doorsOpen}
          hot={recommended === "omani"}
          onPick={onOmani}
        />
        <DoorChip
          lat={26.82}
          lon={56.31}
          label={COPY.iranDoor}
          sub={`${iranKill} ${COPY.mineKill} · ${iranShot} ${COPY.shotKill}`}
          tone="danger"
          canAct={doorsOpen}
          hot={recommended === "iran"}
          onPick={onIran}
        />
        {canAct && recommended !== "none" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBoardAct();
            }}
            className="absolute bottom-20 left-2 z-10 max-w-[min(calc(100%-1rem),16rem)] min-h-11 rounded-md border border-accent bg-accent px-3 py-2 text-left font-mono text-xs text-accent-fg shadow-sm transition-transform duration-150 ease-out active:scale-[0.96] md:bottom-3"
          >
            {boardAct}
          </button>
        ) : null}
      </div>
      <figcaption className="border-t border-border px-3 py-2 font-mono text-2xs text-faint">
        <span className="block">{COPY.orientation}</span>
        <span className="mt-1 block">{COPY.navyNote}</span>
      </figcaption>
    </figure>
  );
}

function visStyle(lat: number, lon: number): { left: string; top: string } {
  const { x, y } = nmToPx(lonLatToNm({ lat, lon }));
  return visStylePx(x, y);
}

function visStyleNm(p: { xNm: number; yNm: number }): { left: string; top: string } {
  const { x, y } = nmToPx(p);
  return visStylePx(x, y);
}

function visStylePx(x: number, y: number): { left: string; top: string } {
  return {
    left: `${(x / MAP.widthPx) * 100}%`,
    top: `${(y / CHART_VIEW_H) * 100}%`,
  };
}

function pointerToNm(el: HTMLElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect();
  const x = ((clientX - rect.left) / Math.max(rect.width, 1)) * MAP.widthPx;
  const y = ((clientY - rect.top) / Math.max(rect.height, 1)) * CHART_VIEW_H;
  return pxToNm(x, y);
}

function doorKey(e: KeyboardEvent, onPick: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    onPick();
  }
}

function CorridorHit({
  path,
  canAct,
  label,
  tone,
  dash,
  onPick,
}: {
  path: Array<{ lat: number; lon: number }>;
  canAct: boolean;
  label: string;
  tone: "lane" | "danger";
  dash: string;
  onPick: () => void;
}) {
  const [hot, setHot] = useState(false);
  const live = canAct && hot;
  const points = polyPoints(path.map(lonLatToNm));
  return (
    <g
      role={canAct ? "button" : undefined}
      tabIndex={canAct ? 0 : undefined}
      aria-label={label}
      aria-disabled={canAct ? undefined : true}
      className={canAct ? "cursor-pointer outline-none" : "pointer-events-none"}
      onClick={
        canAct
          ? (e) => {
              e.stopPropagation();
              onPick();
            }
          : undefined
      }
      onKeyDown={canAct ? (e) => doorKey(e, onPick) : undefined}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <polyline
        points={points}
        fill="none"
        stroke="transparent"
        strokeWidth={96}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={points}
        fill="none"
        className={cn(
          "corridor-stroke",
          tone === "lane" ? "stroke-lane" : "stroke-danger",
        )}
        strokeWidth={live ? 9 : 5}
        strokeDasharray={dash}
        opacity={live ? 1 : 0.88}
      />
    </g>
  );
}

function MineTip({ mine }: { mine: MineCircle }) {
  const lines = fogTip(mine);
  const head = lines[0] ?? COPY.mineEst;
  const rest = lines.slice(1);
  return (
    <div
      role="tooltip"
      style={visStyleNm(mine.center)}
      className="mine-tip pointer-events-none absolute z-20 w-max max-w-[11rem] -translate-x-1/2 -translate-y-[calc(100%+0.5rem)] rounded-md border border-border bg-bg/95 px-2 py-1.5 text-fg shadow-sm"
    >
      <p className="font-mono text-xs tabular-nums text-accent">{head}</p>
      {rest.map((line) => (
        <p key={line} className="mt-0.5 font-mono text-2xs leading-snug text-muted">
          {line}
        </p>
      ))}
    </div>
  );
}

function DoorChip({
  lat,
  lon,
  label,
  sub,
  tone,
  canAct,
  hot,
  onPick,
}: {
  lat: number;
  lon: number;
  label: string;
  sub: string;
  tone: "lane" | "danger";
  canAct: boolean;
  hot: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!canAct}
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
      style={visStyle(lat, lon)}
      className={cn(
        "absolute z-10 min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-md px-2 py-1 font-mono text-xs shadow-sm transition-transform duration-150 ease-out active:not-disabled:scale-[0.96]",
        tone === "lane" ? "border-lane text-lane" : "border-danger text-danger",
        hot ? "border bg-lane text-fg" : "border bg-bg/92",
        canAct && !hot && "hover:bg-surface-2",
        !canAct && "text-faint",
      )}
    >
      {label}
      <span className="mt-0.5 block font-mono text-2xs opacity-80">{sub}</span>
    </button>
  );
}

function HullMarker({
  running,
  path,
  door,
  alive,
  turn,
}: {
  running: boolean;
  path: NmPolyline;
  door: GameState["lastDoor"];
  alive: boolean;
  turn: number;
}) {
  const park = nmToPx(OMANI_PARK);
  const end = path.length >= 2 ? nmToPx(path[path.length - 1]!) : park;
  const fill = !alive ? "fill-danger" : door === "iran" ? "fill-danger" : "fill-accent";
  const label = !alive
    ? COPY.hullDead
    : door === "wait"
      ? COPY.hullWait
      : door === "omani" || door === "iran"
        ? alive
          ? COPY.hullExit
          : COPY.hullDead
        : COPY.hullYou;

  if (running) {
    return (
      <g key={`${turn}-${door}`} className="hull-pop">
        <g>
          <animateMotion
            dur="1.6s"
            fill="freeze"
            rotate="auto"
            calcMode="linear"
            keyTimes="0;1"
            keyPoints="0;1"
          >
            <mpath href="#tanker-run" />
          </animateMotion>
          <path
            d="M 22 0 L -16 10 L -10 0 L -16 -10 Z"
            className={`${fill} stroke-bg`}
            strokeWidth={3}
            paintOrder="stroke"
          />
        </g>
        {!alive ? (
          <g>
            <circle
              cx={end.x}
              cy={end.y}
              r={22}
              className="fill-danger/30 stroke-danger"
              strokeWidth={4}
            />
          </g>
        ) : null}
      </g>
    );
  }

  return (
    <g className="hull-pop" transform={`translate(${park.x} ${park.y})`}>
      <path
        d="M 0 -20 L 10 14 L 0 8 L -10 14 Z"
        className={`${fill} stroke-bg`}
        strokeWidth={3}
        paintOrder="stroke"
      />
      <text
        x={0}
        y={36}
        className={`${fill} stroke-bg`}
        fontSize={22}
        fontFamily="IBM Plex Mono, monospace"
        textAnchor="middle"
        strokeWidth={4}
        paintOrder="stroke"
        letterSpacing={2}
      >
        {label}
      </text>
    </g>
  );
}

function IntelHud({
  navyPunched,
  fogBlobs,
  holesOpen,
  beat,
}: {
  navyPunched: string;
  fogBlobs: string;
  holesOpen: string;
  beat: string;
}) {
  const chips: Array<[string, string]> = [
    [COPY.navyPunched, navyPunched],
    [COPY.fogBlobs, fogBlobs],
    [COPY.holesOpen, holesOpen],
  ];
  return (
    <div className="pointer-events-none absolute top-2 left-2 z-0 max-w-[min(calc(100%-1rem),20rem)]">
      <div className="rounded-md border border-border bg-bg/92 px-2 py-1.5 text-fg shadow-sm">
        <dl className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-2xs tabular-nums">
          {chips.map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-1.5">
              <dt className="uppercase tracking-widest text-faint">{k}</dt>
              <dd className="text-sm text-accent">{v}</dd>
            </div>
          ))}
        </dl>
        <p
          className="mt-1 hidden max-w-prose text-2xs leading-snug text-muted md:block"
          aria-live="polite"
        >
          {beat}
        </p>
      </div>
    </div>
  );
}

function PriceOverlay({
  price,
  band,
  insurance,
  turn,
  collapsed,
}: {
  price: string;
  band: string;
  insurance: string;
  turn: string;
  collapsed: boolean;
}) {
  return (
    <div className="pointer-events-none absolute right-2 bottom-2 z-0 rounded-md border border-border bg-bg/92 px-2 py-1.5 text-fg shadow-sm">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-lg tabular-nums text-accent">{price}</span>
        <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-2xs uppercase tracking-widest">
          {band}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "rounded-sm px-1.5 py-0.5 font-mono text-2xs uppercase tracking-widest",
            collapsed ? "bg-danger text-fg" : "bg-ok/20 text-ok",
          )}
        >
          {insurance}
        </span>
        <span className="font-mono text-2xs text-muted">{turn}</span>
      </div>
    </div>
  );
}

function ChartLabel({
  x,
  y,
  children,
  size = 26,
  fill = "fill-fg/90",
  anchor = "start",
  tracking = false,
}: {
  x: number;
  y: number;
  children: string;
  size?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  tracking?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      className={`${fill} stroke-bg`}
      fontSize={size}
      fontFamily="IBM Plex Sans, sans-serif"
      textAnchor={anchor}
      letterSpacing={tracking ? 4 : 0}
      strokeWidth={5}
      paintOrder="stroke"
      strokeLinejoin="round"
    >
      {children}
    </text>
  );
}
