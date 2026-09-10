# Mine warfare slice

Why this exists: the tanker is now a script. The sitting is US vs Iran over devices in the water. Today both sides auto-fire on every week. That is not play.

## What

Human picks one mine verb a week. The other faction is a small script. Greece, Inc. is `ceoPick`: wait the ribbon, never pay.

## Why not factories yet

`UsHormuzAction` already names strike-industry, depots, pits, boarding, capital. Those are real, and they take years or a prestige hull. If they land in the same slice as sweep vs lay, the player will bomb a factory and wonder why the red circles did not shrink. Clearance is rented. Industry is permanent. Teach clearance first.

## Verbs (v1)

US, one Hormuz plan per week, still XOR with an off-board lever later:

| Verb | Does | Does not |
|---|---|---|
| Sweep | Punch up to 3 hottest Omani mines. Clip green to DEEP_WATER. | Bleach the till. Kill the device inventory. |
| Sense | Mark the hottest blobs. Next sweep is smarter. | Punch a hole this week. |
| Escort | Cut shot chance (already modeled). | Sweep mines. |
| Hold | Escorts stay, no new holes. | Waste a week on purpose. Fog still grows. |

Iran, still never the till:

| Verb | Does | Does not |
|---|---|---|
| Lay TSS | One tight circle on `LAY_SPOTS`. Spends pool.mines. | Mine Qeshm-Larak. |
| Surge | Two lays if the pool has two. | A magic extra magazine. |
| Hold | Keep the next device. | Stop drift on what is already in the water. |

Income: CEO never pays, so toll refill is gone in auto play. High P still funds next-turn pool (ARCHITECTURE invariant 8). That is now the point of making oil expensive.

## Turn FSM

Keep `PHASE_ORDER`. Change who may click:

- `usOrders` and `iranOrders` become input when that seat is human.
- `tankerOrders` auto-fires `ceoPick` when the tanker is AI (default).
- Hotseat later: three humans. Not v1.

Default seat: **US**. Iran is a script (lay while the CEO is waiting and the pool is live, hold when empty). Flip seat in the sitting kit, same engine.

## AI scripts (tendencies, not a solver)

- Tanker: `ceoPick`. Done.
- Iran: lay if `pool.mines > 0` and waiting hulls > 0. Surge if pool >= 2 and Omani mine kill < 20% (the ribbon is getting clean). Hold if magazine empty.
- US (if human is Iran): sweep if Omani mine > 15%. Escort if shot > mine. Sense if holes are about to expire. Hold only if the ribbon is already quiet.

## Implementer first cut

1. `src/model/ai.ts`: `iranMinePick`, `usMinePick`. Pure. Seeded. Tests.
2. Drive today's `applyUsOrders` / `applyIranOrders` from those picks instead of always sweep+lay.
3. Then View: US verb chips during `usOrders`. Same gold-chip pattern as the tanker CEO.
4. Do not add factory buttons in this cut.

## Don't

- Do not mine the till.
- Do not let a sweep disk bleach Qeshm-Larak.
- Do not fill STEEL.
- Do not ask the tanker AI to pay. Tolls buy mines.
- Do not spawn Leaflet, auth, or a second map.
