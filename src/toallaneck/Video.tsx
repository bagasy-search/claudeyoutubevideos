// toallaneck · gemelo ES de reikoneck (canal Toalla Tibia de Osaka): el mismo mundo, las mismas tomas y fotos,
// su voz, su avatar, sus frases at() y todo el texto en pantalla en español. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, BUST0, makeCam, type BustSt, type Key, type WorldState } from "../reikoneck/cuello3d";
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
  house: { p: [0, 3.5, 10.6], l: [0, 0.75, -1.2], fov: 50 },
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
  // ===== GANCHO: estás ahí, en el baño, con el celular =====
  ["bueno estas en el bano", "img:g_phone"],
  ["y la camara quedo prendida", "w:bustS", { b: { pitch: -0.7, fold: 1, phone: 1, phoneH: 0 } }],
  ["y ahi esta debajo de la barbilla", "w:chin", { b: { pitch: -0.55, fold: 1 } }],
  ["y dejas el celular", "img:g_touch"],
  ["entonces levantas la barbilla", "img:g_mirror"],
  ["a lo mejor te compras una crema", "w:shelf", { w: { glow: { oil: 0.6 } } }],
  ["a lo mejor empiezas a usar panuelo", "img:g_scarf"],
  ["pero mira lo raro", "w:house"],
  ["yo trabaje 25 anos en un salon", "img:salon_empty"],
  ["mujeres japonesas de", "w:salon", { w: { memory: 1, warm: 1 }, s: { pitch: 0.1 } }],
  ["y no es porque tengan suerte", "wd:salon", { w: { memory: 1 } }],
  ["no envejece por los cumpleanos", "w:bustF"],
  ["asi que hoy te voy a ensenar", "wd:house"],
  ["la primera no cuesta nada", "img:t_water"],
  ["y la ultima es algo que hacia mi abuela", "img:n_kimono"],
  ["me llamo reiko", "w:salonW", { w: { memory: 1, warm: 1 } }],
  ["fui esteticista 25 anos", "img:salon_towel"],
  ["no soy doctora", "w:salon", { w: { memory: 1 } }],
  ["y hay videos en internet", "wd:bath"],
  ["este es mi bano", "w:bath", { w: { glow: { mirror: 0.5 } } }],

  // ===== 1 · la toalla tibia =====
  ["cosa numero 1", "w:sink", { w: { glow: { sink: 1 } } }],
  ["en japon le decimos oshibori", "img:e_kettle"],
  ["dejo correr el agua tibia", "img:t_water@7"],
  ["primero la tocas con la parte de adentro", "w:sink", { w: { glow: { sink: 1 } } }],
  ["despues mojo la toalla", "img:t_wring"],
  ["la doblo a lo largo", "img:t_neck"],
  ["que pasa los musculos", "w:bustC", { b: { towel: 1, steam: 1, sh: 1 } }],
  ["un poquito humeda", "img:t_neck@7"],
  ["en el salon cada facial empezaba asi", "w:warmer", { w: { memory: 1, warm: 1 } }],
  ["mis clientas decian", "img:salon_towel@7"],
  ["asi que en la manana antes de ponerte nada", "w:bustF", { b: { towel: 1, steam: 0.7 } }],
  ["tuve una clienta", "w:salon", { w: { memory: 1 }, s: { sh: -1 } }],
  ["la primera vez que se sento en mi silla", "img:salon_shoulders"],
  ["le puse la toalla tibia en el cuello", "w:salon", { w: { memory: 1, warm: 1 }, s: { towel: 1, steam: 1, sh: -0.4 } }],
  ["me dijo hace tantos anos", "img:salon_shoulders@7"],
  ["despues de eso hacia la toalla", "w:bustF", { b: { sh: 1 } }],

  // ===== 2 · agua tibia y nunca frotar =====
  ["cosa numero 2", "w:sink", { w: { glow: { sink: 1 } } }],
  ["muchas mujeres que conoci", "img:w_hot"],
  ["perdon pero es verdad", "w:bustS"],
  ["y la piel del cuello es mas delgada", "wd:bustC"],
  ["entonces el agua caliente le quita la grasa", "img:w_hot@7"],
  ["en japon nos lavamos el cuello", "img:w_wash"],
  ["y para secar no frotas", "img:w_pat"],
  ["como si le sacaras una foto", "w:bustC", { b: { press: 1 } }],
  ["mi mama decia", "img:w_wash@7"],

  // ===== 3 · la cara termina en la clavícula =====
  ["cosa numero 3", "w:bustF", { b: { zone: 1 } }],
  ["cuando una chica nueva", "w:salonW", { w: { memory: 1 } }],
  ["la cara no termina aqui", "w:bustC", { b: { zone: 1, face: 1 } }],
  ["y sabes que hace la mayoria", "img:c_dots"],
  ["como las sobras", "wd:bustF", { b: { face: 1 } }],
  ["asi que esta noche", "img:c_down"],

  // ===== 4 · aceite de camelia =====
  ["cosa numero 4", "w:shelf", { w: { glow: { oil: 1 } } }],
  ["este es aceite de tsubaki", "img:o_drops"],
  ["las mujeres japonesas lo usan", "w:shelf", { w: { glow: { oil: 1 } } }],
  ["despues de la toalla tibia me pongo dos gotas", "img:o_drops@7"],
  ["me froto las manos", "w:bustC", { b: { arrows: 1, drops: 1 } }],
  ["desde la clavicula hasta la mandibula", "img:o_up"],
  ["los costados del cuello son distintos", "img:o_side"],
  ["en el salon siempre lo haciamos asi", "w:bustC", { b: { arrows: 1 } }],
  ["yo vendia cremas para el cuello", "img:o_jars"],
  ["no es el frasco", "wd:shelf"],
  ["y aqui va lo que te prometi", "wd:bath"],
  ["yo hice esto en mujeres", "img:salon_empty@7"],
  ["lo que hace es que la piel se queda suave", "w:bustF"],

  // ===== 5 · el protector no termina en la barbilla =====
  ["cosa numero 5", "w:balcony", { w: { sun: 1 } }],
  ["en el salon lo veia en cada mujer", "w:bustC", { b: { sun: 1 }, w: { sun: 1 } }],
  ["la misma mujer el mismo cuello", "wd:bustC", { b: { sun: 1 }, w: { sun: 1 } }],
  ["por eso en japon cada manana el protector", "img:s_cream"],
  ["y cuando salimos en verano", "img:s_higasa"],
  ["a lo mejor has visto mujeres japonesas", "img:s_women"],
  ["y si te parece mucho la sombrilla", "w:bustC", { b: { sun: 1, shade: 1 }, w: { sun: 1 } }],

  // ===== 6 · el celular arriba =====
  ["cosa numero 6", "w:kitchen"],
  ["te acuerdas del principio", "img:g_phone@7"],
  ["mira como agarras el celular", "img:p_down"],
  ["y tu cabeza se dobla", "w:bustS", { b: { pitch: -0.75, fold: 1, phone: 1, phoneH: 0 } }],
  ["entonces lo que hago yo", "img:p_up"],
  ["mi marido se reia de mi", "w:bustS", { b: { phone: 1, phoneH: 1 } }],
  ["en el salon yo sabia", "w:salonW", { w: { memory: 1 } }],
  ["una senora maestra", "img:p_dict"],
  ["me conto despues", "w:dicts"],

  // ===== 7 · almohada baja =====
  ["cosa numero 7", "w:bedW", { w: { pillow: 1 }, l: { pitch: -0.6, fold: 1 } }],
  ["duermes 78 horas", "img:pl_high"],
  ["muchas familias japonesas", "img:pl_soba"],
  ["mantiene el cuello derecho", "w:bed", { w: { pillow: 0 } }],
  ["no necesitas una almohada japonesa", "img:pl_high@7"],
  ["y si duermes boca arriba", "img:pl_towel"],
  ["mirate de costado", "w:bed", { w: { roll: 1 } }],

  // ===== 8 · dale un beso al techo =====
  ["cosa numero 8", "w:bustS", { b: { pitch: 0.55, kiss: 1 } }],
  ["despacito mira al techo", "img:k_ceiling"],
  ["sientes el frente del cuello", "w:bustS", { b: { pitch: 0.55, kiss: 1 } }],
  ["diez veces en la manana", "img:k_ceiling@7"],
  ["mientras espero que hierva el agua", "img:k_kettle"],
  ["sientes que el musculo", "w:kettle", { w: { kettle: 1 } }],
  ["nadie te ve hacerlo", "w:kitchen", { w: { kettle: 0.6 } }],
  ["mis clientas que lo hacian", "w:salonW", { w: { memory: 1 } }],

  // ===== 9 · la nuca =====
  ["cosa numero 9", "w:bustB", { b: { kimono: 1 } }],
  ["mi abuela uso kimono", "img:n_kimono@7"],
  ["decimos", "w:bustB", { b: { kimono: 1 } }],
  ["asi que ella caminaba asi", "img:n_posture"],
  ["la nuca larga como si un hilo", "w:bustB", { b: { kimono: 1, string: 1, sh: 1 } }],
  ["y cuando yo era adolescente", "wd:bustB", { b: { kimono: 1 } }],
  ["tenia 91 anos cuando murio", "img:n_posture@7"],
  ["asi que ahora cada manana", "w:bath", { b: { string: 1, sh: 1 } }],
  ["en la estacion cuando cocino", "img:n_station"],

  // ===== repaso + cierre =====
  ["esas son las nueve", "wd:house"],
  ["y por favor no intentes", "w:salonW", { w: { memory: 1 } }],
  ["elige dos solo dos", "wd:bustF", { b: { towel: 1 } }],
  ["si ves un cambio grande", "wd:bath"],
  ["si esto te sirvio", "w:house"],
  ["y cuentame una cosa en los comentarios", "wd:house"],
  ["bueno ve a poner el agua", "img:e_kettle@7"],
  ["nos vemos la proxima semana", "w:house", { w: { warm: 1 } }],
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
  const title = (key: string, ph: string, after: number, n: string, name: string, dur = 4.2) => { const a = F(ph, after); L.push(<PlaceTitle key={key} t={t} at={a + 0.1} out={a + dur} n={n} name={name} lbl="COSA" />); };
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
  if (inW("w:bustS") && t < 20) { const c = P2(PT.chin); L.push(<Tag key="cam" t={t} at={F("desde tu mano") - 0.2} x={c.x} y={c.y} dx={-360} dy={-200} text="LA CÁMARA DEL CELULAR" sub="MIRÁNDOTE DESDE ABAJO" col={COL.amber} out={F("y ahi esta") - 0.1} size={52} />); }
  tagAt("fold", "ese pliegue blandito", 10, PT.chin, "EL PLIEGUE", { col: COL.red, dur: 2.6 });
  tagAt("bands", "las dos bandas", 10, PT.neck, "DOS BANDITAS", { col: COL.amber, dur: 2.4, dx: -330 });
  quote("when", "cuando paso esto", 20, "¿CUÁNDO PASÓ ESTO?", { size: 92 });
  chip("scarf", "panuelo en pleno verano", 35, "PAÑUELO… EN PLENO VERANO", false, 3.2);
  quote("age", "bueno es la edad", 40, "«ES LA EDAD»", { size: 84, col: "#ffd9b8" });
  big("25y", "yo trabaje 25 anos", 45, "25 AÑOS", { sub: "UN SALÓN DE BELLEZA EN OSAKA", col: "#ffd9b8", edge: "#5a3a24" });
  big("6070", "60 70 75 anos", 50, "60 · 70 · 75", { col: "#ffffff" });
  chip("notn", "no tenia papada de pavo", 55, "SIN PAPADA DE PAVO", true, 3.4);
  rows("luck", [["porque tengan suerte", 65, "SUERTE", false], ["no es por cirugia", 65, "CIRUGÍA", false]], 2.6);
  rows("days", [["como lo lavas", 75, "CÓMO LO LAVAS", true], ["como duermes encima", 75, "CÓMO DUERMES", true], ["miras el celular", 75, "CÓMO MIRAS EL CELULAR", true], ["hasta donde llega tu protector", 75, "HASTA DÓNDE LLEGA EL PROTECTOR", true]], 2.4, 200);
  stamp("bor", "nadie te puede vender una cosa aburrida", 85, "LO ABURRIDO NO SE VENDE", { size: 74 });
  big("nine", "9 cosas que hacemos en japon", 90, "9", { size: 300, y: 470, col: "#ffd9b8", edge: "#5a3a24", sub: "COSAS QUE HACEMOS EN JAPÓN DESPUÉS DE LOS 50", dur: 6.5 });
  chip("free", "la primera no cuesta nada", 100, "LA #1 NO CUESTA NADA", true, 2.6);
  chip("gma", "hacia mi abuela", 104, "LA #9 · MI ABUELA, TODOS LOS DÍAS", true, 3.2);

  // ===== QUIÉN SOY =====
  { const a = F("me llamo reiko", 112); L.push(<LowerThird key="lt" t={t} at={a + 0.2} out={a + 6.5} name="REIKO TANAKA" l2="ESTETICISTA · 25 AÑOS · OSAKA" l2at={a + 1.4} />); }
  tagAt("six", "seis sillas y una radio", 118, PT.radio, "6 SILLAS · 1 RADIO VIEJITA", { col: COL.amber, dur: 3.4 });
  chip("nd", "no soy doctora", 125, "NO SOY DOCTORA · NADA DE MILAGROS", false, 3.4);
  rows("hands", [["lo que vi cambiar", 128, "LO QUE VI CAMBIAR", true], ["lo que vi que no cambiaba", 130, "LO QUE NO CAMBIABA", false]], 2.6);
  stamp("lies", "que no son verdad", 135, "NO ES VERDAD", { size: 110 });
  tagAt("wr", "este es mi bano", 140, PT.mirror, "MI BAÑO", { sub: "MUY CHIQUITO, PERDÓN", col: "#fff", dur: 3.4 });

  // ===== 1 · TOALLA TIBIA =====
  title("t1", "cosa numero 1", 145, "1", "LA TOALLA TIBIA");
  tagAt("osh", "le decimos oshibori", 148, null, "OSHIBORI", { sub: "おしぼり · LA TOALLITA MOJADA", col: COL.amber, dur: 4 });
  big("40c", "unos 40 grados", 160, "40 °C", { sub: "COMO UN BAÑO LARGO", col: "#ffd9b8", edge: "#5a3a24", dur: 4.2 });
  chip("nh", "no caliente nunca caliente", 165, "NO CALIENTE. NUNCA CALIENTE.", false, 3);
  tagAt("wrist", "adentro de la muneca", 170, PT.sink, "PRUÉBALA EN LA MUÑECA", { col: COL.amber, dur: 4 });
  quote("tw", "la retuerzo la retuerzo", 177, "LA RETUERZO · LA RETUERZO", { size: 90, dur: 2.4 });
  L.push(<Stopwatch key="sw1" t={t} at={F("un minuto quizas dos", 188)} out={F("un minuto quizas dos", 188) + 4} x={1400} y={300} n={2} unit="MIN" label="HASTA QUE YA NO ESTÉ TIBIA" />);
  tagAt("sh", "los hombros bajan", 196, PT.collar, "HOMBROS ABAJO ~1 CM", { col: G, dur: 3.6 });
  chip("drk", "la absorbe mejor", 205, "LA PIEL HÚMEDA ABSORBE MEJOR", true, 3.4);
  quote("fav", "su parte favorita", 218, "«SU PARTE FAVORITA»", { size: 84 });
  big("2m", "dos minutos no cuesta nada", 225, "2 MIN · $0", { col: G, edge: "#0b3a22" });
  big("11y", "durante 11 anos", 229, "11 AÑOS", { sub: "TODOS LOS MESES", dur: 3 });
  tagAt("bank", "trabajaba en un banco", 232, null, "UNA SEÑORA DEL BANCO", { sub: "CERCA DE LA ESTACIÓN", dur: 3.4 });
  quote("ns", "hace tantos anos que nadie me toca el cuello", 248, "«HACE TANTOS AÑOS QUE NADIE ME TOCA EL CUELLO»", { size: 66, dur: 5 });
  quote("lg", "la misma piel solo mas largo", 258, "LA MISMA PIEL. SOLO MÁS LARGO.", { col: G, size: 82 });

  // ===== 2 · AGUA TIBIA, NUNCA FROTAR =====
  title("t2", "cosa numero 2", 262, "2", "AGUA TIBIA · NUNCA FROTAR");
  rows("hr", [["en una ducha caliente", 266, "DUCHA MUY CALIENTE", false], ["frotan frotan frotan", 270, "FROTAR, FROTAR, FROTAR", false]], 3);
  rows("thin", [["es mas delgada que la de la cara", 280, "MÁS DELGADA QUE LA CARA", false], ["tiene menos glandulas", 280, "MENOS GLÁNDULAS DE GRASA", false]], 3.2);
  tagAt("lk", "con agua tibia y con las manos", 293, null, "AGUA TIBIA · SÓLO LAS MANOS", { col: G, dur: 4 });
  chip("fm", "la espuma hace el trabajo", 300, "LA ESPUMA HACE EL TRABAJO", true, 3);
  quote("pl", "apoyas levantas apoyas levantas", 305, "APOYAS · LEVANTAS · APOYAS · LEVANTAS", { size: 74, col: G });
  quote("silk", "como si fuera seda", 318, "COMO SEDA, NO COMO EL PISO DE LA COCINA", { size: 68, col: "#ffd9b8", dur: 4 });

  // ===== 3 · LA CARA TERMINA EN LA CLAVÍCULA =====
  title("t3", "cosa numero 3", 322, "3", "LA CARA TERMINA EN LA CLAVÍCULA");
  tagAt("jaw", "la cara no termina aqui", 333, PT.chin, "AQUÍ NO", { col: COL.red, dur: 2.6, dx: -330 });
  tagAt("clv", "la cara termina aqui en la clavicula", 336, PT.collar, "AQUÍ", { col: G, dur: 4, size: 70 });
  stamp("lo", "como las sobras", 357, "SOBRAS", { size: 140 });
  rows("5070", [["la cara parece de 50", 362, "CARA: 50", true], ["y el cuello de 70", 362, "CUELLO: 70", false]], 3, 230);
  chip("same", "la misma cantidad para el cuello", 368, "LA MISMA CANTIDAD QUE LAS MEJILLAS", true, 4);

  // ===== 4 · ACEITE DE CAMELIA =====
  title("t4", "cosa numero 4", 378, "4", "ACEITE DE CAMELIA · HACIA DÓNDE VAN LAS MANOS");
  tagAt("tsu", "este es aceite de tsubaki", 383, PT.oil, "TSUBAKI · 椿", { sub: "ACEITE DE CAMELIA", col: COL.amber, dur: 4 });
  big("2d", "dos gotas solo dos", 400, "2 GOTAS", { col: "#ffd9b8", edge: "#5a3a24" });
  tagAt("up", "el frente del cuello voy para arriba", 405, PT.neck, "FRENTE: PARA ARRIBA ↑", { col: G, dur: 4 });
  L.push(<Stopwatch key="sw10" t={t} at={F("despacito 10 veces", 412)} out={F("despacito 10 veces", 412) + 3.6} x={1400} y={300} n={10} unit="×" label="DESPACITO" />);
  quote("pap", "como si alisaras una hoja de papel", 418, "ALISAR PAPEL, NO AMASAR PAN", { size: 74 });
  tagAt("dn", "desde detras de la oreja voy para abajo", 427, null, "COSTADOS: PARA ABAJO ↓", { col: COL.amber, dur: 4 });
  rows("dir", [["detras de la oreja para abajo", 437, "DETRÁS DE LA OREJA → ABAJO", true], ["el frente del cuello para arriba", 437, "EL FRENTE → ARRIBA", true]], 3);
  tagAt("jar", "en frascos preciosos", 445, null, "CARAS · FRASCOS PRECIOSOS", { col: COL.amber, dur: 3.4 });
  quote("hab", "son las costumbres alrededor del frasco", 460, "SON LAS COSTUMBRES ALREDEDOR DEL FRASCO", { col: G, size: 70 });
  { const a = F("tu papada de pavo va a", 465); L.push(<Chip key="10d" t={t} at={a - 1.2} out={a + 2.5} text="«10 DÍAS = PAPADA ARRIBA»" />); }
  stamp("no", "no yo hice esto", 474, "NO.", { size: 200, y: 460, dur: 2.2 });
  rows("does", [["la piel se queda suave", 480, "SE QUEDA SUAVE", true], ["hidratada", 480, "HIDRATADA", true], ["dejas de tirarla para abajo", 480, "DEJAS DE TIRARLA PARA ABAJO", true]], 3);
  chip("nm", "no es magia", 487, "NO ES MAGIA. NO TE QUIERO MENTIR.", false, 3.4);

  // ===== 5 · EL PROTECTOR NO TERMINA EN LA BARBILLA =====
  title("t5", "cosa numero 5", 491, "5", "EL PROTECTOR NO TERMINA EN LA BARBILLA");
  chip("one", "si solo haces una", 497, "SI HACES UNA SOLA, HAZ ESTA", true, 3.6);
  big("40y", "durante 40 anos", 503, "40 AÑOS DE SOL", { col: "#ffd27a", edge: "#5a4500" });
  rows("2age", [["se veia mas vieja", 505, "AL SOL: MÁS VIEJA", false], ["se veia mas joven", 509, "EN LA SOMBRA: MÁS JOVEN", true]], 3);
  quote("2a", "dos edades distintas", 513, "EL MISMO CUELLO. DOS EDADES.", { size: 84 });
  rows("ss", [["y despues baja por el cuello", 523, "CARA → CUELLO", true], ["los costados la nuca", 524, "COSTADOS + NUCA", true], ["la parte de arriba del pecho", 526, "ARRIBA DEL PECHO", true]], 2.6, 220);
  chip("cl", "aunque este nublado", 530, "NUBLADO · INVIERNO · CADA MAÑANA", true, 3.4);
  tagAt("hg", "la sombrilla para el sol", 536, null, "HIGASA · 日傘", { sub: "LA SOMBRILLA PARA EL SOL", col: COL.amber, dur: 4 });
  quote("why", "por esto", 546, "POR ESTO.", { size: 100 });
  tagAt("shd", "solo dale un poco de sombra", 550, PT.neck, "PAÑUELO · CUELLO ALTO · SOMBRA", { col: G, dur: 3.6 });

  // ===== 6 · EL CELULAR ARRIBA =====
  title("t6", "cosa numero 6", 556, "6", "SUBE EL CELULAR A LA ALTURA DE LOS OJOS");
  quote("hlp", "el celular ayuda a hacerlo", 563, "EL CELULAR AYUDA A HACERLO", { col: "#ff8a7a", size: 80 });
  tagAt("bend", "pliega siempre en el mismo lugar", 578, PT.chin, "SE DOBLA SIEMPRE EN EL MISMO LUGAR", { col: COL.red, dur: 4 });
  rows("hrs", [["una hora dos horas", 580, "1 HORA · 2 HORAS · 3 HORAS", false], ["todos los dias", 583, "TODOS LOS DÍAS", false]], 3);
  tagAt("smn", "cuello de celular", 590, null, "SUMAHO-KUBI · スマホ首", { sub: "CUELLO DE CELULAR", col: COL.amber, dur: 4 });
  tagAt("eye", "con las dos manos aqui arriba", 600, PT.head, "A LA ALTURA DE LOS OJOS", { col: G, dur: 3.6, dx: -330 });
  big("1000", "mil veces al dia", 608, "1.000 VECES AL DÍA", { col: "#ff8a7a", edge: "#4a0c08" });
  chip("tdy", "pruebalo hoy", 612, "PRUÉBALO HOY", true, 3.2);
  tagAt("dct", "con dos diccionarios viejos", 633, PT.dicts, "DOS DICCIONARIOS VIEJOS", { col: COL.amber, dur: 4 });
  quote("ntd", "solo no cansado", 645, "«NO MÁS JOVEN. SÓLO NO CANSADO.»", { size: 72 });

  // ===== 7 · ALMOHADA BAJA =====
  title("t7", "cosa numero 7", 650, "7", "UNA ALMOHADA BAJA");
  tagAt("8h", "la barbilla contra el pecho", 660, PT.pillow, "BARBILLA AL PECHO · 8 HORAS", { col: COL.red, dur: 4 });
  tagAt("sbk", "trigo sarraceno", 670, null, "SOBAKAWA · そば殻", { sub: "CÁSCARA DE TRIGO SARRACENO", col: COL.amber, dur: 4 });
  tagAt("str", "mantiene el cuello derecho", 680, PT.pillow, "DERECHO, EN LÍNEA CON LA ESPALDA", { col: G, dur: 4 });
  chip("onep", "saca una almohada", 686, "SACA UNA ALMOHADA", true, 3.4);
  tagAt("rt", "una toalla chiquita enrollada", 692, PT.pillow, "UNA TOALLITA ENROLLADA", { col: G, dur: 4, dx: -330 });

  // ===== 8 · BESO AL TECHO =====
  title("t8", "cosa numero 8", 706, "8", "DALE UN BESO AL TECHO");
  rows("kc", [["sientate derecha", 713, "SIÉNTATE DERECHA", true], ["los hombros abajo", 714, "HOMBROS ABAJO", true], ["despacito mira al techo", 716, "MIRA ARRIBA · LABIOS ADELANTE", true]], 2.6);
  L.push(<Stopwatch key="sw5" t={t} at={F("aguanta", 724)} out={F("aguanta", 724) + 4} x={1400} y={300} n={5} unit="SEG" label="AGUANTA" />);
  tagAt("frn", "sientes el frente del cuello", 726, PT.neck, "EL FRENTE TRABAJA", { col: G, dur: 3.4 });
  big("10x", "diez veces en la manana", 728, "10× CADA MAÑANA", { col: G, edge: "#0b3a22" });
  tagAt("tng", "pongo la lengua plana", 740, null, "LENGUA AL PALADAR · TRAGAS", { col: COL.amber, dur: 4.4 });
  chip("bus", "nadie te ve hacerlo", 750, "NADIE TE VE HACERLO", true, 3.4);
  chip("hon", "el ejercicio no quita la piel suelta", 754, "NO QUITA LA PIEL SUELTA", false, 4);
  quote("awk", "mas firme mas despierto", 760, "MÁS FIRME · MÁS DESPIERTO", { col: G, size: 84 });

  // ===== 9 · LA NUCA =====
  title("t9", "cosa numero 9", 774, "9", "MUESTRA TU NUCA COMO MI ABUELA", 4.6);
  tagAt("unj", "decimos", 786, PT.nape, "UNAJI · うなじ", { sub: "LA NUCA", col: COL.amber, dur: 4 });
  quote("nf", "no la cara la nuca", 792, "NO LA CARA. LA NUCA.", { size: 84 });
  tagAt("strg", "como si un hilo", 800, PT.head, "UN HILO QUE TIRA PARA ARRIBA", { col: G, dur: 4, dx: -330 });
  quote("obc", "nadie te esta mirando el cuello", 810, "«OBAACHAN, NADIE TE ESTÁ MIRANDO»", { size: 70 });
  quote("ila", "yo me lo estoy mirando", 814, "«YO ME LO ESTOY MIRANDO.»", { col: "#ffd9b8", size: 90 });
  big("91", "tenia 91 anos", 817, "91", { size: 260, y: 430, sub: "LARGO, DERECHO, SIN PLIEGUE", col: "#ffd9b8", edge: "#5a3a24", dur: 4.4 });
  big("10s", "este espejo 10 segundos", 826, "10 SEGUNDOS", { sub: "CADA MAÑANA, ESTE ESPEJO" });

  // ===== REPASO =====
  {
    const R: [string, string][] = [["la toalla tibia dos minutos", "LA TOALLA TIBIA · 2 MIN"], ["agua tibia y presionas", "AGUA TIBIA · PRESIONAS, NUNCA FROTAS"], ["la cara termina en la clavicula", "LA CARA TERMINA EN LA CLAVÍCULA"], ["dos gotas de aceite", "2 GOTAS · FRENTE ARRIBA, COSTADOS ABAJO"], ["protector hasta abajo", "PROTECTOR HASTA ABAJO"], ["el celular a la altura de los ojos", "EL CELULAR A LA ALTURA DE LOS OJOS"], ["una almohada mas baja", "UNA ALMOHADA MÁS BAJA"], ["dale un beso al techo", "UN BESO AL TECHO"], ["muestra tu nuca como mi abuela", "MUESTRA TU NUCA"]];
    let after = F("esas son las nueve", 840);
    const ts = R.map(([ph]) => { const a = F(ph, after); after = a + 0.2; return a; });
    ts.forEach((a, i) => { const out = i < 8 ? ts[i + 1] - 0.1 : a + 3; L.push(<PlaceTitle key={"r" + i} t={t} at={a - 0.6} out={out} n={String(i + 1)} name={R[i][1]} lbl="COSA" />); });
  }
  big("3d", "las haces 3 dias", 880, "3 DÍAS… Y LAS DEJAS", { col: "#ff8a7a", edge: "#4a0c08", dur: 3 });
  rows("pk2", [["la toalla tibia y el protector", 888, "LA TOALLA TIBIA", true], ["y el protector", 888, "EL PROTECTOR", true]], 3.6);
  big("1mo", "durante un mes", 894, "1 MES", { sub: "DESPUÉS SUMAS UNA MÁS", col: G, edge: "#0b3a22" });
  chip("doc", "un bulto una hinchazon", 900, "BULTO · HINCHAZÓN · DOLOR → VE A TU MÉDICO", false, 8);

  // ===== CTA: suscribirse + campanita + UNA pregunta =====
  { const a = F("suscribete al canal", 915); L.push(<Subscribe key="sub" t={t} at={a - 0.3} bell={F("toca la campanita", a)} out={a + 7.5} label="SUSCRIBIRSE" done="SUSCRITO" />); }
  tagAt("nx", "la proxima semana son las manos", 922, null, "LA PRÓXIMA SEMANA: LAS MANOS", { sub: "DESPUÉS DE LAVAR LOS PLATOS…", col: COL.amber, dur: 9 });
  { const a = F("cuentame una cosa en los comentarios", 935); L.push(<Comment key="cm" t={t} at={a} out={F("leo todos los comentarios", a) + 1.6} reply={F("que estabas mirando", a) + 1.2} head="CUÉNTAME EN LOS COMENTARIOS" q="¿Cuándo fue la primera vez que te fijaste en tu cuello?" rs={["En el espejo del auto…", "¡En una videollamada!", "En una foto de mi hija"]} />); }
  quote("ktl", "ve a poner el agua", 946, "PON EL AGUA. ENTIBIA UNA TOALLA.", { size: 72, col: "#ffd9b8" });

  return <AbsoluteFill style={{ background: "#000" }}>{L}</AbsoluteFill>;
};
