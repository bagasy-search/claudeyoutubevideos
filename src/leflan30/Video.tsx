// leflan30 · EL FLAN DE MI MAMÁ (30 min). Motor de chcalab/lepan30/lecaj30 con el mundo de Lety: la FLANERA de aluminio
// (raw: sólo el caramelo -> llena de mezcla -> flan cocido), ocho platos de barro (uno por secreto: al cerrar cada secreto se sirve su flan
// con caramelo), el recetario de Doña Chayo que pasa una hoja por secreto (y la GUÍA, Libro 2 pág. 17, cuando Lety habla de sus libros), el fogón.
// La línea de tiempo sale de plan.json (plan_lety.py): ventanas del avatar + en cada hueco el mundo y la foto/clip de ESE párrafo.
// Cada pieza nace con su palabra (at()).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PLATES, screenOf, camSpeed, setKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import PLAN from "./plan.json";
import { BigNum, CH, Flash, HAND, P, Portal, SERIF, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Pensado, Palomita, Stamp, Precio, Pill, Lista } from "./comp";
import * as X from "./piezas";
import { CamaraMano } from "../kits/camara/CamaraMano";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = (AVW as { win: Win[] }).win;
const REEL_DUR = (AVAIL as { reelDur?: number }).reelDur ?? 1e9; // si el reel volvió corto, las ventanas sin cara caen al mundo
const sinCara = (w: Win) => w.off + (w.me - w.ms) > REEL_DUR + 0.5;
const inAv = (t: number) => REEL && WIN.some((w) => !sinCara(w) && t >= w.ms && t < w.me);
export const END_T = (PLAN as { end: number }).end; // voz + 1 s de silencio
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string };
const PARTS: Part[] = (PLAN as { parts: Part[] }).parts;
const PAR = (PLAN as { par: { i: number; tag: string; t: number }[] }).par;
const PT0 = (i: number) => (PAR.find((p) => p.i === i)?.t ?? 0) - 1.5;
export const MISS: string[] = [];
const A = (ph: string, i: number) => { try { return at(ph, PT0(i)); } catch { MISS.push(`${i}: ${ph}`); return NaN; } };

const PAG = "Libro 2 · pág. 17";
const GUIA_NOM = "LOS POSTRES DE RANCHO DE LETY";

// ---------------- cámaras con nombre ----------------
type Cam = { p: V; l: V; fov?: number };
const CZ = PT.cazuela;
const C: Record<string, Cam> = {
  top: { p: [0, 3.6, 0.95], l: [0, 0.8, 0.12], fov: 40 }, topB: { p: [0.18, 3.95, 1.0], l: [0, 0.8, 0.12], fov: 40 }, topC: { p: [-0.15, 3.35, 0.9], l: [0, 0.8, 0.12], fov: 40 },
  wide: { p: [1.9, 1.95, 2.7], l: [-0.6, 0.8, -1.3], fov: 42 }, wide2: { p: [1.5, 1.9, 2.4], l: [-0.8, 0.8, -1.6], fov: 42 },
  fogon: { p: [-0.55, 1.4, -0.75], l: [-1.3, 0.95, -2.4], fov: 38 }, fogon2: { p: [-0.78, 1.3, -1.05], l: [-1.3, 0.8, -2.4], fov: 38 },
  comal: { p: [-0.55, 1.9, -0.7], l: [-1.3, 0.94, -2.5], fov: 32 }, comal2: { p: [-0.75, 1.75, -1.0], l: [-1.3, 0.94, -2.5], fov: 30 },
  caz: { p: [0.85, 1.48, 1.2], l: CZ, fov: 36 }, caz2: { p: [0.55, 1.32, 0.6], l: CZ, fov: 33 }, cazL: { p: [-0.9, 1.45, 1.0], l: CZ, fov: 36 }, cazL2: { p: [-0.6, 1.35, 0.7], l: CZ, fov: 34 },
  cazT: { p: [0.32, 1.78, 0.6], l: [0, 0.92, -0.17], fov: 30 }, cazT2: { p: [0.24, 1.64, 0.46], l: [0, 0.92, -0.17], fov: 28 },
  libro: { p: [1.12, 1.42, 0.28], l: [0.88, 0.82, -0.3], fov: 34 }, libro2: { p: [1.0, 1.2, 0.02], l: [0.88, 0.82, -0.3], fov: 30 },
  salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
};
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!] ?? C.caz, k1 = C[p.k1!] ?? C.caz2;
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partIdx = (t: number) => { let lo = 0, hi = PARTS.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (t < PARTS[m].a) hi = m - 1; else if (t >= PARTS[m].b) lo = m + 1; else return m; } return -1; };

// ---------------- el recetario de Doña Chayo: una hoja por secreto ----------------
const RECETARIO = [
  { l: ["# Flan de rancho", "de mi mamá, Doña Chayo", "", "el sábado en la tarde,", "se come el domingo.", "", "El flan no es pastel:", "el flan es paciencia."], r: ["1. el caramelo", "2. la leche tibia", "3. el huevo", "4. el colado", "5. el baño maría", "6. el horno", "7. el punto", "8. la noche"] },
  { l: ["# 1. El caramelo", "en el mismo molde", "1 taza de azúcar sola", "fuego bajito"], r: ["no se mueve:", "se gira el molde", "", "se apaga en color", "de miel oscura"] },
  { l: ["# 2. La leche", "3 tazas, ENTERA", "¾ taza de azúcar", "rajita de canela"], r: ["5 min a fuego bajito", "", "se echa TIBIA:", "ni caliente", "ni fría"] },
  { l: ["# 3. El huevo", "6 huevos", "½ taza de leche", "por cada huevo"], r: ["con tenedor,", "sin espuma", "", "licuadora: bajita,", "20 segundos"] },
  { l: ["# 4. El colado", "colador fino,", "una o dos veces"], r: ["se echa despacito,", "pegado al borde", "", "burbujitas:", "con un palillo"] },
  { l: ["# 5. Baño maría", "agua CALIENTE", "hasta la MITAD", "del molde"], r: ["tapado con", "aluminio", "", "la charola al horno", "primero, el agua después"] },
  { l: ["# 6. El horno", "160 grados", "precalentado"], r: ["60 a 70 minutos", "", "sin abrirlo", "ni una vez"] },
  { l: ["# 7. El punto", "orillas firmes,", "el centro tiembla", "como gelatina"], r: ["una moneda grande", "que tiembla", "", "se termina de", "cuajar solo"] },
  { l: ["# 8. La noche", "1 hora afuera", "y al refri tapado", "8 horas, 12 mejor"], r: ["el caramelo", "se hace salsa", "", "plato hondito,", "de un solo golpe"] },
];
const GUIA = [
  { l: ["# Los Postres de", "# Rancho de Lety", "", "Libro 2", "El Flan y la Cajeta", "del Rancho", "", "140 postres"], r: ["el flan de rancho ..... 17", "el napolitano ........ 18", "el de queso ........... 19", "el de cajeta ......... 20", "café de olla, coco", "y elote ............ 21", "", "la tabla de huevos"] },
  { l: ["# Flan de Rancho", "# de Doña Chayo", "pág. 17", "", "3 tazas de leche entera", "6 huevos", "1 ¾ taza de azúcar", "canela y vainilla"], r: ["el flan entero: $75", "en la pastelería: $280", "", "la rebanada:", "$6 contra $35", "", "un flan al mes:", "+$200 de ahorro"] },
];

