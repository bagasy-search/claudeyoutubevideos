// lepan30 · EL PAN DE MUERTO DE MI MAMÁ (34 min). Motor de chcalab (Chayo) con el mundo de Lety: la cocina de adobe con la olla de
// barro donde la MASA leva (raw = cuánto levó), diez platos de barro (uno por secreto: al cerrar cada secreto se sirve su pan de muerto),
// el recetario de Doña Chayo que pasa una hoja por secreto (y la GUÍA, Libro 3 pág. 17, cuando Lety habla de sus libros), el fogón.
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
const sinCara = (w: Win) => w.off + (w.me - w.ms) > REEL_DUR + 0.1;
const inAv = (t: number) => REEL && WIN.some((w) => !sinCara(w) && t >= w.ms && t < w.me);
export const END_T = (PLAN as { end: number }).end; // voz + 1 s de silencio
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string };
const PARTS: Part[] = (PLAN as { parts: Part[] }).parts;
const PAR = (PLAN as { par: { i: number; tag: string; t: number }[] }).par;
const PT0 = (i: number) => (PAR.find((p) => p.i === i)?.t ?? 0) - 1.5;
export const MISS: string[] = [];
const A = (ph: string, i: number) => { try { return at(ph, PT0(i)); } catch { MISS.push(`${i}: ${ph}`); return NaN; } };

const PAG = "Libro 3 · pág. 17";
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
  { l: ["# Pan de Muerto", "del rancho", "", "pa'l 31 en la tarde,", "que esté en la ofrenda.", "Con paciencia,", "sin prisa.", "— Chayo"], r: ["1. la esponja", "2. la harina", "3. las yemas", "4. naranja y azahar", "5. el amasado", "6. el primer levado", "7. los huesitos", "8. la 2ª levada", "9. horno y azúcar", "10. la masa duerme"] },
  { l: ["# 1. La esponja", "¼ taza leche tibia", "10 g de levadura", "1 cdita de azúcar", "3 cdas de harina"], r: ["tapada, en lo tibio", "20 a 30 minutos", "", "si no hace burbujas:", "se tira"] },
  { l: ["# 2. La harina", "de pan, la fuerte", "500 g, pesada", "no con taza"], r: ["cernida 2 veces", "", "la masa es pegajosa", "a propósito:", "no más harina"] },
  { l: ["# 3. Las yemas", "3 huevos enteros", "+ 3 yemas", "fuera del refri"], r: ["120 g de mantequilla", "suavecita", "½ taza de leche tibia", "", "las claras: al barniz"] },
  { l: ["# 4. El sabor", "2 naranjas: ralladura", "frotada en el azúcar", "100 g de azúcar"], r: ["1 cda de azahar", "té de anís", "1 cdita de sal", "lejos de la esponja"] },
  { l: ["# 5. El amasado", "todo menos la", "mantequilla", "estirar · doblar · girar"], r: ["a los 10-12 min:", "la mantequilla, en 4", "", "la prueba de", "la ventana"] },
  { l: ["# 6. Primer levado", "al doble", "junto al fogón", "26-28 grados"], r: ["horno apagado", "con la luz prendida", "", "la prueba", "del dedo"] },
  { l: ["# 7. Los huesitos", "⅕ de la masa", "8 bolas de 80 g", "mano de araña"], r: ["delgados como lápiz", "2 dedos: los nudos", "4 en cruz, con agua", "", "la bolita clavada"] },
  { l: ["# 8. La 2ª levada", "45 min a 1 hora", "separados", "una mano"], r: ["50 % más grandes", "no al doble", "", "y prende el horno", "a 180"] },
  { l: ["# 9. El horno", "barniz: huevo y leche", "180 °C · 20-25 min", "15 min sin abrir"], r: ["suena hueco: toc toc", "", "5 minutos fuera", "mantequilla y azúcar", ""] },
  { l: ["# 10. La masa", "duerme", "el 30 en la noche", "1 hora y al frío"], r: ["12 a 14 horas", "el 31 se forma", "", "7 g de levadura", "en vez de 10"] },
];
const GUIA = [
  { l: ["# " + "Los Postres de", "# Rancho de Lety", "", "Libro 3", "El Pan del Rancho", "", "140 postres,", "con lo que cuestan"], r: ["el día del pan,", "hora por hora .... 16", "", "pan de muerto", "de rancho ......... 17", "", "pan de muerto", "de yema .......... 18"] },
  { l: ["# Pan de Muerto", "# de Rancho", "pág. 17", "", "500 g de harina", "120 g de azúcar", "11 g de levadura", "rinde 8 panes"], r: ["sale a $14 el pan", "en la panadería: $55", "", "16 panes:", "$224 contra $880", "", "el truco de Chayo:", "la masa duerme"] },
];

