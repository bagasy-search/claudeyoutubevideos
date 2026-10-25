// lecaj30 · LA CAJETA DE MI ABUELITA, AL REVÉS (30 min). Motor de chcalab/lepan30 con el mundo de Lety: el cazo de COBRE donde
// la leche se reduce y toma color (raw = cuánto se redujo), siete platos de barro (uno por truco: al cerrar cada truco se sirve su cajeta
// con obleas), el recetario de Doña Chayo que pasa una hoja por truco (y la GUÍA, Libro 2 pág. 34, cuando Lety habla de sus libros), el fogón.
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

const PAG = "Libro 2 · pág. 34";
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

// ---------------- el recetario de Doña Chayo: una hoja por truco ----------------
const RECETARIO = [
  { l: ["# Cajeta del rancho", "de la abuelita Refugio", "", "una vez al mes,", "en domingo,", "en el cazo de cobre.", "Todo al revés", "de lo que te dicen."], r: ["1. la leche", "2. el cazo ancho", "3. el bicarbonato", "4. azúcar y miel", "5. el fuego al revés", "6. la pala en 8", "7. el punto"] },
  { l: ["# 1. La leche", "mitad cabra,", "mitad vaca", "ENTERA"], r: ["nunca light", "nunca deslactosada", "", "3 litros = 2 frascos", "de medio litro"] },
  { l: ["# 2. El cazo", "ancho y bajito", "fondo grueso", "cobre si hay"], r: ["la olla honda:", "5-6 horas", "el cazo ancho: 3", "", "3-4 canicas al fondo"] },
  { l: ["# 3. Bicarbonato", "½ cucharadita", "para 3 litros", "disuelto en leche fría"], r: ["cuando está tibia", "y fuera del fuego", "", "¿se cortó?", "batidora y de vuelta"] },
  { l: ["# 4. El azúcar", "600 g, desde el", "principio, en frío", "raja de canela"], r: ["1 cda de miel:", "no se azucara", "", "vainilla al final,", "fuera del fuego"] },
  { l: ["# 5. El fuego", "al revés:", "alto al principio", "y vas bajando"], r: ["como una escalera", "nunca le subes", "al final", "", "3 horas en total"] },
  { l: ["# 6. La pala", "de madera, punta plana", "cada 10 min al principio", "sin parar al final"], r: ["en 8, no en círculo", "raspando el fondo", "", "su pala, sólo", "para la cajeta"] },
  { l: ["# 7. El punto", "se apaga aguadita", "", "1. el caminito"], r: ["2. la gota en el agua", "3. el plato frío", "", "colada, caliente,", "frasco boca abajo"] },
];
const GUIA = [
  { l: ["# Los Postres de", "# Rancho de Lety", "", "Libro 2", "El Flan y la Cajeta", "del Rancho", "", "140 postres"], r: ["la tarde de la cajeta,", "hora por hora ..... 33", "", "de leche de vaca .. 34", "mixta de cabra .... 35", "la quemada ........ 36", "", "obleas, crepas y flan"] },
  { l: ["# Cajeta de", "# Leche de Vaca", "pág. 34", "", "3 l de leche entera", "600 g de azúcar", "½ cdita bicarbonato", "1 cda de miel"], r: ["el frasco: $45", "en la tienda: $120", "", "la de cabra:", "$60 contra $160", "", "con 2 frascos al mes:", "+$150 de ahorro"] },
];

// ---------------- tiempos clave ----------------
const SEC = [9, 14, 19, 24, 29, 34, 44]; // párrafo donde empieza cada truco
const FLIP = SEC.map((i) => A("truco numero", i));
const SERVE = [14, 19, 24, 28, 34, 38, 51].map((i) => PT0(i) - 1.5);
const PROM = [A("la leche que si", 4), A("el caso y por que", 4), A("el bicarbonato cuanto", 4), A("el azucar el fuego", 4), A("el fuego al reves la pala", 4), A("la pala y el ocho", 4), A("el del punto", 4)];
const RES = [A("1 la leche entera", 76), A("2 el caso mas ancho", 76), A("3 media cucharadita", 76), A("4 600 gramos", 76), A("el fuego al reves alto", 77), A("6 la pala al reves", 77), A("y 7 el punto", 77)];
const ROT = ["la leche", "el cazo", "bicarbonato", "azúcar y miel", "el fuego", "la pala en 8", "el punto"];
const nz = (x: number, d: number) => (Number.isFinite(x) ? x : d);
const GV: [number, number, number][] = [[PT0(7) + 1.5, PT0(9) + 1.5, 1], [PT0(59) + 1.5, PT0(61) + 1.5, 1]];
const guiaAt = (t: number) => GV.find((v) => t >= v[0] - 0.05 && t < v[1] + 0.05);
const NOCHE: [number, number][] = [[PT0(64) + 12, PT0(65) + 1.5]];

