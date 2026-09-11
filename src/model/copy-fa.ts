/**
 * Farsi player-facing strings. Same keys as COPY. No em-dashes.
 * Persian yeh and keheh. Teaching beats, not a Hollywood charge.
 */

import type { LossReport, ScenarioId, TurnReport } from "./types.ts";
import { COMPANY } from "./balance.ts";

export const COPY_FA = {
  runOmani: "درِ آمریکا، راهروی عمانی",
  runToll: "درِ ایران، پرداخت عوارض",
  wait: "در صف بمان",
  waitHint: "یک شب بمان. هر بدنهٔ مانده ۲ میلیون دلار خواب است.",
  reset: "بذر تازه",
  debug: "روکش اشکال‌زدایی",
  payWarning: "عوارض موج است، نه روبش. مین‌های TSS هنوز هستند.",
  steel: "فولاد  سال‌ها، نه هفته",
  insuranceOpen: "بیمه باز است",
  insuranceCollapsed: "بیمه فرو ریخت",
  doorHint:
    "نوار آمریکا نزدیک عمان را بزن، یا مسیر ایران بین قشم و لارک. اگر امید ریاضی منفی است بمان. بعد از خون ناخداها سر می‌پیچند.",
  roleLock:
    "یونان، شرکت. حسابدارها در را برمی‌گزینند. اگر امید ریاضی مثبت است، برو. ناخداها بعد از خون هنوز سر می‌پیچند.",
  roleTanker: "مالک",
  houseName: "یونان، شرکت",
  roleUs: "آمریکا",
  roleIran: "ایران",
  roleYou: "تو",
  roleNext: "حرف می‌زند",
  booksFreight: "کرایه",
  booksBonus: "پاداش تاجر",
  booksHulls: "قلم‌خوردن بدنه",
  booksFamilies: "خانواده‌ها",
  booksCrew: "پاداش خدمه",
  booksQuote: "این سفر",
  booksNet: "خالص",
  booksSent: "بدنه‌های فرستاده",
  booksLive: "خروج زنده",
  booksLost: "از دست رفته",
  booksLeft: "بدنهٔ مانده",
  booksToll: "عوارض",
  booksPremium: "ریسک جنگ",
  booksRecover: "پرداخت بیمه",
  booksIdle: "خواب",
  booksNote:
    "کرایه تاکسی است. پاداش تاجر پیشنهاد بیرون‌کشیدن است وقتی نفت چاق است. خواب عمان‌چین است که نرفتی، حدود ۲ میلیون دلار هر بدنه در هفته. بشکه‌ها مال تو نیستند.",
  policyBuy: "برای این بدنه ریسک جنگ بخر",
  policyGone: "بیمه‌گرها رفتند. پوشش تمام شد.",
  policyHint:
    "قبل از در این را بزن. پوشش بدنه را اگر مین زد می‌پردازد. خانواده‌ها هنوز روی تو می‌نشینند. یک انفجار کاغذ نشستن را می‌کشد.",
  mineKill: "کشتن با مین",
  killHintOmani: "کشتن با مین روی نوار آمریکا. اسکورت قایق را می‌برد، دستگاه را نه.",
  killHintIran:
    "ایران صندوق خودش را مین‌گذاری نکرد. پرداخت وعده است که شلیک نکنند. مین‌ها هنوز در TSS نشسته‌اند و جابه‌جا می‌شوند.",
  shotKill: "شلیک",
  lossTitle: "بدنه رفت",
  lossClose: "دفتر را بخوان",
  lossMine:
    "آن درصد کشتن با مین روی مسیری است که زدی. دستگاه شنید. رگبار موشک نبود. شکست اسکورت نبود.",
  lossOmani: "نوار آمریکا روبش است، نه ناوشکن کنار تو.",
  lossTollPaid: "به سپاه پول دادی. قایق‌ها دست تکان دادند. مین نه. پرداخت روبش نیست، مین‌ها جابه‌جا می‌شوند.",
  lossCovered:
    "ریسک جنگ بدنه را پرداخت. خانواده‌ها هنوز روی تو می‌نشینند. بار مال تاجر بود. کاغذ مسیر مرد. بدنه‌های بعد لخت می‌روند.",
  lossNaked: "بیمه نبود. قلم‌خوردن بدنه به‌علاوه خانواده‌ها. بار مال تاجر بود.",
  orientation:
    "شمال ایران است. آب وسط تنگه است. مسندم عمان است. فجیره درِ دورزدن هرمز است.",
  photoCredit:
    "سنتینل‌۲ بی‌ابر ۲۰۲۴ از EOX. دادهٔ تغییر یافتهٔ کوپرنیکوس سنتینل. CC BY 4.0. همان برش مرمر آبی قبلی. عکس صحنه است. روکش بازی است.",
  notLive: "قیمت P یک شاخص آموزشی بذرخورده به طعم دلار در بشکه است. تیک زندهٔ EIA نیست.",
  minesGrow: "مین‌ها جابه‌جا می‌شوند. لکهٔ عدم قطعیت هر نوبت رشد می‌کند.",
  tssNote:
    "دو مایل دریایی خط، دو مایل دریایی حائل. شش مایل راهروی قابل استفاده. طعم Navy Decoded، ۲۱ مایل در باریکه.",
  fujairah: "فجیره درِ دورزدن هرمز است. پترولین روی دریای سرخ خالی می‌شود، نه به آسیا.",
  matchOver: "نشست تمام شد. دفتر را بخوان، نه دود را.",
  dead: "بدنه رفت. کشتی به‌علاوه خانواده‌ها. بیمه بعد از کشتن با مین در TSS نیمه کار نمی‌کند.",
  lived: "خروج زنده. کرایه و پاداش تاجر ثبت شد. ضریب بدنه ۱.",
  waited: "هنوز در صف. خواب ثبت شد. نیروی دریایی مین‌گذارها را زد. ایران TSS را کاشت.",
  collapsedNow: "یک انفجار در مسیر. بیمه تا پایان مسابقه فرو ریخت.",
  cargoNotYours: "بار هرگز مال تو نبود. تاجر ۱۵۰ میلیون دلار خورد. برای همین کاغذ می‌میرد.",
  crewBonusNow: "پاداش خدمه می‌ماند. سفرهای بعد پول خطر می‌پردازند.",
  balk: "ناخداها رد می‌کنند. بعد از خون یک نوبت بمان یا بسته می‌مانند.",
  noHulls: "بدنه تمام شد. دفتر را بخوان.",
  usDoorNote: "آبی خط‌چین نوار آمریکا سمت عمان است.",
  iranDoorNote: "قشم تا لارک صندوق است. صندوق خودشان را مین‌گذاری نکردند.",
  omaniDoor: "آمریکا",
  iranDoor: "ایران",
  navyPunched: "مین‌گذار غرق",
  fogBlobs: "لکه‌های مه",
  holesOpen: "روبش‌ها",
  navyNote:
    "سبز روبش این هفته است. قرمز مه روبش‌نشده است. قرمز روی آب می‌ماند. قرمز داخل سبز نمی‌نشیند. اسکورت شلیک را می‌برد، مین را نه.",
  sittingTitle: "این نشست",
  accountant: "حسابدارها",
  ceo: "مدیرعامل",
  accountantSit: "بمان. امید ریاضی منفی است.",
  ceoWait: "بمان. مین و شلیک هنوز داغ‌اند.",
  ceoOmani: "عمانی. ریسک به قدر کافی پایین است. پول نمی‌دهیم.",
  accountantNote: "حسابدارها هنوز امید ریاضی می‌شمارند. عوارض مین می‌خرد. پول نمی‌دهیم.",
  scenarioHelp: "کدام نشست؟ یکی را بردار. هفته‌ها می‌شمارند. ساعت نیست.",
  scenarioReopen: "دوازده بدنه. منتظر نیروی دریایی بمان، یا بپرداز و مین را مسئلهٔ کس دیگری کن.",
  scenarioOne: "یک بدنه. خواب هنوز می‌تیکد. وقتی امید ریاضی چاق است بفرست.",
  scenarioOverplay: "پنج بدنه. مین بیشتر. نیروی دریایی هفته‌ای سه لکه می‌روبد. قرمز می‌ماند.",
  scenarioMine: "🇺🇸 بعضی حریص‌اند. بعضی صبر می‌کنند. بزن یا بروب.",
  scenarioIran:
    "🇮🇷 تو ایران هستی. جنگ مین. صد بدنهٔ ترافیک. مین بکار، پهپاد یورش بده، یا سوله‌ها را نگه دار. ترس، نه اشغال.",
  scenarioAsk: "کدام نشست؟",
  tabIran: "ضربه",
  tabStrait: "تنگه",
  usSweep: "نوار را بروب",
  usStrike: "ضربه",
  strikeMarks: "برای ضربه روی دایره بزن.",
  magDrones: "پهپاد",
  magCounter: "ضدپهپاد",
  magLasers: "لیزر",
  magMines: "مین",
  magBoats: "قایق",
  nodeDown: "خراب",
  warHint:
    "برای ضربه روی دایره بزن، یا نوار را بروب. بعد از خون ترافیک می‌ماند تا بروبی. لانه عنکبوت را رها کن، خالی می‌شود.",
  warLock:
    "تو آمریکا هستی، جنگ ضد مین. صد بدنه. ده شرکت. بعضی امید ریاضی می‌شمارند. بعضی منتظر روبش‌اند. بعد از خون می‌مانند تا بروبی. وقتی صندوق میدان مین داغ‌تری شد، می‌چرخند.",
  iranLock:
    "تو ایران هستی. جنگ مین. نیروی دریایی سقف‌ها را می‌زند. ترافیک مال تو نیست. بکار، یورش، یا نگه دار. یک فعل در هفته. ترس، نه اشغال.",
  iranHint:
    "کاشت TSS را بذر می‌کند. یورش پهپاد را روی یک کشور خلیج خرج می‌کند. نگه داشتن سوله‌ها را پر می‌کند. بعد از روبش، نگه داشتن بزدلی نیست.",
  iranLay: "مین بکار",
  iranSurge: "یورش پهپاد",
  iranHold: "نگه دار",
  iranMarks: "بکار، یورش، یا نگه دار. یک فعل در هفته.",
  iranLayCoastal: "سوله‌ها خالی. کاشت یک سلول ساحلی را خالی می‌کند.",
  iranLayEmpty: "سوله‌ها خالی. ماندهٔ ساحلی تمام شد.",
  iranSurgeEmpty: "هوایی برای یورش نیست.",
  iranDry: "سوله‌ها خالی. هوا نیست. مه هنوز رشد می‌کند. قایق‌ها هنوز شلیک می‌کنند.",
  trafficBooks: "ترافیک",
  trafficNote: "صد بدنهٔ ترافیک، ده شرکت. مال تو نیستند. عوارض هنوز مین می‌خرد.",
  trafficWait: "ترافیک ماند.",
  trafficBalk: "ناخداها رد می‌کنند. نوار را بروب یا بسته می‌مانند.",
  holeDumped: "لانه خالی شد",
  leftHole: "لانه عنکبوت را رها کردی. ذخیره دوید. مین در TSS. پهپاد روی یک کشور خلیج.",
  leaveAsk: "لانه عنکبوت را رها کنی؟ ذخیره خالی می‌شود.",
  leaveStrike: "باز هم بزن",
  leaveSweep: "باز هم بروب",
  leaveKeep: "لانه را نگه دار",
  holeDumpedMark: "خالی شد",
  trafficLive: "ترافیک زنده",
  trafficGraze: "ترافیک خراشید",
  trafficLost: "ترافیک از دست رفت",
  outcomeGoStrait: "برو به تنگه",
  outcomeGoStrikes: "برو به ضربه",
  openStrait: "تنگه را باز کن",
  planStrikes: "طرح ضربه",
  laneChip: "مسیر",
  factoryPrints: "کارخانه مین هنوز چاپ می‌کند.",
  factoryDown: "کارخانه مین خراب است.",
  droneFactoryPrints: "کارخانه پهپاد هنوز چاپ می‌کند.",
  droneFactoryDown: "کارخانه پهپاد خراب است.",
  warehouseDown: "انبار مین خراب است.",
  droneWarehouseDown: "انبار پهپاد خراب است.",
  radarDown: "رادار خراب است.",
  portDown: "بندر خراب است.",
  spiderHole: "لانه عنکبوت",
  spiderEmoji: "🕳️",
  spiderTip: "مین و پهپاد پنهان. همین هفته بزن وگرنه خالی می‌شوند.",
  spiderDump: "لانه مین به TSS ریخت. پهپاد به یک کشور خلیج زد. ترس، نه اشغال.",
  matchOverHint: "بدنه تمام شد. دوباره بازی کن یا بذر تازه بگیر.",
  scoreTitle: "بدنه تمام شد",
  scoreReplay: "این نشست را دوباره بازی کن",
  scoreFresh: "بذر تازه",
  scoreClose: "دفتر را بخوان",
  chartLoading: "نقشه بار می‌شود",
  outcomeWait: "ماندی.",
  outcomeLive: "موفق",
  outcomeGraze: "موفق، با آسیب",
  outcomeClose: "بدنهٔ بعد",
  booksDamage: "آسیب",
  lastBeatIdle: "حسابدارها یک در نامیدند. بزن یا بمان.",
  boardActWait: "بمان. امید ریاضی منفی است.",
  boardActSit: "بمان. امید ریاضی منفی است.",
  boardActOmani: "عمانی. امید ریاضی مثبت است.",
  boardActIran: "ایران. امید ریاضی مثبت است.",
  boardActBalk: "ناخداها رد می‌کنند. بمان.",
  boardActNone: "نشست تمام شد.",
  clickOmani: "نوار آمریکا، سمت عمان",
  clickIran: "مسیر ایران، قشم تا لارک",
  hullYou: "بدنهٔ تو",
  hullWait: "منتظر",
  hullDead: "بدنه رفت",
  hullExit: "خروج زنده",
  mineEst: "مین حدودی",
  mineFog: "مه",
  mineHole: "روبش نیروی دریایی",
  mineSwept: "همین هفته روبیده شد",
  mineListen: "مه وقتی سوراخ تمام شود برمی‌گردد",
  appTitle: "Hormuz War Game",
  appJoint: "یک کار از GrumpyTechBro",
  appTag: "هرمز تول. ریاضی صنعتی و بازار را درس بده، نه یورش ناو هواپیمابر هالیوود.",
  navBoard: "صفحه",
  navBriefing: "توجیه",
  navArchitecture: "معماری",
  navReceipts: "رسیدها",
  langEn: "EN",
  langFa: "فا",
  week: "هفته",
  seedWord: "بذر",
  nodeMineFactory: "کارخانه مین",
  nodeDroneFactory: "کارخانه پهپاد",
  nodeMineWarehouse: "انبار مین",
  nodeDroneWarehouse: "انبار پهپاد",
  nodeRadar: "رادار",
  nodePort: "بندر",
  afterAction: "بعد از عمل",
  debugTitle: "اشکال‌زدایی",
  usSensing: "آمریکا حس می‌کند. نوار عمان به قدر کافی آرام است. پول نده.",
  logOmaniDoor: "در عمانی",
  logIranDoor: "در ایران",
  logShotKillRare: "کشتن با شلیک. نادر.",
  logShotMissed: "شلیک خطا رفت.",
  logLightDamage: "آسیب سبک",
  logMineWord: "مین",
  logShotWord: "شلیک",
  logBoom: "انفجار.",
} as const;

