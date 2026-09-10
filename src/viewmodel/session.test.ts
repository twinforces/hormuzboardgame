import assert from "node:assert/strict";
import test from "node:test";
import { COPY } from "../model/copy.ts";
import { createSession, inputPhase } from "./session.ts";

test("wait does not send a hull; a door posts the books", () => {
  const s = createSession(1, "reopen-lane");
  assert.match(s.labels().idleWhy, /12 leftover × \$2M = \$24M/);
  s.wait();
  assert.equal(s.state().books.hullsSent, 0);
  assert.equal(s.labels().booksNet, "-$24M");
  assert.match(s.labels().booksIdle, /\$24M/);
  assert.equal(s.labels().booksLeft, "12");
  assert.equal(s.labels().houseName, "Greece, Inc.");
  s.omani();
  assert.equal(s.state().books.hullsSent, 1);
  assert.ok(s.state().books.hullsLive + s.state().books.hullsLost === 1);
  assert.notEqual(s.labels().booksNet, "$0M");
  assert.equal(s.labels().booksLeft, "11");
  assert.match(s.labels().idleWhy, /11 leftover × \$2M = \$22M/);
});

test("Pay warning string is present on the session labels", () => {
  const s = createSession(1, "reopen-lane");
  assert.match(s.labels().payWarning, /TSS mines/);
  assert.equal(s.labels().payWarning, COPY.payWarning);
});

test("command gating: doors work without a plot, and after match over they stop", () => {
  const s = createSession(1, "one-transit");
  assert.equal(s.labels().canAct, true);
  const ok = s.omani();
  assert.equal(ok.ok, true);
  assert.equal(s.state().phase, "matchOver");
  const late = s.wait();
  assert.equal(late.ok, false);
  assert.equal(s.labels().canAct, false);
});

test("debug overlay fields populate after a scripted match", () => {
  const s = createSession(1, "reopen-lane");
  s.wait();
  const d = s.debug();
  assert.equal(d.seed, 1);
  assert.ok(d.circleRadii.length >= 4);
  assert.ok(typeof d.price === "number");
  assert.ok(d.priceComponents.baseline > 0);
  assert.equal(d.steel, 0);
});

test("conflicting briefs disagree and STEEL copy says years", () => {
  const s = createSession(1, "reopen-lane");
  const l = s.labels();
  assert.match(l.usBrief, /Do not pay|Omani/);
  assert.match(l.iranBrief, /Pay/);
  assert.notEqual(l.usBrief, l.iranBrief);
  assert.match(l.steel, /years/);
  assert.match(l.hint, /Click the US ribbon/);
  assert.doesNotMatch(l.hint, /draw a track/i);
});

test("week one the CEO waits the ribbon and never pays", () => {
  const s = createSession(1, "reopen-lane");
  const start = s.labels();
  assert.equal(start.omaniKill, "66%");
  assert.equal(start.recommended, "wait");
  assert.match(start.boardAct, /Wait/);
  assert.match(start.iranEv, /\+/);
  assert.match(start.omaniEv, /-/);
  let waits = 0;
  while (s.labels().recommended === "wait" && waits < 8) {
    s.wait();
    waits += 1;
  }
  assert.ok(waits >= 1, "CEO sits at least one week");
  assert.equal(s.labels().recommended, "omani");
  assert.match(s.labels().boardAct, /do not pay/i);
  assert.match(s.labels().usAct, /minelayer|Sweepers|escorts/i);
  assert.match(s.labels().iranAct, /seeded/i);
});

test("tanker labels show Navy punches and fog blobs, not Iran magazine", () => {
  const s = createSession(1, "reopen-lane");
  const start = s.labels();
  assert.equal(start.navyPunched, "0");
  assert.equal(start.fogBlobs, "4");
  assert.equal(start.holesOpen, "0");
  assert.notEqual(start.fogBlobs, String(s.state().iranPool.mines));
  assert.match(start.scenarioBlurb, /Twelve hulls/);
  assert.match(start.lastBeat, /CEO/);
  s.wait();
  const after = s.labels();
  assert.ok(Number(after.navyPunched) > 0);
  assert.equal(after.fogBlobs, String(s.state().mines.length));
  assert.ok(Number(after.holesOpen) > 0);
  assert.notEqual(after.fogBlobs, String(s.state().iranPool.mines));
  assert.match(after.lastBeat, /minelayer|Sweepers|seeded/i);
});

test("subscribe fires on a command so the View does not need a bump", () => {
  const s = createSession(1, "reopen-lane");
  const first = s.getSnapshot();
  assert.equal(s.getSnapshot(), first);
  let ticks = 0;
  const off = s.subscribe(() => {
    ticks += 1;
  });
  const r = s.wait();
  assert.equal(r.ok, true);
  assert.equal(ticks, 1);
  const after = s.getSnapshot();
  assert.notEqual(after, first);
  assert.equal(s.getSnapshot(), after);
  assert.ok(after.version > first.version);
  assert.equal(after.labels.canAct, true);
  assert.ok(inputPhase(after.state.phase));
  off();
  s.wait();
  assert.equal(ticks, 1);
});

