// chcalab · LA CALABAZA EN TACHA DE MI ABUELA (39,8 min). Un solo mundo y una sola cámara: la cocina de adobe de Doña Chayo con su olla
// de barro de calabaza en tacha en la mesa (los trozos con su cáscara verde para abajo, la miel de piloncillo que se va oscureciendo
// conforme avanza el video), los siete platos de barro (uno por secreto: al cerrar cada secreto se sirve su trozo), el recetario de
// mamá Cuca que pasa una hoja por secreto (y la GUÍA, Libro 4 pág. 59, cuando Chayo habla de sus libros), el fogón y el puesto del
// tianguis (calabaza, piloncillo, caña). La línea de tiempo sale de plan.json (plan.py): ventanas del avatar + en cada hueco las fotos y
// clips de ESE párrafo y el mundo con la cámara del tramo. Entre mundo y toma: portal o vapor. Cada pieza nace con su palabra (at()).
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
const inAv = (t: number) => WIN.some((w) => !sinCara(w) && t >= w.ms && t < w.me);
export const END_T = (PLAN as { end: number }).end; // voz 2385,0 + 1 s de silencio
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string };
const PARTS: Part[] = (PLAN as { parts: Part[] }).parts;
const PAR = (PLAN as { par: { i: number; tag: string; t: number }[] }).par;
const PT0 = (i: number) => (PAR.find((p) => p.i === i)?.t ?? 0) - 1.5; // "desde" para buscar la frase dentro de su párrafo
// at() que no rompe: si el ASR escribió distinto, la pieza no sale (y lo lista el chequeo)
export const MISS: string[] = [];
const A = (ph: string, i: number) => { try { return at(ph, PT0(i)); } catch { MISS.push(`${i}: ${ph}`); return NaN; } };

// páginas REALES de la guía: Libro 4 "La Quincena Flaca" · pág. 59 "Calabaza en Tacha, el Postre del Domingo"
const PAG = "Libro 4 · pág. 59";

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
  mercado: { p: [6.6, 1.55, 8.0], l: [6.6, 1.0, 5.4], fov: 44 }, mercado2: { p: [6.3, 1.4, 7.3], l: [6.6, 1.0, 5.4], fov: 42 },
  salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
};
// llaves de cámara: inicio y fin de cada parte de mundo (los saltos caen siempre dentro de una toma, del avatar o del vapor)
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!], k1 = C[p.k1!];
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partIdx = (t: number) => { let lo = 0, hi = PARTS.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (t < PARTS[m].a) hi = m - 1; else if (t >= PARTS[m].b) lo = m + 1; else return m; } return -1; };

// ---------------- recetario de mamá Cuca: una hoja por secreto ----------------
const RECETARIO = [
  { l: ["# Calabaza en Tacha", "de Muertos", "", "pa'l 31 en la tarde,", "que pase su noche.", "Sin cuchara,", "sin prisa.", "— Refugio"], r: ["1. la de Castilla", "2. grande y picada", "3. el baño de cal", "4. la cama de caña", "5. piloncillo y taza", "6. fuego bajito", "7. su noche", "y al otro día, con leche"] },
  { l: ["# 1. La de Castilla", "pesada", "rabito seco", "no le entra la uña", "suena hueco"], r: ["4 a 5 kilos", "$15-25 el kilo", "", "adentro: anaranjada", "fuerte, de 3 dedos"] },
  { l: ["# 2. Grande", "y picada", "", "con su cáscara", "gajos de melón"], r: ["trozos de 10 cm", "como tu mano", "", "piquetes sin llegar", "a la cáscara: la viruela"] },
  { l: ["# 3. El baño", "de cal", "4 litros de agua fría", "2 cdas de cal, al ras"], r: ["1 a 2 horas, no más", "", "enjuagar 2 o 3 veces", "hasta que no salga", "blanca el agua"] },
  { l: ["# 4. La cama", "de caña", "2 o 3 cañas peladas", "o los olotes"], r: ["cáscara para abajo", "como barquitos", "", "nunca más", "de dos camas"] },
  { l: ["# 5. Piloncillo", "1½ kg por 5 kg", "oscuro, en pedazos", "1 sola taza de agua"], r: ["4 rajas de canela", "3 clavos · anís", "cáscara de naranja", "6 guayabas", "tejocotes: amarran"] },
  { l: ["# 6. Fuego bajito", "trapo de manta", "y tapa", "SIN cuchara"], r: ["bañarla con el", "cucharón cada 20 min", "2 a 2½ horas", "", "la prueba del hilo"] },
  { l: ["# 7. Su noche", "al sereno", "o al refri", "", "el 31 en la tarde"], r: ["el 1º en la mañana:", "a la ofrenda", "", "fría, con leche,", "al otro día"] },
];
// la GUÍA (Libro 4): las páginas que Chayo nombra
const GUIA = [
  { l: ["# Las 5 Ollas de", "# Doña Chayo", "", "Libro 4", "La Quincena Flaca", "", "lo del rancho", "cuando falta el dinero"], r: ["Plan 3 · Domingo", "", "el postre del domingo ... 59", "lo que nunca se tira .... 60", "", "la verdura del tianguis:", "7 comidas"] },
  { l: ["# Calabaza en Tacha,", "# el Postre del Domingo", "pág. 59", "", "1 kg de calabaza", "de Castilla", "500 g de piloncillo", "1 raja de canela"], r: ["sale a $10 el plato", "rinde 4 platos", "tarda 1 hora", "", "el truco de Chayo:", "sin tapar, se queda", "entera"] },
  { l: ["# Si te sale mal", "pág. 59", "", "¿quedó aguada?", "saca la calabaza y", "hierve la miel 5 min"], r: ["¿se deshizo?", "estaba muy madura:", "trozos más grandes", "la próxima vez"] },
];

