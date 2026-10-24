// reikoneck · EL VIDEO ENTERO. Un solo hilo: la casita de Reiko en Osaka (salón · baño · cocina · cuarto · balcón) es el
// mapa; el maniquí de porcelana del baño muestra cada cosa en el cuello (pliegue, toalla, aceite, sol, celular, beso al
// techo, nuca). Las tomas LTX / fotos de cada frase entran con barridos y el avatar por portales. Todo clavado a la voz
// con at(frase) — al cambiar la voz sólo se regeneran words.json y avwin.json. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, BUST0, makeCam, type BustSt, type Key, type WorldState } from "./cuello3d";
import { Avatar, Chip, Comment, PlaceTitle, Quote, Rows, Shot, Stamp, Stopwatch, Subscribe, Swipe, WIN, at, winAt } from "./parts";
import { BigNum, COL, LowerThird, Portal, Tag, e, ei } from "./lib";
import WORDS from "./words.json";

const WL = WORDS as { w: string; s: number; e?: number }[];
export const END = Math.ceil((WL[WL.length - 1].s + 2.6) * 10) / 10;
type V3 = [number, number, number];

// at() tolerante: la frase entera; si el ASR la partió distinto, sus 2 primeras palabras; si no, 3 s después
const T = (ph: string, after = 0): number => {
  try { return at(ph, after); } catch { /* sigue */ }
  try { return at(ph.split(" ").slice(0, 2).join(" "), after); } catch { /* sigue */ }
  return after + 3;
};

// ---------------- poses de cámara por lugar ----------------
type Pose = { p: V3; l: V3; fov: number };
const POSE: Record<string, Pose> = {
  house: { p: [0, 2.9, 8.6], l: [0, 0.8, -1.2], fov: 46 },
  bath: { p: [-3, 1.9, 3.2], l: [-3, 1.2, -1.2], fov: 42 },
  bustF: { p: [-3, 1.75, 1.4], l: [-3, 1.45, -0.7], fov: 34 },
  bustC: { p: [-3, 1.7, 0.9], l: [-3, 1.35, -0.7], fov: 30 },
  chin: { p: [-2.7, 1.32, 0.45], l: [-3, 1.3, -0.6], fov: 32 },
  bustS: { p: [-1.9, 1.6, 0.6], l: [-3, 1.35, -0.7], fov: 30 },
  bustB: { p: [-2.6, 1.75, -2.5], l: [-3, 1.3, -0.7], fov: 36 },
  shelf: { p: [-1.9, 1.6, -0.6], l: [-1.8, 1.45, -2.1], fov: 36 },
  sink: { p: [-3.9, 1.55, -0.5], l: [-3.9, 1.0, -2.0], fov: 38 },
  salon: { p: [-7.5, 1.9, 1.3], l: [-7.5, 1.1, -1.2], fov: 36 },
  salonW: { p: [-7.5, 2.4, 3.5], l: [-7.5, 1, -1.2], fov: 44 },
  warmer: { p: [-8.6, 1.3, 0.2], l: [-9.2, 0.8, -1.8], fov: 36 },
  kitchen: { p: [0.9, 1.5, 0.8], l: [1.2, 0.7, -1.5], fov: 40 },
  kettle: { p: [0.5, 1.3, -0.7], l: [0.2, 1.05, -1.95], fov: 34 },
  dicts: { p: [1.4, 0.9, 0.2], l: [1.8, 0.5, -1.25], fov: 34 },
  bed: { p: [3.3, 0.9, -1.2], l: [4.8, 0.3, -1.5], fov: 34 },
  bedW: { p: [4.8, 2.2, 1.8], l: [4.8, 0.3, -1.2], fov: 42 },
  balcony: { p: [8.4, 1.6, 2.4], l: [8.5, 1.2, -0.8], fov: 40 },
};
const push = (q: Pose, k = 0.12): Pose => ({ p: q.p.map((v, i) => v + (q.l[i] - v) * k) as V3, l: q.l, fov: q.fov - 2 });