test("a tanker command never leaves the VM frozen off an input phase", () => {
  const s = createSession(1, "reopen-lane");
  const moves = ["wait", "wait", "omani", "wait", "toll", "wait", "omani", "wait"] as const;
  for (const move of moves) {
    const send = move !== "wait";
    const r =
      s.labels().balk && send
        ? s.wait()
        : move === "omani"
          ? s.omani()
          : move === "toll"
            ? s.toll()
            : s.wait();
    if (!r.ok) {
      assert.equal(s.labels().canAct, false);
      assert.equal(s.state().phase, "matchOver");
      break;
    }
    assert.ok(
      inputPhase(s.state().phase),
      `stuck in ${s.state().phase} after ${move} turn ${s.state().turn}`,
    );
    assert.equal(s.labels().canAct, s.state().phase === "tankerOrders");
    assert.equal(s.getSnapshot().error, null);
  }
});

test("failed command still notifies and keeps the error on the snapshot", () => {
  const s = createSession(1, "one-transit");
  s.omani();
  let ticks = 0;
  s.subscribe(() => {
    ticks += 1;
  });
  const late = s.wait();
  assert.equal(late.ok, false);
  assert.equal(ticks, 1);
  assert.equal(s.getSnapshot().error, late.reason);
  assert.equal(s.labels().canAct, false);
  assert.equal(s.labels().recommended, "none");
});

test("while canAct the VM always names a live move", () => {
  const s = createSession(1, "reopen-lane");
  let moves = 0;
  while (s.labels().canAct && moves < 48) {
    const l = s.labels();
    assert.notEqual(l.recommended, "none", `turn ${s.state().turn} had no live move`);
    assert.notEqual(l.boardAct, COPY.boardActNone);
    const r = s.actRecommended();
    assert.equal(r.ok, true, `actRecommended failed in ${s.state().phase}: ${s.error()}`);
    assert.ok(inputPhase(s.state().phase), `stuck in ${s.state().phase}`);
    moves += 1;
  }
  assert.ok(moves >= 2, "wait then a second live move");
  assert.equal(s.labels().canAct, false);
  assert.equal(s.state().phase, "matchOver");
  assert.equal(s.labels().recommended, "none");
});

test("actRecommended waits night one, then never takes the till", () => {
  const s = createSession(1, "reopen-lane");
  assert.equal(s.labels().recommended, "wait");
  const first = s.actRecommended();
  assert.equal(first.ok, true);
  assert.equal(s.state().lastDoor, "wait");
});

test("boardAct names the gold move without lecturing about tracks", () => {
  const s = createSession(1, "reopen-lane");
  const start = s.labels();
  assert.equal(start.canAct, true);
  assert.match(start.boardAct, /Wait/);
  assert.doesNotMatch(start.hint, /draw a track/i);
  s.wait();
  const after = s.labels();
  assert.equal(after.canAct, true);
  assert.match(after.boardAct, /Wait|Omani/);
  const transit = createSession(1, "one-transit");
  transit.omani();
  assert.equal(transit.labels().canAct, false);
  assert.equal(transit.labels().boardAct, COPY.boardActNone);
});

test("after a kill the gold chip is balk-wait, not a dead door", () => {
  const s = createSession(1, "reopen-lane");
  assert.equal(s.labels().omaniKill, "66%");
  const boom = s.omani();
  assert.equal(boom.ok, true);
  assert.equal(s.state().books.hullsLost, 1);
  assert.equal(s.labels().canAct, true);
  assert.equal(s.labels().balk, true);
  assert.equal(s.labels().doorsOpen, false);
  assert.equal(s.labels().recommended, "wait");
  assert.equal(s.labels().boardAct, COPY.boardActBalk);
  assert.ok(s.state().lastLoss);
  assert.equal(s.state().lastLoss?.insured, false);
  assert.equal(s.labels().policyOpen, false);
  const refused = s.omani();
  assert.equal(refused.ok, false);
  assert.match(refused.reason ?? "", /Captains refuse/);
  const waited = s.actRecommended();
  assert.equal(waited.ok, true);
  assert.equal(s.labels().balk, false);
  assert.equal(s.labels().doorsOpen, true);
});

test("week one Iran is plus-EV and the CEO still waits", () => {
  const s = createSession(1, "reopen-lane");
  assert.equal(s.labels().recommended, "wait");
  assert.match(s.labels().iranEv, /\+/);
});

test("out of hulls is match over, replay resets the sitting", () => {
  const s = createSession(1, "one-transit");
  s.omani();
  assert.equal(s.state().phase, "matchOver");
  assert.equal(s.labels().canAct, false);
  assert.equal(s.labels().recommended, "none");
  assert.match(s.labels().hint, /Sitting over|Out of hulls|books/i);
  const r = s.reset(1, "one-transit");
  assert.equal(r.ok, true);
  assert.equal(s.state().phase, "tankerOrders");
  assert.equal(s.state().turn, 1);
  assert.equal(s.state().books.hullsSent, 0);
});

test("setPolicy before a door covers the hull on a boom", () => {
  const s = createSession(1, "reopen-lane");
  assert.equal(s.labels().policyOpen, true);
  s.setPolicy(true);
  assert.equal(s.labels().policyOn, true);
  s.omani();
  assert.equal(s.state().lastLoss?.insured, true);
  assert.ok(s.state().books.recoverUsdM > 0);
  assert.ok(s.state().books.premiumUsdM > 0);
  assert.equal(s.labels().policyOpen, false);
  assert.match(s.labels().booksRecover, /\$/);
  assert.match(s.labels().booksPremium, /\$/);
});