const worldAt = (t: number): WorldProps => {
  const gv = guiaAt(t), i = partIdx(t), k0 = (i >= 0 ? PARTS[i].k0 : undefined) ?? "caz";
  const plateServed = PLATES.map((_, k) => win(t, SERVE[k], SERVE[k] + 1.2));
  const plateOn = PLATES.map((_, k) => Math.max(
    win(t, nz(PROM[k], 95 + k * 3), nz(PROM[k], 95 + k * 3) + 0.3) * (1 - win(t, PT0(5), PT0(5) + 0.3)),
    win(t, SERVE[k] - 0.4, SERVE[k]) * (1 - win(t, SERVE[k] + 3, SERVE[k] + 4)),
    win(t, nz(RES[k], PT0(76) + 4 + k * 3), nz(RES[k], PT0(76) + 4 + k * 3) + 0.3) * (1 - win(t, PT0(78), PT0(78) + 0.3)),
  ));
  // la leche del cazo: blanca y llena hasta el fuego (truco 5), se reduce y toma color (5-6), piloncillo en el punto (7); la tarde hora por hora la repite
  const hora = t >= PT0(61) && t < PT0(65);
  const raw = hora ? ei(t, PT0(61) + 10, PT0(64) + 8) : t < PT0(29) ? 0.04 : t < PT0(34) ? 0.04 + 0.46 * ei(t, PT0(30), PT0(34)) : t < PT0(44) ? 0.5 + 0.2 * ei(t, PT0(34), PT0(38)) : t < PT0(52) ? 0.7 + 0.3 * ei(t, PT0(44), PT0(47)) : 1;
  const ny = NOCHE.reduce((m, [a, b]) => Math.max(m, win(t, a, a + 2) * (1 - win(t, b - 2, b))), 0);
  const bk = gv ? { open: ei(t, gv[0], gv[0] + 1.0), flip: gv[2] * ei(t, gv[0] + 0.3, gv[0] + 1.2), pages: GUIA }
    : { open: 1, flip: FLIP.reduce((acc, f) => acc + (Number.isFinite(f) ? ei(t, f, f + 0.9) : 0), 0), pages: RECETARIO };
  const alto = (t >= PT0(29) && t < PT0(31)) || (hora && t < PT0(63));
  return {
    t, night: ny,
    fire: alto ? 1.8 : t >= PT0(31) && t < PT0(34) ? 1.2 : 1,
    steamCaz: raw < 0.6 ? 0.9 : 0.5,
    steamComal: /^comal/.test(k0) ? 0.15 : 1,
    ojitos: 0,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.1 * v), plateFill: PLATES.map(() => (t < PT0(4) ? 1 : 0)),
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
ov(0, "liston de cajeta", 4, tag("UN LISTÓN DE CAJETA", "COLOR DE PILONCILLO"));
ov(0, "caso de cobre", 4, tagOlla("EL CAZO DE COBRE", "DE LA ABUELITA"));
ov(0, "esta al reves", 4.5, stamp("¡TODO AL REVÉS!", 90));
ov(1, "3 litros de leche", 4.5, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["3 litros de leche", a], ["1 kilo de azúcar", a + 1], ["rajita de canela", a + 2]]} />);
ov(1, "a fuego bajito desde el principio", 4.5, pill("FUEGO BAJITO DESDE EL PRINCIPIO"));
ov(1, "te duele el brazo", 4, crono(120, "DOS HORAS MOVIENDO"));
ov(1, "le subes al fuego", 3.5, onoma("¡FUEGO ALTO!"));
ov(2, "como requeson", 4, stamp("SE CORTA, COMO REQUESÓN", 66));
ov(2, "huele quemado", 4, stamp("HUELE A QUEMADO", 80));
ov(2, "pagas 160 pesos", 5, precio("$160", "EL FRASCO DE MEDIO LITRO"));
ov(3, "no fuiste tu", 4, palo("NO FUISTE TÚ, MIJA"));
ov(3, "el fuego va al reves", 6, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["el fuego: al revés", a], ["el movimiento: al revés", a + 1.5], ["el bicarbonato: al revés", a + 3], ["el punto: al revés", a + 4.5]]} />);
ov(3, "la cajeta sale sola", 4, palo("AL DERECHO, SALE SOLA"));
// ===== PROMESA =====
ov(4, "7 trucos del rancho", 5, big("7 TRUCOS", "DEL RANCHO PARA LA CAJETA"));
ov(4, "el que nadie hace", 4.5, card(1420, 300, "EL Nº 7", "el que nadie hace", "#ff8a6a"));
ov(5, "los cinco errores", 4.5, pill("+ LOS 5 ERRORES DE SIEMPRE"));
ov(5, "la cajeta quemada y la envinada", 4.5, pill("+ LA QUEMADA Y LA ENVINADA", CH.maiz));
// ===== LETY + CTA 1 =====
ov(6, "yo soy leti", 5, (a, o) => <LowerThird t={TT} at={a} out={o} name="LETY" l2="LA HIJA DE DOÑA CHAYO" l2at={a + 2} />);
ov(6, "un rancho de michoacan", 5, (a, o) => <X.MapaMich t={TT} at={a} out={o} x={1460} y={500} />);
ov(6, "mi abuelita refugio", 4.5, card(1440, 280, "LA ABUELITA REFUGIO", "la mamá de mi mamá"));
ov(6, "de mezquite", 4.5, tag("PALA DE MEZQUITE", "GASTADA DE UN LADO"));
ov(7, "los postres de rancho de leti", 6, (a, o) => <X.Card t={TT} at={a} out={o} x={470} y={170} from="left" col="#ff8fbf"><H s={44} c="#ff8fbf">{GUIA_NOM}</H></X.Card>);
ov(7, "son 140 postres", 4, pill("140 POSTRES DE RANCHO", CH.maiz));
ov(7, "en la pagina 34", 7, (a, o) => <X.GuiaPag t={TT} at={a + 0.3} out={o} x={1520} y={220} pag={PAG} text="la cajeta del rancho" />);
ov(8, "te sale en 45 pesos", 5, precio("$45", "EL FRASCO, EN TU CASA", 960));
ov(8, "en la tienda 120", 5, precio("$120", "EN LA TIENDA", 470));
ov(8, "contra 160 comprada", 5, vs("COMPRADA", "EN TU CASA", [["cabra: $160", true, false], ["cabra: $60", false, true]]));
ov(8, "mas de 150 pesos al mes", 5, (a, o) => <X.Cifra t={TT} at={a} out={o} x={960} y={520} to={150} pre="+$" sub="AL MES, SÓLO CON LA CAJETA" col={CH.maiz} />);
ov(8, "el link esta", 8, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(8, "el link esta", 8, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
// ===== 1 · LA LECHE =====
ov(9, "truco numero 1", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={1} text="LA LECHE" />);
ov(9, "leche de cabra", 4.5, tag("LECHE DE CABRA", "LA DE CELAYA"));
ov(9, "se corta mas facil", 4, stamp("MÁS DELICADA", 80));
ov(10, "mitad y mitad", 5, big("½ + ½", "CABRA + VACA"));
ov(10, "don cirilo", 4, pill("LAS CABRAS DE DON CIRILO", CH.maiz));
ov(10, "pura leche de vaca", 4.5, palo("PURA VACA: TAMBIÉN SALE"));
ov(11, "tiene que ser entera", 4.5, stamp("ENTERA", 120, CH.maiz));
ov(11, "como chicle", 4.5, vs("LIGHT", "ENTERA", [["brillo", false, true], ["cremosa", false, true]]));
ov(11, "la deslactosada nunca", 4.5, stamp("DESLACTOSADA: NUNCA", 70));
ov(12, "leche bronca", 4.5, card(1440, 280, "¿LECHE BRONCA?", "se hierve y se cuela"));
ov(12, "le quitaba la nata", 4.5, nota(["La nata,", "para el pan.", "La leche,", "colada con manta."]));
ov(13, "a la tercera parte", 5, big("3 → 1", "SE REDUCE A LA TERCERA PARTE"));
ov(13, "dos frascos de medio litro", 4.5, pill("3 LITROS = 2 FRASCOS", CH.maiz));
// ===== 2 · EL CAZO =====
ov(14, "truco numero dos", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={2} text="EL CAZO" />);
ov(14, "el primer al reves", 4, pill("EL PRIMER AL REVÉS"));
ov(14, "tu peor enemiga", 4, stamp("LA OLLA HONDA: TU ENEMIGA", 62));
ov(15, "por la superficie", 4.5, tagOlla("EL AGUA SE VA POR ARRIBA", "MÁS ANCHO, MÁS RÁPIDO"));
ov(15, "tarda 5 6 horas", 6, vs("OLLA HONDA", "CAZO ANCHO", [["5-6 horas", true, false], ["2½-3 horas", false, true]]));
ov(16, "el caso de cobre es lo mejor", 4.5, card(1440, 280, "EL COBRE", "reparte el calor parejo"));
ov(16, "una paellera", 6, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["cazuela de peltre ancha", a - 2], ["paellera", a], ["olla express sin tapa", a + 1.2], ["sartén grande y hondo", a + 2.6]]} />);
ov(17, "aluminio delgadita", 4.5, stamp("ALUMINIO DELGADITO: NUNCA", 62));
ov(17, "toda la cajeta sabe a quemado", 4, fix("UN PEDACITO QUEMADO", "toda la cajeta sabe a quemado"));
ov(18, "3 o 4 canicas", 5, card(1440, 280, "3 O 4 CANICAS", "de vidrio, bien lavadas"));
ov(18, "si canicas", 3.5, onoma("¡SÍ, CANICAS!"));
ov(18, "iban rodando solitas", 4.5, palo("RUEDAN Y NO DEJAN QUE SE PEGUE"));
// ===== 3 · EL BICARBONATO =====
ov(19, "truco numero 3", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={3} text="EL BICARBONATO" />);
ov(19, "tiene dos trabajos", 7, senales(19, "DOS TRABAJOS", [["que no se corte la leche", ""], ["el color de piloncillo", "le da ese color"]]));
ov(20, "media cucharadita para 3 litros", 5, big("½ CDITA", "PARA 3 LITROS"));
ov(20, "sabe a jabon", 4, stamp("DE MÁS: SABE A JABÓN", 70));
ov(21, "en polvo directo", 4.5, stamp("EN POLVO, DIRECTO: SE CORTA", 58));
ov(21, "un chorrito de leche fria", 5, nota(["Disuelto en", "¼ de taza de", "leche fría."]));
ov(21, "apartaba el caso del fuego", 6, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["la leche, apenas tibia", a - 2], ["el cazo, fuera del fuego", a], ["se echa y se mueve", a + 2], ["baja la espuma: al fuego", a + 4]]} />);
ov(22, "como si respirara", 4.5, tagOlla("ESPUMITA: ESTÁ TRABAJANDO"));
ov(23, "no la tires", 4, palo("¿SE CORTÓ? NO LA TIRES"));
ov(23, "la batidora de mano", 5, fix("SE VE CORTADA", "batidora 1 minuto y de vuelta al fuego"));
// ===== 4 · EL AZÚCAR =====
ov(24, "truco numero 4", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={4} text="EL AZÚCAR" />);
ov(24, "600 gramos de azucar", 4.5, (a, o) => <X.Bascula t={TT} at={a} out={o} x={1450} y={460} kg={0.6} label="AZÚCAR" sub="pa' 3 litros" />);
ov(24, "con la leche fria", 4, pill("DESDE EL PRINCIPIO, EN FRÍO", CH.maiz));
ov(25, "canela es en raja", 4.5, tag("CANELA EN RAJA", "DE CEILÁN"));
ov(25, "la de polvo nunca", 4, stamp("EN POLVO: ARENOSA", 74));
ov(26, "no se azucare", 4.5, card(1440, 280, "QUE NO SE AZUCARE", "el truco que nadie sabe"));
ov(26, "como arena", 4, stamp("CRISTALITOS COMO ARENA", 66));
ov(26, "una cucharada de miel", 5, big("1 CDA DE MIEL", "LA CAJETA SE QUEDA LISITA MESES"));
ov(27, "la vainilla", 4.5, card(1440, 280, "LA VAINILLA", "al final, fuera del fuego"));
ov(27, "de papantla", 4, pill("VAINILLA DE PAPANTLA", CH.maiz));
ov(28, "el truco numero 7", 5, big("EL Nº 7", "EL QUE DECIDE TODO"));
// ===== 5 · EL FUEGO AL REVÉS =====
ov(29, "truco numero 5", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={5} text="EL FUEGO AL REVÉS" />);
ov(29, "a fuego bajito", 4, pill("«A FUEGO BAJITO», TE DICEN"));
ov(29, "ahi es cuando se quema", 4, stamp("AL FINAL LE SUBEN: SE QUEMA", 58));
ov(30, "al principio fuego alto", 5, (a, o) => <X.FuegoNivel t={TT} at={a} out={o} x={1450} y={460} lvl={3} label="AL PRINCIPIO: ALTO" />);
ov(30, "apenas una flamita", 5, (a, o) => <X.FuegoNivel t={TT} at={a} out={o} x={1450} y={230} lvl={1} label="AL FINAL: UNA FLAMITA" />);
ov(31, "como bajar una escalera", 5, cita("Es como bajar una escalera: nunca al revés."));
ov(31, "se quema en segundos", 4, stamp("SE QUEMA EN SEGUNDOS", 70));
ov(32, "no te alejes", 4, palo("LOS PRIMEROS MINUTOS: NO TE ALEJES"));
ov(33, "en unas 3 horas", 6, senales(33, "3 HORAS", [["1½ h: leche hirviendo", ""], ["color crema", "color crema"], ["café con leche", "color cafe con leche"], ["½ h: piloncillo y el punto", "la ultima media hora"]]));
// ===== 6 · LA PALA Y EL 8 =====
ov(34, "truco numero 6", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={6} text="LA PALA Y EL 8" />);
ov(34, "como loca desde el primer minuto", 4, onoma("¡SIN PARAR!"));
ov(34, "con el brazo muerto", 4, stamp("EL BRAZO MUERTO", 80));
ov(35, "cada 10 minutos", 4.5, crono(10, "AL PRINCIPIO: CADA 10 MIN"));
ov(35, "cada 2 o 3 minutos", 4.5, crono(3, "CON COLOR: CADA 2-3 MIN"));
ov(35, "sin parar ni un segundo", 4.5, pill("LA ÚLTIMA MEDIA HORA: SIN PARAR"));
ov(36, "la del 8", 5, big("EN 8", "NO EN CÍRCULO"));
ov(36, "cruza por el centro", 5, tagOlla("CRUZA POR EL CENTRO", "RASPA TODO EL FONDO"));
ov(37, "la pala de madera", 6, vs("METAL / PLÁSTICO", "MADERA", [["no raspa el cazo", false, true], ["no te quema", false, true]]));
ov(37, "de punta plana", 4, pill("PUNTA PLANA, NO REDONDA", CH.maiz));
// ===== 5 ERRORES =====
ov(38, "los 5 errores", 4.5, big("5 ERRORES", "LOS QUE VEO SIEMPRE", "#ff8a6a"));
const ERR: [number, string, string, string][] = [[39, "error numero 1", "1 · TAPARLA", "destapada: el vapor se va"], [40, "error numero 2", "2 · LECHE CONDENSADA", "si vas a hacer cajeta, haz cajeta"], [41, "error numero 3", "3 · CAZO CON JABÓN", "sal, limón y agua caliente"], [42, "error numero 4", "4 · PROBARLA CALIENTE", "las medidas son las medidas"], [43, "y error numero 5", "5 · FRASCO SIN HERVIR", "frascos hervidos 10 minutos"]];
ERR.forEach(([i, ph, prob, f]) => ov(i, ph, 7, (a, o) => <X.FixCard t={TT} at={a} out={o} x={1400} y={460} prob={prob} fix={[f]} fixAt={a + 3} />));
ov(40, "es dulce de leche condensada", 4, stamp("YA NO ES CAJETA", 80));
ov(43, "le sale moho", 4, stamp("MOHO ARRIBA", 90));
// ===== 7 · EL PUNTO =====
ov(44, "truco numero 7", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={7} text="EL PUNTO" />);
ov(44, "se apaga antes de lo que crees", 5, big("ANTES", "SE APAGA AGUADITA"));
ov(45, "espesa muchisimo", 5, vs("EN EL CAZO", "YA FRÍA", [["como atole espeso", true, false], ["cajeta de untar", false, true]]));
ov(45, "un ladrillo", 4, stamp("SE HACE UN LADRILLO", 74));
ov(46, "tenia tres pruebas", 4.5, card(1440, 280, "TRES PRUEBAS", "las de la abuelita"));
ov(46, "como un caminito", 8, senales(46, "1 · EL CAMINITO", [["se cierra luego luego: le falta", ""], ["se abre y se cierra despacio: ya", "se cierra despacio"], ["se queda abierto: se pasó", "se queda abierto"]]));
ov(47, "la del agua", 8, senales(47, "2 · LA GOTA EN EL AGUA", [["se hace nube: le falta", ""], ["llega entera, redondita: ya", "llega al fondo del vaso"]]));
ov(48, "la del plato", 8, senales(48, "3 · EL PLATO FRÍO", [["escurre como agua: le falta", ""], ["despacito, como miel: ya", "escurre despacito"], ["no se mueve: se pasó", "si no se mueve"]]));
ov(49, "si se te paso no la tires", 5, fix("SE PASÓ", "¼ taza de leche caliente, 1 minuto"));
ov(49, "es quemarla", 4, stamp("LO ÚNICO SIN ARREGLO: QUEMARLA", 54));
ov(50, "la cuelas", 4.5, card(1440, 280, "LA COLAS", "colador de alambre"));
ov(50, "lisa como seda", 4, palo("LISA COMO SEDA"));
ov(50, "boca abajo", 5, nota(["Caliente, en frasco", "hervido, hasta el", "borde, y boca abajo:", "6 meses."]));
// ===== LA CUENTA =====
ov(52, "3 litros de leche entera", 22, (a, o) => <Receipt t={TT} sc={0.72} rows={[
  { at: a, item: "leche entera, 3 l", $: 80 }, { at: nz(A("unos 18", 52), a + 3), item: "azúcar, 600 g", $: 18 },
  { at: nz(A("unos 15 pesos", 52), a + 6), item: "bicarbonato, canela, miel, vainilla", $: 15 }, { at: nz(A("unos 20", 52), a + 9), item: "gas, 3 horas", $: 20 }]}
  totalAt={nz(A("son como 133", 52), a + 11)} x={1420} y={140} out={o} title="2 FRASCOS Y TANTITO" />);