// ---------------- el guion visual ----------------
// [frase de la voz donde entra, visual, estado del mundo]
// visual: "img:<clave>" (toma LTX si ya bajó, si no su cuadro clave) · "img:<clave>@<seg dentro de la toma>"
//         "w:<pose>" (la casa) · "wd:<pose>" (la casa oscurecida, para gráficos)
type St = { b?: Partial<BustSt>; s?: Partial<BustSt>; l?: Partial<BustSt>; w?: Partial<Omit<WorldState, "bust" | "salon" | "lying">> };
const RAW: [string, string, St?][] = [
  // ===== GANCHO: vos estás ahí, en el baño, con el celular =====
  ["okay youre in the bathroom", "img:g_phone"],
  ["and the camera is still on", "w:bustS", { b: { pitch: -0.7, fold: 1, phone: 1, phoneH: 0 } }],
  ["and there it is under your chin", "w:chin", { b: { pitch: -0.55, fold: 1 } }],
  ["and you put the phone down", "img:g_touch"],
  ["so you lift your chin", "img:g_mirror"],
  ["maybe you buy a cream", "w:shelf", { w: { glow: { oil: 0.6 } } }],
  ["maybe you start wearing a scarf", "img:g_scarf"],
  ["but here is the strange thing", "w:house"],
  ["i worked 25 years in a beauty salon", "img:salon_empty"],
  ["chair japanese women", "w:salon", { w: { memory: 1, warm: 1 }, s: { pitch: 0.1 } }],
  ["and it is not because they are lucky", "wd:salon", { w: { memory: 1 } }],
  ["it gets old from what you do", "w:bustF"],
  ["so today im going to show you 9 things", "wd:house"],
  ["the first one costs nothing", "img:t_water"],
  ["and the last one is something my grandmother", "img:n_kimono"],
  ["my name is reiko", "w:salonW", { w: { memory: 1, warm: 1 } }],
  ["i was an aesthetician for 25 years", "img:salon_towel"],
  ["i am not a doctor", "w:salon", { w: { memory: 1 } }],
  ["and there are some videos on the internet", "wd:bath"],
  ["this is my washroom", "w:bath", { w: { glow: { mirror: 0.5 } } }],

  // ===== 1 · la toalla tibia =====
  ["thing number one the warm towel", "w:sink", { w: { glow: { sink: 1 } } }],
  ["in japan we call it oshibori", "img:e_kettle"],
  ["i run the water warm", "img:t_water@7"],
  ["you touch it with the inside of your wrist", "w:sink", { w: { glow: { sink: 1 } } }],
  ["then i wet the towel", "img:t_wring"],
  ["and i fold it long", "img:t_neck"],
  ["what happens the muscles", "w:bustC", { b: { towel: 1, steam: 1, sh: 1 } }],
  ["skin gets soft", "img:t_neck@7"],
  ["the salon every facial started like this", "w:warmer", { w: { memory: 1, warm: 1 } }],
  ["my clients used to say", "img:salon_towel@7"],
  ["so in the morning before you put anything", "w:bustF", { b: { towel: 1, steam: 0.7 } }],
  ["i had one client", "w:salon", { w: { memory: 1 }, s: { sh: -1 } }],
  ["the first time she sat in my chair", "img:salon_shoulders"],
  ["and i put the warm towel on her neck", "w:salon", { w: { memory: 1, warm: 1 }, s: { towel: 1, steam: 1, sh: -0.4 } }],
  ["and she started to cry", "img:salon_shoulders@7"],
  ["after that she did the towel", "w:bustF", { b: { sh: 1 } }],

  // ===== 2 · agua tibia y nunca frotar =====
  ["thing number two", "w:sink", { w: { glow: { sink: 1 } } }],
  ["most women i met from america", "img:w_hot"],
  ["im sorry but its true", "w:bustS"],
  ["and the skin on the neck is thinner", "wd:bustC"],
  ["so the hot water takes the oil away", "img:w_hot@7"],
  ["in japan we wash the neck with lukewarm", "img:w_wash"],
  ["and then to dry you dont rub", "img:w_pat"],
  ["like you are taking a photo", "w:bustC", { b: { press: 1 } }],
  ["my mother used to say", "img:w_wash@7"],

  // ===== 3 · la cara termina en la clavícula =====
  ["thing number three", "w:bustF", { b: { zone: 1 } }],
  ["the first thing i taught her", "w:salonW", { w: { memory: 1 } }],
  ["the face doesnt end here", "w:bustC", { b: { zone: 1, face: 1 } }],
  ["and you know what most women do", "img:c_dots"],
  ["and then whatever is left on the fingers", "wd:bustF", { b: { face: 1 } }],
  ["so tonight when you do your face", "img:c_down"],

  // ===== 4 · aceite de camelia y hacia dónde van las manos =====
  ["tip number 4", "w:shelf", { w: { glow: { oil: 1 } } }],
  ["this is tsubaki oil", "img:o_drops"],
  ["japanese women have used it", "w:shelf", { w: { glow: { oil: 1 } } }],
  ["after the warm towel i put two drops", "img:o_drops@7"],
  ["and then the front of the neck i go up", "w:bustC", { b: { arrows: 1, drops: 1 } }],
  ["from the collarbone up to the jaw", "img:o_up"],
  ["the sides of the neck are different", "img:o_side"],
  ["in the salon we always did it this way", "w:bustC", { b: { arrows: 1 } }],
  ["i sold neck creams in the salon", "img:o_jars"],
  ["its not the jar", "wd:shelf"],
  ["there are videos that say", "wd:bath"],
  ["i did this on women for 25 years", "img:salon_empty@7"],
  ["what it does is the skin stays soft", "w:bustF"],

  // ===== 5 · el protector no termina en el mentón =====
  ["thing number five", "w:balcony", { w: { sun: 1 } }],
  ["in the salon i could see it", "w:bustC", { b: { sun: 1 }, w: { sun: 1 } }],
  ["same woman same neck", "wd:bustC", { b: { sun: 1 }, w: { sun: 1 } }],
  ["so in japan every morning the sunscreen", "img:s_cream"],
  ["every morning even when its cloudy", "img:s_higasa"],
  ["youve maybe seen japanese women", "img:s_women"],
  ["and if you think the umbrella is too much", "w:bustC", { b: { sun: 1, shade: 1 }, w: { sun: 1 } }],

  // ===== 6 · el celular a la altura de los ojos =====
  ["thing number six", "w:kitchen"],
  ["remember the beginning", "img:g_phone@7"],
  ["look at how you hold your phone", "img:p_down"],
  ["and your head is bending down", "w:bustS", { b: { pitch: -0.75, fold: 1, phone: 1, phoneH: 0 } }],
  ["so what i do i bring the phone up", "img:p_up"],
  ["my husband laughed at me", "w:bustS", { b: { phone: 1, phoneH: 1 } }],
  ["in the salon i could tell which clients", "w:salonW", { w: { memory: 1 } }],
  ["a teacher she raised", "img:p_dict"],
  ["she told me later", "w:dicts"],

  // ===== 7 · almohada baja =====
  ["thing number seven", "w:bedW", { w: { pillow: 1 }, l: { pitch: -0.6, fold: 1 } }],
  ["you sleep seven 8 hours", "img:pl_high"],
  ["many japanese families use a low pillow", "img:pl_soba"],
  ["it keeps the neck straight", "w:bed", { w: { pillow: 0 } }],
  ["you dont need a special japanese pillow", "img:pl_high@7"],
  ["and if you sleep on your back", "img:pl_towel"],
  ["look at yourself from the side", "w:bed", { w: { roll: 1 } }],

  // ===== 8 · besar el techo =====
  ["kiss the ceiling okay", "w:bustS", { b: { pitch: 0.55, kiss: 1 } }],
  ["slowly look up at the ceiling", "img:k_ceiling"],
  ["you feel the front of your neck working", "w:bustS", { b: { pitch: 0.55, kiss: 1 } }],
  ["10 times in the morning", "img:k_ceiling@7"],
  ["while im waiting for the kettle", "img:k_kettle"],
  ["you feel the muscle under the chin", "w:kettle", { w: { kettle: 1 } }],
  ["you can do it on the bus", "w:kitchen", { w: { kettle: 0.6 } }],
  ["my clients who did this every day", "w:salonW", { w: { memory: 1 } }],

  // ===== 9 · mostrar la nuca como la abuela =====
  ["show your nape like my grandmother", "w:bustB", { b: { kimono: 1 } }],
  ["my grandmother wore kimono", "img:n_kimono@7"],
  ["unaji we say", "w:bustB", { b: { kimono: 1 } }],
  ["so she walked like this", "img:n_posture"],
  ["like a string is pulling", "w:bustB", { b: { kimono: 1, string: 1, sh: 1 } }],
  ["and when i was a teenager", "wd:bustB", { b: { kimono: 1 } }],
  ["she was 91 when she died", "img:n_posture@7"],
  ["so every morning now after the towel", "w:bath", { b: { string: 1, sh: 1 } }],
  ["at the station", "img:n_station"],

  // ===== repaso + cierre =====
  ["thats the nine", "wd:house"],
  ["and please dont try to do all nine", "w:salonW", { w: { memory: 1 } }],
  ["pick two just two", "wd:bustF", { b: { towel: 1 } }],
  ["if you see a big change in your neck", "wd:bath"],
  ["if this helped you subscribe", "w:house"],
  ["and tell me one thing in the comments", "wd:house"],
  ["okay go put the kettle on", "img:e_kettle@7"],
  ["ill see you next week", "w:house", { w: { warm: 1 } }],
];
const B: { a: number; v: string; st: St }[] = [];
{
  let after = 0;
  RAW.forEach(([ph, v, st], i) => {
    const a = i === 0 ? 0 : T(ph, after);
    B.push({ a, v, st: st ?? {} });
    after = a + 0.1;
  });
}
const beatAt = (t: number) => { let i = 0; while (i < B.length - 1 && B[i + 1].a <= t) i++; return i; };
const bEnd = (i: number) => (i < B.length - 1 ? B[i + 1].a : END);

