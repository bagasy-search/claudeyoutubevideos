# lkit: the permanent Loretta v2 kit (Remotion)

Built 12-oct-2026 from the approved fhflies and fhgarlic kits, plus the new components Opus asked for in the fhkitchen corrections.

- **Source of truth for the plan linter:** `src/lkit/kit_schema.json`. It lists every component's props, types, required fields, enums, min/max seconds, time props and image props.
- **Code:**
  - `core.tsx`: config, fonts, fit-text, layers, Plate, CompWrap.
  - `kit.tsx`: the classic components and the overlays.
  - `items.tsx`: the new v2 components.
  - `Player.tsx`: edl → video.
  - `Gallery.tsx`: one demo per component.
- **Gallery stills:** `node scripts/lkit_stills.mjs` writes `out/lkit/<Name>.png` and the contact sheet `out/lkit_gallery.jpg`.
  - Demo images live in `public/img/lkit_demo` (not committed: `public/` is ignored).

## Rules
- A component shot is a plan entry `{a, b, kind: 'C', c: '<Name>', props}`. The Player injects `a` (seconds) and `d` (frames).
- **Every time prop is an ABSOLUTE video second** (the word's `s` in words.json), and it must fall inside `[a, b)` of its shot.
- Text sizes itself to fit (`fit()`), so long strings shrink instead of being cut. Keep labels short anyway.
- Components never sit on an empty background: `k` / `bed` is always a real L/N photo.

## Using it in a video
```tsx
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./<slug>/edl.json";
import AV from "./<slug>/avwin.json";
setKit({ imgDir: "img/<slug>", grain: "img/<slug>/grain.png", qr: "qr.jpg", cover: "book_cover.png", av: (AV as any).win });
export const Full = makePlayer(EDL as any); // edl: {end, shots, counts, of, word, hide, overlays}
```

The `ItemCounter` is not a shot. Set `edl.counts = [{a, b, n}]`, `edl.of = 13` and `edl.word = "ITEM"`, plus `edl.hide = [[a, b]]` over the ItemCards.
Overlays such as `Kicker` and `Pop` go in `edl.overlays = [{a, b, c, props}]`.

## Components (one example each; the example shot starts at a = 312.4)

### ThumbOpen  (shot, 4-15 s)
Opening: the REAL thumbnail held still ~1.5 s, soft fade + slow push into the L photo that matches it; optional kinetic words. Only at second 0. No words ON the thumbnail (words must land after the fade).
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "ThumbOpen", "props": {"thumb": "th_card.jpg", "k": "l_pan", "fade": 313.9, "words": [["13", 315.4], ["things", 315.7], ["my", 316.0], ["mother", 316.2], ["never", 316.6], ["kept.", 316.9]]}}
```

### ItemCard  (shot, 6-12 s)
Every list item (ITEM n): number, name (struck out at t), INSTEAD: what we used, PAGE tag. >= 6 s. Put its [a,b] in edl.hide so the ItemCounter steps aside.
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "ItemCard", "props": {"n": 9, "of": 13, "name": "The bug bomb", "instead": "bait where they live", "page": "PAGE 20", "k": "n_bugbomb", "k2": "n_mousehole", "t": 314.9}}
```

### ItemCounter  (track, None-None s)
'ITEM n OF N' badge top-right during EVERY item section. Not a shot: goes in edl.counts / edl.of / edl.word / edl.hide; the Player mounts it over the whole video. n must be the real number (no skips, no repeats, increasing).
```json
{"counts": [{"a": 312.4, "b": 315.4, "n": 6}, {"a": 315.4, "b": 318.4, "n": 7}], "of": 13}
```

