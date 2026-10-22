// chayoarroz · EL VIDEO ENTERO del arroz rojo (0 s → final). Mismo mundo y misma cámara de principio a fin: la cocina de adobe, la
// mesa con sus siete platos de barro (uno por secreto: al cerrar cada secreto su plato se sirve), el recetario de mamá Cuca que pasa
// una hoja por secreto, la olla de lavar el arroz (el agua se aclara), la sartén donde el arroz suena a arena, el comal donde se tatema
// el jitomate, la cazuela de arroz rojo y el puesto del mercado. Entre mundo y toma real sólo portales y vapor; el avatar entra en sus
// ventanas. Cada pieza nace con la palabra que la nombra (at("frase")).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PT2, PLATES, screenOf, camSpeed, setKeys, clearKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import PJ from "./parts.json";
import { BigNum, CH, Flash, HAND, P, Portal, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Pensado, Palomita, Stamp, Precio, Pill } from "./Min1";
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
  { l: ["# Arroz Rojo", "de mi mamá Cuca", "", "Pa' 8 gentes:", "una cazuela de", "dos tazas.", "", "— Refugio, 1961"], r: ["lavar hasta clarita", "freír: que suene a arena", "el jitomate tatemado", "freír el jitomate", "caldo, nunca agua", "encima, y fuego bajito", "servilleta y tenedor"] },
  { l: ["# 1. Lavar", "2 tazas de arroz", "en coladera, bajo la llave", "tallar suavecito", "3 ó 4 aguas", "hasta que salga clara"], r: ["escurrir bien", "o en un trapo limpio", "entra CASI SECO", "", "mojado: salta", "y se pega"] },
  { l: ["# 2. Freír", "3 cdas aceite o manteca", "fuego medio", "pala de madera", "sin parar", "", "5 a 6 min: suena a arena"], r: ["puntitas doradas", "¼ de cebolla picada", "1 ajo picado", "1 minuto más", "", "que no se queme el ajo"] },
  { l: ["# 3. El jitomate", "2 jitomates rojos", "al comal, sin aceite", "cáscara negra", "+ cebolla y ajo", "con cáscara"], r: ["a la licuadora", "COLAR, apretando", "sin pellejitos", "", "color parejito"] },
  { l: ["# 4. Freír el jitomate", "sobre el arroz frito", "que chille", "fuego medio, 5 min", "hasta que se seque"], r: ["color de ladrillo", "ya no se le sale", "", "si no: sale rosita", "y ácido"] },
  { l: ["# 5. Caldo", "de pollo, o el de res", "del domingo", "", "1 taza de arroz =", "2 de caldo", "HIRVIENDO"], r: ["tantito más salado", "de lo que te gusta", "", "nada de polvito", "nada de agua"] },
  { l: ["# 6. Encima y fuego", "zanahoria en cuadritos", "puño de chícharos", "1 serrano entero", "ramita de cilantro", "sin hundirlos"], r: ["que suelte el hervor", "destapado", "hoyitos: fuego mínimo", "tapado, 15 minutos", "", "NO SE DESTAPA"] },
  { l: ["# 7. Reposo", "apagar la lumbre", "servilleta doblada", "bajo la tapa", "10 min sin tocarlo"], r: ["esponjar con tenedor", "levantando de abajo", "fuera chile y cilantro", "", "cada grano, solito"] },
];
const GUIA = [
  { l: ["# Las 5 Ollas de", "# Doña Chayo", "", "Libro 1", "La Olla del Domingo", "", "recetas de mi abuela", "con sus pesos"], r: ["Semana 1", "El Caldo de Res", "del Domingo ....... 12", "", "Miércoles:", "Arroz Rojo con", "Huevo Estrellado .. 21"] },
  { l: ["# Arroz Rojo con", "# Huevo Estrellado", "pág. 21", "", "sale a $22 el plato", "rinde 4 platos", "tarda 35 minutos"], r: ["por cada taza", "de arroz,", "dos de caldo.", "", "Y no se destapa."] },
  { l: ["# El Caldo de Res", "# del Domingo", "pág. 12", "", "una sola olla", "el domingo"], r: ["siete comidas", "distintas,", "para cuatro"] },
];

// ---------------- tiempos clave ----------------
const SEC = (PJ as unknown as { secs: [string, number][] }).secs;
const secStart = (n: string) => (SEC.find(([k]) => k === n) ?? ["", 0])[1];
const SECRETS = ["UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE"];
const FLIP = SECRETS.map((n) => secStart(n) + 0.4);                                   // el recetario pasa la hoja del secreto i
const SERVE = SECRETS.map((_, i) => plPart(i).a + 0.5);                              // el plato del secreto i se sirve
const PROM = [A("siete secretos", 74) + 0.3, A("siete secretos", 74) + 0.9, A("como se tatema", 84), A("como se frie el jitomate", 84), A("lo que se le echa", 84), A("lo que va encima", 90), A("cuando ya apagaste", 90)];
const RES = [A("uno lava el arroz", 935), A("dos frielo", 935), A("tres el jitomate", 935), A("cuatro frie", 935), A("cinco", 948), A("seis chile entero", 948), A("siete", 960)];
const isGuia = (t: number) => (t >= 125 && t < 156.3) || (t >= 786 && t < 811);
const G1 = A("lo fui apuntando", 125), G1P = A("arroz rojo con huevo", 135), G2 = 786.0, G2P = A("el miercoles", 800);
const LAVA = [A("la tiras", 254), A("y otra vez", 258), A("tres cuatro veces", 258), A("transparente", 260)];