// ---------------- tiempos clave ----------------
const SEC = [13, 18, 23, 29, 33, 39, 46]; // párrafo donde empieza cada secreto
const FLIP = SEC.map((i, k) => A(k === 0 ? "secreto numero uno" : "secreto numero", i));
const SERVE = [18, 23, 29, 33, 38, 45, 51].map((i) => PT0(i) - 1.5); // al cerrar cada secreto se sirve su plato
const PROM = [A("como escoger la calabaza", 4), A("como se corta", 4), A("el bano que la deja", 4), A("lo que va en el fondo", 4), A("cuanto piloncillo", 4), A("el fuego de dos horas", 4), A("el ultimo secreto", 4)];
const RES = [A("uno la calabaza", 66), A("2 trozos grandes", 66), A("3 el bano", 66), A("4 la cama", 66), A("5 piloncillo oscuro", 66), A("6 fuego bajito", 66), A("y siete", 66)];
const ROT = ["la de Castilla", "grande y picada", "el baño de cal", "la cama de caña", "piloncillo, 1 taza", "fuego bajito", "su noche"];
const nz = (x: number, d: number) => (Number.isFinite(x) ? x : d);
// la GUÍA abierta en la mesa: CTA 1 (párrafo 7), CTA 2 (38) y la pregunta de la olla exprés (58)
const GV: [number, number, number][] = [[PT0(7) + 1.5, PT0(9) + 1.5, 1], [PT0(38) + 1.5, PT0(39) + 1.5, 1], [nz(A("la de la pagina", 58), PT0(58) + 20) - 0.5, PT0(59) + 1.5, 1]];
const guiaAt = (t: number) => GV.find((v) => t >= v[0] - 0.05 && t < v[1] + 0.05);
const NOCHE: [number, number][] = [[PT0(47) + 8, PT0(49) + 1.5], [PT0(63) + 1.5, PT0(66) + 1.5]];

const worldAt = (t: number): WorldProps => {
  const gv = guiaAt(t), i = partIdx(t), k0 = (i >= 0 ? PARTS[i].k0 : undefined) ?? "caz";
  const plateServed = PLATES.map((_, k) => win(t, SERVE[k], SERVE[k] + 1.2));
  const plateOn = PLATES.map((_, k) => Math.max(
    win(t, nz(PROM[k], 160 + k * 4), nz(PROM[k], 160 + k * 4) + 0.3) * (1 - win(t, PT0(5), PT0(5) + 0.3)),
    win(t, SERVE[k] - 0.4, SERVE[k]) * (1 - win(t, SERVE[k] + 3, SERVE[k] + 4)),
    win(t, nz(RES[k], PT0(66) + 6 + k * 5), nz(RES[k], PT0(66) + 6 + k * 5) + 0.3) * (1 - win(t, PT0(68), PT0(68) + 0.3)),
  ));
  // la calabaza de la olla: pálida y cruda hasta que se pone la lumbre (secreto 6), y se va enmielando hasta el ámbar oscuro
  const raw = t < FLIP[5] ? 1 : 1 - win(t, FLIP[5], PT0(45));
  const ny = NOCHE.reduce((m, [a, b]) => Math.max(m, win(t, a, a + 2) * (1 - win(t, b - 2, b))), 0);
  const bk = gv ? { open: ei(t, gv[0], gv[0] + 1.0), flip: gv[2] * ei(t, gv[0] + 0.3, gv[0] + 1.2), pages: GUIA }
    : { open: 1, flip: FLIP.reduce((acc, f) => acc + (Number.isFinite(f) ? ei(t, f, f + 0.9) : 0), 0), pages: RECETARIO };
  const seis = t >= FLIP[5] && t < PT0(45);
  return {
    t, night: ny,
    fire: seis ? 0.45 : t >= PT0(53) && t < PT0(54) ? 1.8 : 1,
    steamCaz: /^cazT/.test(k0) ? 0.3 : /^(caz|pl)/.test(k0) ? (t >= FLIP[5] ? 1 : 0.15) : /^top/.test(k0) ? 0.3 : 0.2,
    steamComal: /^comal/.test(k0) ? 0.15 : 1,
    ojitos: 0,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.12 * v), plateFill: PLATES.map(() => (t < PT0(4) ? 1 : 0)),
    book: bk, guia: gv ? 1 : 0,
    partyPeople: 0, patioLights: ny,
    chiles: 0, toast: 0, burnt: 0, sarten: 0, fry: 0, charola: 0, remojo: 0, tapa: 0, aguaLimon: 0, especias: 0, verduras: 0,
    raw,
    smoke: t >= PT0(30) && t < PT0(30) + 8 ? win(t, PT0(30) + 2, PT0(30) + 3) : 0,
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
  const pr = Math.max(0.4, Math.min(1, 2.9 / Math.max(0.1, d)));  // cámara lenta: el clip de 3 s cubre el plano
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
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 26, color: CH.guinda, marginTop: 6 }}>LAS 5 OLLAS DE DOÑA CHAYO</div>
  </div>;
};

// ---------------- las piezas, cada una clavada a su palabra ----------------
const sc = (t: number, q: V) => screenOf(t, q);
type F = (a: number, o: number) => React.ReactNode;
// pieza = [párrafo, frase, segundos en pantalla, dibujo(a = cuando se dice, o = cuando se va)]
const OV: [number, string, number, F][] = [];
const ov = (i: number, ph: string, d: number, f: F) => OV.push([i, ph, d, f]);
let TT = 0; // segundo actual para los dibujos
const H = X.H;
const card = (x: number, y: number, top: string, sub?: string, col: string = CH.maiz, from: "left" | "right" | "pop" = "right") => (a: number, o: number) =>
  <X.Card t={TT} at={a} out={o} x={x} y={y} from={from} col={col}><H s={50} c={col}>{top}</H>{sub && <H s={44} f={HAND}>{sub}</H>}</X.Card>;

