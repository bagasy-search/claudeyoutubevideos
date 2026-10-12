// lkit · galería de prueba: un ejemplo por componente (fotos de public/img/lkit_demo). Cada demo es su propia composición
// "G-<Nombre>" (para stills) y "Gallery" las encadena. a = 100 s → los tiempos de las props son 100 + desfase.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CompWrap, fr } from "./core";
import { LKIT, LKIT_OVERLAYS } from "./index";
import { ItemCounter } from "./items";

const A = 100;
const T = (x: number) => +(A + x).toFixed(2);
export type Demo = { name: string; dur: number; still: number; props: any; overlay?: boolean; bg?: string };

export const DEMOS: Demo[] = [
  { name: "ThumbOpen", dur: 8, still: 2.4, props: { thumb: "th_card.jpg", k: "l_pan", fade: T(1.5), words: [["13", T(3.0)], ["things", T(3.3)], ["my", T(3.6)], ["mother", T(3.8)], ["never", T(4.2)], ["kept.", T(4.5)]] } },
  { name: "ItemCard", dur: 8, still: 4.2, props: { n: 9, of: 13, name: "The bug bomb", instead: "bait where they live", page: "PAGE 20", k: "n_bugbomb", k2: "n_mousehole", t: T(2.5) } },
  { name: "ItemCounter", dur: 6, still: 2.0, overlay: true, bg: "l_counter", props: { counts: [{ a: 0, b: 3, n: 6 }, { a: 3, b: 6, n: 7 }], of: 13 } },
  { name: "SwapCard", dur: 8, still: 4.5, props: { old: { k: "n_paperbags", txt: "Paper sacks" }, neu: { k: "n_glassjars", txt: "glass jars with lids" }, t: T(2.0) } },
  { name: "DropList", dur: 12, still: 9.0, props: { k: "n_emptyshelf", head: "What went in glass", shelfY: 41, x0: 20, x1: 80, items: [{ t: T(0), txt: "flour" }, { t: T(1.6), txt: "sugar" }, { t: T(3.2), txt: "oats" }, { t: T(4.8), txt: "rice" }, { t: T(6.2), txt: "birdseed" }, { t: T(7.6), txt: "dog food" }] } },
  { name: "GoneList", dur: 12, still: 8.5, props: { k: "n_gonekitchen", head: "What left my kitchen", items: [{ t: T(0.5), txt: "plug-in repeller", x: 20, y: 17, r: 5 }, { t: T(2.0), txt: "fruit bowl", x: 37, y: 40, r: 9 }, { t: T(3.6), txt: "bread bag", x: 50, y: 80, r: 10 }, { t: T(5.4), txt: "dirty dishes", x: 78, y: 42, r: 9 }] } },
  { name: "CheckScene", dur: 10, still: 7.5, props: { k: "n_nightsink", clock: "10 PM", head: "Before the light goes off", items: [{ t: T(1.0), txt: "sink wiped dry", x: 50, y: 62 }, { t: T(2.6), txt: "lid on the can" }, { t: T(4.2), txt: "pet bowl up" }, { t: T(5.8), txt: "fruit in the fridge" }] } },
  { name: "PhotoSeq", dur: 10, still: 7.0, props: { photos: [{ k: "n_mothballs", cap: "what most homes do" }, { k: "n_chalkline", t: T(4.0), cap: "a chalk line", mark: { kind: "under", x: 30, y: 60, w: 40, h: 8, t: T(5.0) } }] } },
  { name: "Chapter", dur: 6, still: 3.0, props: { n: "7", label: "ITEM", title: "The open trash can", sub: "PAGE 23", k: "n_lidcan", av: false } },
  { name: "StepCard", dur: 10, still: 7.0, props: { head: "Borax ant bait", page: "PAGE 18", steps: [{ t: T(0.5), txt: "A jar with holes in the lid", k: "n_glassjars" }, { t: T(3.0), txt: "Sugar water and borax", k: "n_jars" }, { t: T(5.5), txt: "Set it on their trail", k: "n_chalkline" }] } },
  { name: "MistakeStamp", dur: 6, still: 3.5, props: { k: "n_pan", txt: "A scratched pan goes back in the drawer", cx: 55, cy: 55, t: T(1.0) } },
  { name: "CostTag", dur: 7, still: 5.0, props: { price: "$4", sub: "a whole year of it", k: "n_jars", vs: { price: "$129", txt: "one visit", t: T(2.5) } } },
  { name: "Note", dur: 10, still: 8.5, props: { lines: [{ txt: "Close the door,", t: T(0.5) }, { txt: "take away the food,", t: T(2.0) }, { txt: "make them want to leave.", t: T(3.6) }], sig: "Mama", k: "l_cupboard", chip: { txt: "the three ideas", t: T(5.5) } } },
  { name: "PageUp", dur: 8, still: 3.5, props: { pages: [{ src: "page4", tab: "PAGE 4", t: T(0.3), hl: 40 }], k: "l_book" } },
  { name: "Checklist", dur: 14, still: 12.5, props: { head: "13 things my mother never kept", page: "THE BOOK", k: "n_pantryshelf", items: ["Nonstick pan", "Paper sacks", "Plastic bag stack", "Open trash can", "Fruit bowl", "Pet food out", "Plug-in repeller", "Dryer sheets", "Bug bomb", "Mothballs", "Wet sponge", "Cardboard boxes", "Dirty dishes overnight"].map((txt, i) => ({ t: T(0.5 + i * 0.7), txt })) } },
  { name: "NeverMix", dur: 8, still: 6.0, props: { head: "Never mix these", tag: "PAGE 3", k: "n_stove", rows: [{ t: T(0.8), a: "Bleach", b: ["vinegar", "ammonia"] }, { t: T(2.4), a: "Borax", b: ["food"] }], verdict: { t: T(4.0), txt: "= TOXIC GAS" } } },
  { name: "Lineup", dur: 9, still: 7.0, props: { head: "UNDER MY SINK · PAGE 4", items: [{ t: T(0), name: "White vinegar", use: "for the counters", k: "n_jars" }, { t: T(3), name: "Borax", use: "for the ant trail", k: "n_glassjars" }, { t: T(6), name: "Steel wool", use: "for the holes", k: "n_mousehole" }] } },
  { name: "BigNumber", dur: 6, still: 4.0, props: { num: 51, unit: "YEARS", txt: "in the same kitchen", k: "l_counter", t: T(0.3) } },
  { name: "Thumb", dur: 8, still: 4.0, props: { thumb: "th_prev.jpg", tag: "LAST TIME", k: "n_jars", push: false, words: [["How", T(1)], ["My", T(1.3)], ["Mother", T(1.6)], ["Kept", T(1.9)], ["Every", T(2.2)], ["Fly", T(2.5)], ["Out", T(2.8)]] } },
  { name: "QrCard", dur: 10, still: 4.0, props: { k: "l_book", t: T(1.2) } },
  { name: "Comment", dur: 8, still: 6.0, props: { q: "Which one did your mother keep out of the house?", k: "l_counter", opts: [{ t: T(3.5), txt: "Paper sacks" }, { t: T(4.2), txt: "Bug bombs" }, { t: T(4.9), txt: "Mothballs" }] } },
  { name: "Memory", dur: 7, still: 4.0, props: { k: "l_counter", caption: "Mama's kitchen, the fall before the frost", date: "Oct 1961", t: T(1.0) } },
  { name: "Careful", dur: 7, still: 4.0, props: { k: "n_mothballs", tag: "CAREFUL · PAGE 4", txt: "Mothballs are a pesticide. Not in a kitchen.", t: T(0.6) } },
  { name: "DoDont", dur: 8, still: 5.5, props: { k: "n_stove", no: { k: "n_pan", txt: "Scratched nonstick", t: T(0.5) }, yes: { k: "n_skillet", txt: "One cast iron skillet", t: T(2.5) } } },
  { name: "Arc", dur: 7, still: 3.5, props: { src: "arc_barn", vid: true, cap: "1951 · Iowa farm", credit: "Prelinger Archives (public domain)" } },
  { name: "Pins", dur: 8, still: 6.0, props: { k: "n_gonekitchen", head: "Where they get in", pins: [{ x: 22, y: 60, t: T(0.6), txt: "under the sink" }, { x: 52, y: 40, t: T(2.0), txt: "behind the stove" }, { x: 82, y: 65, t: T(3.4), txt: "the back door" }], wrong: { t: T(4.6), txt: "THE WRONG HALF" } } },
  { name: "FrameArt", dur: 7, still: 4.0, props: { k: "l_counter", bed: "n_stove", caption: "the kitchen she kept for fifty-one years", t: T(1.2) } },
  { name: "Flashlight", dur: 8, still: 5.0, props: { k: "n_mousehole", from: [20, 30], to: [55, 62], on: T(0.8), words: [["there it is", T(2.5), 1100, 220]] } },
  { name: "Tease", dur: 3, still: 1.5, props: { k: "n_skillet", txt: "the one pan she kept for fifty years" } },
  { name: "Kinetic", dur: 6, still: 3.5, props: { k: "n_pan", words: [["She", T(0.4)], ["never", T(0.7)], ["kept", T(1.0)], ["a", T(1.2)], ["scratched", T(1.4)], ["pan.", T(1.8)]] } },
  { name: "SplitHalf", dur: 7, still: 4.5, props: { k: "l_counter", l: { txt: "Most homes", t: T(0.8) }, r: { txt: "My mother's", t: T(2.0) }, foot: { txt: "same counter · same night", t: T(3.2) } } },
  { name: "Kicker", dur: 4, still: 1.5, overlay: true, bg: "l_counter", props: { txt: "STAY FOR #9", red: true } },
  { name: "Pop", dur: 3, still: 1.2, overlay: true, bg: "n_pan", props: { txt: "Scratched" } },
];

export const GalleryOne: React.FC<{ name: string }> = ({ name }) => {
  const D = DEMOS.find((x) => x.name === name)!;
  const d = fr(D.dur);
  if (D.name === "ItemCounter") return <AbsoluteFill><LKIT.PhotoSeq a={0} d={d} photos={[{ k: D.bg }]} /><ItemCounter {...D.props} /></AbsoluteFill>;
  if (D.overlay) { const O = LKIT_OVERLAYS[D.name]; return <AbsoluteFill><LKIT.PhotoSeq a={0} d={d} photos={[{ k: D.bg }]} /><O {...D.props} d={d} /></AbsoluteFill>; }
  const K = LKIT[D.name];
  return <CompWrap lead={0} d={d}><K {...D.props} a={A} d={d} /></CompWrap>;
};

export const GALLERY_FRAMES = DEMOS.reduce((m, x) => m + fr(x.dur), 0);
export const Gallery: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {DEMOS.map((D) => { const from = at; at += fr(D.dur); return <Sequence key={D.name} from={from} durationInFrames={fr(D.dur)}><GalleryOne name={D.name} /></Sequence>; })}
    </AbsoluteFill>
  );
};
