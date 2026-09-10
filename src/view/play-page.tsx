import { useEffect, useRef, useState } from "react";
import { COPY, SCENARIO_KIT, clickToStrike } from "@/model/copy.ts";
import { STRIKE, STRIKE_NODES } from "@/model/balance.ts";
import { netUsdM } from "@/model/company.ts";
import type { DebugSnapshot, ScenarioId, StrikeTarget } from "@/model/types.ts";
import { useSession } from "./use-session.ts";
import { MapBoard } from "./map-board.tsx";
import { IranBoard } from "./iran-board.tsx";
import { OutcomeDialog } from "./outcome-dialog.tsx";
import { ScoreDialog } from "./score-dialog.tsx";
import { cn } from "@/lib/cn.ts";

const SCENARIO_IDS = Object.keys(SCENARIO_KIT) as ScenarioId[];

function readStoredSeed(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem("hormuz.seed");
  return raw ? Number(raw) || 1 : 1;
}

function readStoredScenario(): ScenarioId {
  if (typeof window === "undefined") return "reopen-lane";
  const raw = window.localStorage.getItem("hormuz.scenario");
  if (raw === "one-transit" || raw === "overplay" || raw === "reopen-lane" || raw === "mine-warfare") {
    return raw;
  }
  return "reopen-lane";
}