// ---------------- tiempos clave ----------------
const SEC = [10, 15, 20, 25, 32, 38, 48, 54, 62, 75]; // párrafo donde empieza cada secreto
const FLIP = SEC.map((i) => A("secreto numero", i));
const SERVE = [15, 20, 25, 31, 38, 42, 54, 58, 68, 81].map((i) => PT0(i) - 1.5);
const PROM = [A("la esponja que despierta", 5), A("la harina que si", 5), A("cuantas yemas lleva", 5), A("el truco de la naranja", 5), A("como saber que ya amasaste", 5), A("donde se pone a levar", 5), A("como se hacen los huesitos", 5), A("la segunda levada", 5), A("el horno y el ultimo", 5), A("y el ultimo secreto", 5)];
const RES = [A("1 la esponja", 84), A("2 la harina de pan", 84), A("3 tres huevos", 84), A("4 la ralladura", 84), A("amasar sin echarle", 85), A("6 el primer levado", 85), A("7 bolear", 85), A("8 la segunda levada", 85), A("9 horno a 180", 85), A("y 10 la masa", 85)];
const ROT = ["la esponja", "la harina", "las yemas", "naranja y azahar", "el amasado", "1er levado", "los huesitos", "2ª levada", "horno y azúcar", "la masa duerme"];
const nz = (x: number, d: number) => (Number.isFinite(x) ? x : d);
const GV: [number, number, number][] = [[PT0(8) + 1.5, PT0(10) + 1.5, 1], [PT0(73) + 1.5, PT0(75) + 1.5, 1]];
const guiaAt = (t: number) => GV.find((v) => t >= v[0] - 0.05 && t < v[1] + 0.05);
const NOCHE: [number, number][] = [[PT0(1) + 1.5, PT0(2) + 1.5], [PT0(75) + 10, PT0(76) + 8], [PT0(86) + 1.5, PT0(87) + 1.5]];

