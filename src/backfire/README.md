# backfire — documentary kit for the Walt Brennecke channel ("case files")

Shared by ALL Walt videos. Do NOT copy these components into your video folder and do NOT write your own versions:
import them from `../backfire/<Name>` in your `_v3/<slug>_cfg.mjs` → `IMPORTS`.

## How it plugs into the rksafe pipeline (branch `wb-kit`)
- `rksafe_build` injects **`t0`** (absolute start second of the component) into every component's props.
  Every beat prop (`at`, `from`, `to`, `circleAt`, `rightAt`, `highlights[i].at`…) is an **ABSOLUTE second of the
  video taken from `_v3/<slug>_words.json`** (the word that names the thing, ±0.1 s). Never relative, never guessed.
- `rksafe_plan` accepts **`q`** on each `COMPONENTES` entry: the exact phrase of the script where the component enters
  (searched from its paragraph `p`). Use `q` on every component. `dur` = how long it needs (≥ reading floor).
- `cfg.APERTURA_MIN = 2.8` + a `ColdOpen` at `p: 1` (dur 2.8) → the video opens on the thumbnail, the agnes keyframe
  transition, and then the real footage (no avatar at 0 s).
- Real footage: `_v3/<slug>_real.mjs` items with **`credit`** (and optional `caption`, `chip`) are rendered as
  `ArchiveFilm` automatically (REAL FOOTAGE chip + credit bottom-right). **No credit = no clip** (licencias.md).
- Conform real clips with `KEEP_AUDIO=1 node scripts/rksafe_stock_conform.mjs <slug> <srcDir>` (keeps the real audio).
- After `rksafe_build`: `node scripts/backfire_mix.mjs <slug>` → `public/<slug>_mix.wav` (48 kHz stereo, for encfin) +
  `public/<slug>.m4a`. Voice + real clip audio at −21 dB. **Never `rksafe_sfx`** (no whooshes, no effects, no music).
- Measure coordinates with `python scripts/backfire_grid.py <img> <out.jpg>` (% grid, for DocumentPage) or `--px`
  (1920×1080 px grid, for MapPin / SceneCallout). Look at the grid image; never guess 50/50.
- Kit asset: `public/img/wb_folder.jpg` (+ `_blur.jpg`) — the manila folder on Walt's desk (FileStamp default).
  Copy it from `D:/rtmp/walt/_kit/wb_folder.jpg` into your worktree's `public/img/` and list it in the assets file.

## Components (all take `t0`, `durationInFrames`; all photos/maps/pages are REAL images, never CSS drawings)
| Component | Use it when Walt says… | Key props |
|---|---|---|
| `ColdOpen` | 0–2.8 s only | `thumb` (card thumbnail 1920×1080), `trans` (agnes keyframe mp4), `hold` 0.8 |
| `ArchiveFilm` | any real clip (automatic via `_real.mjs` credit) | `src`, `credit`, `caption?`, `chip?` |
| `MapPin` | a place / a release site / the spread over years | `map` (PD map conformed 1920×1080), `pins[{x,y,label,year,at,zoom?}]` (px), `route{pts[[x,y]],years[],from,to,label}`, `credit` |
| `YearCounter` | "from 1935 to today…", population growth | `photo`, `yearFrom`, `yearTo`, `popFrom`, `popTo`, **`unit` (explicit, '' allowed)**, `from`, `to`, `marks[{year,note}]`, `source` |
| `DocumentPage` | "they were warned in writing", a report, a newspaper | `page` (real scan), **`aspect`** (w/h measured), `highlights[{x,y,w,h,at}]` (% of page), `chip`, `source`, `note{text,at}` |
| `BigStat` | one number that hits | `value`, **`unit` (explicit)**, `label`, `compare` (only if the math is checked), `source`, `photo`, `at`, `compareAt` |
| `SplitVs` | what they expected vs what happened | `leftImg`, `rightImg`, `leftText`, `rightText`, `rightAt`, `stamp` ("BACKFIRED") |
| `PullQuote` | a real quote, read by Walt | `quote` (verbatim, in fuentes.md), `who`, `year`, `source`, `portrait?`, `at`, `until`, `highlight` |
| `SceneCallout` | "look at this…" a detail in a photo | `photo`, `x`,`y` (px), `r`, `note` (3–5 words), `circleAt`, `noteAt` |
| `FileStamp` | ~1:00 channel identity + each act change | `fileNo`, `title`, `sub?`, `part?`, `stamp` ("OPEN"/"BACKFIRED"/""), `typeAt`, `stampAt` |
| `ActChip` | OVERLAY (put it in `cfg.OVERLAY`) at each act change | `fileNo`, `part` |

## Rules the kit assumes (from the channel brief)
- Something always moves (every component has a slow camera). No component over an empty background (beds are photos).
- No brands, no logos, no readable product names in any image. One image/clip appears ONCE per video.
- Text on screen is short: notes 3–5 words, SplitVs 2–7 words per side, quotes verbatim.
- Stills or it didn't happen: render entry / each beat +0.3 s / exit of every component you place and LOOK at them
  (`node scripts/kit_stills.mjs` for isolated tests, `_v3/stills.mjs` for the built video).
- Preview with real sample material: `src/index_wbkit.tsx` (compositions K*). Reference stills: `D:/rtmp/walt/_kit/st2/`.
