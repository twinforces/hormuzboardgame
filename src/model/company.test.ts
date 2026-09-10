import assert from "node:assert/strict";
import test from "node:test";
import { COMPANY } from "./balance.ts";
import {
  accountantPick,
  captainsBalk,
  ceoPick,
  emptyBooks,
  expectedVoyageUsdM,
  fleetSize,
  hullsLeft,
  netUsdM,
  idleThisWeek,
  postIdle,
  postVoyage,
  voyageBonusUsdM,
  voyageFreightUsdM,
  voyagePayUsdM,
  voyagePremiumUsdM,
} from "./company.ts";

test("one live exit books freight and bonus, not hulls or families", () => {
  const freight = voyageFreightUsdM(104);
  const bonus = voyageBonusUsdM(104);
  const b = postVoyage(emptyBooks(), {
    live: true,
    freightUsdM: freight,
    bonusUsdM: bonus,
  });
  assert.equal(b.hullsSent, 1);
  assert.equal(b.hullsLive, 1);
  assert.equal(b.hullsLost, 0);
  assert.equal(b.freightUsdM, COMPANY.freightByBand.tolerable);
  assert.equal(b.bonusUsdM, COMPANY.traderBonusByBand.tolerable);
  assert.equal(b.hullWriteoffUsdM, 0);
  assert.equal(b.familyUsdM, 0);
  assert.equal(b.crewUsdM, 0);
  assert.equal(b.tollUsdM, 0);
  assert.equal(b.premiumUsdM, 0);
  assert.equal(netUsdM(b), freight + bonus);
});

test("a kill writes off the hull and pays the families, freight stays zero", () => {
  const freight = COMPANY.freightByBand.tolerable;
  const live = postVoyage(emptyBooks(), { live: true, freightUsdM: freight });
  const dead = postVoyage(live, { live: false });
  assert.equal(dead.hullsSent, 2);
  assert.equal(dead.hullsLive, 1);
  assert.equal(dead.hullsLost, 1);
  assert.equal(dead.freightUsdM, freight);
  assert.equal(dead.bonusUsdM, 0);
  assert.equal(dead.hullWriteoffUsdM, COMPANY.hullUsdM);
  assert.equal(dead.familyUsdM, COMPANY.familyUsdM);
  assert.equal(dead.crewUsdM, 0);
  assert.equal(
    netUsdM(dead),
    freight - COMPANY.hullUsdM - COMPANY.familyUsdM,
  );
  assert.ok(netUsdM(dead) < 0, "one boom blows more than one live run");
});

test("crew bonus sticks on the next live run and cargo never hits net", () => {
  const dead = postVoyage(emptyBooks(), { live: false });
  const freight = voyageFreightUsdM(130);
  const bonus = voyageBonusUsdM(130);
  const live = postVoyage(dead, {
    live: true,
    freightUsdM: freight,
    bonusUsdM: bonus,
    crewUsdM: COMPANY.crewBonusUsdM,
  });
  assert.equal(live.crewUsdM, COMPANY.crewBonusUsdM);
  assert.equal(
    netUsdM(live),
    freight + bonus - COMPANY.hullUsdM - COMPANY.familyUsdM - COMPANY.crewBonusUsdM,
  );
  assert.ok(!("cargoUsdM" in live));
});

test("a voyage policy pays the hull back and still charges premium", () => {
  const premium = voyagePremiumUsdM(104, "open");
  const dead = postVoyage(emptyBooks(), {
    live: false,
    premiumUsdM: premium,
    recoverUsdM: COMPANY.hullUsdM,
  });
  assert.equal(dead.hullWriteoffUsdM, COMPANY.hullUsdM);
  assert.equal(dead.recoverUsdM, COMPANY.hullUsdM);
  assert.equal(dead.premiumUsdM, premium);
  assert.equal(netUsdM(dead), -COMPANY.familyUsdM - premium);
  assert.equal(voyagePremiumUsdM(104, "collapsed"), 0);
});

test("toll sits on the books even if the hull dies", () => {
  const dead = postVoyage(emptyBooks(), {
    live: false,
    tollUsdM: COMPANY.tollUsdM,
  });
  assert.equal(dead.tollUsdM, COMPANY.tollUsdM);
  assert.equal(
    netUsdM(dead),
    -COMPANY.hullUsdM - COMPANY.familyUsdM - COMPANY.tollUsdM,
  );
});

test("panic pay is fatter than cheap because traders bid the bonus", () => {
  assert.ok(voyagePayUsdM(130) > voyagePayUsdM(80));
  assert.equal(voyageFreightUsdM(130), COMPANY.freightByBand.panic);
  assert.equal(voyageFreightUsdM(80), COMPANY.freightByBand.cheap);
  assert.equal(voyageBonusUsdM(80), 0);
  assert.ok(voyageBonusUsdM(130) > voyageBonusUsdM(104));
  assert.equal(voyagePayUsdM(130), COMPANY.freightByBand.panic + COMPANY.traderBonusByBand.panic);
});