export const FA_KIT: Record<ScenarioId, { label: string; blurb: string }> = {
  "reopen-lane": { label: "🇬🇷 مدیرعامل نفتکش", blurb: COPY_FA.scenarioReopen },
  "one-transit": { label: "🇬🇷 ناخدای نفتکش", blurb: COPY_FA.scenarioOne },
  overplay: { label: "🇬🇷 مدیرعامل کوچک", blurb: COPY_FA.scenarioOverplay },
  "mine-warfare": { label: "جنگ ضد مین", blurb: COPY_FA.scenarioMine },
  "iran-warfare": { label: "جنگ مین", blurb: COPY_FA.scenarioIran },
};

export const FA_BAND = {
  cheap: "ارزان",
  tolerable: "قابل تحمل",
  high: "بالا",
  panic: "هراس",
} as const;

export const FA_PLACE: Record<string, string> = {
  "bandar-abbas": "بندرعباس",
  qeshm: "قشم",
  hormuz: "هرمز",
  larak: "لارک",
  "greater-tunb": "تنب بزرگ",
  "abu-musa": "ابوموسی",
  khasab: "خصب",
  musandam: "مسندم",
  fujairah: "فجیره",
  "persian-gulf": "خلیج فارس",
  strait: "تنگه هرمز",
  "gulf-oman": "دریای عمان",
  iran: "ایران",
  uae: "امارات",
  oman: "عمان",
};