// ===== GANCHO =====
ov(0, "como de ambar", 4, (a, o) => <Tag t={TT} at={a} x={1180} y={560} dx={260} dy={-240} text="COLOR ÁMBAR" sub="COMO DE VIDRIO" col={CH.maiz} out={o} size={54} />);
ov(0, "no se deshace", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="NO SE DESHACE" x={1380} y={280} size={84} col={CH.maiz} />);
ov(0, "siete cosas", 5, (a, o) => <BigNum t={TT} at={a} text="7 COSAS" size={150} y={860} col={CH.maiz} edge="#5a2a10" out={o} sub="QUE LAS FONDAS NO TE DICEN" />);
ov(1, "primero de noviembre", 4.5, (a, o) => <X.Calendario t={TT} at={a} out={o} x={1450} y={430} flipAt={a + 0.6} a="31" b="1" la="OCTUBRE" lb="NOVIEMBRE" />);
ov(1, "pure aguado", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="PURÉ AGUADO" x={1380} y={300} size={86} />);
ov(1, "pegado quemado", 4, (a, o) => <X.Onoma t={TT} at={a} out={o} x={1350} y={300} text="¡QUEMADO!" col="#ff8a6a" />);
ov(2, "por compromiso", 4, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="…está rica, mamá" size={92} />);
ov(2, "dos cucharadas", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={250} text="DOS CUCHARADAS, NOMÁS" />);
ov(2, "la tiras casi toda", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="A LA BASURA" x={1380} y={300} size={90} />);
ov(2, "40 pesos el pedazo", 5, (a, o) => <Precio t={TT} at={a} out={o} x={1440} y={150} top="$40" sub="EL PEDAZO, EN EL MERCADO" />);
ov(3, "no fuiste tu", 4, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="NO FUISTE TÚ" />);
ov(3, "para las tortillas", 5, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={820} text="¿algo de las tortillas… en un dulce?" size={78} />);
ov(3, "la venden por pieza", 5, (a, o) => <Stamp t={TT} at={a} out={o} text="POR PIEZA: ESO COBRAN" x={1300} y={290} size={70} col={CH.maiz} />);
// ===== PROMESA =====
ov(4, "siete secretos", 4.5, (a, o) => <BigNum t={TT} at={a} text="7 SECRETOS" size={150} y={880} col={CH.maiz} edge="#5a2a10" out={o} sub="DE LA CALABAZA EN TACHA DE MI ABUELA" />);
ov(4, "en pesos", 5, (a, o) => <Precio t={TT} at={a} out={o} x={1440} y={150} top="$" sub="CADA COSA, EN PESOS" />);
ov(5, "te va a sonar a locura", 5, (a, o) => <X.Card t={TT} at={a} out={o} x={1420} y={300} from="right" col="#ff8a6a"><H s={56} c="#ff8a6a">EL SECRETO Nº 3</H><H s={46} f={HAND}>te va a sonar a locura</H></X.Card>);
ov(5, "como le va a echar", 5, (a, o) => <X.Burbujas t={TT} out={o} items={[{ at: a, x: 1450, y: 270, text: "¿¡eso, a un dulce!?", rot: 3 }, { at: a + 2.5, x: 560, y: 620, text: "…y se comió tres pedazos", rot: -4 }]} />);
// ===== CHAYO + CTA 1 =====
ov(6, "yo soy rosario", 5, (a, o) => <LowerThird t={TT} at={a} out={o} name="DOÑA CHAYO" l2="67 AÑOS · RANCHO DE PÁTZCUARO" l2at={a + 2} />);
ov(6, "en michoacan", 5, (a, o) => <X.MapaMich t={TT} at={a} out={o} x={1460} y={500} />);
ov(6, "fogon de lena", 4, (a, o) => <Tag t={TT} at={a} x={1100} y={640} dx={260} dy={-240} text="FOGÓN DE LEÑA" sub="TODA LA VIDA" col="#ff9a4a" out={o} size={50} />);
ov(6, "las lanchas de giannizio", 5, card(1440, 260, "JANITZIO", "las velas en el lago"));
ov(6, "manana del 31", 4, (a, o) => <X.Calendario t={TT} at={a} out={o} x={1450} y={430} flipAt={1e9} a="31" b="1" la="OCTUBRE" lb="NOVIEMBRE" />);
ov(7, "mi hija leti", 4, card(1440, 260, "MI HIJA LETY", "me hizo prometer"));
ov(7, "son mis libros", 6, (a, o) => <X.Card t={TT} at={a} out={o} x={470} y={170} from="left" col="#ff8fbf"><H s={54} c="#ff8fbf">LAS 5 OLLAS DE DOÑA CHAYO</H></X.Card>);
ov(7, "en el libro 4", 9, (a, o) => <X.GuiaPag t={TT} at={a + 0.3} out={o} x={1520} y={220} pag={PAG} text="la calabaza en tacha del domingo" />);
ov(7, "10 pesos el plato", 6, (a, o) => <Precio t={TT} at={a} out={o} x={470} y={430} top="$10" sub="EL PLATO" />);
ov(7, "el link esta", 8, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(7, "el link esta", 8, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
// ===== LA HISTORIA =====
ov(8, "mi abuelo tenia una milpa", 5, (a, o) => <X.FotoVieja t={TT} at={a} out={o} x={1360} y={460} src="s_abuela" w={720} rot={4} cap="Mamá Cuca" />);
ov(8, "una noche de muertos", 4.5, (a, o) => <Stamp t={TT} at={a} out={o} text="PARA LOS MUERTOS" x={1380} y={290} size={80} col={CH.maiz} />);
ov(8, "no la avientes chayito", 5, (a, o) => <Nota t={TT} at={a} out={o} x={1480} y={300} lines={["¡No la avientes,", "Chayito,", "que se machuca!"]} rot={-3} w={540} />);
ov(9, "pesadas como piedra", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="PESADAS COMO PIEDRA" col={CH.maiz} />);
ov(9, "como ocho anos", 4, card(1440, 280, "CHAYITO, 8 AÑOS", "rodándola por la vereda"));
ov(9, "no la avientes", 5, (a, o) => <Nota t={TT} at={a} out={o} x={1480} y={300} lines={["¡No la avientes,", "Chayito, que", "se machuca!"]} rot={3} w={500} />);
ov(10, "se hace a tole", 4, (a, o) => <X.Versus t={TT} at={a} out={o + 1.5} x={960} y={560} a="MAMÁ CUCA" b="TÍA CHONA" rows={[["se queda enterita", true, false], ["sin prisa", true, false]]} w={900} />);
ov(10, "y porque no la bano", 4.5, (a, o) => <><X.Fondo o={0.42 * e(TT, a, a + 0.5) * (1 - e(TT, o - 0.4, o))} /><X.Cita t={TT} at={a} out={o} x={960} y={500} text="Tu tía le tiene prisa. Y no la bañó." who="MAMÁ CUCA" size={84} w={1300} /></>);
ov(10, "tenia su razon", 4, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="cada cosa, su razón" size={92} />);
ov(11, "se llama entacha", 4.5, card(1420, 260, "¿POR QUÉ «EN TACHA»?"));
ov(11, "se llamaban tachas", 5, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="LA TACHA" sub="EL CAZO DEL TRAPICHE" col={CH.maiz} out={o} size={54} />);
ov(11, "un dulce de pobre", 4.5, (a, o) => <Stamp t={TT} at={a} out={o} text="DULCE DE GENTE DE TRABAJO" x={1300} y={290} size={62} col={CH.maiz} />);
ov(12, "olla de barro grande", 4, (a, o) => { const p = sc(TT, CZ); return <Tag t={TT} at={a} x={p.x} y={p.y} dx={320} dy={-230} text="OLLA DE BARRO" sub="HONDA Y CURADA" col={CH.maiz} out={o} size={54} />; });
ov(12, "de fondo grueso", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="SIN BARRO: FONDO GRUESO" col={CH.maiz} />);
ov(12, "como en el camion", 4, (a, o) => <X.Card t={TT} at={a} out={o} x={1450} y={280} from="right"><H s={46} c="#ff8a6a">NO AMONTONADOS</H><H s={42} f={HAND}>acostados, en 1 o 2 camas</H></X.Card>);
// ===== 1 · LA DE CASTILLA =====
ov(13, "secreto numero uno", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={1} text="LA CALABAZA DE CASTILLA" />);
ov(13, "la mas bonita", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="LA MÁS BONITA: ERROR" />);
ov(13, "la charola con plastico", 4.5, (a, o) => <Stamp t={TT} at={a} out={o} text="CHAROLA = PURÉ" x={1380} y={290} size={84} />);
ov(14, "la calabaza de castilla", 4, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="DE CASTILLA" sub="VERDE OSCURO, CÁSCARA DURA" col={CH.maiz} out={o} size={54} />);
ov(14, "la calabaza de halloween", 5, (a, o) => <X.Versus t={TT} at={a} out={o} x={960} y={560} a="HALLOWEEN" b="CASTILLA" rows={[["carne gruesa", false, true], ["aguanta 2 horas", false, true]]} w={900} />);
ov(15, "cuatro pruebas", 5, (a, o) => <X.Senales t={TT} out={o + 12} x={1420} y={420} title="LAS 4 PRUEBAS" rows={[{ a: a + 0.6, text: "1 · la levantas" }, { a: nz(A("le ves el tallo", 15), a + 9), text: "2 · el rabito seco" }, { a: nz(A("la de la una", 16), a + 1e4), text: "3 · la uña" }, { a: nz(A("y la cuarta", 16), a + 1e4), text: "4 · suena hueco" }].map((r) => ({ at: r.a, text: r.text }))} />);
ov(15, "tiene que pesar mas", 4, (a, o) => <X.Bascula t={TT} at={a} out={o} x={1450} y={460} kg={5} label="PESADA" sub="llena, maciza" />);
ov(15, "si el rabito esta verde", 4.5, (a, o) => <Stamp t={TT} at={a} out={o} text="RABITO VERDE: NO" x={1380} y={290} size={78} />);
ov(16, "si la una se mete", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="SI ENTRA LA UÑA: TIERNA" />);
ov(16, "esa es", 3.5, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="NOMÁS UNA RAYITA: ÉSA ES" />);
ov(16, "como tambor", 4, (a, o) => <X.Onoma t={TT} at={a} out={o} x={1350} y={300} text="¡TOC, TOC!" col="#ffcf6a" />);
ov(16, "como trapo mojado", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="SORDO: DÉJALA" x={1380} y={290} size={84} />);
ov(17, "entre 4 y 5 kilos", 4.5, (a, o) => <X.Bascula t={TT} at={a} out={o} x={1450} y={460} kg={5} label="CASTILLA MEDIANA" sub="4 a 5 kilos" />);
ov(17, "el kilo", 5, (a, o) => <Precio t={TT} at={a} out={o} x={1440} y={150} top="$15-25" sub="EL KILO, EN EL TIANGUIS" />);
ov(17, "unos 100 pesos tienes", 5, (a, o) => <Receipt t={TT} rows={[{ at: a, item: "calabaza de Castilla, 5 kg", $: 100 }]} totalAt={1e9} x={1300} y={160} out={o} title="LA OLLA DE MUERTOS" />);
ov(17, "de tres dedos", 4.5, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="3 DEDOS DE CARNE" sub="ANARANJADA FUERTE" col={CH.maiz} out={o} size={52} />);
// ===== 2 · GRANDE Y PICADA =====
ov(18, "secreto numero", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={2} text="SE CORTA GRANDE, Y SE PICA" />);
ov(18, "en cubitos chiquitos", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="CUBITOS: SE DESHACE" x={1380} y={290} size={76} />);
ov(18, "como meter pan", 4, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="…como meter pan a la olla" size={86} />);
ov(19, "es el plato del trozo", 4.5, (a, o) => <X.Cita t={TT} at={a} out={o} x={960} y={520} text="La cáscara es el plato del trozo." who="MAMÁ CUCA" size={84} w={1300} />);
ov(19, "con un mazo de madera", 4, (a, o) => <X.Onoma t={TT} at={a} out={o} x={1350} y={300} text="¡PUM!" col="#ffcf6a" />);
ov(19, "las semillas no se tiran", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="LAS SEMILLAS NO SE TIRAN" col={CH.maiz} />);
ov(20, "como de melon", 4, card(1440, 280, "GAJOS COMO DE MELÓN"));
ov(20, "del tamano de tu mano", 5, (a, o) => <Stamp t={TT} at={a} out={o} text="10 CM · COMO TU MANO" x={1300} y={290} size={72} col={CH.maiz} />);
ov(20, "un trozo chico se rinde", 4, (a, o) => <X.Versus t={TT} at={a} out={o} x={960} y={560} a="CHICO" b="GRANDE" rows={[["aguanta la lumbre", false, true]]} w={860} />);
ov(21, "lo que nadie hace", 4, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="LO QUE NADIE HACE" />);
ov(21, "muchos piquetes", 4.5, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="PIQUETES" sub="SIN LLEGAR A LA CÁSCARA" col={CH.maiz} out={o} size={56} />);
ov(21, "la viruela", 5, (a, o) => <Nota t={TT} at={a} out={o} x={1480} y={300} lines={["Hacerle la", "viruela a la", "calabaza."]} rot={-3} w={500} />);
ov(21, "hasta el corazon", 4.5, (a, o) => <X.Versus t={TT} at={a} out={o} x={960} y={560} a="SIN PIQUETES" b="CON PIQUETES" rows={[["miel hasta el centro", false, true]]} w={980} />);
ov(22, "el que sigue no lo sabe", 5, (a, o) => <BigNum t={TT} at={a} text="EL Nº 3" size={150} y={860} col={CH.maiz} edge="#5a2a10" out={o} sub="EL QUE NO SABE CASI NADIE" />);
ov(22, "firme por fuera", 4.5, (a, o) => <X.Versus t={TT} at={a} out={o} x={960} y={560} a="POR FUERA" b="POR DENTRO" rows={[["firme", true, false], ["suavecita", false, true]]} w={860} />);
// ===== 3 · EL BAÑO DE CAL =====
ov(23, "secreto numero", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={3} text="EL BAÑO DE CAL" />);
ov(23, "si mija cal", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="¡CAL!" x={1380} y={290} size={130} col={CH.maiz} />);
ov(23, "del nixtamal", 4, card(1440, 280, "LA DEL NIXTAMAL", "la de las tortillas"));
ov(23, "cientos de anos", 4.5, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="ASÍ, DESDE HACE SIGLOS" col={CH.maiz} />);
ov(24, "la cal tiene calcio", 9, (a, o) => <X.Senales t={TT} out={o} x={1420} y={420} title="¿POR QUÉ FUNCIONA?" rows={[{ at: a, text: "la cal trae calcio" }, { at: nz(A("se pega a la carne", 24), a + 2), text: "se pega por fuera" }, { at: nz(A("como una piel", 24), a + 4), text: "le hace una piel" }, { at: nz(A("se queda enterito", 24), a + 7), text: "se queda enterito" }]} />);
ov(24, "se hace en grudo", 4, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="…igual que el nixtamal" size={88} />);
ov(25, "en la tlapaleria", 4, card(1440, 280, "TLAPALERÍA O MERCADO", "el puesto del nixtamal"));
ov(25, "la que es para comida", 4, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="CAL PARA NIXTAMAL, DE COMER" />);
ov(25, "12 o 15 pesos", 5, (a, o) => <Precio t={TT} at={a} out={o} x={1440} y={150} top="$12-15" sub="EL KILO · DURA TODO EL AÑO" />);
ov(25, "la cal de construccion", 5, (a, o) => <X.Versus t={TT} at={a} out={o} x={960} y={560} a="CONSTRUCCIÓN" b="NIXTAMAL" rows={[["es de comer", false, true]]} w={900} />);
ov(26, "cuatro litros de agua", 9, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["4 litros de agua fría", a], ["2 cdas soperas de cal", nz(A("dos cucharadas soperas", 26), a + 2)], ["al ras, no copeteadas", nz(A("al ras", 26), a + 4)], ["que queden cubiertos", nz(A("que queden cubiertos", 26), a + 7)]]} />);
ov(26, "como lechosa", 4, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="BLANCA, LECHOSA" col={CH.crema} out={o} size={54} />);
ov(27, "de una a dos horas", 5, (a, o) => <X.Cronometro t={TT} at={a} out={o} x={1450} y={430} mins={120} label="EN LA CAL: 1 A 2 HORAS" />);
ov(27, "dura como piedra", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="TODA LA NOCHE: PIEDRA" x={1300} y={290} size={70} />);
ov(27, "dos o tres veces", 5, (a, o) => <X.Card t={TT} at={a} out={o} x={1450} y={280} from="right"><H s={50} c={CH.maiz}>ENJUAGAR 2 O 3 VECES</H><H s={42} f={HAND}>hasta que el agua no salga blanca</H></X.Card>);
ov(27, "te sabe a cal", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="SIN ENJUAGAR: SABE A CAL" />);
ov(28, "porque la bano chona", 4.5, (a, o) => <><X.Fondo o={0.42 * e(TT, a, a + 0.5) * (1 - e(TT, o - 0.4, o))} /><X.Cita t={TT} at={a} out={o} x={960} y={500} text="Porque la baño, Chona." who="MAMÁ CUCA" size={96} w={1300} /></>);
ov(28, "con la cubeta de cal", 4, (a, o) => <X.Onoma t={TT} at={a} out={o} x={1350} y={300} text="¡TE CACHÉ!" col="#ffcf6a" />);
ov(28, "salio perfecta", 4, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="Y AL AÑO, LE SALIÓ PERFECTA" />);
// ===== 4 · LA CAMA DE CAÑA =====
ov(29, "secreto numero", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={4} text="LA CAMA DE CAÑA EN EL FONDO" />);
ov(29, "la mitad de las calabazas", 4.5, (a, o) => <X.Anillo t={TT} at={a} out={o} x={1450} y={430} pct={50} label="SE QUEMAN AQUÍ" />);
ov(29, "se pega y se quema", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="SE PEGA Y SE QUEMA" x={1380} y={290} size={76} />);
ov(29, "amargo", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="SABOR A QUEMADO EN TODA LA OLLA" />);
ov(30, "una cama de canas", 4.5, (a, o) => { const p = sc(TT, CZ); return <Tag t={TT} at={a} x={p.x} y={p.y} dx={320} dy={-230} text="CAMA DE CAÑAS" sub="COMO PARRILLA" col={CH.maiz} out={o} size={54} />; });
ov(30, "con el machete", 4, (a, o) => <X.Onoma t={TT} at={a} out={o} x={1350} y={300} text="¡ZAS!" col="#ffcf6a" />);
ov(30, "nada se pega", 4, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="NUNCA TOCA EL FONDO" />);
ov(31, "como 10 pesos", 5, (a, o) => <Receipt t={TT} rows={[{ at: a - 1, item: "calabaza, 5 kg", $: 100 }, { at: a, item: "caña, 2 trozos", $: 20 }]} totalAt={1e9} x={1300} y={160} out={o} title="LA OLLA DE MUERTOS" />);
ov(31, "olotes", 4.5, card(1440, 280, "¿SIN CAÑA? OLOTES", "limpios y secos"));
ov(32, "con la cascara para abajo", 4.5, (a, o) => <Stamp t={TT} at={a} out={o} text="CÁSCARA ABAJO" x={1380} y={290} size={84} col={CH.maiz} />);
ov(32, "como si fueran barquitos", 4, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="…como barquitos" size={96} />);
ov(32, "nunca mas de dos camas", 4.5, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="NUNCA MÁS DE DOS CAMAS" />);
// ===== 5 · PILONCILLO =====
ov(33, "secreto numero", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={5} text="EL PILONCILLO, Y CON QUÉ VA" />);
ov(33, "azucar blanca", 5, (a, o) => <X.Versus t={TT} at={a} out={o + 3} x={960} y={560} a="AZÚCAR BLANCA" b="PILONCILLO" rows={[["sabor a caramelo y humo", false, true]]} w={980} />);
ov(33, "se hace a tole", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="AHOGADA = ATOLE" x={1380} y={290} size={80} />);
ov(34, "un kilo y medio", 5, (a, o) => <X.Bascula t={TT} at={a} out={o} x={1450} y={460} kg={1.5} label="PILONCILLO" sub="pa' 5 kilos de calabaza" />);
ov(34, "un cono", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="UN CONO POR KILO" col={CH.maiz} />);
ov(34, "50 pesos el kilo", 5, (a, o) => <Precio t={TT} at={a} out={o} x={1440} y={150} top="$50" sub="EL KILO DE PILONCILLO OSCURO" />);
ov(35, "una taza", 4.5, (a, o) => <BigNum t={TT} at={a} text="1 TAZA" size={150} y={860} col={CH.maiz} edge="#5a2a10" out={o} sub="DE AGUA, Y NADA MÁS" />);
ov(35, "por la orilla", 4, (a, o) => { const p = sc(TT, CZ); return <Tag t={TT} at={a} x={p.x} y={p.y} dx={320} dy={-230} text="POR LA ORILLA" col={CH.maiz} out={o} size={54} />; });
ov(35, "en su propia miel", 4.5, (a, o) => <Nota t={TT} at={a} out={o} x={1480} y={300} lines={["Se cuece en", "su propia miel,", "no en agua."]} rot={-3} w={500} />);
ov(36, "cuatro rajas de canela", 12, (a, o) => <X.Senales t={TT} out={o} x={1420} y={420} title="LO QUE VA CON EL PILONCILLO" rows={[{ at: a, text: "4 rajas de canela" }, { at: nz(A("clavos de olor", 36), a + 2), text: "3 o 4 clavos" }, { at: nz(A("de anis", 36), a + 3), text: "1 cdita de anís" }, { at: nz(A("la cascara de una naranja", 36), a + 5), text: "cáscara de naranja" }, { at: nz(A("seis guayabas", 36), a + 8), text: "6 guayabas" }, { at: nz(A("de tejocotes", 36), a + 9), text: "un puñito de tejocotes" }]} />);
ov(37, "olor de noviembre", 4, (a, o) => <Aroma t={TT} at={a} out={o} x={1180} y={640} />);
ov(37, "pectina", 4.5, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="PECTINA" sub="LA MIEL QUEDA ESPESITA" col={CH.maiz} out={o} size={56} />);
ov(37, "el tejocote amarra la miel", 4.5, (a, o) => <X.Cita t={TT} at={a} out={o} x={960} y={500} text="El tejocote amarra la miel." who="MAMÁ CUCA" size={90} w={1300} />);
// ===== CTA 2 =====
ov(38, "ya estan escritas", 5, (a, o) => <X.Card t={TT} at={a} out={o} x={470} y={170} from="left" col="#ff8fbf"><H s={50} c="#ff8fbf">EN MI LIBRO</H></X.Card>);
ov(38, "en el libro 4", 12, (a, o) => <X.GuiaPag t={TT} at={a + 0.3} out={o} x={1520} y={220} pag={PAG} text="paso por paso, y si te queda aguada" />);
ov(38, "de una hora", 5, (a, o) => <X.Versus t={TT} at={a} out={o} x={960} y={600} a="LA DEL DOMINGO" b="LA DE MUERTOS" rows={[["1 hora", true, false], ["cal y caña", false, true]]} w={980} />);
ov(38, "19 pesos el plato", 5, (a, o) => <Precio t={TT} at={a} out={o} x={1440} y={150} top="$19" sub="7 COMIDAS DE TIANGUIS" />);
ov(38, "el link esta", 8, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(38, "el link esta", 8, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
// ===== 6 · FUEGO BAJITO, SIN CUCHARA =====
ov(39, "secreto numero", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={6} text="EL FUEGO, Y LA CUCHARA QUE NO ENTRA" />);
ov(39, "la lumbre fuerte", 4, (a, o) => <X.FuegoNivel t={TT} at={a} out={o} x={1450} y={430} lvl={3} label="FUERTE: NO" />);
ov(39, "rompe un trozo", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="CADA VUELTA, UN TROZO ROTO" x={1300} y={290} size={62} />);
ov(40, "no se le mete la cuchara", 5, (a, o) => <><X.Fondo o={0.42 * e(TT, a, a + 0.5) * (1 - e(TT, o - 0.4, o))} /><X.Cita t={TT} at={a} out={o} x={960} y={500} text="A la calabaza no se le mete la cuchara." who="MAMÁ CUCA" size={84} w={1300} /></>);
ov(40, "unos diez minutos", 4, (a, o) => <X.FuegoNivel t={TT} at={a} out={o} x={1450} y={430} lvl={2} label="MEDIO, 10 MINUTOS" />);
ov(40, "como de burbujas", 4, (a, o) => <X.Onoma t={TT} at={a} out={o} x={1350} y={300} text="blub… blub…" col="#ffcf6a" />);
ov(40, "mas bajito", 4.5, (a, o) => <X.FuegoNivel t={TT} at={a} out={o} x={1450} y={430} lvl={1} label="Y LUEGO, BAJITO" />);
ov(41, "un trapo limpio de manta", 4.5, (a, o) => { const p = sc(TT, CZ); return <Tag t={TT} at={a} x={p.x} y={p.y} dx={320} dy={-230} text="TRAPO DE MANTA" sub="ENTRE LA OLLA Y LA TAPA" col={CH.maiz} out={o} size={52} />; });
ov(41, "agarra el vapor", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="EL TRAPO AGARRA EL VAPOR" col={CH.maiz} />);
ov(42, "cada 20 minutos", 5, (a, o) => <X.Cronometro t={TT} at={a} out={o} x={1450} y={430} mins={20} label="CADA 20 MIN, A BAÑARLA" />);
ov(42, "como quien bana a un nino", 4, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="…como quien baña a un niño" size={86} />);
ov(42, "banarla", 3.5, (a, o) => <Stamp t={TT} at={a} out={o} text="BAÑARLA" x={1380} y={290} size={110} col={CH.maiz} />);
ov(43, "dos horas y media", 5, (a, o) => <X.Cronometro t={TT} at={a} out={o} x={1450} y={430} mins={150} label="2 A 2½ HORAS, BAJITO" />);
ov(43, "por tres cosas", 14, (a, o) => <X.Senales t={TT} out={o} x={1420} y={420} title="YA ESTÁ CUANDO…" rows={[{ at: a + 0.5, text: "la cáscara: casi negra" }, { at: nz(A("de color ambar", 43), a + 5), text: "la carne: ámbar" }, { at: nz(A("un palillo", 43), a + 10), text: "el palillo entra solo" }]} />);
ov(44, "la prueba del hilo", 4.5, card(1440, 280, "LA PRUEBA DEL HILO", "entre el dedo gordo y el índice"));
ov(44, "si hace un hilito", 4, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="HACE HILITO: YA ESTÁ" />);
ov(44, "ya te pasaste", 4.5, (a, o) => <X.FixCard t={TT} at={a} out={o} x={1420} y={460} prob="DURA COMO CARAMELO" fix={["un chorrito de", "agua caliente"]} fixAt={a + 1.5} />);
ov(45, "el de la noche", 4.5, (a, o) => <BigNum t={TT} at={a} text="EL Nº 7" size={150} y={860} col={CH.maiz} edge="#5a2a10" out={o} sub="EL QUE YA NADIE HACE" />);
// ===== 7 · SU NOCHE =====
ov(46, "secreto numero", 5, (a, o) => <X.Banda t={TT} at={a} out={o} n={7} text="UNA NOCHE EN SU MIEL" />);
ov(46, "no se come el mismo dia", 4.5, (a, o) => <Stamp t={TT} at={a} out={o} text="NO ES EL MISMO DÍA" x={1380} y={290} size={76} />);
ov(46, "no es lo que era", 4, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="…buena, pero no es lo que era" size={80} />);
ov(47, "al sereno", 4.5, card(1440, 280, "AL SERENO", "en la ventana, con su manta"));
ov(47, "jala la miel para adentro", 5, (a, o) => <X.Card t={TT} at={a} out={o} x={1420} y={300} from="right"><H s={52} c={CH.maiz}>AL ENFRIARSE</H><H s={44} f={HAND}>la calabaza jala la miel</H></X.Card>);
ov(47, "como cajeta", 4, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="ESPESA COMO CAJETA" col={CH.maiz} out={o} size={54} />);
ov(48, "31 de octubre", 5, (a, o) => <X.Calendario t={TT} at={a} out={o} x={1450} y={430} flipAt={a + 2.5} a="31" b="1" la="EN LA TARDE" lb="A LA OFRENDA" />);
ov(48, "los muertos la probaran primero", 5, (a, o) => <Nota t={TT} at={a} out={o} x={1480} y={300} lines={["Una noche sola,", "pa' que los muertos", "la prueben primero."]} rot={-3} w={540} />);
ov(49, "al refrigerador", 4.5, (a, o) => <X.Refri t={TT} at={a} out={o} x={1450} y={460} inAt={a + 0.6} />);
ov(49, "cuatro o cinco dias", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="CON SU MIEL: 4 O 5 DÍAS" col={CH.maiz} />);
ov(49, "sin miel", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="SIN MIEL: CORREOSA" x={1380} y={290} size={74} />);
ov(50, "leche bien fria", 4.5, card(1440, 280, "FRÍA, CON LECHE", "la forma de mi abuela"));
ov(50, "color caramelo", 4, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="LECHE COLOR CARAMELO" col={CH.maiz} out={o} size={52} />);
ov(50, "un cafecito de olla", 4, (a, o) => <Pill t={TT} at={a} out={o} x={1400} y={260} text="O CALIENTE, CON CAFÉ DE OLLA" />);
// ===== 5 ERRORES =====
ov(51, "los cinco errores", 4.5, (a, o) => <BigNum t={TT} at={a} text="5 ERRORES" size={150} y={860} col="#ff8a6a" edge="#5a1a10" out={o} sub="LOS QUE VEO SIEMPRE" />);
const ERR: [number, string, string, string][] = [[51, "el primero", "1 · LA CALABAZA EQUIVOCADA", "Castilla, pesada, rabito seco"], [52, "el segundo error", "2 · AHOGARLA EN AGUA", "una taza, y nada más"], [53, "el tercero", "3 · EL FUEGO ALTO", "fuego bajito y paciencia"], [54, "el cuarto", "4 · REVOLVER CON LA CUCHARA", "se baña con el cucharón"], [55, "y el quinto", "5 · SERVIRLA EL MISMO DÍA", "dale su noche"]];
ERR.forEach(([i, ph, prob, fix]) => ov(i, ph, 7, (a, o) => <X.FixCard t={TT} at={a} out={o} x={1400} y={460} prob={prob} fix={[fix]} fixAt={a + 3} />));
ov(52, "como te", 4, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="…la miel, como té" size={92} />);
ov(53, "se pone amarga", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="AMARGA" x={1380} y={290} size={110} />);
ov(54, "de las orejas", 4, card(1440, 280, "SE MENEA LA OLLA", "de las orejas"));
// ===== VARIANTES, PREGUNTAS =====
ov(56, "el camote en tacha", 10, (a, o) => <X.Senales t={TT} out={o} x={1420} y={420} title="CON LA MISMA TÉCNICA" rows={[{ at: a, text: "camote en tacha · 1½ h" }, { at: nz(A("los tejocotes en almibar", 56), a + 4), text: "tejocotes en almíbar · ½ h" }, { at: nz(A("las guayabas en almibar", 56), a + 7), text: "guayabas en almíbar" }]} />);
ov(56, "te ahorras el gas", 4, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="TODO EN LA MISMA OLLA" />);
ov(57, "para un kilo de calabaza", 9, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["1 kg de calabaza", a], ["1 cono de piloncillo", a + 1.5], ["1 raja · 2 guayabas", a + 3], ["½ taza de agua", a + 5], ["1 cdita de cal en 1 litro", a + 6.5]]} />);
ov(57, "en una hora y cuarto", 4, (a, o) => <X.Cronometro t={TT} at={a} out={o} x={1450} y={430} mins={75} label="OLLA CHICA: 1¼ HORAS" />);
ov(58, "en olla express", 4.5, card(1440, 280, "¿EN OLLA EXPRÉS?", "se puede… pero no"));
ov(58, "en 15 minutos", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="PURÉ EN 15 MINUTOS" x={1380} y={290} size={74} />);
ov(58, "de mi libro", 6, (a, o) => <X.GuiaPag t={TT} at={a} out={o} x={1520} y={220} pag={PAG} text="la del domingo: 1 hora, destapada" />);
ov(59, "si la cal es peligrosa", 4.5, card(1440, 280, "¿LA CAL ES PELIGROSA?", "2 cdas en 4 litros, bien enjuagada"));
ov(59, "no la respires", 8, (a, o) => <X.Senales t={TT} out={o} x={1420} y={420} title="CUIDADO CON LA CAL" rows={[{ at: a, text: "no la respires" }, { at: a + 1.5, text: "lejos de los ojos" }, { at: nz(A("lejos de los ninos", 59), a + 3), text: "lejos de los niños" }, { at: nz(A("un frasco cerrado", 59), a + 4.5), text: "frasco cerrado, con su nombre" }]} />);
// ===== LA CUENTA =====
ov(60, "la calabaza unos 100 pesos", 30, (a, o) => <Receipt t={TT} sc={0.7} rows={[
  { at: a, item: "calabaza de Castilla, 5 kg", $: 100 }, { at: nz(A("el piloncillo kilo y medio", 60), a + 3), item: "piloncillo, 1½ kg", $: 75 }, { at: nz(A("la canela", 60), a + 6), item: "canela", $: 20 },
  { at: nz(A("las guayabas y los tejocotes", 60), a + 8), item: "guayabas y tejocotes", $: 35 }, { at: nz(A("las canas", 60), a + 11), item: "cañas", $: 20 }, { at: nz(A("la naranja", 60), a + 12), item: "naranja", $: 5 },
  { at: nz(A("la cal que te dura", 60), a + 13), item: "cal (dura el año)", $: 2 }, { at: nz(A("y el gas", 60), a + 16), item: "gas, 2½ horas", $: 15 }]}
  totalAt={nz(A("son como", 60), a + 20)} x={1420} y={110} out={o} title="25 TROZOS" />);
