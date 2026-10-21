// clllaves · EL RESTO (100,8-912 s). Mismo hilo que el minuto 1: el baño-maqueta 3D con UNA cámara que nunca corta
// (baja por el caño, entra a la costra, explota el aireador, recorre el muestrario, la guía en la pág. 28 y la 18),
// el avatar en cada ventana del reel, tomas reales (LTX o cuadro clave) con empuje propio, y una pieza 2D NUEVA por idea
// (rest2d.tsx). Todo anclado a la voz con at("frase") sobre words.json. Las uniones: portal / barrido / iris / zoom,
// sin desenfoque sobre el mundo 3D (cuelga Chrome en el farm). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, pagePt, MUES, MUES_X } from "./bano3d";
import { Avatar, World, Shot, Stamp, Desc, WIN } from "./Min1";
import { BigNum, COL, Flash, FONT, Portal, Tag, e, ei, extrude } from "./lib";
import WORDS from "./words.json";
import {
  CafeCup, Elements, TankScale, Familia, WeekCounter, AerDots, Diagnose, LayerCut, MaxTimer, KitTray, StepPlate, Rooms, HourClock,
  TurnLeft, Hardness, Recipe, PriceCompare, ErrorCard, HairVsChrome, ClorTarget, GasWarn, NextDay, NightVsHour, OneInTen, VideoCard,
  Routine, TwoMinVsSat, Recap, Comment, AvBadge,
} from "./rest2d";

export const REST_START = 100.8;
export const FULL_END = 912.0;

// ---------- at("frase", desde): segundo en que arranca la frase en la voz ----------
const WD = WORDS as [number, string][];
const norm = (x: string) => Array.from(x.toLowerCase()).map((ch) => (/[a-z0-9 ]/.test(ch) ? ch : ch.charCodeAt(0) > 127 ? "a" : " ")).join("");
const cache = new Map<string, number>();
export const at = (frase: string, desde = 100): number => {
  const key = frase + "@" + desde;
  const hit = cache.get(key); if (hit !== undefined) return hit;
  const q = norm(frase).split(/\s+/).filter(Boolean);
  for (let i = 0; i < WD.length; i++) {
    if (WD[i][0] < desde) continue;
    let ok = true;
    for (let j = 0; j < q.length; j++) if (!WD[i + j] || WD[i + j][1] !== q[j]) { ok = false; break; }
    if (ok) { cache.set(key, WD[i][0]); return WD[i][0]; }
  }
  throw new Error(`at(): no está la frase "${frase}" desde ${desde}`);
};

// ---------- bases ----------
type Base = (t: number) => React.ReactNode;
const W: Base = (t) => <World t={t} />;
const AV = (ms: number, me: number): Base => (t) => <Avatar t={Math.min(Math.max(t, ms), me - 0.03)} />;
const S = (k: string, a: number, z: [number, number] = [1.03, 1.12], ox = 0, oy = 0): Base => (t) => <Shot k={k} t={t} a={a} z={z} ox={ox} oy={oy} dur={7} />;
// fondo de las piezas 2D: el mismo mundo, con la cámara casi quieta y oscurecido (sin blur)
const BK = (tf: number, drift = 0.12): Base => (t) => (
  <AbsoluteFill>
    <WorldRaw t={tf + Math.max(0, t - tf) * drift} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(8,12,20,.55), rgba(4,6,10,.9) 75%)" }} />
  </AbsoluteFill>
);

type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
type Seg = { a: number; base: Base; tr?: Tr; world?: boolean; px?: number; py?: number };
const D = 0.36;