export function faIdleChargeLine(hulls: number, per = COMPANY.idleUsdMPerHull): string {
  if (hulls <= 0) return "بدنهٔ مانده‌ای نیست.";
  return `${hulls} مانده × $${per}M = $${hulls * per}M این هفته.`;
}

export function faClickToStrike(label: string): string {
  return `برای ضربه به ${label} بزن`;
}

export function faLeaveHoleLine(verb: string): string {
  return `لانه عنکبوت را رها کنی تا ${verb}؟ ذخیره خالی می‌شود.`;
}

export function faUsStrikeLine(opts: {
  turn: number;
  target: string;
  already: boolean;
  mineFactoryUp?: boolean;
  droneFactoryUp?: boolean;
}): string {
  if (opts.already) return `هفته ${opts.turn}: ${faNode(opts.target)} از قبل خراب است.`;
  if (opts.target === "mine-factory") {
    return `هفته ${opts.turn}: آمریکا کارخانه مین را زد. سقف رفت.`;
  }
  if (opts.target === "drone-factory") {
    return `هفته ${opts.turn}: آمریکا کارخانه پهپاد را زد. خروجی شاهد به صفر می‌رود.`;
  }
  if (opts.target === "mine-warehouse") {
    return `هفته ${opts.turn}: آمریکا انبار مین را زد. مین آماده کم شد.`;
  }
  if (opts.target === "drone-warehouse") {
    return `هفته ${opts.turn}: آمریکا انبار پهپاد را زد. هوای آماده کم شد.`;
  }
  if (opts.target === "radar") {
    const leftover = opts.droneFactoryUp === false ? "" : " کارخانه پهپاد هنوز چاپ می‌کند.";
    return `هفته ${opts.turn}: آمریکا رادار ساحلی را زد. پهپادها حدس می‌زنند. مین‌ها هنوز جابه‌جا می‌شوند.${leftover}`;
  }
  if (opts.target === "spider-hole") {
    return `هفته ${opts.turn}: آمریکا یک لانه عنکبوت را زد. ذخیره پنهان رفت.`;
  }
  const leftover = opts.mineFactoryUp === false ? "" : " کارخانه مین هنوز چاپ می‌کند.";
  return `هفته ${opts.turn}: آمریکا بندر را زد. بدنه‌های کنار اسکله آهن قراضه‌اند. یک لانه عنکبوت خودش را نشان داد.${leftover}`;
}