### SwapCard  (shot, 6-12 s)
'What most homes do today' vs 'what we used instead': wipe on the word 'instead'.
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "SwapCard", "props": {"old": {"k": "n_paperbags", "txt": "Paper sacks"}, "neu": {"k": "n_glassjars", "txt": "glass jars with lids"}, "t": 314.4}}
```

### DropList  (shot, 6-22 s)
An EMPTY shelf/table that fills: each thing drops on ITS word with a hand-written label (pantry jars, tools...). First item should drop <= 1 s after the cut (Opus: 'its first jar drops at once').
```json
{"a": 312.4, "b": 324.4, "kind": "C", "c": "DropList", "props": {"k": "n_emptyshelf", "head": "What went in glass", "shelfY": 41, "x0": 20, "x1": 80, "items": [{"t": 312.4, "txt": "flour"}, {"t": 314.0, "txt": "sugar"}, {"t": 315.6, "txt": "oats"}, {"t": 317.2, "txt": "rice"}, {"t": 318.6, "txt": "birdseed"}, {"t": 320.0, "txt": "dog food"}]}}
```

### GoneList  (shot, 8-25 s)
Recap: photo of a cluttered home; each thing gets a red circle + number on its word, then fades out.
```json
{"a": 312.4, "b": 324.4, "kind": "C", "c": "GoneList", "props": {"k": "n_gonekitchen", "head": "What left my kitchen", "items": [{"t": 312.9, "txt": "plug-in repeller", "x": 20, "y": 17, "r": 5}, {"t": 314.4, "txt": "fruit bowl", "x": 37, "y": 40, "r": 9}, {"t": 316.0, "txt": "bread bag", "x": 50, "y": 80, "r": 10}, {"t": 317.8, "txt": "dirty dishes", "x": 78, "y": 42, "r": 9}]}}
```

### CheckScene  (shot, 6-20 s)
End-of-day round (the kitchen at 10 pm, the house before bed): checklist ticks on its words over the photo.
```json
{"a": 312.4, "b": 322.4, "kind": "C", "c": "CheckScene", "props": {"k": "n_nightsink", "clock": "10 PM", "head": "Before the light goes off", "items": [{"t": 313.4, "txt": "sink wiped dry", "x": 50, "y": 62}, {"t": 315.0, "txt": "lid on the can"}, {"t": 316.6, "txt": "pet bowl up"}, {"t": 318.2, "txt": "fruit in the fridge"}]}}
```

### PhotoSeq  (shot, 6-14 s)
One shot with 2-4 photos changing on their words (merges short shots); optional red/chalk mark.
```json
{"a": 312.4, "b": 322.4, "kind": "C", "c": "PhotoSeq", "props": {"photos": [{"k": "n_mothballs", "cap": "what most homes do"}, {"k": "n_chalkline", "t": 316.4, "cap": "a chalk line", "mark": {"kind": "under", "x": 30, "y": 60, "w": 40, "h": 8, "t": 317.4}}]}}
```

### Chapter  (shot, 4-9 s)
Giant number + title + Loretta (avatar) inside a frame; the camera pushes into the frame. av=true needs setKit({av}); the span counts as an avatar window.
```json
{"a": 312.4, "b": 318.4, "kind": "C", "c": "Chapter", "props": {"n": "7", "label": "ITEM", "title": "The open trash can", "sub": "PAGE 23", "k": "n_lidcan", "av": false}}
```

### StepCard  (shot, 6-25 s)
A recipe/procedure from the book: lined card that ticks + big photo of the active step.
```json
{"a": 312.4, "b": 322.4, "kind": "C", "c": "StepCard", "props": {"head": "Borax ant bait", "page": "PAGE 18", "steps": [{"t": 312.9, "txt": "A jar with holes in the lid", "k": "n_glassjars"}, {"t": 315.4, "txt": "Sugar water and borax", "k": "n_jars"}, {"t": 317.9, "txt": "Set it on their trail", "k": "n_chalkline"}]}}
```

### MistakeStamp  (shot, 5-10 s)
A mistake: photo with red circle + THE MISTAKE stamp + sentence.
```json
{"a": 312.4, "b": 318.4, "kind": "C", "c": "MistakeStamp", "props": {"k": "n_pan", "txt": "A scratched pan goes back in the drawer", "cx": 55, "cy": 55, "t": 313.4}}
```

### CostTag  (shot, 5-10 s)
Costs from the book (ON SCREEN ONLY, no $ in the voice): hanging tag + struck store price.
```json
{"a": 312.4, "b": 319.4, "kind": "C", "c": "CostTag", "props": {"price": "$4", "sub": "a whole year of it", "k": "n_jars", "vs": {"price": "$129", "txt": "one visit", "t": 314.9}}}
```

### Note  (shot, 5-14 s)
A saying (mother, Bernice) or 3 ideas: hand-written, each line on ITS word.
```json
{"a": 312.4, "b": 322.4, "kind": "C", "c": "Note", "props": {"lines": [{"txt": "Close the door,", "t": 312.9}, {"txt": "take away the food,", "t": 314.4}, {"txt": "make them want to leave.", "t": 316.0}], "sig": "Mama", "k": "l_cupboard", "chip": {"txt": "the three ideas", "t": 317.9}}}
```

### PageUp  (shot, 5-16 s)
A book page that is named: rises to camera, PAGE n tab, highlighter on the line.
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "PageUp", "props": {"pages": [{"src": "page4", "tab": "PAGE 4", "t": 312.7, "hl": 40}], "k": "l_book"}}
```

