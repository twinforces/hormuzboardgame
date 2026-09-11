import assert from "node:assert/strict";
import test from "node:test";
import { COPY, SCENARIO_KIT, TANKER_SITS, WAR_SITS, clickToStrike, fogTip, idleChargeLine, iranBrief, iranCoastalLine, iranHoldLine, iranSeedLine, iranSurgeLine, leaveHoleLine, lossLines, outcomeContinue, outcomeLines, outcomeTitle, scoreLines, sittingKit, spiderDumpLine, spiderRevealLine, spiderTipLine, strings, usBrief, usStrikeLine, usSweepLine } from "./copy.ts";
import { COPY_FA, FA_KIT } from "./copy-fa.ts";
import { setLocale } from "./locale.ts";

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
  assert.doesNotMatch(JSON.stringify(COPY), /factory, warehouse, radar, port/i);
  assert.equal(COPY.roleTanker, "Owner");
  assert.equal(COPY.houseName, "Greece, Inc.");
  assert.match(COPY.balk, /Captains refuse/);
  assert.match(COPY.cargoNotYours, /trader ate \$150M/);
  assert.match(COPY.booksNote, /trader bonus/i);
  assert.match(COPY.booksNote, /Oman-China/);
  assert.match(COPY.booksNote, /\$2M/);
  assert.match(COPY.boardActSit, /Sit/);
  assert.match(COPY.policyBuy, /war-risk/i);
  assert.match(COPY.lossMine, /mine kill/i);
  assert.match(COPY.killHintIran, /till/);
  assert.match(COPY.killHintIran, /promise they will not shoot/);
  assert.match(COPY.killHintIran, /drift/);
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
  assert.match(COPY.scenarioReopen, /Twelve hulls/);
  assert.match(COPY.scenarioOverplay, /More mines/);
  assert.match(COPY.scenarioOverplay, /three patches/);
  assert.equal(SCENARIO_KIT["reopen-lane"].label, "🇬🇷 Tanker CEO");
  assert.equal(SCENARIO_KIT["one-transit"].label, "🇬🇷 Tanker Captain");
  assert.equal(SCENARIO_KIT.overplay.label, "🇬🇷 Small CEO");
  assert.match(COPY.scenarioMine, /Some are greedy/);
  assert.match(COPY.scenarioMine, /Strike or sweep/);
  assert.match(COPY.scenarioMine, /🇺🇸/);
  assert.equal(SCENARIO_KIT["mine-warfare"].label, "Anti-Mine Warfare");
  assert.equal(SCENARIO_KIT["iran-warfare"].label, "Mine Warfare");
  assert.match(COPY.scenarioIran, /You are Iran/);
  assert.match(COPY.scenarioIran, /Lay mines/);
  assert.match(COPY.scenarioIran, /🇮🇷/);
  assert.deepEqual(TANKER_SITS, ["reopen-lane", "one-transit", "overplay"]);
  assert.deepEqual(WAR_SITS, ["mine-warfare", "iran-warfare"]);
  assert.match(COPY.iranLock, /Mine warfare/);
  assert.match(COPY.iranHint, /Lay seeds/);
  assert.equal(COPY.iranLay, "Lay mines");
  assert.equal(COPY.iranSurge, "Surge drones");
  assert.equal(COPY.iranHold, "Hold");
  assert.doesNotMatch(COPY.iranLock, /1\./);
  assert.doesNotMatch(COPY.scenarioIran, /1\./);
  for (const kit of Object.values(SCENARIO_KIT)) {
    assert.doesNotMatch(kit.label, /\u2014/, `${kit.label} has an em-dash`);
    assert.doesNotMatch(kit.blurb, /\u2014/, `${kit.label} blurb has an em-dash`);
  }
  assert.match(COPY.warLock, /anti-mine warfare/i);
  assert.match(COPY.warLock, /sit until you sweep/);
  assert.match(COPY.warHint, /After blood/);
  assert.match(COPY.trafficBalk, /Sweep the ribbon/);
  assert.match(COPY.tabIran, /Strikes/);
  assert.match(COPY.tabStrait, /Strait/);
  assert.match(COPY.warLock, /hundred/);
  assert.match(COPY.warHint, /circle/i);
  assert.match(COPY.usStrike, /Strike/);
  assert.match(COPY.outcomeGoStrikes, /Go to strikes/);
  assert.match(COPY.outcomeGoStrait, /Go to strait/);
  assert.equal(COPY.planStrikes, "Plan Strikes");
  assert.match(COPY.openStrait, /Open the strait/);
  assert.match(COPY.navyNote, /Red stays on water/);
  assert.equal(clickToStrike("Factory"), "Click to strike Factory");
  assert.equal(clickToStrike("Warehouse"), "Click to strike Warehouse");
  assert.doesNotMatch(COPY.warLock, /1\./);
  assert.doesNotMatch(COPY.scenarioMine, /1\./);
  assert.match(COPY.booksIdle, /Idle/);
  assert.match(COPY.scoreTitle, /Out of hulls/);
  assert.match(COPY.scoreReplay, /Replay/);
  assert.doesNotMatch(COPY.scenarioReopen, /12 turns/);
  assert.doesNotMatch(COPY.scenarioOverplay, /12 turns/);
  assert.doesNotMatch(COPY.scenarioOne, /1 turn/);
  assert.doesNotMatch(COPY.navyNote, /total mines/i);
});

