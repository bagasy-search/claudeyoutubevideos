// chayotort · EL VIDEO ENTERO de las tortillas (0 s → final). Mismo mundo y misma cámara de principio a fin: la cocina de adobe,
// la mesa con sus siete platos de barro (uno por secreto: al cerrar cada secreto su plato se sirve con tortillas), el recetario de
// mamá Cuca que pasa una hoja por secreto, la cazuela de masa, la prensa de madera, el comal donde la gota baila y la tortilla se
// infla, y el chiquihuite con su servilleta que se va llenando. Entre mundo y toma real sólo portales y vapor; el avatar entra en
// sus ventanas. Cada pieza nace con la palabra que la nombra (at("frase")).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PT2, PLATES, TABLE_Y, screenOf, camSpeed, setKeys, clearKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import PJ from "./parts.json";
import { BigNum, CH, Flash, HAND, P, Portal, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Nota, Pensado, Palomita, Stamp, Precio, Pill } from "./Min1";
import * as X from "./piezas";
import * as N from "./nuevas";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= 0.05);
const inAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
export const REST_START = 0;
export const END_T = (PJ as { end: number }).end;
// at() a prueba de ASR: si la frase no aparece cerca, cae en `after + 0.3` (nunca rompe el render)
const A = (ph: string, after: number) => { try { const v = at(ph, after); return v - after > 30 ? after + 0.3 : v; } catch { return after + 0.3; } };
const SN = (n: string, num: string, after: number) => { const a = A("secreto numero " + n, after), b = A("secreto numero " + num, after); return Math.min(a, b); };

// ---------------- cámaras con nombre ----------------
type Cam = { p: V; l: V; fov?: number };
const CZ = PT.cazuela;
const C: Record<string, Cam> = {
  top: { p: [0, 3.6, 0.95], l: [0, 0.8, 0.12], fov: 40 }, topB: { p: [0.18, 3.95, 1.0], l: [0, 0.8, 0.12], fov: 40 }, topC: { p: [-0.15, 3.35, 0.9], l: [0, 0.8, 0.12], fov: 40 },
  wide: { p: [1.9, 1.95, 2.7], l: [-0.6, 0.8, -1.3], fov: 42 }, wide2: { p: [1.5, 1.9, 2.4], l: [-0.8, 0.8, -1.6], fov: 42 },
  fogon: { p: [-0.55, 1.4, -0.75], l: [-1.3, 0.95, -2.4], fov: 38 }, fogon2: { p: [-0.78, 1.3, -1.05], l: [-1.3, 0.8, -2.4], fov: 38 },
  comal: { p: [-0.55, 1.9, -0.7], l: [-1.3, 0.94, -2.5], fov: 32 }, comal2: { p: [-0.75, 1.75, -1.0], l: [-1.3, 0.94, -2.5], fov: 30 },
  comalT: { p: [-1.2, 2.6, -1.6], l: [-1.3, 0.94, -2.5], fov: 40 }, comalT2: { p: [-1.15, 2.45, -1.72], l: [-1.3, 0.94, -2.5], fov: 37 },
  pots: { p: [-0.2, 1.6, -1.2], l: [0.9, 1.95, -2.86], fov: 40 }, repisa: { p: [1.3, 1.55, -1.5], l: [1.6, 1.45, -2.82], fov: 38 }, repisa2: { p: [1.7, 1.5, -1.75], l: [1.6, 1.45, -2.82], fov: 36 },
  caz: { p: [0.85, 1.48, 1.2], l: CZ, fov: 36 }, caz2: { p: [0.55, 1.32, 0.6], l: CZ, fov: 33 }, cazL: { p: [-0.9, 1.45, 1.0], l: CZ, fov: 36 }, cazL2: { p: [-0.6, 1.35, 0.7], l: CZ, fov: 34 },
  cazT: { p: [0.32, 1.78, 0.6], l: [0, 0.92, -0.17], fov: 30 }, cazT2: { p: [0.24, 1.64, 0.46], l: [0, 0.92, -0.17], fov: 28 },
  libro: { p: [1.12, 1.42, 0.28], l: [0.88, 0.82, -0.3], fov: 34 }, libro2: { p: [1.0, 1.2, 0.02], l: [0.88, 0.82, -0.3], fov: 30 },
  charola: { p: [-0.55, 1.3, 0.75], l: PT2.charola, fov: 34 }, charolaT: { p: [-0.72, 1.62, 0.4], l: PT2.charola, fov: 34 },
  remojo: { p: [1.05, 1.45, 0.15], l: PT2.remojo, fov: 34 }, remojo2: { p: [0.7, 1.18, -0.12], l: PT2.remojo, fov: 31 },
  limon: { p: [3.0, 1.5, 1.6], l: [5.4, 1.3, -1.6], fov: 50 }, limon2: { p: [3.6, 1.2, 0.9], l: [5.3, 0.9, -1.4], fov: 46 },
  patio: { p: [6.6, 1.75, 3.6], l: [10, 1.0, 0.8], fov: 42 }, patio2: { p: [6.9, 1.7, 3.4], l: [10, 1.0, 0.8], fov: 42 },
  mercado: { p: [6.6, 1.5, 7.6], l: [6.6, 0.95, 5.4], fov: 38 }, mercado2: { p: [6.25, 1.3, 6.7], l: [6.6, 0.95, 5.4], fov: 35 },
  canasta: { p: [-1.9, 1.15, 1.7], l: [-2.6, 0.25, 0.8], fov: 38 }, salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
};
PLATES.forEach((q, i) => { C["pl" + i] = { p: [q[0], 1.25, 0.95], l: [q[0], 0.82, 0.33], fov: 34 }; C["pl" + i + "b"] = { p: [q[0], 1.08, 0.7], l: [q[0], 0.82, 0.33], fov: 32 }; });
C.chiq = { p: [-0.6, 1.35, 0.25], l: [-1.05, 0.83, -0.3], fov: 34 };
C.chiq2 = { p: [-0.82, 1.17, 0.05], l: [-1.05, 0.83, -0.3], fov: 30 };

// ---------------- la línea de tiempo (parts.json, de los segmentos de la voz entre las ventanas del avatar) ----------------
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string; pt?: V; z?: [number, number]; sec?: string };
const PARTS: Part[] = (PJ as { parts: Part[] }).parts.map((p, i, arr) => {
  const nx = arr[i + 1];
  // si la toma real sigue pegada a una parte de mundo, se abre por un portal desde lo que mira la cámara
  return !p.c && nx?.c && Math.abs(nx.a - p.b) < 1e-6 ? { ...p, pt: C[p.k1!].l } : p;
});
clearKeys(); // el minuto 1 del kit (mole) deja sus llaves al importarse: fuera
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!], k1 = C[p.k1!];
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partAt = (t: number) => PARTS.find((p) => t >= p.a && t < p.b);
const plPart = (i: number) => PARTS.find((p) => p.k0 === "pl" + i)!;

