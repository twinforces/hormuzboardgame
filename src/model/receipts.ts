/**
 * Living annotated bibliography.
 * If you use a source in the sim, add it here the same turn.
 * The /receipts page renders this catalog. Do not duplicate it in markdown.
 */

export type ReceiptKind =
  | "navy-decoded"
  | "navy-response"
  | "war-vision"
  | "official"
  | "journalism"
  | "geography"
  | "market"
  | "legal"
  | "design";

export type Receipt = {
  id: string;
  kind: ReceiptKind;
  title: string;
  authors: string;
  date: string;
  url: string;
  /** Honest status. Snippets are not full transcripts. */
  ingest: "full" | "partial" | "metadata";
  /** What this source is doing in the sim. */
  annotation: string;
  beats: string[];
};

export const RECEIPTS: Receipt[] = [
  {
    id: "nd-escort-trap",
    kind: "navy-decoded",
    title: "Why the US Navy Still Won't Escort a Single Tanker Through Hormuz",
    authors: "Navy Decoded",
    date: "2026-03-12",
    url: "https://www.youtube.com/watch?v=5Fq0m3krtiM",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-5Fq0m3krtiM.txt. ASR kept in the file (Bob Elmandeb = Bab el-Mandeb, EEG's = Aegis, a4 million = a quarter million not four million, teal = TEL). Beats that survive a full watch: 21 nm narrows, TSS 2+2+2 = 6 nm usable, VLCC about 1,100 ft / 200 ft beam / 72 ft draft, mines laid before first bombs, 16 minelayers sunk does not sweep, Avenger class almost gone (four left in Japan, months to clear), Samuel B. Roberts $1,500 mine vs $89.5 million repair, 90 percent destruction is not escort, leftover trap is mines plus hidden TELs plus IRGC boats/Ghadir/USVs, geometry flip: Lincoln holds the Gulf of Oman and Iran sealed its own 1.4 mb/d export door. Do not retune kill tables from inventory flavor without a second source.",
    beats: ["escort-trap", "mines-not-bombed", "2nm-lanes", "21nm", "clearance-is-rented", "carrier-in-the-lane"],
  },
  {
    id: "nd-factories-rubble",
    kind: "navy-decoded",
    title: "Why the US Navy Is Letting Iran's Hormuz Blockade Destroy Itself",
    authors: "Navy Decoded",
    date: "2026-03-13",
    url: "https://www.youtube.com/watch?v=ZVu88ZaIN1g",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-ZVu88ZaIN1g.txt. ASR kept in the file (Shahude = Shahroud, Parin/Partin = Parchin, NAS1 = Nasr-1, a4 million = a quarter million). Beats that survive a full watch: day-1 magazine dump vs day-10 trickle is an extinction curve not restraint, Shahroud/Isfahan/Parchin/Khojir as the factory list, solid fuel is the hard node, 200 to 300 Shahed per month is peacetime output and goes to near zero when the roof is gone, 1,500 fast boats are sheds not a factory but the Nasr-1 is the factory, a hull without the missile is a fishing boat, 16 minelayers sunk plus stores struck means mines in the water are the last mines, three burning hulls were companies gambling on a kill zone the Navy refused to escort, $25,000 JDAM kit plus bomb vs decades of investment, Admiral Cooper: attacks dropped, Iran did not choose to stop. Do not retune kill tables from 400/40 or 700/60 without a second source.",
    beats: ["bomb-factories-first", "price-as-factory-inverse", "mines-not-bombed"],
  },
  {
    id: "nd-dont-sweep-yet",
    kind: "navy-decoded",
    title: "Why the US Navy Won't Use the Technology It Built to Clear Every Mine",
    authors: "Navy Decoded",
    date: "2026-03-19",
    url: "https://www.youtube.com/watch?v=2NNZ2u2WDD0",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-2NNZ2u2WDD0.txt. Last two tokens All/From look like a cut CTA. Teaching closer is present. ASR kept in the file (MO8 = M-08, Sedaf/SATAF0 = Sadat-02, Carg = Kharg, Gadier = Ghadir). Beats that survive a full watch: EM52 is a China-designed rocket rising mine (308 lb, 260 ft/s), inventory flavor 5,000 to 6,000, three families (contact Sadat-02, influence mag/acoustic/pressure, rising EM52), one tanker kill sinks the insurance policy not the fleet, TSS ribbon is 2 nm not 21, four unmanned steps ALMDS / CUSV sonar / UISS decoy / Archerfish, three wait variables (faucet shut, Tripoli bubble, mines also siege Iran 1.4 mb/d), you clear 100 they lay 200 so mop after the faucet. Honest conflict with nd-ZVu88ZaIN1g: 16 minelayers there vs 26 here (16 at sea plus 10 at berths). Do not retune from either count.",
    beats: ["bomb-storehouses", "clearance-is-rented", "china-quiet-factory", "mines-not-bombed"],
  },
  {
    id: "nd-tripoli",
    kind: "navy-decoded",
    title: "Why the US Navy Rushed USS Tripoli to the Strait of Hormuz",
    authors: "Navy Decoded",
    date: "2026-03-16",
    url: "https://www.youtube.com/watch?v=vMy69tl25r8",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-vMy69tl25r8.txt. ASR kept in the file (Buganville = Bougainville, stool = STOVL, Tumb = Tunb, Highars = HIMARS, Ebo = EABO). Beats that survive a full watch: 90 percent is not escort, one burning hull closes insurance, Tripoli is the America-class flight-zero with no well deck so 20 F-35Bs on a 44,000 ton / $3.5B hull expendable enough to get close where Ford and Lincoln will not, three tools for the leftover 10 percent (time-on-station CAP at 100 nm vs 500, Osprey raids over mines onto Abu Musa and the Tunbs, EABO/HIMARS kill zone that protects LCS sweepers), Marines stay and Iran cannot garrison islands and coast at once, this does not open Hormuz tomorrow it shifts months to weeks. Do not retune from 20 jets, 100 vs 500 nm, or months-to-weeks.",
    beats: ["boarding-scalpel", "carrier-in-the-lane", "pits-relocate", "escort-trap"],
  },
  {
    id: "wv-avenger",
    kind: "war-vision",
    title: "Why Iran's Entire Mine Strategy Fails Against One US Ship Nobody Talks About",
    authors: "WarVision",
    date: "2026-04-05",
    url: "https://www.youtube.com/watch?v=gq0OyP638J8",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/wv-gq0OyP638J8.txt. Catalog originally filed this URL as Navy Decoded by title. Channel is WarVision. Script still says Subscribe to Navy Decoded. Beats that survive a full watch: influence mines wait for magnetic plus acoustic plus pressure, Avenger severs all three with wood hull degaussing isolators and a small pressure wave, 200 m lane at 5-7 kn, mines fire once factories are ash. Flavor for US clearance, not a second board. Honest conflicts: 11 Avengers in class with Pioneer and Chief in Bahrain now vs ND LCS last-four-withdrawn Sep 2025, $15k-$60k Sadat vs $1,500 M-08 vs Navy Response $15k EM52, 1,212 tons then 1,312 tons in the same watch. EM52 308 lb / 260 ft/s matches don't-sweep. Do not retune from 200 m, 5-7 kn, $28,000 disposal, $277M hull, or Pioneer/Chief in Bahrain.",
    beats: ["bomb-factories-first", "clearance-is-rented"],
  },
  {
    id: "nd-visibility-bolt",
    kind: "navy-decoded",
    title: "How the US Navy Rushed a New Weapon In to Crack Open Hormuz",
    authors: "Navy Decoded",
    date: "2026-07-14",
    url: "https://www.youtube.com/watch?v=Rwd1D6pA1nY",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-Rwd1D6pA1nY.txt. One clause after docked Iranian submarine looks cut. Teaching closer is present. ASR kept in the file (Sentcom = CENTCOM, Bander Abbas = Bandar Abbas, dark hall = dark hull). Beats that survive a full watch: control is the sightline not the water, Project Freedom daylight escort lasted barely a day because a convoy that announces itself is a firing solution, tanker dark-run is AIS-off lights-out 1am 6-7 hours with a 30-minute encrypted whisper, blackout beats eyes not radar, Lincoln and Bush plus Growlers plus radar restrikes blind the coast, three uncrewed boats spend themselves at Bandar Abbas so the tanker never rides beside an escort, Oman southern corridor and cliff terrain mask, GPS spoofing forces compass and paper chart, a weapon that cannot find is a guess. Do not retune from July 12, 90 percent transit drop, or the 30-minute whisper.",
    beats: ["visibility-is-the-bolt", "dark-run", "escort-trap"],
  },
  {
    id: "nd-geometry-carriers",
    kind: "navy-decoded",
    title: "Why the US Navy Became the Kill Zone Instead of Entering It",
    authors: "Navy Decoded",
    date: "2026-03-10",
    url: "https://www.youtube.com/watch?v=ovQMYjMDxUI",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-ovQMYjMDxUI.txt. Opening starts mid-word at Fury. Teaching closer is present. ASR kept in the file (Bob Elmandeb = Bab el-Mandeb, emails = EMALS, Jaz = Jask). Beats that survive a full watch: the Gulf is a bathtub so carriers stay in open water, three vertices lock Hormuz / Bab el-Mandeb / Suez, concentrated firepower is one problem Iran can solve and three azimuths are not, Lincoln sits on the export door, Ford cuts the proxy umbilical, Bush is the third wall, the Jask bypass failed after one trial shipment, default teaching scenario keeps capital ships off-map. Architect lock 2026-09-09: 1.4 vs 1.6 mb/d is the same faucet, sim uses 1.5. Do not retune from 30 warships, 2,000 targets, or $46B.",
    beats: ["carrier-in-the-lane", "21nm"],
  },
  {
    id: "nd-time-on-target",
    kind: "navy-decoded",
    title: "Why the US Navy Needed Time-on-Target to Erase Iran's Fleet",
    authors: "Navy Decoded",
    date: "2026-03-07",
    url: "https://www.youtube.com/watch?v=QZGms77sv-k",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-QZGms77sv-k.txt. ASR kept in the file (Bendar Abbas = Bandar Abbas, Macccron = Makran, ODA = OODA, MALD, JDAM). Beats that survive a full watch: time-on-target is industrial execution not rage, Bandar Abbas was a pierside bullseye not a fortress, cyber plus MALD ghosts drain the SAM magazines before the steel arrives, Tomahawks open the cage then JDAM strings erase the dry docks, 17 hulls die at the pier because they worshiped exquisite platforms in a shallow basin. Flavor for strike-industry tempo: slow, planned, high value. Architect lock 2026-09-09: 17 is the pierside warship slice at match start, not the FAC count. Honest leftover: this watch puts Arleigh Burke VLS in the Persian Gulf, geometry watch keeps the bathtub empty. Default teaching scenario still keeps capital ships off-map.",
    beats: ["bomb-factories-first", "visibility-is-the-bolt"],
  },
  {
    id: "nd-lcs-drones",
    kind: "navy-decoded",
    title: "Why the US Navy Chose Its Most Broken Ship for the Hardest Mission",
    authors: "Navy Decoded",
    date: "2026-03-21",
    url: "https://www.youtube.com/watch?v=esV3xvbjmbw",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-esV3xvbjmbw.txt. ASR kept in the file (triaran = trimaran, Latoral = Littoral, Lucas, Canbor = Canberra). Beats that survive a full watch: carriers and Aegis stay outside the bathtub, LCS is the expendable node inside the cage, cracked Independence trimaran plus failed modules left an 11,000 sq ft stable deck, Lucas at $35,000 blinds the SAM grid so Tomahawks finish, CUSV plus ALMDS plus AMNS keep sailors out of the minefield, last four Avengers left Bahrain Sep 2025. Sensing and clearance without a prestige hull in the TSS. Architect lock 2026-09-09: 100-plus hulls is FAC flavor, not 100 destroyers. Avenger status stays open research. Do not retune from $35,000, $5M SM-6, $1,500 mines, or 40 knots.",
    beats: ["visibility-is-the-bolt", "clearance-is-rented", "carrier-in-the-lane"],
  },
  {
    id: "nd-swarm-mason",
    kind: "navy-decoded",
    title: "How Two US Navy Destroyers Survived a Real Swarm War at Hormuz",
    authors: "Navy Decoded",
    date: "2026-05-07",
    url: "https://www.youtube.com/watch?v=Vk88S6bro1o",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-Vk88S6bro1o.txt. ASR kept in the file (Truckton = Truxtun, Failank = Phalanx, Nure = Noor). Beats that survive a full watch: SPY-1 can track a hundred but an Arleigh Burke has three illuminators so killing is the bottleneck, Red Sea was one domain Hormuz is three, Project Freedom day one worked because helicopters took the boats and Growlers wasted missiles so the radar stayed on the sky, five layers cost 15,000 people and do not scale, a lone destroyer in the lane is prestige-target math. Complementary with visibility-bolt: daylight escort can work for one sitting if you bring a strike group and then it still does not scale. Honest conflict: SM-6 ~$4.3M here vs nearly $5M in LCS. Do not retune from 3 illuminators, 6-7 boats, zero US hulls hit, 15,000 people, or May 4.",
    beats: ["carrier-in-the-lane", "escort-trap"],
  },
  {
    id: "nd-shadow-boarding",
    kind: "navy-decoded",
    title: "Why the US Navy Took Iran's Shadow Tanker Without Firing a Shot",
    authors: "Navy Decoded",
    date: "2026-07-23",
    url: "https://www.youtube.com/watch?v=x5kiAuGmlss",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nd-x5kiAuGmlss.txt. One chapter heading is split. ASR kept in the file (W Yao / Wen Yao / Wao, UH1Y, Belma, decoy holes = hulls). Beats that survive a full watch: a loaded hull is too expensive to shoot and too valuable to wave through, cargo is the armor, flag-hop plus AIS masks force a flag-verification boarding, vertical envelopment from USS Boxer skips the one face a tanker can defend, bridge and engine room before the Kingston valves, a captured ship opens the network a sunk one does not, 16 July three-tool split (board the full one, Hellfire the empty one, radio-turn the rest). Directly feeds the US boarding action. Do not retune from 300,000 tons, 2 million barrels, two dozen decoys, or that three-tool split.",
    beats: ["boarding-scalpel", "shadow-fleet"],
  },
  {
    id: "nr-46-mines-fishing-boat",
    kind: "navy-response",
    title: "Why the US Navy Found 46 Mines Hidden Under a Fishing Boat at Hormuz",
    authors: "Navy Response",
    date: "2026-04-29",
    url: "https://www.youtube.com/watch?v=2rZym_InYEU",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09. File: docs/ingest/nr-2rZym_InYEU.txt. Catalog originally filed this URL as Navy Decoded by title. Host line is Navy Response. Beats that survive a full watch: EM52 is a rocket rising bottom mine not a static contact charge, a dhow riding 4 in too low is the detect, VBSS finds a purpose-built rail and a lanyard, six nights of hand GPS drops, tidal channel plus rolling deck means overlap and post-lay shift, 95 percent provisionally clear is not zero, the campaign adapted after it stopped being covert. This is why the board draws growing probability circles not pins. Honest conflicts with the Navy Decoded cluster, do not merge: $15,000 EM52 here vs $1,500 M-08/Sadat there, 300 kg warhead here vs 308 lb there, Avenger class in theater here vs almost decommissioned there. Do not retune from 46, 40-60, 8 per night, 11-day sweep, or 5 percent residual.",
    beats: ["fog-grows", "mines-drift", "boarding-scalpel", "clearance-is-rented"],
  },
  {
    id: "nd-blockade-wont-reopen",
    kind: "navy-decoded",
    title: "Why the US Navy Blockade Still Won't Reopen Hormuz",
    authors: "Navy Decoded",
    date: "2026-04-13",
    url: "https://www.facebook.com/NavyDecodedOf/videos/why-the-us-navy-blockade-still-wont-reopen-hormuz/1627549635149400/",
    ingest: "partial",
    annotation:
      "Unanchored mines, no numbered chart, 2 nm lane x 21 nm long. You cannot clear from coordinates. You search. Fog that grows every turn.",
    beats: ["fog-grows", "21nm", "2nm-lanes"],
  },
  {
    id: "nd-7-nights",
    kind: "navy-decoded",
    title: "7 Nights, 300 Targets: How the US Navy Cracked Open Hormuz",
    authors: "Navy Decoded",
    date: "2026-07-19",
    url: "https://www.youtube.com/watch?v=IwLVah12j6A",
    ingest: "full",
    annotation:
      "Unique cycle extracted from a looping YouTube HTML transcript dump, 2026-09-09. File: docs/ingest/nd-IwLVah12j6A.txt. The panel ran 11h12m and repeated the same ~1h40m compilation six times. Repeats discarded. Unique cycle: Wen Yao boarding, Triton picket, escort-trap 90 percent, A-10 Warthog vs FAC swarm, Greater Tunb / BLU-138, visibility-bolt closer. Boarding and visibility-bolt already full as separate watches. New flavor: spotting is the hard half of boarding, A-10 cheap gun vs 1,500 boats, bunker-busting the island the Navy cannot dig. Architect lock 2026-09-09: 120 hulls is speedboats on the water, 17 is pierside warships, 1,500 is sheds. Do not retune from A-10 $19k/hr or BLU-138. Do not treat the 11-hour loop as extra evidence.",
    beats: ["boarding-scalpel", "visibility-is-the-bolt", "escort-trap"],
  },
  {
    id: "iea-hormuz-2026",
    kind: "geography",
    title: "Strait of Hormuz 2026 Factsheet",
    authors: "International Energy Agency",
    date: "2026-02",
    url: "https://iea.blob.core.windows.net/assets/c8248eba-8689-46d9-ae4b-b858b59c0f1c/StraitofHormuz2026-Factsheet.pdf",
    ingest: "partial",
    annotation:
      "Geographic narrows 29 nm. Two 2 nm navigable channels plus 2 nm buffer. ADCOP Habshan-Fujairah ~1.5-1.8 mb/d with spare. Petroline Abqaiq-Yanbu design 5 mb/d, reported 7, spare untested. Yanbu is Red Sea. That is not a free Asia door.",
    beats: ["2nm-lanes", "petroline-red-sea", "fujairah-door", "steel-takes-years"],
  },
  {
    id: "eia-chokepoint",
    kind: "market",
    title: "Strait of Hormuz remains a critical oil chokepoint",
    authors: "U.S. Energy Information Administration",
    date: "2025",
    url: "https://www.eia.gov/todayinenergy/detail.php?id=65504",
    ingest: "metadata",
    annotation:
      "Baseline flow ~20 million b/d, about 20% of petroleum liquids consumption. Price meter is a teaching index around this fact, not a live feed. Live prices would make tests lie. Historical correlation lives in balance.HISTORY.",
    beats: ["price-meter", "21nm"],
  },
  {
    id: "imo-tss",
    kind: "legal",
    title: "IMO Traffic Separation Scheme, Strait of Hormuz (1968 scheme, still the baseline)",
    authors: "International Maritime Organization / Washington Institute summary",
    date: "1968 / 2026-09-04",
    url: "https://www.washingtoninstitute.org/policy-analysis/reaching-viable-management-arrangements-strait-hormuz",
    ingest: "partial",
    annotation:
      "Inbound 2 nm, separation 2 nm, outbound 2 nm. TSS sits primarily in Omani territorial waters. Omani-side track is less Iranian, not safe. Iran-defined alternative corridors are a tanker dark/Iranian-side option, not a second TSS.",
    beats: ["2nm-lanes", "omani-not-safe"],
  },
  {
    id: "kpler-outside-tss",
    kind: "market",
    title: "94% of Hormuz transits are now outside the IMO lane",
    authors: "Kpler",
    date: "2026-06-26",
    url: "https://www.kpler.com/blog/hormuz-transits-are-now-outside-the-imo-lane-what-that-means-for-risk-assessment",
    ingest: "partial",
    annotation:
      "After the crisis, most hulls left the IMO TSS for Iranian corridors or AIS-off tracks. Supports tanker actions Run Iranian-side / dark. Insurance collapse is a market event, not a sink-count.",
    beats: ["dark-run", "insurance-collapse"],
  },
  {
    id: "nyt-mines-interactive",
    kind: "journalism",
    title: "How Iran's Naval Mines Work",
    authors: "The New York Times (Ismay et al.)",
    date: "2026-03-13",
    url: "https://www.nytimes.com/interactive/2026/03/13/world/middleeast/iran-mines-strait-hormuz.html",
    ingest: "partial",
    annotation:
      "DIA-scale inventory flavor (thousands, not pins). Shallow enough to lay. Reopening does not require finding every mine, only a certified corridor. Hole, not omniscience. Sources on the page: CAT-UXO, RAND, GEBCO, IMO.",
    beats: ["fog-grows", "clearance-is-rented"],
  },
  {
    id: "fox-centcom-tss-clear",
    kind: "official",
    title: "CENTCOM details mine clearance of Hormuz TSS",
    authors: "Fox News quoting Adm. Brad Cooper / CENTCOM",
    date: "2026-08-31",
    url: "https://www.foxnews.com/politics/inside-dangerous-us-mission-cleared-irans-mines-hormuz-shipping-lanes",
    ingest: "partial",
    annotation:
      "Clearance of the Traffic Separation Scheme, not the whole Gulf. Divers, SEALs, air power, months not turns. Axios figure of 200-plus mine-like objects is a flavor bound, not a counter in v1.",
    beats: ["clearance-is-rented", "2nm-lanes"],
  },
  {
    id: "wiki-project-freedom",
    kind: "journalism",
    title: "Operation Project Freedom",
    authors: "Wikipedia (living page, treat as index not gospel)",
    date: "2026-09",
    url: "https://en.wikipedia.org/wiki/Operation_Project_Freedom",
    ingest: "partial",
    annotation:
      "Index of the escort operation (4-5 May 2026), pause, subsequent destroyer transit. Use to find primary briefs (Hegseth / Caine / Rubio), not to tune kill tables.",
    beats: ["escort-trap"],
  },
  {
    id: "hudson-clark",
    kind: "journalism",
    title: "Lessons Learned from Epic Fury and Project Freedom",
    authors: "Bryan Clark, Hudson Institute / CAVASSHIPS",
    date: "2026-05-08",
    url: "https://www.hudson.org/defense-strategy/lessons-learned-epic-fury-project-freedom-bryan-clark",
    ingest: "metadata",
    annotation:
      "Secondary professional commentary on the same cluster. Marker for a later listen. Not used for numbers yet.",
    beats: ["escort-trap"],
  },
  {
    id: "reuters-sts-fujairah",
    kind: "journalism",
    title: "US using ship-to-ship transfers to sneak oil out of the Gulf",
    authors: "Reuters",
    date: "2026-06-16",
    url: "https://www.reuters.com/business/energy/us-is-using-an-iranian-smuggling-tactic-sneak-oil-out-gulf-2026-06-16/",
    ingest: "partial",
    annotation:
      "Fujairah and Sohar as the around-Hormuz and outside-Hormuz doors. Oman is terminals and deals, not a second Petroline. Supports bypass chrome, not a second map.",
    beats: ["fujairah-door", "oman-is-ports"],
  },
  {
    id: "nasa-bmng-hormuz",
    kind: "geography",
    title: "Blue Marble Next Generation crop of the Strait of Hormuz",
    authors: "NASA Earth Observatory / GIBS",
    date: "2004-01-01",
    url: "https://visibleearth.nasa.gov/view.php?id=73751",
    ingest: "full",
    annotation:
      "Retired board photo. Equirectangular crop west 54.6 east 57.4 south 25.0 north 27.5 via GIBS WMS, 2016x1800. Public domain. At this zoom Blue Marble is a 500 m vegetation composite. Iran's hills read as green noise. Replaced by Sentinel-2 cloudless. Same bbox. Clip math never read the pixels.",
    beats: ["21nm", "fujairah-door"],
  },
  {
    id: "eox-s2cloudless-hormuz",
    kind: "geography",
    title: "Sentinel-2 cloudless mosaic of the Strait of Hormuz",
    authors: "EOX IT Services GmbH / Copernicus",
    date: "2024",
    url: "https://s2maps.eu/",
    ingest: "full",
    annotation:
      "Live board photo. Same crop as the retired Blue Marble plate, 2016x1800, EPSG:4326. CC BY 4.0. Contains modified Copernicus Sentinel data. 10 m class mosaic so the pinch, Qeshm, Hormuz Island, Musandam fjords, and Fujairah actually read. Photo is scenery. Overlay is the game.",
    beats: ["21nm", "fujairah-door"],
  },
  {
    id: "jmic-011-26",
    kind: "official",
    title: "JMIC Advisory Note 011-26, southern corridor widened",
    authors: "UKMTO / Joint Maritime Information Center",
    date: "2026-06-27",
    url: "https://www.ukmto.org/-/media/ukmto/products/jmic-advisory-note-01126-southern-route-widened.pdf",
    ingest: "partial",
    annotation:
      "Inbound and outbound waypoints for the 2026 Omani-side southern corridor. Used to trace the dashed SVG lanes. Not a surveyed IMO TSS chart. Mariners were told to expect mines and naval hailing.",
    beats: ["2nm-lanes", "omani-not-safe", "fog-grows"],
  },
  {
    id: "nyt-brent-2026-09",
    kind: "market",
    title: "Oil Hits $100 a Barrel as Turmoil Intensifies in Middle East",
    authors: "Aruni Soni, The New York Times",
    date: "2026-09-09",
    url: "https://www.nytimes.com/2026/09/09/business/brent-oil-100-barrel-iran-war.html",
    ingest: "partial",
    annotation:
      "Brent $100 on 9 Sep 2026, about 40 percent above eve-of-war. Peak near $120 in the early months. Correlation marker for the teaching index, not a live feed. CNN adds the June dip to ~$72 on reopen-deal talk.",
    beats: ["price-meter", "insurance-collapse"],
  },
  {
    id: "reuters-brent-2026-09",
    kind: "market",
    title: "Brent crude rises above $100 as Middle East conflict intensifies",
    authors: "Reuters",
    date: "2026-09-09",
    url: "https://www.reuters.com/business/energy/brent-crude-rises-above-100-barrel-middle-east-conflict-escalates-2026-09-09/",
    ingest: "partial",
    annotation:
      "War began 28 Feb 2026. Brent peaked at 126.41 on 30 Apr 2026. Hormuz flow pulses: 8-9 mb/d then back below 2 mb/d. Teaches that P moves with the lane, not with a finished pipeline.",
    beats: ["price-meter", "steel-takes-years"],
  },
  {
    id: "nd-escort-physics",
    kind: "navy-decoded",
    title: "Why the US Navy Still Won't Escort a Single Tanker",
    authors: "Navy Decoded",
    date: "2026-04-07",
    url: "https://www.youtube.com/watch?v=MqEAgp0DKCo",
    ingest: "full",
    annotation:
      "Full watch, user paste of YouTube Show transcript, 2026-09-09, after a swarm/escort URL mix-up. File: docs/ingest/nd-MqEAgp0DKCo.txt. This is the April 7 escort-physics watch, not Mason/swarm. ASR kept in the file (limpit = limpet, Keshum = Qeshm, SAT FO2 = Sadat-02). Beats that survive a full watch: TSS is a 6 nm ribbon of 2+2+2, a 300,000-ton VLCC cannot maneuver, Samuel B. Roberts had to be saved by the convoy it was escorting, three vectors at once (terrain-masked ballistic, sea-skimmer, limpet) beat a destroyer built for open ocean, you do not solve the strait by adding escorts you remove the threat. Architect lock 2026-09-09: destroyer sticker is a family by flight and year, $1.8B to $2.5B can all be true. 20 mb/d is Hormuz transit, not Iranian export. Matches don't-sweep on $89.5M / 13 months / 15 ft hole.",
    beats: ["escort-trap", "2nm-lanes"],
  },
  {
    id: "master-design",
    kind: "design",
    title: "Hormuz Toll Master Design Document",
    authors: "GrumpyTechBro",
    date: "2026-09-09",
    url: "https://github.com/twinforces/hormuzboardgame",
    ingest: "full",
    annotation:
      "Rules of the game. Teaching beats, turn order, victory, non-goals, copy constraints. Balance numbers inside are placeholders to tune after play, not classified truth.",
    beats: ["all"],
  },
  {
    id: "architect-locks-2026-09-09",
    kind: "design",
    title: "Architect locks after Navy Decoded ingest",
    authors: "GrumpyTechBro",
    date: "2026-09-09",
    url: "https://github.com/twinforces/hormuzboardgame",
    ingest: "full",
    annotation:
      "Ingest closed. This is a math problem. 1.4 vs 1.6 mb/d is not significant: sim uses 1.5. Destroyer stickers and mine prices are families, not conflicts. Hull counts split by size: 17 pierside warships at match start, 120 speedboats on the water, 1,500 FAC in sheds. Avenger class status stays open research. Clearance is rented either way. Facebook blockade reel stays a title card. Do not average transcripts.",
    beats: ["escort-trap", "mines-not-bombed", "bomb-factories-first"],
  },
  {
    id: "agbi-hormuz-fleets-2026",
    kind: "journalism",
    title: "The high-stakes tanker trade that keeps oil flowing through Hormuz",
    authors: "Robin Mills",
    date: "2026-07-21",
    url: "https://www.agbi.com/opinion/shipping/2026/07/the-high-stakes-tanker-trade-that-keeps-oil-flowing-through-hormuz/",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-09. Gulf energy fleets are Bahri, ADNOC L&S, KOTC, Asyad, Nakilat, NITC. Those are state oil shipping arms, not commercial houses. Bahri is the regional VLCC giant at about 50 hulls. Sinokor is named as the world's biggest VLCC spot operator (100-plus, about 24 percent of the spot fleet). Player is a commercial VLCC house, not a state fleet.",
    beats: ["company-books", "escort-trap"],
  },
  {
    id: "semafor-hormuz-shuttle-2026",
    kind: "journalism",
    title: "Hormuz reality check",
    authors: "Semafor, Michelle Bockmann",
    date: "2026-08-13",
    url: "https://www.semafor.com/article/08/13/2026/hormuz-reality-check",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-09. About 70 VLCCs running the southern dark shuttle: 38 Sinokor, 20 private Greek including Dynacom, rest Gulf state companies. Cargo about $150 million per hull. Volume about 5 mb/d on that corridor. This is who still runs after commercial paper dies. Not a two-ship tramp.",
    beats: ["company-books", "one-boom-kills-insurance"],
  },
  {
    id: "crs-tanker-owners-2024",
    kind: "official",
    title: "The Global Oil Tanker Market: An Overview as It Relates to Sanctions",
    authors: "Congressional Research Service R47962",
    date: "2024-03-17",
    url: "https://www.congress.gov/crs-product/R47962",
    ingest: "partial",
    annotation:
      "Partial, table read 2026-09-09. Independent here means not an oil-major captive. It is not a size word. Independents own the vast majority of tankers. Top 5 owners are under 13 percent of world deadweight, top 15 under 28 percent, so a long tail exists. Names in that top 15: COSCO and China Merchants (state shipping), Bahri and NITC (national oil), Frontline, Euronav, Angelicoussis, Dynacom, Thenamaris, Sinokor (commercial houses with dozens of hulls). A two-ship shop is the tail. It is not who predominates in VLCC Hormuz.",
    beats: ["company-books"],
  },
  {
    id: "seatrade-vlcc-newbuild-2026",
    kind: "market",
    title: "Five-year old VLCCs cost more than a newbuilding",
    authors: "Seatrade Maritime, Signal Ocean",
    date: "2026-05-08",
    url: "https://www.seatrade-maritime.com/tankers/five-year-old-vlccs-cost-more-than-a-newbuilding",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-09. Signal Ocean: VLCC newbuild average about $129 million. Five-year-old hulls above that. Resale premium 21 to 35 percent. COMPANY.hullUsdM uses 129. Do not retune from a wartime secondhand spike without a second source. A VLCC is not a few-ship toy.",
    beats: ["company-books"],
  },
  {
    id: "bloomberg-sinokor-hormuz-2026",
    kind: "journalism",
    title: "The tanker tycoon making millions on Hormuz shuttle runs",
    authors: "Bloomberg News, Weilun Soon, Alex Longley, Anthony Di Paola",
    date: "2026-07-05",
    url: "https://financialpost.com/commodities/energy/oil-gas/supertanker-tycoon-making-millions-on-hormuz",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-09. After the US-Iran interim ceasefire, Sinokor sent at least 20 VLCCs into the Gulf in one week. Industry estimates put controlled tonnage near 150 VLCCs by late February 2026, about 40 percent of the unsanctioned spot fleet. MSC-linked capital is behind the buying. This is a commercial house, not a few-ship tramp. Wartime TCE is fat enough that greed sends hulls. COMPANY.freightByBand.panic is 28.",
    beats: ["company-books"],
  },
  {
    id: "itf-ibf-hormuz-woa-2026",
    kind: "official",
    title: "Joint ITF-JNG Statement: Warlike Operations Area in Strait of Hormuz continues under weekly review",
    authors: "International Transport Workers Federation, Joint Negotiating Group",
    date: "2026-06-30",
    url: "https://www.itfshipbesure.org/news/joint-itf-jng-statement-warlike-operations-area-strait-hormuz-continues-under-weekly-review",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-09. Hormuz is an IBF Warlike Operations Area. Seafarers may refuse to sail, with repatriation at company cost and two months basic wage. Bonus equals 100 percent of basic wage, minimum five days. Doubled death and disability. Captains balk is a contract right, not flavor.",
    beats: ["company-books"],
  },
  {
    id: "tt-sinokor-crew-bonus-2026",
    kind: "journalism",
    title: "Shipowners offer huge bonuses to get crews to sail Hormuz",
    authors: "Transport Topics, Bloomberg",
    date: "2026-07-20",
    url: "https://www.ttnews.com/articles/shipowners-bonuses-crews",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-09. After 59 ships attacked and 17 seafarers dead, Sinokor offered six months extra salary for a Hormuz round trip. Some crews still refused. COMPANY.crewBonusUsdM is a $2M teaching lump, not a payroll table. Premium sticks going forward after blood.",
    beats: ["company-books"],
  },
  {
    id: "onassis-olympic-archetype",
    kind: "journalism",
    title: "Aristotle Onassis",
    authors: "Onassis Foundation",
    date: "2026-01-01",
    url: "https://www.onassis.org/people/aristotle-onassis",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-09. Onassis is the archetype of the independent tanker tycoon: own the hulls, charter the voyages, Olympic funnel. He is not the player. Olympic Shipping and Management still trades on the order of 15 tankers. Greece, Inc. is a fictional house with twelve VLCCs on Reopen the lane. Do not put Onassis on the board.",
    beats: ["company-books"],
  },
  {
    id: "agbi-war-insurance-2026",
    kind: "market",
    title: "War insurance adds $8 to a barrel of oil",
    authors: "John Crowley, AGBI",
    date: "2026-09-04",
    url: "https://www.agbi.com/shipping/2026/09/war-insurance-adds-8-to-a-barrel-of-oil/",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-10. Additional war-risk rose from a fraction of a percent to as much as 10 percent of ship value. A VLCC around $140M. About $7 to $8 on a barrel is war-risk. Claims about $2bn since the conflict began. COMPANY.premiumByBand.cheap is $2M (~1.5 percent of the $129M hull). Panic is $13M (~10 percent). After a boom the paper dies and you cannot buy. Do not retune from a live 1.5 percent tick. Heat is a band, not a feed.",
    beats: ["one-boom-kills-insurance", "company-books"],
  },
  {
    id: "maritime-exec-irgc-toll-2026",
    kind: "journalism",
    title: "Iran's IRGC is Charging Millions in Cryptocurrency for Hormuz Transits",
    authors: "The Maritime Executive, Bloomberg",
    date: "2026-04-01",
    url: "https://maritime-executive.com/article/iran-s-irgc-is-charging-millions-in-cryptocurrency-for-hormuz-transits",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-10. IRGC pass for one transit. Price floor about $1 per barrel or $2 million for a VLCC. Checkpoint between Qeshm and Larak. Pay buys a wave and an escort code. It does not sweep mines. COMPANY.tollUsdM is 2. Do not retune from the $1 to $2 million range without a second source.",
    beats: ["company-books", "escort-trap"],
  },
  {
    id: "ajot-hormuz-freight-2026",
    kind: "market",
    title: "Vintage tonnage captures the freight premium",
    authors: "American Journal of Transportation, TotalEnergies",
    date: "2026-09-08",
    url: "https://www.ajot.com/news/vintage-tonnage-captures-the-freight-premium",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-10. TotalEnergies: a two-million-barrel VLCC through Hormuz and back costs about $20 million extra, roughly $10 per barrel. That is a charterer bid, not the owner eating 2 mb times Brent. COMPANY.traderBonusByBand.high is 18, next to that $10/bbl print. Panic 20 is desperation, not the cargo. Freight stays the taxi. MEG-China TCE near $760k/day is the voyage payday, already in freight plus bonus. Do not also charge it as idle.",
    beats: ["company-books"],
  },
  {
    id: "og360-vlcc-oman-china-2026",
    kind: "market",
    title: "The Iran war has turned VLCCs into $650,000-a-day assets",
    authors: "Julianne Geiger, Oilprice.com / Oil & Gas 360",
    date: "2026-08-28",
    url: "https://www.oilandgas360.com/the-iran-war-has-turned-vlccs-into-650000-a-day-assets/",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-10. MEG-China earnings about $647k/day. That is a sailing hull, already booked as freight plus bonus. Oman to China, outside the strait, about $220k/day. Idle is that outside week, not the Hormuz TCE twice. COMPANY.idleUsdMPerHull is 2 (~$286k/day teaching round). Do not retune idle to $4M. That was 75 percent of MEG-China and double-counted the voyage.",
    beats: ["company-books"],
  },
  {
    id: "lloyds-vlcc-td3c-2026-09",
    kind: "market",
    title: "VLCC market hits historic high in latest phase of Hormuz crisis",
    authors: "Lloyd's List",
    date: "2026-09-08",
    url: "https://www.lloydslist.com/LL1158394/VLCC-market-hits-historic-high-in-latest-phase-of-Hormuz-crisis",
    ingest: "partial",
    annotation:
      "Partial, page read 2026-09-10. MEG-China TD3C $759,969/day on 8 Sep 2026. Oman-China VLCC index $358,201/day. The $760k print is why freight plus bonus get fat when P is panic. Idle uses the GOO outside option, not this number. A $4M idle week was ~$571k/day, almost the Hormuz day rate again.",
    beats: ["company-books"],
  },
];

export function receiptsByKind(kind: ReceiptKind): Receipt[] {
  return RECEIPTS.filter((r) => r.kind === kind);
}

export function receiptById(id: string): Receipt | undefined {
  return RECEIPTS.find((r) => r.id === id);
}

export const INGEST_COUNTS = RECEIPTS.reduce(
  (acc, r) => {
    acc[r.ingest] += 1;
    return acc;
  },
  { full: 0, partial: 0, metadata: 0 },
);