function faNode(id: string): string {
  if (id === "mine-factory") return COPY_FA.nodeMineFactory;
  if (id === "drone-factory") return COPY_FA.nodeDroneFactory;
  if (id === "mine-warehouse") return COPY_FA.nodeMineWarehouse;
  if (id === "drone-warehouse") return COPY_FA.nodeDroneWarehouse;
  if (id === "radar") return COPY_FA.nodeRadar;
  if (id === "port") return COPY_FA.nodePort;
  if (id === "spider-hole") return COPY_FA.spiderHole;
  return id;
}

export function faSpiderRevealLine(opts: { turn: number; mines: number; drones: number }): string {
  const mines = Math.max(0, Math.round(opts.mines));
  const drones = Math.max(0, Math.round(opts.drones));
  return `هفته ${opts.turn}: یک بدنه خورد. لانه عنکبوت ${mines} مین و ${drones} پهپاد نشان داد. همین هفته بزن وگرنه خالی می‌شوند.`;
}

export function faSpiderTipLine(h: { mines: number; drones: number }): string {
  const mines = Math.max(0, Math.round(h.mines));
  const drones = Math.max(0, Math.round(h.drones));
  return `ذخیره پنهان: ${mines} مین، ${drones} پهپاد. همین هفته بزن وگرنه خالی می‌شوند.`;
}