const Trans: React.FC<{ t: number; s: Seg; from: React.ReactNode; to: React.ReactNode; fromWorld: boolean }> = ({ t, s, from, to, fromWorld }) => {
  const k = ei(t, s.a, s.a + D), tr = s.tr ?? "fade";
  const noBlur = fromWorld || !!s.world;
  const mb = noBlur ? 0 : 0; // sin desenfoque en ninguna transición: el avatar va nítido (orden del creador 21-oct)
  const L = (n: React.ReactNode, st: React.CSSProperties, key: string) => <AbsoluteFill key={key} style={{ ...st, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{n}</AbsoluteFill>;
  if (tr === "swipeL" || tr === "swipeR" || tr === "up" || tr === "down") {
    const dir = tr === "swipeL" || tr === "up" ? 1 : -1, ax = tr === "up" || tr === "down" ? "Y" : "X", DD = ax === "Y" ? 1080 : 1920;
    return <AbsoluteFill>{L(from, { transform: `translate${ax}(${-dir * k * DD}px)` }, "f")}{L(to, { transform: `translate${ax}(${dir * (1 - k) * DD}px)` }, "t")}</AbsoluteFill>;
  }
  if (tr === "portal") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><Portal x={s.px ?? 960} y={s.py ?? 540} r={k}>{to}</Portal></AbsoluteFill>;
  if (tr === "iris") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `circle(${k * 1150}px at ${s.px ?? 960}px ${s.py ?? 540}px)` }}>{to}</AbsoluteFill><Flash t={t} at={s.a + 0.02} col="#fff1cf" peak={0.35} w={0.3} /></AbsoluteFill>;
  if (tr === "wipe") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `inset(0 0 ${(1 - k) * 100}% 0)` }}>{to}</AbsoluteFill></AbsoluteFill>;
  if (tr === "zoom") return <AbsoluteFill><AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * k})` }}>{to}</AbsoluteFill><AbsoluteFill style={{ opacity: 1 - k, transform: `scale(${1 + k * 0.35})` }}>{from}</AbsoluteFill></AbsoluteFill>;
  return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ opacity: k }}>{to}</AbsoluteFill></AbsoluteFill>;
};

// ventanas del avatar (del reel) por arranque
const av = (ms: number) => { const w = WIN.find((x) => Math.abs(x.ms - ms) < 0.15); if (!w) throw new Error("sin ventana de avatar en " + ms); return AV(w.ms, w.me); };
const A_ = (ms: number) => WIN.find((x) => Math.abs(x.ms - ms) < 0.15)!.ms;

const buildSegs = (): Seg[] => {
  const g = (a: number, base: Base, tr?: Tr, extra: Partial<Seg> = {}): Seg => ({ a, base, tr, ...extra });
  const w = (a: number, tr?: Tr, extra: Partial<Seg> = {}): Seg => ({ a, base: W, tr, world: true, ...extra });
  const shot1 = at("y mire de cerca", 210);
  return [
    w(REST_START, "cut"),
    g(A_(103.7), av(103.7), "swipeL"),
    w(107.9, "portal", { px: 960, py: 600 }),
    g(114.6, BK(114.6), "fade"),
    g(117.6, S("x_vaso_luz", 117.6, [1.0, 1.1]), "up"),
    g(A_(120.9), av(120.9), "swipeR"),
    w(126.4, "zoom"),
    g(132.5, BK(132.5), "fade"),
    g(A_(138.3), av(138.3), "swipeL"),
    w(143.4, "iris"),
    g(152.5, S("o_gota", 152.5, [1.12, 1.02]), "portal", { px: screenOf(152.4, PT.joint).x, py: screenOf(152.4, PT.joint).y }),
    g(A_(157.4), av(157.4), "down"),
    w(161.8, "zoom"),
    g(A_(173.7), av(173.7), "swipeL"),
    w(179.4, "portal", { px: 960, py: 520 }),
    g(A_(188.6), av(188.6), "swipeR"),
    w(193.2, "wipe"),
    g(199.0, S("o_aireador", 199.0, [1.1, 1.0]), "portal", { px: screenOf(198.9, PT.aer).x, py: screenOf(198.9, PT.aer).y }),
    g(A_(206.4), av(206.4), "swipeL"),
    g(211.1, S("x_gotero", 211.1, [1.03, 1.14]), "up"),
    g(shot1, S("p_gota", shot1, [1.14, 1.03]), "zoom"),
    g(A_(221.1), av(221.1), "swipeR"),
    w(226.5, "iris"),
    g(232.0, S("p_jabon", 232.0, [1.02, 1.1], 30), "swipeL"),
    g(A_(238.0), av(238.0), "down"),
    g(242.1, S("p_verde", 242.1, [1.02, 1.16], -20, 10), "portal"),
    g(A_(254.1), av(254.1), "swipeR"),
    g(259.1, BK(259.1, 0.4), "fade"),
    w(264.2, "fade"),
    g(A_(268.9), av(268.9), "swipeL"),
    w(274.6, "portal", { px: 960, py: 560 }),
    g(281.5, S("a_acabados", 281.5, [1.04, 1.13]), "swipeL"),
    g(A_(288.0), av(288.0), "up"),
    g(291.7, BK(291.7), "fade"),
    g(at("y si el lavamanos", 295), S("a_marmol", at("y si el lavamanos", 295), [1.12, 1.02]), "swipeR"),
    g(A_(303.5), av(303.5), "zoom"),
    w(309.2, "iris"),
    g(313.5, BK(313.5, 0.3), "fade"),
    g(A_(319.5), av(319.5), "swipeL"),
    g(324.0, BK(324.0, 0.3), "swipeR"),
    w(330.5, "fade"),
    g(A_(337.0), av(337.0), "swipeL"),
    g(342.0, S("x_libreta", 342.0, [1.02, 1.12]), "up"),
    g(347.0, S("s1_bolsa", 347.0, [1.1, 1.02]), "swipeL"),
    g(A_(353.6), av(353.6), "swipeR"),
    g(358.3, S("s1_cuelga", 358.3, [1.03, 1.12]), "portal", { px: 960, py: 420 }),
    w(362.5, "zoom"),
    g(367.1, S("x_reloj", 367.1, [1.03, 1.1]), "swipeL"),
    g(A_(370.7), av(370.7), "down"),
    g(375.2, S("s1_arenilla", 375.2, [1.12, 1.02]), "zoom"),
    g(380.0, S("s1_cepillo", 380.0, [1.02, 1.1], -30), "swipeL"),
    w(384.0, "iris", { px: 960, py: 600 }),
    g(A_(387.4), av(387.4), "swipeR"),
    g(392.9, S("x_desenrosca", 392.9, [1.03, 1.12]), "up"),
    g(397.5, S("s1_vaso", 397.5, [1.12, 1.03]), "swipeL"),
    g(A_(403.8), av(403.8), "zoom"),
    g(408.1, S("e_goma", 408.1, [1.03, 1.12]), "portal", { px: 960, py: 600 }),
    w(413.0, "fade"),
    g(A_(421.3), av(421.3), "swipeL"),
    g(426.6, S("s2_venda", 426.6, [1.02, 1.12]), "up"),
    w(432.0, "zoom"),
    g(436.0, S("x_film", 436.0, [1.1, 1.02]), "swipeR"),
    g(A_(439.6), av(439.6), "swipeL"),
    w(445.2, "portal", { px: 960, py: 560 }),
    g(450.0, S("s2_cepillo", 450.0, [1.03, 1.13], 20), "swipeL"),
    g(A_(454.8), av(454.8), "down"),
    g(459.4, S("s2_palillo", 459.4, [1.12, 1.02]), "zoom"),
    w(465.0, "iris"),
    g(A_(470.6), av(470.6), "swipeR"),
    g(475.7, S("s2_secar", 475.7, [1.02, 1.12]), "up"),
    w(481.0, "wipe"),
    g(A_(486.8), av(486.8), "swipeL"),
    w(492.1, "zoom"),
    g(498.0, S("z_antes", 498.0, [1.12, 1.02]), "portal", { px: screenOf(497.9, PT.joint).x, py: screenOf(497.9, PT.joint).y }),
    g(A_(504.4), av(504.4), "swipeR"),
    g(508.7, S("s3_citrico", 508.7, [1.03, 1.12], -40), "swipeL"),
    g(A_(520.0), av(520.0), "up"),
    g(525.2, BK(525.2), "fade"),
    w(531.0, "iris"),
    g(553.3, BK(553.3, 0.2), "fade"),
    g(569.5, BK(569.5, 0.2), "fade"),
    g(574.1, S("x_fibra", 574.1, [1.03, 1.14]), "swipeR"),
    g(A_(584.4), av(584.4), "down"),
    g(588.3, BK(588.3), "fade"),
    w(594.0, "portal", { px: 960, py: 560 }),
    g(A_(600.4), av(600.4), "swipeL"),
    g(605.5, BK(605.5), "zoom"),
    g(A_(616.6), av(616.6), "swipeR"),
    g(620.6, BK(620.6), "fade"),
    w(626.5, "iris"),
    g(A_(632.8), av(632.8), "swipeL"),
    g(636.9, S("x_separa", 636.9, [1.03, 1.13]), "up"),
    g(A_(649.9), av(649.9), "zoom"),
    g(655.8, S("e_ventana", 655.8, [1.12, 1.02]), "swipeL"),
    g(661.0, BK(661.0), "fade"),
    g(A_(667.0), av(667.0), "swipeR"),
    g(672.6, BK(672.6), "fade"),
    g(678.0, S("e_ampollas", 678.0, [1.03, 1.14]), "portal"),
    g(A_(686.2), av(686.2), "swipeL"),
    g(691.2, BK(691.2), "fade"),
    w(697.0, "zoom"),
    g(A_(702.9), av(702.9), "swipeR"),
    g(709.1, S("x_trapo", 709.1, [1.02, 1.1]), "up"),
    g(713.5, S("e_corroida", 713.5, [1.12, 1.02]), "swipeL"),
    g(A_(719.5), av(719.5), "down"),
    w(724.7, "iris"),
    g(731.0, BK(731.0), "fade"),
    g(A_(737.7), av(737.7), "swipeL"),
    g(742.4, S("x_ducha", 742.4, [1.03, 1.12]), "swipeR"),
    g(748.0, S("d_ducha", 748.0, [1.12, 1.02]), "up"),
    g(A_(753.0), av(753.0), "swipeL"),
    g(757.5, BK(757.5), "fade"),
    w(763.0, "iris"),
    g(A_(769.7), av(769.7), "swipeR"),
    w(774.6, "zoom"),
    g(780.0, S("r_rosa", 780.0, [1.03, 1.13]), "swipeL"),
    g(A_(787.7), av(787.7), "up"),
    g(792.8, S("r_rociar", 792.8, [1.12, 1.02]), "swipeR"),
    g(798.0, BK(798.0), "fade"),
    g(A_(803.1), av(803.1), "swipeL"),
    g(808.4, S("r_cera", 808.4, [1.03, 1.12]), "portal"),
    w(815.0, "zoom"),
    g(A_(821.6), av(821.6), "swipeR"),
    w(826.8, "iris"),
    g(831.0, S("z_chorro", 831.0, [1.1, 1.02]), "portal", { px: screenOf(830.9, PT.aer).x, py: screenOf(830.9, PT.aer).y }),
    w(834.7, "zoom"),
    g(A_(839.0), av(839.0), "swipeL"),
    w(845.0, "swipeR"),
    g(A_(854.8), av(854.8), "swipeL"),
    w(860.0, "swipeR"),
    g(A_(872.3), av(872.3), "zoom"),
    g(878.6, S("x_sarro_mano", 878.6, [1.03, 1.12]), "swipeL"),
    g(A_(889.6), av(889.6), "swipeR"),
    w(895.2, "iris"),
    g(A_(908.3), av(908.3), "zoom"),
  ];
};

// ---------- piezas encima (cada una maneja su entrada/salida) ----------
type Ov = { a: number; b: number; n: (t: number) => React.ReactNode };

const buildOvs = (): Ov[] => {
  const o = (a: number, b: number, n: (t: number) => React.ReactNode): Ov => ({ a, b, n });
  const J = (t: number) => screenOf(t, PT.joint), AE = (t: number) => screenOf(t, PT.aer), JT = (t: number) => screenOf(t, PT.jet);
  const MF = (i: number) => [MUES[0] + MUES_X[i], 1.04, MUES[2] - 0.05] as [number, number, number];
  const ETCH = [MUES[0] + 0.23, 0.877, MUES[2] + 0.22] as [number, number, number];
  const big = (key: string, a: number, out: number, text: string, y = 200, size = 110, col: string = COL.ink, edge = "#5a4a36", sub?: string) =>
    o(a, out, (t) => <BigNum key={key} t={t} at={a} text={text} y={y} size={size} col={col} edge={edge} out={out} sub={sub} />);
  const tag = (key: string, a: number, out: number, pt: (t: number) => { x: number; y: number }, text: string, dx = 260, dy = -160, col: string = COL.ink, size = 48, sub?: string) =>
    o(a, out, (t) => { const p = pt(t), wd = 0.68 * size * Math.max(text.length, (sub ?? "").length * 0.6); const R = 1880 - p.x - 14 - wd, Lf = p.x - 14 - wd - 40, ad = Math.abs(dx); let ddx = dx; if (dx >= 0 && R < dx) ddx = R >= 60 ? R : Lf >= 60 ? -Math.min(ad, Lf) : R; if (dx < 0 && Lf < ad) ddx = Lf >= 60 ? -Lf : R >= 60 ? Math.min(ad, R) : -Lf; return <Tag key={key} t={t} at={a} x={p.x} y={p.y} dx={ddx} dy={dy} text={text} sub={sub} col={col} out={out} size={size} />; });
  const fix = (x: number, y: number) => () => ({ x, y });
  const stamp = (key: string, a: number, out: number, text: string, x = 960, y = 240, col: string = COL.red, size = 110, rot = -8) =>
    o(a, out, (t) => <Stamp key={key} t={t} at={a} text={text} x={x} y={y} out={out} col={col} size={size} rot={rot} />);
  const GREEN = "#7dff9e";
  return [
    // --- de dónde viene la piedra ---
    big("3sem", at("en tres semanas"), 103.6, "EN 3 SEMANAS, DE VUELTA", 170, 84, COL.amber, "#4a2a00"),
    tag("cal", at("roca caliza"), 114.4, (t) => screenOf(t, PT.lime), "ROCA CALIZA", 280, -80, "#f3ecd8", 50),
    tag("dis", at("se le va disolviendo"), 114.4, (t) => screenOf(t, PT.water), "SE DISUELVE ADENTRO", 280, 120, COL.ice, 46),
    o(114.6, 117.6, (t) => <CafeCup key="cafe" t={t} at={114.7} out={117.4} x={960} y={540} />),
    tag("trans", at("sale transparente"), 120.7, fix(960, 470), "TRANSPARENTE… CON PIEDRA ADENTRO", -300, -230, COL.ice, 46),
    o(120.9, 126.4, (t) => <Elements key="el" t={t} out={126.2} x={1180} y={600} items={[{ at: at("calcio"), sym: "Ca", n: 20, name: "CALCIO", col: "#f4efe2" }, { at: at("magnesio"), sym: "Mg", n: 12, name: "MAGNESIO", col: "#e3eef2" }]} />),
    o(126.4, 132.6, (t) => <TankScale key="tank" t={t} at={at("por cada mil litros")} gAt={at("200 gramos")} out={132.4} x={1360} y={560} />),
    o(132.5, 138.4, (t) => <Familia key="fam" t={t} at={132.6} out={138.2} x={960} y={540} />),
    big("pun", at("un puaado de piedra"), 143.3, "UN PUÑADO DE PIEDRA AL MES", 880, 86, "#f3ecd8", "#5a4a36"),
    tag("desa", at("se va por el desagae"), 147.4, JT, "SE VA POR EL DESAGÜE ✓", 280, 140, COL.ice, 44),
    tag("gota", at("la gota que queda"), 152.4, J, "LA GOTA QUE QUEDA", -320, -170, COL.amber, 54),
    tag("seca", at("esa gota se seca"), 157.3, fix(960, 560), "SE SECA", 260, -200, COL.ink, 56),
    big("evap", at("el agua se evapora"), 161.7, "EL AGUA SE VA · LA PIEDRA SE QUEDA", 880, 74, "#f3ecd8", "#5a4a36"),
    o(161.8, 173.6, (t) => <WeekCounter key="wk" t={t} at={162.0} out={173.4} per={1.05} max={6} x={1500} y={180} />),
    tag("capas", at("veraa capas"), 173.5, J, "CAPAS, UNA SOBRE OTRA", -320, -200, "#f3ecd8", 50),
    big("raya", at("cada raya es una semana"), 179.3, "1 RAYA = 1 SEMANA", 880, 110, "#f3ecd8", "#5a4a36"),
    tag("aer", at("se llama aireador"), 188.4, AE, "EL AIREADOR", 280, -160, COL.amber, 56),
    tag("mez", at("mezcla aire con el agua"), 188.4, AE, "AIRE + AGUA = CHORRO SUAVE", -340, 170, COL.ice, 42),
    o(188.6, 193.2, (t) => <AerDots key="dots" t={t} at={188.8} out={193.0} x={1460} y={500} dur={3.4} />),
    tag("tor", at("sale torcido"), 199.0, JT, "TORCIDO", 260, 120, COL.amber, 54),
    tag("dos", at("en dos chorritos"), 199.0, JT, "EN DOS", -280, 160, COL.amber, 50),
    tag("salp", at("salpica para todos"), 199.0, JT, "SALPICA", 280, -140, COL.ice, 50),
    stamp("tap", at("tapada con piedra"), 206.2, "TAPADA CON PIEDRA", 960, 220, COL.red, 96),
    // --- la prueba de la gota ---
    big("prueba", at("haga esta prueba"), 211.0, "LA PRUEBA · 2 MINUTOS", 170, 84, "#ffd60a", "#5a4500"),
    big("noblan", at("no todo lo blanco"), 211.0, "NO TODO LO BLANCO ES SARRO", 900, 72, COL.ink),
    tag("una", at("una sola gota"), at("y mire de cerca", 210) - 0.05, fix(980, 520), "UNA SOLA GOTA", 280, -200, "#ffd60a", 54),
    tag("burb", at("burbujitas finas"), 221.0, fix(960, 560), "BURBUJITAS = SARRO", 280, -200, GREEN, 54),
    big("sarro", at("eso es sarro"), 226.4, "SARRO ✓", 880, 130, GREEN, "#0a3a1a"),
    tag("gas", at("suelta gas"), 232.0, J, "SUELTA GAS", -300, -180, COL.ice, 52),
    tag("jab", at("jaban con grasa"), 237.9, fix(900, 560), "JABÓN + GRASA", -280, -200, "#f3ecd8", 52),
    o(at("agua bien caliente"), 241.9, (t) => <KitTray key="jk" t={t} out={241.8} y={880} items={[{ at: at("agua bien caliente"), ic: "♨️", tx: "AGUA BIEN CALIENTE" }, { at: at("detergente de platos"), ic: "🧴", tx: "1 GOTA DE DETERGENTE" }]} />),
    tag("bron", at("verde o azulado"), 254.0, fix(940, 600), "VERDE = EL BRONCE DE ADENTRO", 260, -240, "#7fe0b0", 46),
    big("oxi", at("naranja o marran"), 259.0, "NARANJA = ÓXIDO", 900, 90, "#ff9f43", "#4a2000"),
    o(259.1, 264.4, (t) => <Diagnose key="dg" t={t} out={264.2} pick={0} pickAt={at("hoy vamos con lo blanco")} items={[
      { at: 259.25, sw: "radial-gradient(circle,#fbf8ef,#ddd2b4)", tx: "BURBUJEA", res: "SARRO", ok: true },
      { at: 259.45, sw: "radial-gradient(circle,#f3efe6,#cfc6b0 70%)", tx: "BLANDA, JABONOSA", res: "JABÓN", ok: false },
      { at: 259.65, sw: "radial-gradient(circle,#4fae8a,#2b6b55 70%)", tx: "VERDE O AZULADO", res: "BRONCE", ok: false },
      { at: 259.85, sw: "radial-gradient(circle,#d9822b,#7a3a12 70%)", tx: "NARANJA O MARRÓN", res: "ÓXIDO", ok: false }]} />),
    // --- los acabados ---
    big("arru", at("lo que mas llaves arruina"), 274.5, "LO QUE MÁS LLAVES ARRUINA", 880, 80, COL.red, "#3a0a06"),
    tag("cro", 274.7, 281.4, (t) => screenOf(t, MF(0)), "CROMO ✓", -200, -190, GREEN, 50),
    tag("dor", at("es dorada"), 281.4, (t) => screenOf(t, MF(1)), "DORADO ⚠", -120, -260, "#ffd66b", 46),
    tag("neg", at("negra mate"), 281.4, (t) => screenOf(t, MF(2)), "NEGRO MATE ⚠", 120, -260, "#ffd66b", 46),
    tag("cep", at("como cepillada"), 281.4, (t) => screenOf(t, MF(3)), "CEPILLADO ⚠", 200, -190, "#ffd66b", 46),
    o(281.5, 288.0, (t) => <LayerCut key="lc" t={t} at={at("una capa", 282)} eatAt={at("se la puede comer")} out={287.8} x={960} y={880} />),
    big("atras", at("la parte de atras"), 297.4, "PRUEBE ATRÁS PRIMERO", 180, 84, "#ffd60a", "#5a4500"),
    o(291.7, 297.7, (t) => <MaxTimer key="m5" t={t} at={at("mas de 5 minutos")} out={297.5} x={960} y={540} label="5" sub="MÁX. 5 MIN" />),
    stamp("nunca", at("no toca el marmol nunca"), 303.4, "NUNCA", 1400, 260, COL.red, 140),
    big("marm", at("tambian es piedra"), 309.1, "MÁRMOL = PIEDRA CALIZA", 880, 90, "#f3ecd8", "#5a4a36"),
    tag("etch", at("mancha opaca"), 313.4, (t) => screenOf(t, ETCH), "MANCHA OPACA PARA SIEMPRE", 260, -180, COL.red, 46),
    // --- el kit ---
    o(313.5, 330.6, (t) => <KitTray key="kit" t={t} out={330.4} y={t < 319.5 || t >= 324 ? 430 : 800} items={[
      { at: at("vinagre blanco del"), ic: "🍶", tx: "VINAGRE BLANCO" }, { at: at("una bolsita de plastico"), ic: "🛍️", tx: "BOLSITA" }, { at: at("una liga de goma"), ic: "⭕", tx: "LIGA" },
      { at: at("toallas de papel"), ic: "🧻", tx: "TOALLAS DE PAPEL" }, { at: at("un cepillo de dientes viejo"), ic: "🪥", tx: "CEPILLO VIEJO" }, { at: at("un palillo de dientes"), ic: "🥢", tx: "PALILLO DE MADERA" },
      { at: at("paao de microfibra seco nada"), ic: "🧽", tx: "PAÑO DE MICROFIBRA" }, { at: at("nada de fibra verde"), ic: "🟩", tx: "FIBRA VERDE", no: true }, { at: at("esponja de alambre"), ic: "🪮", tx: "ALAMBRE", no: true }]} />),
    // --- paso 1 ---
    o(330.5, 337.0, (t) => <StepPlate key="p1" t={t} at={at("paso 1")} out={336.8} n="PASO 1" tx="LA BOQUITA" />),
    tag("aer1", at("el aireador", 336), 336.9, AE, "EL AIREADOR", 280, 150, COL.amber, 50),
    o(337.0, 342.0, (t) => <Rooms key="rooms" t={t} at={at("120 cuartos")} out={341.8} x={1440} y={520} />),
    tag("mit", at("la mitad con vinagre"), 353.5, fix(960, 520), "MITAD · VINAGRE TIBIO", 260, -220, "#ffd60a", 50),
    big("liga", at("con la liga"), 358.2, "AMARRADA CON LA LIGA", 900, 80, COL.ink),
    tag("feria", at("bolsita de agua de la feria"), 362.4, fix(960, 480), "COMO BOLSITA DE FERIA", 280, -180, COL.ice, 48),
    o(362.5, 367.1, (t) => <HourClock key="h1" t={t} at={at("y la deja una hora")} out={366.9} x={1380} y={540} />),
    tag("saq", at("saque la bolsita"), 370.6, fix(960, 560), "CON CUIDADO, SOBRE EL LAVAMANOS", -300, -220, COL.ink, 42),
    big("cal1", at("agua caliente un minuto"), 375.1, "AGUA CALIENTE · 1 MINUTO", 880, 84, COL.amber, "#4a2a00"),
    tag("are", at("como aremilla"), 379.9, fix(960, 600), "ESA ARENILLA ES LA PIEDRA", 260, -240, "#f3ecd8", 48),
    tag("circ", at("en carculos"), 383.9, fix(980, 520), "EN CÍRCULOS", 280, -180, COL.ink, 50),
    tag("der", at("salir derecho"), 387.3, JT, "DERECHO ✓", 260, 120, GREEN, 60),
    big("pdia", at("como el primer daa"), 392.8, "COMO EL PRIMER DÍA", 880, 96, GREEN, "#0a3a1a"),
    tag("trap", at("envualvalo con un trapo"), 397.4, fix(960, 520), "CON UN TRAPO, PARA NO MARCARLO", -320, -220, COL.ink, 42),
    o(392.9, 397.5, (t) => <TurnLeft key="tl" t={t} at={at("hacia la izquierda")} out={397.3} x={1420} y={440} />),
    o(397.5, 403.8, (t) => <MaxTimer key="m30" t={t} at={at("media hora")} out={403.6} x={1460} y={300} label="30" sub="MIN" col="#7dc4f5" />),
    tag("vburb", at("ve salir las burbujas"), 403.7, fix(900, 560), "BURBUJAS EN TODOS LOS AGUJERITOS", -300, 200, COL.ice, 42),
    big("gom", at("ojo con la gomita"), 408.0, "OJO CON LA GOMITA", 880, 92, "#ffd60a", "#5a4500"),
    tag("gom2", at("pangala igual"), 412.9, fix(960, 540), "IGUAL QUE ESTABA", 280, -200, COL.ink, 50),
    // --- paso 2 ---
    o(413.0, 421.3, (t) => <StepPlate key="p2" t={t} at={at("paso 2")} out={421.1} n="PASO 2" tx="LA BASE" />),
    tag("gru", at("la costra gruesa"), 421.2, J, "LA COSTRA GRUESA", -320, -150, "#f3ecd8", 52),
    big("emp", at("moje toallas de papel"), 426.5, "TOALLAS EMPAPADAS EN VINAGRE", 880, 76, COL.ink),
    tag("venda", at("como una venda"), 431.9, fix(960, 560), "COMO UNA VENDA", 280, -200, COL.ink, 52),
    tag("film", at("plastico de cocina"), 435.9, J, "+ PLÁSTICO DE COCINA", 300, -170, COL.ice, 46),
    big("nosec", at("no se seque"), 439.5, "PARA QUE NO SE SEQUE", 880, 84, COL.ice, "#0a2a40"),
    o(439.6, 445.2, (t) => <MaxTimer key="m3060" t={t} at={at("entre 30 minutos")} out={445.0} x={1480} y={300} label="30-60" sub="MIN" col="#ffb257" />),
    tag("tiza", at("tiza mojada"), 449.9, J, "BLANDA COMO TIZA MOJADA", -320, -170, "#f3ecd8", 48),
    tag("junta", at("en la junta"), 454.7, fix(960, 560), "LA JUNTA METAL-LOZA", 280, -200, COL.amber, 46),
    o(459.4, 465.0, (t) => <Hardness key="hd" t={t} at={at("la madera es mas blanda")} out={464.8} y={560} />),
    tag("lin", at("una lanea blanca"), 470.5, J, "LA LÍNEA BLANCA", -320, -170, "#f3ecd8", 52),
    tag("esp", at("su esponja nunca alcanza"), 470.5, J, "LA ESPONJA NUNCA LLEGA", 300, 130, COL.red, 42),
    big("imp", at("lo mas importante"), 475.6, "LO MÁS IMPORTANTE", 880, 110, "#ffd60a", "#5a4500"),
    stamp("obl", at("era obligatorio"), 480.9, "OBLIGATORIO", 1380, 230, COL.red, 92),
    tag("brille", at("hasta que brille"), 486.7, fix(960, 520), "SECO, HASTA QUE BRILLE", 280, -200, GREEN, 48),
    tag("gnew", at("cada gota le deja"), 486.7, J, "CADA GOTA = PIEDRA NUEVA", -320, 160, COL.red, 42),
    big("otra", at("otra vez la primera capa"), 492.0, "Y EMPIEZA OTRA VEZ", 880, 96, COL.red, "#3a0a06"),
    // --- paso 3 ---
    o(492.1, 498.0, (t) => <StepPlate key="p3" t={t} at={at("paso 3")} out={497.8} n="PASO 3" tx="COSTRA DE AÑOS" />),
    tag("dedo", at("un dedo de alto"), 497.9, J, "UN DEDO DE ALTO", -320, -170, "#f3ecd8", 52),
    tag("acc", at("el acido catrico en polvo"), 504.3, fix(960, 520), "ÁCIDO CÍTRICO EN POLVO", 280, -200, "#ffd60a", 50),
    big("cons", at("para las conservas"), 508.6, "EL DE LAS CONSERVAS", 880, 90, "#ffd60a", "#5a4500"),
    o(508.7, 520.0, (t) => <Recipe key="rec" t={t} at={at("dos cucharadas")} at2={at("una taza de agua tibia")} out={519.8} x={1450} y={330} />),
    tag("olor", at("casi no tiene olor"), 519.9, fix(700, 640), "MÁS RÁPIDO · CASI SIN OLOR", -260, 160, COL.ice, 42),
    stamp("solo", at("solo en cromo"), 525.1, "SÓLO EN CROMO", 1380, 240, COL.red, 92),
    o(525.2, 531.0, (t) => <MaxTimer key="m1h" t={t} at={525.3} out={530.8} x={620} y={540} label="1 H" sub="MÁX." col={COL.red} />),
    big("2v", at("dos vendas", 525), 530.9, "2 VENDAS Y NADA → PARE", 540, 84, COL.ink, "#5a4a36"),
    // --- CTA2: la guía en la pág. 28 ---
    o(531.0, 553.3, (t) => { const bk = screenOf(t, [PT.book[0], PT.book[1] + 0.04, PT.book[2]]); return <Tag key="g2" t={t} at={at("en mi guaa", 530)} x={bk.x} y={bk.y - 40} dx={-300} dy={-170} text="EL FRASCO MARRÓN" sub="DE CLAUDIO · MI GUÍA" col="#ffd08a" out={536.3} size={52} />; }),
    o(536.4, 541.6, (t) => <AvBadge key="avb" t={t} at={536.45} out={541.4} x={330} y={420}><Avatar t={Math.min(t, 541.55)} /></AvBadge>),
    o(at("la pagina 28"), 545, (t) => <BigNum key="p28" t={t} at={at("la pagina 28")} text="PÁG. 28" x={1500} y={130} size={120} col="#ffd60a" edge="#5a4500" out={545} />),
    o(542, 553.3, (t) => { const p = screenOf(t, pagePt(0.25, 0.165)); return <Tag key="amb" t={t} at={at("ambiente por ambiente")} x={p.x} y={p.y} dx={-280} dy={-120} text="AMBIENTE POR AMBIENTE" col="#ffd60a" out={549} size={42} />; }),
    o(542, 553.3, (t) => { const p = screenOf(t, pagePt(0.63, 0.28)); return <Tag key="esp2" t={t} at={at("el tiempo de espera")} x={p.x} y={p.y} dx={260} dy={-140} text="CUÁNTO ESPERAR" col="#ff9f43" out={553} size={42} />; }),
    o(553.3, 569.6, (t) => <AbsoluteFill key="pc" style={{ transform: "translateX(230px)" }}><PriceCompare t={t} at={at("cuesta entre 40")} plAt={at("mas el plomero")} gAt={at("la guaa cuesta 17")} twiceAt={at("ya se paga dos veces")} out={569.4} /></AbsoluteFill>),
    o(553.3, 558.0, (t) => <AvBadge key="avb2" t={t} at={553.35} out={557.8} x={330} y={360}><Avatar t={Math.min(t, 557.95)} /></AvBadge>),
    stamp("rotas", at("no estan rotas"), 562.5, "NO ESTÁN ROTAS: ESTÁN TAPADAS", 960, 200, COL.amber, 76, -5),
    o(569.5, 574.1, (t) => <Desc key="desc2" t={t} at={at("el link esta", 565)} out={573.9} />),
    o(569.5, 574.1, (t) => <AvBadge key="avb3" t={t} at={569.55} out={573.9} x={1640} y={820}><Avatar t={Math.min(t, 574.05)} /></AvBadge>),
    // --- los 5 errores ---
    o(574.1, 584.4, (t) => <ErrorCard key="e1" t={t} at={at("error namero 1")} out={584.2} n={1} tx="LA FIBRA VERDE" />),
    tag("duro", at("lo mas duro que tiene"), 584.3, fix(960, 600), "LO MÁS DURO QUE TIENE", 280, -220, COL.red, 46),
    o(588.3, 594.0, (t) => <HairVsChrome key="hvc" t={t} at={588.35} cAt={589.0} out={593.8} x={960} y={520} />),
    tag("mil", at("miles de rayitas"), 600.3, fix(960, 640), "MILES DE RAYITAS", -320, -170, COL.red, 52),
    tag("opa", at("queda opaca"), 600.3, fix(960, 300), "YA NO BRILLA", 260, -100, COL.ink, 48),
    big("noarr", at("ya no se arregla"), 605.4, "EL CROMO RAYADO NO SE ARREGLA", 880, 76, COL.red, "#3a0a06"),
    o(605.5, 616.6, (t) => { const k = e(t, at("la piedra se disuelve", 605) - 0.1, at("la piedra se disuelve", 605) + 0.2), k2 = e(t, at("no se lija") - 0.1, at("no se lija") + 0.15), oo = 1 - e(t, 614.6, 615.0); return oo < 0.01 ? null : (
      <div key="plate" style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", opacity: oo, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 150, color: GREEN, textShadow: extrude(10, "#0a3a1a"), opacity: k, transform: `scale(${0.8 + 0.2 * k})` }}>SE DISUELVE</div>
        <div style={{ fontSize: 120, color: COL.red, textShadow: extrude(9, "#3a0a06"), opacity: k2, transform: `translateY(${(1 - k2) * 60}px)`, marginTop: 20 }}>NO SE LIJA</div>
      </div>); }),
    o(614.6, 620.6, (t) => <ErrorCard key="e2" t={t} at={at("error namero 2")} out={620.4} n={2} tx="EL CLORO" />),
    o(620.6, 626.6, (t) => <ClorTarget key="clor" t={t} at={620.7} at2={at("sobre el sarro no")} out={626.4} />),
    tag("amar", at("amarillas las gomitas"), 632.7, J, "GOMITAS AMARILLAS", -320, -170, "#ffd66b", 48),
    tag("met", at("ataca el metal"), 632.7, fix(960, 600), "ATACA EL METAL", 280, 150, COL.red, 48),
    big("igual", at("la costra sigue igual"), 636.8, "…Y LA COSTRA SIGUE IGUAL", 880, 84, COL.ink),
    o(636.9, 649.9, (t) => <ErrorCard key="e3" t={t} at={at("error namero 3")} out={644.5} n={3} tx="MEZCLAR" />),
    o(636.9, 649.9, (t) => <GasWarn key="gas" t={t} at={at("suelta un gas")} out={649.7} x={1400} y={520} />),
    stamp("pel", at("eso es peligroso"), 655.7, "PELIGRO", 1420, 250, COL.red, 130),
    tag("vent", at("abra la ventana"), 660.9, fix(960, 460), "MUCHA AGUA + VENTANA ABIERTA", 280, -200, COL.ice, 44),
    o(661.0, 667.0, (t) => <NextDay key="nd" t={t} at={661.1} flip={661.9} out={666.8} x={620} y={560} />),
    o(661.0, 667.0, (t) => <BigNum key="mzc" t={t} at={at("nunca hay que mezclar")} text="EN LA GUÍA:" sub="LO QUE NUNCA SE MEZCLA" x={1340} y={480} size={90} col="#ffd08a" out={666.8} />),
    o(667.0, 672.6, (t) => <ErrorCard key="e4" t={t} at={at("error namero 4")} out={672.4} n={4} tx="TODA LA NOCHE" />),
    big("nomej", at("mas tiempo no es mejor"), 672.5, "MÁS TIEMPO ≠ MEJOR", 880, 96, COL.red, "#3a0a06"),
    o(672.6, 678.0, (t) => <NightVsHour key="nh" t={t} at={672.7} at2={1e9} out={677.8} />),
    tag("amp", at("en ampollas"), 686.1, fix(960, 520), "AMPOLLAS", 260, -200, COL.red, 60),
    big("1h", 686.3, 691.1, "1 HORA ✓", 160, 120, GREEN, "#0a3a1a"),
    stamp("12h", at("12 horas"), 691.1, "12 HORAS ✗", 1440, 820, COL.red, 100),
    o(691.2, 697.0, (t) => <ErrorCard key="e5" t={t} at={at("error namero 5")} out={696.8} n={5} tx="EL MÁRMOL" x={960} y={540} />),
    tag("got", at("la venda de vinagre gotea"), 702.8, (t) => screenOf(t, [MUES[0] + MUES_X[0], 0.9, MUES[2] - 0.05]), "GOTEA SOBRE EL MÁRMOL", 280, -170, COL.red, 46),
    big("trapo1", at("ponga primero un trapo"), 709.0, "PRIMERO, UN TRAPO SECO", 880, 90, COL.ink),
    tag("trapo2", 709.3, 713.4, fix(960, 600), "QUE NADA TOQUE EL MÁRMOL", 280, -220, COL.ink, 46),
    stamp("prom", at("una cosa que le prometa"), 713.4, "PROMETIDO", 1400, 230, "#ffd60a", 90),
    tag("pic", at("con picaduras"), 719.4, fix(960, 560), "VERDE O CON PICADURAS", 280, -220, COL.red, 48),
    big("noes", at("ya no es sarro"), 724.6, "YA NO ES SARRO", 880, 110, COL.red, "#3a0a06"),
    tag("corr", at("corroado"), 730.9, J, "METAL CORROÍDO", -320, -170, "#7fe0b0", 50),
    stamp("camb", at("hay que cambiarla"), 730.9, "HAY QUE CAMBIARLA", 1380, 240, COL.red, 84),
    o(731.0, 737.7, (t) => <OneInTen key="oit" t={t} at={731.1} nineAt={at("las otras 9")} out={737.5} />),
    // --- la ducha ---
    big("duch", at("lo mismo", 737), 742.3, "LA DUCHA: LO MISMO", 880, 96, COL.ice, "#0a2a40"),
    tag("v30", at("venda de vinagre 30"), 747.9, fix(960, 540), "VENDA · 30 MIN", 280, -200, "#ffd60a", 50),
    tag("agu", at("agujeritos tapados"), 752.9, fix(960, 460), "AGUJERITOS TAPADOS", 280, -180, COL.ice, 48),
    o(757.5, 763.0, (t) => <VideoCard key="vcard" t={t} at={757.6} out={762.8} img="" title="LA REGADERA TAPADA" x={960} y={520} />),
    // --- para que no vuelva ---
    big("pqnv", at("para que no vuelva"), 769.6, "PARA QUE NO VUELVA", 170, 110, GREEN, "#0a3a1a"),
    big("20a", at("durara 20 aaos"), 774.5, "20 AÑOS LA MISMA LLAVE", 880, 90, "#ffd60a", "#5a4500"),
    o(769.7, 834.7, (t) => {
      const R = [{ at: at("uno despuas de usar"), when: "CADA USO", what: "10 segundos con el paño seco", ic: "🧽" }, { at: at("una vez por semana"), when: "CADA SEMANA", what: "vinagre rociado, 5 minutos", ic: "🍶" },
        { at: at("una vez por mes"), when: "CADA MES", what: "una capa finita de cera de auto", ic: "✨" }, { at: at("una vez cada tres meses"), when: "CADA 3 MESES", what: "la bolsita en la boquita", ic: "🛍️" }];
      const show = (t >= 771 && t < 780) || (t >= 798 && t < 803.1) || (t >= 815 && t < 821.6) || (t >= 826.8 && t < 831);
      const hl = R.filter((r) => t >= r.at).length - 1;
      const vis = R.filter((r) => t >= r.at - 0.3), op = show && vis.length ? 1 : 0;
      return <AbsoluteFill key="rout" style={{ opacity: op }}>{op > 0 && <Routine t={t} rows={vis} out={834.5} hl={hl} x={1420} y={560} sc={0.82} />}</AbsoluteFill>;
    }),
    tag("10s", at("10 segundos"), 780.0, (t) => screenOf(t, PT.spout), "10 SEGUNDOS, SIN AGUA", -320, -160, COL.ice, 46),
    tag("rosa", at("rosa que limpiaba"), 787.6, fix(900, 520), "ROSA · TERCER PISO", -280, -220, "#ffb3c7", 48),
    tag("pam", at("paao amarillo"), 787.6, fix(1000, 640), "UN PAÑO SÓLO PARA LAS LLAVES", 260, 160, "#ffd66b", 42),
    big("nunca2", at("nunca tenaan una mancha"), 792.7, "NI UNA MANCHA", 880, 110, GREEN, "#0a3a1a"),
    tag("5m", at("espere 5 minutos"), 797.9, fix(960, 520), "ESPERE 5 MIN Y PASE EL PAÑO", 280, -200, "#ffd60a", 44),
    o(803.1, 808.4, (t) => <TwoMinVsSat key="2m" t={t} at={at("2 minutos por semana")} out={808.2} />),
    tag("cera", at("cera de auto"), 814.9, fix(960, 520), "CERA DE AUTO EN PASTA", 280, -200, "#ffd60a", 48),
    tag("res", at("resbale en gotas"), 821.5, AE, "EL AGUA RESBALA", 280, 160, COL.ice, 50),
    big("hot", at("las llaves de los hoteles"), 826.7, "ASÍ BRILLAN LAS DEL HOTEL", 880, 84, "#ffd60a", "#5a4500"),
    big("3m", at("cada tres meses"), 830.9, "CADA 3 MESES", 160, 110, COL.amber, "#4a2a00"),
    tag("ntor", at("nunca llega a torcerse"), 834.6, fix(960, 560), "NUNCA SE TUERCE", 280, -200, GREEN, 54),
    // --- el repaso ---
    o(834.7, 872.3, (t) => <Recap key="rcp" t={t} out={872.1} rows={[
      { at: at("es piedra del"), tx: "LO BLANCO Y DURO ES PIEDRA" }, { at: at("haga la prueba de la gota"), tx: "LA GOTA: SI BURBUJEA, ES SARRO" },
      { at: at("mire el acabado"), tx: "CROMO SÍ · DORADO/NEGRO: OJO" }, { at: at("el marmol nunca toca"), tx: "EL MÁRMOL, NUNCA", no: true },
      { at: at("la boquita bolsita"), tx: "BOQUITA: BOLSITA, 1 HORA" }, { at: at("la base venda"), tx: "BASE: VENDA, 30-60 MIN" },
      { at: at("cepillo de dientes y palillo"), tx: "CEPILLO + PALILLO DE MADERA" }, { at: at("costra de aaos", 860), tx: "AÑOS: CÍTRICO, SÓLO CROMO" },
      { at: at("siempre siempre seque"), tx: "SIEMPRE SECAR AL FINAL" }, { at: at("nada de fibra verde", 860), tx: "FIBRA VERDE", no: true },
      { at: at("nada de cloro"), tx: "CLORO · MEZCLAR", no: true }]} />),
    // --- la tarea y el cierre ---
    big("tarea", at("le dejo una tarea"), 878.5, "LA TAREA: MAÑANA, MIRE EL CHORRO", 880, 76, "#ffd60a", "#5a4500"),
    o(878.6, 889.6, (t) => <Comment key="cmt" t={t} at={878.7} typeAt={at("chorro torcido", 880) - 0.2} out={889.4} text="chorro torcido" x={960} y={830} />),
    tag("aren2", at("cuanta arenilla"), 889.5, fix(960, 460), "¿CUÁNTA ARENILLA SALIÓ?", 280, -180, "#f3ecd8", 46),
    o(889.6, 895.2, (t) => <Desc key="desc3" t={t} at={at("en la primera lanea", 893)} out={895.1} />),
    big("p18", at("18 es la de hoy") - 0.3, 903.5, "PÁG. 18 · LA DE HOY", 150, 100, "#ffd60a", "#5a4500"),
    tag("prox", at("en el praximo video"), 908.2, (t) => screenOf(t, PT.joint), "EL PRÓXIMO: OTRA MANCHA \"IMPOSIBLE\"", -340, -170, COL.ice, 40),
  ];
};

let SEGS: Seg[] | null = null, OVS: Ov[] | null = null;

export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  SEGS = SEGS ?? buildSegs(); OVS = OVS ?? buildOvs();
  let i = 0;
  for (let j = 0; j < SEGS.length; j++) if (SEGS[j].a <= t) i = j;
  const cur = SEGS[i], prev = SEGS[i - 1];
  const base = prev && t < cur.a + D && cur.tr !== "cut"
    ? <Trans t={t} s={cur} from={prev.base(t)} to={cur.base(t)} fromWorld={!!prev.world} />
    : cur.base(t);
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