// ---------------- tiempos clave ----------------
const SEC = [10, 16, 21, 28, 31, 36, 46, 54]; // párrafo donde empieza cada secreto
const FLIP = SEC.map((i) => A("secreto numero", i));
const SERVE = [16, 21, 27, 31, 36, 40, 50, 59].map((i) => PT0(i) - 1.5);
const PROM = [A("el caramelo que no se quema", 4), A("la leche y por que", 4), A("el huevo y el error", 4), A("el colado", 4), A("el bano maria que", 4), A("el horno el punto", 4), A("el punto como saber", 4), A("el ultimo el que decide", 4)];
const RES = [A("1 el caramelo en el molde", 83), A("2 la leche entera", 83), A("3 los huevos media taza", 83), A("4 colar una o dos", 83), A("bano maria con agua caliente", 84), A("6 horno a 160", 84), A("7 el punto orillas", 84), A("8 la noche en el refri", 84)];
const ROT = ["el caramelo", "leche tibia", "el huevo", "el colado", "baño maría", "el horno", "el punto", "la noche"];
const nz = (x: number, d: number) => (Number.isFinite(x) ? x : d);
const GV: [number, number, number][] = [[PT0(8) + 1.5, PT0(10) + 1.5, 1], [PT0(78) + 1.5, PT0(80) + 1.5, 1]];
const guiaAt = (t: number) => GV.find((v) => t >= v[0] - 0.05 && t < v[1] + 0.05);
const NOCHE: [number, number][] = [[PT0(55) + 6, PT0(56) + 4]];

const worldAt = (t: number): WorldProps => {
  const gv = guiaAt(t), i = partIdx(t), k0 = (i >= 0 ? PARTS[i].k0 : undefined) ?? "caz";
  const plateServed = PLATES.map((_, k) => win(t, SERVE[k], SERVE[k] + 1.2));
  const plateOn = PLATES.map((_, k) => Math.max(
    win(t, nz(PROM[k], 95 + k * 3), nz(PROM[k], 95 + k * 3) + 0.3) * (1 - win(t, PT0(5), PT0(5) + 0.3)),
    win(t, SERVE[k] - 0.4, SERVE[k]) * (1 - win(t, SERVE[k] + 3, SERVE[k] + 4)),
    win(t, nz(RES[k], PT0(83) + 4 + k * 3), nz(RES[k], PT0(83) + 4 + k * 3) + 0.3) * (1 - win(t, PT0(85), PT0(85) + 0.3)),
  ));
  // la flanera: sólo el caramelo al fondo (secretos 1-3), se llena con el colado (4), se cuece en el horno (5-7) y queda dorado
  const raw = t < PT0(29) ? 0 : t < PT0(36) ? 0.3 * ei(t, PT0(29), PT0(31)) : t < PT0(46) ? 0.3 + 0.7 * ei(t, PT0(38), PT0(46)) : 1;
  const ny = NOCHE.reduce((m, [a, b]) => Math.max(m, win(t, a, a + 2) * (1 - win(t, b - 2, b))), 0);
  const bk = gv ? { open: ei(t, gv[0], gv[0] + 1.0), flip: gv[2] * ei(t, gv[0] + 0.3, gv[0] + 1.2), pages: GUIA }
    : { open: 1, flip: FLIP.reduce((acc, f) => acc + (Number.isFinite(f) ? ei(t, f, f + 0.9) : 0), 0), pages: RECETARIO };
  return {
    t, night: ny,
    fire: t >= PT0(10) && t < PT0(16) ? 0.7 : 1,
    steamCaz: raw > 0.3 && raw < 1 ? 0.6 : 0.15,
    steamComal: /^comal/.test(k0) ? 0.15 : 1,
    ojitos: 0,
    plateOn, plateServed, plateSteam: plateServed.map(() => 0), plateFill: PLATES.map(() => (t < PT0(4) ? 1 : 0)),
    book: bk, guia: gv ? 1 : 0,
    partyPeople: 0, patioLights: ny,
    chiles: 0, toast: 0, burnt: 0, sarten: 0, fry: 0, charola: 0, remojo: 0, tapa: 0, aguaLimon: 0, especias: 0, verduras: 0,
    raw, smoke: 0,
    top: k0.startsWith("top") ? 1 : 0,
  };
};
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <CamaraMano intensidad={0.8} seed={3}><AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} /></AbsoluteFill></CamaraMano>
    </AbsoluteFill>
  );
};
const Avatar: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    {WIN.map((wn, i) => Math.abs(t - wn.ms) < 30 || (t >= wn.ms && t < wn.me) ? (
      <Sequence key={i} from={s(wn.ms) - 10} durationInFrames={s(wn.me - wn.ms) + 12} layout="none">
        <AbsoluteFill style={{ opacity: t >= wn.ms - 0.02 && t < wn.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      </Sequence>) : null)}
  </AbsoluteFill>
);
const Clip: React.FC<{ k: string; t: number; a: number; i: number; d?: number }> = ({ k, t, a, i, d = 6 }) => {
  // tomas LTX de Lety (pNN u-z, ~9 s, 25-oct): velocidad real; las de agnes (3 s) en cámara lenta
  const pr = /[u-z]$/.test(k) ? Math.min(1, 8.6 / Math.max(0.1, d)) : Math.max(0.4, Math.min(1, 2.9 / Math.max(0.1, d)));
  const z = i % 3 === 0 ? [1.03, 1.11] : i % 3 === 1 ? [1.1, 1.03] : [1.06, 1.06];
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7), dx = i % 3 === 2 ? (i % 2 ? -1 : 1) * 30 * (e(t, a, a + 7) - 0.5) : 0;
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} playbackRate={pr} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano intensidad={0.6} seed={i}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${dx}px)` }}>{inner}</AbsoluteFill></CamaraMano></AbsoluteFill>;
};

// QR a la landing (URL corta), nunca la URL escrita
const QR: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * e(t, at, at + 0.4)}) rotate(2deg)`, background: "#fbf6ee", borderRadius: 22, padding: "22px 22px 16px", boxShadow: "0 30px 60px rgba(0,0,0,.6)", textAlign: "center", width: 380 }}>
    <Img src={staticFile(P + "qr.png")} style={{ width: 336, height: 336, imageRendering: "pixelated" }} />
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.tinta, lineHeight: 1 }}>escanea con la cámara</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 22, color: CH.guinda, marginTop: 6 }}>{GUIA_NOM}</div>
  </div>;
};