export function faSpiderDumpLine(opts: { turn: number; mines: number; drones?: number }): string {
  const n = Math.max(0, Math.round(opts.mines));
  const d = Math.max(0, Math.round(opts.drones ?? 0));
  const air =
    d <= 0 ? "این هفته هوای اضافه نبود" : `${d} پهپاد به یک کشور خلیج زد`;
  return `هفته ${opts.turn}: لانه ${n} مین به TSS ریخت. ${air}. ترس، نه اشغال.`;
}

export function faUsSweepLine(opts: { turn: number; layers: number; nm2: number }): string {
  if (opts.layers <= 0) {
    return `هفته ${opts.turn}: اسکورت نیروی دریایی آمریکا نوار عمان را نگه داشت. مین‌گذار تازه‌ای در جنوب نبود.`;
  }
  return `هفته ${opts.turn}: نیروی دریایی آمریکا ${opts.layers} مین‌گذار را غرق کرد. روبنده‌ها ${opts.nm2} مایل مربع از مسیر جنوبی را پاک کردند.`;
}

export function faIranSeedLine(opts: {
  turn: number;
  laid: number;
  shot: "none" | "miss" | "graze" | "kill";
}): string {
  const seed =
    opts.laid <= 0
      ? `هفته ${opts.turn}: ذخیره مین ایران خالی بود.`
      : `هفته ${opts.turn}: ایران ${opts.laid} مین در TSS کاشت.`;
  if (opts.shot === "miss") return `${seed} به نفتکش شلیک کرد و خطا رفت.`;
  if (opts.shot === "graze") return `${seed} شلیک خورد. آسیب سبک. بدنه زنده ماند.`;
  if (opts.shot === "kill") return `${seed} شلیک بدنه را سوراخ کرد. نادر. زشت.`;
  return `${seed} پرداخت وعده است که شلیک نکنند. روبش نیست، مین‌ها جابه‌جا می‌شوند.`;
}