### Checklist  (shot, 6-25 s)
Rules or RECAP: lines tick on their words; >6 items -> 2 columns (13 fit).
```json
{"a": 312.4, "b": 326.4, "kind": "C", "c": "Checklist", "props": {"head": "13 things my mother never kept", "page": "THE BOOK", "k": "n_pantryshelf", "items": [{"t": 312.9, "txt": "Nonstick pan"}, {"t": 313.6, "txt": "Paper sacks"}, {"t": 314.3, "txt": "Plastic bag stack"}, {"t": 315.0, "txt": "Open trash can"}, {"t": 315.7, "txt": "Fruit bowl"}, {"t": 316.4, "txt": "Pet food out"}, {"t": 317.1, "txt": "Plug-in repeller"}, {"t": 317.8, "txt": "Dryer sheets"}, {"t": 318.5, "txt": "Bug bomb"}, {"t": 319.2, "txt": "Mothballs"}, {"t": 319.9, "txt": "Wet sponge"}, {"t": 320.6, "txt": "Cardboard boxes"}, {"t": 321.3, "txt": "Dirty dishes overnight"}]}}
```

### NeverMix  (shot, 5-12 s)
Combination warning: 'A x B, C' on its word + verdict.
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "NeverMix", "props": {"head": "Never mix these", "tag": "PAGE 3", "k": "n_stove", "rows": [{"t": 313.2, "a": "Bleach", "b": ["vinegar", "ammonia"]}, {"t": 314.8, "a": "Borax", "b": ["food"]}], "verdict": {"t": 316.4, "txt": "= TOXIC GAS"}}}
```

### Lineup  (shot, 6-25 s)
Parade of 2-6 things full screen with n/N + name + use.
```json
{"a": 312.4, "b": 321.4, "kind": "C", "c": "Lineup", "props": {"head": "UNDER MY SINK · PAGE 4", "items": [{"t": 312.4, "name": "White vinegar", "use": "for the counters", "k": "n_jars"}, {"t": 315.4, "name": "Borax", "use": "for the ant trail", "k": "n_glassjars"}, {"t": 318.4, "name": "Steel wool", "use": "for the holes", "k": "n_mousehole"}]}}
```

### BigNumber  (shot, 4-9 s)
A number that weighs (51 years, 3 days) counting up over the photo.
```json
{"a": 312.4, "b": 318.4, "kind": "C", "c": "BigNumber", "props": {"num": 51, "unit": "YEARS", "txt": "in the same kitchen", "k": "l_counter", "t": 312.7}}
```

### Thumb  (shot, 6-14 s)
Another channel video (previous/next): 3D thumbnail + title word by word.
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "Thumb", "props": {"thumb": "th_prev.jpg", "tag": "LAST TIME", "k": "n_jars", "push": false, "words": [["How", 313.4], ["My", 313.7], ["Mother", 314.0], ["Kept", 314.3], ["Every", 314.6], ["Fly", 314.9], ["Out", 315.2]]}}
```

### QrCard  (shot, 8-14 s)
Mid CTA: book cover + QR that appears on its word. >= 8 s on screen; if the CTA runs longer, follow with a PageUp of the cover (never 18 s of one still card).
```json
{"a": 312.4, "b": 322.4, "kind": "C", "c": "QrCard", "props": {"k": "l_book", "t": 313.6}}
```

