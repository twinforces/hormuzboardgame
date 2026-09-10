# Navy Decoded ingest

Standing rule: a snippet is not a watch. `ingest: "full"` only if a complete UTF-8 file lives here named `nd-<youtubeId>.txt`.

## Why the direct dump failed

From this cloud IP, YouTube treats us as a bot.

| Path | Result 2026-09-09 |
| --- | --- |
| `youtube.com/api/timedtext` | Empty HTML |
| Watch page InnerTube (`ytInitialPlayerResponse`) | `LOGIN_REQUIRED` / Sign in to confirm you are not a bot |
| InnerTube ANDROID / iOS / TVHTML5 | 400 or UNPLAYABLE |
| Invidious (`yewtu.be`) | CAPTCHA / verify page |
| `youtubetranscript.com` | Shell page, captions are client-rendered |
| yt-dlp | Not installed in this sandbox |

Do not keep empty stub files. That pretends we have transcripts.

## What actually works

Three paths, in order of completeness.

### 1. You paste (fastest full dump)

On YouTube: open the video, click the description (`...more`), scroll to **Show transcript**, copy, paste in chat.

I drop the text at `docs/ingest/nd-<youtubeId>.txt` the same turn and flip the matching receipt to `full`.

A 15 minute Navy Decoded video is a few thousand words. Paste is ugly and it is also honest.

### 2. Watch-page captions, walked in chunks (agent path)

The YouTube watch page still exposes auto-captions to a browser-class fetch. The summarizer truncates around three minutes.

To finish a video: request the next chunk with `continue from [last timestamp]`. Repeat until the end. Concatenate here.

That is slow. It does not need your laptop. It stays `partial` until the last timestamp is past the video duration.

### 3. Search-index excerpts (already in receipts)

Google indexes auto-captions. Those excerpts are already folded into `src/model/receipts.ts` annotations. They stay `partial` or `metadata`. Useful for beats. Illegal as numbers unless a primary source backs them.

## File format

```
# nd-<youtubeId>.txt
# title: ...
# channel: Navy Decoded
# url: https://www.youtube.com/watch?v=<id>
# retrieved: YYYY-MM-DD
# path: paste | watch-page-walk | search-index
# complete: yes | no
# last-timestamp: ...

[verbatim transcript]
```

## Cluster on the board

IDs in `src/model/receipts.ts` with `kind: "navy-decoded"`. Facebook-only items have no YouTube caption path.

First complete files:
- `nd-5Fq0m3krtiM.txt` escort-trap, user paste 2026-09-09
- `nd-ZVu88ZaIN1g.txt` factories-vs-pits, user paste 2026-09-09
- `nd-2NNZ2u2WDD0.txt` don't-sweep-yet, user paste 2026-09-09
- `nd-vMy69tl25r8.txt` Tripoli, user paste 2026-09-09
- `nd-Vk88S6bro1o.txt` swarm / Mason / Truxtun, user paste 2026-09-09
- `wv-gq0OyP638J8.txt` Avenger / influence mines, WarVision not Navy Decoded, user paste 2026-09-09
- `nd-MqEAgp0DKCo.txt` escort-physics / Samuel B. Roberts, user paste 2026-09-09 (not swarm)
- `nd-IwLVah12j6A.txt` 7-nights compilation, unique cycle only from looping HTML dump, 2026-09-09
- `nr-2rZym_InYEU.txt` 46-mines dhow, Navy Response not Navy Decoded, user paste 2026-09-09