export function faIranHoldLine(turn: number): string {
  return `هفته ${turn}: ایران نگه داشت. سوله‌ها پر شد. چیز تازه‌ای در TSS نبود.`;
}

export function faIranSurgeLine(opts: { turn: number; drones: number; gulf: boolean }): string {
  const n = Math.max(0, Math.round(opts.drones));
  if (n <= 0) return `هفته ${opts.turn}: ایران هوایی برای یورش نداشت.`;
  const gulf = opts.gulf ? " یک کشور خلیج یورش را خورد. ترس، نه اشغال." : "";
  return `هفته ${opts.turn}: ایران ${n} پهپاد یورش داد.${gulf}`;
}

export function faIranCoastalLine(opts: { turn: number; mines: number; drones: number }): string {
  const n = Math.max(0, Math.round(opts.mines));
  const d = Math.max(0, Math.round(opts.drones));
  const air =
    d <= 0 ? "این هفته هوای اضافه نبود" : `${d} پهپاد به یک کشور خلیج زد`;
  return `هفته ${opts.turn}: سوله‌ها خالی بود. یک سلول ساحلی ${n} مین ریخت. ${air}.`;
}

export function faUsBrief(b: {
  omaniPct: number;
  iranPct: number;
  insurance: "open" | "collapsed";
  holeCount: number;
  paidLast: boolean;
  waiting: number;
  omaniEv: number;
}): string {
  if (b.insurance === "collapsed") {
    return "کاغذ مرد. ضریب بدنه ۰ یا ۱ است. اسکورت قایق را می‌برد، مین را نه. بمان مگر پاداش تاجر یک بدنهٔ لخت را بپوشاند.";
  }
  if (b.omaniEv < 0 && b.holeCount > 0) {
    return `روبش لکه است، نه مسیر پاک. عمانی هنوز ${b.omaniPct}٪ کشتن با مین است. امید ریاضی منفی است. بمان. پول نده.`;
  }
  if (b.omaniEv < 0) {
    return `پول نده. عمانی ${b.omaniPct}٪ کشتن با مین است. بمان. مین‌گذار را می‌زنیم. پاداش تاجر هنوز کافی نیست.`;
  }
  if (b.holeCount > 0) {
    return `در عمانی امشب ${b.omaniPct}٪ کشتن با مین است. تاجر بالا می‌پردازد. روبش داخل است. پول نده.`;
  }
  if (b.waiting > 0) {
    return `صف ${b.waiting} بدنه است. اسکورت سر پست است. عوارض هنوز سپاه را تغذیه می‌کند.`;
  }
  return `پول نده. در عمانی ${b.omaniPct}٪ کشتن با مین است. بمان. مین‌گذار را می‌زنیم. عوارض بذر بعد را می‌خرد.`;
}

export function faIranBrief(b: {
  omaniPct: number;
  iranPct: number;
  insurance: "open" | "collapsed";
  holeCount: number;
  paidLast: boolean;
}): string {
  if (b.insurance === "collapsed") {
    return "بیمه عادت غربی است. ما هنوز موج می‌فروشیم. بپرداز و شلیک نمی‌کنیم. دستگاه هنوز می‌شنود.";
  }
  if (b.paidLast) {
    return "دلارها نشست. شلیک نکردیم. مین‌ها تکان نخوردند. دوباره بیا.";
  }
  if (b.holeCount > 0) {
    return `مه را روبیدند، مین را نه. در ایران ${b.iranPct}٪ کشتن با مین است. بپرداز و شلیک نمی‌کنیم.`;
  }
  return `بپرداز. به آن‌ها که می‌پردازند شلیک نمی‌کنیم. نمی‌توانیم مین را وعده دهیم. عمانی ${b.omaniPct}٪ کشتن با مین است.`;
}