test("Farsi bag matches English keys, no em-dashes, and locale switch relabels", () => {
  assert.deepEqual(Object.keys(COPY_FA).sort(), Object.keys(COPY).sort());
  for (const [k, v] of Object.entries(COPY_FA)) {
    assert.doesNotMatch(v, /\u2014/, `${k} fa has an em-dash`);
    assert.doesNotMatch(v, /Maersk/i, `${k} fa lectures a brand`);
  }
  assert.match(COPY_FA.wait, /صف/);
  assert.match(COPY_FA.scenarioMine, /🇺🇸/);
  assert.match(COPY_FA.scenarioIran, /🇮🇷/);
  assert.equal(FA_KIT.overplay.label, "🇬🇷 مدیرعامل کوچک");
  assert.equal(FA_KIT["mine-warfare"].label, "جنگ ضد مین");
  try {
    setLocale("fa");
    assert.equal(strings().wait, COPY_FA.wait);
    assert.match(idleChargeLine(12), /مانده/);
    assert.equal(sittingKit()["reopen-lane"].label, "🇬🇷 مدیرعامل نفتکش");
    assert.match(usStrikeLine({ turn: 1, target: "mine-factory", already: false }), /کارخانه مین/);
  } finally {
    setLocale("en");
  }
  assert.equal(strings().wait, COPY.wait);
  assert.equal(sittingKit().overplay.label, "🇬🇷 Small CEO");
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
    cause: "mine" as const,
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
    cause: "mine" as const,
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

test("scorecard names idle, live, lost, bonus, toll mines, and net", () => {
  const lines = scoreLines({
    weeks: 6,
    live: 4,
    lost: 1,
    freightUsdM: 80,
    bonusUsdM: 40,
    idleUsdM: 20,
    tollUsdM: 6,
    minesBought: 3,
    omaniSent: 0,
    iranSent: 5,
    netUsdM: 147,
    price: 126,
  });
  assert.ok(lines.some((l) => /Week 6/.test(l)));
  assert.ok(lines.some((l) => /Live 4/.test(l)));
  assert.ok(lines.some((l) => /Idle \$20M/.test(l)));
  assert.ok(lines.some((l) => /Traders paid you a bonus of \$40M/.test(l)));
  assert.ok(lines.some((l) => /\$6M in tolls, buying Iran 3 mines/.test(l)));
  assert.ok(lines.some((l) => /someone else's problem/.test(l)));
  assert.ok(lines.some((l) => /Net \$147M/.test(l)));
  assert.ok(lines.some((l) => /\$126/.test(l)));
  const nice = scoreLines({
    weeks: 8,
    live: 12,
    lost: 0,
    freightUsdM: 200,
    bonusUsdM: 80,
    idleUsdM: 40,
    tollUsdM: 0,
    minesBought: 0,
    omaniSent: 12,
    iranSent: 0,
    netUsdM: 204,
    price: 110,
  });
  assert.ok(nice.some((l) => /did not buy their next mine/.test(l)));
  assert.ok(nice.some((l) => /waited the Navy/.test(l)));
});

test("idle charge names leftover hulls times the rate", () => {
  assert.equal(idleChargeLine(5, 2), "5 leftover × $2M = $10M this week.");
  assert.equal(idleChargeLine(1, 2), "1 leftover × $2M = $2M this week.");
  assert.equal(idleChargeLine(0, 2), "No leftover hulls.");
});

test("navy lines sink minelayers. Iran seeds. Pay does not sweep.", () => {
  assert.match(usSweepLine({ turn: 2, layers: 3, nm2: 48 }), /sank 3 minelayers/);
  assert.match(usSweepLine({ turn: 2, layers: 3, nm2: 48 }), /48 nm/);
  assert.match(iranSeedLine({ turn: 2, laid: 1, shot: "miss" }), /seeded 1 mine/);
  assert.match(iranSeedLine({ turn: 2, laid: 1, shot: "miss" }), /missed/);
  assert.match(iranSeedLine({ turn: 2, laid: 1, shot: "none" }), /mines drift/);
  const live = outcomeLines({
    id: "r1",
    turn: 3,
    kind: "live",
    door: "omani",
    netDeltaUsdM: 18,
    freightUsdM: 15,
    bonusUsdM: 8,
    tollUsdM: 0,
    damageUsdM: 0,
    idleUsdM: 0,
    minesBought: 0,
    usLine: "US Navy sank 2 minelayers.",
    iranLine: "Iran seeded 1 mine in the TSS.",
    omaniMinePct: 18,
    iranMinePct: 0,
    omaniShotPct: 10,
    iranShotPct: 6,
    cause: "none",
    paid: false,
  });
  assert.ok(live.some((l) => /made \$18M net/.test(l)));
  assert.ok(live.some((l) => /Traders paid you a bonus of \$8M/.test(l)));
  assert.ok(live.some((l) => /Omani mine risk is now 18%/.test(l)));
  const paid = outcomeLines({
    id: "r2",
    turn: 4,
    kind: "live",
    door: "iran",
    netDeltaUsdM: 12,
    freightUsdM: 15,
    bonusUsdM: 0,
    tollUsdM: 2,
    damageUsdM: 0,
    idleUsdM: 0,
    minesBought: 1,
    usLine: "US Navy sank 1 minelayer.",
    iranLine: "Iran seeded 1 mine in the TSS.",
    omaniMinePct: 22,
    iranMinePct: 0,
    omaniShotPct: 10,
    iranShotPct: 6,
    cause: "none",
    paid: true,
  });
  assert.ok(paid.some((l) => /\$2M in tolls, buying Iran 1 mine/.test(l)));
});

test("strike lines name the node without printing a numbered plan", () => {
  assert.match(usStrikeLine({ turn: 1, target: "mine-factory", already: false }), /roof is gone/);
  assert.match(
    usStrikeLine({ turn: 1, target: "radar", already: false, droneFactoryUp: true }),
    /Mines still drift/,
  );
  assert.match(
    usStrikeLine({ turn: 1, target: "radar", already: false, droneFactoryUp: true }),
    /Drones guess/,
  );
  assert.match(
    usStrikeLine({ turn: 1, target: "port", already: false, mineFactoryUp: true }),
    /spider hole showed itself/,
  );
  assert.doesNotMatch(
    usStrikeLine({ turn: 1, target: "port", already: false, mineFactoryUp: true }),
    /mine-factory, drone-factory/i,
  );
  const traffic = outcomeLines({
    id: "w1",
    turn: 1,
    kind: "wait",
    door: "wait",
    netDeltaUsdM: 0,
    freightUsdM: 0,
    bonusUsdM: 0,
    tollUsdM: 0,
    damageUsdM: 0,
    idleUsdM: 20,
    minesBought: 0,
    usLine: "US Navy sank 2 minelayers.",
    iranLine: "Iran seeded 1 mine in the TSS.",
    omaniMinePct: 40,
    iranMinePct: 0,
    omaniShotPct: 10,
    iranShotPct: 6,
    cause: "none",
    paid: false,
    watcher: "us",
  });
  assert.equal(outcomeTitle({
    id: "w1",
    turn: 1,
    kind: "wait",
    door: "wait",
    netDeltaUsdM: 0,
    freightUsdM: 0,
    bonusUsdM: 0,
    tollUsdM: 0,
    damageUsdM: 0,
    idleUsdM: 20,
    minesBought: 0,
    usLine: "x",
    iranLine: "y",
    omaniMinePct: 40,
    iranMinePct: 0,
    omaniShotPct: 10,
    iranShotPct: 6,
    cause: "none",
    paid: false,
    watcher: "us",
  }), COPY.trafficWait);
  assert.ok(traffic.some((l) => /Traffic sat/.test(l)));
  assert.ok(!traffic.some((l) => /You made/.test(l)));
  const war = scoreLines({
    weeks: 8,
    live: 7,
    lost: 1,
    freightUsdM: 0,
    bonusUsdM: 0,
    idleUsdM: 0,
    tollUsdM: 4,
    minesBought: 2,
    omaniSent: 5,
    iranSent: 2,
    netUsdM: 0,
    price: 110,
    seat: "us",
    factoryUp: true,
    warehouseUp: false,
    radarUp: true,
    portUp: true,
  });
  assert.ok(war.some((l) => /Traffic live 7/.test(l)));
  assert.ok(war.some((l) => /Mine factory still prints/.test(l)));
  assert.ok(war.some((l) => /Mine warehouse is down/.test(l)));
  assert.ok(!war.some((l) => /Traders paid you/.test(l)));
});

test("spider copy names the stash without numbering a plan", () => {
  assert.match(
    spiderRevealLine({ turn: 2, mines: 4, drones: 3 }),
    /4 mines and 3 drones/,
  );
  assert.match(spiderTipLine({ mines: 4, drones: 3 }), /Hidden stash: 4 mines, 3 drones/);
  assert.match(spiderDumpLine({ turn: 3, mines: 4, drones: 3 }), /4 mines/);
  assert.match(spiderDumpLine({ turn: 3, mines: 4, drones: 3 }), /3 drones hit a Gulf state/);
  assert.doesNotMatch(spiderRevealLine({ turn: 2, mines: 4, drones: 3 }), /\u2014/);
  assert.doesNotMatch(spiderDumpLine({ turn: 3, mines: 4, drones: 3 }), /\u2014/);
});

test("continue highlight follows the spider hole, then the empty board", () => {
  assert.equal(outcomeContinue({ spider: true, industryDown: false }), "strikes");
  assert.equal(outcomeContinue({ spider: true, industryDown: true }), "strikes");
  assert.equal(outcomeContinue({ spider: false, industryDown: true }), "strait");
  assert.equal(outcomeContinue({ spider: false, industryDown: false }), "strait");
});

test("leaving a hole is the dump headline, not a silent vanish", () => {
  const base = {
    id: "d1",
    turn: 3,
    kind: "wait" as const,
    door: "wait" as const,
    netDeltaUsdM: 0,
    freightUsdM: 0,
    bonusUsdM: 0,
    tollUsdM: 0,
    damageUsdM: 0,
    idleUsdM: 0,
    minesBought: 0,
    usLine: "US struck the mine factory.",
    iranLine: "The hole dumped 4 mines.",
    omaniMinePct: 40,
    iranMinePct: 0,
    omaniShotPct: 10,
    iranShotPct: 6,
    cause: "none" as const,
    paid: false,
    watcher: "us" as const,
    dumped: { mines: 4, drones: 3 },
  };
  assert.equal(outcomeTitle(base), COPY.holeDumped);
  assert.equal(outcomeLines(base)[0], COPY.leftHole);
  assert.match(COPY.warHint, /Leave a spider hole/);
  assert.equal(
    outcomeTitle({ ...base, dumped: undefined, kind: "lost" }),
    COPY.trafficLost,
  );
});

test("leaving a hole asks before the stash runs", () => {
  assert.equal(
    leaveHoleLine("strike Mine factory"),
    "Leave the spider hole to strike Mine factory? The stash dumps.",
  );
  assert.equal(
    leaveHoleLine("sweep the ribbon"),
    "Leave the spider hole to sweep the ribbon? The stash dumps.",
  );
  assert.doesNotMatch(leaveHoleLine("strike Radar"), /\u2014/);
  assert.equal(COPY.leaveKeep, "Keep the hole");
  assert.equal(COPY.leaveStrike, "Strike anyway");
  assert.equal(COPY.leaveSweep, "Sweep anyway");
  assert.equal(COPY.holeDumpedMark, "Dumped");
});

test("iran hold and surge lines name the verb without a numbered plan", () => {
  assert.match(iranHoldLine(2), /Iran held/);
  assert.match(iranHoldLine(2), /Nothing new in the TSS/);
  assert.match(iranSurgeLine({ turn: 2, drones: 3, gulf: true }), /surged 3 drones/);
  assert.match(iranSurgeLine({ turn: 2, drones: 3, gulf: true }), /Gulf state/);
  assert.match(iranSurgeLine({ turn: 2, drones: 0, gulf: false }), /no air/);
  assert.doesNotMatch(iranHoldLine(2), /\u2014/);
  assert.doesNotMatch(iranSurgeLine({ turn: 2, drones: 3, gulf: true }), /\u2014/);
  assert.match(iranCoastalLine({ turn: 4, mines: 4, drones: 3 }), /sheds were empty/i);
  assert.match(iranCoastalLine({ turn: 4, mines: 4, drones: 3 }), /coastal cell dumped 4 mines/);
  assert.doesNotMatch(iranCoastalLine({ turn: 4, mines: 4, drones: 3 }), /\u2014/);
  assert.equal(COPY.iranLayCoastal, "Sheds empty. Lay dumps a coastal cell.");
  assert.match(COPY.iranDry, /Fog still grows/);
  assert.doesNotMatch(COPY.iranDry, /1\./);
  const iran = scoreLines({
    weeks: 8,
    live: 7,
    lost: 1,
    freightUsdM: 0,
    bonusUsdM: 0,
    idleUsdM: 0,
    tollUsdM: 4,
    minesBought: 2,
    omaniSent: 5,
    iranSent: 2,
    netUsdM: 0,
    price: 110,
    seat: "iran",
    factoryUp: false,
    warehouseUp: true,
    radarUp: true,
    portUp: true,
  });
  assert.ok(iran.some((l) => /Traffic live 7/.test(l)));
  assert.ok(iran.some((l) => /Mine factory is down/.test(l)));
  assert.ok(iran.some((l) => /A hull died/.test(l)));
  assert.ok(iran.some((l) => /Fear, not occupation/.test(l)));
  assert.ok(!iran.some((l) => /Traders paid you/.test(l)));
  assert.equal(
    outcomeTitle({
      id: "i1",
      turn: 1,
      kind: "live",
      door: "omani",
      netDeltaUsdM: 0,
      freightUsdM: 0,
      bonusUsdM: 0,
      tollUsdM: 0,
      damageUsdM: 0,
      idleUsdM: 0,
      minesBought: 0,
      usLine: "x",
      iranLine: "y",
      omaniMinePct: 40,
      iranMinePct: 0,
      omaniShotPct: 10,
      iranShotPct: 6,
      cause: "none",
      paid: false,
      watcher: "iran",
    }),
    COPY.trafficLive,
  );
});