// ---------------- la cámara: vuela de pose en pose (si viene de la casa) y empuja despacio ----------------
const KEYS: Key[] = [];
{
  let prev: Pose | null = null;
  B.forEach((b, i) => {
    const end = bEnd(i);
    if (!b.v.startsWith("w")) { prev = null; return; }
    const q = POSE[b.v.split(":")[1]];
    const fly = prev && end - b.a > 2.2 ? 1.1 : 0;
    if (prev) KEYS.push({ t: b.a, ...prev });
    KEYS.push({ t: b.a + fly, ...q, arc: 0.03 });
    prev = push(q, 0.08 + Math.min(0.12, (end - b.a) * 0.01));
    KEYS.push({ t: end - 0.01, ...prev });
  });
  if (!KEYS.length) KEYS.push({ t: 0, ...POSE.house });
}
const CAM = makeCam(KEYS);
const { screenOf } = CAM;

// ---------------- estado de la casa: cada tramo de la casa trae el suyo; se funde desde el anterior en 0,9 s ----------------
const W0: Omit<WorldState, "bust" | "salon" | "lying"> = { day: 1, sun: 0, warm: 0, memory: 0, kettle: 0, pillow: 0, roll: 0, glow: {} };
const full = (st: St): WorldState => ({ ...W0, ...st.w, glow: { ...(st.w?.glow ?? {}) }, bust: { ...BUST0, ...st.b }, salon: { ...BUST0, ...st.s }, lying: { ...BUST0, ...st.l } });
const mixB = (a: BustSt, b: BustSt, k: number): BustSt => { const o = { ...a }; (Object.keys(a) as (keyof BustSt)[]).forEach((x) => { o[x] = a[x] + (b[x] - a[x]) * k; }); return o; };
const mixW = (a: WorldState, b: WorldState, k: number): WorldState => {
  const n = (x: "day" | "sun" | "warm" | "memory" | "kettle" | "pillow" | "roll") => a[x] + (b[x] - a[x]) * k;
  const glow: WorldState["glow"] = {};
  new Set([...Object.keys(a.glow), ...Object.keys(b.glow)]).forEach((g) => { const q = g as keyof typeof PT; glow[q] = (a.glow[q] ?? 0) + ((b.glow[q] ?? 0) - (a.glow[q] ?? 0)) * k; });
  return { day: n("day"), sun: n("sun"), warm: n("warm"), memory: n("memory"), kettle: n("kettle"), pillow: n("pillow"), roll: n("roll"), glow, bust: mixB(a.bust, b.bust, k), salon: mixB(a.salon, b.salon, k), lying: mixB(a.lying, b.lying, k) };
};
const WB = B.map((b, i) => ({ i, a: b.a, st: full(b.st) })).filter((x) => B[x.i].v.startsWith("w"));
const stAt = (t: number): WorldState => {
  let j = 0; while (j < WB.length - 1 && WB[j + 1].a <= t) j++;
  const cur = WB[j], prev = WB[j - 1];
  if (!prev) return cur.st;
  return mixW(prev.st, cur.st, ei(t, cur.a + 0.2, cur.a + 1.1));
};