export function faLossLines(r: LossReport): string[] {
  const door = r.door === "iran" ? "در ایران" : "در عمانی";
  const lines = [
    `${door}. کشتن با مین ${r.killPct}٪ بود. ${COPY_FA.lossMine}`,
    r.door === "iran" ? COPY_FA.lossTollPaid : COPY_FA.lossOmani,
    r.insured ? COPY_FA.lossCovered : COPY_FA.lossNaked,
    `بدنه $${r.hullUsdM}M. خانواده‌ها $${r.familyUsdM}M. بار $${r.cargoUsdM}M هرگز مال تو نبود.`,
  ];
  if (r.insured) {
    lines.push(`بیمه $${r.recoverUsdM}M پرداخت. حق بیمه $${r.premiumUsdM}M بود.`);
  }
  if (r.paid) {
    lines.push(`عوارض $${r.tollUsdM}M هنوز موج بعد را تغذیه کرد.`);
  }
  lines.push(COPY_FA.balk);
  lines.push(COPY_FA.crewBonusNow);
  return lines;
}

export function faScoreLines(s: {
  weeks: number;
  live: number;
  lost: number;
  freightUsdM: number;
  bonusUsdM: number;
  idleUsdM: number;
  tollUsdM: number;
  minesBought: number;
  omaniSent: number;
  iranSent: number;
  netUsdM: number;
  price: number;
  seat?: "tanker" | "us" | "iran";
  factoryUp?: boolean;
  droneFactoryUp?: boolean;
  warehouseUp?: boolean;
  droneWarehouseUp?: boolean;
  radarUp?: boolean;
  portUp?: boolean;
}): string[] {
  const mines = Math.max(0, Math.round(s.minesBought));
  if (s.seat === "us") {
    const lines = [
      `هفته ${s.weeks}. نفت $${s.price}. سقف این عقربه $126 است.`,
      `ترافیک زنده ${s.live}. از دست رفته ${s.lost}.`,
    ];
    if (s.tollUsdM > 0) {
      lines.push(
        `ترافیک $${Math.round(s.tollUsdM)}M عوارض داد و ${mines} مین برای ایران خرید.`,
      );
    } else {
      lines.push("ترافیک $0 عوارض داد. کسی مین بعد را نخرید.");
    }
    lines.push(s.factoryUp === false ? COPY_FA.factoryDown : COPY_FA.factoryPrints);
    if (s.droneFactoryUp === false) lines.push(COPY_FA.droneFactoryDown);
    if (s.warehouseUp === false) lines.push(COPY_FA.warehouseDown);
    if (s.droneWarehouseUp === false) lines.push(COPY_FA.droneWarehouseDown);
    if (s.radarUp === false) lines.push(COPY_FA.radarDown);
    if (s.portUp === false) lines.push(COPY_FA.portDown);
    return lines;
  }
  if (s.seat === "iran") {
    const lines = [
      `هفته ${s.weeks}. نفت $${s.price}. سقف این عقربه $126 است.`,
      `ترافیک زنده ${s.live}. از دست رفته ${s.lost}.`,
    ];
    if (s.lost > 0) {
      lines.push("یک بدنه مرد. کاغذ مرد. این برد است.");
    } else {
      lines.push("هیچ بدنه‌ای نمرد. کاغذ هنوز زنده است.");
    }
    lines.push(s.factoryUp === false ? COPY_FA.factoryDown : COPY_FA.factoryPrints);
    if (s.droneFactoryUp === false) lines.push(COPY_FA.droneFactoryDown);
    if (s.warehouseUp === false) lines.push(COPY_FA.warehouseDown);
    if (s.droneWarehouseUp === false) lines.push(COPY_FA.droneWarehouseDown);
    if (s.radarUp === false) lines.push(COPY_FA.radarDown);
    if (s.portUp === false) lines.push(COPY_FA.portDown);
    lines.push("ترس، نه اشغال.");
    return lines;
  }
  const net = Math.round(s.netUsdM);
  const netLabel = net < 0 ? `-$${Math.abs(net)}M` : `$${net}M`;
  const lines = [
    `هفته ${s.weeks}. نفت $${s.price}. سقف این عقربه $126 است.`,
    `زنده ${s.live}. از دست رفته ${s.lost}.`,
    `کرایه $${Math.round(s.freightUsdM)}M.`,
    `تجار $${Math.round(s.bonusUsdM)}M پاداش به تو دادند.`,
    `خواب $${Math.round(s.idleUsdM)}M.`,
  ];
  if (s.tollUsdM > 0) {
    lines.push(
      `$${Math.round(s.tollUsdM)}M عوارض دادی و ${mines} مین برای ایران خریدی.`,
    );
  } else {
    lines.push("$0 عوارض دادی. مین بعدشان را نخریدی.");
  }
  lines.push(`خالص ${netLabel}.`);
  if (s.iranSent > 0 && s.omaniSent === 0) {
    lines.push("از صندوق ایران رفتی. مین‌ها مسئلهٔ کس دیگری ماند.");
  } else if (s.iranSent > 0) {
    lines.push("درها را قاطی کردی. هر عوارض هنوز یک مین خرید.");
  } else {
    lines.push("منتظر نیروی دریایی ماندی و نوار عمان را گرفتی.");
  }
  return lines;
}

