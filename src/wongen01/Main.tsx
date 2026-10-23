// wongen01 · EL VIDEO ENTERO (0 → 17:31) en UNA toma: la cocina del takeout de Mr. Lau es el mundo y la cámara nunca corta.
// Entre ventana y ventana del avatar: el mundo 3D (el wok, la turbina, los polvos, las sojas, la hornalla de casa, el grano macro)
// o la toma real LTX (si todavía no llegó, la foto del primer cuadro con empuje lento), y las piezas 2.5D clavadas a la voz.
// Entrada al avatar = golpe de VAPOR; salida = PORTAL que se abre a lo que sigue. Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, V, camSpeed, setKeys, win } from "./kitchen3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, Chips, LowerThird, P, Portal, Tag, at as atRaw, e, ei, s } from "./lib";
import { Btu, Bacterias, Campana, Comanda, Cuenta, Cuenta$, Fortuna, Granos, K, Libreta, Medida, NoCard, Pasos, Pensado, Sello, Semana, SiCard, Suscribir, Vapor } from "./pieces";

export const FULL_END = 1051.6;
export const FULL_FRAMES = Math.ceil(FULL_END * 30);
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = (AVW as { win: Win[] }).win;
export const MIN1_END = WIN[5].ms; // el minuto 1 llega hasta "every afternoon at 3 o'clock"
export const MIN1_FRAMES = s(MIN1_END);

// at() con red: la frase del ASR cerca del segundo esperado o, si no aparece, ese segundo
const A = (ph: string, fb: number) => { try { const v = atRaw(ph, fb - 6); return Math.abs(v - fb) < 6 ? v : fb; } catch { return fb; } };

// ---------------- vistas de la cámara ----------------
type Vw = { p: V; l: V; fov: number };
const VW: Record<string, Vw> = {
  wide: { p: [0.9, 1.75, 1.7], l: [-0.2, 1.1, -2.0], fov: 44 },
  wide2: { p: [-0.4, 1.6, 1.2], l: [-0.1, 1.15, -2.0], fov: 42 },
  wok: { p: [-0.2, 1.45, -1.35], l: PT.wok, fov: 40 },
  wokTop: { p: [0.15, 1.72, -1.2], l: [-0.35, 1.0, -1.95], fov: 34 },
  wokLow: { p: [0.4, 1.32, -1.3], l: [-0.35, 1.02, -1.95], fov: 38 },
  polvos: { p: [-1.35, 1.32, -1.45], l: PT.polvos, fov: 34 },
  soja: { p: [-1.0, 1.25, -1.62], l: PT.soja, fov: 30 },
  casa: { p: [-2.4, 1.5, -0.4], l: PT.casa, fov: 40 },
  dos: { p: [-1.6, 1.7, 0.7], l: [-1.7, 1.0, -1.7], fov: 48 },
  bandejas: { p: [1.9, 1.5, 0.2], l: PT.bandejas, fov: 42 },
  arrocera: { p: [1.05, 1.45, -1.05], l: PT.arrocera, fov: 38 },
  comandas: { p: [-0.2, 1.65, -0.45], l: PT.comandas, fov: 44 },
  cajas: { p: [0.75, 1.6, -0.55], l: PT.cajas, fov: 40 },
  macro: { p: [24, 1.45, 1.6], l: PT.macro, fov: 34 },
  macroC: { p: [24, 1.32, 1.05], l: PT.macro, fov: 30 },
};
const push = (v: Vw, k: number, dfov = 0): Vw => ({ p: v.p.map((x, i) => x + (v.l[i] - x) * k) as V, l: v.l, fov: v.fov + dfov });
const keys: { t: number; p: V; l: V; fov: number; arc?: number }[] = [];
// una toma del mundo de a → b: de la vista v1 a la v2 (por defecto, un empuje lento sobre v1)
const shot = (a: number, b: number, v1: Vw, v2?: Vw, arc?: number) => { const w2 = v2 ?? push(v1, 0.12); keys.push({ t: a, ...v1 }, { t: b, ...w2, arc }); };