ov(61, "son 11 pesos", 5, (a, o) => <Precio t={TT} at={a} out={o} x={1440} y={150} top="$11" sub="EL TROZO, EN TU CASA" />);
ov(61, "en la fonda", 5, (a, o) => <Precio t={TT} at={a} out={o} x={470} y={150} top="$35-45" sub="EL TROZO, EN LA FONDA" />);
ov(61, "mas de 900 pesos", 4.5, (a, o) => <X.Gente t={TT} at={a} out={o} x={960} y={560} n={25} label="25 TROZOS EN LA FONDA: +$900" cols={13} />);
ov(61, "mas de 600 pesos", 5, (a, o) => <X.Cifra t={TT} at={a} out={o} x={960} y={520} to={600} pre="+$" sub="LO QUE TE AHORRAS" col={CH.maiz} />);
// ===== SEMILLAS, OFRENDA =====
ov(62, "en una coladera", 9, (a, o) => <Lista t={TT} at={a} out={o} x={1400} y={300} rows={[["lavarlas en coladera", a], ["al sol, en el petate", nz(A("en un petate", 62), a + 3)], ["al comal, 5 minutos", nz(A("en el comal", 62), a + 6)], ["sal, limón y chile", nz(A("les echaba sal", 62), a + 9)]]} />);
ov(62, "esas son las pepitas", 4, (a, o) => <Stamp t={TT} at={a} out={o} text="LAS PEPITAS" x={1380} y={290} size={96} col={CH.maiz} />);
ov(62, "te cuesta 20 pesos", 4.5, (a, o) => <Precio t={TT} at={a} out={o} x={1440} y={150} top="$20" sub="LA BOLSITA, EN EL MERCADO" />);
ov(63, "con un vaso de leche", 4.5, card(1440, 280, "EN LA OFRENDA", "su plato de barro y su leche"));
ov(63, "la foto de mi abuelo", 5, (a, o) => <X.FotoVieja t={TT} at={a} out={o} x={1360} y={460} src="s_ofrenda_vieja" w={720} rot={-4} cap="el abuelo" />);
ov(64, "al panteon del pueblo", 4.5, (a, o) => <Tag t={TT} at={a} x={980} y={560} dx={300} dy={-240} text="EL PANTEÓN" sub="VELAS Y CEMPASÚCHIL" col="#ffb257" out={o} size={54} />);
ov(64, "se comparte", 5, (a, o) => <><X.Fondo o={0.42 * e(TT, a, a + 0.5) * (1 - e(TT, o - 0.4, o))} /><X.Cita t={TT} at={a} out={o} x={960} y={500} text="La calabaza se comparte. Con los vivos y con los muertos." who="DOÑA CHAYO" size={76} w={1400} /></>);
ov(65, "mi viejo lupe", 4.5, card(1440, 280, "MI VIEJO LUPE", "partiendo la caña"));
ov(65, "mi hermana licha", 4.5, card(1440, 280, "MI HERMANA LICHA", "picando con el tenedor"));
// ===== REPASO, CIERRE =====
ov(66, "vamos a repasar", 4, (a, o) => <Palomita t={TT} at={a} out={o} y={240} text="LOS 7, RAPIDITO" />);
ov(68, "en los comentarios", 5, card(1400, 300, "¿PARA QUIÉN LA PUSISTE?", "en los comentarios, los leo todos"));
ov(68, "el link esta", 7, (a, o) => <X.DescCard t={TT} at={a} out={o} x={1440} y={780} hl={a + 1.2} />);
ov(68, "el link esta", 7, (a, o) => <QR t={TT} at={a + 0.4} out={o} x={420} y={700} />);
ov(69, "suscribete", 4, card(1400, 300, "SUSCRÍBETE", "y el próximo secreto te llega primero"));
ov(69, "noche de muertos", 5, (a, o) => <Pensado t={TT} at={a} out={o} x={1250} y={300} text="…que lleguen con antojo de lo dulce" size={78} />);