export function PlayPage() {
  const [seed, setSeed] = useState(1);
  const [scenario, setScenario] = useState<ScenarioId>("reopen-lane");
  const acted = useRef(false);
  const { session, state, labels, error } = useSession(seed, scenario);
  const [debug, setDebug] = useState(false);
  const [reportSeen, setReportSeen] = useState<string | null>(null);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [board, setBoard] = useState<"iran" | "strait">("strait");
  const d = session.debug();
  const war = labels.seat === "us";

  useEffect(() => {
    setBoard(war ? "iran" : "strait");
  }, [war]);

  useEffect(() => {
    if (acted.current) return;
    setSeed(readStoredSeed());
    setScenario(readStoredScenario());
    setDebug(window.localStorage.getItem("hormuz.debug") === "1");
  }, []);

  useEffect(() => {
    if (state.phase === "matchOver") setScoreOpen(true);
  }, [state.phase, state.turn, state.books.hullsSent]);

  function markAct() {
    acted.current = true;
  }

  function replay() {
    markAct();
    setReportSeen(null);
    setScoreOpen(false);
    session.reset(seed, scenario);
  }

  function fresh() {
    const next = (seed % 9999) + 1;
    window.localStorage.setItem("hormuz.seed", String(next));
    setReportSeen(null);
    setScoreOpen(false);
    setSeed(next);
  }

  function toggleDebug() {
    const next = !debug;
    setDebug(next);
    window.localStorage.setItem("hormuz.debug", next ? "1" : "0");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <section className="rounded-lg border border-border bg-surface p-4">
        <p className="font-mono text-2xs uppercase tracking-widest text-accent">
          {COPY.scenarioAsk}
        </p>
        <p className="mt-1 text-sm text-muted">{COPY.scenarioHelp}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIO_IDS.map((id) => {
            const sc = SCENARIO_KIT[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  acted.current = false;
                  setScenario(id);
                  window.localStorage.setItem("hormuz.scenario", id);
                }}
                className={cn(
                  "min-h-11 rounded-md border px-3 py-2 text-left text-sm transition-transform duration-150 ease-out active:scale-[0.96]",
                  scenario === id
                    ? "border-accent bg-surface-2 text-accent"
                    : "border-border text-muted",
                )}
              >
                <span className="block">{sc.label}</span>
                <span className="mt-0.5 block font-mono text-2xs font-normal text-faint">
                  {sc.blurb}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      {war ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBoard("iran")}
            className={cn(
              "min-h-11 rounded-md border px-4 text-sm",
              board === "iran" ? "border-accent bg-surface-2 text-accent" : "border-border text-muted",
            )}
          >
            {COPY.tabIran}
          </button>
          <button
            type="button"
            onClick={() => setBoard("strait")}
            className={cn(
              "min-h-11 rounded-md border px-4 text-sm",
              board === "strait" ? "border-accent bg-surface-2 text-accent" : "border-border text-muted",
            )}
          >
            {COPY.tabStrait}
          </button>
          <p className="font-mono text-2xs text-muted">{COPY.strikeMarks}</p>
        </div>
      ) : null}
      {war && board === "iran" ? (
        <IranBoard
          canAct={labels.canAct}
          mineFactoryUp={labels.factoryUp}
          droneFactoryUp={labels.droneFactoryUp}
          mineWarehouseUp={labels.warehouseUp}
          droneWarehouseUp={labels.droneWarehouseUp}
          radarUp={labels.radarUp}
          portUp={labels.portUp}
          spiderHoles={labels.spiderHoles}
          price={labels.price}
          omaniKill={labels.omaniKill}
          waiting={String(state.waitingHulls)}
          live={labels.booksLive}
          lost={labels.booksLost}
          magDrones={labels.magDrones}
          magCounter={labels.magCounter}
          magLasers={labels.magLasers}
          magMines={labels.magMines}
          magBoats={labels.magBoats}
          onStrike={(target: StrikeTarget, pitId?: string) => {
            markAct();
            session.usStrike(target, pitId);
            setBoard("strait");
          }}
          onOpenStrait={() => setBoard("strait")}
        />
      ) : (
        <MapBoard
          state={state}
          price={labels.price}
          band={labels.band}
          insurance={labels.insurance}
          turn={labels.turn}
          navyPunched={labels.navyPunched}
          fogBlobs={labels.fogBlobs}
          holesOpen={labels.holesOpen}
          beat={labels.lastBeat}
          canAct={labels.canAct}
          doorsOpen={labels.doorsOpen}
          recommended={labels.recommended}
          boardAct={labels.boardAct}
          omaniKill={labels.omaniKill}
          iranKill={labels.iranKill}
          omaniShot={labels.omaniShot}
          iranShot={labels.iranShot}
          onWait={() => {
            markAct();
            session.wait();
          }}
          onOmani={() => {
            markAct();
            session.omani();
          }}
          onIran={() => {
            markAct();
            session.toll();
          }}
          onBoardAct={() => {
            markAct();
            session.actRecommended();
          }}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-surface p-4">
            <p className="font-mono text-2xs uppercase tracking-widest text-accent">
              {labels.houseName}
            </p>
            <p className="mt-3 text-sm text-muted">{war ? COPY.warLock : COPY.roleLock}</p>
            <p className="mt-2 text-sm text-muted">{labels.hint}</p>

            {war ? (
              <div className="mt-4 space-y-3">
                <dl className="grid grid-cols-2 gap-2 font-mono text-xs sm:grid-cols-5">
                  <Stat k={COPY.magMines} v={labels.magMines} />
                  <Stat k={COPY.magDrones} v={labels.magDrones} />
                  <Stat k={COPY.magBoats} v={labels.magBoats} />
                  <Stat k={COPY.magCounter} v={labels.magCounter} />
                  <Stat k={COPY.magLasers} v={labels.magLasers} />
                </dl>
                <p className="font-mono text-2xs text-muted">{COPY.strikeMarks}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {STRIKE.targets.map((id) => {
                    const n = STRIKE_NODES[id];
                    const liveNode =
                      id === "mine-factory"
                        ? labels.factoryUp
                        : id === "drone-factory"
                          ? labels.droneFactoryUp
                          : id === "mine-warehouse"
                            ? labels.warehouseUp
                            : id === "drone-warehouse"
                              ? labels.droneWarehouseUp
                              : id === "radar"
                                ? labels.radarUp
                                : labels.portUp;
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={!labels.canAct || !liveNode}
                        title={liveNode ? clickToStrike(n.label) : `${n.label} ${COPY.nodeDown}`}
                        onClick={() => {
                          markAct();
                          session.usStrike(id);
                          setBoard("strait");
                        }}
                        className={cn(
                          "min-h-11 rounded-md border px-3 text-sm disabled:opacity-50",
                          liveNode
                            ? "border-accent bg-surface-2 text-fg"
                            : "border-border bg-bg text-faint",
                        )}
                      >
                        <span className="mr-1" aria-hidden>
                          {n.emoji}
                        </span>
                        {liveNode ? n.label : `${n.label} ${COPY.nodeDown}`}
                      </button>
                    );
                  })}
                  {labels.spiderHoles.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      disabled={!labels.canAct}
                      title={clickToStrike(COPY.spiderHole)}
                      onClick={() => {
                        markAct();
                        session.usStrike("spider-hole", h.id);
                        setBoard("strait");
                      }}
                      className="min-h-11 rounded-md border border-danger bg-surface-2 px-3 text-sm text-fg disabled:opacity-50"
                    >
                      <span className="mr-1" aria-hidden>
                        {COPY.spiderEmoji}
                      </span>
                      {COPY.spiderHole}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={!labels.canAct}
                  onClick={() => {
                    markAct();
                    session.usSweep();
                  }}
                  className="min-h-11 w-full rounded-md bg-lane px-3 text-sm text-fg disabled:opacity-50"
                >
                  {COPY.usSweep}
                </button>
              </div>
            ) : null}
            <p className="mt-2 font-mono text-2xs leading-snug text-accent" aria-live="polite">
              {labels.lastBeat}
            </p>

            {war ? null : (
            <div className="mt-4 rounded-md border border-accent/40 bg-bg px-3 py-2">
              <p className="font-mono text-2xs uppercase tracking-widest text-accent">
                {COPY.accountant}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2 font-mono text-xs">
                <Stat
                  k={`Omani ${labels.omaniKill} mine`}
                  v={`${labels.omaniShot} shot · ${labels.omaniEv}`}
                  hot={labels.omaniEv.startsWith("-")}
                />
                <Stat
                  k={`Iran ${labels.iranKill} mine`}
                  v={`${labels.iranShot} shot · ${labels.iranEv}`}
                  hot={labels.iranEv.startsWith("-")}
                />
              </dl>
              <p className="mt-2 font-mono text-xs text-fg">{labels.boardAct}</p>
            </div>
            )}

            {war ? null : (
            <label
              className={cn(
                "mt-4 flex min-h-11 items-center gap-3 rounded-md border px-3 text-sm",
                labels.policyOpen
                  ? "border-border bg-bg"
                  : "border-border bg-surface-2 text-faint",
              )}
            >
              <input
                type="checkbox"
                className="size-4 shrink-0 accent-accent"
                checked={labels.policyOn}
                disabled={!labels.policyOpen || !labels.canAct}
                onChange={(e) => session.setPolicy(e.target.checked)}
              />
              <span>
                {labels.policyOpen
                  ? `${COPY.policyBuy} ${labels.policyCost}`
                  : COPY.policyGone}
                <span className="mt-0.5 block font-mono text-2xs font-normal text-faint">
                  {COPY.policyHint}
                </span>
              </span>
            </label>
            )}

            {war ? null : (
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                disabled={!labels.doorsOpen}
                onClick={() => {
                  markAct();
                  session.omani();
                }}
                className={cn(
                  "min-h-11 rounded-md px-3 text-sm font-medium transition-transform duration-150 ease-out active:not-disabled:scale-[0.96]",
                  !labels.doorsOpen && "bg-surface-2 text-faint",
                  labels.doorsOpen && labels.recommended === "omani" && "bg-lane text-fg",
                  labels.doorsOpen && labels.recommended !== "omani" &&
                    "border border-lane bg-surface-2 text-fg",
                )}
              >
                {COPY.runOmani}
                <span className="mt-0.5 block font-mono text-2xs font-normal opacity-80">
                  {labels.omaniKill} {COPY.mineKill} · {labels.omaniShot} {COPY.shotKill} · {labels.omaniEv}
                </span>
              </button>
              <button
                type="button"
                disabled={!labels.doorsOpen}
                onClick={() => {
                  markAct();
                  session.toll();
                }}
                className={cn(
                  "min-h-11 rounded-md px-3 text-sm font-medium transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] disabled:text-faint",
                  !labels.doorsOpen && "bg-surface-2 text-faint",
                  labels.doorsOpen && labels.recommended === "iran" && "bg-danger text-fg",
                  labels.doorsOpen && labels.recommended !== "iran" &&
                    "border border-danger/50 bg-surface-2 text-fg",
                )}
              >
                {COPY.runToll}
                <span className="mt-0.5 block font-mono text-2xs font-normal text-muted">
                  {labels.iranKill} {COPY.mineKill} · {labels.iranShot} {COPY.shotKill} · {labels.iranEv}
                </span>
              </button>
              <button
                type="button"
                disabled={!labels.canAct}
                onClick={() => {
                  markAct();
                  session.wait();
                }}
                className={cn(
                  "min-h-11 rounded-md px-3 text-sm font-medium transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] disabled:text-faint",
                  labels.canAct && labels.recommended === "wait"
                    ? "bg-accent text-accent-fg"
                    : "border border-border bg-surface-2",
                )}
              >
                {COPY.wait}
                <span className="mt-0.5 block font-mono text-2xs font-normal opacity-80">
                  {labels.idleWhy}
                </span>
              </button>
            </div>
            )}
            {error ? (
              <p className="mt-2 text-sm text-danger">{error}</p>
            ) : null}

            <div className="mt-3 rounded-md border border-border bg-bg px-3 py-2">
              <p className="font-mono text-2xs uppercase tracking-widest text-accent">
                {war ? COPY.trafficBooks : labels.houseName}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2 font-mono text-xs">
                <Stat k={COPY.booksLeft} v={labels.booksLeft} />
                <Stat k={COPY.booksQuote} v={labels.booksQuote} />
                <Stat k={COPY.booksSent} v={labels.booksSent} />
                <Stat k={COPY.booksLive} v={labels.booksLive} />
                <Stat k={COPY.booksLost} v={labels.booksLost} hot={state.books.hullsLost > 0} />
                <Stat k={COPY.booksCrew} v={labels.booksCrew} hot={state.books.crewUsdM > 0} />
                <Stat k={COPY.booksFreight} v={labels.booksFreight} />
                <Stat k={COPY.booksBonus} v={labels.booksBonus} />
                <Stat k={COPY.booksHulls} v={labels.booksHulls} hot={state.books.hullWriteoffUsdM > 0} />
                <Stat k={COPY.booksFamilies} v={labels.booksFamilies} hot={state.books.familyUsdM > 0} />
                <Stat k={COPY.booksToll} v={labels.booksToll} hot={state.books.tollUsdM > 0} />
                <Stat k={COPY.booksPremium} v={labels.booksPremium} hot={state.books.premiumUsdM > 0} />
                <Stat k={COPY.booksRecover} v={labels.booksRecover} />
                <Stat k={COPY.booksIdle} v={labels.booksIdle} hot={state.books.idleUsdM > 0} />
                <Stat k={COPY.booksDamage} v={labels.booksDamage} hot={state.books.damageUsdM > 0} />
              </dl>
              <p className="mt-2 font-mono text-2xs text-muted">{labels.idleWhy}</p>
              <p
                className={cn(
                  "mt-2 font-mono text-sm tabular-nums",
                  labels.booksHot ? "text-danger" : "text-ok",
                )}
              >
                {COPY.booksNet} {labels.booksNet}
              </p>
              <p className="mt-1 text-2xs leading-snug text-faint">
                {war ? COPY.trafficNote : COPY.booksNote}
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-surface p-4">
            <p className="font-mono text-2xs uppercase tracking-widest text-accent">
              {COPY.sittingTitle}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={replay}
                className="min-h-11 rounded-md border border-accent px-3 text-sm text-accent"
              >
                {COPY.scoreReplay}
              </button>
              <button
                type="button"
                onClick={fresh}
                className="min-h-11 rounded-md border border-border px-3 text-sm"
              >
                {COPY.reset}
              </button>
              <button
                type="button"
                onClick={toggleDebug}
                className="min-h-11 rounded-md border border-border px-3 text-sm"
              >
                {COPY.debug}
              </button>
            </div>
          </section>
      </div>

      <Log lines={state.log} />

      <OutcomeDialog
        report={state.lastReport && state.lastReport.id !== reportSeen ? state.lastReport : null}
        onClose={() => {
          if (state.lastReport) setReportSeen(state.lastReport.id);
        }}
        onSeeStrait={() => setBoard("strait")}
        onSeeStrikes={() => setBoard("iran")}
        spider={labels.spiderHoles.length > 0}
        industryDown={
          !labels.factoryUp &&
          !labels.droneFactoryUp &&
          !labels.warehouseUp &&
          !labels.droneWarehouseUp &&
          !labels.radarUp &&
          !labels.portUp &&
          labels.spiderHoles.length === 0
        }
      />

      <ScoreDialog
        open={
          scoreOpen &&
          state.phase === "matchOver" &&
          !(state.lastReport && state.lastReport.id !== reportSeen)
        }
        score={{
          weeks: state.turn,
          live: state.books.hullsLive,
          lost: state.books.hullsLost,
          freightUsdM: state.books.freightUsdM,
          bonusUsdM: state.books.bonusUsdM,
          idleUsdM: state.books.idleUsdM,
          tollUsdM: state.books.tollUsdM,
          minesBought: state.books.minesBought,
          omaniSent: state.books.omaniSent,
          iranSent: state.books.iranSent,
          netUsdM: netUsdM(state.books),
          price: state.price,
          seat: labels.seat,
          factoryUp: labels.factoryUp,
          droneFactoryUp: labels.droneFactoryUp,
          warehouseUp: labels.warehouseUp,
          droneWarehouseUp: labels.droneWarehouseUp,
          radarUp: labels.radarUp,
          portUp: labels.portUp,
        }}
        onReplay={replay}
        onFresh={fresh}
        onClose={() => setScoreOpen(false)}
      />

      {debug ? <DebugPanel d={d} /> : null}
    </div>
  );
}

function Stat({ k, v, hot = false }: { k: string; v: string; hot?: boolean }) {
  return (
    <div className="rounded-md bg-bg px-2 py-2">
      <dt className="text-2xs uppercase tracking-widest text-faint">{k}</dt>
      <dd className={cn("tabular-nums", hot ? "text-danger" : "text-fg")}>{v}</dd>
    </div>
  );
}

function Log({ lines }: { lines: string[] }) {
  const tail = lines.slice(-8);
  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
        After-action
      </h3>
      <ol className="mt-3 space-y-1.5 text-sm text-muted">
        {tail.map((line, i) => (
          <li key={`${i}-${line}`}>{line}</li>
        ))}
      </ol>
    </section>
  );
}

function DebugPanel({ d }: { d: DebugSnapshot }) {
  return (
    <section className="rounded-lg border border-dashed border-border p-4 font-mono text-xs">
      <h3 className="uppercase tracking-widest text-accent">Debug</h3>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-muted">
        {JSON.stringify(d, null, 2)}
      </pre>
    </section>
  );
}