export function faOutcomeLines(r: TurnReport): string[] {
  if (r.watcher === "us" || r.watcher === "iran") {
    const lines: string[] = [];
    if (r.dumped) lines.push(COPY_FA.leftHole);
    if (r.wave) {
      lines.push(
        `${r.wave.sent} رفت. ${r.wave.waited} ماند. پرداخت ${r.wave.paid}. عمان ${r.wave.omani}. زنده ${r.wave.live}. از دست رفته ${r.wave.lost}.`,
      );
      if (r.wave.paid > 0) {
        const n = Math.max(1, Math.round(r.minesBought));
        lines.push(`عوارض $${Math.round(r.tollUsdM)}M برای ایران ${n} مین خرید.`);
      }
    } else if (r.kind === "wait") {
      lines.push("ترافیک روی نوار ماند.");
    } else if (r.kind === "lost") {
      const how = r.cause === "shot" ? "شلیک بدنه را سوراخ کرد." : "مین شنید.";
      lines.push(`یک بدنهٔ ترافیک رفت. ${how}`);
      if (r.paid) {
        const n = Math.max(1, Math.round(r.minesBought));
        lines.push(`$${Math.round(r.tollUsdM)}M پرداختند. این برای ایران ${n} مین خرید.`);
      }
    } else {
      const door = r.door === "iran" ? "در ایران" : "در عمانی";
      lines.push(`یک بدنه ${door} را گرفت.`);
      if (r.paid) {
        const n = Math.max(1, Math.round(r.minesBought));
        lines.push(`$${Math.round(r.tollUsdM)}M پرداختند. این برای ایران ${n} مین خرید.`);
      }
      if (r.damageUsdM > 0) {
        lines.push(`آسیب سبک $${Math.round(r.damageUsdM)}M. بدنه زنده ماند.`);
      }
    }
    lines.push(r.usLine);
    lines.push(r.iranLine);
    lines.push(
      `ریسک مین عمانی حالا ${r.omaniMinePct}٪ است. شلیک ${r.omaniShotPct}٪. مین ایران ${r.iranMinePct}٪.`,
    );
    return lines;
  }
  const net = Math.round(r.netDeltaUsdM);
  const netLabel = net < 0 ? `-$${Math.abs(net)}M` : `$${net}M`;
  const lines: string[] = [];
  if (r.kind === "wait") {
    lines.push(`خواب $${Math.round(r.idleUsdM)}M. بدنه نفرستادی.`);
  } else if (r.kind === "lost") {
    const how = r.cause === "shot" ? "شلیک تو را سوراخ کرد." : "مین شنید.";
    lines.push(`بدنه رفت. ${how}`);
    if (r.paid) {
      const n = Math.max(1, Math.round(r.minesBought));
      lines.push(
        `$${Math.round(r.tollUsdM)}M عوارض دادی و ${n} مین برای ایران خریدی. پرداخت روبش نیست، مین‌ها جابه‌جا می‌شوند.`,
      );
    }
  } else {
    lines.push(`خالص ${netLabel} ساختی.`);
    lines.push(`کرایه $${Math.round(r.freightUsdM)}M.`);
    if (r.bonusUsdM > 0) {
      lines.push(`تجار $${Math.round(r.bonusUsdM)}M پاداش به تو دادند.`);
    }
    if (r.tollUsdM > 0) {
      const n = Math.max(1, Math.round(r.minesBought));
      lines.push(`$${Math.round(r.tollUsdM)}M عوارض دادی و ${n} مین برای ایران خریدی.`);
    }
    if (r.damageUsdM > 0) {
      lines.push(`آسیب سبک $${Math.round(r.damageUsdM)}M. بدنه زنده ماند.`);
    }
  }
  lines.push(r.usLine);
  lines.push(r.iranLine);
  lines.push(`ریسک مین عمانی حالا ${r.omaniMinePct}٪ است. شلیک ${r.omaniShotPct}٪.`);
  return lines;
}

export function faExpectedDoorLine(door: "omani" | "iran", ev: string): string {
  return door === "omani" ? `عمانی. امید ریاضی ${ev}.` : `ایران. امید ریاضی ${ev}.`;
}
