import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { INGEST_COUNTS, RECEIPTS, receiptById } from "./receipts.ts";

test("Hormuz owner receipts teach three buckets, not a few-ship tramp", () => {
  const agbi = receiptById("agbi-hormuz-fleets-2026");
  const shuttle = receiptById("semafor-hormuz-shuttle-2026");
  const crs = receiptById("crs-tanker-owners-2024");
  const hull = receiptById("seatrade-vlcc-newbuild-2026");
  const sinokor = receiptById("bloomberg-sinokor-hormuz-2026");
  assert.ok(agbi && shuttle && crs && hull && sinokor);
  assert.match(agbi!.annotation, /Bahri/);
  assert.match(agbi!.annotation, /Sinokor/);
  assert.match(agbi!.annotation, /state oil shipping/);
  assert.match(shuttle!.annotation, /38 Sinokor/);
  assert.match(shuttle!.annotation, /Greek/);
  assert.match(shuttle!.annotation, /Gulf state/);
  assert.match(crs!.annotation, /not a size word/);
  assert.match(crs!.annotation, /oil-major captive/);
  assert.match(crs!.annotation, /long tail/);
  assert.match(crs!.annotation, /dozens of hulls/);
  assert.match(hull!.annotation, /129/);
  assert.match(sinokor!.annotation, /150 VLCCs/);
  assert.match(sinokor!.annotation, /commercial house/);
  const ibf = receiptById("itf-ibf-hormuz-woa-2026");
  const bonus = receiptById("tt-sinokor-crew-bonus-2026");
  const onassis = receiptById("onassis-olympic-archetype");
  assert.ok(ibf && bonus && onassis);
  assert.match(ibf!.annotation, /refuse to sail/);
  assert.match(bonus!.annotation, /six months extra/);
  assert.match(onassis!.annotation, /not the player/);
  assert.match(onassis!.annotation, /Greece, Inc/);
  const war = receiptById("agbi-war-insurance-2026");
  const toll = receiptById("maritime-exec-irgc-toll-2026");
  assert.ok(war && toll);
  assert.match(war!.annotation, /10 percent/);
  assert.match(war!.annotation, /cannot buy/);
  assert.match(toll!.annotation, /\$2 million/);
  assert.match(toll!.annotation, /does not sweep mines/);
  const freight = receiptById("ajot-hormuz-freight-2026");
  assert.ok(freight);
  assert.match(freight!.annotation, /\$20 million/);
  assert.match(freight!.annotation, /not the owner eating/);
  assert.match(freight!.annotation, /Do not also charge it as idle/);
  const idleGo = receiptById("og360-vlcc-oman-china-2026");
  const idleMeg = receiptById("lloyds-vlcc-td3c-2026-09");
  assert.ok(idleGo && idleMeg);
  assert.match(idleGo!.annotation, /\$220k\/day/);
  assert.match(idleGo!.annotation, /idleUsdMPerHull is 2/);
  assert.match(idleMeg!.annotation, /\$759,969/);
  assert.match(idleMeg!.annotation, /GOO outside option/);
});

test("every receipt has id, url, annotation, and at least one beat", () => {
  const ids = new Set<string>();
  for (const r of RECEIPTS) {
    assert.ok(r.id.length > 0, "empty id");
    assert.equal(ids.has(r.id), false, `duplicate id ${r.id}`);
    ids.add(r.id);
    assert.ok(r.url.startsWith("http"), `${r.id} missing url`);
    assert.ok(r.annotation.length > 40, `${r.id} annotation too thin`);
    assert.ok(r.beats.length > 0, `${r.id} has no beats`);
    assert.doesNotMatch(r.annotation, /\u2014/, `${r.id} has an em-dash`);
    assert.doesNotMatch(r.title, /\u2014/, `${r.id} title has an em-dash`);
  }
  assert.ok(RECEIPTS.length >= 15, "bibliography too thin to teach");
});

test("master design is ingested in full", () => {
  const master = receiptById("master-design");
  assert.ok(master);
  assert.equal(master?.ingest, "full");
});

test("Navy Decoded cluster is present and marked honest", () => {
  const nd = RECEIPTS.filter((r) => r.kind === "navy-decoded");
  assert.ok(nd.length >= 8);
  for (const r of nd) {
    assert.match(r.authors, /Navy Decoded/, r.id);
    assert.doesNotMatch(r.authors, /Navy Response/, r.id);
    assert.doesNotMatch(r.authors, /WarVision/, r.id);
  }
  const fullIds = new Set([
    "nd-escort-trap",
    "nd-factories-rubble",
    "nd-dont-sweep-yet",
    "nd-tripoli",
    "nd-visibility-bolt",
    "nd-geometry-carriers",
    "nd-time-on-target",
    "nd-shadow-boarding",
    "nd-lcs-drones",
    "nd-swarm-mason",
    "nd-escort-physics",
    "nd-7-nights",
  ]);
  for (const r of nd) {
    if (fullIds.has(r.id)) {
      assert.equal(r.ingest, "full", r.id);
      const yt = new URL(r.url).searchParams.get("v");
      assert.ok(yt, r.id);
      const p = `docs/ingest/nd-${yt}.txt`;
      assert.equal(existsSync(p), true, p);
      const body = readFileSync(p, "utf8");
      if (r.id === "nd-7-nights") {
        assert.match(body, /unique-cycle-only/);
      } else {
        assert.match(body, /complete: yes/);
      }
      assert.ok(body.length > 8000, `${p} too short`);
    } else {
      assert.ok(
        r.ingest === "partial" || r.ingest === "metadata",
        `${r.id} marked full without an ingest file`,
      );
    }
  }
});