test("accountants sit when both doors are negative and go on the fattest plus-EV door", () => {
  const sit = accountantPick({
    balk: false,
    omaniKill: 1,
    iranKill: 1,
    payUsdM: 23,
    crewUsdM: 0,
    insured: false,
    premiumUsdM: 6,
    tollUsdM: 2,
    idleUsdM: 0,
  });
  assert.equal(sit.door, "wait");
  assert.ok(sit.omaniEv < 0);
  assert.ok(sit.iranEv < 0);

  const omani = accountantPick({
    balk: false,
    omaniKill: 0.3,
    iranKill: 0.5,
    payUsdM: 40,
    crewUsdM: 0,
    insured: true,
    premiumUsdM: 6,
    tollUsdM: 2,
    idleUsdM: 0,
  });
  assert.equal(omani.door, "omani");
  assert.ok(omani.omaniEv > 0);

  const iran = accountantPick({
    balk: false,
    omaniKill: 0.5,
    iranKill: 0.1,
    payUsdM: 40,
    crewUsdM: 0,
    insured: true,
    premiumUsdM: 6,
    tollUsdM: 2,
    idleUsdM: 0,
  });
  assert.equal(iran.door, "iran");
  assert.ok(iran.iranEv > iran.omaniEv);

  const balk = accountantPick({
    balk: true,
    omaniKill: 0.1,
    iranKill: 0.1,
    payUsdM: 80,
    crewUsdM: 0,
    insured: true,
    premiumUsdM: 6,
    tollUsdM: 2,
    idleUsdM: 0,
  });
  assert.equal(balk.door, "wait");
});

test("naked 70 percent mine kill is a bad bet even with panic bonus", () => {
  const ev = expectedVoyageUsdM({
    kill: 0.7,
    payUsdM: voyagePayUsdM(130),
    crewUsdM: 0,
    insured: false,
    premiumUsdM: 0,
  });
  assert.ok(ev < 0, `naked 70% should sit, ev ${ev}`);
});

test("reopen has twelve hulls and captains balk until you wait after blood", () => {
  assert.equal(fleetSize("reopen-lane"), 12);
  assert.equal(fleetSize("one-transit"), 1);
  const lost = postVoyage(emptyBooks(), { live: false });
  assert.equal(hullsLeft("reopen-lane", lost), 11);
  assert.equal(captainsBalk({ crewSour: true }), true);
  assert.equal(captainsBalk({ crewSour: false }), false);
});

test("a slightly negative door still beats paying idle to sit", () => {
  const go = accountantPick({
    balk: false,
    omaniKill: 0.2,
    iranKill: 1,
    payUsdM: 23,
    crewUsdM: 0,
    insured: false,
    premiumUsdM: 0,
    tollUsdM: 2,
    idleUsdM: 20,
  });
  assert.ok(go.omaniEv < 0);
  assert.ok(go.omaniEv > -20);
  assert.equal(go.door, "omani");
});

test("idle this week scales with leftover hulls and hits net", () => {
  assert.equal(idleThisWeek("one-transit", emptyBooks()), COMPANY.idleUsdMPerHull);
  assert.equal(idleThisWeek("reopen-lane", emptyBooks()), COMPANY.idleUsdMPerHull * 12);
  const b = postIdle(emptyBooks(), 20);
  assert.equal(b.idleUsdM, 20);
  assert.equal(netUsdM(b), -20);
});

test("hull cost is a cited VLCC newbuild", () => {
  assert.equal(COMPANY.hullUsdM, 129);
  assert.equal(COMPANY.crew, 22);
  assert.equal(COMPANY.cargoTraderUsdM, 150);
  assert.equal(COMPANY.tollUsdM, 2);
  assert.equal(COMPANY.premiumByBand.panic, 13);
  assert.equal(COMPANY.traderBonusByBand.high, 18);
  assert.ok(COMPANY.familyUsdM > 0);
  assert.ok(COMPANY.freightUsdM > 0);
  assert.ok(COMPANY.hullUsdM > COMPANY.freightUsdM * 5);
});

test("idle is the Oman-China week, not MEG-China TCE twice", () => {
  assert.equal(COMPANY.idleUsdMPerHull, 2);
  assert.ok(
    COMPANY.idleUsdMPerHull < COMPANY.freightByBand.panic,
    "idle per hull is smaller than a panic taxi. Hormuz TCE is the voyage.",
  );
});

test("CEO waits the hot ribbon, never pays, and sails Oman when both risks are quiet", () => {
  assert.equal(
    ceoPick({ balk: false, omaniKill: 0.66, omaniShot: 0.32, waitingHulls: 0 }),
    "wait",
  );
  assert.equal(
    ceoPick({ balk: false, omaniKill: 0.1, omaniShot: 0.1, waitingHulls: 2 }),
    "omani",
  );
  assert.equal(
    ceoPick({ balk: false, omaniKill: 0.4, omaniShot: 0.05, waitingHulls: 3 }),
    "wait",
  );
  assert.equal(
    ceoPick({ balk: true, omaniKill: 0.05, omaniShot: 0.05, waitingHulls: 2 }),
    "wait",
  );
  assert.equal(
    ceoPick({ balk: false, omaniKill: 0.5, omaniShot: 0.4, waitingHulls: 6 }),
    "omani",
  );
});