// cada pieza resuelve su segundo UNA vez
const OVT = OV.map(([i, ph, d, f]) => { const a = A(ph, i); return { a, b: a + d, f }; }).filter((o) => Number.isFinite(o.a));
const Ov = (t: number): React.ReactNode[] => {
  TT = t;
  const L: React.ReactNode[] = [];
  OVT.forEach((o, k) => { if (t >= o.a - 0.4 && t < o.b + 0.6) L.push(<React.Fragment key={"o" + k}>{o.f(o.a, o.b - 0.2)}</React.Fragment>); });
  // los platos: en la promesa (uno por secreto), al servirse y en el repaso
  const lab = (ats: number[], a: number, b: number) => { if (t >= a - 0.4 && t < b + 0.6) PLATES.forEach((q, i) => { if (!Number.isFinite(ats[i])) return; const p = sc(t, q); L.push(<X.PlateLabel key={"pl" + a + i} t={t} at={ats[i] + i * 0.05} out={b - 0.2} x={p.x} y={p.y} n={i + 1} text={ROT[i]} up={i % 2 ? 250 : 130} />); }); };
  lab(PROM, nz(PROM[0], 0), PT0(5));
  lab(RES, nz(RES[0], PT0(66)), PT0(68));
  SERVE.forEach((sv, i) => { if (t >= sv && t < sv + 4.5) { const p = sc(t, PLATES[i]); L.push(<Tag key={"sv" + i} t={t} at={sv + 0.3} x={p.x} y={p.y} dx={240} dy={-210} text={"PLATO " + (i + 1)} sub={i === 6 ? "LOS SIETE, SERVIDOS" : "SERVIDO"} col={CH.maiz} out={sv + 4.2} size={50} />); } });
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
      // portal desde la olla hacia la toma que sigue
      if (nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, CZ); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} i={idx + 1} d={nx.b - nx.a + 0.7} /></Portal>); }
      }
    }
  } else L.push(<World key="w0" t={t} />);
  L.push(...Ov(t));
  // vapor en cada costura entre dos partes seguidas que no son portal (toma→toma, toma→mundo)
  if (idx >= 0) [idx - 1, idx].forEach((k) => { const p = PARTS[k], nx = PARTS[k + 1]; if (p && nx && Math.abs(nx.a - p.b) < 1e-6 && !(!p.c && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<SteamWipe key={"sw" + k} t={t} mid={p.b} w={0.38} />); });
  FLIP.forEach((a, i) => { if (Number.isFinite(a) && Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
