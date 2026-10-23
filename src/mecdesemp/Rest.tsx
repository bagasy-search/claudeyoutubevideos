// mecdesemp · EL RESTO (fin del minuto 1 → final). Un solo hilo sin cortes secos: el avatar en cada ventana del reel,
// tomas reales con empuje propio (cada foto/clip UNA sola vez) y, entre medio, piezas 2D sobre el pizarrón del taller
// (la cortina que sube, el punto de rocío, el camino del aire, la botonera del orden, la guía abierta en la pág. 30/32…).
// Todo anclado a la voz con at("frase"). Uniones: barrido / portal / iris / zoom / cortina, nunca con desenfoque.
// Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Avatar, Shot, Stamp, WIN, MIN1_END } from "./Min1";
import { at, END } from "./at";
import { BigNum, COL, DrawX, Flash, FONT, Portal, Tag, e, ei, extrude } from "./lib";
import { AvBadge, Comment, Desc, ErrorCard, Flow, KitTray, Libro, MaxTimer, NextCard, Recap, Rows, StepPlate, Subscribe, VsCard } from "./kit2d";
import { AcBtn, Botonera, Cortina, Fondo, Jarras, Rocio } from "./rest2d";

export const REST_START = MIN1_END;
export const FULL_END = END;

type Base = (t: number) => React.ReactNode;
const AV = (ms: number, me: number): Base => (t) => <Avatar t={Math.min(Math.max(t, ms), me - 0.03)} />;
const S = (k: string, a: number, z: [number, number] = [1.03, 1.13], dur = 8, ox = 0, oy = 0): Base => (t) => <Shot k={k} t={t} a={a} z={z} ox={ox} oy={oy} dur={dur} />;
// fondo de las piezas = el MISMO mundo 3D del minuto 1 (cámara quieta en su último encuadre), oscurecido, con la grilla encima
const Mundo: React.FC<{ t: number; tone: string }> = ({ t, tone }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ transform: `scale(${1.06 + 0.03 * Math.sin(t * 0.13)}) translate(${8 * Math.sin(t * 0.09)}px, ${5 * Math.cos(t * 0.11)}px)` }}><Img src={staticFile("mecdesemp/mundo_bg.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: tone, opacity: 0.78 }} />
    <AbsoluteFill style={{ opacity: 0.55 }}><Fondo t={t} /></AbsoluteFill>
  </AbsoluteFill>
);
const BK: Base = (t) => <Mundo t={t} tone="#070c14" />;
const BKr: Base = (t) => <Mundo t={t} tone="#1a0909" />;

type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
type Seg = { a: number; base: Base; tr?: Tr; px?: number; py?: number };
const D = 0.36;

const Trans: React.FC<{ t: number; s: Seg; from: React.ReactNode; to: React.ReactNode }> = ({ t, s, from, to }) => {
  const k = ei(t, s.a, s.a + D), tr = s.tr ?? "fade";
  const L = (n: React.ReactNode, st: React.CSSProperties, key: string) => <AbsoluteFill key={key} style={st}>{n}</AbsoluteFill>;
  if (tr === "swipeL" || tr === "swipeR" || tr === "up" || tr === "down") {
    const dir = tr === "swipeL" || tr === "up" ? 1 : -1, ax = tr === "up" || tr === "down" ? "Y" : "X", DD = ax === "Y" ? 1080 : 1920;
    return <AbsoluteFill>{L(from, { transform: `translate${ax}(${-dir * k * DD}px)` }, "f")}{L(to, { transform: `translate${ax}(${dir * (1 - k) * DD}px)` }, "t")}</AbsoluteFill>;
  }
  if (tr === "portal") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><Portal x={s.px ?? 960} y={s.py ?? 540} r={k}>{to}</Portal></AbsoluteFill>;
  if (tr === "iris") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `circle(${k * 1150}px at ${s.px ?? 960}px ${s.py ?? 540}px)` }}>{to}</AbsoluteFill><Flash t={t} at={s.a + 0.02} col="#eaf6ff" peak={0.3} w={0.3} /></AbsoluteFill>;
  if (tr === "wipe") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `inset(${(1 - k) * 100}% 0 0 0)` }}>{to}</AbsoluteFill></AbsoluteFill>;
  if (tr === "zoom") return <AbsoluteFill><AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * k})` }}>{to}</AbsoluteFill><AbsoluteFill style={{ opacity: 1 - k, transform: `scale(${1 + k * 0.35})` }}>{from}</AbsoluteFill></AbsoluteFill>;
  return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ opacity: k }}>{to}</AbsoluteFill></AbsoluteFill>;
};

// ventana del avatar que arranca cerca de ms
const W_ = (ms: number) => { const w = WIN.find((x) => Math.abs(x.ms - ms) < 0.3); if (!w) throw new Error("sin ventana de avatar en " + ms); return w; };
const inAv = (t: number) => WIN.some((w) => t >= w.ms - 0.05 && t < w.me + 0.05);

const buildSegs = (): Seg[] => {
  const g = (a: number, base: Base, tr?: Tr, extra: Partial<Seg> = {}): Seg => ({ a, base, tr, ...extra });
  const av = (ms: number, tr: Tr = "swipeL"): Seg[] => { const w = W_(ms); return [{ a: w.ms, base: AV(w.ms, w.me), tr }]; };
  const me = (ms: number) => W_(ms).me;
  const sh = (k: string, a: number, b: number, tr: Tr = "swipeL", z: [number, number] = [1.03, 1.13], extra: Partial<Seg> = {}) => g(a, S(k, a, z, b - a), tr, extra);
  const c1 = at("cuando empieza el frio", 86), tCasa = at("pero vale mas que lo sepas", 100), tSe = at("y el vidrio se cerro", 120);
  const tAgua = at("el aire acondicionado no solo", 215), tCae = at("esa agua cae", 235), tAletas = at("por ahi se enfria", 230);
  const tRec = at("es el boton del autito", 290), t3 = at("3 la temperatura", 300), t4 = at("4 el ventilador", 300), tMod = at("muchos autos de ahora", 314);
  const tCam = at("solo un ratito si pasas", 375), tErr = at("ahora los errores", 380), tNoPas = at("si estas parado", 410);
  const tTab = at("el plastico del tablero", 430), tKit = at("se limpia con limpia", 445), tGris = at("dona elena tenia el vidrio", 460);
  const tMes = at("lo habia limpiado", 476), tTubo = at("y no se volco nada", 545), tAcomp = at("es la del acompanante", 540);
  const tFil = at("y otra cosa el filtro", 560), tHong = at("si apagas el auto", 625);
  const tAfu = at("hay una vez en que", 635), tSen = at("y ahora la senal", 685), tDep = at("mira el nivel del deposito", 715);
  const tPag32 = at("esta en el manual en la pagina 32", 735), tCom = at("ahora dime tu", 780), tCuarto = at("dona elena ahora sale", 815);
  return [
    // --- INTRO: lo que dicen en el taller → nada roto → gratis en la vereda → a las 7 el taller está cerrado ---
    g(REST_START, S("w_tibio", REST_START, [1.04, 1.14], 11), "swipeL"),
    ...av(98.2, "up"),
    sh("r_taller", me(98.2), tCasa, "swipeR"),
    sh("e_casa", tCasa, 115.3, "iris", [1.1, 1.02], { px: 960, py: 420 }),
    ...av(115.3),
    sh("e_manos", me(115.3), tSe, "down", [1.02, 1.14]),
    sh("w_gotas", tSe, 131.7, "zoom", [1.0, 1.12]),
    ...av(131.7, "swipeR"),
    g(me(131.7), BK, "wipe"),
    sh("r_mostrador", at("antes de seguir", 140), 147.3, "swipeL"),
    ...av(147.3, "up"),
    g(me(147.3), BK, "portal"),
    // --- POR QUÉ SE EMPAÑA ---
    sh("w_aliento", at("vamos a lo importante", 155), 163.5, "swipeR", [1.02, 1.12]),
    ...av(163.5),
    sh("w_paraguas", me(163.5), 177.5, "down", [1.04, 1.15]),
    ...av(177.5, "swipeR"),
    sh("w_vaso", me(177.5), at("hay un numero que", 188), "swipeL", [1.02, 1.14]),
    g(at("hay un numero que", 188), BK, "iris"),
    ...av(193.8, "up"),
    g(me(193.8), BK, "down"),
    ...av(212.7, "swipeL"),
    g(me(212.7), BK, "zoom"),
    ...av(227.2, "swipeR"),
    sh("a_evaporador", me(227.2), tAletas, "portal", [1.02, 1.12], { px: 960, py: 540 }),
    sh("a_aletas", tAletas, tCae, "zoom", [1.0, 1.1]),
    sh("a_charco", tCae, 245.0, "down", [1.06, 1.14]),
    ...av(245.0, "swipeL"),
    g(me(245.0), BK, "wipe"),
    ...av(261.4, "swipeR"),
    g(me(261.4), BK, "iris"),
    ...av(277.0, "up"),
    // --- EL ORDEN EXACTO ---
    g(me(277.0), BK, "down"),
    ...av(293.2, "swipeL"),
    sh("o_recirc", me(293.2), t3, "swipeR", [1.04, 1.14]),
    sh("o_temp", t3, t4, "swipeL", [1.03, 1.12]),
    sh("o_vent", t4, 309.8, "swipeL", [1.03, 1.12]),
    ...av(309.8, "up"),
    sh("o_modo", me(309.8), tMod, "down", [1.03, 1.12]),
    sh("o_moderno", tMod, 324.3, "zoom", [1.08, 1.0]),
    ...av(324.3, "swipeR"),
    g(me(324.3), BK, "iris"),
    ...av(340.5, "swipeL"),
    sh("o_ventanillas", me(340.5), at("por que apagar la recirculacion", 350), "swipeR", [1.02, 1.12]),
    g(at("por que apagar la recirculacion", 350), BK, "wipe"),
    ...av(356.3, "up"),
    g(me(356.3), BK, "down"),
    ...av(372.4, "swipeL"),
    g(me(372.4), BK, "zoom"),
    sh("f_camion", tCam, tErr, "swipeR", [1.04, 1.14]),
    g(tErr, BKr, "iris"),
    // --- ERROR 1: EL TRAPO ---
    ...av(390.4, "swipeL"),
    sh("e1_manga", me(390.4), 405.9, "swipeR", [1.03, 1.14]),
    ...av(405.9, "up"),
    sh("e1_noche", me(405.9), tNoPas, "down", [1.02, 1.12]),
    g(tNoPas, BK, "wipe"),
    // --- ERROR 2: EL VIDRIO SUCIO POR DENTRO ---
    ...av(423.3, "swipeL"),
    sh("e2_sol", me(423.3), tTab, "swipeR", [1.02, 1.12]),
    sh("e2_tablero", tTab, 440.6, "zoom", [1.1, 1.02]),
    ...av(440.6, "swipeL"),
    g(me(440.6), BK, "iris"),
    sh("e2_kit", tKit, 455.7, "up", [1.02, 1.12]),
    ...av(455.7, "swipeR"),
    sh("e2_dorso", me(455.7), tGris, "swipeL", [1.04, 1.14]),
    sh("e2_gris", tGris, 471.9, "zoom", [1.0, 1.1]),
    ...av(471.9, "swipeR"),
    g(me(471.9), BK, "wipe"),
    // --- CTA 2 ---
    ...av(487.9, "up"),
    g(me(487.9), BK, "down"),
    ...av(504.1, "swipeL"),
    g(me(504.1), BK, "zoom"),
    // --- ERROR 3: EL AGUA ESCONDIDA ---
    ...av(521.4, "swipeR"),
    sh("e3_alfombra", me(521.4), 539.5, "swipeL", [1.02, 1.14]),
    ...av(539.5, "up"),
    sh("e3_sol", me(539.5), tTubo, "down", [1.03, 1.12]),
    sh("e3_tubo", tTubo, 558.3, "portal", [1.0, 1.12], { px: 960, py: 600 }),
    ...av(558.3, "swipeL"),
    sh("e3_filtro", tFil, 576.4, "swipeR", [1.03, 1.14]),
    g(me(558.3), BK, "wipe"),
    // --- ERROR 4: EL COMPRESOR CON MUCHO FRÍO ---
    ...av(576.4, "up"),
    sh("e4_helada", me(576.4), 591.5, "down", [1.02, 1.12]),
    ...av(591.5, "swipeL"),
    g(me(591.5), BK, "iris"),
    ...av(609.2, "swipeR"),
    sh("e4_llegar", me(609.2), 626.3, "swipeL", [1.03, 1.13]),
    ...av(626.3, "up"),
    g(me(626.3), BK, "down"),
    // --- AFUERA · ATRÁS ---
    g(tAfu + 0.4, BKr, "wipe"),
    ...av(643.1, "swipeL"),
    sh("x_lluvia", me(643.1), 662.1, "swipeR", [1.02, 1.12]),
    ...av(662.1, "up"),
    sh("x_trasero", me(662.1), 677.4, "down", [1.03, 1.14]),
    ...av(677.4, "swipeL"),
    g(me(677.4), BK, "zoom"),
    g(tSen, BKr, "iris"),
    // --- LA SEÑAL ---
    ...av(694.6, "swipeR"),
    sh("s_vapor", me(694.6), 712.2, "swipeL", [1.02, 1.12]),
    ...av(712.2, "up"),
    g(me(712.2), BKr, "down"),
    sh("s_deposito", tDep, 727.1, "zoom", [1.1, 1.02]),
    ...av(727.1, "swipeR"),
    sh("s_taller", me(727.1), tPag32, "swipeL", [1.03, 1.12]),
    g(tPag32, BK, "portal"),
    ...av(746.3, "up"),
    // --- EL REPASO ---
    sh("c_salida", me(746.3), 762.3, "down", [1.02, 1.1]),
    ...av(762.3, "swipeL"),
    sh("c_libreta", me(762.3), 779.4, "swipeR", [1.02, 1.1]),
    ...av(779.4, "up"),
    g(tCom - 0.3, BK, "down"),
    ...av(796.3, "swipeL"),
    g(me(796.3), BK, "zoom"),
    ...av(812.5, "swipeR"),
    g(me(812.5), BKr, "wipe"),
    g(tCuarto, BK, "iris"),
    ...av(830.7, "up"),
  ].filter((s) => s.a < FULL_END).sort((a, b) => a.a - b.a);
};

// ---------- piezas encima (cada una maneja su entrada/salida) ----------
type Ov = { a: number; b: number; n: (t: number) => React.ReactNode };

const buildOvs = (): Ov[] => {
  const o = (a: number, b: number, n: (t: number) => React.ReactNode): Ov => ({ a, b, n });
  const big = (key: string, a: number, out: number, text: string, y = 200, size = 100, col: string = COL.ink, edge = "#1c2a3a", sub?: string, x = 960) =>
    o(a, out, (t) => <BigNum key={key} t={t} at={a} text={text} x={x} y={y} size={size} col={col} edge={edge} out={out} sub={sub} />);
  const tag = (key: string, a: number, out: number, x: number, y: number, text: string, dx = 260, dy = -160, col: string = COL.ink, size = 50, sub?: string) =>
    o(a, out, (t) => <Tag key={key} t={t} at={a} x={x} y={y} dx={dx} dy={dy} text={text} col={col} out={out} size={size} sub={sub} />);
  const stamp = (key: string, a: number, out: number, text: string, x = 1400, y = 860, col: string = COL.red, size = 90, rot = -7) =>
    o(a, out, (t) => <Stamp key={key} t={t} at={a} text={text} x={x} y={y} out={out} col={col} size={size} rot={rot} />);
  const GREEN = "#7dff9e", YEL = "#ffd60a";
  const me = (ms: number) => W_(ms).me;
  return [
    // --- INTRO ---
    o(at("la gente llega al taller", 86), 98.1, (t) => <Rows key="dic" t={t} title="LLEGAN AL TALLER DICIENDO…" x={1380} y={520} out={98.0} rows={[
      { at: at("que la calefaccion no funciona", 86), ic: "🔥", tx: "LA CALEFACCIÓN NO ANDA" }, { at: at("que el ventilador esta", 86), ic: "🌀", tx: "EL VENTILADOR, FLOJO" },
      { at: at("que algo anda mal", 86), ic: "❓", tx: "ALGO ANDA MAL EN EL AIRE" }]} />),
    stamp("nroto", at("hay nada roto", 98), me(98.2) - 0.1, "NADA ROTO", 1420, 860, GREEN, 96),
    big("3b", at("es la forma de usar", 98), me(98.2) - 0.1, "3 BOTONES", 230, 120, YEL, "#5a4500", undefined, 1400),
    tag("vereda", at("un buen taller te lo", 100), at("pero vale mas que lo sepas", 100) - 0.1, 960, 560, "TE LO EXPLICA GRATIS", 300, -200, GREEN, 52, "EN LA VEREDA"),
    o(at("a las 7 de la manana", 105), 112.4, (t) => <MaxTimer key="7am" t={t} at={at("a las 7 de la manana", 105)} out={112.3} x={560} y={300} label="7:00" sub="TALLER CERRADO" col={COL.red} />),
    big("elena", at("dona elena me llamo", 110), 115.2, "DOÑA ELENA · MARTES", 870, 90, "#ffd08a", "#4a2a00"),
    big("llevar", at("lo voy a tener que llevar", 115), me(115.3) - 0.1, "“LO VOY A TENER QUE LLEVAR”", 900, 64, COL.ink, "#1c2a3a"),
    o(at("prendio la calefaccion", 120), at("y el vidrio se cerro", 120) - 0.1, (t) => <Rows key="hizo" t={t} title="LO QUE HIZO ELENA" x={1380} y={500} out={at("y el vidrio se cerro", 120) - 0.2} rows={[
      { at: at("prendio la calefaccion", 120), ic: "🔥", tx: "CALEFACCIÓN A FONDO" }, { at: at("la recirculacion prendida", 120), ic: "🔁", tx: "RECIRCULACIÓN PRENDIDA", no: true },
      { at: at("el aire apagado", 120), ic: "❄", tx: "AIRE APAGADO", no: true }]} />),
    tag("1min", at("y el vidrio se cerro", 120) + 0.3, 131.6, 960, 420, "SE CERRÓ EN 1 MINUTO", 300, -170, COL.ice, 56),
    big("1bot", at("le dije que apretara", 128), 131.6, "UN BOTÓN", 860, 120, YEL, "#5a4500"),
    big("uno", at("uno solo", 130), me(131.7) - 0.1, "UNO SOLO", 230, 110, YEL, "#5a4500", undefined, 1400),
    o(me(131.7), at("antes de seguir", 140), (t) => <Cortina key="cort" t={t} at={me(131.7)} openAt={me(131.7) + 0.25} out={at("y por que nadie", 136) - 0.2} />),
    big("40a", at("y por que nadie", 136), at("antes de seguir", 140) - 0.1, "“¿Y POR QUÉ NADIE ME LO DIJO EN 40 AÑOS?”", 540, 64, COL.ink, "#1c2a3a"),
    tag("most", at("decir en el mostrador", 143), 147.2, 960, 520, "LO QUE DICES EN EL MOSTRADOR", 280, -220, YEL, 46),
    stamp("cobren", at("para que no te cobren", 147), me(147.3) - 0.1, "QUE NO TE COBREN DE MÁS", 1300, 880, YEL, 70),
    // --- CTA 1: la guía en la pág. 30 ---
    o(me(147.3), at("link esta abajo", 150) - 0.05, (t) => <Libro key="lib30" t={t} at={me(147.3) + 0.05} openAt={at("lo de los vidrios", 148)} out={at("link esta abajo", 150) - 0.2} page={30}
      hl={{ at: at("esta en la pagina 30", 150) + 0.2, x: 0.07, y: 0.54, w: 0.42, h: 0.4 }} />),
    o(at("link esta abajo", 150), at("vamos a lo importante", 155), (t) => <Desc key="d1" t={t} at={at("link esta abajo", 150)} out={at("vamos a lo importante", 155) - 0.2} />),
    // --- POR QUÉ SE EMPAÑA ---
    big("nofrio", at("empanado no es frio", 158), 163.4, "NO ES FRÍO", 860, 130, COL.ice, "#0a2a40"),
    stamp("agua", at("es agua", 163), me(163.5) - 0.1, "ES AGUA", 1420, 860, COL.ice, 110),
    o(at("dos personas adentro", 165), 177.4, (t) => <KitTray key="hum" t={t} out={177.3} y={140} items={[
      { at: at("dos personas adentro", 165), ic: "👥", tx: "2 PERSONAS" }, { at: at("un abrigo mojado", 165), ic: "🧥", tx: "ABRIGO MOJADO" }, { at: at("un paraguas en el piso", 165), ic: "☂️", tx: "PARAGUAS" }]} />),
    big("minutos", at("se llena de humedad", 170), 177.4, "HUMEDAD EN MINUTOS", 900, 96, COL.ice, "#0a2a40"),
    tag("suda", at("el vaso no", 183), 191.0, 1000, 560, "EL VASO NO SUDA", 300, -200, COL.ice, 56),
    tag("deja", at("es el aire que deja", 185), 191.0, 1000, 560, "EL AIRE DEJA SU AGUA", -340, 200, YEL, 50),
    big("rocio", at("se llama punto", 190), me(193.8) - 0.1, "PUNTO DE ROCÍO", 220, 100, YEL, "#5a4500", undefined, 1400),
    o(me(193.8), 212.6, (t) => <Rocio key="roc" t={t} at={me(193.8) + 0.05} dropAt={at("si el vidrio esta mas frio", 195)} out={at("entonces tienes dos", 200) - 0.2} />),
    stamp("siempre", at("se empana siempre", 200), at("entonces tienes dos", 200) - 0.15, "SIEMPRE", 1500, 220, COL.red, 100),
    o(at("entonces tienes dos", 200), 212.6, (t) => <VsCard key="dos" t={t} at={at("entonces tienes dos", 200)} out={212.5} y={540}
      l={{ h: "SECAR EL AIRE", rows: [{ at: at("entonces tienes dos", 200) + 0.4, tx: "EL QUE NADIE USA" }] }}
      r={{ h: "CALENTAR EL VIDRIO", rows: [{ at: at("que tarda porque", 205), tx: "TARDA" }, { at: at("el motor esta frio", 205), tx: "MOTOR FRÍO · AIRE TIBIO" }] }} />),
    o(me(212.7), at("adentro del tablero hay", 225), (t) => <AcBtn key="ac1" t={t} at={me(212.7) + 0.05} pressAt={at("el aire acondicionado", 222)} out={227.1} sub={t > tSeca() ? "NO SÓLO ENFRÍA: SECA" : "LA QUE NADIE USA EN INVIERNO"} />),
    stamp("seca", at("seca adentro", 226), me(227.2) - 0.1, "SECA", 1450, 860, COL.ice, 120),
    tag("evap", me(227.2) + 0.3, at("por ahi se enfria", 230) - 0.1, 960, 520, "EL EVAPORADOR", 300, -220, COL.ice, 60, "MUY FRÍO"),
    tag("comp", at("cuando el compresor", 230), at("por ahi se enfria", 230) - 0.1, 960, 520, "CUANDO TRABAJA EL COMPRESOR", -320, 220, YEL, 44),
    tag("pega", at("deja su agua pegada", 235), at("esa agua cae", 235) - 0.1, 960, 540, "EL AGUA QUEDA PEGADA", 300, -200, COL.ice, 54, "IGUAL QUE EL VASO"),
    tag("tubo", at("por un tubito", 240), 244.9, 1000, 620, "EL TUBITO", 300, -200, YEL, 58, "CAE DEBAJO DEL AUTO"),
    big("charq", at("un charquito", 245), me(245.0) - 0.1, "EL CHARQUITO DEL VERANO", 900, 80, COL.ice, "#0a2a40"),
    big("nadie", at("y aca esta la", 249), 261.3, "LA PARTE QUE NADIE SABE", 170, 90, YEL, "#5a4500"),
    o(at("el aire pasa primero", 252), 261.3, (t) => <Flow key="f1" t={t} out={261.2} y={620} items={[
      { at: at("el aire pasa primero", 252), ic: "🌬️", tx: "AIRE" }, { at: at("por ese evaporador", 252), ic: "❄", tx: "EVAPORADOR", sub: "LE SACA EL AGUA", col: COL.ice },
      { at: at("despues por el radiador", 255), ic: "🔥", tx: "CALEFACCIÓN", sub: "LO CALIENTA", col: "#ff9f43" }]} />),
    stamp("seco", at("aire seco y caliente", 262), me(261.4) - 0.1, "SECO + CALIENTE", 1360, 860, "#ff9f43", 84),
    o(me(261.4), 276.9, (t) => <Flow key="f2" t={t} out={276.8} y={560} items={[
      { at: me(261.4) + 0.05, ic: "🌬️", tx: "AIRE" }, { at: at("el compresor le saca", 265), ic: "❄", tx: "SE SECA", col: COL.ice },
      { at: at("la calefaccion lo calienta", 266), ic: "🔥", tx: "SE CALIENTA", col: "#ff9f43" }, { at: at("va directo al vidrio", 268), ic: "🪟", tx: "AL VIDRIO", col: GREEN }]} />),
    big("esponja", at("como una esponja", 272), 276.9, "COMO UNA ESPONJA", 860, 110, GREEN, "#0a3a1a"),
    big("30s", at("y no en 10 minutos", 279), me(277.0) - 0.1, "30 SEG · NO 10 MIN", 200, 100, GREEN, "#0a3a1a", undefined, 1350),
    // --- EL ORDEN ---
    o(me(277.0), 293.1, (t) => <StepPlate key="ord" t={t} at={me(277.0) + 0.1} out={at("1 el boton", 282) - 0.3} n="EL ORDEN" tx="EXACTO" y={480} />),
    o(at("1 el boton", 282), 293.1, (t) => <Botonera key="bot1" t={t} at={at("1 el boton", 282) - 0.2} out={293.0} steps={[at("1 el boton", 282) + 0.3]} y={560} sc={0.92} />),
    tag("luz", at("tiene que prender su", 288), 293.1, 640, 330, "TIENE QUE PRENDER LA LUZ", -300, -150, GREEN, 40),
    big("2rec", at("2 la recirculacion", 293), me(293.2) - 0.1, "2 · RECIRCULACIÓN OFF", 200, 84, YEL, "#5a4500", undefined, 1300),
    tag("auti", me(293.2) + 0.3, t3() - 0.1, 960, 520, "EL AUTITO CON LA FLECHA", 300, -200, YEL, 50, "LA LUZ, APAGADA"),
    tag("afu", at("aire de afuera 3", 300), t3() - 0.1, 960, 520, "AIRE DE AFUERA", -300, 200, COL.ice, 54),
    big("3", t3(), t4() - 0.1, "3 · CALOR, TODO ROJO", 200, 84, COL.red, "#3a0a06"),
    big("4", t4(), 309.7, "4 · VENTILADOR ALTO", 200, 84, COL.ice, "#0a2a40", "NO EN 1"),
    big("5", at("y 5 la salida", 309), me(309.8) - 0.1, "5 · AL PARABRISAS", 200, 84, GREEN, "#0a3a1a", undefined, 1300),
    tag("curvo", me(309.8) + 0.3, at("muchos autos de ahora", 314) - 0.1, 960, 540, "EL VIDRIO CURVO CON FLECHITAS", 300, -220, GREEN, 46),
    tag("solos", at("hacen todo eso solos", 316), 324.2, 960, 520, "MUCHOS LO HACEN SOLOS", 300, -200, GREEN, 52),
    big("muchosno", at("pero muchos no", 327), 340.4, "PERO MUCHOS NO", 180, 100, COL.red, "#3a0a06"),
    o(me(324.3), 340.4, (t) => <Botonera key="bot2" t={t} at={me(324.3) + 0.05} out={340.3} y={600} sc={0.82}
      steps={[at("mira si se prende solo", 335) + 0.3, me(324.3) + 0.5, me(324.3) + 0.7, me(324.3) + 0.9, at("aprieta el boton del parabrisas", 333) + 0.2]} />),
    tag("prueba", at("fijate hoy en el tuyo", 330), 340.4, 1450, 880, "HOY, EN EL TUYO", 0, -1, YEL, 52),
    big("dedo", at("baja un dedo", 345), at("por que apagar la recirculacion", 350) - 0.1, "UN DEDO, LAS DOS DE ADELANTE", 880, 76, COL.ink, "#1c2a3a"),
    tag("sale", at("el aire humedo se escapa", 349), at("por que apagar la recirculacion", 350) - 0.1, 1100, 380, "SALE EL HÚMEDO", 300, -150, "#ffb257", 50),
    tag("entra", at("y entra", 351), at("por que apagar la recirculacion", 350) - 0.1, 1100, 380, "ENTRA EL SECO", 300, 120, COL.ice, 50),
    big("porq", at("por que apagar la recirculacion", 350), 356.2, "¿POR QUÉ SIN RECIRCULACIÓN?", 540, 90, YEL, "#5a4500", "SI AFUERA ESTÁ HELADO"),
    o(me(356.3), 372.3, (t) => <Jarras key="jar" t={t} at={me(356.3) + 0.05} inAt={at("el aire de adentro el que", 362)} out={372.2} />),
    stamp("toalla", at("como secarte con una toalla", 374), me(372.4) - 0.1, "TOALLA MOJADA", 1420, 860, COL.red, 90),
    big("invi", at("la recirculacion va apagada", 378), tCam() - 0.1, "EN INVIERNO: RECIRCULACIÓN APAGADA", 540, 76, COL.ice, "#0a2a40", "CASI SIEMPRE"),
    tag("cami", tCam() + 0.4, tErr() - 0.1, 960, 470, "SÓLO DETRÁS DE UN CAMIÓN", 300, -200, YEL, 48, "Y LA VUELVES A APAGAR"),
    big("errs", tErr(), at("error numero uno", 388) - 0.1, "LOS 4 ERRORES", 540, 150, COL.red, "#3a0a06"),
    // --- ERROR 1 ---
    o(at("error numero uno", 388), me(390.4), (t) => <ErrorCard key="e1" t={t} at={at("error numero uno", 388)} out={me(390.4) - 0.1} n={1} of={4} tx="EL TRAPO" />),
    tag("2s", at("lo aclara dos segundos", 395), at("la piel y la tela", 398) - 0.1, 960, 500, "2 SEGUNDOS…", 300, -200, GREEN, 56),
    tag("peor", at("y despues queda peor", 397), at("la piel y la tela", 398) - 0.1, 960, 500, "…Y QUEDA PEOR", -300, 200, COL.red, 56),
    tag("grasa", at("la piel y la tela", 398), 405.8, 900, 520, "PIEL Y TELA = GRASA", 300, -200, "#ffd66b", 52),
    big("agarra", at("el agua se agarra", 405), me(405.9) - 0.1, "EL AGUA SE AGARRA A LA GRASA", 900, 70, "#ffd66b", "#4a3200"),
    tag("encand", at("se iluminan todas", 411), tNoPas() - 0.1, 960, 420, "DE NOCHE, TE ENCANDILAN", 300, -170, YEL, 52),
    o(tNoPas(), 423.2, (t) => <MaxTimer key="esp30" t={t} at={at("espera los", 415)} out={423.1} x={600} y={520} label="30 S" sub="ESPERA EL AIRE" col={GREEN} />),
    o(tNoPas(), 423.2, (t) => <DrawX key="xmano" t={t} at={at("no pases la mano", 415) + 0.2} x={1140} y={300} w={560} h={300} />),
    big("nomano", at("no pases la mano", 415), 423.2, "NO PASES LA MANO", 450, 70, COL.red, "#3a0a06", undefined, 1420),
    stamp("agu", at("y nunca manejes", 418), 423.2, "NUNCA POR UN AGUJERITO", 1300, 880, COL.red, 70),
    stamp("nosal", at("si no ves no sales", 423), at("error numero 2", 425) - 0.1, "SI NO VES, NO SALES", 1350, 860, COL.red, 84),
    // --- ERROR 2 ---
    o(at("error numero 2", 425), me(423.3), (t) => <ErrorCard key="e2" t={t} at={at("error numero 2", 425)} out={me(423.3) - 0.1} n={2} of={4} tx="EL VIDRIO SUCIO POR DENTRO" />),
    tag("gris", at("ves una pelicula gris", 430), tTab() - 0.1, 1000, 420, "UNA PELÍCULA GRIS", 300, -170, "#cfd6dc", 56, "COMO UN VELO = GRASA"),
    tag("vap", at("suelta unos vapores", 438), 440.5, 960, 560, "EL PLÁSTICO SUELTA VAPORES", 300, -220, "#ff9f43", 48),
    stamp("fuma", at("fuma en el auto", 442), me(440.6) - 0.1, "SI SE FUMA: PEOR", 1380, 860, COL.red, 80),
    big("prim", at("hace que el vidrio se", 445), tKit() - 0.1, "SE EMPAÑA PRIMERO", 420, 100, COL.ice, "#0a2a40"),
    big("ult", at("y se desempane", 446), tKit() - 0.1, "SE DESEMPAÑA ÚLTIMO", 640, 100, COL.red, "#3a0a06"),
    o(tKit(), 455.6, (t) => <KitTray key="kit" t={t} out={455.5} y={120} items={[
      { at: tKit(), ic: "🧴", tx: "LIMPIAVIDRIOS" }, { at: at("o con agua", 449), ic: "💧", tx: "AGUA + ALCOHOL" }, { at: at("dos panos de microfibra", 450), ic: "🧽", tx: "2 PAÑOS DE MICROFIBRA" }]} />),
    tag("hum", at("uno humedo para limpiar", 455), me(455.7) - 0.1, 600, 400, "UNO HÚMEDO · UNO SECO", 0, -1, COL.ice, 50),
    tag("dorso", at("dorso de la mano", 459), tGris() - 0.1, 960, 620, "CON EL DORSO DE LA MANO", 300, -220, COL.ink, 48),
    tag("acum", at("donde mas se acumula", 462), tGris() - 0.1, 960, 620, "AHÍ SE ACUMULA", -320, 200, YEL, 54),
    tag("pgris", at("el pano quedo gris", 468), 471.8, 960, 460, "EL PAÑO QUEDÓ GRIS", 300, -180, "#cfd6dc", 58),
    stamp("dentro", at("por dentro nunca", 475), me(471.9) + 0.6, "POR DENTRO: NUNCA", 1400, 860, COL.red, 80),
    o(me(471.9), 487.8, (t) => <MaxTimer key="mes" t={t} at={tMes() + 0.3} out={487.7} x={620} y={420} label="1×" sub="POR MES EN INVIERNO" col={GREEN} />),
    stamp("trapotab", at("y no limpies el vidrio", 482), 487.8, "NO CON EL TRAPO DEL TABLERO", 1100, 820, COL.red, 64),
    // --- CTA 2 ---
    o(at("suscribete", 488), 496.0, (t) => <Subscribe key="sub" t={t} at={at("suscribete", 488)} clickAt={at("al canal", 490) + 0.1} out={me(487.9) - 0.15} y={900} />),
    o(me(487.9), me(504.1) + 2.9, (t) => <Libro key="lib58" t={t} at={me(487.9) + 0.05} openAt={1e9} out={504.0} page={30} x={700} />),
    big("58", at("tienes 58", 498), 504.0, "58 TRUCOS DE TALLER", 200, 78, YEL, "#5a4500", undefined, 1340),
    tag("dorna", at("auto de dona elena", 494), at("en mi manual del mecanico", 498) - 0.1, 1400, 620, "LO QUE LE PASA A ELENA…", 0, -1, "#ffd08a", 50, "…TE VA A PASAR A TI"),
    big("most2", at("lo que no necesitas", 505), me(504.1) - 0.1, "QUE NO TE VENDAN LO QUE NO NECESITAS", 900, 60, COL.ink, "#1c2a3a"),
    big("rev", at("por menos de lo que", 508), at("el link esta abajo", 510) - 0.1, "MENOS QUE UNA SOLA REVISIÓN", 300, 90, GREEN, "#0a3a1a"),
    o(at("el link esta abajo", 510), at("error numero 3", 512) + 0.1, (t) => <Desc key="d2" t={t} at={at("el link esta abajo", 510)} out={at("error numero 3", 512)} />),
    // --- ERROR 3 ---
    o(at("error numero 3", 512), me(521.4), (t) => <ErrorCard key="e3" t={t} at={at("error numero 3", 512)} out={me(521.4) - 0.1} n={3} of={4} tx="EL AGUA QUE LLEVAS ADENTRO" y={300} />),
    big("todas", at("todas las mananas aunque", 516), 521.3, "TODAS LAS MAÑANAS, SIN LLUVIA", 700, 74, COL.ice, "#0a2a40"),
    stamp("escon", at("hay agua escondida", 521), me(521.4) - 0.1, "AGUA ESCONDIDA", 1400, 860, COL.ice, 84),
    tag("humeda", at("humeda ese es tu problema", 527), at("los paraguas mojados", 530) - 0.1, 960, 640, "HÚMEDA = TU PROBLEMA", 300, -240, COL.red, 56),
    big("noche", at("se evapora toda la noche", 528), at("los paraguas mojados", 530) - 0.1, "SE EVAPORA TODA LA NOCHE", 180, 80, COL.ice, "#0a2a40"),
    o(at("los paraguas mojados", 530), 539.4, (t) => <KitTray key="fuentes" t={t} out={539.3} y={120} items={[
      { at: at("los paraguas mojados", 530), ic: "☂️", tx: "PARAGUAS MOJADOS" }, { at: at("la nieve de", 530), ic: "❄️", tx: "NIEVE DE LOS ZAPATOS" }, { at: at("una botella que se", 530), ic: "🍼", tx: "UNA BOTELLA VOLCADA" }]} />),
    tag("acomp", tAcomp() + 0.2, tTubo() - 0.1, 960, 560, "EL ACOMPAÑANTE · ADELANTE", 300, -200, YEL, 50),
    tag("tubito", tTubo() + 0.4, 558.2, 960, 600, "EL TUBITO DEL AIRE", 300, -220, YEL, 56),
    tag("hojas", at("si se tapa con hojas", 550), 558.2, 960, 600, "TAPADO CON HOJAS", -320, 200, COL.red, 52),
    o(me(558.3), tFil() - 0.05, (t) => <Libro key="lib30b" t={t} at={me(558.3) + 0.05} openAt={me(558.3) + 0.15} out={tFil() - 0.2} page={30} hl={{ at: me(558.3) + 0.6, x: 0.52, y: 0.13, w: 0.42, h: 0.4 }} />),
    tag("minut", at("un taller lo destapa", 560), tFil() - 0.1, 1500, 900, "EL TALLER: MINUTOS", 0, -1, GREEN, 48),
    tag("filtro", tFil() + 0.4, 576.3, 960, 540, "EL FILTRO DE CABINA", 300, -220, "#cfd6dc", 56, "DETRÁS DE LA GUANTERA"),
    big("doble", at("y el vidrio tarda el doble", 571), 576.3, "TAPADO = TARDA EL DOBLE", 900, 80, COL.red, "#3a0a06"),
    o(at("se cambia en", 572), 576.3, (t) => <MaxTimer key="5min" t={t} at={at("se cambia en", 572)} out={576.2} x={420} y={300} label="5'" sub="SE CAMBIA" col={GREEN} />),
    // --- ERROR 4 ---
    o(at("error numero cuatro", 575), me(576.4), (t) => <ErrorCard key="e4" t={t} at={at("error numero cuatro", 575)} out={me(576.4) - 0.1} n={4} of={4} tx="EL COMPRESOR CON MUCHO FRÍO" y={200} />),
    stamp("hon", at("esto es honesto", 578), 585.0, "HONESTO", 1450, 260, YEL, 90),
    tag("cero", at("cerca de cero grados", 587), 591.4, 960, 420, "CERCA DE 0 °C O MENOS", 300, -170, COL.ice, 56),
    big("cuid", at("es para cuidarlo", 589), 591.4, "ES PARA CUIDARLO", 880, 90, COL.ink, "#1c2a3a"),
    big("luzno", at("pero el compresor no trabaja", 593), me(591.5) - 0.1, "LUZ PRENDIDA · COMPRESOR QUIETO", 900, 66, "#ffb257", "#4a2000"),
    big("pac", at("pero con mas", 600), 609.1, "IGUAL, CON MÁS PACIENCIA", 170, 84, YEL, "#5a4500"),
    o(at("aire de afuera temperatura", 600), 609.1, (t) => <Rows key="frio" t={t} title="ESAS MAÑANAS" x={960} y={600} out={609.0} rows={[
      { at: at("aire de afuera temperatura", 600), ic: "🌬️", tx: "AIRE DE AFUERA" }, { at: at("temperatura alta", 600), ic: "🔥", tx: "TEMPERATURA ALTA" },
      { at: at("ventilador fuerte hacia", 600), ic: "🌀", tx: "VENTILADOR FUERTE AL VIDRIO" }, { at: at("y las ventanillas un", 600), ic: "🪟", tx: "VENTANILLAS UN DEDO" }]} />),
    tag("2min", at("dos minutos antes de llegar", 615), 626.2, 960, 500, "2 MIN ANTES DE LLEGAR", 300, -200, YEL, 56),
    tag("apa", at("aire acondicionado y deja solo", 620), 626.2, 960, 500, "A/C APAGADO · SÓLO VENTILADOR", -320, 220, COL.ice, 46),
    big("secaevap", at("asi se seca el evaporador", 622), 626.2, "SE SECA EL EVAPORADOR", 170, 84, GREEN, "#0a3a1a"),
    big("hong", at("cria hongos", 630), at("tambien esta en la pagina", 634) - 0.1, "HONGOS · OLOR A HUMEDAD", 300, 96, "#b6d36b", "#2a3a0a"),
    o(at("tambien esta en la pagina", 634), tAfu() + 0.3, (t) => <Libro key="lib30c" t={t} at={at("tambien esta en la pagina", 634)} openAt={at("tambien esta en la pagina", 634) + 0.2} out={tAfu() + 0.2} page={30} hl={{ at: at("tambien esta en la pagina", 634) + 0.6, x: 0.07, y: 0.13, w: 0.42, h: 0.4 }} />),
    // --- AFUERA · ATRÁS ---
    big("fuera", tAfu() + 0.5, 643.0, "A VECES ES AFUERA", 540, 120, "#ffb257", "#4a2000"),
    tag("cond", at("se condensa del lado", 650), at("ahi lo que haces", 655) - 0.1, 960, 380, "SE CONDENSA DEL LADO DE AFUERA", 300, -170, "#ffb257", 46),
    tag("mano", at("te das cuenta porque", 652), at("ahi lo que haces", 655) - 0.1, 960, 380, "POR DENTRO NO SALE NADA", -320, 220, COL.ink, 46),
    big("reves", at("ahi lo que haces", 655), 662.0, "AL REVÉS: 1 PASADA DE LIMPIAPARABRISAS", 900, 64, GREEN, "#0a3a1a"),
    tag("resis", at("que son resistencias", 670), 677.3, 960, 480, "RESISTENCIAS ELÉCTRICAS", 300, -200, "#ff9f43", 52),
    tag("btnr", at("con el boton del rectangulo", 673), 677.3, 960, 480, "EL BOTÓN DEL RECTÁNGULO", -320, 220, YEL, 48),
    big("ambos", at("prendes los dos", 680), tSen() - 0.1, "ADELANTE + ATRÁS", 400, 120, COL.ink, "#1c2a3a"),
    o(at("y en un minuto tienes", 686), tSen() - 0.1, (t) => <MaxTimer key="1min" t={t} at={at("y en un minuto tienes", 686)} out={tSen() - 0.2} x={960} y={720} label="1'" sub="TODOS LOS VIDRIOS" col={GREEN} />),
    // --- LA SEÑAL ---
    o(tSen(), 694.5, (t) => <StepPlate key="sen" t={t} at={tSen() + 0.1} out={694.4} n="LA SEÑAL" tx="ESTA ES SERIA" c1={["#ff7a6a", "#c0251a"]} ink="#fff" y={520} />),
    stamp("grasosa", at("pelicula grasosa", 696), me(694.6) - 0.1, "PELÍCULA GRASOSA", 1400, 860, "#ffd66b", 74),
    tag("velo", me(694.6) + 0.2, at("olor dulce dentro", 702) - 0.1, 960, 380, "UN VELO ACEITOSO", 300, -170, "#ffd66b", 54),
    tag("dulce", at("olor dulce dentro", 702), 712.1, 960, 380, "+ OLOR DULCE, A JARABE", -320, 220, "#ff9fd0", 52),
    big("refri", at("es el liquido refrigerante", 705), 712.1, "ES REFRIGERANTE DEL MOTOR", 900, 76, COL.red, "#3a0a06"),
    big("radc", at("debajo del tablero esta", 709), me(712.2) - 0.1, "EL RADIADORCITO DE LA CALEFACCIÓN", 200, 64, "#ff9f43", "#4a2000", undefined, 1100),
    big("ningun", at("no lo arregla ningun", 718), tDep() - 0.1, "NINGÚN BOTÓN LO ARREGLA", 540, 110, COL.red, "#3a0a06"),
    tag("frio2", at("con el motor frio", 722), 727.0, 960, 520, "CON EL MOTOR FRÍO", 300, -220, COL.ice, 54),
    tag("baja", at("si baja", 724), 727.0, 960, 520, "SI BAJA Y NO GOTEA…", -320, 200, COL.red, 52),
    stamp("semana", at("va al taller esta semana", 731), me(727.1) + 0.6, "AL TALLER · ESTA SEMANA", 1250, 860, COL.red, 74),
    big("caro", at("si el motor se queda", 736), tPag32() - 0.1, "SIN REFRIGERANTE: MOTOR CALIENTE = CARO", 900, 60, COL.red, "#3a0a06"),
    o(tPag32(), 746.2, (t) => <Libro key="lib32" t={t} at={tPag32() + 0.05} openAt={tPag32() + 0.2} out={746.1} page={32} hl={{ at: at("olor dulce", 744) - 0.2, x: 0.07, y: 0.13, w: 0.86, h: 0.4 }} />),
    // --- EL REPASO ---
    o(at("te repaso", 750), at("ahora dime tu", 780) - 0.3, (t) => inAv(t) ? null : <Recap key="rcp" t={t} out={at("ahora dime tu", 780) - 0.4} title="EL REPASO DE CLAUDIO" rows={[
      { at: at("aire acondicionado prendido", 752), tx: "A/C PRENDIDO, AUNQUE HAGA FRÍO" }, { at: at("recirculacion apagada temperatura", 755), tx: "RECIRCULACIÓN APAGADA" },
      { at: at("temperatura caliente", 758), tx: "CALOR + VENTILADOR ALTO" }, { at: at("aire hacia el parabrisas", 764), tx: "AIRE AL PARABRISAS" },
      { at: at("las ventanillas un dedo abiertas el", 765), tx: "VENTANILLAS UN DEDO, 30 S" }, { at: at("nunca el trapo", 770), tx: "EL TRAPO O LA MANO", no: true },
      { at: at("vidrio limpio por dentro", 772), tx: "VIDRIO LIMPIO, 1 VEZ POR MES" }, { at: at("escondida en las alfombras", 775), tx: "SIN AGUA EN LAS ALFOMBRAS" },
      { at: at("el aire apagado dos", 778), tx: "A/C OFF 2 MIN ANTES DE LLEGAR" }, { at: at("con olor dulce al taller", 782), tx: "GRASOSO + DULCE = TALLER" }]} />),
    o(tCom(), 796.2, (t) => <Comment key="cmt" t={t} at={tCom() + 0.1} typeAt={at("cuentamelo en los", 792) - 0.4} out={796.1} text="Esperaba 10 minutos 🥶 · desde Chile" x={960} y={560} />),
    big("pais", at("dime de que pais", 796), me(796.3) - 0.1, "¿DESDE QUÉ PAÍS?", 200, 90, YEL, "#5a4500", undefined, 1400),
    o(me(796.3), 812.4, (t) => <NextCard key="next" t={t} at={me(796.3) + 0.05} out={812.3} img="img_c_bateria.jpg" title="EL CABLE DE LA BATERÍA: ¿REINICIA LA COMPUTADORA?" x={1180} y={520} />),
    big("prox", me(796.3) + 0.1, 812.3, "OTRO CAPÍTULO DEL AUTO DE ELENA", 140, 60, "#ffd08a", "#4a2a00", undefined, 760),
    big("verd", at("que es verdad", 813), me(812.5) - 0.1, "VERDAD · MENTIRA", 200, 90, YEL, "#5a4500", undefined, 1400),
    stamp("caro2", at("hay una que te puede", 818), tCuarto() - 0.1, "UNA TE PUEDE COSTAR CARO", 960, 540, COL.red, 84),
    o(tCuarto(), 830.6, (t) => <MaxTimer key="715" t={t} at={tCuarto() + 0.1} out={830.5} x={620} y={420} label="7:15" sub="NI UN MINUTO MÁS" col={GREEN} />),
    big("mec", at("la hizo sentir mecanica", 827), 830.6, "“ME SENTÍ MECÁNICA”", 820, 100, "#ffd08a", "#4a2a00"),
    big("boton", at("a veces solo hay que", 835), END, "A VECES SÓLO HAY QUE SABER QUÉ BOTÓN APRETAR", 160, 54, COL.ink, "#1c2a3a"),
  ];
  function t3() { return at("3 la temperatura", 300); }
  function t4() { return at("4 el ventilador", 300); }
  function tCam() { return at("solo un ratito si pasas", 375); }
  function tErr() { return at("ahora los errores", 380); }
  function tNoPas() { return at("si estas parado", 410); }
  function tTab() { return at("el plastico del tablero", 430); }
  function tKit() { return at("se limpia con limpia", 445); }
  function tGris() { return at("dona elena tenia el vidrio", 460); }
  function tMes() { return at("lo habia limpiado", 476); }
  function tAcomp() { return at("es la del acompanante", 540); }
  function tTubo() { return at("y no se volco nada", 545); }
  function tFil() { return at("y otra cosa el filtro", 560); }
  function tAfu() { return at("hay una vez en que", 635); }
  function tSen() { return at("y ahora la senal", 685); }
  function tDep() { return at("mira el nivel del deposito", 715); }
  function tPag32() { return at("esta en el manual en la pagina 32", 735); }
  function tCom() { return at("ahora dime tu", 780); }
  function tCuarto() { return at("dona elena ahora sale", 815); }
  function tSeca() { return at("el aire acondicionado no solo", 215) + 1.2; }
};

let SEGS: Seg[] | null = null, OVS: Ov[] | null = null;

export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  SEGS = SEGS ?? buildSegs(); OVS = OVS ?? buildOvs();
  let i = 0;
  for (let j = 0; j < SEGS.length; j++) if (SEGS[j].a <= t) i = j;
  const cur = SEGS[i], prev = SEGS[i - 1];
  const base = prev && t < cur.a + D && cur.tr !== "cut" ? <Trans t={t} s={cur} from={prev.base(t)} to={cur.base(t)} /> : cur.base(t);
  const ovs = OVS.filter((x) => t >= x.a - 0.25 && t < x.b + 0.6).map((x, k) => <React.Fragment key={k + "_" + x.a}>{x.n(t)}</React.Fragment>);
  const fade = 0.75 * e(t, FULL_END - 0.6, FULL_END - 0.05); // tope 75 %: a negro pleno el blackframe lo cuenta como cuadro negro
  return (
    <AbsoluteFill style={{ background: "#0b0e13" }}>
      {base}
      {ovs}
      {fade > 0 && <AbsoluteFill style={{ background: "#000", opacity: fade }} />}
    </AbsoluteFill>
  );
};
void FONT; void extrude; void AvBadge;