// ---------------- las piezas, cada una clavada a su palabra ----------------
const sc = (t: number, q: V) => screenOf(t, q);
type F = (a: number, o: number) => React.ReactNode;
const OV: [number, string, number, F][] = [];
const ov = (i: number, ph: string, d: number, f: F) => OV.push([i, ph, d, f]);
let TT = 0;
const H = X.H;
const card = (x: number, y: number, top: string, sub?: string, col: string = CH.maiz, from: "left" | "right" | "pop" = "right") => (a: number, o: number) =>
  <X.Card t={TT} at={a} out={o} x={x} y={y} from={from} col={col}><H s={50} c={col}>{top}</H>{sub && <H s={44} f={HAND}>{sub}</H>}</X.Card>;
const cita = (text: string, who = "MI MAMÁ", size = 84) => (a: number, o: number) => <><X.Fondo o={0.42 * e(TT, a, a + 0.5) * (1 - e(TT, o - 0.4, o))} /><X.Cita t={TT} at={a} out={o} x={960} y={500} text={text} who={who} size={size} w={1300} /></>;
const tagOlla = (text: string, sub?: string) => (a: number, o: number) => { const p = sc(TT, CZ); return <Tag t={TT} at={a} x={p.x} y={p.y} dx={320} dy={-230} text={text} sub={sub} col={CH.maiz} out={o} size={52} />; };
const tag = (text: string, sub?: string, col: string = CH.maiz) => (a: number, o: number) => <Tag t={TT} at={a} x={980} y={560} dx={Math.max(60, Math.min(300, 1850 - 980 - text.length * 36))} dy={-240} text={text} sub={sub} col={col} out={o} size={54} />;
const stamp = (text: string, size = 84, col?: string) => (a: number, o: number) => <Stamp t={TT} at={a} out={o} text={text} x={1380} y={290} size={size} col={col} />;
const pill = (text: string, col?: string) => (a: number, o: number) => <Pill t={TT} at={a} out={o} x={1400} y={260} text={text} col={col} />;
const pens = (text: string, size = 88) => (a: number, o: number) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text={text} size={size} />;
const palo = (text: string) => (a: number, o: number) => <Palomita t={TT} at={a} out={o} y={240} text={text} />;
const precio = (top: string, sub: string, x = 1440) => (a: number, o: number) => <Precio t={TT} at={a} out={o} x={x} y={150} top={top} sub={sub} />;
const big = (text: string, sub: string, col: string = CH.maiz) => (a: number, o: number) => <BigNum t={TT} at={a} text={text} size={150} y={860} col={col} edge="#5a2a10" out={o} sub={sub} />;
const crono = (mins: number, label: string) => (a: number, o: number) => <X.Cronometro t={TT} at={a} out={o} x={1450} y={430} mins={mins} label={label} />;
const vs = (aa: string, bb: string, rows: [string, boolean, boolean][]) => (a: number, o: number) => <X.Versus t={TT} at={a} out={o} x={960} y={560} a={aa} b={bb} rows={rows} w={960} />;
const fix = (prob: string, f: string) => (a: number, o: number) => <X.FixCard t={TT} at={a} out={o} x={1420} y={460} prob={prob} fix={[f]} fixAt={a + 2.5} />;
const onoma = (text: string) => (a: number, o: number) => <X.Onoma t={TT} at={a} out={o} x={1350} y={300} text={text} col="#ffcf6a" />;
const nota = (lines: string[]) => (a: number, o: number) => <Nota t={TT} at={a} out={o} x={1480} y={300} lines={lines} rot={-3} w={520} />;
const lista = (i: number, rows: [string, string][]) => (a: number, o: number) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={rows.map(([tx, ph], k) => [tx, k === 0 ? a : nz(A(ph, i), a + 2 * k)] as [string, number])} />;
const senales = (i: number, title: string, rows: [string, string][]) => (a: number, o: number) => <X.Senales t={TT} out={o} x={1420} y={420} title={title} rows={rows.map(([tx, ph], k) => ({ at: k === 0 ? a : nz(A(ph, i), a + 2 * k), text: tx }))} />;