const World: React.FC<{ t: number; dim?: number }> = ({ t, dim = 0 }) => (
  <AbsoluteFill style={{ filter: dim > 0 ? `brightness(${1 - dim})` : undefined }}><WorldRaw t={t} camAt={CAM.camAt} st={stAt(t)} /></AbsoluteFill>
);

// una toma del guion (foto/LTX con empuje lento, o la casa), dibujada en el segundo t
const Visual: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const b = B[i], end = bEnd(i), [kind, rest] = b.v.split(":");
  if (kind === "img") {
    const [k, off] = rest.split("@"), zin = i % 2 === 0;
    return <Shot k={k} t={t} a={b.a} from={off ? Number(off) : 0} dur={end - b.a + 0.6} z={zin ? [1.03, 1.12] : [1.12, 1.03]} ox={(i % 3 - 1) * 24} oy={zin ? -10 : 10} />;
  }
  return <World t={t} dim={kind === "wd" ? 0.5 : 0} />;
};

// tiempo de una frase (para los gráficos), siempre después de su tramo
const F = (ph: string, after = 0) => T(ph, after);

export const Video: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  const wi = winAt(t), bi = beatAt(t);
  const inW = (v: string) => B[bi].v === v;
  const P2 = (q: V3) => screenOf(t, q);

  // ===== capa base: avatar / tomas / casa, con portales y barridos =====
  if (wi >= 0) {
    L.push(<Avatar key="av" t={t} />);
  } else {
    const prevW = WIN.find((w) => t >= w.me && t < w.me + 0.38);
    const b = B[bi], startedInWin = winAt(b.a) >= 0 || WIN.some((w) => Math.abs(w.me - b.a) < 0.4);
    if (prevW) L.push(<Swipe key="sx" t={t} a={prevW.me} b={prevW.me + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 3 === 0} from={<Avatar t={t} />} to={<Visual i={bi} t={t} />} />);
    else if (bi > 0 && t < b.a + 0.38 && !startedInWin && !(B[bi - 1].v.startsWith("w") && b.v.startsWith("w")))
      L.push(<Swipe key={"sb" + bi} t={t} a={b.a} b={b.a + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 4 === 1} from={<Visual i={bi - 1} t={t} />} to={<Visual i={bi} t={t} />} />);
    else L.push(<Visual key={"v" + bi} i={bi} t={t} />);
    const nextW = WIN.find((w) => t >= w.ms - 0.35 && t < w.ms);
    if (nextW) L.push(<Portal key="pw" x={960} y={540} r={ei(t, nextW.ms - 0.35, nextW.ms)}><Avatar t={t} /></Portal>);
  }

  // un rótulo que apunta a un punto de la casa (si la casa está en pantalla) o al centro
  const tagAt = (key: string, ph: string, after: number, q: V3 | null, text: string, o: { sub?: string; col?: string; dur?: number; dx?: number; dy?: number; size?: number } = {}) => {
    const a = F(ph, after), out = a + (o.dur ?? 3.6);
    if (t < a - 0.1 || t > out + 0.5) return;
    const p = q && B[bi].v.startsWith("w") ? P2(q) : { x: 960, y: 540 };
    L.push(<Tag key={key} t={t} at={a} x={p.x} y={p.y} dx={o.dx ?? 330} dy={o.dy ?? -220} text={text} sub={o.sub} col={o.col ?? "#fff"} out={out} size={o.size ?? 54} />);
  };
  const title = (key: string, ph: string, after: number, n: string, name: string, dur = 4.2) => { const a = F(ph, after); L.push(<PlaceTitle key={key} t={t} at={a + 0.1} out={a + dur} n={n} name={name} lbl="THING" />); };
  const chip = (key: string, ph: string, after: number, text: string, good = false, dur = 3.6) => { const a = F(ph, after); L.push(<Chip key={key} t={t} at={a} out={a + dur} good={good} text={text} />); };
  const quote = (key: string, ph: string, after: number, text: string, o: { col?: string; y?: number; size?: number; dur?: number } = {}) => { const a = F(ph, after); L.push(<Quote key={key} t={t} at={a} out={a + (o.dur ?? 3.4)} text={text} col={o.col} y={o.y ?? 170} size={o.size ?? 80} />); };
  const stamp = (key: string, ph: string, after: number, text: string, o: { col?: string; size?: number; y?: number; dur?: number } = {}) => { const a = F(ph, after); L.push(<Stamp key={key} t={t} at={a} text={text} x={960} y={o.y ?? 300} out={a + (o.dur ?? 3)} rot={-6} size={o.size ?? 90} col={o.col} />); };
  const big = (key: string, ph: string, after: number, text: string, o: { col?: string; edge?: string; size?: number; y?: number; dur?: number; sub?: string } = {}) => { const a = F(ph, after); L.push(<BigNum key={key} t={t} at={a} text={text} size={o.size ?? 120} x={960} y={o.y ?? 210} out={a + (o.dur ?? 3.2)} col={o.col ?? "#ffffff"} edge={o.edge ?? "#334"} sub={o.sub} />); };
  const rows = (key: string, items: [string, number, string, boolean][], dur = 3, y = 260) => {
    const it = items.map(([ph, after, tx, ok]) => ({ at: F(ph, after), tx, ok }));
    L.push(<Rows key={key} t={t} out={it[it.length - 1].at + dur} y={y} items={it} />);
  };
  const G = "#7dffb4";

  // ===== GANCHO =====
  if (inW("w:bustS") && t < 20) { const c = P2(PT.chin); L.push(<Tag key="cam" t={t} at={F("from your hand") - 0.2} x={c.x} y={c.y} dx={-360} dy={-200} text="THE PHONE CAMERA" sub="LOOKING UP AT YOU" col={COL.amber} out={F("and there it is") - 0.1} size={52} />); }
  tagAt("fold", "that soft fold", 17, PT.chin, "THE FOLD", { col: COL.red, dur: 2.6 });
  tagAt("bands", "the two little bands", 19, PT.neck, "TWO LITTLE BANDS", { col: COL.amber, dur: 2.4, dx: -330 });
  quote("when", "when did this happen", 30, "WHEN DID THIS HAPPEN?", { size: 92 });
  chip("scarf", "wearing a scarf in july", 47, "A SCARF… IN JULY", false, 3.2);
  quote("age", "this is just my age", 50, "“THIS IS JUST MY AGE”", { size: 78, col: "#ffd9b8" });
  big("25y", "i worked 25 years", 56, "25 YEARS", { sub: "A BEAUTY SALON IN OSAKA", col: "#ffd9b8", edge: "#5a3a24" });
  big("6070", "60 70 75 years old", 66, "60 · 70 · 75", { col: "#ffffff" });
  chip("notn", "not that turkey neck", 71, "NOT THE TURKEY NECK", true, 3.4);
  rows("luck", [["not because they are lucky", 81, "LUCKY", false], ["not because they have surgery", 84, "SURGERY", false]], 2.6);
  rows("days", [["how you wash it", 98, "HOW YOU WASH IT", true], ["how you sleep", 99, "HOW YOU SLEEP ON IT", true], ["look at your phone", 101, "HOW YOU HOLD YOUR PHONE", true], ["where your sunscreen stops", 102, "WHERE YOUR SUNSCREEN STOPS", true]], 2.4, 200);
  stamp("bor", "nobody can sell you a boring thing", 109, "NOBODY SELLS BORING", { size: 80 });
  big("nine", "9 things we do in japan", 100, "9", { size: 300, y: 470, col: "#ffd9b8", edge: "#5a3a24", sub: "THINGS WE DO IN JAPAN AFTER 50", dur: 6.5 });
  chip("free", "the first one costs nothing", 119, "#1 COSTS NOTHING", true, 2.6);
  chip("gma", "something my grandmother did", 125, "#9 · MY GRANDMOTHER, EVERY DAY", true, 3.2);

  // ===== QUIÉN SOY =====
  { const a = F("my name is reiko", 134); L.push(<LowerThird key="lt" t={t} at={a + 0.2} out={a + 6.5} name="REIKO TANAKA" l2="ESTHETICIAN · 25 YEARS · OSAKA" l2at={a + 1.4} />); }
  tagAt("six", "six chairs and one very old", 144, PT.radio, "6 CHAIRS · 1 OLD RADIO", { col: COL.amber, dur: 3.4 });
  chip("nd", "i am not a doctor", 148, "NOT A DOCTOR · NO MIRACLES", false, 3.4);
  rows("hands", [["with my hands on real women", 155, "WHAT I SAW CHANGE", true], ["i saw not change", 160, "WHAT I SAW NOT CHANGE", false]], 2.6);
  stamp("lies", "things that are not true about the neck", 166, "NOT TRUE", { size: 120 });
  tagAt("wr", "this is my washroom", 170, PT.mirror, "MY WASHROOM", { sub: "VERY SMALL, SORRY", col: "#fff", dur: 3.4 });

  // ===== 1 · TOALLA TIBIA =====
  title("t1", "thing number one the warm towel", 177, "1", "THE WARM TOWEL");
  tagAt("osh", "we call it oshibori", 180, null, "OSHIBORI", { sub: "おしぼり · THE LITTLE WET TOWEL", col: COL.amber, dur: 4 });
  big("40c", "about 40 degrees", 195, "40 °C", { sub: "LIKE A BATH YOU CAN SIT IN", col: "#ffd9b8", edge: "#5a3a24", dur: 4.2 });
  chip("nh", "not hot never hot", 201, "NOT HOT. NEVER HOT.", false, 3);
  tagAt("wrist", "inside of your wrist", 204, PT.sink, "TEST ON YOUR WRIST", { col: COL.amber, dur: 4 });
  quote("tw", "twist until no water", 216, "TWIST · TWIST", { size: 96, dur: 2.4 });
  L.push(<Stopwatch key="sw1" t={t} at={F("one minute maybe two", 228)} out={F("one minute maybe two", 228) + 4} x={1400} y={300} n={2} unit="MIN" label="UNTIL IT'S NOT WARM" />);
  tagAt("sh", "the shoulders come down", 239, PT.collar, "SHOULDERS DOWN ~1 CM", { col: G, dur: 3.6 });
  chip("drk", "it drinks better", 249, "DAMP SKIN DRINKS BETTER", true, 3.4);
  quote("fav", "their favorite part", 262, "“MY FAVORITE PART”", { size: 84 });
  big("2m", "minutes it costs nothing", 270, "2 MIN · $0", { col: G, edge: "#0b3a22" });
  big("11y", "every month for 11 years", 275, "11 YEARS", { sub: "EVERY MONTH", dur: 3 });
  tagAt("bank", "worked in a bank", 278, null, "A LADY FROM THE BANK", { sub: "NEAR THE STATION", dur: 3.4 });
  quote("ns", "nobody touched my neck", 296, "“NOBODY TOUCHED MY NECK IN SO MANY YEARS”", { size: 70, dur: 5 });
  quote("lg", "same skin just longer", 307, "SAME SKIN. JUST LONGER.", { col: G, size: 86 });

  // ===== 2 · AGUA TIBIA, NUNCA FROTAR =====
  title("t2", "thing number two", 310, "2", "LUKEWARM WATER · NEVER RUB");
  rows("hr", [["in a hot shower", 320, "VERY HOT SHOWER", false], ["rub rub rub", 325, "RUB, RUB, RUB", false]], 3);
  rows("thin", [["is thinner than the skin on your face", 333, "THINNER THAN YOUR FACE", false], ["fewer oil glands", 337, "FEWER OIL GLANDS", false]], 3.2);
  tagAt("lk", "with lukewarm water", 349, null, "LUKEWARM · HANDS ONLY", { col: G, dur: 4 });
  chip("fm", "the foam does the work", 355, "THE FOAM DOES THE WORK", true, 3);
  quote("pl", "press lift press lift", 366, "PRESS · LIFT · PRESS · LIFT", { size: 84, col: G });
  quote("silk", "treat your neck like silk", 373, "LIKE SILK, NOT THE KITCHEN FLOOR", { size: 74, col: "#ffd9b8", dur: 4, y: 880 });

  // ===== 3 · LA CARA TERMINA EN LA CLAVÍCULA =====
  title("t3", "thing number three", 378, "3", "THE FACE ENDS AT THE COLLARBONE");
  tagAt("jaw", "doesnt end here at the jaw", 390, PT.chin, "NOT HERE", { col: COL.red, dur: 2.6, dx: -330 });
  tagAt("clv", "the face ends here at the collarbone", 392, PT.collar, "HERE", { col: G, dur: 4, size: 70 });
  stamp("lo", "like leftovers", 421, "LEFTOVERS", { size: 130 });
  rows("5070", [["the face looks 50", 427, "FACE: 50", true], ["the neck looks 70", 429, "NECK: 70", false]], 3, 230);
  chip("same", "same amount for the neck", 435, "SAME AMOUNT AS THE CHEEKS", true, 4);

  // ===== 4 · ACEITE DE CAMELIA =====
  title("t4", "tip number 4", 443, "4", "CAMELLIA OIL · WHICH WAY YOUR HANDS GO");
  tagAt("tsu", "this is tsubaki oil", 448, PT.oil, "TSUBAKI · 椿", { sub: "CAMELLIA OIL", col: COL.amber, dur: 4 });
  big("2d", "two drops only two", 470, "2 DROPS", { col: "#ffd9b8", edge: "#5a3a24" });
  tagAt("up", "front of the neck i go up", 478, PT.neck, "FRONT: UP ↑", { col: G, dur: 4 });
  L.push(<Stopwatch key="sw10" t={t} at={F("slowly ten times", 486)} out={F("slowly ten times", 486) + 3.6} x={1400} y={300} n={10} unit="×" label="SLOWLY" />);
  quote("pap", "smoothing a sheet of paper", 490, "SMOOTHING PAPER, NOT PUSHING DOUGH", { size: 70 });
  tagAt("dn", "from behind the ear i go down", 497, null, "SIDES: DOWN ↓", { col: COL.amber, dur: 4 });
  rows("dir", [["behind the ear down", 508, "BEHIND THE EAR → DOWN", true], ["front of the neck up", 510, "FRONT OF THE NECK → UP", true]], 3);
  tagAt("jar", "in beautiful jars", 518, null, "EXPENSIVE · BEAUTIFUL JARS", { col: COL.amber, dur: 3.4 });
  quote("hab", "the habits around the jar", 537, "IT'S THE HABITS AROUND THE JAR", { col: G, size: 78 });
  { const a = F("your turkey neck will be lifted", 546); L.push(<Chip key="10d" t={t} at={a - 1.2} out={a + 2.5} text="“10 DAYS = LIFTED”" />); }
  stamp("no", "no", 548, "NO.", { size: 200, y: 460, dur: 2.2 });
  rows("does", [["the skin stays soft", 557, "STAYS SOFT", true], ["it stays moisturized", 558, "STAYS MOISTURIZED", true], ["you stop pulling it down", 560, "STOP PULLING IT DOWN", true]], 3);
  chip("nm", "its not magic", 565, "NOT MAGIC. I WON'T LIE TO YOU.", false, 3.4);

  // ===== 5 · EL PROTECTOR NO TERMINA EN EL MENTÓN =====
  title("t5", "thing number five", 568, "5", "SUNSCREEN DOESN'T STOP AT THE CHIN");
  chip("one", "if you only do one", 576, "IF YOU DO ONLY ONE, DO THIS ONE", true, 3.6);
  big("40y", "for 40 years", 586, "40 YEARS OF SUN", { col: "#ffd27a", edge: "#5a4500" });
  rows("2age", [["it looked older", 588, "SUN SIDE: OLDER", false], ["it looked younger", 593, "SHADOW: YOUNGER", true]], 3);
  quote("2a", "two different ages", 596, "SAME NECK. TWO AGES.", { size: 86 });
  rows("ss", [["and then down the neck", 608, "FACE → NECK", true], ["the back of", 611, "SIDES + BACK", true], ["the top of the chest", 612, "TOP OF THE CHEST", true]], 2.6, 220);
  chip("cl", "even when its cloudy", 615, "CLOUDY · WINTER · EVERY MORNING", true, 3.4);
  tagAt("hg", "the higasa", 621, null, "HIGASA · 日傘", { sub: "THE SUN UMBRELLA", col: COL.amber, dur: 4 });
  quote("why", "this is why", 631, "THIS IS WHY.", { size: 100 });
  tagAt("shd", "give your neck some shade", 638, PT.neck, "SCARF · COLLAR · SHADE", { col: G, dur: 3.6 });

  // ===== 6 · EL CELULAR ARRIBA =====
  title("t6", "thing number six", 639, "6", "BRING THE PHONE UP TO YOUR EYES");
  quote("hlp", "the phone is helping to make it", 652, "THE PHONE HELPS MAKE IT", { col: "#ff8a7a", size: 84 });
  tagAt("bend", "the skin of your neck is folding", 663, PT.chin, "FOLDING IN THE SAME PLACE", { col: COL.red, dur: 4 });
  rows("hrs", [["one hour two hours", 667, "1 HOUR · 2 HOURS · 3 HOURS", false], ["every day that fold", 671, "EVERY DAY", false]], 3);
  tagAt("smn", "smartphone neck", 680, null, "SUMAHO-KUBI · スマホ首", { sub: "SMARTPHONE NECK", col: COL.amber, dur: 4 });
  tagAt("eye", "two hands up here", 691, PT.head, "UP TO YOUR EYES", { col: G, dur: 3.6, dx: -330 });
  big("1000", "a thousand times a day", 701, "1,000× A DAY", { col: "#ff8a7a", edge: "#4a0c08" });
  chip("tdy", "try it today", 703, "TRY IT TODAY", true, 3.2);
  tagAt("dct", "two old dictionaries", 732, PT.dicts, "TWO OLD DICTIONARIES", { col: COL.amber, dur: 4 });
  quote("ntd", "just not tired", 742, "“NOT YOUNGER. JUST NOT TIRED.”", { size: 76 });

  // ===== 7 · ALMOHADA BAJA =====
  title("t7", "thing number seven", 745, "7", "A LOW PILLOW");
  tagAt("8h", "chin to chest folded", 761, PT.pillow, "CHIN TO CHEST · 8 HOURS", { col: COL.red, dur: 4 });
  tagAt("sbk", "soba cover", 770, null, "SOBAKAWA · そば殻", { sub: "BUCKWHEAT HUSKS", col: COL.amber, dur: 4 });
  tagAt("str", "it keeps the neck straight", 779, PT.pillow, "STRAIGHT, IN LINE WITH THE BACK", { col: G, dur: 4 });
  chip("onep", "take one pillow away", 789, "TAKE ONE PILLOW AWAY", true, 3.4);
  tagAt("rt", "a small rolled towel", 796, PT.pillow, "A SMALL ROLLED TOWEL", { col: G, dur: 4, dx: -330 });

  // ===== 8 · BESAR EL TECHO =====
  title("t8", "thing number 8", 812, "8", "KISS THE CEILING");
  rows("kc", [["sit straight or stand", 820, "SIT STRAIGHT", true], ["shoulders down", 822, "SHOULDERS DOWN", true], ["slowly look up", 823, "LOOK UP · LIPS FORWARD", true]], 2.6);
  L.push(<Stopwatch key="sw5" t={t} at={F("hold it", 831)} out={F("hold it", 831) + 4} x={1400} y={300} n={5} label="HOLD IT" />);
  tagAt("frn", "the front of your neck working", 834, PT.neck, "THE FRONT IS WORKING", { col: G, dur: 3.4 });
  big("10x", "10 times in the morning", 839, "10× EVERY MORNING", { col: G, edge: "#0b3a22" });
  tagAt("tng", "tongue flat", 851, null, "TONGUE ON THE ROOF · SWALLOW", { col: COL.amber, dur: 4.4 });
  chip("bus", "nobody can see you do it", 862, "NOBODY CAN SEE YOU DO IT", true, 3.4);
  chip("hon", "exercise doesnt remove loose skin", 867, "IT DOESN'T REMOVE LOOSE SKIN", false, 4);
  quote("awk", "more firm more awake", 875, "MORE FIRM · MORE AWAKE", { col: G, size: 84 });

  // ===== 9 · LA NUCA =====
  title("t9", "show your nape like my grandmother", 1006, "9", "SHOW YOUR NAPE LIKE MY GRANDMOTHER", 4.6);
  tagAt("unj", "unaji we say", 906, PT.nape, "UNAJI · うなじ", { sub: "THE NAPE", col: COL.amber, dur: 4 });
  quote("nf", "not the face the back", 912, "NOT THE FACE. THE BACK OF THE NECK.", { size: 72 });
  tagAt("strg", "like a string is pulling", 921, PT.head, "A STRING PULLS YOU UP", { col: G, dur: 4, dx: -330 });
  quote("obc", "nobody is looking at your neck", 934, "“OBAACHAN, NOBODY IS LOOKING”", { size: 72 });
  quote("ila", "i am looking at it", 938, "“I AM LOOKING AT IT.”", { col: "#ffd9b8", size: 96 });
  big("91", "she was 91", 939, "91", { size: 260, y: 430, sub: "LONG, STRAIGHT, NO FOLD", col: "#ffd9b8", edge: "#5a3a24", dur: 4.4 });
  big("10s", "for 10 seconds", 956, "10 SECONDS", { sub: "EVERY MORNING, THIS MIRROR" });

  // ===== REPASO =====
  {
    const R: [string, string][] = [["the warm towel", "THE WARM TOWEL · 2 MIN"], ["lukewarm water and you press", "LUKEWARM · PRESS, NEVER RUB"], ["the face ends at the collarbone", "FACE ENDS AT THE COLLARBONE"], ["two drops of oil", "2 DROPS · FRONT UP, SIDES DOWN"], ["sunscreen all the way down", "SUNSCREEN ALL THE WAY DOWN"], ["up to your eyes", "PHONE UP TO YOUR EYES"], ["a lower pillow", "A LOWER PILLOW"], ["kiss the ceiling", "KISS THE CEILING"], ["show your nape like my grandmother", "SHOW YOUR NAPE"]];
    let after = F("thats the nine", 971);
    const ts = R.map(([ph]) => { const a = F(ph, after); after = a + 0.2; return a; });
    ts.forEach((a, i) => { const out = i < 8 ? ts[i + 1] - 0.1 : a + 3; L.push(<PlaceTitle key={"r" + i} t={t} at={a - 0.6} out={out} n={String(i + 1)} name={R[i][1]} lbl="THING" />); });
  }
  big("3d", "for three days and then you stop", 1010, "3 DAYS… THEN STOP", { col: "#ff8a7a", edge: "#4a0c08", dur: 3 });
  rows("pk2", [["the warm towel and the sunscreen", 1020, "THE WARM TOWEL", true], ["and the sunscreen", 1021, "THE SUNSCREEN", true]], 3.6);
  big("1mo", "every day for one month", 1024, "1 MONTH", { sub: "THEN ADD ONE MORE", col: G, edge: "#0b3a22" });
  chip("doc", "a lump a swelling", 1035, "LUMP · SWELLING · PAIN → SEE YOUR DOCTOR", false, 8);

  // ===== CTA: suscribirse + campanita + UNA pregunta =====
  { const a = F("subscribe to the channel", 1051); L.push(<Subscribe key="sub" t={t} at={a - 0.3} bell={F("press the little bell", a)} out={a + 7.5} />); }
  tagAt("nx", "next week is the hands", 1059, null, "NEXT WEEK: THE HANDS", { sub: "AFTER WASHING THE DISHES…", col: COL.amber, dur: 9 });
  { const a = F("tell me one thing in the comments", 1072); L.push(<Comment key="cm" t={t} at={a} out={F("i read every comment", a) + 1.6} reply={F("what were you looking at", a) + 1.2} head="TELL ME IN THE COMMENTS" q="When was the first time you noticed your neck?" rs={["In the car mirror…", "A video call!", "My daughter's photo"]} />); }
  quote("ktl", "put the kettle on", 1086, "PUT THE KETTLE ON. WARM A TOWEL.", { size: 72, col: "#ffd9b8" });

  return <AbsoluteFill style={{ background: "#000" }}>{L}</AbsoluteFill>;
};