### Comment  (shot, 6-12 s)
Audience question: comment box types itself + options on their words.
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "Comment", "props": {"q": "Which one did your mother keep out of the house?", "k": "l_counter", "opts": [{"t": 315.9, "txt": "Paper sacks"}, {"t": 316.6, "txt": "Bug bombs"}, {"t": 317.3, "txt": "Mothballs"}]}}
```

### Memory  (shot, 5-10 s)
A memory (mother, that fall): sepia polaroid with date and caption.
```json
{"a": 312.4, "b": 319.4, "kind": "C", "c": "Memory", "props": {"k": "l_counter", "caption": "Mama's kitchen, the fall before the frost", "date": "Oct 1961", "t": 313.4}}
```

### Careful  (shot, 5-10 s)
A warning (mothballs, bug bombs): caution tape + big sentence.
```json
{"a": 312.4, "b": 319.4, "kind": "C", "c": "Careful", "props": {"k": "n_mothballs", "tag": "CAREFUL · PAGE 4", "txt": "Mothballs are a pesticide. Not in a kitchen.", "t": 313.0}}
```

### DoDont  (shot, 6-12 s)
'What homes do now vs what we did': two photos, cross at no.t and tick at yes.t.
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "DoDont", "props": {"k": "n_stove", "no": {"k": "n_pan", "txt": "Scratched nonstick", "t": 312.9}, "yes": {"k": "n_skillet", "txt": "One cast iron skillet", "t": 314.9}}}
```

### Arc  (shot, 4-12 s)
REAL archive material (public-domain film or photo) with a year/place caption. Counts toward the archive total (>= 14 shots, >= 100 s, no gap > 120 s).
```json
{"a": 312.4, "b": 319.4, "kind": "C", "c": "Arc", "props": {"src": "arc_barn", "vid": true, "cap": "1951 · Iowa farm", "credit": "Prelinger Archives (public domain)"}}
```

### Pins  (shot, 6-14 s)
Places on a photo (where they get in): numbered pins on their words.
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "Pins", "props": {"k": "n_gonekitchen", "head": "Where they get in", "pins": [{"x": 22, "y": 60, "t": 313.0, "txt": "under the sink"}, {"x": 52, "y": 40, "t": 314.4, "txt": "behind the stove"}, {"x": 82, "y": 65, "t": 315.8, "txt": "the back door"}], "wrong": {"t": 317.0, "txt": "THE WRONG HALF"}}}
```

### FrameArt  (shot, 5-10 s)
A photo worth a frame (mother's kitchen) hanging, with a hand caption.
```json
{"a": 312.4, "b": 319.4, "kind": "C", "c": "FrameArt", "props": {"k": "l_counter", "bed": "n_stove", "caption": "the kitchen she kept for fifty-one years", "t": 313.6}}
```

### Flashlight  (shot, 5-10 s)
A dark corner revealed by a flashlight (night round, the mouse hole).
```json
{"a": 312.4, "b": 320.4, "kind": "C", "c": "Flashlight", "props": {"k": "n_mousehole", "from": [20, 30], "to": [55, 62], "on": 313.2, "words": [["there it is", 314.9, 1100, 220]]}}
```

### Tease  (shot, 1.5-3 s)
1.5-3 s teaser of the payoff to come (COMING UP).
```json
{"a": 312.4, "b": 315.4, "kind": "C", "c": "Tease", "props": {"k": "n_skillet", "txt": "the one pan she kept for fifty years"}}
```

### Kinetic  (shot, 3-10 s)
Key sentence as big kinetic text over a photo/clip (one sentence at a time).
```json
{"a": 312.4, "b": 318.4, "kind": "C", "c": "Kinetic", "props": {"k": "n_pan", "words": [["She", 312.8], ["never", 313.1], ["kept", 313.4], ["a", 313.6], ["scratched", 313.8], ["pan.", 314.2]]}}
```

### SplitHalf  (shot, 5-10 s)
Same photo split: 'most homes' half (red) vs 'my mother's' half (shine).
```json
{"a": 312.4, "b": 319.4, "kind": "C", "c": "SplitHalf", "props": {"k": "l_counter", "l": {"txt": "Most homes", "t": 313.2}, "r": {"txt": "My mother's", "t": 314.4}, "foot": {"txt": "same counter · same night", "t": 315.6}}}
```

### Kicker  (overlay, 1-6 s)
Small label over another shot on its word ('STAY FOR #9'). Goes in edl.overlays [{a, b, c, props}]: a = the word; must fall inside an existing shot.
```json
{"a": 312.4, "b": 316.4, "c": "Kicker", "props": {"txt": "STAY FOR #9", "red": true}}
```

### Pop  (overlay, 0.8-3 s)
One big key word with a punch, over another shot. Goes in edl.overlays.
```json
{"a": 312.4, "b": 315.4, "c": "Pop", "props": {"txt": "Scratched"}}
```