test("escort-trap full ingest file is a complete watch", () => {
  const p = "docs/ingest/nd-5Fq0m3krtiM.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /Samuel B. Roberts/);
  assert.ok(body.length > 8000, "transcript too short to be a full watch");
});

test("factories-rubble full ingest file is a complete watch", () => {
  const p = "docs/ingest/nd-ZVu88ZaIN1g.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /factory/);
  assert.ok(body.length > 8000, "transcript too short to be a full watch");
});

test("dont-sweep-yet full ingest file is a complete watch", () => {
  const p = "docs/ingest/nd-2NNZ2u2WDD0.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /EM52/);
  assert.ok(body.length > 8000, "transcript too short to be a full watch");
});

test("visibility-bolt full ingest file is a complete watch", () => {
  const p = "docs/ingest/nd-Rwd1D6pA1nY.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /keep pulling the bolt/);
  assert.ok(body.length > 8000, "transcript too short to be a full watch");
});

test("shadow-boarding full ingest file is a complete watch", () => {
  const p = "docs/ingest/nd-x5kiAuGmlss.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /vertical envelopment/);
  assert.ok(body.length > 8000, "transcript too short to be a full watch");
});

test("lcs-drones full ingest file is a complete watch", () => {
  const p = "docs/ingest/nd-esV3xvbjmbw.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /Lucas/);
  assert.ok(body.length > 8000, "transcript too short to be a full watch");
});

test("swarm-mason full ingest file is a complete watch", () => {
  const p = "docs/ingest/nd-Vk88S6bro1o.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /USS Mason/);
  assert.match(body, /illuminators/);
  assert.match(body, /15,000/);
  assert.ok(body.length > 8000, "transcript too short to be a full watch");
});

test("escort-physics full ingest file is a complete watch and not swarm", () => {
  const p = "docs/ingest/nd-MqEAgp0DKCo.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /Samuel B. Roberts/);
  assert.match(body, /Earnest Will/);
  assert.match(body, /two nautical mile/);
  assert.doesNotMatch(body, /USS Mason/);
  assert.ok(body.length > 8000, "transcript too short to be a full watch");
});

test("7-nights compilation dump is a unique cycle, not an 11-hour loop", () => {
  const p = "docs/ingest/nd-IwLVah12j6A.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /unique-cycle-only/);
  assert.match(body, /Wartthog/);
  assert.match(body, /Greater Tum/);
  assert.match(body, /BLU 138/);
  assert.match(body, /keep pulling the bolt/);
  const loops = body.split("keep pulling the bolt").length - 1;
  assert.equal(loops, 1, "compilation file still contains looped repeats");
  assert.ok(body.length > 20000, "unique cycle too short");
  assert.ok(body.length < 400000, "file looks like the raw 11-hour dump");
});

test("WarVision Avenger is not filed as Navy Decoded", () => {
  const r = receiptById("wv-avenger");
  assert.ok(r);
  assert.equal(r?.kind, "war-vision");
  assert.match(r?.authors ?? "", /WarVision/);
  assert.doesNotMatch(r?.authors ?? "", /Navy Decoded/);
  const p = "docs/ingest/wv-gq0OyP638J8.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
  assert.match(body, /USS Avenger/);
});

test("Navy Response 46-mines is not filed as Navy Decoded", () => {
  const r = receiptById("nr-46-mines-fishing-boat");
  assert.ok(r);
  assert.equal(r?.kind, "navy-response");
  assert.match(r?.authors ?? "", /Navy Response/);
  assert.doesNotMatch(r?.authors ?? "", /Navy Decoded/);
  const p = "docs/ingest/nr-2rZym_InYEU.txt";
  assert.equal(existsSync(p), true, p);
  const body = readFileSync(p, "utf8");
  assert.match(body, /complete: yes/);
});

test("Facebook blockade stays a title card", () => {
  const r = receiptById("nd-blockade-wont-reopen");
  assert.ok(r);
  assert.ok(r?.ingest === "partial" || r?.ingest === "metadata");
  assert.match(r?.url ?? "", /facebook\.com/);
});

test("architect locks receipt exists and does not average hull counts", () => {
  const r = receiptById("architect-locks-2026-09-09");
  assert.ok(r);
  assert.equal(r?.kind, "design");
  assert.equal(r?.ingest, "full");
  assert.match(r?.annotation ?? "", /17 pierside/);
  assert.match(r?.annotation ?? "", /120 speedboats/);
  assert.match(r?.annotation ?? "", /Do not average transcripts/);
  assert.doesNotMatch(r?.annotation ?? "", /\u2014/);
});

test("ingest counts add up", () => {
  assert.equal(
    INGEST_COUNTS.full + INGEST_COUNTS.partial + INGEST_COUNTS.metadata,
    RECEIPTS.length,
  );
});

test("bypass geography receipts exist", () => {
  assert.ok(RECEIPTS.some((r) => r.beats.includes("petroline-red-sea")));
  assert.ok(RECEIPTS.some((r) => r.beats.includes("fujairah-door")));
  assert.ok(RECEIPTS.some((r) => r.beats.includes("oman-is-ports")));
});
