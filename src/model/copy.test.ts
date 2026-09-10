import assert from "node:assert/strict";
import test from "node:test";
import { COPY, SCENARIO_KIT, fogTip, iranBrief, lossLines, scoreLines, usBrief } from "./copy.ts";

test("player-facing copy has no em-dashes and keeps the bribe warning", () => {
  for (const [k, v] of Object.entries(COPY)) {
    assert.doesNotMatch(v, /\u2014/, `${k} has an em-dash`);
    assert.doesNotMatch(v, /Maersk/i, `${k} lectures a brand`);
  }
  assert.match(COPY.payWarning, /TSS mines/);
  assert.match(COPY.iranDoorNote, /till/);
  assert.match(COPY.steel, /years/);
  assert.doesNotMatch(COPY.fujairah, /Suez replacing/i);
  assert.match(COPY.fujairah, /Red Sea/);
  assert.match(COPY.roleLock, /Greece, Inc/);
  assert.match(COPY.roleLock, /Accountants pick/);
  assert.match(COPY.roleLock, /captains still balk/i);
  assert.equal(COPY.accountantSit, "Sit. Expected is negative.");
  assert.equal(COPY.boardActWait, COPY.accountantSit);
  assert.match(COPY.waitHint, /Sit a night/);
  assert.match(COPY.sittingTitle, /sitting/i);
  assert.doesNotMatch(COPY.roleLock, /Onassis/i);
  assert.doesNotMatch(COPY.roleLock, /The Wire/i);
  assert.doesNotMatch(COPY.roleLock, /independent/i);
  assert.doesNotMatch(COPY.roleLock, /You are the tanker/i);
  assert.equal(COPY.roleTanker, "Owner");
  assert.equal(COPY.houseName, "Greece, Inc.");
  assert.match(COPY.balk, /Captains refuse/);
  assert.match(COPY.cargoNotYours, /trader ate \$150M/);
  assert.match(COPY.booksNote, /trader bonus/i);
  assert.match(COPY.boardActSit, /Sit/);
  assert.match(COPY.policyBuy, /war-risk/i);
  assert.match(COPY.lossMine, /mine kill/i);
  assert.match(COPY.killHintIran, /till/);
  assert.match(COPY.killHintIran, /TSS/);
  assert.match(COPY.orientation, /North is Iran/);
  assert.match(COPY.photoCredit, /Sentinel-2/);
  assert.match(COPY.doorHint, /Click the US ribbon/);
  assert.match(COPY.doorHint, /Qeshm/);
  assert.match(COPY.doorHint, /Larak/);
  assert.doesNotMatch(COPY.doorHint, /plot/i);
  assert.doesNotMatch(COPY.doorHint, /draw a track/i);
  assert.doesNotMatch(COPY.lastBeatIdle, /draw a track/i);
  assert.equal(COPY.boardActWait, COPY.accountantSit);
  assert.match(COPY.waitHint, /Sit a night/);
  assert.match(COPY.navyNote, /Green/);
  assert.match(COPY.navyNote, /Red does not sit inside green/);
  assert.match(COPY.scenarioHelp, /Weeks/);
  assert.match(COPY.scenarioReopen, /Five hulls/);
  assert.match(COPY.scenarioOverplay, /three holes/);
  assert.equal(SCENARIO_KIT.overplay.label, "Packed TSS");
  assert.match(COPY.booksIdle, /Idle/);
  assert.match(COPY.scoreTitle, /Out of hulls/);
  assert.match(COPY.scoreReplay, /Replay/);
  assert.doesNotMatch(COPY.scenarioReopen, /12 turns/);
  assert.doesNotMatch(COPY.scenarioOverplay, /12 turns/);
  assert.doesNotMatch(COPY.scenarioOne, /1 turn/);
  assert.doesNotMatch(COPY.navyNote, /total mines/i);
});

test("fog tip is tanker intel on one blob, not Iran's magazine", () => {
  const open = fogTip({ radiusSteps: 2, hole: null });
  assert.equal(open[0], `${COPY.mineEst} 1`);
  assert.match(open[1] ?? "", /Fog \d+ nm/);
  assert.equal(open.length, 2);
  const holed = fogTip({
    radiusSteps: 1,
    hole: { radiusNm: 3 },
  });
  assert.ok(holed.some((line) => line.includes(COPY.mineHole)));
  assert.ok(holed.some((line) => line === COPY.mineSwept));
  for (const line of [...open, ...holed]) {
    assert.doesNotMatch(line, /magazine/i);
    assert.doesNotMatch(line, /\u2014/);
  }
});

test("US and Iran briefs conflict on pay", () => {
  const b = {
    turn: 1,
    omaniPct: 80,
    iranPct: 40,
    insurance: "open" as const,
    holeCount: 0,
    paidLast: false,
    waiting: 0,
    omaniEv: -90,
  };
  assert.match(usBrief(b), /Do not pay/);
  assert.match(iranBrief(b), /Pay/);
  assert.notEqual(usBrief(b), iranBrief(b));
  assert.doesNotMatch(usBrief(b), /\u2014/);
  assert.doesNotMatch(iranBrief(b), /\u2014/);
});

test("loss dialog copy names mine kill, toll, and the policy split", () => {
  const naked = lossLines({
    id: "t1",
    turn: 1,
    door: "omani",
    killPct: 90,
    mineId: "m1",
    paid: false,
    insured: false,
    premiumUsdM: 0,
    recoverUsdM: 0,
    tollUsdM: 0,
    hullUsdM: 129,
    familyUsdM: 12,
    cargoUsdM: 150,
    crewBonusUsdM: 2,
  });
  const paid = lossLines({
    id: "t2",
    turn: 2,
    door: "iran",
    killPct: 57,
    mineId: "m2",
    paid: true,
    insured: true,
    premiumUsdM: 6,
    recoverUsdM: 129,
    tollUsdM: 2,
    hullUsdM: 129,
    familyUsdM: 12,
    cargoUsdM: 150,
    crewBonusUsdM: 2,
  });
  for (const line of [...naked, ...paid]) {
    assert.doesNotMatch(line, /\u2014/);
  }
  assert.ok(naked.some((l) => /90%/.test(l)));
  assert.ok(naked.some((l) => /No policy/.test(l)));
  assert.ok(paid.some((l) => /Pay does not sweep/.test(l)));
  assert.ok(paid.some((l) => /War-risk paid the hull/.test(l)));
  assert.ok(paid.some((l) => /Toll \$2M/.test(l)));
});

test("scorecard names idle, live, lost, and net", () => {
  const lines = scoreLines({
    weeks: 6,
    live: 4,
    lost: 1,
    freightUsdM: 80,
    bonusUsdM: 40,
    idleUsdM: 20,
    tollUsdM: 2,
    netUsdM: 147,
    price: 126,
  });
  assert.ok(lines.some((l) => /Week 6/.test(l)));
  assert.ok(lines.some((l) => /Live 4/.test(l)));
  assert.ok(lines.some((l) => /Idle \$20M/.test(l)));
  assert.ok(lines.some((l) => /Net \$147M/.test(l)));
  assert.ok(lines.some((l) => /\$126/.test(l)));
});