// ===== GANCHO =====
ov(0, "mira como tiembla", 4, tag("MIRA CÓMO TIEMBLA", "LISO COMO ESPEJO"));
ov(0, "sin un solo hoyito", 4, palo("SIN UN SOLO HOYITO"));
ov(0, "como cascada", 4, tagOlla("EL CARAMELO, EN CASCADA"));
ov(0, "en tres cosas", 5, big("3 COSAS", "QUE LAS PASTELERÍAS NO TE DICEN"));
ov(1, "el cumpleanos de tu mama", 4, card(1440, 280, "EL CUMPLEAÑOS", "de tu mamá"));
ov(1, "hasta que hizo espuma", 4, onoma("¡BRRRRR!"));
ov(1, "bien caliente", 4, (a, o) => <X.FuegoNivel t={TT} at={a} out={o} x={1450} y={460} lvl={3} label="HORNO BIEN CALIENTE" />);
ov(2, "lleno de hoyos", 4, stamp("LLENO DE HOYOS", 90));
ov(2, "como queso suizo", 4, pill("COMO QUESO SUIZO"));
ov(2, "aguado en el centro", 5, vs("EL CENTRO", "LAS ORILLAS", [["aguado", true, false], ["duro", false, true]]));
ov(2, "pegado en el molde como piedra", 4, stamp("EL CARAMELO, COMO PIEDRA", 62));
ov(2, "es mas cremoso", 4, pens("…el de la pastelería es más cremoso", 72));
ov(3, "pagaste 280 pesos", 5, precio("$280", "EL NAPOLITANO, EN LA PASTELERÍA"));
ov(3, "te cuesta 75", 5, precio("$75", "EN TU CASA", 470));
ov(3, "no fue tu culpa", 4, palo("NO FUE TU CULPA"));
ov(3, "justo lo contrario", 4, stamp("TE ENSEÑARON AL REVÉS", 66));
// ===== PROMESA =====
ov(4, "8 secretos del flan", 5, big("8 SECRETOS", "DEL FLAN DE MI MAMÁ"));
ov(4, "el que decide que salga cremoso", 4, card(1420, 300, "EL Nº 8", "el que decide todo", "#ff8a6a"));
ov(5, "los 5 errores", 4.5, pill("+ LOS 5 ERRORES DE SIEMPRE"));
ov(5, "el flan napolitano", 4.5, pill("+ EL NAPOLITANO Y SU SECRETO", CH.maiz));
ov(5, "cuanto te sale de verdad", 4, pill("+ LA CUENTA DE VERDAD"));
// ===== LETY + CTA 1 =====
ov(6, "yo soy leti", 5, (a, o) => <LowerThird t={TT} at={a} out={o} name="LETY" l2="LA HIJA DE DOÑA CHAYO" l2at={a + 2} />);
ov(6, "un rancho de michoacan", 5, (a, o) => <X.MapaMich t={TT} at={a} out={o} x={1460} y={500} />);
ov(6, "toda abollada", 4.5, tag("LA FLANERA ABOLLADA", "DE LA ABUELITA"));
ov(6, "al horno de lena", 4, card(1440, 280, "EL HORNO DE LEÑA", "cuando ya se apagaba"));
ov(6, "por raspar el caramelo", 4, palo("EL PREMIO: RASPAR EL MOLDE"));
ov(7, "tres veces seguidas", 4, stamp("3 VECES SEGUIDAS", 80));
ov(7, "y el flan no es pastel", 5, cita("El flan no es pastel. El flan es paciencia."));
ov(8, "los postres de rancho de leti", 6, (a, o) => <X.Card t={TT} at={a} out={o} x={470} y={170} from="left" col="#ff8fbf"><H s={44} c="#ff8fbf">{GUIA_NOM}</H></X.Card>);
ov(8, "son 140 postres", 4, pill("140 POSTRES DE RANCHO", CH.maiz));
ov(8, "en la pagina 17", 7, (a, o) => <X.GuiaPag t={TT} at={a + 0.3} out={o} x={1520} y={220} pag={PAG} text="el flan de rancho de mi mamá" />);
ov(8, "7 flanes distintos", 4, pill("7 FLANES, LA MISMA REGLA"));
ov(9, "te sale en 6 pesos", 5, precio("$6", "LA REBANADA, EN TU CASA", 960));
ov(9, "en la pasteleria 35", 5, precio("$35", "EN LA PASTELERÍA", 470));
ov(9, "contra 280 en la pasteleria", 5, vs("PASTELERÍA", "EN TU CASA", [["$280 el flan", true, false], ["$75 el flan", false, true]]));
ov(9, "mas de 200 pesos al mes", 5, (a, o) => <X.Cifra t={TT} at={a} out={o} x={960} y={520} to={200} pre="+$" sub="AL MES, SÓLO CON EL FLAN" col={CH.maiz} />);
ov(9, "el link esta", 8, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(9, "el link esta", 8, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
// ===== 1 · EL CARAMELO =====
ov(10, "secreto numero 1", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={1} text="EL CARAMELO" />);
ov(10, "directo en el molde", 4.5, tagOlla("DIRECTO EN EL MOLDE", "NADA DE OLLITA APARTE"));
ov(10, "sola sin agua", 4.5, card(1440, 280, "1 TAZA DE AZÚCAR", "sola, sin agua"));
ov(10, "a fuego bajito", 4, (a, o) => <X.FuegoNivel t={TT} at={a} out={o} x={1450} y={460} lvl={1} label="FUEGO BAJITO" />);
ov(11, "no se mueve nada", 4.5, stamp("NO SE MUEVE NADA", 84));
ov(11, "te queda como arena", 4, stamp("CON CUCHARA: ARENA", 70));
ov(11, "un charquito transparente", 4.5, tagOlla("UN CHARQUITO TRANSPARENTE"));
ov(12, "lo giras despacito", 4.5, palo("SE GIRA EL MOLDE, DESPACITO"));
ov(12, "mover con cuchara no", 4, stamp("¿CUCHARA? NO", 90));
ov(12, "el color primero es como agua", 8, senales(12, "EL COLOR", [["como agua", ""], ["amarillito", "luego amarillito"], ["dorado", "luego dorado"], ["miel oscura: ¡ya!", "color de miel oscura"]]));
ov(13, "y en ese color apagas", 4.5, big("SE APAGA", "EN COLOR DE MIEL OSCURA"));
ov(13, "se te pasa a negro", 4, stamp("SE PASA A NEGRO: AMARGO", 64));
ov(13, "un poquito antes de que te guste", 5, cita("El caramelo se apaga un poquito antes de que te guste."));
ov(14, "cubra todo el fondo", 4.5, tagOlla("TODO EL FONDO Y TANTITO LOS LADOS"));
ov(14, "duro como vidrio", 4, onoma("¡CRACK!"));
ov(14, "se hace la salsita", 4, palo("EN EL HORNO SE HACE SALSITA"));
ov(15, "el caramelo quema", 4.5, stamp("QUEMA MÁS QUE EL ACEITE", 66, "#ff6a4a"));
ov(15, "nunca lo pruebes con el dedo", 4, pill("NUNCA LO PRUEBES CON EL DEDO", "#ff8a6a"));
ov(15, "con ninos cerca", 4, card(1440, 280, "NIÑOS, LEJOS", "de la estufa"));
// ===== 2 · LA LECHE =====
ov(16, "secreto numero 2", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={2} text="LA LECHE" />);
ov(16, "3 tazas de leche entera", 4.5, big("3 TAZAS", "DE LECHE ENTERA"));
ov(16, "con leche light", 4.5, vs("LIGHT", "ENTERA", [["aguadito", true, false], ["cremoso", false, true]]));
ov(16, "la deslactosada no", 4, stamp("DESLACTOSADA: NO", 80));
ov(17, "una rajita de canela", 5, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["3 tazas de leche", a - 2], ["¾ taza de azúcar", a - 1], ["rajita de canela", a]]} />);
ov(17, "la hervia 5 minutos", 4.5, crono(5, "A FUEGO BAJITO"));
ov(18, "que se entibie", 4.5, big("TIBIA", "ESTE ES EL SECRETO Nº 2"));
ov(18, "como para darle a un bebe", 4.5, card(1440, 280, "COMO PA' UN BEBÉ", "metes el dedo y aguantas"));
ov(19, "recien hervida sobre los huevos", 4.5, stamp("CALIENTE: SE CUECE EL HUEVO", 60));
ov(19, "se hacen hebritas", 4, tag("HEBRITAS DE HUEVO", "GRUMITOS COCIDOS"));
ov(19, "como arenoso en la boca", 4, pill("GRANULOSO, EN VEZ DE LISO", "#ff8a6a"));
ov(20, "y si la echas fria", 4.5, stamp("¿FRÍA? TAMPOCO", 80));
ov(20, "tibia ni caliente ni fria", 6, vs("CALIENTE / FRÍA", "TIBIA", [["grumos / disparejo", true, false], ["liso y parejo", false, true]]));
// ===== 3 · EL HUEVO =====
ov(21, "secreto numero 3", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={3} text="EL HUEVO" />);
ov(21, "van 6 huevos", 4, card(1440, 280, "6 HUEVOS", "para 3 tazas de leche"));
ov(21, "por cada huevo media taza", 6, big("1 HUEVO = ½ TAZA", "LA REGLA DE MI MAMÁ"));
ov(21, "8 huevos 4 tazas", 4, pill("8 HUEVOS → 4 TAZAS", CH.maiz));
ov(22, "se te desparrama", 4, stamp("MÁS LECHE: SE DESPARRAMA", 60));
ov(22, "sale duro como tortilla", 4, stamp("MÁS HUEVO: DURO", 74));
ov(22, "una hora antes", 4, palo("HUEVOS FUERA DEL REFRI 1 HORA"));
ov(23, "el error mas grande", 4.5, big("EL ERROR", "MÁS GRANDE DE TODOS", "#ff8a6a"));
ov(23, "a toda velocidad", 4, onoma("¡BRRRRR!"));
ov(23, "esa espuma es la que te hace los hoyos", 5, tag("LA ESPUMA", "= LOS HOYOS"));
ov(24, "con un tenedor", 4.5, card(1440, 280, "CON UN TENEDOR", "despacito, sin espuma"));
ov(24, "nada mas para romper las yemas", 4, palo("SÓLO ROMPER LAS YEMAS"));
ov(24, "en hilito", 4, pill("LA LECHE TIBIA, EN HILITO", CH.maiz));
ov(25, "velocidad baja", 6, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["velocidad baja", a], ["20 segundos", nz(A("20 segundos", 25), a + 1.5)], ["reposa 5 minutos", nz(A("reposar la mezcla 5 minutos", 25), a + 3)], ["quitas la espuma", nz(A("la quitas con una cuchara", 25), a + 4.5)]]} />);
ov(25, "y no te dicen", 4, stamp("LO QUE NO TE DICEN", 72));
ov(26, "una cucharadita de vainilla", 4.5, card(1440, 280, "1 CDITA DE VAINILLA", "de Papantla, al final"));
ov(26, "se le va el aroma", 4, stamp("HIRVIENDO: SE VA EL AROMA", 60));
// ===== RECAP 1 =====
ov(27, "y aguantame tantito", 6, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["caramelo color miel", a + 1], ["leche tibia con canela", a + 2.5], ["huevos sin espuma", a + 4]]} />);
ov(27, "el bano maria y el horno", 4.5, pill("AHORA: BAÑO MARÍA Y HORNO", CH.maiz));
// ===== 4 · EL COLADO =====
ov(28, "secreto numero 4", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={4} text="EL COLADO" />);
ov(28, "un colador fino", 4.5, tagOlla("COLADOR FINO", "DIRECTO SOBRE EL CARAMELO"));
ov(28, "la cuelas dos veces", 4, palo("MÁS LISO: DOS VECES"));
ov(29, "las chalazas", 4.5, card(1440, 280, "LAS CHALAZAS", "los cordoncitos del huevo"));
ov(29, "como manchitas", 4, stamp("SIN COLAR: MANCHITAS", 70));
ov(30, "sobre el reves de una cuchara", 4.5, card(1440, 280, "DESPACITO", "pegado al borde o sobre la cuchara"));
ov(30, "con un palillo", 4, palo("BURBUJITAS: UN PALILLO"));
// ===== 5 · EL BAÑO MARÍA =====
ov(31, "secreto numero 5", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={5} text="EL BAÑO MARÍA" />);
ov(31, "el corazon del flan cremoso", 4.5, big("EL CORAZÓN", "DEL FLAN CREMOSO"));
ov(31, "se cuece dentro de agua", 4.5, tagOlla("SE CUECE DENTRO DE AGUA"));
ov(32, "caliente caliente casi hirviendo", 4.5, stamp("AGUA CALIENTE, CASI HIRVIENDO", 56));
ov(32, "no agua de la llave", 4, pill("NO AGUA DE LA LLAVE", "#ff8a6a"));
ov(32, "se queda crudo por abajo", 4.5, vs("ARRIBA", "ABAJO", [["cocido", true, false], ["crudo", false, true]]));
ov(33, "hasta la mitad del molde", 5, big("HASTA LA MITAD", "NO UN DEDITO"));
ov(33, "nunca pasa de 100 grados", 4.5, card(1440, 280, "EL AGUA: 100 °C", "y el flan se cuece suavecito"));
ov(34, "papel aluminio", 4.5, tag("PAPEL ALUMINIO", "EL TRUCO DE MI MAMÁ"));
ov(34, "esa capita dura", 4, stamp("SIN CAPITA DURA", 80));
ov(34, "un plato extendido", 4, palo("¿SIN ALUMINIO? UN PLATO"));
ov(35, "mete la charola vacia", 5, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["la charola, vacía, al horno", a], ["el molde adentro", a + 1.5], ["el agua, con una jarra", nz(A("con una jarra", 35), a + 3)]]} />);
ov(35, "me queme un brazo", 4, stamp("ME QUEMÉ UN BRAZO", 76, "#ff6a4a"));
// ===== 6 · EL HORNO =====
ov(36, "secreto numero 6", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={6} text="EL HORNO" />);
ov(36, "a 180 a 200 grados", 4.5, (a, o) => <X.FuegoNivel t={TT} at={a} out={o} x={1450} y={460} lvl={3} label="180-200 °C: NO" />);
ov(36, "es una crema de huevo", 5, cita("El flan no es pastel: es una crema de huevo."));
ov(37, "hierve adentro del molde", 4.5, tagOlla("HIERVE: BURBUJAS", "Y AHÍ ESTÁN TUS HOYOS"));
ov(37, "duro como hule", 4, stamp("DURO COMO HULE", 84));
ov(38, "eso es 160 grados", 5, big("160 °C", "PRECALENTADO"));
ov(38, "de 60 a 70 minutos", 5, crono(70, "60-70 MINUTOS"));
ov(39, "ponlo en bajo", 4, card(1440, 280, "¿SIN NÚMEROS?", "ponlo en bajo"));
ov(39, "la puerta entreabierta", 4.5, fix("EL HORNO CALIENTA DE MÁS", "puerta entreabierta con una cuchara de palo"));
ov(39, "cuesta como 80 pesos", 4.5, precio("$80", "EL TERMÓMETRO DE HORNO", 470));
// ===== 5 ERRORES =====
ov(40, "los 5 errores", 4.5, big("5 ERRORES", "LOS QUE VEO EN TODAS LAS COCINAS", "#ff8a6a"));
const ERR: [number, string, string, string][] = [[41, "error numero 1", "1 · LICUAR MUCHO", "20 segundos bajito, o tenedor"], [42, "error numero dos", "2 · ABRIR EL HORNO", "ni una vez antes de 60 min"], [43, "error numero 3", "3 · DESMOLDAR CALIENTE", "primero, que se enfríe"], [44, "error numero 4", "4 · MOLDE MUY GRANDE", "flanera de 20 cm"], [45, "y error numero 5", "5 · AL REFRI CALIENTE", "1 hora afuera, ya tibio al refri"]];
ERR.forEach(([i, ph, prob, f]) => ov(i, ph, 7, (a, o) => <X.FixCard t={TT} at={a} out={o} x={1400} y={460} prob={prob} fix={[f]} fixAt={a + 3} />));
ov(42, "el flan no se mira el flan se espera", 5, cita("El flan no se mira: el flan se espera."));
ov(43, "se te parten pedazos", 4, stamp("SE PARTE EN PEDAZOS", 70));
ov(44, "de dos dedos de alto", 4, stamp("CHAPARRITO: SE SECA", 70));
ov(45, "como sudado y aguado", 4, stamp("SUDADO Y AGUADO", 80));
// ===== 7 · EL PUNTO =====
ov(46, "secreto numero 7", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={7} text="EL PUNTO" />);
ov(46, "nada mas un empujoncito", 4, onoma("¡TOC!"));
ov(47, "si se mueve todo como agua", 9, senales(47, "EL EMPUJONCITO", [["se mueve como ola: le falta", ""], ["firme hasta el centro: se pasó", "si esta firme hasta el centro"], ["orillas firmes, centro tiembla: ¡ya!", "el punto perfecto es este"]]));
ov(47, "una moneda grande", 4, tagOlla("EL CENTRO TIEMBLA", "COMO UNA MONEDA GRANDE"));
ov(48, "ese temblorcito", 4.5, big("EL TEMBLORCITO", "EL QUE TE ASEGURA LO CREMOSO"));
ov(48, "se termina de cuajar solo", 4, palo("SE TERMINA DE CUAJAR SOLO"));
ov(49, "la del cuchillo", 5, card(1440, 280, "LA DEL CUCHILLO", "entre la orilla y el centro"));
ov(49, "si sale limpio ya esta", 4, palo("SALE LIMPIO: YA ESTÁ"));
ov(49, "jamas le hizo un hoyo", 4, pens("…jamás le hizo un hoyo a un flan", 72));
// ===== RECAP 2 + LA CUENTA =====
ov(50, "liso sin hoyos y cremoso", 4.5, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["liso", a], ["sin hoyos", a + 1], ["cremoso", a + 2]]} />);
ov(50, "todavia falta el secreto", 4, pill("FALTA EL Nº 8", "#ff8a6a"));
ov(51, "6 huevos como 20 pesos", 22, (a, o) => <Receipt t={TT} sc={0.72} rows={[
  { at: a, item: "6 huevos", $: 20 }, { at: nz(A("como 22 pesos", 51), a + 3), item: "leche entera, 3 tazas", $: 22 },
  { at: nz(A("como 8 pesos", 51), a + 6), item: "azúcar", $: 8 }, { at: nz(A("unos 25 pesos mas", 51), a + 9), item: "vainilla, canela, gas", $: 25 }]}
  totalAt={nz(A("son como 75 pesos", 52), a + 12)} x={1420} y={140} out={o} title="UN FLAN PARA 10" />);