const worldAt = (t: number): WorldProps => {
  const guia = isGuia(t);
  const plateServed = PLATES.map((_, i) => win(t, SERVE[i], SERVE[i] + 1.2));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, 104.5, 104.9)),
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 2, SERVE[i] + 3)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, 975, 975.3)),
  ));
  const k0 = partAt(t)?.k0 ?? "";
  // la olla de lavar: lechosa y se va aclarando enjuague por enjuague
  const lavar = (t >= 170 && t < 184) || (t >= 228 && t < 287);
  const remojo = t < 228 ? 1 : 1 - LAVA.reduce((acc, a) => acc + 0.25 * win(t, a, a + 1.2), 0);
  // la sartén en el comal: el arroz se fríe (blanco → dorado)
  const sarten = (t >= 285 && t < 366) || (t >= 437 && t < 484) || (t >= 769 && t < 782) ? 1 : 0;
  const toast = t >= 437 ? 1 : win(t, A("empieza a sonar", 305), A("ese es tu punto", 318));
  return {
    t,
    fire: 1 + (t >= 605 && t < 640 ? -0.55 : 0) + (t >= 300 && t < 366 ? 0.2 : 0),
    steamCaz: /^cazT/.test(k0) ? 0.35 : /^(caz|pl)/.test(k0) ? 1 : /^top/.test(k0) ? 0.4 : 0.22,
    steamComal: /^comal/.test(k0) ? 0.18 : 1,
    ojitos: 0,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.16 * v),
    plateFill: PLATES.map((_, i) => (t < 104.9 ? win(t, PROM[i], PROM[i] + 0.4) : 0) + (t >= 935 && t < 976 ? win(t, RES[i], RES[i] + 0.4) : 0)),
    book: guia
      ? { open: ei(t, t < 500 ? G1 + 0.2 : G2, (t < 500 ? G1 + 0.2 : G2) + 1.2), flip: t < 500 ? ei(t, G1P, G1P + 0.9) : 2 + ei(t, G2P, G2P + 0.9) * 0 + ei(t, 790.6, 791.4) * 0, pages: GUIA }
      : { open: 1, flip: FLIP.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO },
    guia: guia ? 1 : 0,
    partyPeople: (t >= 718 && t < 739) || t >= 1001 ? 1 : 0,
    patioLights: t >= 718 && t < 739 ? 1 : win(t, 1003, 1008),
    sarten, fry: 10, toast,
    remojo: lavar ? 0.02 + remojo : 0,
    verduras: t >= 370 && t < 437 ? 0.5 * win(t, A("dos jitomates", 370), A("dos jitomates", 370) + 0.6) + 0.5 * win(t, A("se ponga negra", 378), A("se ponga negra", 378) + 4) : 0,
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
      <AbsoluteFill style={{ opacity: t >= wn.ms - 0.02 && t < wn.me ? 1 : 0 }}><OffthreadVideo src={staticFile("av/chayoarroz/reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};
// el clip (~3 s) es más corto que su parte: arranca con la foto (= su primer cuadro) y el clip entra al final, a 0,8x
const CLIPDUR = (AVAIL as unknown as { dur: Record<string, number> }).dur;
const Clip: React.FC<{ k: string; t: number; a: number; b: number; z?: [number, number] }> = ({ k, t, a, b, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const c0 = Math.max(a, b - (CLIPDUR[k] - 0.15) / 0.8);
  const inner = CLIPS.has(k) && t >= c0
    ? <Sequence from={s(c0)} layout="none"><OffthreadVideo src={staticFile("broll/chayoarroz/" + k + ".mp4")} playbackRate={0.8} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ---------------- las piezas, cada una clavada a su palabra ----------------
const sc = (t: number, q: V) => screenOf(t, q);
const PL = (i: number) => PLATES[i];
const COMAL = PT2.comal, REMOJO = PT2.remojo;
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

  // ===== el gancho =====
  tag(4.1, 9.4, CZ, "sueltecito", "ROJO Y SUELTECITO", "CADA GRANO POR SU LADO");
  add(4.1, 9.4, () => <Aroma t={t} at={A("huele a jitomate", 5)} out={9.2} x={sc(t, CZ).x} y={sc(t, CZ).y - 160} />);
  add(9.4, 15.0, () => <Pill t={t} at={A("polvito", 9)} out={14.8} x={1380} y={300} text="POLVITO DE SOBRE" />);
  card(21.0, 25.8, "una fonda en morelia", "UNA FONDA EN MORELIA", "con mi viejo Lupe", "l", 260);
  card(25.8, 29.8, "la comida corrida", "COMIDA CORRIDA", "y de guarnición, el arroz rojo");
  card(33.5, 38.0, "anaranjado", "ANARANJADO", "color de sobrecito", "l", 260);
  add(38.0, 42.1, () => <><Pill t={t} at={A("pegado en", 37)} out={41.9} x={1380} y={260} text="PEGADO EN BOLA" /><Pill t={t} at={A("reventado", 38)} out={41.9} x={1380} y={420} text="GRANO REVENTADO" /></>);
  add(42.1, 47.1, () => <Pensado t={t} at={A("con que hacen el arroz", 42)} out={46.9} x={1300} y={300} text="¿y con qué hacen el arroz?" size={90} />);
  add(52.6, 58.2, () => <Nota t={t} at={A("su jitomate", 52)} out={58.0} x={1480} y={300} lines={["Su jitomate,", "su agua,", "lo tapas..."]} rot={-3} w={440} />);
  add(58.2, 64.0, () => <><Stamp t={t} at={A("engrudo", 57)} out={63.8} text="ENGRUDO" x={1400} y={260} size={100} /><X.Card t={t} at={A("quemado", 59)} out={63.8} x={480} y={820} from="left"><X.H s={48} f={HAND}>quemado abajo · crudo arriba</X.H></X.Card></>);
  add(68.4, 74.7, () => <><X.Fondo o={0.4 * e(t, 69.5, 70) * (1 - e(t, 74.2, 74.6))} /><X.Cita t={t} at={A("no eres tu", 68)} out={74.4} x={960} y={500} text="No eres tú. Nadie te enseñó el orden." size={92} /></>);

  // ===== la promesa: un plato por secreto =====
  const LBL = ["lavar", "freír", "tatemar", "freír el jitomate", "caldo", "encima, y el fuego", "reposo"];
  add(74.7, 97.9, () => PLATES.map((q, i) => { const p = sc(t, q); const w = (t < 80.9 && i < 2) || (t >= 91.6 && t < 97.9); return w ? <X.PlateLabel key={i} t={t} at={Math.max(t < 81 ? 74.8 : 91.65, PROM[i])} out={t < 81 ? 80.7 : 97.7} x={p.x} y={p.y} n={i + 1} text={LBL[i]} /> : null; }));
  add(74.7, 80.9, () => <BigNum t={t} at={A("siete secretos", 74)} out={80.7} text="7 SECRETOS" size={150} y={190} col={CH.maiz} edge="#5a2a10" sub="EN EL ORDEN EN QUE SE USAN" />);
  add(85.5, 91.6, () => <X.Orden t={t} at={85.6} out={91.4} steps={[{ label: "3 · tatemar", at: PROM[2] }, { label: "4 · freír el jitomate", at: PROM[3] }, { label: "5 · en vez de agua...", at: PROM[4] }]} />);
  add(102.5, 112.6, () => <LowerThird t={t} at={A("yo soy rosario", 102)} out={112.4} name="DOÑA CHAYO" l2="67 AÑOS · RANCHO DE PÁTZCUARO" l2at={A("sesenta y siete", 108)} />);
  add(108.6, 114.6, () => <X.MapaMich t={t} at={A("patzcuaro", 110)} out={114.4} x={1380} y={430} />);
  card(120.7, 125.3, "cazuela de arroz", "SIN SU CAZUELA DE ARROZ", "no había domingo");

  // ===== CTA 1: la guía, de verdad =====
  card(125.3, 129.6, "lo fui apuntando", "LO FUI APUNTANDO", "todo lo que me enseñó", "l", 240);
  add(129.6, 134.3, () => <><X.Fondo o={0.45 * e(t, 129.7, 130.1) * (1 - e(t, 133.9, 134.3))} /><N.PaginaReal t={t} at={A("las cinco ollas", 129)} out={134.1} x={960} y={520} a="guia_l1_tapa.jpg" w={560} cap="Las 5 Ollas de Doña Chayo" /></>);
  add(139.9, 145.8, () => <N.PaginaReal t={t} at={A("ahi esta mi arroz", 139)} out={145.6} x={1450} y={560} a="guia_l1_tapa.jpg" b="guia_l1_p21.jpg" flipAt={A("arroz rojo con huevo", 139)} w={600} rot={3}
    hl={[{ at: A("con caldo en vez", 141), y0: 0.125, y1: 0.165 }]} cap="Libro 1 · pág. 21" />);
  add(145.8, 151.6, () => <><Precio t={t} at={A("veintidos pesos", 145)} out={151.4} x={1440} y={140} top="$22" sub="EL PLATO · COMIDA COMPLETA" /><N.PaginaReal t={t} at={145.9} out={151.4} x={520} y={600} a="guia_l1_p21.jpg" w={520} rot={-4} hl={[{ at: A("veintidos pesos", 145), y0: 0.17, y1: 0.2 }]} /></>);
  add(151.6, 156.3, () => <X.DescCard t={t} at={A("por donde conseguir", 149)} out={156.1} x={1440} y={780} hl={A("primera linea", 151)} />);

  // ===== la historia =====
  add(156.3, 161.7, () => <><X.Card t={t} at={A("mama cuca", 156)} out={161.5} x={480} y={240} from="left"><X.H s={60} c={CH.maiz}>MAMÁ CUCA</X.H><X.H s={44} f={HAND}>se llamaba Refugio</X.H></X.Card>
    <X.Gente t={t} at={A("catorce", 159)} out={161.5} x={1350} y={420} n={15} label="gentes los domingos" /></>);
  card(161.7, 167.3, "cazuela de barro ancha", "CAZUELA DE BARRO", "ancha, ancha");
  add(170.7, 177.0, () => <><X.Card t={t} at={A("nueve anos", 170)} out={176.8} x={480} y={240} from="left"><X.H s={56} c={CH.maiz}>9 AÑOS</X.H><X.H s={44} f={HAND}>lavar el arroz en la batea</X.H></X.Card>
    {(() => { const p = sc(t, REMOJO); return <Tag t={t} at={A("junto al pozo", 172)} x={p.x} y={p.y} dx={300} dy={-200} text="AGUA CLARITA" sub="SI NO, OTRA VEZ" col="#bfe0ff" out={176.8} size={50} />; })()}</>);
  add(177.0, 183.6, () => <Nota t={t} at={A("otra vez chayito", 178)} out={183.4} x={1480} y={300} lines={["Otra vez, Chayito:", "todavía llora."]} rot={-3} w={480} />);
  add(189.4, 194.7, () => <Pensado t={t} at={A("en bola", 188)} out={194.5} x={1300} y={300} text="¿por qué en bola?" size={100} />);
  add(194.7, 199.8, () => <><X.Fondo o={0.4 * e(t, 195, 195.4) * (1 - e(t, 199.4, 199.8))} /><X.Cita t={t} at={A("se hace en la cazuela", 194)} out={199.6} x={960} y={500} text="El arroz se hace en la cazuela, no en el agua." who="MAMÁ CUCA" size={84} /></>);
  add(205.3, 209.6, () => <X.CorteOllas t={t} at={A("una cazuela gruesa", 205)} out={209.4} x={960} y={790} n={1} badAt={1e9} />);
  card(209.6, 214.1, "reparte el calor", "REPARTE EL CALOR", "parejito, arriba y abajo");
  add(214.1, 218.6, () => <><X.Fondo o={0.4 * e(t, 214.2, 214.6) * (1 - e(t, 218.2, 218.6))} /><X.CorteOllas t={t} at={214.3} out={218.4} x={960} y={540} n={3} badAt={A("ollita delgada", 214)} /></>);
  add(223.6, 229.8, () => <Palomita t={t} at={A("tu sarten mas gruesa", 222)} out={226.8} y={240} text="TU SARTÉN MÁS GRUESA, CON TAPA" />);
  banda(226.0, 231.5, 1, "1", "SE LAVA HASTA QUE EL AGUA SALGA CLARA");

  // ===== SECRETO 1 · lavar =====
  tag(231.6, 236.0, REMOJO, "almidon", "ALMIDÓN", "EL POLVITO BLANCO", 300, -220, "#f6efe0");
  add(239.6, 244.8, () => <><Stamp t={t} at={A("engrudo", 239)} out={244.6} text="ENGRUDO" x={1400} y={260} size={96} /><X.Card t={t} at={A("te pega todos", 240)} out={244.6} x={480} y={820} from="left"><X.H s={46} f={HAND}>almidón + calor = pegamento</X.H></X.Card></>);
  add(244.8, 249.7, () => <X.Tazas t={t} at={A("dos tazas de arroz", 244)} out={249.5} x={1450} y={300} n={2} dt={0.3} label="2 tazas de arroz" />);
  add(254.0, 258.9, () => <Nota t={t} at={A("como si lo acariciaras", 253)} out={258.7} x={1480} y={300} lines={["Como si lo", "acariciaras."]} rot={4} w={420} />);
  add(254.0, 268.1, () => <N.AguaClara t={t} at={A("sale blanca", 254)} out={267.9} x={960} y={850} steps={LAVA} />);
  card(263.2, 268.1, "en la batea", "ASÍ LO HACÍA", "mi abuela, en la batea", "r", 260);
  add(272.3, 277.4, () => <Palomita t={t} at={A("casi seco", 273)} out={277.2} y={240} text="ENTRA CASI SECO" />);
  add(277.4, 283.2, () => <X.Versus t={t} at={A("si entra mojado", 277)} out={283.0} x={960} y={300} a="SECO" b="MOJADO" w={900} rows={[["se fríe", true, false], ["no salta", true, false], ["sale suelto", true, false]]} />);
  served(0);
  banda(283.2, 291.8, 2, "2", "SE FRÍE HASTA QUE SUENE COMO ARENA");

  // ===== SECRETO 2 · freír hasta que suene a arena =====
  add(287.0, 291.8, () => <Pill t={t} at={A("las prisas", 289)} out={291.6} x={1400} y={420} text="LAS PRISAS" />);
  card(291.8, 297.1, "tres cucharadas", "3 CUCHARADAS", "aceite, o manteca como mi abuela");
  add(302.0, 307.9, () => <X.FuegoNivel t={t} at={A("sin parar", 302)} out={307.7} x={420} y={430} lvl={2} label="SIN PARAR" />);
  tag(302.0, 307.9, COMAL, "transparente", "TRANSPARENTE", "Y CALLADITO");
  add(307.9, 320.0, () => <N.Arena t={t} at={A("empieza a sonar", 307)} out={319.8} x={960} y={820} sandAt={A("un ruidito seco", 309)} />);
  add(320.0, 325.5, () => { const p = sc(t, COMAL); return <><Tag t={t} at={A("en las puntas", 320)} x={p.x} y={p.y} dx={300} dy={-220} text="PUNTITAS DORADAS" col={CH.maiz} out={325.3} size={54} /><Palomita t={t} at={A("ese es tu punto", 321)} out={325.3} y={820} text="ESE ES TU PUNTO" /></>; });
  add(325.5, 336.0, () => <N.Grano t={t} at={A("el aceite caliente", 325)} out={335.8} x={960} y={760} sealAt={A("una capita", 327)} />);
  add(336.0, 342.2, () => <X.Onoma t={t} at={A("como palomita", 337)} out={341.0} x={1350} y={360} text="¡POP!" />);
  card(342.2, 348.7, "a nuez", "SABOR A TOSTADO", "a nuez");
  add(353.5, 359.6, () => <X.Card t={t} at={A("un minuto", 354)} out={359.4} x={480} y={260} from="left"><X.H s={50} c={CH.maiz}>¼ CEBOLLA + 1 AJO</X.H><X.H s={44} f={HAND}>un minuto, nada más</X.H></X.Card>);
  add(359.6, 365.6, () => <Stamp t={t} at={A("porque amarga", 359)} out={362.6} text="¡QUE NO SE QUEME EL AJO!" x={960} y={260} size={66} />);
  served(1);
  banda(362.6, 372.0, 3, "3", "EL JITOMATE VA TATEMADO");

  // ===== SECRETO 3 · el jitomate tatemado =====
  card(370.5, 376.3, "dos jitomates grandes", "2 JITOMATES", "rojos, bien maduros", "l", 260);
  card(376.3, 382.3, "sin aceite", "AL COMAL BIEN CALIENTE", "sin aceite, sin nada");
  tag(387.0, 391.0, COMAL, "con todo y", "TATEMADOS", "CEBOLLA Y AJO CON CÁSCARA");
  add(391.0, 395.3, () => <Aroma t={t} at={A("un olor dulce", 391)} out={395.1} x={960} y={700} />);
  add(395.3, 404.6, () => <X.Versus t={t} at={A("cuando se dora el pan", 396)} out={404.4} x={960} y={300} a="TATEMADO" b="CRUDO" w={900} rows={[["dulce y hondo", true, false], ["sabe a jitomate", true, false]]} />);
  add(404.6, 410.8, () => <Pill t={t} at={A("agua roja", 406)} out={410.6} x={1400} y={300} text="AGUA ROJA" />);
  card(410.8, 417.0, "a la licuadora", "A LA LICUADORA", "con la cebolla y el ajo pelado", "l", 260);
  add(422.3, 427.7, () => <X.Coladera t={t} at={A("los cuelas", 421)} out={427.5} x={1400} y={420} twoAt={1e9} />);
  add(427.7, 432.8, () => <Palomita t={t} at={A("parejito", 428)} out={432.6} y={240} text="SIN PELLEJOS · COLOR PAREJO" />);
  served(2);
  banda(437.0, 441.4, 4, "4", "EL JITOMATE TAMBIÉN SE FRÍE");

  // ===== SECRETO 4 · freír el jitomate =====
  add(441.4, 445.8, () => <Pill t={t} at={A("la gente echa", 441)} out={445.6} x={1400} y={300} text="JITOMATE Y AGUA, DE UNA" />);
  card(445.8, 450.1, "rosita", "SALE ROSITA", "y agrio");
  add(454.0, 459.9, () => <X.Onoma t={t} at={A("chillar", 455)} out={459.0} x={1350} y={330} text="¡CHSSS!" />);
  add(459.9, 465.6, () => <X.Cronometro t={t} at={A("cinco minutos", 460)} out={465.4} x={1560} y={380} mins={5} label="FUEGO MEDIO" />);
  add(471.2, 477.4, () => <X.Card t={t} at={A("como ladrillo", 470)} out={477.2} x={480} y={250} from="left"><X.H s={56} c="#e0743a">COLOR DE LADRILLO</X.H><X.H s={44} f={HAND}>ya no se le sale</X.H></X.Card>);
  served(3);
  banda(477.4, 484.0, 5, "5", "CON CALDO, NUNCA CON AGUA");

  // ===== SECRETO 5 · caldo =====
  card(489.0, 494.9, "caldo de pollo", "CALDO", "de pollo, o el de res del domingo");
  add(494.9, 501.1, () => <><X.Fondo o={0.4 * e(t, 495, 495.4) * (1 - e(t, 500.7, 501.1))} /><X.Cita t={t} at={A("en su vida", 495)} out={500.9} x={960} y={500} text="Nunca, en su vida, le echó agua al arroz." who="MAMÁ CUCA" size={84} /></>);
  card(504.5, 510.0, "se chupa todo", "SE CHUPA TODO", "lo que le echas", "l", 260);
  add(510.0, 514.9, () => <Pill t={t} at={A("el polvito", 511)} out={514.7} x={1400} y={300} text="EL POLVITO" />);
  add(518.8, 523.5, () => <Palomita t={t} at={A("a domingo", 518)} out={523.3} y={240} text="SABE A HUESO, A DOMINGO" />);
  add(523.5, 527.8, () => <N.Proporcion t={t} at={A("por cada taza", 524)} out={527.6} x={960} y={760} arroz={1} caldo={2} />);
  add(527.8, 532.1, () => <N.Proporcion t={t} at={A("dos tazas de arroz", 527)} out={531.9} x={960} y={760} arroz={2} caldo={4} dt={0.18} />);
  card(538.2, 544.1, "hirviendo", "HIRVIENDO", "nunca frío");
  add(544.1, 550.0, () => <X.Versus t={t} at={A("se pasma", 543)} out={549.8} x={960} y={300} a="CALIENTE" b="FRÍO" w={900} rows={[["sigue el hervor", true, false], ["grano parejo", true, false]]} />);
  card(554.4, 559.3, "mas salado", "TANTITO MÁS SALADO", "de lo que te gusta pa' tomarlo");
  add(559.3, 564.2, () => <Nota t={t} at={A("ya tenia sal", 559)} out={564.0} x={1480} y={300} lines={["¿Ya tenía sal?", "No le eches."]} rot={3} w={420} />);
  served(4);
  banda(567.8, 573.4, 6, "6", "LO QUE VA ENCIMA, Y EL FUEGO");

  // ===== SECRETO 6 · encima, y el fuego =====
  add(573.4, 585.5, () => <X.Card t={t} at={A("zanahoria", 573)} out={585.3} x={480} y={420} from="left"><X.H s={50} c={CH.maiz}>ENCIMA, SIN HUNDIR</X.H>{[["1 zanahoria en cuadritos", A("zanahoria", 573)], ["1 puño de chícharos", A("chicharos", 574)], ["1 serrano ENTERO", A("chile serrano", 577)], ["1 ramita de cilantro", A("cilantro", 578)]].map(([l, a]) => <X.H key={l as string} s={42} f={HAND} c={t >= (a as number) ? CH.crema : "transparent"}>{l as string}</X.H>)}</X.Card>);
  add(585.5, 590.6, () => <X.Versus t={t} at={A("el chile entero", 585)} out={590.4} x={960} y={300} a="ENTERO" b="PARTIDO" w={900} rows={[["da aroma", true, false], ["no enchila", true, false]]} />);
  add(590.6, 595.5, () => <X.FuegoNivel t={t} at={A("suelte el hervor", 591)} out={595.3} x={420} y={430} lvl={2} label="DESTAPADO" />);
  add(599.7, 605.2, () => <N.Hoyitos t={t} at={599.8} out={605.0} x={1380} y={520} holesAt={A("esos hoyitos", 600)} />);
  add(605.2, 611.0, () => <><X.FuegoNivel t={t} at={A("al minimo", 605)} out={610.8} x={420} y={430} lvl={1} label="AL MÍNIMO" /><X.Cronometro t={t} at={A("y lo tapas", 608)} out={610.8} x={1560} y={380} mins={15} label="15 MIN TAPADO" /></>);
  add(616.2, 622.6, () => <Stamp t={t} at={A("se escapa el vapor", 617)} out={622.4} text="NO SE DESTAPA" x={960} y={250} size={92} />);
  add(622.6, 629.1, () => <Pill t={t} at={A("con la cuchara", 623)} out={628.9} x={1400} y={260} text="MOVERLO" />);
  served(5);
  banda(634.8, 640.5, 7, "7", "LO QUE SE HACE AL APAGAR");

  // ===== SECRETO 7 · servilleta y tenedor =====
  add(640.5, 645.7, () => <X.Cronometro t={t} at={A("los quince minutos", 641)} out={645.5} x={1560} y={380} mins={15} label="Y APAGAS" />);
  add(651.5, 657.8, () => <X.Cronometro t={t} at={A("diez minutos", 652)} out={657.6} x={1560} y={380} mins={10} label="REPOSO, SIN TOCARLO" />);
  add(657.8, 669.7, () => <N.Servilleta t={t} at={A("se chupa las gotas", 657)} out={669.5} x={960} y={600} okAt={A("si no la pones", 660) + 1.2} />);
  add(669.7, 676.0, () => <Palomita t={t} at={A("seco suelto", 669)} out={675.8} y={240} text="SECO, SUELTO, ESPONJADO" />);
  card(676.0, 682.0, "con un tenedor", "CON TENEDOR", "levantando de abajo", "l", 260);
  card(685.4, 690.5, "le sacas el chile", "FUERA CHILE Y CILANTRO", "y cada grano, solito");
  served(6);
  add(690.5, 695.9, () => <X.Card t={t} at={A("cuatro cosas mas", 691)} out={695.7} x={1440} y={260} from="right"><X.H s={60} c={CH.maiz}>4 COSAS MÁS</X.H><X.H s={44} f={HAND}>con este mismo arroz</X.H></X.Card>);

  // ===== variantes =====
  add(699.8, 712.7, () => <X.Card t={t} at={A("la primera", 699)} out={712.5} x={480} y={220} from="left"><X.H s={52} c={CH.maiz}>1 · CON HUEVO</X.H></X.Card>);
  add(706.5, 712.7, () => <Nota t={t} at={A("le encanta", 710)} out={712.5} x={1480} y={300} lines={["A Lupe", "le encanta."]} rot={4} w={380} />);
  add(718.6, 729.4, () => <X.Card t={t} at={A("treinta gentes", 718)} out={729.2} x={480} y={220} from="left"><X.H s={52} c={CH.maiz}>2 · FIESTA DE 30</X.H><X.H s={42} f={HAND}>con mi hermana Licha</X.H></X.Card>);
  add(724.1, 729.4, () => <Receipt t={t} rows={[{ at: A("un kilo de arroz", 719), item: "1 kg de arroz", $: 32 }, { at: A("dos litros", 724), item: "2 L de caldo", $: 0 }, { at: A("medio kilo", 725), item: "½ kg jitomate", $: 20 }]} totalAt={1e9} x={1320} y={160} out={729.2} title="PA' 30 GENTES" />);
  card(732.8, 738.5, "sea ancha", "CAZUELA ANCHA", "capa bajita, se cuece parejo");
  add(738.5, 756.5, () => <X.Card t={t} at={A("la tercera", 738)} out={756.3} x={480} y={220} from="left"><X.H s={52} c={CH.maiz}>3 · SIN CALDO</X.H><X.H s={42} f={HAND}>huesito, cebolla y ajo</X.H></X.Card>);
  add(750.5, 756.5, () => <X.Cronometro t={t} at={A("veinte minutos", 749)} out={756.3} x={1560} y={380} mins={20} label="YA ES CALDO" />);
  add(756.5, 781.3, () => <X.Card t={t} at={A("la cuarta", 758)} out={781.1} x={480} y={220} from="left"><X.H s={52} c={CH.maiz}>4 · LO QUE SOBRA</X.H></X.Card>);
  add(769.3, 775.5, () => <Nota t={t} at={A("tortitas", 772)} out={775.3} x={1480} y={300} lines={["Las tortitas", "de Lety."]} rot={-3} w={400} />);
  card(775.5, 781.3, "un huevo", "ARROZ + HUEVO + QUESO", "a la sartén, con salsa", "r", 300);

  // ===== CTA 2: la olla del domingo =====
  add(786.0, 790.6, () => <><X.Fondo o={0.4 * e(t, 786.1, 786.5) * (1 - e(t, 790.2, 790.6))} /><N.PaginaReal t={t} at={A("en mi recetario", 785)} out={790.4} x={960} y={520} a="guia_l1_tapa.jpg" b="guia_l1_p12.jpg" flipAt={A("la pagina doce", 786)} w={560} cap="Libro 1 · pág. 12" /></>);
  card(790.6, 795.2, "una sola olla", "UNA SOLA OLLA", "de caldo de res, el domingo");
  add(795.2, 799.6, () => <X.Cifra t={t} at={A("siete comidas", 795)} out={799.4} x={960} y={480} to={7} post=" comidas" sub="de una olla, pa' 4 gentes" />);
  add(804.2, 809.9, () => <N.PaginaReal t={t} at={A("el miercoles", 803)} out={809.7} x={1450} y={560} a="guia_l1_p21.jpg" w={560} rot={3} hl={[{ at: A("este arroz rojo", 805), y0: 0.07, y1: 0.12 }]} cap="Miércoles: este arroz" />);
  add(809.9, 815.9, () => <X.DescCard t={t} at={A("lo tienes", 806)} out={812.6} x={1440} y={760} hl={A("primera", 809)} />);
  add(812.6, 820.9, () => <BigNum t={t} at={A("lo que puede salir mal", 811)} out={815.7} text="SI ALGO SALE MAL" size={130} y={500} col={CH.crema} edge="#4a1a0c" />);

  // ===== lo que puede salir mal =====
  add(820.9, 831.3, () => <X.FixCard t={t} at={820.9} out={826.0} x={960} y={860} prob="EN BOLA" fix={["agua hasta que salga clara", "ni lo toques"]} fixAt={A("la proxima vez", 821)} />);
  add(826.2, 831.3, () => <X.Cita t={t} at={A("no es que no sepas", 826)} out={829.6} x={960} y={300} text="No es que no sepas cocinar." size={86} />);
  add(829.6, 845.1, () => <X.FixCard t={t} at={A("se te pego", 829)} out={844.9} x={960} y={860} prob="SE PEGÓ ABAJO" fix={["no raspes", "sirve lo de arriba"]} fixAt={A("no raspes", 835)} />);
  add(845.1, 859.0, () => <X.FixCard t={t} at={A("si quedo duro", 845)} out={A("palido", 853) - 0.3} x={960} y={860} prob="QUEDÓ DURO" fix={["chorrito de caldo caliente", "5 min más, fuego mínimo"]} fixAt={A("dejalo cinco minutos", 850)} />);
  add(853.0, 865.1, () => <X.FixCard t={t} at={A("palido", 853)} out={A("salado", 860) - 0.3} x={960} y={860} prob="PÁLIDO, ROSITA" fix={["freír el jitomate", "hasta que se seque"]} fixAt={A("no se frio", 858)} />);
  add(859.0, 865.1, () => <X.FixCard t={t} at={A("salado", 860)} out={864.9} x={960} y={860} prob="SALADO" fix={["sin consomé en polvo"]} fixAt={A("el consome", 862)} />);
  add(869.8, 880.7, () => <X.Refri t={t} at={A("en menos de dos horas", 873)} out={880.5} x={960} y={540} inAt={A("refrigerador", 877)} />);
  add(880.7, 890.8, () => <X.Card t={t} at={A("que eche vapor", 884)} out={890.6} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>RECALENTAR</X.H><X.H s={44} f={HAND}>chorrito de caldo, que eche vapor</X.H></X.Card>);

  // ===== la cuenta =====
  add(890.8, 902.7, () => <Precio t={t} at={A("cuarenta y cinco pesos", 891)} out={902.5} x={1440} y={140} top="$45" sub="UNA PORCIÓN EN LA FONDA" />);
  add(896.0, 931.6, () => <Receipt t={t} rows={[
    { at: A("treinta y dos pesos", 895), item: "arroz (de 1 kg)", $: 16 }, { at: A("unos veinte pesos", 902), item: "½ kg jitomate", $: 20 },
    { at: A("veinticinco pesos", 907), item: "verduritas", $: 25 }, { at: A("del hueso", 912), item: "caldo del hueso", $: 0 }]}
    totalAt={1e9} x={120} y={110} out={916.0} sc={1.05} title="PA' 8 GENTES" />);
  add(917.4, 922.3, () => <X.Cifra t={t} at={A("te gastas como", 919)} out={922.1} x={960} y={480} to={35} pre="$" sub="la cazuela, pa' 8 gentes" />);
  add(922.3, 926.7, () => <BigNum t={t} at={A("cuatro pesos y medio", 922)} out={926.5} text="$4.50 EL PLATO" size={130} y={300} col={CH.maiz} edge="#5a2a10" />);
  add(926.7, 931.6, () => <X.Card t={t} at={A("en tu casa come", 928)} out={931.4} x={1440} y={280} from="right"><X.H s={50} c={CH.maiz}>1 PORCIÓN DE FONDA</X.H><X.H s={44} f={HAND}>= toda la familia en tu casa</X.H></X.Card>);

  // ===== resumen, tarea, comentarios, próximo =====
  const RT = ["lavar hasta clara", "que suene a arena", "jitomate tatemado", "freír el jitomate", "caldo caliente", "fuego mínimo, tapado", "servilleta y tenedor"];
  add(937.3, 974.9, () => PLATES.map((q, i) => { const p = sc(t, q); const w = partAt(t); return w && !w.c ? <X.PlateLabel key={i} t={t} at={RES[i]} out={974.7} x={p.x} y={p.y} n={i + 1} text={RT[i]} /> : null; }));
  add(943.5, 949.5, () => <X.Orden t={t} at={943.6} out={949.3} steps={[{ label: "1 · lavar", at: 943.7 }, { label: "2 · arena", at: 944.2 }, { label: "3 · tatemar", at: RES[2] }]} />);
  add(958.6, 963.8, () => <X.Orden t={t} at={958.7} out={963.6} steps={[{ label: "5 · caldo", at: 958.8 }, { label: "6 · fuego mínimo", at: RES[5] }]} />);
  add(974.9, 986.0, () => <X.Tarea t={t} at={A("no hagas los siete", 970)} out={985.8} x={1360} y={500} rows={[{ at: A("frie tu arroz", 975), text: "fríelo hasta que suene a arena" }, { at: A("hazlo con caldo", 976), text: "con caldo, en vez de agua" }]} />);
  add(986.0, 996.8, () => <X.Encuesta t={t} at={A("cuentame aqui abajo", 986)} out={996.6} x={1340} y={440} q="¿LLEVA CHÍCHAROS?" a="con chícharos" b="nomás zanahoria" pa={-1} />);
  add(991.4, 996.8, () => <Pensado t={t} at={A("de que parte eres", 992)} out={996.6} x={560} y={860} text="¿y de qué parte eres?" size={84} />);
  add(1001.5, 1006.3, () => <X.Card t={t} at={A("tortillas", 1001)} out={1006.1} x={1300} y={420} from="right" w={820}><X.H s={44} c={CH.maiz}>EL PRÓXIMO VIDEO</X.H><X.H s={66}>Las tortillas más suaves</X.H><X.H s={44} f={HAND}>las que no se ponen duras</X.H></X.Card>);
  add(1006.3, END_T, () => <X.Cita t={t} at={A("te espero", 1006)} out={END_T - 0.9} x={960} y={300} text="Te espero aquí, en mi cocina." size={90} />);
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