// ---------------- estado del mundo por tramo ----------------
type WS = { a: number; b: number; w: (t: number) => Partial<WorldProps> };
const STATES: WS[] = [];
const st = (a: number, b: number, w: (t: number) => Partial<WorldProps>) => STATES.push({ a, b, w });
const worldAt = (t: number): WorldProps => {
  let w: Partial<WorldProps> = {};
  for (const x of STATES) if (t >= x.a - 1 && t < x.b + 0.5) w = x.w(t);
  return { t, ...w };
};
const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  return <AbsoluteFill style={{ filter: v.bx + v.by > 2.5 ? `blur(${Math.min(7, (v.bx + v.by) * 0.45).toFixed(2)}px)` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>;
};

// ---------------- avatar (preroll de 10 cuadros por ventana) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.filter((w) => t > w.ms - 1 && t < w.me + 1).map((w) => (
    <Sequence key={w.ms} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// ---------------- toma real (clip LTX si ya llegó; si no, la foto del primer cuadro con empuje lento). `from` = segundo dentro del clip ----------------
const Clip: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 9);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} startFrom={s(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ================= LOS TRAMOS =================
// Cada tramo i va del final de la ventana i al comienzo de la i+1. bg = lo que se ve (mundo o toma), fx = piezas encima.
type Gap = { a: number; b: number; bg: BG; fx?: (t: number) => React.ReactNode[] };
const G: Gap[] = [];
const ms = (i: number) => WIN[i].ms, me = (i: number) => WIN[i].me;
const W = (t: number, over?: Partial<WorldProps>) => <World t={t} over={over} />;
type BG = ((t: number) => React.ReactNode) & { clip?: { k: string; a: number; from: number }; parts?: [BG, BG, number] };
const C = (k: string, a: number, from = 0, z?: [number, number]): BG => Object.assign((t: number) => <Clip k={k} t={t} a={a} from={from} z={z} />, { clip: { k, a, from } });
// tramo partido: toma y después el mundo (o al revés) con portal en `cut`
const split = (first: BG, second: BG, cut: number, x = 960, y = 540): BG => Object.assign((t: number) => {
  if (t < cut - 0.6) return first(t);
  if (t >= cut) return second(t);
  return <>{first(t)}<Portal x={x} y={y} r={ei(t, cut - 0.6, cut)}>{second(t)}</Portal></>;
}, { parts: [first, second, cut] as [BG, BG, number] });
const gap = (i: number, bg: Gap["bg"], fx?: Gap["fx"]) => G.push({ a: me(i), b: i + 1 < WIN.length ? ms(i + 1) : FULL_END, bg, fx });
const T = (x: number) => x; // sólo para leer

// ---- 0 · GANCHO: "You're standing at your stove…" → la papilla de casa → "why does the takeout one never look like this?" → el wok
const t_gray = A("gray and wet", 2.5), t_soy = A("you add more soy sauce", 6.5), t_mush = A("brown mush", 9.2), t_why = A("why does the takeout", 12.0), t_never = A("it was never you", 15.5);
shot(t_why - 0.6, ms(1) + 0.4, VW.wokTop, push(VW.wokTop, 0.25, -4));
st(0, 17.6, (t) => ({ fire: 0.9, smoke: 0.5, hei: 0.6, arroz: { rice: 1, brown: 1, toss: 0.35 * win(t, t_why, t_why + 1) }, egg: 1, eggBrown: 0.3, peas: 1, greens: 1, tickets: 6 }));
gap(0, split(C("h01_casa_papilla", me(0) - 0.7, 0, [1.0, 1.08]), (t) => W(t), t_why + 0.3, 1300, 420), (t) => [
  <Tag key="gw" t={t} at={t_gray} x={900} y={560} dx={-260} dy={-200} text="GRAY & WET" col={K.gold} out={t_soy - 0.2} size={56} />,
  <Pensado key="ms" t={t} at={t_soy} out={t_mush - 0.1} x={1350} y={230} text="…more soy sauce" size={88} />,
  <Sello key="bm" t={t} at={t_mush} text="BROWN MUSH" x={960} y={760} out={t_why} rot={-7} />,
  <Pensado key="wy" t={t} at={t_why + 0.2} out={t_never - 0.2} x={760} y={200} text="why doesn't mine look like this?" size={80} />,
  <Pensado key="nv" t={t} at={t_never} out={ms(1) + 0.3} x={960} y={900} text="it was never you." size={110} col={K.gold} />,
]);
// ---- 1 · "My name is Wong. Forty years… 6 days a week, 14 hours a day, same wok, same fire."
const t_name = A("my name is wong", 24.3), t_forty = A("forty years", 25.6), t_six = A("6 days a week", 28.8), t_same = A("same wok", 32.0);
shot(me(1) - 0.7, ms(2) + 0.4, VW.wide, push(VW.wide, 0.35, -6));
st(me(1), ms(2), () => ({ fire: 0.7, smoke: 0.35, arroz: { rice: 0.6, brown: 0.7 }, tickets: 8 }));
gap(1, (t) => W(t), (t) => [
  <LowerThird key="lt" t={t} at={t_name} out={t_six - 0.2} name="UNCLE WONG" l2="40 YEARS IN A TAKEOUT KITCHEN" l2at={t_forty} />,
  <Medida key="6d" t={t} at={t_six} out={ms(2) - 0.1} x={1350} y={330} big="6 DAYS · 14 HRS" sub="A WEEK · A DAY" size={110} />,
  <Tag key="sw" t={t} at={t_same} x={640} y={500} dx={-200} dy={-170} text="SAME WOK" sub="SAME FIRE" col={K.gold} out={ms(2) - 0.1} size={52} />,
]);
// ---- 2 · Mr. Lau tira el arroz a la basura (×3) · "Wong, you make porridge, not fried rice."
const t_lau = A("mr lau he threw", 40.0), t_three = A("three times one day", 44.0), t_porr = A("you make porridge", 46.3);
gap(2, C("a01_basura", me(2) - 0.7), (t) => [
  <Tag key="ml" t={t} at={Math.max(me(2) + 0.2, t_lau)} x={1100} y={420} dx={260} dy={-190} text="MR. LAU" sub="THE OWNER" col={K.gold} out={t_three - 0.1} size={56} />,
  <Medida key="3x" t={t} at={t_three} out={ms(3) + 0.2} x={480} y={300} big="3×" sub="IN ONE DAY" />,
  <Fortuna key="pr" t={t} at={t_porr - 0.3} out={ms(3) + 2.5} text="Wong, you make porridge, not fried rice." who="MR. LAU" y={860} />,
]);
// ---- 3 · "Today Mr Lau is retired, he is 89, he plays mahjong…" → "seven secrets, the real ones… exact amounts"
const t_89 = A("he is 89", 51.0), t_mah = A("he plays mahjong", 52.0), t_fire = A("he cannot fire me", 54.3), t_seven = A("seven secrets", 58.0), t_exact = A("with the exact amounts", 61.5);
shot(t_seven - 0.6, ms(4) + 0.4, VW.comandas, push(VW.comandas, 0.2));
st(me(3), ms(4), (t) => ({ fire: 0.5, smoke: 0.3, tickets: Math.round(2 + 10 * win(t, t_seven, t_seven + 1.6)), arroz: { rice: 0.6, brown: 0.6 } }));
gap(3, split(C("a05_mahjong", me(3) - 0.7), (t) => W(t), t_seven, 960, 380), (t) => [
  <Medida key="89" t={t} at={t_89} out={t_fire - 0.1} x={460} y={330} big="89" sub="AND RETIRED" />,
  <Tag key="mj" t={t} at={t_mah} x={1200} y={620} dx={220} dy={-180} text="MAHJONG" sub="ALL DAY" col={K.gold} out={t_fire} size={52} />,
  <Pensado key="cf" t={t} at={t_fire} out={t_seven - 0.3} x={960} y={880} text="…he can't fire me anymore." size={92} />,
  <Medida key="7s" t={t} at={t_seven + 0.2} out={ms(4) + 0.2} x={960} y={780} big="7 SECRETS" sub="THE REAL ONES" size={130} />,
  <Chips key="ex" t={t} at={t_exact} items={["EXACT AMOUNTS", "FOR YOUR HOME KITCHEN"]} out={ms(4) + 0.2} y={190} />,
]);
// ---- 4 · "…somebody in your family is going to argue… Let them argue, then let them taste. Okay, come in the kitchen." → SECRET #1
const t_argue = A("going to argue", 70.0), t_taste = A("let them argue", 73.6), t_come = A("come in the kitchen", 76.8), t_s1 = A("secret number one", 78.1);
shot(me(4) - 0.7, t_come, VW.wide2, VW.wide2);
shot(t_come + 0.01, ms(5) + 0.4, VW.wide2, VW.arrocera);
st(me(4), ms(5), () => ({ fire: 0.4, smoke: 0.3, cooker: 0.8, tickets: 7 }));
gap(4, (t) => W(t), (t) => [
  <Pensado key="ar" t={t} at={t_argue} out={t_taste - 0.2} x={960} y={300} text="somebody will argue with you…" size={86} />,
  <Fortuna key="lt" t={t} at={t_taste} out={t_come - 0.1} text="Let them argue. Then let them taste." y={820} />,
  <Comanda key="c1" t={t} at={t_s1 - 0.2} out={ms(5) + 1.6} n={1} head="SECRET" title={["the rice", "must sleep"]} />,
]);
// ---- 5 · "Not for today, for tomorrow. 20 cups of long grain jasmine… sheet trays, thin, one inch… walk-in, no cover first hour"
const t_tom = A("not for today", 86.6), t_20 = A("20 cups", 88.9), t_trays = A("spread it out on the sheet trays", 93.6), t_inch = A("one inch", 96.5), t_nocov = A("no cover for the first hour", 99.0);
gap(5, split(C("r02_olla_arroz", me(5) - 0.7), C("r03_bandejas", t_trays - 0.6), t_trays, 960, 540), (t) => [
  <Pensado key="tm" t={t} at={t_tom} out={t_20 - 0.1} x={1300} y={240} text="for TOMORROW" size={110} col={K.gold} />,
  <Medida key="20" t={t} at={t_20} out={t_trays - 0.4} x={480} y={330} big="20 CUPS" sub="LONG GRAIN JASMINE" size={130} />,
  <Medida key="1i" t={t} at={t_inch} out={t_nocov - 0.1} x={1450} y={320} big="1 INCH" sub="THIN" size={130} />,
  <Tag key="nc" t={t} at={t_nocov} x={960} y={520} dx={-300} dy={-200} text="NO COVER" sub="THE FIRST HOUR" col={K.gold} out={ms(6) + 0.2} size={54} />,
]);
// ---- 6 · "fresh rice is for eating, old rice is for frying." (cámara fría) → "Here is what actually happens" → MACRO
const t_fresh = A("fresh rice is for eating", 104.6), t_happ = A("here is what actually happens", 109.6), t_water = A("full of water", 113.5), t_glue = A("like glue", 117.0);
shot(t_happ - 0.6, ms(7) + 0.4, VW.macro, VW.macroC);
st(t_happ - 1, 132, (t) => ({ macro: { on: 1, wet: 1, split: 0 } }));
gap(6, split(C("r04_camara_fria", me(6) - 0.7), (t) => W(t), t_happ, 960, 540), (t) => [
  <Fortuna key="fr" t={t} at={t_fresh - 0.2} out={t_happ - 0.2} text="Fresh rice is for eating. Old rice is for frying." who="MR. LAU" y={860} size={50} />,
  <Tag key="wa" t={t} at={t_water} x={760} y={420} dx={-240} dy={-180} text="WATER" col="#8fd6ff" out={ms(7) + 0.2} size={58} />,
  <Tag key="gl" t={t} at={t_glue} x={1160} y={560} dx={260} dy={-200} text="STICKY STARCH" sub="= GLUE" col={K.gold} out={ms(7) + 0.2} size={56} />,
]);
// ---- 7 · "…the rice steams instead of fries… That is your mush." (el wok con vapor) → "when the rice sleeps one night in the cold" → macro se seca
const t_neigh = A("to its neighbor", 125.0), t_yourm = A("that is your mush", 126.9), t_sleeps = A("when the rice sleeps", 128.6);
shot(me(7) - 0.7, t_sleeps - 0.6, VW.wokTop, push(VW.wokTop, 0.2));
shot(t_sleeps, ms(8) + 0.4, VW.macroC, VW.macro);
st(me(7) - 1, t_sleeps - 0.2, () => ({ fire: 0.35, smoke: 1, arroz: { rice: 1, clump: 1, wet: 1 } }));
st(t_sleeps - 0.2, ms(8) + 0.5, (t) => ({ macro: { on: 1, wet: 1 - win(t, t_sleeps + 0.5, ms(8) + 3), split: 0, crystal: 0 } }));
gap(7, split((t) => W(t), (t) => W(t), t_sleeps, 960, 540), (t) => [
  <Tag key="st" t={t} at={me(7) + 0.3} x={960} y={420} dx={260} dy={-200} text="STEAMS" sub="INSTEAD OF FRIES" col="#8fd6ff" out={t_neigh} size={56} />,
  <Tag key="nb" t={t} at={t_neigh} x={900} y={620} dx={-260} dy={120} text="GLUED" sub="TO ITS NEIGHBOR" col={K.gold} out={t_sleeps - 0.3} size={54} />,
  <Sello key="mu" t={t} at={t_yourm} text="MUSH" x={1400} y={300} out={t_sleeps - 0.3} rot={8} size={140} />,
  <Pensado key="ni" t={t} at={t_sleeps + 0.2} out={ms(8) + 0.3} x={960} y={190} text="one night in the cold…" size={92} />,
]);
// ---- 8 · "Scientists call it retrogradation. I call it the rice wakes up hard. Now every grain is alone. Separate. It can fry." → 1 taza, enjuagar 3 veces
const t_retro = A("retrogradation", 138.4), t_hard = A("the rice wakes up hard", 140.0), t_alone = A("every grain is alone", 142.3), t_sep = A("separate", 144.1), t_fry = A("it can fry", 144.7), t_cup = A("one cup of jasmine rice", 146.5), t_rinse = A("rinse it three times", 148.5), t_less = A("a little less water", 152.0);
shot(me(8) - 0.7, t_cup - 0.6, VW.macro, push(VW.macro, 0.3, -2));
st(me(8) - 1, t_cup, (t) => ({ macro: { on: 1, wet: 0, crystal: win(t, t_retro, t_retro + 1.2), split: win(t, t_alone, t_sep + 0.4), toast: 0.25 * win(t, t_fry, t_fry + 0.8) } }));
gap(8, split((t) => W(t), C("r01_lavar_arroz", t_cup - 0.6), t_cup, 960, 540), (t) => [
  <Medida key="rt" t={t} at={t_retro} out={t_hard - 0.1} x={960} y={200} big="RETROGRADATION" sub="THE STARCH GOES FIRM" size={110} col={K.cream} />,
  <Pensado key="wh" t={t} at={t_hard} out={t_alone - 0.1} x={960} y={190} text="the rice wakes up hard" size={96} col={K.gold} />,
  <Tag key="al" t={t} at={t_alone} x={760} y={540} dx={-200} dy={-200} text="ALONE" col={K.gold} out={t_cup - 0.3} size={60} />,
  <Tag key="sp" t={t} at={t_sep} x={1160} y={540} dx={200} dy={-200} text="SEPARATE" col={K.gold} out={t_cup - 0.3} size={60} />,
  <Sello key="cf" t={t} at={t_fry} text="IT CAN FRY" x={960} y={860} out={t_cup - 0.3} rot={-5} col={K.jade} size={100} />,
  <Medida key="1c" t={t} at={t_cup} out={t_rinse - 0.05} x={1400} y={300} big="1 CUP" sub="JASMINE RICE" />,
  <Medida key="r3" t={t} at={t_rinse} out={ms(9) + 0.3} x={1400} y={300} big="RINSE ×3" sub="UNTIL ALMOST CLEAR" size={120} />,
  <Tag key="lw" t={t} at={t_less} x={960} y={600} dx={-280} dy={150} text="A LITTLE LESS WATER" sub="THAN THE BAG SAYS" col={K.gold} out={ms(9) + 0.3} size={50} />,
]);
// ---- 9 · "Spread it on a plate or a tray… in less than one hour it goes into the fridge. Uncovered for one hour, then cover it."
const t_plate = A("spread it on a plate", 159.6), t_hour = A("in less than one hour", 162.5), t_unc = A("uncovered for one hour", 166.3), t_then = A("then cover it", 167.8);
shot(me(9) - 0.7, ms(10) + 0.4, VW.bandejas, push(VW.bandejas, 0.25));
st(me(9) - 1, ms(10) + 0.5, (t) => ({ frio: win(t, t_hour, t_hour + 1), trays: 6, cooker: 0.5 }));
gap(9, (t) => W(t), (t) => [
  <Tag key="pt" t={t} at={t_plate} x={1100} y={520} dx={-300} dy={-200} text="PLATE OR TRAY" sub="LET THE STEAM GO" col={K.gold} out={t_hour - 0.1} size={52} />,
  <Medida key="1h" t={t} at={t_hour} out={t_unc - 0.1} x={560} y={300} big="< 1 HOUR" sub="INTO THE FRIDGE" size={130} />,
  <Pasos key="ps" t={t} out={ms(10) + 0.3} items={[{ at: t_unc, txt: "UNCOVERED 1 HOUR" }, { at: t_then, txt: "THEN COVER IT" }]} y={860} size={44} />,
]);
// ---- 10 · "Warm rice on the counter is a party for bacteria. … the health inspector… the rice trays"
const t_counter = A("do not leave cooked rice", 174.6), t_party = A("a party for bacteria", 179.5), t_insp = A("health inspector", 183.5), t_rtr = A("the rice trays", 186.5);
shot(me(10) - 0.7, ms(11) + 0.4, VW.arrocera, push(VW.arrocera, 0.15));
st(me(10) - 1, ms(11) + 0.5, () => ({ cooker: 1, fire: 0.3 }));
gap(10, (t) => W(t), (t) => [
  <NoCard key="cn" t={t} at={me(10) + 0.2} x={960} y={200} out={t_insp - 0.2} txt="ON THE COUNTER ALL AFTERNOON" w={820} cross={me(10) + 0.9} />,
  <Bacterias key="bc" t={t} at={t_party} out={t_insp - 0.2} x={960} y={620} />,
  <Sello key="py" t={t} at={t_party + 0.4} text="BACTERIA PARTY" x={960} y={880} out={t_insp - 0.2} rot={-6} size={96} />,
  <Comanda key="hi" t={t} at={t_insp} out={ms(11) + 0.3} n="✓" head="HEALTH INSPECTOR" title={["first thing:", "the rice trays"]} y={110} sc={0.9} />,
]);
// ---- 11 · "Cool it fast, fridge in one hour… I know what you are thinking. Uncle Wong, I want fried rice tonight… restaurant trick for the emergency"
const t_think = A("i know what you are thinking", 192.7), t_tonight = A("i want fried rice tonight", 195.5), t_emerg = A("restaurant trick for the emergency", 199.0);
shot(me(11) - 0.7, ms(12) + 0.4, VW.wide, push(VW.wide, 0.3, -4));
st(me(11) - 1, ms(12) + 0.5, () => ({ fire: 0.6, smoke: 0.4, tickets: 9, cooker: 0.6 }));
gap(11, (t) => W(t), (t) => [
  <Chips key="cl" t={t} at={me(11) + 0.1} items={["COOL IT FAST", "FRIDGE IN 1 HOUR", "USE IN 1–2 DAYS"]} out={t_think - 0.2} y={180} />,
  <Pensado key="tn" t={t} at={t_tonight} out={t_emerg - 0.2} x={960} y={300} text="“I want fried rice TONIGHT”" size={96} />,
  <Comanda key="em" t={t} at={t_emerg} out={ms(12) + 0.4} n="!" head="EMERGENCY" title={["the restaurant", "trick"]} />,
]);
// ---- 12 · ventilador 10 min → freezer 20 min · "No cover. Not perfect, but 90%." · "Lao did this on Chinese New Year"
const t_nocv = A("no cover", 210.4), t_90 = A("not perfect", 211.6), t_cny = A("chinese new year", 216.3);
gap(12, C("r07_ventilador", me(12) - 0.7), (t) => [
  <Pasos key="fz" t={t} out={t_90 - 0.1} items={[{ at: me(12) - 0.3, txt: "FAN · 10 MIN" }, { at: me(12) + 0.6, txt: "FREEZER · 20 MIN" }, { at: t_nocv, txt: "NO COVER" }]} y={860} size={46} />,
  <Medida key="90" t={t} at={t_90} out={t_cny - 0.1} x={1400} y={330} big="90%" sub="NOT PERFECT" size={170} />,
  <Tag key="ny" t={t} at={t_cny} x={960} y={520} dx={-280} dy={-200} text="CHINESE NEW YEAR" sub="WHEN WE RAN OUT" col={K.gold} out={ms(13) + 0.2} size={52} />,
]);
// ---- 13 · "Jasmine… a 50 pound bag every three days. Long grain has less of the sticky starch… Short grain, sushi rice…"
const t_50 = A("a 50 pound bag", 223.0), t_lg = A("long grain has less", 226.8), t_sg = A("short grain rice", 231.4);
gap(13, C("r06_bolsa_arroz", me(13) - 0.7), (t) => [
  <Medida key="50" t={t} at={t_50} out={t_lg - 0.1} x={1420} y={300} big="50 LB" sub="EVERY 3 DAYS" size={150} />,
  <Granos key="gr" t={t} at={t_lg} out={ms(14) + 0.3} x={960} y={560} items={[{ at: t_lg, name: "LONG GRAIN", L: 120, W: 18, ok: true, note: "stays separate" }, { at: t_sg, name: "SHORT GRAIN", L: 62, W: 34, ok: false, note: "made to stick" }]} />,
]);
// ---- 14 · "Basmati works too… If you only have short grain, rinse it five times… even a little less water."
const t_bas = A("basmati works too", 239.8), t_only = A("if you only have short grain", 243.3), t_r5 = A("rinse it five times", 246.0);
shot(me(14) - 0.7, ms(15) + 0.4, VW.arrocera, push(VW.arrocera, 0.2));
st(me(14) - 1, ms(15) + 0.5, () => ({ cooker: 0.7 }));
gap(14, (t) => W(t), (t) => [
  <SiCard key="ba" t={t} at={t_bas} x={960} y={250} out={t_only - 0.1} txt="BASMATI WORKS TOO" w={620} />,
  <Chips key="sg" t={t} at={t_r5} items={["SHORT GRAIN?", "RINSE ×5", "EVEN LESS WATER"]} out={ms(15) + 0.3} y={820} />,
]);
// ---- 15 · romper los grumos con los dedos mojados · "until it falls like sand" · "the clump stays a clump"
const t_sq = A("squeeze it gently", 257.9), t_sand = A("falls like sand", 259.8), t_clump = A("the clump stays a clump", 262.5);
gap(15, split(C("r05_romper_grumos", me(15) - 0.7), C("s01_granos", t_sand - 0.6), t_sand), (t) => [
  <Tag key="wf" t={t} at={me(15) + 0.1} x={960} y={600} dx={-260} dy={-220} text="WET FINGERS" sub="BREAK EVERY CLUMP" col={K.gold} out={t_sq} size={52} />,
  <Pensado key="sd" t={t} at={t_sand} out={t_clump - 0.1} x={960} y={200} text="…like sand" size={120} col={K.gold} />,
  <Sello key="cc" t={t} at={t_clump} text="A CLUMP STAYS A CLUMP" x={960} y={860} out={ms(16) + 0.3} rot={-4} size={80} />,
]);
// ---- 16 · SECRET #2 "Your stove is lying to you" · el quemador turbina · BTU
const t_s2 = A("secret number two", 267.2), t_jet = A("like a jet engine", 273.4), t_street = A("from the street", 276.4), t_home = A("a home stove burner", 278.0), t_rest = A("the restaurant wok burner", 284.5), t_10x = A("10 times the fire", 287.5);
gap(16, C("w01_quemador", me(16) - 0.7), (t) => [
  <Comanda key="c2" t={t} at={Math.max(me(16) - 0.2, t_s2)} out={t_jet - 0.3} n={2} head="SECRET" title={["your stove is", "lying to you"]} />,
  <Tag key="je" t={t} at={t_jet} x={960} y={640} dx={-300} dy={-260} text="A JET ENGINE" col={K.gold} out={t_street + 1.0} size={60} />,
  <Pensado key="sr" t={t} at={t_street} out={ms(17) + 0.2} x={1350} y={220} text="you hear it from the street" size={80} />,
]);
shot(me(17) - 0.7, ms(18) + 0.4, VW.dos, push(VW.dos, 0.15));
st(me(17) - 1, ms(18) + 0.5, () => ({ homeFire: 1, fire: 1, smoke: 0.5, hei: 0.4, arroz: { rice: 0.4, brown: 0.6 } }));
// ---- 17 · las dos cocinas lado a lado + barras de BTU · "when you watch a cook on the internet… it does not come out the same"
const t_inet = A("when you watch a cook on the internet", 289.8), t_same2 = A("it does not come out the same", 293.5);
gap(17, (t) => W(t), (t) => [
  <Btu key="bt" t={t} at1={Math.min(me(17) + 0.2, t_home)} at2={Math.max(me(17) + 1.0, t_rest)} x10={Math.max(me(17) + 2.2, t_10x)} out={t_inet - 0.2} y={720} />,
  <Pensado key="in" t={t} at={t_inet} out={ms(18) + 0.3} x={960} y={220} text="you copy the video… it doesn't come out the same" size={70} />,
]);
// ---- 18 · "So you have to cheat three ways. First, the pan." · hierro fundido · "holds heat like a stone"
const t_cheat = A("cheat three ways", 297.8), t_pan = A("first the pan", 299.7), t_carbon = A("carbon steel wok", 302.0), t_cast = A("cast iron skillet", 305.0), t_stone = A("like a stone", 308.5);
gap(18, C("c03_hierro", me(18) - 0.7), (t) => [
  <Pasos key="3w" t={t} out={t_carbon - 0.1} items={[{ at: t_pan, txt: "1 · THE PAN" }, { at: t_pan + 0.3, txt: "2 · THE HEAT" }, { at: t_pan + 0.6, txt: "3 · SMALL BATCHES" }]} y={860} size={44} />,
  <SiCard key="cw" t={t} at={t_carbon} x={600} y={220} out={ms(19) + 0.3} txt="CARBON STEEL WOK" w={560} />,
  <SiCard key="ci" t={t} at={t_cast} x={1320} y={220} out={ms(19) + 0.3} txt="HEAVY CAST IRON" w={540} />,
  <Pensado key="st" t={t} at={t_stone} out={ms(19) + 0.3} x={960} y={880} text="holds heat like a stone" size={92} col={K.gold} />,
]);
// ---- 19 · antiadherente fino: la temperatura se cae · "you are boiling rice, not frying" · "heat the pan empty… 5 minutes on high"
const t_nons = A("thin non stick pan", 310.0), t_boil = A("boiling rice not frying", 315.6), t_empty = A("heat the pan empty", 318.0), t_5 = A("5 minutes on high", 321.5);
gap(19, split((t) => W(t), C("w02_wok_humea", t_empty - 0.6), t_empty), (t) => [
  <NoCard key="ns" t={t} at={me(19) + 0.1} x={960} y={220} out={t_empty - 0.2} txt="THIN NON-STICK PAN" w={640} />,
  <Sello key="bo" t={t} at={t_boil} text="BOILING, NOT FRYING" x={960} y={860} out={t_empty - 0.2} rot={-5} size={84} />,
  <Medida key="5m" t={t} at={t_5} out={ms(20) + 0.3} x={1400} y={320} big="5 MIN" sub="ON HIGH · EMPTY" size={160} />,
]);
shot(me(19) - 0.7, t_empty, VW.casa, push(VW.casa, 0.2));
st(me(19) - 1, t_empty, () => ({ homeFire: 1, casaRice: 0.4 }));
// ---- 20 · "Third… Small batches. In the restaurant I cooked 4 orders in one wok, because I had a jet engine."
const t_third = A("third and this is the one", 332.6), t_small = A("small batches", 335.7), t_4o = A("4 orders in one wok", 338.5);
shot(me(20) - 0.7, ms(21) + 0.4, VW.wokLow, push(VW.wokLow, 0.15));
st(me(20) - 1, ms(21) + 0.5, () => ({ fire: 1, heatGlow: 1, smoke: 0.3, arroz: { rice: 0 } }));
gap(20, (t) => W(t), (t) => [
  <Tag key="hg" t={t} at={me(20) + 0.1} x={760} y={560} dx={-240} dy={-220} text="LITTLE SMOKE" sub="NOW IT'S READY" col={K.gold} out={t_third - 0.1} size={52} />,
  <Comanda key="sb" t={t} at={t_third} out={t_4o - 0.2} n={3} head="CHEAT" title={["small batches"]} />,
  <Medida key="4o" t={t} at={t_4o} out={ms(21) + 0.3} x={1380} y={320} big="4 ORDERS" sub="ONE WOK · JET ENGINE" size={130} />,
]);
// ---- 21 · "feeding 6 people, cook 3 times. 4 minutes each time. It's worth it. When you crowd the pan, everything steams. Steam is the enemy."
const t_6p = A("feeding 6 people", 348.0), t_4m = A("4 minutes each time", 351.1), t_crowd = A("when you crowd the pan", 354.3), t_enemy = A("steam is the enemy", 357.4);
shot(me(21) - 0.7, t_crowd, VW.wokTop, push(VW.wokTop, 0.1));
shot(t_crowd + 0.01, ms(22) + 0.4, VW.wokTop, push(VW.wokTop, 0.25, -4));
st(me(21) - 1, ms(22) + 0.5, (t) => ({ fire: 0.6, arroz: { rice: t < t_crowd ? 0.4 : 1, clump: 0.4 * win(t, t_crowd, t_crowd + 1), wet: win(t, t_crowd, t_crowd + 1), brown: t < t_crowd ? 0.5 : 0 }, smoke: t < t_crowd ? 0.3 : 1 }));
gap(21, (t) => W(t), (t) => [
  <Medida key="6p" t={t} at={t_6p} out={t_4m - 0.1} x={1400} y={300} big="6 PEOPLE = 3×" sub="TWO PLATES EACH TIME" size={110} />,
  <Medida key="4m" t={t} at={t_4m} out={t_crowd - 0.1} x={1400} y={300} big="4 MIN" sub="EACH TIME · WORTH IT" size={150} />,
  <Sello key="se" t={t} at={t_enemy} text="STEAM IS THE ENEMY" x={960} y={860} out={ms(22) + 0.3} rot={-5} size={90} />,
]);
// ---- 22 · SECRET #3 WOK HEI · la llama sube por los costados, humo y chispas · "a little bit like barbecue"
const t_s3 = A("secret number 3", 362.8), t_bbq = A("like barbecue", 369.5), t_never2 = A("you can never get it at home", 371.8), t_cant = A("in cantonese we say", 375.1);
shot(me(22) - 0.7, ms(23) + 0.4, VW.wokLow, push(VW.wokLow, 0.2, -4), 0.05);
st(me(22) - 1, ms(23) + 0.5, (t) => ({ fire: 1, smoke: 0.8, hei: 1, arroz: { rice: 1, brown: 0.8, toss: 0.6 * (0.5 + 0.5 * Math.sin(t * 1.2)) } }));
gap(22, (t) => W(t), (t) => [
  <Comanda key="c3" t={t} at={Math.max(me(22) - 0.3, t_s3)} out={me(22) + 2.6} n={3} head="SECRET" title={["wok hei", "the breath of the wok"]} />,
  <Tag key="bq" t={t} at={t_bbq} x={960} y={420} dx={260} dy={-200} text="SMOKY" sub="LIKE BARBECUE" col={K.gold} out={t_never2} size={58} />,
  <Pensado key="nh" t={t} at={t_never2} out={t_cant - 0.1} x={960} y={880} text="…never at home" size={96} />,
  <Medida key="wh" t={t} at={t_cant} out={ms(23) + 0.3} x={960} y={250} big="WOK HEI" sub="THE BREATH OF THE WOK" size={170} />,
]);
// ---- 23 · "tiny drops of oil fly up, they touch the flame and they burn for a split second. That smoke falls back on the rice."
const t_drops = A("tiny drops of oil", 384.0), t_touch = A("they touch the flame", 385.8), t_split = A("for a split second", 387.4), t_falls = A("that smoke falls back", 388.7);
shot(me(23) - 0.7, ms(24) + 0.4, VW.wok, push(VW.wok, 0.3, -6));
st(me(23) - 1, ms(24) + 0.5, (t) => ({ fire: 1, smoke: 0.6 + 0.4 * win(t, t_falls, t_falls + 1), hei: 1, arroz: { rice: 1, brown: 0.7, toss: 0.4 } }));
gap(23, (t) => W(t), (t) => [
  <Pasos key="oi" t={t} out={ms(24) + 0.3} items={[{ at: Math.max(me(23), t_drops), txt: "OIL DROPS FLY UP" }, { at: t_touch, txt: "TOUCH THE FLAME" }, { at: t_split, txt: "BURN · A SPLIT SECOND" }, { at: t_falls, txt: "SMOKE ON THE RICE" }]} y={880} size={38} />,
]);
// ---- 24 · el tostado (macro dorado) · "smoke + browning = wok hei" · "Friday night, 200 orders"
const t_brown = A("that is the browning", 399.5), t_both = A("both together", 401.7), t_fri = A("friday night in the restaurant", 404.3), t_200 = A("200 orders", 406.3);
shot(me(24) - 0.7, t_fri, VW.macroC, push(VW.macroC, 0.2));
st(me(24) - 1, t_fri, (t) => ({ macro: { on: 1, wet: 0, split: 1, crystal: 0, toast: win(t, me(24), t_brown + 0.5) } }));
gap(24, split((t) => W(t), C("a02_tickets", t_fri - 0.6), t_fri), (t) => [
  <Tag key="ed" t={t} at={me(24) + 0.1} x={960} y={540} dx={-260} dy={-220} text="TOASTED" sub="LIKE THE EDGE OF BREAD" col={K.gold} out={t_brown} size={52} />,
  <Pasos key="eq" t={t} out={t_fri - 0.1} items={[{ at: t_brown, txt: "SMOKE" }, { at: t_brown + 0.3, txt: "+ BROWNING" }, { at: t_both, txt: "= WOK HEI" }]} y={860} size={56} />,
  <Medida key="2h" t={t} at={t_200} out={ms(25) + 0.3} x={1400} y={300} big="200 ORDERS" sub="FRIDAY NIGHT" size={130} />,
]);
// ---- 25 · la cicatriz "1991, a Friday" → la hora pico
const t_mark = A("this mark on my arm", 414.6), t_1991 = A("1991 a friday", 417.8), t_every = A("every old cook has these", 420.3), t_best = A("the best of the whole week", 423.8);
gap(25, split(C("a03_cicatriz", me(25) - 0.7), C("a04_hora_pico", t_every - 0.6), t_every), (t) => [
  <Tag key="mk" t={t} at={t_mark} x={960} y={560} dx={280} dy={-200} text="THAT IS THE WOK" col={K.gold} out={t_1991 + 1.2} size={56} />,
  <Pensado key="91" t={t} at={t_1991} out={t_every - 0.1} x={600} y={220} text="1991, a Friday." size={110} />,
  <Medida key="bw" t={t} at={t_best} out={ms(26) + 0.3} x={1400} y={300} big="BEST OF THE WEEK" sub="FRIDAY FRIED RICE" size={96} />,
]);
// ---- 26 · "your stove has no big flame coming up the side, so don't toss like a crazy person… the rice comes down cold"
const t_toss = A("don t toss like a crazy person", 434.5), t_air = A("throwing the rice in the air", 438.5), t_cold = A("the rice comes down cold", 441.1);
shot(me(26) - 0.7, ms(27) + 0.4, VW.wok, push(VW.wok, 0.1));
st(me(26) - 1, ms(27) + 0.5, (t) => ({ fire: 0.35, smoke: 0.3, arroz: { rice: 1, brown: 0.3, toss: win(t, t_air, t_air + 0.4) } }));
gap(26, split(C("w07_wok_hei", me(26) - 0.7), (t) => W(t), t_toss - 0.2), (t) => [
  <Tag key="nf" t={t} at={me(26) + 0.1} x={960} y={700} dx={-280} dy={120} text="NO BIG FLAME" sub="AT HOME" col="#8fd6ff" out={t_toss - 0.1} size={56} />,
  <NoCard key="ts" t={t} at={t_toss} x={960} y={220} out={ms(27) + 0.3} txt="TOSSING LIKE CRAZY" w={640} />,
]);
// ---- 27 · "At home, you do the opposite. Spread… press… leave it alone. Count to 20. Listen… like rain on a tin roof."
const t_opp = A("you do the opposite", 446.5), t_spread = A("spread the rice flat", 448.3), t_press = A("press it down gently", 450.2), t_leave = A("leave it alone", 452.5), t_c20 = A("count to 20", 453.8), t_rain = A("like rain on a tin roof", 457.0);
gap(27, C("w06_presionar", me(27) - 0.7), (t) => [
  <Pasos key="sp" t={t} out={t_c20 - 0.1} items={[{ at: t_spread, txt: "SPREAD" }, { at: t_press, txt: "PRESS" }, { at: t_leave, txt: "LEAVE IT ALONE" }]} y={860} size={52} />,
  <Cuenta key="20" t={t} at={t_c20} dur={4.0} to={20} out={ms(28) + 0.3} x={1500} y={420} label="LISTEN" />,
  <Pensado key="rn" t={t} at={t_rain} out={ms(28) + 0.3} x={760} y={220} text="crack… pop… like rain on a tin roof" size={72} col={K.gold} />,
]);
// ---- 28 · el arroz aplastado y tostándose · "toasted edges… crispy grains" · "which restaurant you ordered from"
const t_edges = A("the toasted edges", 466.4), t_crisp = A("little crispy grains", 468.0), t_which = A("which restaurant you ordered from", 475.5);
shot(me(28) - 0.7, ms(29) + 0.4, VW.wokTop, push(VW.wokTop, 0.3, -6));
st(me(28) - 1, ms(29) + 0.5, (t) => ({ fire: 0.45, smoke: 0.4, hei: 0.25, arroz: { rice: 0.55, press: 1, brown: 0.3 + 0.5 * win(t, me(28), ms(29)) } }));
gap(28, (t) => W(t), (t) => [
  <Tag key="te" t={t} at={t_edges} x={900} y={560} dx={-260} dy={-200} text="TOASTED EDGES" col={K.gold} out={ms(29) + 0.3} size={56} />,
  <Tag key="cg" t={t} at={t_crisp} x={1040} y={620} dx={260} dy={150} text="CRISPY GRAINS" col={K.gold} out={ms(29) + 0.3} size={56} />,
]);
// ---- 29 · el aceite: maní, 450°F · aceite de oliva NO, manteca NO
const t_peanut = A("use peanut oil", 479.0), t_450 = A("450 degrees", 484.4), t_olive = A("olive oil", 487.0), t_butter = A("butter", 489.7);
gap(29, C("w03_aceite", me(29) - 0.7), (t) => [
  <Pensado key="wr" t={t} at={me(29) + 0.1} out={t_peanut - 0.1} x={960} y={220} text="…which restaurant did you order from?" size={74} />,
  <SiCard key="pn" t={t} at={t_peanut} x={600} y={220} out={ms(30) + 0.3} txt="PEANUT OIL" w={460} />,
  <Medida key="45" t={t} at={t_450} out={t_olive - 0.1} x={1380} y={320} big="450°F" sub="BEFORE IT BURNS" size={170} />,
  <NoCard key="ol" t={t} at={t_olive} x={1180} y={420} out={ms(30) + 0.3} txt="EXTRA-VIRGIN OLIVE OIL" w={680} />,
  <NoCard key="bu" t={t} at={t_butter} x={1180} y={600} out={ms(30) + 0.3} txt="BUTTER" w={360} />,
]);
// ---- 30 · "two tablespoons of oil for two cups of rice… oil at the bottom of the plate, you use too much" → SECRET #4
const t_2t = A("two tablespoons of oil", 491.5), t_greasy = A("should not be greasy", 495.5), t_bottom = A("oil at the bottom of the plate", 498.0), t_s4 = A("secret number four", 504.2);
shot(me(30) - 0.7, ms(31) + 0.4, VW.cajas, push(VW.cajas, 0.2));
st(me(30) - 1, ms(31) + 0.5, () => ({ fire: 0.4 }));
gap(30, (t) => W(t), (t) => [
  <Medida key="2t" t={t} at={Math.max(me(30), t_2t)} out={t_greasy - 0.1} x={1400} y={300} big="2 TBSP OIL" sub="FOR 2 CUPS OF RICE" size={120} />,
  <NoCard key="gr" t={t} at={t_greasy} x={960} y={250} out={t_s4 - 0.2} txt="GREASY" w={420} />,
  <Tag key="ob" t={t} at={t_bottom} x={1100} y={640} dx={-280} dy={150} text="OIL ON THE PLATE?" sub="TOO MUCH" col={K.gold} out={t_s4 - 0.2} size={52} />,
  <Comanda key="c4" t={t} at={t_s4} out={ms(31) + 2.0} n={4} head="SECRET" title={["the egg goes in first", "and comes out first"]} />,
]);
// ---- 31 · "Mr Lau slapped the spatula out of my hand. Twice. The egg is not a sauce."
const t_slap = A("slapped the spatula", 510.5), t_sauce = A("the egg is not a sauce", 516.0), t_how = A("here is how we did it", 518.3);
shot(me(31) - 0.7, ms(32) + 0.4, VW.wok, push(VW.wok, 0.15));
st(me(31) - 1, ms(32) + 0.5, () => ({ fire: 0.4, arroz: { rice: 0.8, wet: 0.6 }, egg: 1, eggBrown: 0 }));
gap(31, (t) => W(t), (t) => [
  <Tag key="eg" t={t} at={me(31) + 0.1} x={960} y={560} dx={-280} dy={-200} text="EGG ON TOP" sub="MY FIRST WEEK" col={K.red} out={t_slap + 1.5} size={54} />,
  <Fortuna key="sa" t={t} at={t_sauce - 0.2} out={ms(32) + 0.6} text="The egg is not a sauce." who="MR. LAU" y={860} size={60} />,
]);
// ---- 32 · los huevos: cuente hasta 5, cuajos grandes y blandos, afuera al 70%
const t_c5 = A("count to five", 524.5), t_curds = A("big soft curds", 527.0), t_70 = A("70 cooked", 534.5), t_later = A("finish cooking later", 535.4);
gap(32, C("w04_huevo", me(32) - 0.7), (t) => [
  <Cuenta key="c5" t={t} at={Math.max(me(32), t_c5)} dur={2.4} to={5} out={t_curds - 0.1} x={1500} y={400} label="COUNT TO 5" />,
  <Tag key="cu" t={t} at={t_curds} x={960} y={600} dx={-280} dy={-220} text="BIG SOFT CURDS" col={K.gold} out={t_70 - 0.2} size={56} />,
  <Medida key="70" t={t} at={t_70 - 0.4} out={ms(33) + 0.3} x={1400} y={320} big="70%" sub="OUT ON A PLATE" size={170} />,
]);
// ---- 33 · "If you pour it raw on top of the rice… wet again" · "the golden fried rice… every grain yellow"
const t_raw = A("pour it raw on top", 542.2), t_wet = A("makes the rice wet again", 545.5), t_gold = A("the golden fried rice", 550.5);
shot(me(33) - 0.7, ms(34) + 0.4, VW.wokTop, push(VW.wokTop, 0.2));
st(me(33) - 1, ms(34) + 0.5, (t) => ({ fire: 0.5, arroz: { rice: 1, wet: win(t, t_raw, t_wet), brown: 0, clump: 0.5 * win(t, t_raw, t_wet) }, egg: t < t_gold ? 1 : 0, smoke: 0.5 }));
gap(33, (t) => W(t), (t) => [
  <NoCard key="rr" t={t} at={me(33) + 0.1} x={960} y={220} out={t_raw - 0.2} txt="RUBBER CRUMBS" w={560} />,
  <NoCard key="rw" t={t} at={t_raw} x={960} y={220} out={t_gold - 0.2} txt="RAW EGG ON THE RICE" w={700} />,
  <Tag key="go" t={t} at={t_gold} x={960} y={560} dx={-300} dy={-200} text="GOLDEN FRIED RICE" sub="YOLK IN THE COLD RICE" col={K.gold} out={ms(34) + 0.3} size={52} />,
]);
// ---- 34 · "that's a different video, today we do the take-out way" → SECRET #5 THE TWO SOY SAUCES
const t_diff = A("it s a different video", 560.7), t_s5 = A("the two soy sauces", 565.0), t_know = A("really did not want people to know", 568.6);
shot(me(34) - 0.7, ms(35) + 0.4, VW.soja, push(VW.soja, 0.2, -2));
st(me(34) - 1, ms(35) + 0.5, (t) => ({ glowSoja: t > t_s5 ? 3 : 0 }));
gap(34, (t) => W(t), (t) => [
  <Pensado key="df" t={t} at={me(34) + 0.2} out={t_s5 - 0.6} x={960} y={220} text="that one is another video" size={86} />,
  <Comanda key="c5" t={t} at={t_s5 - 0.5} out={t_know + 1.6} n={5} head="SECRET" title={["the two", "soy sauces"]} />,
]);
// ---- 35 · un solo frasco: salado y pálido → más soja → mojado, salado, papilla marrón · "The restaurant uses two."
const t_pale = A("still pale", 575.6), t_keep = A("you keep pouring", 577.0), t_fam = A("sound familiar", 582.2), t_two = A("the restaurant uses two", 582.9), t_light = A("light soy sauce for the salt", 585.2), t_dark = A("dark soy sauce for the colour", 588.0);
shot(me(35) - 0.7, t_two, VW.wokTop, push(VW.wokTop, 0.15));
shot(t_two + 0.01, ms(36) + 0.4, VW.soja, push(VW.soja, 0.15));
st(me(35) - 1, ms(36) + 0.5, (t) => t < t_two
  ? { fire: 0.4, soyPour: win(t, me(35), me(35) + 0.3) * (1 - win(t, t_fam - 0.3, t_fam)), soyDark: 0, soyEdge: 0, smoke: 0.6, arroz: { rice: 1, wet: win(t, t_keep, t_keep + 2), brown: 0.15 + 0.45 * win(t, t_keep, t_keep + 3), clump: 0.6 * win(t, t_keep, t_keep + 3) } }
  : { glowSoja: t < t_light ? 3 : t < t_dark ? 1 : 2 });
gap(35, (t) => W(t), (t) => [
  <Tag key="sp" t={t} at={me(35) + 0.2} x={960} y={600} dx={-280} dy={-220} text="TOO SALTY" sub="BUT STILL PALE" col={K.gold} out={t_keep - 0.1} size={54} />,
  <Sello key="wm" t={t} at={t_keep + 1.5} text="WET · SALTY · MUSH" x={960} y={860} out={t_fam + 0.4} rot={-5} size={84} />,
  <Pensado key="fm" t={t} at={t_fam} out={t_two - 0.1} x={960} y={220} text="sound familiar?" size={100} />,
  <Tag key="lt" t={t} at={t_light} x={760} y={480} dx={-260} dy={-200} text="LIGHT" sub="SALT & FLAVOR" col={K.gold} out={ms(36) + 0.3} size={60} />,
  <Tag key="dk" t={t} at={t_dark} x={1160} y={480} dx={260} dy={-200} text="DARK" sub="COLOR" col={K.gold} out={ms(36) + 0.3} size={60} />,
]);
// ---- 36 · "One teaspoon of dark soy makes the whole pan… that take out brown. For two cups: 1 tbsp light + 1 tsp dark."
const t_1tsp = A("one teaspoon of dark soy", 596.4), t_recipe = A("so for two cups of rice", 601.0);
gap(36, C("w09_dos_sojas", me(36) - 0.7), (t) => [
  <Tag key="ml" t={t} at={me(36) + 0.1} x={1160} y={480} dx={260} dy={-200} text="LIKE MOLASSES" sub="THICK · A LITTLE SWEET" col={K.gold} out={t_1tsp - 0.1} size={52} />,
  <Medida key="1t" t={t} at={t_1tsp} out={t_recipe - 0.1} x={1400} y={300} big="1 TSP DARK" sub="THE WHOLE PAN, TAKEOUT BROWN" size={120} />,
  <Libreta key="rc" t={t} out={ms(37) + 1.0} x={1430} y={170} title="2 CUPS OF RICE" rows={[{ at: t_recipe + 0.6, amt: "1 tbsp", item: "light soy" }, { at: t_recipe + 1.6, amt: "1 tsp", item: "dark soy" }]} w={560} />,
]);
// ---- 37 · la caja blanca · "Where you pour it. Never in the middle. On the hot side of the pan, on the metal, around the edge."
const t_box = A("the colour you see in the white box", 607.4), t_where = A("where you pour it", 612.2), t_mid = A("never in the middle", 613.1), t_edge = A("on the hot side of the pan", 615.7);
shot(me(37) - 0.7, t_where, VW.cajas, push(VW.cajas, 0.25, -4));
shot(t_where + 0.01, ms(38) + 0.4, VW.wokTop, push(VW.wokTop, 0.2));
st(me(37) - 1, ms(38) + 0.5, (t) => t < t_where ? { fire: 0.4 } : { fire: 0.9, smoke: 0.5, soyPour: win(t, t_edge, t_edge + 0.3), soyDark: 1, soyEdge: 1, arroz: { rice: 0.8, brown: 0.5 + 0.3 * win(t, t_edge, ms(38)) } });
gap(37, (t) => W(t), (t) => [
  <Tag key="bx" t={t} at={me(37) + 0.1} x={1000} y={560} dx={-260} dy={-220} text="THE WHITE BOX" sub="THAT COLOR" col={K.gold} out={t_where - 0.1} size={54} />,
  <NoCard key="md" t={t} at={t_mid} x={960} y={220} out={t_edge - 0.1} txt="IN THE MIDDLE" w={520} />,
  <Tag key="ed" t={t} at={t_edge} x={1150} y={560} dx={260} dy={-200} text="ON THE HOT METAL" sub="AROUND THE EDGE" col={K.gold} out={ms(38) + 0.3} size={54} />,
]);
// ---- 38 · el chisporroteo en el borde · "That sizzle is flavour" · en el medio sólo moja → SECRET #6 LOS POLVOS BLANCOS
const t_sizz = A("that sizzle is flavour", 627.1), t_inmid = A("pour it on the rice in the middle", 628.7), t_s6 = A("secret number six", 632.3), t_row = A("a row of containers", 636.0);
gap(38, split(C("w08_soja_borde", me(38) - 0.7), (t) => W(t), t_s6 + 1.2), (t) => [
  <Sello key="sz" t={t} at={t_sizz} text="SIZZLE = FLAVOR" x={960} y={860} out={t_inmid - 0.1} rot={-5} size={90} />,
  <NoCard key="im" t={t} at={t_inmid} x={960} y={220} out={t_s6 - 0.2} txt="IN THE MIDDLE = WET RICE" w={760} />,
  <Comanda key="c6" t={t} at={t_s6} out={t_row + 0.6} n={6} head="SECRET" title={["the little", "white powders"]} />,
]);
shot(t_s6 + 0.6, ms(39) + 0.4, VW.polvos, push(VW.polvos, 0.15));
st(t_s6 + 0.5, ms(39) + 0.5, () => ({ glowPolvo: 5 }));
// la toma de la soja en el borde arranca en el tramo 37 (portal del borde) y sigue acá
// ---- 39 · "People make a face when I say MSG. MSG is in tomatoes, in parmesan cheese, in mushrooms. The same savoury taste."
const t_face = A("people make a face", 643.1), t_tom2 = A("msg is in tomatoes", 646.8), t_parm = A("parmesan cheese", 649.0), t_mush2 = A("in mushrooms", 650.3), t_sav = A("the same savoury taste", 651.1);
shot(me(39) - 0.7, ms(40) + 0.4, VW.polvos, push(VW.polvos, 0.3, -4));
st(me(39) - 1, ms(40) + 0.5, (t) => ({ glowPolvo: t < t_face ? 5 : 4 }));
gap(39, (t) => W(t), (t) => [
  <Pensado key="fc" t={t} at={t_face} out={t_tom2 - 0.1} x={960} y={220} text="“MSG?!”" size={130} />,
  <Chips key="um" t={t} at={t_tom2} items={["TOMATOES", "PARMESAN", "MUSHROOMS"]} out={ms(40) + 0.3} y={800} />,
  <Medida key="sv" t={t} at={t_sav} out={ms(40) + 0.3} x={960} y={260} big="SAVORY" sub="THE SAME TASTE" size={150} />,
]);
// ---- 40 · "for 2 cups of rice, a quarter teaspoon of MSG, a quarter teaspoon of sugar and a good pinch of white pepper… not black"
const t_qmsg = A("a quarter teaspoon", 659.0), t_qsug = A("quarter teaspoon of sugar", 661.2), t_pinch = A("good pinch", 662.9), t_black = A("white pepper not black", 664.4), t_smell = A("the smell of a chinese kitchen", 666.5);
gap(40, C("w10_polvos", me(40) - 0.7), (t) => [
  <Libreta key="pw" t={t} out={ms(41) + 0.3} x={1430} y={150} title="2 CUPS OF RICE" rows={[{ at: t_qmsg, amt: "¼ tsp", item: "MSG" }, { at: t_qsug, amt: "¼ tsp", item: "sugar" }, { at: t_pinch, amt: "pinch", item: "white pepper" }]} w={560} />,
  <NoCard key="bp" t={t} at={t_black} x={540} y={300} out={t_smell + 1.5} txt="BLACK PEPPER" w={480} />,
  <Pensado key="sm" t={t} at={t_smell} out={ms(41) + 0.3} x={620} y={880} text="the smell of a Chinese kitchen" size={76} col={K.gold} />,
]);
// ---- 41 · "half a teaspoon of chicken bouillon powder… the sugar… rounds the salt like a little cushion… taste first, then salt"
const t_bou = A("chicken bouillon", 673.9), t_cush = A("like a little cushion", 680.9), t_tf = A("taste first", 685.8);
shot(me(41) - 0.7, ms(42) + 0.4, VW.polvos, push(VW.polvos, 0.2));
st(me(41) - 1, ms(42) + 0.5, (t) => ({ glowPolvo: t < t_cush - 1 ? 4 : t < t_tf ? 2 : 1, glowSoja: t >= t_tf - 1 ? 3 : 0 }));
gap(41, (t) => W(t), (t) => [
  <SiCard key="bo" t={t} at={me(41) + 0.1} x={960} y={220} out={t_cush - 0.4} txt="½ TSP CHICKEN BOUILLON" w={720} />,
  <Pensado key="cu" t={t} at={t_cush} out={t_tf - 0.1} x={960} y={880} text="sugar = a little cushion for the salt" size={74} />,
  <Pasos key="tf" t={t} out={ms(42) + 0.3} items={[{ at: t_tf - 0.3, txt: "SOY IS ALREADY SALTY" }, { at: t_tf, txt: "TASTE FIRST" }, { at: t_tf + 0.6, txt: "THEN SALT" }]} y={860} size={44} />,
]);
// ---- 42 · SECRET #7 LOS ÚLTIMOS 10 SEGUNDOS · aceite de sésamo + verdeo fuera del fuego
const t_s7 = A("secret number seven", 688.1), t_ses = A("toasted sesame oil", 696.3), t_offh = A("off the heat", 699.0), t_forsm = A("is for smell", 700.5);
gap(42, C("w13_sesamo", me(42) - 0.7), (t) => [
  <Comanda key="c7" t={t} at={Math.max(me(42) - 0.4, t_s7)} out={me(42) + 2.2} n={7} head="SECRET" title={["the last", "10 seconds"]} />,
  <Libreta key="ls" t={t} out={ms(43) + 0.3} x={1430} y={170} title="FIRE OFF" rows={[{ at: Math.max(me(42) + 2.4, t_ses), amt: "½ tsp", item: "sesame oil" }, { at: Math.max(me(42) + 3.0, t_offh), amt: "+", item: "green scallions" }]} w={560} />,
  <Tag key="fs" t={t} at={t_forsm} x={760} y={560} dx={-240} dy={-200} text="FOR SMELL" sub="NOT FOR COOKING" col={K.gold} out={ms(43) + 0.3} size={54} />,
]);
// ---- 43 · "the white part goes in early with the oil… the green part goes in at the very end"
const t_white = A("the white part", 709.9), t_green = A("the green part goes in", 713.0);
shot(me(43) - 0.7, ms(44) + 0.4, VW.wokTop, push(VW.wokTop, 0.25));
st(me(43) - 1, ms(44) + 0.5, (t) => ({ fire: t < t_green ? 0.8 : 0, smoke: 0.4, arroz: { rice: t < t_green ? 0 : 1, brown: 1 }, whites: win(t, t_white, t_white + 0.8), greens: win(t, t_green + 0.6, t_green + 1.4), egg: t < t_green ? 0 : 1, eggBrown: 0.3 }));
gap(43, (t) => W(t), (t) => [
  <NoCard key="bt" t={t} at={me(43) + 0.1} x={960} y={220} out={t_white - 0.2} txt="BITTER IN SECONDS" w={600} />,
  <Tag key="wp" t={t} at={t_white} x={960} y={560} dx={-280} dy={-220} text="WHITE PART" sub="EARLY · WITH THE OIL" col={K.gold} out={t_green} size={54} />,
  <Tag key="gp" t={t} at={t_green + 0.4} x={960} y={560} dx={280} dy={-220} text="GREEN PART" sub="THE VERY END" col="#8fe08a" out={ms(44) + 0.3} size={54} />,
]);
// ---- 44 · la caja con verdeo marrón triste: Mr. Lau la abrió, miró y la cerró · "now I show you the whole thing"
const t_closed = A("closed it again", 726.9), t_say = A("he didn t have to say anything", 728.0), t_show = A("now i show you the whole thing", 730.3);
gap(44, split(C("w14_caja", me(44) - 0.7), C("m01_ingredientes", t_show - 0.6), t_show), (t) => [
  <Tag key="ss" t={t} at={me(44) + 0.1} x={960} y={560} dx={-280} dy={-220} text="BROWN, SAD SCALLIONS" col={K.red} out={t_closed} size={54} />,
  <Pensado key="sa" t={t} at={t_say} out={t_show - 0.1} x={960} y={880} text="…he didn't have to say anything." size={84} />,
  <Comanda key="wt" t={t} at={t_show} out={ms(45) + 0.3} n="2 PLATES" head="START TO FINISH" title={["the whole thing"]} />,
]);
// ---- 45 · la lista: 2 tazas de arroz frío, 2 huevos, ½ taza de arvejas y zanahoria secadas con papel → "a hidden mistake"
const t_2c = A("two cups of cold", 737.3), t_2e = A("two eggs beaten with a", 740.5), t_peas = A("frozen peas", 745.1), t_towel = A("paper towel", 748.4), t_hid = A("this is a hidden mistake", 749.6), t_wetv = A("wet frozen vegetables", 751.6);
gap(45, split(C("m01_ingredientes", t_show - 1.2), C("w11_arvejas", t_peas - 0.6), t_peas), (t) => [
  <Libreta key="li" t={t} out={ms(46) + 0.3} x={1440} y={120} title="TWO PLATES" rows={[{ at: Math.max(me(45), t_2c), amt: "2 cups", item: "cold day-old rice" }, { at: Math.max(me(45) + 0.6, t_2e), amt: "2", item: "eggs + pinch of salt" }, { at: t_peas, amt: "½ cup", item: "peas & carrots" }]} w={600} sc={0.9} />,
  <Tag key="tw" t={t} at={t_towel} x={760} y={600} dx={-240} dy={150} text="DRY THEM" sub="ON A PAPER TOWEL" col={K.gold} out={t_hid + 0.6} size={54} />,
  <Sello key="hm" t={t} at={t_hid} text="HIDDEN MISTAKE" x={700} y={300} out={ms(46) + 0.3} rot={-6} size={90} />,
]);
// ---- 46 · ajo, carne que sobró
const t_garl = A("one small clove of garlic", 761.6), t_meat = A("a little leftover meat", 765.1), t_chk = A("chicken ham roast pork", 767.2);
gap(46, split(C("h03_ajo", me(46) - 0.7), C("h02_cerdo", t_meat - 0.6), t_meat), (t) => [
  <Libreta key="l2" t={t} out={ms(47) + 0.3} x={1440} y={120} title="TWO PLATES" rows={[{ at: me(46) - 0.2, amt: "2", item: "scallions, white & green" }, { at: t_garl, amt: "1", item: "small clove of garlic" }, { at: t_meat, amt: "½ cup", item: "leftover meat" }]} w={600} sc={0.9} />,
  <Chips key="mt" t={t} at={t_chk} items={["CHICKEN", "HAM", "ROAST PORK"]} out={ms(47) + 0.3} y={880} />,
]);
// ---- 47 · cocción en vivo (el mundo): aceite, huevos 5 s afuera, blancos del verdeo + ajo 10 s
const t_oil1 = A("one tablespoon of oil swirl it", 774.6), t_eggs = A("the eggs 5 seconds", 776.5), t_out = A("out on the plate", 778.5), t_whites = A("the scallion whites", 782.5);
shot(me(47) - 0.7, ms(48) + 0.4, VW.wok, push(VW.wok, 0.2));
st(me(47) - 1, ms(48) + 0.5, (t) => ({ fire: 1, smoke: 0.5, heatGlow: 1 - win(t, t_oil1, t_oil1 + 1), egg: win(t, t_eggs, t_eggs + 0.4) * (1 - win(t, t_out, t_out + 0.4)), eggPlate: win(t, t_out, t_out + 0.5), whites: win(t, t_whites, t_whites + 0.6) }));
gap(47, split((t) => W(t), C("w05_aromaticos", t_whites - 0.6), t_whites), (t) => [
  <Pasos key="k1" t={t} out={ms(48) + 0.3} items={[{ at: Math.max(me(47), t_oil1), txt: "1 TBSP OIL" }, { at: t_eggs, txt: "EGGS · 5 SEC" }, { at: t_out, txt: "OUT, STILL WET" }, { at: t_whites, txt: "WHITES + GARLIC · 10 SEC" }]} y={880} size={36} />,
]);
// ---- 48 · la carne 30 s, el arroz: extender, aplastar, 20 s, escuchar, dar vuelta, arvejas arriba
const t_rice2 = A("then the rice", 790.4), t_press2 = A("spread it press it", 791.2), t_crk = A("listen for the crackle", 793.9), t_turn = A("turn it press again", 795.5), t_pc = A("peas and carrots on top", 797.0);
shot(me(48) - 0.7, ms(49) + 0.4, VW.wokTop, push(VW.wokTop, 0.2));
st(me(48) - 1, ms(49) + 0.5, (t) => ({ fire: 1, smoke: 0.5, hei: 0.5, whites: 1, arroz: { rice: win(t, t_rice2 - 0.2, t_rice2 + 0.6), press: win(t, t_press2, t_press2 + 0.6), brown: 0.15 + 0.25 * win(t, t_crk, t_pc) }, peas: win(t, t_pc, t_pc + 0.8), eggPlate: 1 }));
gap(48, (t) => W(t), (t) => [
  <Pasos key="k2" t={t} out={ms(49) + 0.3} items={[{ at: Math.max(me(48), t_rice2), txt: "RICE" }, { at: t_press2, txt: "SPREAD · PRESS" }, { at: t_crk, txt: "20 SEC · LISTEN" }, { at: t_turn, txt: "TURN · PRESS" }, { at: t_pc, txt: "PEAS & CARROTS" }]} y={880} size={36} />,
]);
// ---- 49 · la soja en el borde, mezclar: "every grain the same color" · los polvos · "taste one grain"
const t_hear = A("hear that", 806.3), t_same3 = A("every grain the same", 809.8), t_pw = A("the powders", 811.8), t_one = A("taste one grain", 816.4);
shot(me(49) - 0.7, t_pw, VW.wokTop, push(VW.wokTop, 0.25, -4));
shot(t_pw + 0.01, ms(50) + 0.4, VW.wok, push(VW.wok, 0.1));
st(me(49) - 1, ms(50) + 0.5, (t) => ({ fire: 1, smoke: 0.7, hei: 0.6, whites: 1, peas: 1, eggPlate: 1, soyPour: win(t, me(49), me(49) + 0.3) * (1 - win(t, t_hear + 0.8, t_hear + 1.2)), soyDark: 1, soyEdge: 1, arroz: { rice: 1, brown: 0.4 + 0.6 * win(t, t_hear, t_same3 + 0.5), toss: 0.2 } }));
gap(49, (t) => W(t), (t) => [
  <Pensado key="ht" t={t} at={t_hear} out={t_same3 - 0.1} x={1300} y={220} text="hear that?" size={110} col={K.gold} />,
  <Tag key="sc" t={t} at={t_same3} x={900} y={560} dx={-260} dy={-200} text="EVERY GRAIN" sub="THE SAME COLOR" col={K.gold} out={t_pw - 0.1} size={56} />,
  <Chips key="pw" t={t} at={t_pw} items={["¼ TSP MSG", "SUGAR", "WHITE PEPPER"]} out={t_one} y={180} />,
  <Pensado key="tg" t={t} at={t_one} out={ms(50) + 0.3} x={960} y={220} text="taste one grain. Salt if it needs." size={80} />,
]);
// ---- 50 · el huevo vuelve, fuego apagado, sésamo, verdeo
const t_foff = A("fire off", 824.6), t_sesg = A("sesame oil the green", 825.8);
gap(50, C("w12_huevo_vuelve", me(50) - 0.7), (t) => [
  <Pasos key="k3" t={t} out={ms(51) + 0.3} items={[{ at: me(50) - 0.2, txt: "EGG BACK · BREAK IT UP" }, { at: Math.max(me(50) + 0.6, t_foff), txt: "FIRE OFF" }, { at: Math.max(me(50) + 1.2, t_sesg), txt: "SESAME + GREENS" }]} y={880} size={40} />,
]);
// ---- 51 · el resultado: 7 minutos · cada grano solo, un poco ahumado, marrón de takeout → LOS 3 ERRORES
const t_7m = A("seven minutes", 830.2), t_alone2 = A("every grain alone", 832.4), t_smk = A("a little smoky", 833.9), t_tb = A("take out brown", 835.0), t_3m = A("the three mistakes", 839.9);
gap(51, C("w15_resultado", me(51) - 0.7), (t) => [
  <Medida key="7m" t={t} at={Math.max(me(51) - 0.3, t_7m)} out={t_alone2 + 0.2} x={1400} y={300} big="7 MIN" sub="START TO FINISH" size={160} />,
  <Pasos key="rs" t={t} out={t_3m - 0.2} items={[{ at: t_alone2, txt: "EVERY GRAIN ALONE" }, { at: t_smk, txt: "A LITTLE SMOKY" }, { at: t_tb, txt: "TAKEOUT BROWN" }]} y={880} size={44} />,
  <Comanda key="3m" t={t} at={t_3m} out={ms(52) + 0.3} n="3" head="MISTAKES" title={["I see them", "every time"]} />,
]);
// ---- 52 · ERROR 1: demasiada soja
const t_m1 = A("mistake number one", 845.7), t_paste = A("brown paste", 857.0), t_fix = A("one tablespoon light one teaspoon dark for two cups", 858.5), t_more = A("a few drops more dark soy", 864.0), t_m2 = A("mistake number two", 867.6);
gap(52, C("x01_mucha_soja", me(52) - 0.7), (t) => [
  <NoCard key="m1" t={t} at={me(52) - 0.2} x={960} y={200} out={t_m2 - 0.2} txt="#1 · TOO MUCH SOY SAUCE" w={760} cross={me(52) + 0.6} />,
  <Libreta key="fx" t={t} out={t_m2 - 0.2} x={1440} y={330} title="FOR 2 CUPS" rows={[{ at: me(52) + 1.2, amt: "1 tbsp", item: "light" }, { at: me(52) + 1.8, amt: "1 tsp", item: "dark" }, { at: Math.max(me(52) + 2.6, t_more), amt: "+ drops", item: "dark, not light" }]} w={520} sc={0.9} />,
]);
// ---- 53 · ERROR 2: revolver todo el tiempo · "Press, wait, listen, turn." · la paciencia
const t_never3 = A("never touches the hot metal", 873.5), t_pwlt = A("press wait listen turn", 881.1), t_pat = A("patience is the secret ingredient", 884.1);
gap(53, C("x02_revolver", me(53) - 0.7), (t) => [
  <NoCard key="m2" t={t} at={me(53) - 0.2} x={960} y={200} out={t_pwlt - 0.2} txt="#2 · STIRRING ALL THE TIME" w={800} cross={me(53) + 0.6} />,
  <Pasos key="pw" t={t} out={t_pat - 0.2} items={[{ at: t_pwlt, txt: "PRESS" }, { at: t_pwlt + 0.5, txt: "WAIT" }, { at: t_pwlt + 1.0, txt: "LISTEN" }, { at: t_pwlt + 1.5, txt: "TURN" }]} y={860} size={56} />,
  <Fortuna key="pt" t={t} at={t_pat - 0.2} out={ms(54) + 0.6} text="Patience is the secret ingredient nobody sells you." y={840} size={48} />,
]);
// ---- 54 · ERROR 3: todo junto · "rice stew" · "Everything goes in its own time."
const t_stew = A("you made a rice stew", 897.5), t_own = A("everything goes in its own time", 900.9);
gap(54, C("x03_todo_junto", me(54) - 0.7), (t) => [
  <NoCard key="m3" t={t} at={me(54) - 0.2} x={960} y={200} out={t_own - 0.2} txt="#3 · EVERYTHING AT ONCE" w={760} cross={me(54) + 0.6} />,
  <Sello key="rs" t={t} at={t_stew} text="RICE STEW" x={960} y={820} out={t_own - 0.1} rot={-6} size={130} />,
  <Pensado key="ot" t={t} at={t_own} out={ms(55) + 0.3} x={960} y={840} text="everything in its own time" size={96} col={K.gold} />,
]);
// ---- 55 · el orden · "one for free" · arroz pegado: la sartén no estaba caliente
const t_free = A("one for free", 910.5), t_stick = A("if your rice is sticking", 913.0);
shot(me(55) - 0.7, ms(56) + 0.4, VW.wok, push(VW.wok, 0.2));
st(me(55) - 1, ms(56) + 0.5, (t) => ({ fire: 0.5, smoke: 0.4, arroz: { rice: 0.8, brown: 0.6, clump: t > t_stick ? 0.3 : 0 }, peas: 1, egg: 1, eggBrown: 0.3 }));
gap(55, (t) => W(t), (t) => [
  <Pasos key="or" t={t} out={t_free - 0.1} items={[{ at: me(55) - 0.4, txt: "EGG" }, { at: me(55) - 0.1, txt: "AROMATICS" }, { at: me(55) + 0.2, txt: "MEAT" }, { at: me(55) + 0.5, txt: "RICE" }, { at: me(55) + 0.8, txt: "VEG" }, { at: me(55) + 1.1, txt: "SAUCE ON THE EDGE" }, { at: me(55) + 1.4, txt: "FINISH" }]} y={860} size={32} />,
  <Comanda key="fr" t={t} at={t_free} out={t_stick + 0.2} n="+1" head="FREE" title={["because", "I like you"]} sc={0.9} />,
  <Tag key="sk" t={t} at={t_stick + 0.3} x={960} y={600} dx={-280} dy={-220} text="STICKING?" sub="PAN NOT HOT ENOUGH · OR TOO THIN" col={K.gold} out={ms(56) + 0.3} size={52} />,
]);
// ---- 56 · "Next time heat the empty pan longer." → la cuenta del takeout: $11-12 la caja… familia de 4… $50
const t_arith = A("now the arithmetic", 924.4), t_box2 = A("eleven twelve dollars", 930.0), t_tip = A("with the tip and the delivery", 933.1);
shot(me(56) - 0.7, ms(57) + 0.4, VW.cajas, push(VW.cajas, 0.2, -2));
st(me(56) - 1, ms(57) + 0.5, () => ({ fire: 0.4, tickets: 10 }));
gap(56, (t) => W(t), (t) => [
  <NoCard key="mo" t={t} at={me(56) + 0.1} x={960} y={220} out={t_arith - 0.2} txt="MORE OIL TO FIX IT" w={620} />,
  <Comanda key="ar" t={t} at={t_arith} out={t_box2 - 0.2} n="$" head="ARITHMETIC" title={["not complaining", "just math"]} sc={0.9} />,
  <Cuenta$ key="tk" t={t} out={ms(58) + 1.5} x={560} y={160} title="TAKEOUT" rows={[{ at: t_box2, item: "FRIED RICE", v: "$12" }, { at: t_box2 + 0.8, item: "× FAMILY OF 4", v: "$48" }]} total={{ at: ms(57) + 1, v: "~$50" }} rot={-2} />,
]);
// ---- 57 · en casa: arroz 30¢, 2 huevos 60¢, arvejas 40¢, verdeo 25¢, soja/aceite/polvos 30¢ → menos de $2
const t_30 = A("thirty cents", 943.7), t_60 = A("60 cents", 945.9), t_40 = A("40 cents", 948.4), t_25 = A("scallions 25", 949.8), t_30b = A("maybe 30 cents", 954.0), t_lt2 = A("less than two dollars", 955.8);
shot(me(57) - 0.7, ms(58) + 0.4, VW.cajas, push(VW.cajas, 0.3, -4));
st(me(57) - 1, ms(58) + 0.5, () => ({ fire: 0.4, tickets: 10 }));
gap(57, (t) => W(t), (t) => [
  <Cuenta$ key="tk2" t={t} out={ms(58) + 1.5} x={560} y={160} title="TAKEOUT" rows={[{ at: me(56) + 1, item: "FRIED RICE", v: "$12" }, { at: me(56) + 1.1, item: "× FAMILY OF 4", v: "$48" }]} total={{ at: me(56) + 1.2, v: "~$50" }} rot={-2} />,
  <Cuenta$ key="hm" t={t} out={ms(58) + 1.5} x={1360} y={110} title="HOME · 2 PLATES" col={K.jade} rows={[{ at: Math.max(me(57), t_30), item: "1 CUP RICE", v: "30¢" }, { at: t_60, item: "2 EGGS", v: "60¢" }, { at: t_40, item: "PEAS & CARROTS", v: "40¢" }, { at: t_25, item: "SCALLIONS", v: "25¢" }, { at: t_30b, item: "SOY · OIL · POWDERS", v: "30¢" }]} total={{ at: t_lt2, v: "< $2" }} rot={2} sc={0.92} />,
]);
// ---- 58 · domingo se cocina el arroz → lunes, miércoles, viernes arroz frito · "Mr Lau knew this math very well"
const t_sun = A("the rice you cook on sunday", 958.2), t_mon = A("monday wednesday and friday", 961.5), t_knew = A("knew this math very well", 964.5);
shot(me(58) - 0.7, ms(59) + 0.4, VW.bandejas, push(VW.bandejas, 0.2));
st(me(58) - 1, ms(59) + 0.5, () => ({ trays: 6, frio: 1 }));
gap(58, (t) => W(t), (t) => [
  <Semana key="sm" t={t} out={t_knew - 0.1} x={960} y={540} marks={[{ at: t_sun, d: 0, txt: "cook the rice", col: K.jade }, { at: t_mon, d: 1, txt: "fried rice", col: K.red }, { at: t_mon + 0.4, d: 3, txt: "fried rice", col: K.red }, { at: t_mon + 0.8, d: 5, txt: "fried rice", col: K.red }]} />,
  <Pensado key="kn" t={t} at={t_knew} out={ms(59) + 0.3} x={960} y={540} text="that's why he never told anybody." size={88} />,
]);
// ---- 59 · si sale mojado: mucha agua o tanda grande · menos agua, una taza menos · 2, 3 intentos
const t_tm = A("your rice had too much water", 972.5), t_nt = A("next time a little less water", 976.4), t_tries = A("two tries three tries", 981.7);
gap(59, C("w16_comparacion", me(59) - 0.7), (t) => [
  <Chips key="wh" t={t} at={t_tm} items={["TOO MUCH WATER", "OR BATCH TOO BIG"]} out={t_nt - 0.1} y={180} />,
  <Chips key="nx" t={t} at={t_nt} items={["A LITTLE LESS WATER", "ONE CUP LESS IN THE PAN"]} out={t_tries - 0.1} y={180} />,
  <Medida key="tr" t={t} at={t_tries} out={ms(60) + 0.3} x={960} y={300} big="2 – 3 TRIES" sub="AND YOU HAVE IT" size={140} />,
]);
// ---- 60 · "You are lucky. So this week, only two things." (el mundo entero)
const t_lucky = A("you are lucky", 990.5), t_two2 = A("only two things", 992.5), t_today = A("cook your rice today", 994.0), t_tmr = A("and tomorrow cook only two cups", 997.0);
shot(me(60) - 0.7, ms(61) + 0.4, VW.wide, push(VW.wide, 0.25, -4));
st(me(60) - 1, ms(61) + 0.5, () => ({ fire: 0.9, smoke: 0.5, hei: 0.4, arroz: { rice: 0.6, brown: 1 }, trays: 6, tickets: 6 }));
gap(60, (t) => W(t), (t) => [
  <Pensado key="lk" t={t} at={me(60) + 0.05} out={t_two2 - 0.1} x={960} y={220} text="no Mr. Lau watching you" size={90} />,
  <Libreta key="2t" t={t} out={ms(61) + 0.3} x={960} y={150} title="THIS WEEK · ONLY TWO THINGS" rows={[{ at: t_today, amt: "1.", item: "cook rice today → fridge tonight" }, { at: t_tmr, amt: "2.", item: "tomorrow: 2 cups in a smoking pan" }]} w={900} />,
]);
// ---- 61 · CTA: suscribirse + campanita + UNA pregunta para comentar
const t_sub = A("subscribe to the channel", 1007.4), t_bell = A("ring the little bell", 1009.8), t_drawer = A("another drawer", 1012.5), t_q = A("what is your fried rice mistake", 1018.1);
shot(me(61) - 0.7, ms(62) + 0.4, VW.comandas, push(VW.comandas, 0.25, -4));
st(me(61) - 1, ms(62) + 0.5, () => ({ fire: 0.6, smoke: 0.4, tickets: 12 }));
gap(61, (t) => W(t), (t) => [
  <Suscribir key="sb" t={t} at={Math.min(me(61) - 0.2, t_sub)} press={t_sub + 0.6} out={t_q - 0.3} x={680} y={800} />,
  <Campana key="cp" t={t} at={t_sub + 0.6} ring={t_bell + 0.2} out={t_q - 0.3} x={1380} y={300} />,
  <Pensado key="dr" t={t} at={t_drawer} out={t_q - 0.3} x={640} y={260} text="many drawers in that kitchen…" size={76} />,
  <Comanda key="qq" t={t} at={t_q - 0.4} out={ms(62) + 2.5} n="?" head="TELL ME BELOW" title={["what is YOUR", "fried rice mistake?"]} />,
]);
// ---- 62 · la semana que viene: el pollo del restaurante, tierno · el de casa "dry like a shoe" · "one spoon of something you already have"
const t_soft = A("so soft and tender", 1031.5), t_shoe = A("dry like a shoe", 1034.1), t_spoon = A("one spoon of something", 1035.9);
gap(62, C("c02_pollo", me(62) - 0.7), (t) => [
  <Tag key="nw" t={t} at={me(62) + 0.1} x={960} y={560} dx={-300} dy={-220} text="NEXT WEEK" sub="RESTAURANT CHICKEN" col={K.gold} out={t_shoe} size={56} />,
  <Tag key="sf" t={t} at={t_soft} x={960} y={560} dx={300} dy={-220} text="SOFT & TENDER" col={K.gold} out={t_spoon} size={56} />,
  <Pensado key="sh" t={t} at={t_shoe} out={t_spoon - 0.1} x={960} y={880} text="…at home, dry like a shoe" size={90} />,
  <Medida key="sp" t={t} at={t_spoon} out={ms(63) + 0.3} x={960} y={300} big="1 SPOON" sub="OF SOMETHING YOU ALREADY HAVE" size={150} />,
]);
// ---- 63 · cierre: "Cold rice, hot pan, and patience." · "Okay, go cook."
const t_cr = A("cold rice", 1045.5), t_hp = A("hot pan", 1046.4), t_pa = A("and patience", 1047.2), t_go = A("go cook", 1048.9);
gap(63, C("c01_atardecer", me(63) - 0.7, 0, [1.0, 1.06]), (t) => [
  <Pasos key="fn" t={t} out={FULL_END} items={[{ at: t_cr, txt: "COLD RICE" }, { at: t_hp, txt: "HOT PAN" }, { at: t_pa, txt: "PATIENCE" }]} y={860} size={60} />,
  <AbsoluteFill key="fo" style={{ background: "#000", opacity: e(t, FULL_END - 1.2, FULL_END) }} />,
]);
void T; void t_go;

keys.sort((a, b) => a.t - b.t);
setKeys(keys);

// línea de tiempo de las tomas reales (para la mezcla: el sonido nativo del clip suena donde se ve). [k, desde, hasta, segundo del clip en "desde"]
export const CLIP_TL = (): [string, number, number, number][] => {
  const out: [string, number, number, number][] = [];
  const walk = (bg: BG, a: number, b: number) => {
    if (bg.parts) { walk(bg.parts[0], a, Math.min(b, bg.parts[2])); walk(bg.parts[1], Math.max(a, bg.parts[2] - 0.6), b); return; }
    if (bg.clip && b > a) out.push([bg.clip.k, a, b, bg.clip.from + (a - bg.clip.a)]);
  };
  G.forEach((g, i) => walk(g.bg, i >= 0 ? g.a - 0.6 : g.a, g.b));
  return out;
};

// ---------------- piezas sobre el AVATAR (al costado, sin tapar la cara) ----------------
const AVFX: ((t: number) => React.ReactNode)[] = [
  (t) => <Chips key="a1" t={t} at={A("it was the rice", 17.9)} items={["THE RICE", "THE FIRE", "3 LITTLE THINGS"]} out={me(1) + 0.2} y={880} />,
  (t) => <Tag key="a2" t={t} at={A("when i was 26", 35.0)} x={1500} y={520} dx={120} dy={-160} text="AGE 26" sub="FIRST WEEK" col={K.gold} out={me(2)} size={52} />,
  (t) => <Chips key="a4" t={t} at={A("no special machine", 64.8)} items={["NO SPECIAL MACHINE", "NO EXPENSIVE THINGS"]} out={me(4)} y={880} />,
  (t) => <Medida key="a5" t={t} at={A("at 3 o clock", 83.0)} out={me(5)} x={1530} y={300} big="3:00 PM" sub="RICE FOR TOMORROW" size={110} />,
  (t) => <Medida key="a9" t={t} at={A("one cup rice one cup water", 154.9)} out={me(9) + 0.2} x={1520} y={300} big="1 CUP + 1 TBSP" sub="WATER FOR 1 CUP RICE" size={96} />,
  (t) => <Medida key="a12" t={t} at={A("put a fan on it", 205.0)} out={me(12)} x={1520} y={300} big="10 + 20 MIN" sub="FAN · FREEZER" size={100} />,
  (t) => <Medida key="a20" t={t} at={A("more than 2 seconds", 329.0)} out={me(20)} x={1520} y={300} big="> 2 SEC" sub="NOT READY" size={130} />,
  (t) => <Medida key="a21" t={t} at={A("never more than 2 cups", 342.9)} out={me(21)} x={1520} y={300} big="MAX 2 CUPS" sub="= TWO PLATES" size={110} />,
  (t) => <Sello key="a22" t={t} at={A("go quiet", 360.5)} text="QUIET PAN = TOO MUCH" x={1450} y={880} out={me(22)} rot={-4} size={64} />,
  (t) => <Pensado key="a26" t={t} at={A("hot hot hot", 429.3)} out={me(26) + 0.2} x={1450} y={250} text="hot, hot, hot all night" size={80} col={K.gold} />,
  (t) => <Medida key="a30" t={t} at={A("two tablespoons", 491.3)} out={me(30)} x={1520} y={300} big="2 TBSP" sub="OIL · 2 CUPS RICE" size={130} />,
  (t) => <Medida key="a45" t={t} at={A("hundred thousand times", 735.7)} out={me(45) + 0.2} x={1520} y={300} big="100,000×" sub="TWO PLATES" size={120} />,
  (t) => <Medida key="a47" t={t} at={A("5 minutes until it smokes", 772.5)} out={me(47)} x={1520} y={300} big="5 MIN" sub="EMPTY · HIGH · SMOKING" size={130} />,
  (t) => <Medida key="a49" t={t} at={A("one teaspoon dark", 801.5)} out={me(49) + 0.2} x={1520} y={300} big="1 TBSP + 1 TSP" sub="LIGHT · DARK" size={100} />,
  (t) => <Medida key="a58" t={t} at={A("less than two dollars for two big plates", 955.7)} out={me(58) + 0.2} x={1520} y={300} big="< $2" sub="TWO BIG PLATES" size={170} />,
  (t) => <Medida key="a60" t={t} at={A("three garbage cans", 986.5)} out={me(60)} x={1520} y={300} big="3 DAYS" sub="3 GARBAGE CANS" size={130} />,
];

// ================= EL VIDEO =================
export const Main: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const wi = WIN.findIndex((w) => t >= w.ms && t < w.me);
  if (wi >= 0) {
    L.push(<Avatar key="av" t={t} />);
    // salida del avatar: portal a lo que sigue
    const g = G[wi];
    if (g && t >= g.a - 0.6) L.push(<Portal key="pout" x={wi % 2 ? 560 : 1360} y={480} r={ei(t, g.a - 0.6, g.a)}>{g.bg(t)}</Portal>);
  } else {
    const g = G.find((x) => t >= x.a && t < x.b);
    if (g) L.push(<React.Fragment key="bg">{g.bg(t)}</React.Fragment>);
  }
  // piezas de los tramos (pueden asomar sobre el avatar un instante al entrar o salir)
  for (const g of G) if (g.fx && t >= g.a - 3 && t < g.b + 3) L.push(...g.fx(t));
  for (const fx of AVFX) L.push(fx(t));
  // entrada a cada ventana del avatar: golpe de vapor
  for (const w of WIN) if (w.ms > 0.5 && Math.abs(t - w.ms) < 0.4) L.push(<Vapor key={"v" + w.ms} t={t} mid={w.ms} w={0.3} />);
  return <AbsoluteFill style={{ background: "#0a0605" }}>{L}</AbsoluteFill>;
};