// ---------------- recetario: una hoja por secreto ----------------
const RECETARIO = [
  { l: ["# Tortillas", "de mi mamá Cuca", "", "Un chiquihuite", "pa' todo el rancho.", "", "— Refugio, 1966"], r: ["agua tibia, y la bolita", "que descanse, tapada", "prensa con plástico", "comal que baile la gota", "las tres vueltas", "directo a la servilleta", "guardar y recalentar"] },
  { l: ["# 1. La masa", "2 tazas de harina", "pizquita de sal", "1½ taza de agua TIBIA", "poco a poco", "amasar 3 ó 4 min"], r: ["como plastilina", "", "la bolita de nuez:", "se cuartea = agua", "se pega = harina", "lisita = lista"] },
  { l: ["# 2. Descansa", "20 min, media hora", "trapo húmedo encima", "", "SIEMPRE TAPADA"], r: ["sacas bolita, tapas", "al aire: costrita", "en 5 minutos", "", "¿seca? manos mojadas", "y a amasar otra vez"] },
  { l: ["# 3. La prensa", "plástico de bolsa", "nunca papel", "bolita de 40 g", "hacia la bisagra"], r: ["apretar una vez", "media vuelta, otra", "2 milímetros", "", "despegar al revés", "nunca jalarla"] },
  { l: ["# 4. El comal", "fuego medio alto", "10 min antes", "SIN GRASA", "", "las gotas BAILAN"], r: ["de barro: curado", "con cal", "de fierro: limpio", "", "por fuera rápido,", "el agua adentro"] },
  { l: ["# 5. Tres vueltas", "1ª: 15-20 segundos", "2ª: 40 segundos,", "manchitas cafés", "3ª: se infla"], r: ["si no se infla,", "apretar la orilla", "con la servilleta", "", "se infla = cocida", "y con su humedad"] },
  { l: ["# 6. La servilleta", "del comal directo", "al chiquihuite", "tapada, una encima", "de otra"], r: ["sudan 10-15 min", "se cuecen con", "su propio vapor", "", "en el plato:", "cartón en 10 min"] },
  { l: ["# 7. Guardar", "envueltas en la tela", "en bolsa, al refri", "3 ó 4 días"], r: ["recalentar:", "manos mojadas", "comal bien caliente", "20 s y 20 s", "y a la servilleta"] },
];
const GUIA = [
  { l: ["# Las 5 Ollas de", "# Doña Chayo", "", "Libro 2", "Las Mañanas del Rancho", "", "recetas de mi abuela", "con sus pesos"], r: ["Martes:", "Tortillas de Harina", "con Piloncillo ....... 77", "", "El truco de Chayo:", "tápalas con un trapo", "al salir del comal"] },
  { l: ["# Libro 4", "# La Quincena Flaca", "", "Plan 4", "La Semana de los $400"], r: ["Huevo, Papa", "y Tortilla ........ 65", "", "28 platos", "unos $15 el plato"] },
];

// ---------------- tiempos clave ----------------
const SEC = (PJ as unknown as { secs: [string, number][] }).secs;
const secStart = (n: string) => (SEC.find(([k]) => k === n) ?? ["", 0])[1];
const SECRETS = ["UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE"];
const FLIP = SECRETS.map((n) => secStart(n) + 0.4);
const SERVE = SECRETS.map((_, i) => plPart(i).a + 0.5);
const PROM = [A("con que agua", 87), A("cuanto tiempo descansa", 91), A("como se prensa", 93), A("como tiene que estar", 94), A("las tres vueltas", 96), A("donde se guardan", 97), A("como se recalientan", 100)];
const RES = [A("uno la masa", 974), A("dos que descanse", 979), A("tres prensa", 983), A("cuatro comal", 988), A("cinco las tres", 993), A("seis del comal", 996), A("siete se guardan", 1001)];
const isGuia = (t: number) => (t >= 136.4 && t < 165.0) || (t >= 831.3 && t < 864.0);
const G1 = A("lo fui apuntando", 136), G1P = A("setenta y siete", 145), G2 = 831.4, G2P = A("libro cuatro", 836);
const PONE = A("pones la tortilla", 536), INFLA = A("se empieza a inflar", 564), APRIETA = A("y aprietas con fuerza", 425), ABRE = A("abres la prensa", 447);
const GOTA = A("unas gotitas", 492), HOT = A("si brincan", 499);

const CHIQ: V = [-1.05, TABLE_Y + 0.05, -0.3];

const worldAt = (t: number): WorldProps => {
  const guia = isGuia(t);
  const plateServed = PLATES.map((_, i) => win(t, SERVE[i], SERVE[i] + 1.2));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, 113.0, 113.4)),
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 2, SERVE[i] + 3)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, 1005, 1005.3)),
  ));
  const k0 = partAt(t)?.k0 ?? "";
  // la tortilla en el comal: el gancho (inflada), las tres vueltas (se cuece y se infla), recalentar, la tarea
  let tort = 0, puff = 0;
  if (t < 30) { tort = 1; puff = 1; }
  else if (t >= 469 && t < 482) tort = 0.22;                                                     // comal tibio: pálida
  else if (t >= 534 && t < 604.6) { tort = win(t, PONE, PONE + 0.6) * (0.35 + 0.65 * win(t, PONE + 1, 562)); puff = win(t, INFLA, INFLA + 2.5); }
  else if (t >= 604.6 && t < 628) { tort = 1; puff = 1 - win(t, 606, 610) * 0.7; }
  else if (t >= 706 && t < 736) { tort = 0.75; puff = 0; }
  else if (t >= 1013 && t < 1020) { tort = 1; puff = win(t, 1016, 1018); }
  const gotas = (t >= GOTA && t < 514) || (t >= 990 && t < 996) || (t >= 1012 && t < 1016) ? (t < HOT && t < 514 ? 0.6 : 1) : 0;
  const prensa = (t >= 400 && t < 466) || (t >= 875 && t < 892) ? 1 + ei(t, APRIETA, APRIETA + 0.6) * (1 - ei(t, ABRE, ABRE + 0.6)) * (t < 466 ? 1 : 0) : 0;
  const chiqui = t < 604 ? 6 : 6 + Math.round(10 * win(t, 611, 650));
  return {
    t,
    fire: t >= 469 && t < 485 ? 0.45 : t >= 485 && t < 600 ? 1.25 : 1,
    steamCaz: 0, steamComal: /^comal/.test(k0) ? 0.2 : 0.6,
    ojitos: 0,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.12 * v),
    plateFill: PLATES.map((_, i) => (t < 113.4 ? win(t, PROM[i], PROM[i] + 0.4) : 0) + (t >= 974 && t < 1005 ? win(t, RES[i], RES[i] + 0.4) : 0)),
    book: guia
      ? { open: ei(t, t < 500 ? G1 + 0.2 : G2, (t < 500 ? G1 + 0.2 : G2) + 1.2), flip: t < 500 ? 0 : ei(t, G2P, G2P + 0.9), pages: GUIA }
      : { open: 1, flip: FLIP.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO },
    guia: guia ? 1 : 0,
    partyPeople: t >= 1036 ? 1 : 0,
    patioLights: win(t, 1038, 1043),
    remojo: (t >= 257 && t < 301) || (t >= 706 && t < 720) ? 1 : 0,
    tort, puff, gotas, prensa, chiqui,
    top: k0.startsWith("top") ? 1 : 0,
  };
};