const worldAt = (t: number): WorldProps => {
  const gv = guiaAt(t), i = partIdx(t), k0 = (i >= 0 ? PARTS[i].k0 : undefined) ?? "caz";
  const plateServed = PLATES.map((_, k) => win(t, SERVE[k], SERVE[k] + 1.2));
  const plateOn = PLATES.map((_, k) => Math.max(
    win(t, nz(PROM[k], 105 + k * 3), nz(PROM[k], 105 + k * 3) + 0.3) * (1 - win(t, PT0(6), PT0(6) + 0.3)),
    win(t, SERVE[k] - 0.4, SERVE[k]) * (1 - win(t, SERVE[k] + 3, SERVE[k] + 4)),
    win(t, nz(RES[k], PT0(84) + 4 + k * 3), nz(RES[k], PT0(84) + 4 + k * 3) + 0.3) * (1 - win(t, PT0(86), PT0(86) + 0.3)),
  ));
  // la masa de la olla: chata hasta el primer levado (secreto 6), dobla; se forma (7) y vuelve a levar (8); duerme (10)
  const raw = t < PT0(38) ? 0.1 : t < PT0(48) ? 0.1 + 0.9 * ei(t, PT0(38) + 4, PT0(42)) : t < PT0(54) ? 0.25 : t < PT0(75) ? 0.25 + 0.5 * ei(t, PT0(55), PT0(57)) : 0.3 + 0.6 * ei(t, PT0(76), PT0(78));
  const ny = NOCHE.reduce((m, [a, b]) => Math.max(m, win(t, a, a + 2) * (1 - win(t, b - 2, b))), 0);
  const bk = gv ? { open: ei(t, gv[0], gv[0] + 1.0), flip: gv[2] * ei(t, gv[0] + 0.3, gv[0] + 1.2), pages: GUIA }
    : { open: 1, flip: FLIP.reduce((acc, f) => acc + (Number.isFinite(f) ? ei(t, f, f + 0.9) : 0), 0), pages: RECETARIO };
  const horno = t >= PT0(62) && t < PT0(68);
  return {
    t, night: ny,
    fire: horno ? 1.7 : 1,
    steamCaz: 0.05,
    steamComal: /^comal/.test(k0) ? 0.15 : 1,
    ojitos: 0,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.15 * v), plateFill: PLATES.map(() => (t < PT0(4) ? 1 : 0)),
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
  const pr = Math.max(0.4, Math.min(1, 2.9 / Math.max(0.1, d)));
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
ov(0, "se levanta solito", 4, tag("SE LEVANTA SOLITO", "ESPONJOSO"));
ov(0, "a naranja y a sahar", 4, (a, o) => <Aroma t={TT} at={a} out={o} x={1180} y={640} />);
ov(0, "con 10 secretos", 5, big("10 SECRETOS", "QUE LAS PANADERÍAS NO TE DICEN"));
ov(1, "31 de octubre", 4.5, (a, o) => <X.Calendario t={TT} at={a} out={o} x={1450} y={430} flipAt={1e9} a="31" b="1" la="OCTUBRE" lb="NOVIEMBRE" />);
ov(1, "el pan lo hago yo", 4, pens("…este año, el pan lo hago yo"));
ov(1, "abres el horno", 3.5, onoma("¿Y…?"));
ov(2, "pesado como piedra", 4, stamp("PESADO COMO PIEDRA", 76));
ov(2, "se le cayeron a un lado", 4, pill("LOS HUESITOS, EN EL SUELO"));
ov(2, "huele a harina cruda", 4, stamp("HUELE A HARINA CRUDA", 70));
ov(3, "55 pesos por un pan", 5, precio("$55", "UN PAN MEDIANO, EN LA PANADERÍA"));
ov(3, "esencia de bote", 4, stamp("ESENCIA DE BOTE", 80));
ov(3, "asi no es", 3.5, palo("NO, MIJA. ASÍ NO ES"));
ov(4, "no fuiste tu", 4, palo("NO FUISTE TÚ"));
ov(4, "nadie te dijo los tiempos", 4.5, card(1440, 280, "NADIE TE DIJO", "los tiempos"));
ov(4, "con mejorante", 5, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["con mejorante", a], ["con prisa", a + 1], ["una sola levada", a + 2]]} />);
// ===== PROMESA =====
ov(5, "10 secretos del pan", 5, big("10 SECRETOS", "DEL PAN DE MUERTO DE MI MAMÁ"));
ov(5, "el que mi mama cuidaba", 5, card(1420, 300, "EL Nº 10", "el que mi mamá cuidaba más", "#ff8a6a"));
ov(6, "los cinco errores", 4.5, pill("+ LOS 5 ERRORES DE SIEMPRE"));
ov(6, "cuanto te cuesta", 4.5, precio("$", "CUÁNTO CUESTA DE VERDAD"));
// ===== LETY + CTA 1 =====
ov(7, "yo soy leti", 5, (a, o) => <LowerThird t={TT} at={a} out={o} name="LETY" l2="LA HIJA DE DOÑA CHAYO · 45 AÑOS" l2at={a + 2} />);
ov(7, "un rancho de michoacan", 5, (a, o) => <X.MapaMich t={TT} at={a} out={o} x={1460} y={500} />);
ov(7, "olia a pan", 4, (a, o) => <Aroma t={TT} at={a} out={o} x={1180} y={640} />);
ov(7, "a hacer los huesitos", 4.5, card(1440, 280, "DE CHIQUITA", "embarrar · huesitos · amasar"));
ov(8, "los postres de rancho de leti", 6, (a, o) => <X.Card t={TT} at={a} out={o} x={470} y={170} from="left" col="#ff8fbf"><H s={44} c="#ff8fbf">{GUIA_NOM}</H></X.Card>);
ov(8, "son 140 postres", 4, pill("140 POSTRES DE RANCHO", CH.maiz));
ov(8, "en la pagina 17", 6, (a, o) => <X.GuiaPag t={TT} at={a + 0.3} out={o} x={1520} y={220} pag={PAG} text="el pan de muerto de rancho" />);
ov(9, "14 pesos", 5, precio("$14", "EL PAN, EN TU CASA", 960));
ov(9, "en la panaderia 55", 5, precio("$55", "EN LA PANADERÍA", 470));
ov(9, "880 pesos", 6, vs("PANADERÍA", "EN TU CASA", [["16 panes: $880", true, false], ["16 panes: $224", false, true]]));
ov(9, "mas de 600 pesos", 5, (a, o) => <X.Cifra t={TT} at={a} out={o} x={960} y={520} to={600} pre="+$" sub="LO QUE TE AHORRAS" col={CH.maiz} />);
ov(9, "el link esta", 8, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(9, "el link esta", 8, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
// ===== 1 · LA ESPONJA =====
ov(10, "secreto numero 1", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={1} text="LA ESPONJA" />);
ov(10, "primero la despertaba", 4, pens("…primero, la despertaba"));
ov(10, "media hora antes", 4, crono(30, "MEDIA HORA ANTES"));
ov(11, "tibia no caliente", 4, stamp("TIBIA, NO CALIENTE", 76));
ov(11, "hasta 10 sin quemarse", 4.5, card(1440, 280, "EL DEDO CHIQUITO", "aguanta contando hasta 10"));
ov(11, "10 gramos de levadura", 9, lista(11, [["¼ taza de leche tibia", ""], ["10 g de levadura seca", "10 gramos de levadura"], ["1 cdita de azúcar", "una cucharadita de azucar"], ["3 cdas de harina", "3 cucharadas de harina"]]));
ov(11, "como atole espesito", 4, tag("COMO ATOLE ESPESITO"));
ov(12, "a los 20 o 30 minutos", 4.5, crono(30, "20 A 30 MINUTOS, TAPADA"));
ov(12, "huele como a cerveza", 4, pill("BURBUJAS Y OLOR A CERVEZA", CH.maiz));
ov(12, "tirala", 4, stamp("SIN BURBUJAS: SE TIRA", 72));
ov(13, "el error de casi todos", 4, pill("EL ERROR DE CASI TODOS"));
ov(13, "la sal cuando toca la levadura", 4.5, vs("SAL", "LEVADURA", [["juntas: la frena", false, false]]));
ov(13, "como un nino dormido", 5, cita("La levadura es como un niño dormido: despiértalo despacito."));
ov(14, "levadura instantanea", 4.5, card(1440, 280, "¿INSTANTÁNEA?", "la esponja igual ayuda"));
ov(14, "levanta mas parejo", 4, palo("LEVANTA MÁS PAREJO"));
// ===== 2 · LA HARINA =====
ov(15, "secreto numero 2", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={2} text="LA HARINA QUE SÍ" />);
ov(15, "mas proteina", 4.5, tag("MÁS PROTEÍNA", "LA RED QUE ATRAPA EL AIRE"));
ov(15, "harina para pastel", 4.5, vs("PARA PASTEL", "PARA PAN", [["sube alto", false, true], ["no se desmorona", false, true]]));
ov(16, "500 gramos de harina", 4.5, (a, o) => <X.Bascula t={TT} at={a} out={o} x={1450} y={460} kg={0.5} label="HARINA" sub="pa' 8 panes medianos" />);
ov(16, "la pesaba en la bascula", 4, pill("SE PESA, NO SE MIDE", CH.maiz));
ov(16, "casi el doble", 5, vs("TAZA APRETADA", "TAZA SUELTA", [["casi el doble de harina", true, false]]));
ov(16, "sale duro siempre", 3.5, stamp("HARINA DE MÁS: DURO", 70));
ov(17, "como 130 gramos", 4.5, card(1440, 280, "1 TAZA ≈ 130 g", "con cuchara, sin apretar"));
ov(18, "la cernia", 4, stamp("CERNIDA", 110, CH.maiz));
ov(18, "dos veces", 4, pill("2 PASADAS DE COLADOR", CH.maiz));
ov(19, "harina y harina y harina", 4, onoma("¡MÁS HARINA!"));
ov(19, "como ladrillo", 4, stamp("SALE COMO LADRILLO", 74));
ov(19, "pegajosa a proposito", 4, palo("PEGAJOSA A PROPÓSITO"));
// ===== 3 · LAS YEMAS =====
ov(20, "secreto numero 3", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={3} text="LAS YEMAS" />);
ov(20, "es un pan de huevo", 4, tag("PAN DE HUEVO", "NO BOLILLO DULCE"));
ov(21, "3 huevos enteros", 5, big("3 + 3", "HUEVOS ENTEROS + YEMAS"));
ov(21, "nunca se tiraban", 4, pill("LAS CLARAS: AL BARNIZ", CH.maiz));
ov(22, "tarda el doble en levantar", 4.5, stamp("FRÍOS: TARDA EL DOBLE", 68));
ov(22, "5 minutos en un tazon", 4.5, crono(5, "5 MIN EN AGUA TIBIA"));
ov(23, "120 gramos de mantequilla", 4.5, card(1440, 280, "120 g DE MANTEQUILLA", "suavecita, no derretida"));
ov(23, "no va al principio", 4.5, palo("LA MANTEQUILLA VA AL FINAL"));
ov(24, "media taza mas de leche", 4.5, pill("+ ½ TAZA DE LECHE TIBIA", CH.maiz));
ov(24, "la light y la deslactosada", 4.5, vs("LIGHT / DESLAC.", "ENTERA", [["sabor y color", false, true]]));
// ===== 4 · NARANJA, AZAHAR, ANÍS =====
ov(25, "secreto numero 4", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={4} text="NARANJA Y AZAHAR" />);
ov(25, "no lleva esencia de bote", 4, stamp("SIN ESENCIA DE BOTE", 72));
ov(26, "nada de lo blanco", 4, pill("SÓLO LO NARANJA: LO BLANCO AMARGA"));
ov(26, "la echaba en el azucar", 5, nota(["La ralladura,", "al azúcar,", "no a la masa."]));
ov(26, "frotaba y frotaba", 4, onoma("¡FROTA, FROTA!"));
ov(27, "el aceite de la naranja", 5, senales(27, "¿POR QUÉ FUNCIONA?", [["el aceite está en la cáscara", ""], ["el azúcar la raspa", "el azucar raspa"], ["el azúcar se perfuma", "el azucar se perfuma"], ["llega a toda la masa", "se reparte en toda"]]));
ov(28, "el agua de azahar", 4.5, tag("AGUA DE AZAHAR", "FLOR DE NARANJO"));
ov(28, "como 20 pesos", 4.5, precio("$20", "LA BOTELLITA · DURA AÑOS"));
ov(28, "sabe a jabon", 4, stamp("DE MÁS: SABE A JABÓN", 70));
ov(29, "un te de anis", 4.5, card(1440, 280, "TÉ DE ANÍS", "1 cdita en ¼ de taza"));
ov(29, "el olor de mi mama", 4.5, pens("…el olor de mi mamá en noviembre", 78));
ov(30, "una cucharadita rasa", 4, pill("1 CDITA DE SAL, RASA", CH.maiz));
ov(30, "lejos de la esponja", 4, stamp("LEJOS DE LA ESPONJA", 72));
ov(31, "el secreto numero 10", 5, big("EL Nº 10", "EL QUE NO TIENE QUE VER CON INGREDIENTES"));
// ===== 5 · EL AMASADO =====
ov(32, "secreto numero 5", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={5} text="EL AMASADO" />);
ov(32, "todo menos la mantequilla", 4, pill("TODO, MENOS LA MANTEQUILLA"));
ov(32, "un volcan", 4, tag("UN VOLCÁN", "LA FUENTE DE HARINA"));
ov(33, "no le eches", 3.5, stamp("¡NO LE ECHES HARINA!", 72));
ov(33, "estirar doblar girar", 5, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["estirar", a], ["doblar", a + 0.6], ["girar", a + 1.2]]} />);
ov(34, "es puro sufrir", 4, onoma("¡PURO SUFRIR!"));
ov(34, "a los 10 o 12 minutos", 4.5, crono(12, "A LOS 10-12 MIN: CAMBIA"));
ov(34, "en cuatro partes", 4.5, card(1440, 280, "LA MANTEQUILLA", "en 4 partes"));
ov(35, "la grasa cubre la harina", 5, vs("AL PRINCIPIO", "AL FINAL", [["la red se forma", false, true], ["pan más alto", false, true]]));
ov(36, "la prueba de la ventana", 5, card(1440, 280, "LA PRUEBA DE LA VENTANA", "delgadito, que pase la luz"));
ov(36, "como papel de china", 4, palo("COMO PAPEL DE CHINA: YA ESTÁ"));
ov(36, "20 25 minutos", 4.5, crono(25, "A MANO: 20-25 MIN"));
ov(37, "amasar 5 minutos", 4, fix("AMASAR 5 MINUTOS", "sin red no hay pan esponjoso"));
ov(37, "3 canciones y media", 5, cita("Tres canciones y media, y ya está la masa."));
// ===== 6 · EL PRIMER LEVADO =====
ov(38, "secreto numero 6", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={6} text="EL PRIMER LEVADO" />);
ov(38, "hasta el doble", 4, tagOlla("HASTA EL DOBLE", "NO UN POQUITO"));
ov(39, "el problema de noviembre", 4.5, card(1440, 280, "EL PROBLEMA DE NOVIEMBRE", "la cocina fría"));
ov(39, "4 o 5 horas", 4, crono(300, "EN FRÍO: 4 O 5 HORAS"));
ov(39, "junto al fogon", 4, tag("JUNTO AL FOGÓN", "NI MUY CERCA NI MUY LEJOS", "#ff9a4a"));
ov(39, "el horno apagado con la luz prendida", 5, nota(["Horno apagado,", "la luz prendida", "y una olla de", "agua hirviendo."]));
ov(40, "26 28 grados", 4.5, big("26-28°", "UN DÍA DE CALOR"));
ov(40, "eso nunca", 4, stamp("HORNO PRENDIDO: NUNCA", 66));
ov(41, "la prueba del dedo", 4.5, card(1440, 280, "LA PRUEBA DEL DEDO", "2 centímetros"));
ov(41, "se va llenando despacito", 7, senales(41, "EL HOYITO…", [["se cierra rápido: le falta", ""], ["se llena despacito: ya", "se va llenando despacito"], ["se desinfla: se pasó", "se desinfla"]]));
ov(41, "se recupera", 4, palo("SE PASÓ: SE VUELVE A BOLEAR"));
// ===== 5 ERRORES =====
ov(42, "los 5 errores", 4.5, big("5 ERRORES", "LOS QUE VEO CADA AÑO", "#ff8a6a"));
const ERR: [number, string, string, string][] = [[43, "error numero 1", "1 · HORNO SIN PRECALENTAR", "20 minutos antes, en la 2ª levada"], [44, "error numero 2", "2 · HUESITOS GORDOS", "delgaditos como un lápiz"], [45, "error numero 3", "3 · ABRIR EL HORNO", "15 minutos: ni asomarte"], [46, "error numero 4", "4 · AZÚCAR CON EL PAN FRÍO", "con el pan tibio"], [47, "error numero 5", "5 · EL PAN AL REFRI", "bolsa cerrada, en la alacena"]];
ERR.forEach(([i, ph, prob, f]) => ov(i, ph, 7, (a, o) => <X.FixCard t={TT} at={a} out={o} x={1400} y={460} prob={prob} fix={[f]} fixAt={a + 3} />));
ov(44, "como salchichas", 4, stamp("COMO SALCHICHAS", 80));
ov(45, "mira por el vidrio", 4, pill("MIRA POR EL VIDRIO", CH.maiz));
ov(47, "3 4 dias", 4, pill("BIEN GUARDADO: 3-4 DÍAS", CH.maiz));
// ===== 7 · FORMADO Y HUESITOS =====
ov(48, "secreto numero 7", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={7} text="EL FORMADO Y LOS HUESITOS" />);
ov(48, "una quinta parte", 5, vs("⅕ DE LA MASA", "⅘ DE LA MASA", [["huesitos y bolitas", true, false], ["los cuerpos", false, true]]));
ov(49, "como 80 gramos", 4.5, (a, o) => <X.Bascula t={TT} at={a} out={o} x={1450} y={460} kg={0.08} label="CADA BOLA" sub="80 gramos" />);
ov(49, "como si fuera una arana", 4, tag("MANO DE ARAÑA", "CÍRCULOS CHIQUITOS"));
ov(49, "crezca para arriba", 4, palo("CRECE PARA ARRIBA, NO A LOS LADOS"));
ov(50, "del grueso de un lapiz", 4, pill("DELGADO COMO UN LÁPIZ", CH.maiz));
ov(50, "dos dedos abiertos", 4.5, card(1440, 280, "DOS DEDOS ABIERTOS", "y lo ruedas: salen los nudos"));
ov(51, "cuatro huesitos en cruz", 4, tagOlla("4 HUESITOS EN CRUZ"));
ov(51, "para que se peguen", 4, pill("CON AGUA O CLARA, SE PEGAN", CH.maiz));
ov(52, "la cabecita", 4, card(1440, 280, "LA CABECITA", "la lágrima, el corazón"));
ov(52, "queda clavada", 4, palo("CLAVADA: NO SE VA RODANDO"));
ov(53, "el ciclo de la vida", 9, senales(53, "LO QUE SIGNIFICA", [["la bolita: la cabeza", ""], ["los huesitos: los que se fueron", "los huesitos son"], ["redondo: el ciclo de la vida", "el ciclo de la vida"], ["4: los cuatro rumbos", "los cuatro rumbos"]]));
ov(53, "ya le sacaron el sabor", 5, cita("Ya no sabe igual: ya le sacaron el sabor los muertitos."));
// ===== 8 · LA SEGUNDA LEVADA =====
ov(54, "secreto numero 8", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={8} text="LA SEGUNDA LEVADA" />);
ov(54, "todo mundo se salta", 4, stamp("LA QUE TODOS SE SALTAN", 66));
ov(55, "como una mano de distancia", 4, pill("UNA MANO DE DISTANCIA", CH.maiz));
ov(55, "45 minutos a 1 hora", 4.5, crono(60, "45 MIN A 1 HORA, TAPADOS"));
ov(56, "50 mas grandes", 4.5, big("+50 %", "NO AL DOBLE"));
ov(57, "a 180 grados", 4, card(1440, 280, "EL HORNO, A 180°", "mientras levantan"));
ov(57, "hasta 8 9", 5, nota(["La mano adentro:", "aguanta hasta 9,", "está bien."]));
ov(58, "cuanto cuesta todo esto", 4, pill("¿CUÁNTO CUESTA DE VERDAD?", CH.maiz));
// ===== LA CUENTA =====
ov(59, "medio kilo de harina", 30, (a, o) => <Receipt t={TT} sc={0.7} rows={[
  { at: a, item: "harina, ½ kg", $: 10 }, { at: nz(A("como 20 pesos", 59), a + 3), item: "6 huevos", $: 20 }, { at: nz(A("como 35 pesos", 59), a + 6), item: "mantequilla, 120 g", $: 35 },
  { at: nz(A("la leche como 8", 59), a + 8), item: "leche", $: 8 }, { at: nz(A("como 12 pesos", 59), a + 10), item: "azúcar, levadura, sal", $: 12 }, { at: nz(A("2 naranjas", 59), a + 12), item: "2 naranjas", $: 6 },
  { at: nz(A("como 5 pesos por tanda", 59), a + 14), item: "azahar y anís", $: 5 }, { at: nz(A("unos 15", 59), a + 16), item: "mantequilla y azúcar de encima", $: 15 }, { at: nz(A("unos 10 pesos", 59), a + 18), item: "gas del horno", $: 10 }]}
  totalAt={nz(A("son como 120", 60), a + 22)} x={1420} y={110} out={o} title="8 PANES" />);