ov(52, "7 pesos y medio la rebanada", 5, precio("$7.50", "LA REBANADA", 470));
ov(52, "280 contra 75", 6, vs("PASTELERÍA", "EN TU CASA", [["$280", true, false], ["$75", false, true]]));
ov(53, "menos de la tercera parte", 4.5, big("1/3", "DEL PRECIO"));
ov(53, "eso no lo vende nadie", 4, palo("EL CARIÑO NO LO VENDE NADIE"));
// ===== 8 · LA NOCHE =====
ov(54, "secreto numero 8", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={8} text="LA NOCHE" />);
ov(54, "no se come el mismo dia", 4.5, stamp("NO SE COME EL MISMO DÍA", 62));
ov(54, "el sabado en la tarde", 5, vs("SÁBADO", "DOMINGO", [["se hace", true, false], ["se come", false, true]]));
ov(55, "8 horas minimo 12 mejor", 5, crono(720, "8 HORAS MÍNIMO, 12 MEJOR"));
ov(55, "el de un dia despues es crema", 5, vs("EL MISMO DÍA", "AL OTRO DÍA", [["esponjoso", true, false], ["crema", false, true]]));
ov(56, "esta es la magia", 4, onoma("¡MAGIA!"));
ov(56, "se vuelve salsa", 4.5, tagOlla("EL CARAMELO SE HACE SALSA"));
ov(56, "como piedra", 4, stamp("EL MISMO DÍA: PIEDRA", 70));
ov(57, "un cuchillo delgado", 7, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["cuchillo por la orilla", a], ["el fondo en agua caliente", nz(A("en agua caliente", 57), a + 2)], ["el plato boca abajo", nz(A("boca abajo", 57), a + 4)], ["de un solo golpe", nz(A("de un solo golpe", 57), a + 6)]]} />);
ov(57, "se oia el plop", 3.5, onoma("¡PLOP!"));
ov(58, "tiene que ser hondito", 4.5, card(1440, 280, "PLATO HONDITO", "con orilla, no extendido"));
ov(58, "la suerte de la semana", 5, cita("El que se queda con el último pedazo se lleva la suerte de la semana."));
// ===== EL NAPOLITANO =====
ov(59, "el ingrediente escondido", 4.5, big("EL INGREDIENTE", "ESCONDIDO DE LAS PASTELERÍAS"));
ov(59, "queso crema", 4.5, stamp("QUESO CREMA", 110, CH.maiz));
ov(60, "una lata de leche condensada", 8, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["1 lata de condensada", a], ["1 lata de evaporada", nz(A("una lata de leche evaporada", 60), a + 1.5)], ["1 barra de queso crema", nz(A("una barra de queso crema", 60), a + 3)], ["5 huevos", nz(A("5 huevos", 60), a + 4.5)], ["1 cdita de vainilla", nz(A("una cucharadita de vainilla", 60), a + 5.5)]]} />);
ov(60, "nada de azucar en la mezcla", 4, stamp("SIN AZÚCAR EN LA MEZCLA", 62));
ov(61, "el que te deja grumos", 4, pill("EL TRUCO DE LOS GRUMOS", "#ff8a6a"));
ov(61, "una hora antes", 4.5, card(1440, 280, "QUESO SUAVE", "fuera del refri 1 hora"));
ov(61, "como puntitos blancos", 4, stamp("FRÍO: PUNTITOS BLANCOS", 64));
ov(62, "velocidad baja 20 segundos", 4.5, crono(1, "BAJITA, 20 SEGUNDOS"));
ov(62, "unos 80 pesos", 5, precio("$80", "EL NAPOLITANO, EN TU CASA", 470));
ov(62, "ese mismo 280", 4.5, precio("$280", "EN LA PASTELERÍA", 960));
ov(63, "el de queso", 4.5, card(1440, 280, "EL DE QUESO", "el que se acaba primero"));
ov(63, "doble queso crema", 4.5, big("2 BARRAS", "DOBLE QUESO CREMA"));
ov(63, "solo lo verde del limon", 4, palo("SÓLO LO VERDE DEL LIMÓN"));
ov(63, "como pie de queso", 4, tag("DENSO", "COMO PIE DE QUESO"));
// ===== LA KERMÉS =====
ov(64, "habia kermes cada mes", 4.5, card(1440, 280, "LA KERMÉS", "cada mes en la primaria"));
ov(64, "a 10 pesos cada una", 4, precio("$10", "LA REBANADA", 470));
ov(64, "en media hora se acabaron", 4, stamp("EN MEDIA HORA: SE ACABARON", 58));
ov(65, "lleve cuatro y a la siguiente seis", 4.5, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["primera: 2 flanes", a - 2], ["después: 4", a], ["después: 6", a + 1.5]]} />);
ov(65, "mas que la venta de tamales", 4.5, cita("Lety, usted ya juntó más que la venta de tamales.", "LA DIRECTORA", 76));
ov(65, "150 pesos de ganancia limpia", 5, (a, o) => <X.Cifra t={TT} at={a} out={o} x={960} y={520} to={150} pre="+$" sub="LIMPIOS, CON 6 FLANES" col={CH.maiz} />);
ov(66, "a 180", 4.5, precio("$180", "EL FLAN, POR ENCARGO", 470));
ov(66, "sus utiles de la secundaria", 4.5, palo("LOS ÚTILES DE MI HIJO, CON FLANES"));
// ===== FLANECITOS =====
ov(67, "flanecitos en vasitos de aluminio", 5, tag("FLANECITOS", "EN VASITOS DE ALUMINIO"));
ov(67, "no se desbarata", 4, palo("NO SE CORTA, NO SE DESBARATA"));
ov(68, "una cucharadita a cada vasito", 4.5, card(1440, 280, "1 CDITA DE CARAMELO", "en cada vasito, rápido"));
ov(68, "hasta tres cuartos del vasito", 4, pill("LA MEZCLA: ¾ DEL VASITO", CH.maiz));
ov(69, "de 30 a 35 minutos", 4.5, crono(35, "30-35 MIN A 160 °C"));
ov(69, "para 50 personas", 6, (a, o) => <X.Cifra t={TT} at={a} out={o} x={960} y={520} to={375} pre="$" sub="50 FLANECITOS · $7.50 CADA UNO" col={CH.maiz} />);
// ===== EL MOLDE =====
ov(70, "unos ganchitos", 4.5, tag("FLANERA CON TAPA", "Y GANCHITOS A LOS LADOS"));
ov(70, "unos 120 pesos", 4.5, precio("$120", "EN EL MERCADO, PA' TODA LA VIDA", 470));
ov(71, "refractario de vidrio", 4.5, card(1440, 280, "¿VIDRIO?", "revísalo 10 minutos antes"));
ov(71, "un molde de rosca", 4.5, card(1440, 280, "MOLDE DE ROSCA", "se cuece más parejo"));
ov(72, "tantita mantequilla", 4.5, tagOlla("MANTEQUILLA EN LOS LADOS", "NO EN EL FONDO"));
ov(72, "se resbalaba solito", 4, palo("SE RESBALA SOLITO"));
// ===== LO QUE NUNCA =====
ov(73, "nunca lo hacia con prisa", 4.5, stamp("NUNCA CON PRISA", 90));
ov(73, "con el horno fuerte", 4, pill("NUNCA CON EL HORNO FUERTE"));
ov(74, "nunca usaba molde de teflon", 4.5, stamp("NUNCA TEFLÓN", 90));
ov(74, "le ponia maicena", 4.5, stamp("NUNCA MAICENA", 90));
ov(74, "cuaja con puro huevo", 4, palo("CUAJA CON PURO HUEVO"));
// ===== EN CADA CASA =====
ov(75, "en guanajuato le echan cajeta", 4.5, tag("GUANAJUATO", "FLAN DE CAJETA"));
ov(75, "sabe a leche quemada", 4, pens("…sabe a leche quemada", 76));
ov(76, "en veracruz le ponen coco", 4.5, tag("VERACRUZ", "COSTRA DE COCO"));
ov(76, "en los altos de jalisco", 4.5, tag("LOS ALTOS DE JALISCO", "CAFÉ DE OLLA"));
ov(76, "flan de elote", 4.5, tag("EL CENTRO", "FLAN DE ELOTE"));
ov(77, "con la misma regla", 4, palo("TODOS, CON LA MISMA REGLA"));
// ===== CTA 2 =====
ov(78, "en el libro 2", 6, (a, o) => <X.Card t={TT} at={a} out={o} x={470} y={170} from="left" col="#ff8fbf"><H s={44} c="#ff8fbf">{GUIA_NOM}</H></X.Card>);
ov(78, "en la pagina 17", 12, (a, o) => <X.GuiaPag t={TT} at={a + 0.3} out={o} x={1520} y={220} pag="Libro 2 · págs. 17 a 21" text="7 flanes con la misma regla" />);
ov(78, "para 10 20 o 50 personas", 4.5, pill("LA TABLA: 10, 20 O 50 PERSONAS", CH.maiz));
ov(79, "son 140 postres", 4.5, pill("140 POSTRES, CON SUS PESOS", CH.maiz));
ov(79, "ya lo recuperaste", 4.5, palo("CON 2 O 3 POSTRES, YA SE PAGÓ"));
ov(79, "el link esta", 7, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(79, "el link esta", 7, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
// ===== PREGUNTAS =====
ov(80, "se puede hacer sin horno", 5, card(1440, 280, "¿SIN HORNO?", "sí: en olla, baño maría, 1 hora"));
ov(80, "en olla express", 4.5, crono(15, "OLLA EXPRESS: 15 MIN"));
ov(81, "tapado 4 dias", 5, vs("DE RANCHO", "NAPOLITANO", [["4 días", true, false], ["5 días", false, true]]));
ov(81, "2 horas maximo", 4, stamp("FUERA DEL REFRI: 2 H", 70));
ov(81, "se puede congelar", 4.5, stamp("¿CONGELAR? NO", 90));
ov(82, "llevalo en su molde frio", 4.5, card(1440, 280, "¿A UNA FIESTA?", "en su molde, y se desmolda allá"));
ov(82, "cuchillo mojado en agua caliente", 4.5, palo("CUCHILLO EN AGUA CALIENTE"));
// ===== REPASO, CIERRE =====
ov(83, "el repaso completo", 4, palo("LOS 8, PARA APUNTAR"));
ov(85, "liso como espejo", 4.5, tag("LISO COMO ESPEJO", "Y EL CARAMELO EN CASCADA"));
ov(85, "por la tercera parte", 4, precio("1/3", "DEL PRECIO DE LA PASTELERÍA", 470));
ov(86, "de rancho napolitano o de cajeta", 5, card(1400, 300, "¿RANCHO, NAPOLITANO O CAJETA?", "en los comentarios"));
ov(86, "en la primera linea", 7, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(86, "en la primera linea", 7, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
ov(87, "suscribete", 4, card(1400, 300, "SUSCRÍBETE", "viene más de la cocina de mi mamá"));

// cada pieza resuelve su segundo UNA vez
const OVT = OV.map(([i, ph, d, f]) => { const a = A(ph, i); return { a, b: a + d, f }; }).filter((o) => Number.isFinite(o.a));
const Ov = (t: number): React.ReactNode[] => {
  TT = t;
  const L: React.ReactNode[] = [];
  OVT.forEach((o, k) => { if (t >= o.a - 0.4 && t < o.b + 0.6) L.push(<React.Fragment key={"o" + k}>{o.f(o.a, o.b - 0.2)}</React.Fragment>); });
  const lab = (ats: number[], a: number, b: number) => { if (t >= a - 0.4 && t < b + 0.6) PLATES.forEach((q, i) => { if (!Number.isFinite(ats[i])) return; const p = sc(t, q); L.push(<X.PlateLabel key={"pl" + a + i} t={t} at={ats[i] + i * 0.05} out={b - 0.2} x={p.x} y={p.y} n={i + 1} text={ROT[i]} up={i % 2 ? 250 : 130} />); }); };
  lab(PROM, nz(PROM[0], 0), PT0(5));
  lab(RES, nz(RES[0], PT0(83)), PT0(85));
  SERVE.forEach((sv, i) => { if (t >= sv && t < sv + 4.5) { const p = sc(t, PLATES[i]); L.push(<Tag key={"sv" + i} t={t} at={sv + 0.3} x={p.x} y={p.y} dx={240} dy={-210} text={"SECRETO " + (i + 1)} sub={i === 7 ? "LOS OCHO, LISTOS" : "LISTO"} col={CH.maiz} out={sv + 4.2} size={50} />); } });
  return L;
};

// ---------------- EL VIDEO ----------------
export const Video: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const idx = partIdx(t);
  if (inAv(t)) L.push(<CamaraMano key="av" intensidad={0.5} seed={7}><Avatar t={t} /></CamaraMano>);
  else if (idx >= 0) {
    const p = PARTS[idx], pv = PARTS[idx - 1], nx = PARTS[idx + 1];
    if (p.c) {
      const portaled = pv && !pv.c && Math.abs(pv.b - p.a) < 1e-6;
      L.push(<Clip key={"c" + idx} k={p.c} t={t} a={portaled ? p.a - 0.7 : p.a} i={idx} d={p.b - p.a + (portaled ? 0.7 : 0)} />);
    } else {
      L.push(<World key="w" t={t} />);
      if (nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, CZ); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} i={idx + 1} d={nx.b - nx.a + 0.7} /></Portal>); }
      }
    }
  } else L.push(<World key="w0" t={t} />);
  L.push(...Ov(t));
  if (idx >= 0) [idx - 1, idx].forEach((k) => { const p = PARTS[k], nx = PARTS[k + 1]; if (p && nx && Math.abs(nx.a - p.b) < 1e-6 && !(!p.c && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<SteamWipe key={"sw" + k} t={t} mid={p.b} w={0.38} />); });
  FLIP.forEach((a, i) => { if (Number.isFinite(a) && Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