const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((wn, i) => (
    <Sequence key={i} from={Math.max(0, s(wn.ms) - 10)} durationInFrames={s(wn.me - wn.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= wn.ms - 0.02 && t < wn.me ? 1 : 0 }}><OffthreadVideo src={staticFile("av/chayotort/reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};
// el clip (~3 s) es más corto que su parte: arranca con la foto (= su primer cuadro) y el clip entra al final, a 0,8x
const CLIPDUR = (AVAIL as unknown as { dur: Record<string, number> }).dur;
const Clip: React.FC<{ k: string; t: number; a: number; b: number; z?: [number, number] }> = ({ k, t, a, b, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const c0 = Math.max(a, b - (CLIPDUR[k] - 0.15) / 0.8);
  const inner = CLIPS.has(k) && t >= c0
    ? <Sequence from={s(c0)} layout="none"><OffthreadVideo src={staticFile("broll/chayotort/" + k + ".mp4")} playbackRate={0.8} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ---------------- las piezas, cada una clavada a su palabra ----------------
const sc = (t: number, q: V) => screenOf(t, q);
const PL = (i: number) => PLATES[i];
const COMAL = PT2.comal, CHAROLA = PT2.charola;
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const on = (a: number, b: number) => t >= a - 0.4 && t < b + 0.6;
  const add = (a: number, b: number, f: () => React.ReactNode) => { if (on(a, b)) L.push(<React.Fragment key={"o" + a.toFixed(2) + "_" + L.length}>{f()}</React.Fragment>); };
  const tag = (a: number, b: number, q: V, ph: string, text: string, sub?: string, dx = 300, dy = -220, col = CH.maiz, size = 54) =>
    add(a, b, () => { const p = sc(t, q); return <Tag t={t} at={A(ph, a - 1)} x={p.x} y={p.y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={b - 0.2} size={size} />; });
  const card = (a: number, b: number, ph: string, big: string, small?: string, side: "l" | "r" = "r", y = 280) =>
    add(a, b, () => <X.Card t={t} at={A(ph, a - 1)} out={b - 0.2} x={side === "r" ? 1440 : 480} y={y} from={side === "r" ? "right" : "left"}><X.H s={54} c={CH.maiz}>{big}</X.H>{small && <X.H s={44} f={HAND}>{small}</X.H>}</X.Card>);
  const banda = (a: number, b: number, n: number, num: string, text: string) => add(a, b, () => <X.Banda t={t} at={SN(["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete"][n], num, a - 1)} out={b - 0.2} n={n} text={text} />);
  const served = (i: number) => { const p0 = plPart(i); add(p0.a, p0.b, () => { const p = sc(t, PL(i)); return <Tag t={t} at={SERVE[i]} x={p.x} y={p.y} dx={i < 4 ? 240 : -260} dy={-210} text={"PLATO " + (i + 1)} sub="SERVIDO" col={CH.maiz} out={p0.b - 0.2} size={50} />; }); };
  const lista = (a: number, b: number, ph: string, head: string, rows: [string, string][], side: "l" | "r" = "l", y = 420) =>
    add(a, b, () => <X.Card t={t} at={A(ph, a - 1)} out={b - 0.2} x={side === "r" ? 1440 : 480} y={y} from={side === "r" ? "right" : "left"}><X.H s={50} c={CH.maiz}>{head}</X.H>{rows.map(([l, p]) => <X.H key={l} s={42} f={HAND} c={t >= A(p, a - 1) ? CH.crema : "transparent"}>{l}</X.H>)}</X.Card>);

  // ===== el gancho =====
  tag(3.7, 8.5, COMAL, "inflada como globito", "INFLADA COMO GLOBITO", "RECIÉN SALIDA DEL COMAL");
  add(8.5, 13.6, () => <Palomita t={t} at={A("sin romperse", 8.6)} out={13.4} y={240} text="SE DOBLA SIN ROMPERSE" />);
  add(13.6, 17.6, () => <Nota t={t} at={A("en la tarde", 13.6)} out={17.4} x={1480} y={300} lines={["En la tarde,", "y mañana:", "igual de suave."]} rot={-3} w={420} />);
  add(17.6, 21.2, () => <Pill t={t} at={A("masa cara", 18)} out={21.0} x={1380} y={300} text="LA MASA CARA" />);
  tag(21.2, 23.9, CHIQ, "despues del comal", "DESPUÉS DEL COMAL", "AHÍ ESTÁ EL SECRETO");
  card(23.9, 30.4, "mi hermano chencho", "MI HERMANO CHENCHO", "su kilo, envuelto en papel", "l", 260);
  add(30.4, 35.8, () => <Precio t={t} at={A("veintiocho pesos", 30)} out={35.6} x={1440} y={140} top="$28" sub="EL KILO EN LA TORTILLERÍA" />);
  add(35.8, 42.1, () => <><Stamp t={t} at={A("tiesas como carton", 36)} out={41.9} text="TIESAS COMO CARTÓN" x={1340} y={260} size={84} /><X.Card t={t} at={A("se rompian", 38)} out={41.9} x={480} y={820} from="left"><X.H s={46} f={HAND}>se rompían al doblarlas</X.H></X.Card></>);
  add(42.1, 48.3, () => <Pensado t={t} at={A("como le hago", 45)} out={48.1} x={1250} y={300} text="¿y cómo le hago pa' que no se pongan duras?" size={74} />);
  add(48.3, 52.7, () => <Nota t={t} at={A("comprelas diario", 49)} out={52.5} x={1480} y={300} lines={["Pos cómprelas", "diario, señora."]} rot={4} w={440} />);
  add(57.2, 61.3, () => <Pill t={t} at={A("gruesas", 58)} out={61.1} x={1380} y={300} text="GRUESAS Y SECAS" />);
  lista(61.3, 66.0, "cuarteadas", "TE PASA QUE...", [["las orillas se cuartean", "cuarteadas"], ["no se inflan", "no se inflan"], ["se pegan al plástico", "se pegan en el plastico"]]);
  add(66.0, 70.9, () => <Stamp t={t} at={A("duras como suela", 67)} out={70.7} text="DURAS COMO SUELA" x={1340} y={260} size={90} />);
  add(70.9, 76.1, () => <Pensado t={t} at={A("no tengo mano", 71)} out={75.9} x={1250} y={300} text="pos yo no tengo mano..." size={90} />);
  add(76.1, 81.5, () => <><X.Fondo o={0.4 * e(t, 76.2, 76.6) * (1 - e(t, 79.2, 79.6))} /><X.Cita t={t} at={A("no eres tu", 76)} out={79.4} x={960} y={500} text="No eres tú. Nadie te enseñó el orden." size={92} /></>);

  // ===== la promesa: un plato por secreto =====
  const LBL = ["agua tibia", "descanso", "prensa", "comal", "tres vueltas", "servilleta", "recalentar"];
  add(81.5, 86.0, () => <BigNum t={t} at={A("siete secretos", 81)} out={85.8} text="7 SECRETOS" size={150} y={190} col={CH.maiz} edge="#5a2a10" sub="EN EL ORDEN EN QUE SE USAN" />);
  add(86.0, 91.5, () => <X.Orden t={t} at={86.1} out={91.3} steps={[{ label: "1 · ¿con qué agua?", at: PROM[0] }, { label: "¿y ya está?", at: A("como saber", 89) }]} />);
  add(91.5, 97.0, () => PLATES.map((q, i) => { const p = sc(t, q); return i < 4 ? <X.PlateLabel key={i} t={t} at={Math.max(91.55, PROM[i])} out={96.8} x={p.x} y={p.y} n={i + 1} text={LBL[i]} /> : null; }));
  add(97.0, 101.3, () => <X.Orden t={t} at={97.1} out={101.1} steps={[{ label: "5 · tres vueltas", at: 97.2 }, { label: "6 · servilleta", at: PROM[5] }]} />);
  add(101.3, 108.1, () => <><X.Orden t={t} at={101.4} out={104.9} steps={[{ label: "7 · recalentar", at: PROM[6] }]} /><Palomita t={t} at={A("ni un peso mas", 104)} out={107.9} y={240} text="NI UN PESO MÁS" /></>);
  add(108.1, 112.7, () => <Stamp t={t} at={A("secreto numero seis", 108)} out={112.5} text="EL Nº 6: EL QUE NO TE DICEN" x={960} y={250} size={72} />);
  add(112.7, 124.4, () => <LowerThird t={t} at={A("yo soy rosario", 112)} out={124.2} name="DOÑA CHAYO" l2="67 AÑOS · RANCHO DE PÁTZCUARO" l2at={A("sesenta y siete", 117)} />);
  add(118.0, 124.4, () => <X.MapaMich t={t} at={A("patzcuaro", 120)} out={124.2} x={1380} y={430} />);
  card(124.4, 130.7, "fogon de lena", "FOGÓN DE LEÑA", "y tortillas a mano, diario");

  // ===== CTA 1: la guía, de verdad =====
  card(136.4, 141.6, "lo fui apuntando", "LO FUI APUNTANDO", "todo lo que me enseñó", "l", 240);
  add(141.6, 146.7, () => <><X.Fondo o={0.45 * e(t, 141.7, 142.1) * (1 - e(t, 146.3, 146.7))} /><N.PaginaReal t={t} at={A("las cinco ollas", 141)} out={146.5} x={960} y={520} a="guia_l2_tapa.jpg" w={560} cap="Las 5 Ollas de Doña Chayo" /></>);
  add(146.7, 151.9, () => <N.PaginaReal t={t} at={146.8} out={151.7} x={1450} y={560} a="guia_l2_tapa.jpg" b="guia_l2_p77.jpg" flipAt={A("setenta y siete", 146)} w={600} rot={3}
    hl={[{ at: A("piloncillo", 148), y0: 0.08, y1: 0.115 }]} cap="Libro 2 · pág. 77" />);
  add(151.9, 156.2, () => <N.PaginaReal t={t} at={152.0} out={156.0} x={1300} y={560} a="guia_l2_p77.jpg" w={620} rot={-3} hl={[{ at: A("el truco", 153), y0: 0.785, y1: 0.83 }]} cap="El truco de Chayo" />);
  add(156.2, 160.9, () => <Palomita t={t} at={A("tapalas con un trapo", 156)} out={160.7} y={240} text="TÁPALAS CON UN TRAPO AL SALIR DEL COMAL" />);
  add(160.9, 165.0, () => <X.DescCard t={t} at={A("por donde conseguir", 160)} out={164.8} x={1440} y={780} hl={A("primera linea", 162)} />);

  // ===== la historia =====
  add(170.0, 172.7, () => <X.Card t={t} at={A("mama cuca", 169)} out={172.5} x={480} y={240} from="left"><X.H s={60} c={CH.maiz}>MAMÁ CUCA</X.H><X.H s={44} f={HAND}>se llamaba Refugio</X.H></X.Card>);
  card(172.7, 175.2, "las cinco de la manana", "5 DE LA MAÑANA", "todavía oscuro", "l", 240);
  add(175.2, 180.7, () => <Nota t={t} at={A("nixtamal", 175)} out={180.5} x={1480} y={300} lines={["El nixtamal,", "reposando desde", "la noche."]} rot={-3} w={440} />);
  card(180.7, 186.1, "al molino", "AL MOLINO DEL PUEBLO", "y de regreso, la masa calientita");
  tag(186.1, 192.0, CHIQ, "chiquihuite", "UN CHIQUIHUITE LLENO", "PA' TODO EL RANCHO");
  add(192.0, 198.0, () => <X.Card t={t} at={A("siete anos", 191)} out={195.4} x={480} y={240} from="left"><X.H s={56} c={CH.maiz}>7 AÑOS</X.H><X.H s={44} f={HAND}>mi trabajo: echar las bolitas</X.H></X.Card>);
  add(198.0, 202.4, () => <Pensado t={t} at={A("por que sus tortillas", 197)} out={202.2} x={1250} y={300} text="¿por qué las suyas siguen suaves en la tarde?" size={70} />);
  add(202.4, 208.7, () => <><X.Fondo o={0.4 * e(t, 203.4, 203.8) * (1 - e(t, 208.3, 208.7))} /><X.Cita t={t} at={A("porque la tortilla", 202)} out={208.5} x={960} y={500} text="La tortilla no se acaba en el comal. Se acaba en la servilleta." who="MAMÁ CUCA" size={80} /></>);
  add(208.7, 214.9, () => <Palomita t={t} at={A("sin pensar", 210)} out={214.7} y={240} text="LO QUE HACÍA SIN PENSAR, Y POR QUÉ FUNCIONA" />);
  card(214.9, 219.3, "maiz cocido con cal", "NIXTAMAL", "maíz cocido con cal");
  lista(219.3, 224.7, "un kilo de maiz", "EL NIXTAMAL", [["1 kg de maíz blanco", "un kilo de maiz"], ["2½ L de agua", "dos litros"], ["1 cucharada de cal", "cucharada de cal"]]);
  add(224.7, 230.3, () => <X.Cronometro t={t} at={A("cuarenta minutos", 224)} out={230.1} x={1560} y={380} mins={40} label="HERVIR" />);
  add(230.3, 235.8, () => <Nota t={t} at={A("toda la noche", 230)} out={235.6} x={1480} y={300} lines={["Reposa toda", "la noche.", "Se lava y se muele."]} rot={3} w={440} />);
  card(235.8, 240.2, "esa cal", "LA CAL", "hace la masa, y su olor");
  add(240.2, 244.7, () => <Pensado t={t} at={A("molino cerca", 242)} out={244.5} x={1250} y={300} text="¿no tienes molino cerca?" size={90} />);
  add(244.7, 253.0, () => <Palomita t={t} at={A("la harina de maiz", 245)} out={252.8} y={240} text="HARINA DE MAÍZ PARA TORTILLAS: YA ES NIXTAMAL" />);
  banda(255.5, 263.0, 1, "1", "AGUA TIBIA, Y LA PRUEBA DE LA BOLITA");

  // ===== SECRETO 1 · la masa =====
  add(263.0, 271.9, () => <><Pill t={t} at={A("agua fria", 263)} out={271.7} x={1400} y={260} text="AGUA FRÍA, DE GOLPE" /><Pill t={t} at={A("con cuchara", 266)} out={271.7} x={1400} y={420} text="CON CUCHARA" /></>);
  tag(271.9, 276.9, CZ, "grumos", "GRUMOS SECOS", "LOS QUE CUARTEAN LA TORTILLA", 300, -220, "#ff9a7a");
  add(276.9, 282.6, () => <X.Tazas t={t} at={A("dos tazas de harina", 277)} out={282.4} x={1450} y={300} n={2} dt={0.3} label="2 tazas de harina + sal" />);
  card(282.6, 287.9, "una taza y media", "1½ TAZA DE AGUA TIBIA", "como pa' bañar a un bebé", "l", 260);
  tag(287.9, 292.4, CZ, "a poco", "POCO A POCO", "MIENTRAS AMASAS");
  add(292.4, 297.1, () => <X.Versus t={t} at={A("entra mas rapido", 291)} out={296.9} x={960} y={300} a="TIBIA" b="FRÍA" w={900} rows={[["entra rápido", true, false], ["sin grumos", true, false]]} />);
  add(297.1, 301.2, () => <X.Cronometro t={t} at={297.2} out={301.0} x={1560} y={380} mins={4} label="AMASAR" />);
  card(297.1, 301.2, "plastilina", "COMO PLASTILINA", "", "l", 260);
  add(301.2, 306.1, () => <Palomita t={t} at={A("que no se pegue", 301)} out={305.9} y={240} text="NI PEGAJOSA, NI SECA" />);
  add(306.1, 329.4, () => <N.Bolita t={t} at={A("la prueba de mi abuela", 306)} out={329.2} x={960} y={800} goodAt={A("orilla queda lisita", 326)} />);
  card(306.1, 311.5, "una nuez", "UNA BOLITA", "del tamaño de una nuez", "l", 240);
  add(316.9, 322.8, () => <><Stamp t={t} at={A("le falta agua", 316)} out={322.6} text="LE FALTA AGUA" x={1400} y={250} size={84} /><X.Card t={t} at={A("una cucharada mas", 318)} out={322.6} x={480} y={260} from="left"><X.H s={50} c={CH.maiz}>+1 CUCHARADA</X.H><X.H s={42} f={HAND}>amasas, y otra vez</X.H></X.Card></>);
  add(322.8, 326.0, () => <Pill t={t} at={A("se te pega", 322)} out={325.8} x={1400} y={260} text="SE PEGA: LE FALTA HARINA" />);
  served(0);
  add(329.4, 332.2, () => <Palomita t={t} at={A("esa masa esta lista", 329)} out={332.0} y={240} text="ESA MASA ESTÁ LISTA" />);
  banda(332.2, 338.0, 2, "2", "LA MASA DESCANSA, Y SIEMPRE TAPADA");

  // ===== SECRETO 2 · el descanso =====
  add(338.0, 340.9, () => <Pill t={t} at={A("tienes prisa", 337)} out={340.7} x={1400} y={260} text="LA PRISA" />);
  card(340.9, 345.1, "todavia no", "TODAVÍA NO", "se ha tomado toda el agua", "l", 260);
  add(345.1, 349.9, () => <X.Cronometro t={t} at={A("veinte minutos", 345)} out={349.7} x={1560} y={380} mins={30} label="TAPADA, TRAPO HÚMEDO" />);
  add(349.9, 359.7, () => <Nota t={t} at={A("se hincha", 351)} out={359.5} x={1480} y={300} lines={["Cada granito", "se hincha, como", "el frijol en remojo."]} rot={-3} w={460} />);
  add(354.1, 359.7, () => <Palomita t={t} at={A("mas suave", 356)} out={359.5} y={820} text="MÁS SUAVE, MÁS ELÁSTICA" />);
  card(359.7, 364.3, "lo que se olvida", "LO QUE SE OLVIDA", "", "l", 260);
  add(364.3, 368.9, () => <Stamp t={t} at={A("siempre", 364)} out={368.7} text="SIEMPRE TAPADA" x={1340} y={250} size={92} />);
  add(368.9, 373.0, () => <X.Cronometro t={t} at={A("cinco minutos", 369)} out={372.8} x={1560} y={380} mins={5} label="AL AIRE: SE SECA" />);
  tag(373.0, 379.3, CZ, "costrita", "LA COSTRITA", "SE ROMPE EN LA PRENSA", 300, -220, "#ff9a7a");
  add(379.3, 385.5, () => <Nota t={t} at={A("manta mojado", 379)} out={385.3} x={1480} y={300} lines={["Un trapo de manta", "mojado, toda", "la mañana."]} rot={3} w={460} />);
  add(385.5, 388.9, () => <Pensado t={t} at={A("ya se seco", 386)} out={388.7} x={1250} y={300} text="¿ya se secó?" size={100} />);
  served(1);
  add(388.9, 395.3, () => <Palomita t={t} at={A("mojate las manos", 389)} out={395.1} y={240} text="NO LA TIRES: MANOS MOJADAS Y A AMASAR" />);
  add(395.3, 397.4, () => <X.Cita t={t} at={A("es noble", 395)} out={397.2} x={960} y={300} text="La masa es noble, mija." size={92} />);
  banda(397.4, 404.0, 3, "3", "LA PRENSA, CON PLÁSTICO, Y LA BOLITA JUSTA");

  // ===== SECRETO 3 · la prensa =====
  tag(405.7, 410.3, CHAROLA, "dos pedazos de plastico", "2 CUADROS DE PLÁSTICO", "DE BOLSA DE MANDADO");
  add(410.3, 414.8, () => <X.Versus t={t} at={A("no papel", 410)} out={414.6} x={960} y={300} a="PLÁSTICO" b="PAPEL" w={900} rows={[["no se pega", true, false], ["no se rompe", true, false]]} />);
  add(414.8, 419.6, () => <X.Cifra t={t} at={A("cuarenta gramos", 416)} out={419.4} x={960} y={480} to={40} pre="" post=" gramos" sub="una pelota de golf" />);
  tag(419.6, 425.4, CHAROLA, "hacia la bisagra", "HACIA LA BISAGRA", "ESA PARTE APRIETA MENOS");
  card(425.4, 431.1, "una sola vez", "UNA SOLA VEZ", "con fuerza, parejo", "l", 260);
  add(431.1, 435.6, () => <Nota t={t} at={A("media vuelta", 431)} out={435.4} x={1480} y={300} lines={["Media vuelta,", "y otra vez,", "suavecito."]} rot={-3} w={420} />);
  add(435.6, 447.1, () => <N.Grosor t={t} at={A("dos milimetros", 436)} out={446.9} x={960} y={760} okAt={A("dos milimetros", 436) + 0.6} />);
  add(447.1, 453.2, () => <Stamp t={t} at={A("no la jales", 446)} out={453.0} text="¡NO LA JALES!" x={1340} y={250} size={96} />);
  served(2);
  card(453.2, 459.2, "volteas la tortilla", "AL REVÉS", "volteas, y despegas el de abajo", "l", 260);
  add(459.2, 463.4, () => <Palomita t={t} at={A("entera", 460)} out={463.2} y={240} text="ENTERA, LISTA PARA EL COMAL" />);
  banda(463.4, 469.4, 4, "4", "COMAL BIEN CALIENTE, Y SIN GRASA");

  // ===== SECRETO 4 · el comal =====
  card(469.4, 475.6, "se echan a perder", "AQUÍ SE ECHAN A PERDER", "casi todas las de casa", "l", 260);
  add(472.0, 481.6, () => <X.FuegoNivel t={t} at={A("fuego bajito", 473)} out={481.4} x={1500} y={430} lvl={1} label="FUEGO BAJITO" />);
  add(475.6, 481.6, () => <Pill t={t} at={A("tiesa", 478)} out={481.4} x={480} y={820} text="TIESA, PÁLIDA, DE PAPEL" />);
  add(481.6, 485.6, () => <Stamp t={t} at={A("la hace dura", 482)} out={485.4} text="ESO LA HACE DURA" x={960} y={250} size={90} />);
  add(485.6, 490.9, () => <><X.FuegoNivel t={t} at={A("fuego medio alto", 488)} out={490.7} x={420} y={430} lvl={3} label="MEDIO ALTO" /><X.Cronometro t={t} at={A("diez minutos", 489)} out={490.7} x={1560} y={380} mins={10} label="ANTES DE LA PRIMERA" /></>);
  add(490.9, 505.1, () => <N.Gotas t={t} at={A("como sabes", 491)} out={504.9} x={960} y={800} hotAt={HOT} />);
  add(505.1, 509.6, () => <Palomita t={t} at={A("nada de aceite", 504)} out={509.4} y={240} text="SIN ACEITE: SE CUECE EN SECO" />);
  tag(509.6, 517.8, COMAL, "con cal", "CURADO CON CAL", "PA' QUE NO SE PEGUE");
  card(517.8, 522.2, "de fierro", "¿DE FIERRO?", "limpio y caliente");
  served(3);
  add(522.2, 526.4, () => <Palomita t={t} at={A("rapido por fuera", 522)} out={526.2} y={240} text="RÁPIDO POR FUERA, EL AGUA ADENTRO" />);
  add(526.4, 531.0, () => <><X.Fondo o={0.4 * e(t, 527.5, 527.9) * (1 - e(t, 530.6, 531))} /><X.Cita t={t} at={A("esa agua", 527)} out={530.8} x={960} y={500} text="Esa agua que se queda adentro es la suavidad." size={84} /></>);
  banda(531.0, 536.5, 5, "5", "LAS TRES VUELTAS");

  // ===== SECRETO 5 · las tres vueltas =====
  tag(536.5, 539.8, COMAL, "de una sola vez", "DE UNA SOLA VEZ", "SIN QUE SE ARRUGUE");
  add(543.0, 574.4, () => <N.Vueltas t={t} at={A("y cuentas", 542)} out={574.2} x={960} y={850} marks={[
    { at: A("quince veinte segundos", 544), label: "15-20 s", sub: "la orilla se despega" },
    { at: A("cuarenta segundos", 553), label: "40 s", sub: "manchitas cafés" },
    { at: A("esa tercera", 561), label: "unos segundos", sub: "¡se infla!" }]} />);
  add(564.4, 570.5, () => <X.Onoma t={t} at={A("un globito", 568)} out={570.3} x={1350} y={330} text="¡GLOBITO!" />);
  card(570.5, 579.0, "si no se infla", "¿NO SE INFLA SOLA?", "apriétala con una servilleta", "l", 240);
  add(579.0, 585.3, () => <Pensado t={t} at={A("por que se infla", 578)} out={581.0} x={1250} y={300} text="¿por qué se infla?" size={100} />);
  add(581.0, 589.7, () => <X.Card t={t} at={A("se hace vapor", 580)} out={589.5} x={1440} y={280} from="right"><X.H s={56} c={CH.maiz}>VAPOR</X.H><X.H s={44} f={HAND}>la separa en dos capitas</X.H></X.Card>);
  served(4);
  add(589.7, 594.5, () => <Palomita t={t} at={A("conservo su humedad", 591)} out={594.3} y={240} text="COCIDA POR DENTRO, CON SU HUMEDAD" />);
  add(594.5, 599.0, () => <Nota t={t} at={A("se va a casar", 595)} out={598.8} x={1480} y={300} lines={["La que se infla:", "la cocinera", "se va a casar."]} rot={4} w={420} />);
  card(599.0, 604.0, "cuarenta y seis", "46 AÑOS CON LUPE", "y todavía se me inflan", "l", 260);
  banda(604.0, 611.0, 6, "6", "DEL COMAL, DIRECTO A LA SERVILLETA");

  // ===== SECRETO 6 · la servilleta =====
  add(608.4, 611.0, () => <Stamp t={t} at={A("las tortillerias no", 609)} out={610.8} text="LO QUE NO TE DICEN" x={1340} y={250} size={84} />);
  add(611.0, 617.6, () => <><X.Fondo o={0.4 * e(t, 611.8, 612.2) * (1 - e(t, 617.2, 617.6))} /><X.Cita t={t} at={A("no se acaba en el", 611)} out={617.4} x={960} y={500} text="No se acaba en el comal. Se acaba en la servilleta." size={84} /></>);
  card(617.6, 623.0, "chiquihuite", "CHIQUIHUITE · CANASTA", "con su servilleta de tela");
  tag(623.0, 628.7, CHIQ, "y se tapa", "SE TAPA", "INMEDIATAMENTE, UNA ENCIMA DE OTRA");
  card(628.7, 635.1, "sudan", "LAS TORTILLAS SUDAN", "el vapor se queda atrapado", "l", 260);
  add(635.1, 639.5, () => <X.Cronometro t={t} at={A("diez quince minutos", 635)} out={639.3} x={1560} y={380} mins={15} label="APILADITAS Y TAPADAS" />);
  tag(639.5, 645.5, CHIQ, "su propio vapor", "SE COCEN CON SU VAPOR", "");
  card(645.5, 651.6, "se ablandan", "LAS ORILLAS SE ABLANDAN", "flexible, suavecita", "l", 260);
  add(651.6, 655.0, () => <Palomita t={t} at={A("doblas en cuatro", 651)} out={654.8} y={240} text="LA DOBLAS EN CUATRO Y NO SE ROMPE" />);
  add(655.0, 662.4, () => <X.Versus t={t} at={A("destapadas", 655)} out={662.2} x={960} y={300} a="TAPADAS" b="DESTAPADAS" w={900} rows={[["guardan su vapor", true, false], ["suaves en la tarde", true, false]]} />);
  card(662.4, 667.9, "el papel deja", "EL PAPEL", "deja salir el vapor", "l", 260);
  add(667.9, 674.0, () => <Nota t={t} at={A("a mediodia", 667)} out={673.8} x={1480} y={300} lines={["A mediodía: buenas.", "En la noche:", "cartón."]} rot={-3} w={460} />);
  served(5);
  card(674.0, 678.4, "almidon", "EL ALMIDÓN SE APRIETA", "al enfriarse, se endurece", "l", 260);
  add(678.4, 684.5, () => <Palomita t={t} at={A("como la guardas", 681)} out={684.3} y={240} text="CÓMO LA GUARDAS Y CÓMO LA REGRESAS" />);
  banda(684.5, 691.0, 7, "7", "ENVUELTAS AL REFRI, Y CON LAS MANOS MOJADAS");

  // ===== SECRETO 7 · guardar y recalentar =====
  card(691.0, 695.9, "envueltas en", "ENVUELTAS EN LA TELA", "en una bolsa, al refri", "l", 260);
  add(695.9, 702.6, () => <><X.Refri t={t} at={A("refrigerador", 695)} out={702.4} x={960} y={540} inAt={A("refrigerador", 695) + 0.4} /><Pill t={t} at={A("nunca destapadas", 696)} out={702.4} x={1500} y={260} text="NUNCA SUELTAS" /></>);
  add(702.6, 706.0, () => <Palomita t={t} at={A("no te asustes", 702)} out={705.8} y={240} text="¿TIESAS EN EL REFRI? TIENE ARREGLO" />);
  card(706.0, 712.2, "para recalentarlas", "PA' RECALENTARLAS", "el comal bien caliente", "l", 260);
  card(712.2, 718.7, "te mojas las manos", "MANOS MOJADAS", "de los dos lados");
  add(718.7, 730.0, () => <N.Vueltas t={t} at={A("y al comal", 718)} out={729.8} x={960} y={850} marks={[{ at: A("veinte segundos de un lado", 719), label: "20 s", sub: "de un lado" }, { at: A("veinte del otro", 723), label: "20 s", sub: "del otro" }]} />);
  add(726.0, 730.0, () => <Palomita t={t} at={A("se hace vapor", 726)} out={729.8} y={240} text="EL AGÜITA SE HACE VAPOR" />);
  add(730.0, 736.1, () => <><Palomita t={t} at={A("como recien hecha", 731)} out={733.6} y={240} text="COMO RECIÉN HECHA" /><Pill t={t} at={A("el microondas", 733)} out={735.9} x={1400} y={420} text="¿MICROONDAS?" /></>);
  card(736.1, 740.2, "trapo humedo", "TRAPO HÚMEDO", "de 5 en 5 · 30 segundos", "l", 260);
  served(6);
  add(740.2, 746.4, () => <Stamp t={t} at={A("como chicle", 743)} out={746.2} text="COMO CHICLE" x={1340} y={250} size={92} />);
  add(746.4, 749.6, () => <Palomita t={t} at={A("el comal siempre", 746)} out={749.4} y={240} text="EL COMAL SIEMPRE ES MEJOR" />);
  add(749.6, 758.4, () => <X.Card t={t} at={A("cuatro cosas mas", 749)} out={758.2} x={1440} y={260} from="right"><X.H s={60} c={CH.maiz}>4 COSAS MÁS</X.H><X.H s={44} f={HAND}>con las mismas tortillas</X.H></X.Card>);

  // ===== variantes =====
  add(758.4, 773.8, () => <X.Card t={t} at={A("la primera", 758)} out={773.6} x={480} y={220} from="left"><X.H s={52} c={CH.maiz}>1 · DE COLORES</X.H></X.Card>);
  add(763.7, 768.8, () => <X.Card t={t} at={A("salian verdes", 764)} out={768.6} x={1440} y={300} from="right"><X.H s={52} c="#7fd06a">VERDES</X.H><X.H s={42} f={HAND}>chaya o espinaca</X.H><X.H s={52} c={t >= A("betabel", 766) ? "#c063c9" : "transparent"}>MORADAS</X.H><X.H s={42} f={HAND} c={t >= A("betabel", 766) ? CH.crema : "transparent"}>agua de betabel</X.H></X.Card>);
  add(768.8, 773.8, () => <Nota t={t} at={A("mi nieta", 769)} out={773.6} x={1480} y={300} lines={["Mi nieta todavía", "se ríe."]} rot={4} w={420} />);
  add(773.8, 797.0, () => <X.Card t={t} at={A("la segunda", 773)} out={796.6} x={480} y={220} from="left"><X.H s={52} c={CH.maiz}>2 · GORDITAS</X.H><X.H s={42} f={HAND}>de manteca</X.H></X.Card>);
  lista(778.1, 787.0, "una cucharada de manteca", "A LA MISMA MASA", [["1 cda de manteca por taza", "una cucharada de manteca"], ["+ una pizca de sal", "pizca de sal"], ["gruesitas, como tu mano", "del tamano de tu mano"]], "r", 380);
  card(787.0, 791.4, "frijoles", "FRIJOLES · QUESO", "o chicharrón");
  add(791.4, 796.6, () => <Nota t={t} at={A("mi hermana licha", 792)} out={796.4} x={1480} y={300} lines={["A Licha se le van", "tres de una", "sentada."]} rot={-3} w={440} />);
  add(796.6, 818.4, () => <X.Card t={t} at={A("la tercera", 796)} out={816.6} x={480} y={220} from="left"><X.H s={52} c={CH.maiz}>3 · LA TORTILLA DURA</X.H><X.H s={42} f={HAND}>esa no se tira. Nunca.</X.H></X.Card>);
  card(803.3, 809.2, "chilaquiles", "CHILAQUILES · TOTOPOS", "y sopa de tortilla");
  add(809.2, 816.6, () => <X.Versus t={t} at={A("se chupa menos", 809)} out={816.4} x={960} y={720} a="SECA" b="FRESCA" w={900} rows={[["chupa menos aceite", true, false], ["no se deshace", true, false]]} />);
  add(816.6, 831.3, () => <X.Card t={t} at={A("la cuarta", 816)} out={831.1} x={480} y={220} from="left"><X.H s={52} c={CH.maiz}>4 · CUÁNTAS HACER</X.H></X.Card>);
  add(818.9, 827.0, () => <N.Rinde t={t} at={A("dieciseis tortillas", 819)} out={826.8} x={1300} y={560} n={16} label="2 tazas de harina = 16 tortillas" />);
  add(827.0, 831.3, () => <Palomita t={t} at={A("haz el doble", 827)} out={831.1} y={240} text="PA' 3 DÍAS: HAZ EL DOBLE" />);

  // ===== CTA 2: la semana de los $400 =====
  card(831.3, 837.3, "bien explicado", "LA TORTILLA DURA", "bien explicada en mi recetario");
  add(837.3, 846.9, () => <><X.Fondo o={0.4 * e(t, 837.4, 837.8) * (1 - e(t, 846.5, 846.9))} /><N.PaginaReal t={t} at={A("libro cuatro", 837)} out={846.7} x={960} y={520} a="guia_l4_tapa.jpg" b="guia_l4_p65.jpg" flipAt={A("sesenta y cinco", 838)} w={560} rot={2}
    hl={[{ at: A("cuatrocientos pesos", 840), y0: 0.235, y1: 0.325 }]} cap="Libro 4 · pág. 65" /></>);
  add(846.9, 853.0, () => <><Precio t={t} at={A("cuatrocientos trece", 849)} out={852.8} x={1440} y={140} top="$413" sub="LA SEMANA · 28 PLATOS" /><N.PaginaReal t={t} at={847.0} out={852.8} x={520} y={600} a="guia_l4_p65.jpg" w={520} rot={-4} hl={[{ at: A("veintiocho platos", 847), y0: 0.37, y1: 0.405 }]} /><BigNum t={t} at={A("quince pesos el plato", 851)} out={852.8} text="$15 EL PLATO" size={110} y={860} col={CH.maiz} edge="#5a2a10" /></>);
  add(853.0, 858.7, () => <X.Orden t={t} at={853.1} out={858.5} steps={[{ label: "lunes y martes: se seca", at: A("la dejas secar", 854) }, { label: "viernes: la sopa", at: A("el viernes", 855) }, { label: "domingo: chilaquiles", at: A("el domingo", 857) }]} />);
  add(858.7, 864.0, () => <X.DescCard t={t} at={A("lo tienes", 860)} out={863.8} x={1440} y={760} hl={A("primera linea", 861)} />);
  add(864.0, 869.6, () => <BigNum t={t} at={A("lo que puede", 863)} out={869.4} text="SI ALGO SALE MAL" size={130} y={500} col={CH.crema} edge="#4a1a0c" />);

  // ===== lo que puede salir mal =====
  add(869.6, 879.0, () => <X.FixCard t={t} at={A("se cuartean", 869)} out={878.8} x={960} y={860} prob="SE CUARTEAN" fix={["1 cucharada de agua", "y la prueba de la bolita"]} fixAt={A("una cucharada de agua", 871)} />);
  add(877.0, 879.6, () => <X.Cita t={t} at={A("no es que no tengas", 877)} out={879.4} x={960} y={300} text="No es que no tengas mano." size={86} />);
  add(879.0, 885.0, () => <X.FixCard t={t} at={A("se pegan en el plastico", 879)} out={884.8} x={960} y={860} prob="SE PEGAN AL PLÁSTICO" fix={["un poquito de harina"]} fixAt={A("un poquito de harina", 882)} />);
  add(885.0, 891.2, () => <X.FixCard t={t} at={A("se rompen", 884)} out={891.0} x={960} y={860} prob="SE ROMPEN" fix={["muy delgadas", "o la masa no descansó"]} fixAt={A("muy delgadas", 885)} />);
  add(891.2, 896.2, () => <X.FixCard t={t} at={A("crudas por dentro", 890)} out={896.0} x={960} y={860} prob="CRUDAS Y QUEMADAS" fix={["muy gruesas", "o el comal muy fuerte"]} fixAt={A("muy gruesas", 892)} />);
  add(896.2, 904.4, () => <X.FixCard t={t} at={A("no se inflan nunca", 896)} out={904.2} x={960} y={860} prob="NO SE INFLAN" fix={["comal frío", "tres vueltas, nada más"]} fixAt={A("comal frio", 898)} />);
  add(904.4, 915.1, () => <X.FixCard t={t} at={A("salen duras", 904)} out={914.9} x={960} y={860} prob="SALEN DURAS" fix={["revisa la servilleta", "tápalas luego luego"]} fixAt={A("revisa la servilleta", 905)} />);
  add(915.1, 925.3, () => <><X.Refri t={t} at={A("masa que sobro", 916)} out={925.1} x={960} y={540} inAt={A("en el refri", 919)} /><Pill t={t} at={A("te dura un dia", 921)} out={925.1} x={1500} y={260} text="1 DÍA. MÁS NO: SE AGRIA" /></>);

  // ===== la cuenta =====
  add(929.0, 937.3, () => <Precio t={t} at={A("veintiocho", 929)} out={937.1} x={1440} y={140} top="$28" sub="EL KILO EN LA TORTILLERÍA" />);
  add(933.0, 948.0, () => <Receipt t={t} rows={[{ at: A("kilo de harina", 933), item: "1 kg harina de maíz", $: 22 }, { at: A("casi dos kilos", 939), item: "≈ 2 kg de tortillas", $: 0 }]} totalAt={1e9} x={120} y={110} out={947.8} sc={1.05} title="HECHAS EN CASA" />);
  add(944.0, 948.0, () => <BigNum t={t} at={A("unos doce pesos", 945)} out={947.8} text="$12 EL KILO" size={130} y={860} col={CH.maiz} edge="#5a2a10" />);
  add(948.0, 952.3, () => <X.Card t={t} at={A("familia de cuatro", 948)} out={952.1} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>1 KILO AL DÍA</X.H><X.H s={44} f={HAND}>una familia de cuatro</X.H></X.Card>);
  add(952.3, 961.4, () => <N.Barras t={t} at={A("al mes", 952)} out={961.2} x={960} y={560} max={900} rows={[{ at: A("ochocientos cuarenta", 953), label: "al mes, en la tortillería", v: 840, c: "#e06a4a" }, { at: A("trescientos sesenta", 957), label: "al mes, hechas en tu casa", v: 360, c: CH.maiz }]} />);
  add(961.4, 965.3, () => <BigNum t={t} at={A("casi quinientos", 961)} out={965.1} text="CASI $500 MENOS AL MES" size={110} y={300} col={CH.maiz} edge="#5a2a10" />);
  add(965.3, 970.2, () => <Palomita t={t} at={A("ninguna se va", 965)} out={970.0} y={240} text="NINGUNA A LA BASURA POR DURA" />);

  // ===== resumen, tarea, comentarios, próximo =====
  const RT = ["agua tibia + bolita", "media hora, tapada", "plástico, 40 g, 2 mm", "que bailen las gotas", "tres vueltas, se infla", "a la servilleta", "manos mojadas"];
  add(974.5, 1005.0, () => PLATES.map((q, i) => { const p = sc(t, q); const w = partAt(t); return w && !w.c ? <X.PlateLabel key={i} t={t} at={RES[i]} out={1004.8} x={p.x} y={p.y} n={i + 1} text={RT[i]} /> : null; }));
  add(974.5, 979.6, () => <X.Orden t={t} at={974.6} out={979.4} steps={[{ label: "1 · agua tibia y la bolita", at: RES[0] }]} />);
  add(984.8, 996.0, () => <X.Orden t={t} at={984.9} out={995.8} steps={[{ label: "3 · plástico, 40 g, 2 mm", at: 985.0 }, { label: "4 · que bailen las gotas", at: RES[3] }, { label: "5 · tres vueltas", at: RES[4] }]} />);
  add(1001.9, 1006.8, () => <X.Orden t={t} at={1002.0} out={1006.6} steps={[{ label: "7 · envueltas, y manos mojadas", at: 1002.1 }]} />);
  add(1006.8, 1019.5, () => <X.Tarea t={t} at={A("no hagas los siete", 1007)} out={1019.3} x={1360} y={500} rows={[{ at: A("calienta tu comal", 1011), text: "el comal, hasta que bailen las gotas" }, { at: A("mete cada tortilla", 1014), text: "cada tortilla, a la servilleta" }]} />);
  add(1024.2, 1030.1, () => <X.Encuesta t={t} at={A("cuentame aqui abajo", 1024)} out={1029.9} x={1340} y={440} q="¿A MANO O CON PRENSA?" a="a mano" b="con prensa" pa={-1} />);
  add(1030.1, 1035.7, () => <Pensado t={t} at={A("de que parte eres", 1030)} out={1035.5} x={1250} y={300} text="¿y de qué parte eres?" size={90} />);
  add(1035.7, 1040.0, () => <X.Card t={t} at={A("en el proximo video", 1035)} out={1039.8} x={1300} y={420} from="right" w={820}><X.H s={44} c={CH.maiz}>EL PRÓXIMO VIDEO</X.H><X.H s={66}>Otro secreto de mi abuela</X.H><X.H s={44} f={HAND}>de esos que ya casi nadie sabe</X.H></X.Card>);
  add(1041.5, END_T, () => <X.Cita t={t} at={A("te espero", 1041)} out={END_T - 0.9} x={960} y={300} text="Te espero aquí, en mi cocina." size={90} />);
  return L;
};

// ---------------- EL VIDEO ----------------
export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const idx = PARTS.findIndex((p) => t >= p.a && t < p.b);
  if (inAv(t)) L.push(<Avatar key="av" t={t} />);
  else if (idx >= 0) {
    const p = PARTS[idx], nx = PARTS[idx + 1];
    if (p.c) {
      const portaled = idx > 0 && PARTS[idx - 1].pt && Math.abs(PARTS[idx - 1].b - p.a) < 1e-6;
      L.push(<Clip key={"c" + idx} k={p.c} t={t} a={portaled ? p.a - 0.7 : p.a} b={p.b} z={p.z} />);
    } else {
      L.push(<World key="w" t={t} />);
      if (p.pt && nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, p.pt); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} b={nx.b} z={nx.z} /></Portal>); }
      }
    }
  } else L.push(<World key="w" t={t} />);
  L.push(...Ov(t));
  // vapor en cada costura entre dos partes seguidas (salvo las que ya son portal)
  PARTS.forEach((p, i) => { const nx = PARTS[i + 1]; if (nx && Math.abs(nx.a - p.b) < 1e-6 && !(p.pt && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<SteamWipe key={"sw" + i} t={t} mid={p.b} w={0.38} />); });
  // destello suave al entrar a cada secreto
  FLIP.forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  // entrada y fundido final
  const ini = 1 - e(t, 0, 0.5), fin = e(t, END_T - 0.9, END_T - 0.1);
  if (ini > 0 || fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${Math.max(ini, fin)})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