ov(60, "15 pesos cada pan", 5, precio("$15", "EL PAN, EN TU CASA"));
ov(60, "en 60 en 70", 5, precio("$55-70", "EN LA PANADERÍA", 470));
ov(60, "colorante amarillo", 4, stamp("ESENCIA Y COLORANTE", 70));
ov(61, "haces ocho en tu casa", 5, vs("PANADERÍA", "EN TU CASA", [["2 panes", true, false], ["8 panes", false, true]]));
ov(61, "eso no se compra", 4, palo("Y ESO NO SE COMPRA"));
// ===== 9 · HORNO, BARNIZ, AZÚCAR =====
ov(62, "secreto numero 9", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={9} text="HORNO, BARNIZ Y AZÚCAR" />);
ov(62, "un chorrito de leche", 4.5, card(1440, 280, "EL BARNIZ", "huevo + chorrito de leche"));
ov(63, "20 a 25 minutos", 4.5, crono(25, "180° · 20 A 25 MIN"));
ov(63, "como sombrerito", 4, pill("ALUMINIO DE SOMBRERITO", CH.maiz));
ov(64, "tres senales", 9, senales(64, "YA ESTÁ CUANDO…", [["dorado, color piloncillo", ""], ["suena hueco: toc toc", "toc toc"], ["90° por dentro", "a 90 grados"]]));
ov(64, "toc toc", 3.5, onoma("¡TOC, TOC!"));
ov(65, "5 minutos nada mas", 5, big("5 MIN", "FUERA DEL HORNO, Y EL AZÚCAR"));
ov(65, "120 gramos de mantequilla", 4, pill("120 g DE MANTEQUILLA DERRETIDA", CH.maiz));
ov(66, "una costrita que cruje", 4, tag("LA COSTRITA QUE CRUJE"));
ov(66, "queda como charco", 5, vs("RECIÉN SALIDO", "A LOS 5 MIN", [["el azúcar se pega", false, true]]));
ov(67, "es un lujito", 4.5, card(1440, 280, "EL LUJITO", "ralladura en el azúcar de encima"));
// ===== LO QUE NUNCA =====
ov(68, "nunca horneaba con prisa", 4, stamp("NUNCA CON PRISA", 80));
ov(68, "el pan no conoce el reloj", 5, cita("El pan no conoce el reloj."));
ov(69, "nunca abria la puerta", 4, pill("LA PUERTA, CERRADA", CH.maiz));
ov(69, "nunca horneaba enojada", 4.5, cita("El pan se da cuenta."));
// ===== REGIONES =====
ov(70, "no es igual en todo mexico", 4.5, card(1440, 280, "CADA PUEBLO, SU PAN"));
ov(70, "en oaxaca", 4.5, tag("OAXACA", "PAN DE YEMA CON CARITA"));
ov(71, "le ponen ajonjoli", 4.5, tag("PUEBLA Y TLAXCALA", "CON AJONJOLÍ"));
ov(71, "pan de animas", 4.5, tag("PÁTZCUARO", "PAN DE ÁNIMAS"));
ov(72, "la version de ajonjoli", 4.5, card(1440, 280, "LA DE AJONJOLÍ", "barniz de huevo y al horno"));
// ===== CTA 2 =====
ov(73, "en el libro 3", 6, (a, o) => <X.Card t={TT} at={a} out={o} x={470} y={170} from="left" col="#ff8fbf"><H s={44} c="#ff8fbf">{GUIA_NOM}</H></X.Card>);
ov(73, "en la pagina 17", 12, (a, o) => <X.GuiaPag t={TT} at={a + 0.3} out={o} x={1520} y={220} pag="Libro 3 · págs. 16, 17 y 18" text="el día del pan, hora por hora" />);
ov(74, "son 140 postres", 4.5, pill("140 POSTRES, CON SUS PESOS", CH.maiz));
ov(74, "el link esta", 7, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(74, "el link esta", 7, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
// ===== 10 · LA MASA DUERME =====
ov(75, "secreto numero 10", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={10} text="LA MASA DUERME" />);
ov(75, "el 30 en la noche", 5, (a, o) => <X.Calendario t={TT} at={a} out={o} x={1450} y={430} flipAt={a + 2.5} a="30" b="31" la="EN LA NOCHE" lb="EN LA MAÑANA" />);
ov(75, "tu en el refri", 4.5, (a, o) => <X.Refri t={TT} at={a} out={o} x={1450} y={460} inAt={a + 0.6} />);
ov(76, "12 horas 14 horas", 4.5, crono(720, "12 A 14 HORAS EN EL FRÍO"));
ov(77, "fermentacion en frio", 4.5, card(1440, 280, "FERMENTACIÓN EN FRÍO", "lo de las panaderías finas"));
ov(77, "dejar que la masa duerma", 5, cita("Dejar que la masa duerma."));
ov(78, "como algodon", 4.5, tag("MIGA DE ALGODÓN", "SE DESHEBRA EN HILITOS"));
ov(79, "en vez de 10 gramos 7", 4.5, big("7 g", "DE LEVADURA, NO 10"));
ov(80, "esta en el tiempo", 5, cita("Harina, huevo y paciencia. La paciencia no se compra."));
// ===== PREGUNTAS =====
ov(81, "con polvo para hornear", 4.5, card(1440, 280, "¿SIN LEVADURA?", "sale panqué, no pan de muerto"));
ov(81, "con margarina", 4, pill("¿MARGARINA? MEJOR MANTEQUILLA"));
ov(82, "aguanta un mes", 4.5, card(1440, 280, "¿SE CONGELA?", "sin azúcar, 1 mes"));
ov(82, "en una olla grande de fierro", 4.5, card(1440, 280, "¿SIN HORNO?", "olla de fierro, 40 minutos"));
ov(83, "de nata", 4.5, card(1440, 280, "¿RELLENO?", "de nata, como en el rancho"));
ov(83, "va sin relleno", 4, pill("EL DE LA OFRENDA: SIN RELLENO", CH.maiz));
// ===== REPASO, CIERRE =====
ov(84, "te hago el repaso", 4, palo("LOS 10, PARA APUNTAR"));
ov(86, "es acordarse", 5, cita("Eso es el pan de muerto: acordarse.", "LETY"));
ov(87, "en los comentarios", 5, card(1400, 300, "¿AZÚCAR O AJONJOLÍ?", "en los comentarios, los leo todos"));
ov(87, "en la primera linea", 7, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(87, "en la primera linea", 7, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
ov(88, "suscribete", 4, card(1400, 300, "SUSCRÍBETE", "el próximo: la cajeta al revés"));

// cada pieza resuelve su segundo UNA vez
const OVT = OV.map(([i, ph, d, f]) => { const a = A(ph, i); return { a, b: a + d, f }; }).filter((o) => Number.isFinite(o.a));
const Ov = (t: number): React.ReactNode[] => {
  TT = t;
  const L: React.ReactNode[] = [];
  OVT.forEach((o, k) => { if (t >= o.a - 0.4 && t < o.b + 0.6) L.push(<React.Fragment key={"o" + k}>{o.f(o.a, o.b - 0.2)}</React.Fragment>); });
  const lab = (ats: number[], a: number, b: number) => { if (t >= a - 0.4 && t < b + 0.6) PLATES.forEach((q, i) => { if (!Number.isFinite(ats[i])) return; const p = sc(t, q); L.push(<X.PlateLabel key={"pl" + a + i} t={t} at={ats[i] + i * 0.05} out={b - 0.2} x={p.x} y={p.y} n={i + 1} text={ROT[i]} up={i % 2 ? 250 : 130} />); }); };
  lab(PROM, nz(PROM[0], 0), PT0(6));
  lab(RES, nz(RES[0], PT0(84)), PT0(86));
  SERVE.forEach((sv, i) => { if (t >= sv && t < sv + 4.5) { const p = sc(t, PLATES[i]); L.push(<Tag key={"sv" + i} t={t} at={sv + 0.3} x={p.x} y={p.y} dx={240} dy={-210} text={"PAN " + (i + 1)} sub={i === 9 ? "LOS DIEZ, LISTOS" : "LISTO"} col={CH.maiz} out={sv + 4.2} size={50} />); } });
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