ov(52, "como 45 pesos cada frasco", 5, precio("$45", "CADA FRASCO", 470));
ov(53, "te cuesta 120 pesos", 5, precio("$120", "EN EL SÚPER", 470));
ov(53, "160 180", 4.5, precio("$160-180", "LA DE CABRA", 960));
ov(53, "con fecula con jarabe", 5, stamp("FÉCULA, JARABE, SABORIZANTE", 54));
ov(54, "haces casi tres", 5, vs("COMPRADA", "EN TU CASA", [["1 frasco", true, false], ["casi 3 frascos", false, true]]));
ov(54, "para que lo raspen los ninos", 4, palo("Y EL CAZO PA' LOS NIÑOS"));
// ===== REGIONES =====
ov(55, "la de celaya", 4.5, tag("CELAYA, GUANAJUATO", "DE LECHE DE CABRA"));
ov(55, "en cajetes", 5, card(1440, 280, "¿POR QUÉ «CAJETA»?", "se vendía en cajetes de madera"));
ov(55, "en celaya hay tres", 6, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["de leche", a + 1], ["quemada", a + 2.5], ["envinada", a + 4]]} />);
ov(56, "la quemada", 4.5, card(1440, 280, "LA QUEMADA", "4 cdas de azúcar, casi negra"));
ov(56, "hace un ruidazo", 3.5, onoma("¡SHHHH!"));
ov(56, "para el flan y para las crepas", 4, palo("LA MEJOR PARA FLAN Y CREPAS"));
ov(57, "la envinada", 4.5, card(1440, 280, "LA ENVINADA", "¼ taza de jerez o rompope"));
ov(57, "para las posadas", 4, pill("LA DE LAS POSADAS", CH.maiz));
ov(58, "en sayula", 4.5, tag("SAYULA, JALISCO", "CAJITAS REDONDAS DE MADERA"));
ov(58, "cascara de naranja", 4.5, tag("MICHOACÁN", "CON CÁSCARA DE NARANJA"));
ov(58, "son primas de la cajeta", 4, palo("TODAS SON PRIMAS"));
// ===== CTA 2 =====
ov(59, "en el libro 2", 6, (a, o) => <X.Card t={TT} at={a} out={o} x={470} y={170} from="left" col="#ff8fbf"><H s={44} c="#ff8fbf">{GUIA_NOM}</H></X.Card>);
ov(59, "en la pagina 34", 12, (a, o) => <X.GuiaPag t={TT} at={a + 0.3} out={o} x={1520} y={220} pag="Libro 2 · págs. 33 a 36" text="vaca, mixta, quemada y la tarde de la cajeta" />);
ov(60, "son 140 postres", 4.5, pill("140 POSTRES, CON SUS PESOS", CH.maiz));
ov(60, "ya pagaste los 5 libros", 4.5, palo("UN PAR DE MESES Y YA SE PAGARON"));
ov(60, "el link esta", 7, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(60, "el link esta", 7, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
// ===== LA TARDE, HORA POR HORA =====
ov(61, "hora por hora", 4.5, big("LA TARDE", "HORA POR HORA"));
ov(61, "a las 3 de la tarde", 4, card(1440, 280, "3:00 P.M.", "el cazo"));
ov(61, "a las tres y cuarto", 4, card(1440, 280, "3:15 P.M.", "leche, azúcar, miel"));
ov(62, "a las tres y media", 4, card(1440, 280, "3:30 P.M.", "el bicarbonato"));
ov(62, "el patio olia a canela", 4, (a, o) => <Aroma t={TT} at={a} out={o} x={1180} y={640} />);
ov(63, "a las 5 la leche", 4, card(1440, 280, "5:00 P.M.", "color crema"));
ov(63, "a las cinco y media", 4, card(1440, 280, "5:30 P.M.", "café con leche"));
ov(63, "rash rash", 3.5, onoma("RASH, RASH"));
ov(64, "como a las 6", 4, card(1440, 280, "6:15 P.M.", "las pruebas"));
ov(64, "y a las 7", 4, card(1440, 280, "7:00 P.M.", "los niños y el cazo"));
ov(64, "nada mas la ultima hora", 4.5, palo("DE VERDAD, SÓLO LA ÚLTIMA HORA"));
// ===== LA PRIMERA VEZ =====
ov(65, "yo tenia 14 anos", 4.5, card(1440, 280, "LETY, 14 AÑOS", "la primera vez, sola"));
ov(65, "a ver la tele", 4, stamp("SE FUE A VER LA TELE", 70));
ov(66, "huele la pala", 5, cita("Rasca el fondo y huele la pala.", "LA ABUELITA"));
ov(66, "no me despegue ni un minuto", 4.5, palo("LA SEGUNDA: NI UN MINUTO SOLA"));
// ===== VENDERLA Y REGALARLA =====
ov(67, "se puede vender", 4.5, card(1440, 280, "¿SE PUEDE VENDER?", "dura meses y se regala mucho"));
ov(67, "frascos chiquitos de 250", 4.5, tag("FRASQUITOS DE 250", "CON LISTÓN Y ETIQUETA"));
ov(67, "nunca le eches fecula", 4, stamp("NUNCA FÉCULA NI JARABE", 66));
ov(68, "una bolsita de obleas", 5, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["un frasquito de cajeta", a - 1.5], ["una bolsita de obleas", a], ["una tarjetita con la receta", a + 1.5]]} />);
// ===== LO QUE NUNCA =====
ov(69, "nunca dejaba la cajeta sola", 4.5, stamp("NUNCA SOLA", 100));
ov(69, "como un nino en la lumbre", 5, cita("La cajeta es como un niño en la lumbre.", "LA ABUELITA"));
ov(70, "nunca hacia cajeta con prisa", 4, pill("NUNCA CON PRISA"));
ov(70, "era solo para la cajeta", 4.5, card(1440, 280, "SU PALA", "sólo para la cajeta"));
ov(70, "ese era el premio", 4.5, palo("EL CAZO RASPADO: EL PREMIO"));
// ===== USOS =====
ov(71, "las obleas", 4, tag("OBLEAS", "AFUERA DE LA IGLESIA"));
ov(71, "las crepas de cajeta", 4, tag("CREPAS DE CAJETA", "CON NUEZ"));
ov(71, "el flan de cajeta", 4, tag("FLAN DE CAJETA", "EN VEZ DEL CARAMELO"));
ov(71, "la merienda de mi abuelo", 4, pill("BOLILLO CON CAJETA", CH.maiz));
ov(72, "los platanos machos", 4.5, card(1440, 280, "PLÁTANOS MACHOS", "fritos, con cajeta y canela"));
ov(72, "las tardes de lluvia", 4, pens("…las tardes de lluvia", 80));
ov(73, "a bano maria 5 minutos", 5, crono(5, "BAÑO MARÍA: SE AFLOJA"));
// ===== PREGUNTAS =====
ov(74, "con leche en polvo", 4, card(1440, 280, "¿LECHE EN POLVO?", "sí, entera, tantito menos sabrosa"));
ov(74, "en olla de presion", 4.5, card(1440, 280, "¿OLLA DE PRESIÓN?", "eso es dulce de leche"));
ov(74, "con piloncillo", 4.5, card(1440, 280, "¿CON PILONCILLO?", "la mitad, y cuida el bicarbonato"));
ov(75, "6 meses en la alacena", 5, vs("ALACENA", "REFRI", [["cerrada: 6 meses", true, false], ["abierta: 2 meses", false, true]]));
ov(75, "una costrita de azucar", 4, palo("¿COSTRITA? LE FALTÓ LA MIEL"));
// ===== REPASO, CIERRE =====
ov(76, "el repaso completo", 4, palo("LOS 7, PARA APUNTAR"));
ov(78, "cae como liston", 4.5, tag("LISITA, BRILLANTE", "CAE COMO LISTÓN"));
ov(79, "con obleas con bolillo", 5, card(1400, 300, "¿OBLEAS, BOLILLO O CUCHARA?", "en los comentarios"));
ov(79, "en la primera linea", 7, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(79, "en la primera linea", 7, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
ov(80, "suscribete", 4, card(1400, 300, "SUSCRÍBETE", "el próximo: el flan de mi mamá"));

// cada pieza resuelve su segundo UNA vez
const OVT = OV.map(([i, ph, d, f]) => { const a = A(ph, i); return { a, b: a + d, f }; }).filter((o) => Number.isFinite(o.a));
const Ov = (t: number): React.ReactNode[] => {
  TT = t;
  const L: React.ReactNode[] = [];
  OVT.forEach((o, k) => { if (t >= o.a - 0.4 && t < o.b + 0.6) L.push(<React.Fragment key={"o" + k}>{o.f(o.a, o.b - 0.2)}</React.Fragment>); });
  const lab = (ats: number[], a: number, b: number) => { if (t >= a - 0.4 && t < b + 0.6) PLATES.forEach((q, i) => { if (!Number.isFinite(ats[i])) return; const p = sc(t, q); L.push(<X.PlateLabel key={"pl" + a + i} t={t} at={ats[i] + i * 0.05} out={b - 0.2} x={p.x} y={p.y} n={i + 1} text={ROT[i]} up={i % 2 ? 250 : 130} />); }); };
  lab(PROM, nz(PROM[0], 0), PT0(5));
  lab(RES, nz(RES[0], PT0(76)), PT0(78));
  SERVE.forEach((sv, i) => { if (t >= sv && t < sv + 4.5) { const p = sc(t, PLATES[i]); L.push(<Tag key={"sv" + i} t={t} at={sv + 0.3} x={p.x} y={p.y} dx={240} dy={-210} text={"TRUCO " + (i + 1)} sub={i === 6 ? "LOS SIETE, LISTOS" : "LISTO"} col={CH.maiz} out={sv + 4.2} size={50} />); } });
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
