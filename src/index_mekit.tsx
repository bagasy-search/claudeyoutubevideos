// Banco de stills del kit Old Mechanic (om99): cada componente con sus props REALES del video. ENTRY=src/index_mekit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClBookPage, ClChapter, ClCheck, ClDoDont, ClQRCard } from "./claudio/ClCards";
import { ClCarMap, ClFeatureTag, ClGasArrow, ClOBDScan } from "./claudio/ClMecanico";
import { ClNotebook, ClVideoRef } from "./claudio/ClSarro";
import { ClReceipt } from "./claudio/ClBandeja";
const B = "ref_om99.png";
const K: [React.FC<any>, any][] = [
  [ClReceipt, {"head": "DEALERSHIP", "lines": [["Read 1 code", "$120"], ["Advice", "trade it in"]], "total": ["Real cost", "$0"], "bed": B}],
  [ClCarMap, {"done": [], "title": "15 hidden features", "bed": B}],
  [ClChapter, {"n": 1, "title": "Miss Doris's car", "sub": "280,000 miles · not done yet", "bed": B}],
  [ClCarMap, {"done": [], "title": "Miss Doris's car", "bed": B}],
  [ClNotebook, {"title": "Frank's notebook", "rows": [{"k": "2019", "v": "oil ✓"}, {"k": "2020", "v": "oil ✓"}, {"k": "2021", "v": "oil ✓"}, {"k": "2022", "v": "—"}], "mark": "then nothing", "bed": B}],
  [ClFeatureTag, {"n": 15, "title": "The headrest", "note": "you never adjusted it", "bed": B}],
  [ClCheck, {"title": "Headrest rule", "items": ["Middle at ear level", "Almost touching your head", "2 clicks · 30 seconds"], "fast": true, "bed": B}],
  [ClFeatureTag, {"n": 14, "title": "The hook above your head", "note": "it folds down", "bed": B}],
  [ClDoDont, {"yes": {"label": "Behind the driver", "img": "img/om99/b_hanger.jpg"}, "no": {"label": "Right rear window", "img": "img/om99/st_lanechange.jpg"}, "bed": B}],
  [ClFeatureTag, {"n": 13, "title": "Above your eyes", "note": "a box for your glasses", "bed": B}],
  [ClFeatureTag, {"n": 12, "title": "The trunk button", "note": "skip the walk around", "bed": B}],
  [ClFeatureTag, {"n": 11, "title": "The little arrow", "note": "left or right?", "bed": B}],
  [ClGasArrow, {"side": "left", "bed": B}],
  [ClNotebook, {"title": "The walk-around", "rows": [{"k": "Headrest", "v": "ears"}, {"k": "Hooks", "v": "2"}, {"k": "Arrow", "v": "L / R"}, {"k": "Trunk", "v": "inside"}], "mark": "page 9", "bed": B}],
  [ClFeatureTag, {"n": 10, "title": "The visor that grows", "note": "pull it", "bed": B}],
  [ClFeatureTag, {"n": 9, "title": "The child lock", "note": "on the door edge", "bed": B}],
  [ClCheck, {"title": "Child lock", "items": ["Little ones ride: ON", "Adults ride: OFF", "Tip of the key · 2 seconds"], "fast": true, "bed": B}],
  [ClFeatureTag, {"n": 8, "title": "Fog inside the glass", "note": "the AC trick", "bed": B}],
  [ClFeatureTag, {"n": 7, "title": "The number on your door", "note": "not the tire", "bed": B}],
  [ClDoDont, {"yes": {"label": "Door sticker", "img": "img/om99/b_doorsticker.jpg"}, "no": {"label": "Tire sidewall = MAX", "img": "img/om99/st_tiresidewall.jpg"}, "bed": B}],
  [ClBookPage, {"page": "img/om99/page9.jpg", "pageNo": 9, "stamp": "The walk-around, on page 9", "bed": B}],
  [ClFeatureTag, {"n": 6, "title": "The wheel lock key", "note": "find it today", "bed": B}],
  [ClFeatureTag, {"n": 5, "title": "The tire you never check", "note": "the spare", "bed": B}],
  [ClCheck, {"title": "The spare", "items": ["Check it twice a year", "Pressure on the spare itself", "Know where the jack is"], "fast": true, "bed": B}],
  [ClFeatureTag, {"n": 4, "title": "The $90 filter", "note": "behind the glove box", "bed": B}],
  [ClReceipt, {"head": "CABIN AIR FILTER", "lines": [["Shop", "$60–90"], ["The part", "$15"], ["Your time", "5 min"]], "total": ["You save", "$75"], "bed": B}],
  [ClFeatureTag, {"n": 3, "title": "The one that saves lives", "note": "inside your trunk", "bed": B}],
  [ClDoDont, {"yes": {"label": "Reach in and pull", "img": "img/om99/c_dorispull.jpg"}, "no": {"label": "Never climb in", "img": "img/om99/b_trunkup.jpg"}, "bed": B}],
  [ClFeatureTag, {"n": 2, "title": "The page they hope you skip", "note": "severe service", "bed": B}],
  [ClNotebook, {"title": "Severe service", "rows": [{"k": "Short trips", "v": "✓"}, {"k": "Stop-and-go", "v": "✓"}, {"k": "Hot summers", "v": "✓"}, {"k": "Dusty roads", "v": "✓"}], "mark": "that's almost everybody", "bed": B}],
  [ClReceipt, {"head": "THE MATH", "lines": [["Extra oil changes", "~$200/yr"], ["Worn-out engine", "$4,000+"]], "total": ["Easy call", "severe"], "bed": B}],
  [ClFeatureTag, {"n": 1, "title": "The plug under your wheel", "note": "the $120 secret", "bed": B}],
  [ClOBDScan, {"mode": "scan", "code": "P0457", "meaning": "Gas cap loose", "bed": B}],
  [ClOBDScan, {"mode": "price", "bed": B}],
  [ClChapter, {"n": 2, "title": "The 3 mistakes", "sub": "I see every week", "alert": true, "bed": B}],
  [ClChapter, {"n": 3, "title": "Quick questions", "sub": "the ones I always get", "bed": B}],
  [ClCarMap, {"done": ["headrest", "hook", "glasses", "trunk", "gas", "visor", "child", "defog", "tire", "wheellock", "spare", "cabin", "glow", "manual", "obd"], "title": "Miss Doris's car", "bed": B}],
  [ClQRCard, {"qr": "img/om99/qr.jpg", "cover": "img/om99/gift_cover.jpg", "text": "the 3 tests, free", "kicker": "FREE · BEFORE THE SHOP", "bed": B}],
  [ClBookPage, {"page": "img/om99/page9.jpg", "pageNo": 9, "stamp": "All 58 tricks · $27", "bed": B}],
  [ClVideoRef, {"thumb": "img/om99/th_omkey.jpg", "title": "7 hidden key fob features", "next": true, "bed": B}],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Mekit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
