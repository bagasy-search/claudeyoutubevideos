// wonges01 · EL VIDEO ENTERO (0 → 15:48) en UNA toma: la cocina del restaurante del viejo Lau es el mundo y la cámara nunca corta.
// Entre ventana y ventana del avatar: el mundo 3D (el wok, la turbina, la LATA BLANCA, las sojas, la FIBRA de la carne en macro)
// o la toma real LTX (si todavía no llegó, la foto del primer cuadro con empuje lento), y las piezas 2.5D clavadas a la voz.
// Entrada al avatar = golpe de VAPOR; salida = PORTAL que se abre a lo que sigue. Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, V, camSpeed, setKeys, win } from "./kitchen3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { Chips, LowerThird, P, Portal, Tag, at as atRaw, e, ei, s } from "./lib";
import { Balanza, Campana, Comanda, Cuenta$, Fortuna, K, Libreta, Medida, NoCard, Pasos, Pensado, Sello, Semana, SiCard, Suscribir, Vapor } from "./pieces";

export const FULL_END = 948.2;
export const FULL_FRAMES = Math.ceil(FULL_END * 30);
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = (AVW as { win: Win[] }).win;
export const MIN1_END = WIN[5].ms; // el minuto 1 llega hasta "doce horas por día"
export const MIN1_FRAMES = s(MIN1_END);

// at() con red: la frase del ASR cerca del segundo esperado o, si no aparece, ese segundo
const A = (ph: string, fb: number) => { try { const v = atRaw(ph, fb - 6); return Math.abs(v - fb) < 6 ? v : fb; } catch { return fb; } };

// ---------------- vistas de la cámara ----------------
type Vw = { p: V; l: V; fov: number };
const LATA: V = [PT.polvos[0] + 0.24, PT.polvos[1], PT.polvos[2]];
const VW: Record<string, Vw> = {
  wide: { p: [0.9, 1.75, 1.7], l: [-0.2, 1.1, -2.0], fov: 44 },
  wide2: { p: [-0.4, 1.6, 1.2], l: [-0.1, 1.15, -2.0], fov: 42 },
  wok: { p: [-0.2, 1.45, -1.35], l: PT.wok, fov: 40 },
  wokTop: { p: [0.15, 1.72, -1.2], l: [-0.35, 1.0, -1.95], fov: 34 },
  wokLow: { p: [0.4, 1.32, -1.3], l: [-0.35, 1.02, -1.95], fov: 38 },
  polvos: { p: [-1.35, 1.32, -1.45], l: PT.polvos, fov: 34 },
  lata: { p: [-1.18, 1.32, -1.42], l: LATA, fov: 30 },
  soja: { p: [-1.0, 1.25, -1.62], l: PT.soja, fov: 30 },
  bandejas: { p: [1.9, 1.5, 0.2], l: PT.bandejas, fov: 42 },
  comandas: { p: [-0.2, 1.65, -0.45], l: PT.comandas, fov: 44 },
  cajas: { p: [0.75, 1.6, -0.55], l: PT.cajas, fov: 40 },
  // la FIBRA de la carne (escenario macro, aparte de la cocina)
  carne: { p: [-24, 1.45, 1.6], l: PT.carne, fov: 34 },
  carneC: { p: [-24, 1.3, 1.0], l: PT.carne, fov: 30 },
  carneSide: { p: [-25.3, 1.55, 1.0], l: PT.carne, fov: 34 },
  carneEnd: { p: [-22.5, 1.32, 0.45], l: PT.carne, fov: 36 },
  carneTop: { p: [-24, 2.4, 0.5], l: PT.carne, fov: 34 },
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
const WK = { fire: 0.7, smoke: 0.35, tickets: 7 }; // la cocina en marcha, wok vacío
const BLUE = "#8fb8ff";

// ---- 0 · GANCHO: "Estás parado frente a la sartén…" → maicena → a la sartén → larga agua, gris, se encoge, hierve en su jugo
const t_maic = A("la pusiste con maicena", 6.2), t_sart = A("la tiraste a la sarten", 9.6), t_chis = A("en vez de chisporrotear", 11.0), t_gris = A("la carne se pone gris", 13.6), t_hier = A("hierve en su propio jugo", 15.4);
gap(0, C("hm01_casa_carne_gris", me(0) - 0.7, 0, [1.0, 1.06]), (t) => [
  <Pensado key="mz" t={t} at={t_maic} out={t_sart - 0.1} x={1060} y={230} text="…con maicena, como dice todo el mundo" size={70} />,
  <Tag key="ag" t={t} at={t_chis + 0.6} x={960} y={600} dx={-280} dy={-200} text="LARGA AGUA" col={BLUE} out={t_gris} size={58} />,
  <Sello key="gr" t={t} at={t_gris + 0.3} text="GRIS" x={1250} y={780} out={t_hier + 0.8} rot={-8} size={150} />,
  <Pensado key="hj" t={t} at={t_hier} out={ms(1) + 0.3} x={760} y={900} text="hierve en su propio jugo" size={84} col={K.gold} />,
]);
// ---- 1 · "¿me faltó maicena? La próxima le pongo más. No amigo, no es la maicena, nunca fue la maicena. 40 años…"
const t_falt = A("me falto maicena", 25.6), t_prox = A("la proxima le pongo mas", 27.0), t_noes = A("no es la maicena", 29.1), t_nunca = A("nunca fue la maicena", 30.2);
shot(me(1) - 0.7, ms(2) + 0.4, VW.polvos, push(VW.polvos, 0.3, -4));
st(me(1) - 1, ms(2) + 0.5, (t) => ({ ...WK, glowPolvo: t > t_nunca ? 4 : 0 }));
gap(1, (t) => W(t), (t) => [
  <Pensado key="fm" t={t} at={me(1) + 0.1} out={t_noes - 0.2} x={960} y={250} text="¿me faltó maicena?" size={110} />,
  <Pensado key="pm" t={t} at={t_prox} out={t_noes - 0.2} x={960} y={820} text="…la próxima le pongo más" size={84} />,
  <Sello key="nm" t={t} at={t_noes} text="NO ES LA MAICENA" x={960} y={560} out={ms(2) + 0.4} rot={-6} size={130} />,
]);
// ---- 2 · "lo que mi patrón nunca quería que le diga a nadie" · la carne más barata del mercado · tierna como manteca · una cucharadita
const t_patr = A("mi patron nunca quería", 34.0), t_bar = A("la carne mas barata del", 39.0), t_mant = A("tierna como manteca", 42.6), t_cdita = A("por una cucharadita de algo", 43.6), t_alac = A("en la alacena", 46.0);
shot(t_bar - 0.6, ms(3) + 0.4, VW.carneSide, VW.carne);
st(t_bar - 1, ms(3) + 0.5, (t) => ({ carne: { on: 1, soda: e(t, t_mant, t_mant + 2.5) } }));
gap(2, split(C("a02_tickets", me(2) - 0.7), (t) => W(t), t_bar, 960, 540), (t) => [
  <Pensado key="pn" t={t} at={me(2) + 0.1} out={t_bar - 0.3} x={960} y={860} text="lo que mi patrón nunca quería que diga" size={78} />,
  <Tag key="mb" t={t} at={t_bar + 0.3} x={960} y={560} dx={-300} dy={-220} text="LA MÁS BARATA" sub="DEL MERCADO" col={K.gold} out={t_mant} size={58} />,
  <Tag key="mt" t={t} at={t_mant} x={960} y={560} dx={-300} dy={-220} text="TIERNA" sub="COMO MANTECA" col={BLUE} out={ms(3) + 0.3} size={54} />,
  <Medida key="1c" t={t} at={t_cdita + 0.3} out={ms(3) + 0.3} x={960} y={850} big="1 CUCHARADITA" sub="DE ALGO QUE YA TENÉS" size={110} />,
]);
void t_patr; void t_alac;
// ---- 3 · "los 7 secretos, en orden, con gramos, con minutos, con grados… es lo que pasa dentro de la carne… el tercero… te discuta"
const t_7 = A("7 secretos", 50.6), t_gram = A("con gramos", 52.6), t_dentro = A("lo que pasa dentro de la carne", 57.5), t_terc = A("el tercero", 59.5), t_disc = A("deja que discuta", 61.5);
shot(me(3) - 0.7, ms(4) + 0.4, VW.comandas, push(VW.comandas, 0.2));
st(me(3) - 1, ms(4) + 0.5, (t) => ({ ...WK, tickets: Math.round(2 + 10 * win(t, me(3), me(3) + 1.6)) }));
gap(3, (t) => W(t), (t) => [
  <Medida key="7s" t={t} at={Math.max(me(3) + 0.05, t_7)} out={t_dentro - 0.2} x={960} y={330} big="7 SECRETOS" sub="EN ORDEN" size={140} />,
  <Chips key="gm" t={t} at={t_gram} items={["GRAMOS", "MINUTOS", "GRADOS"]} out={t_dentro - 0.2} y={780} />,
  <Pensado key="dc" t={t} at={t_dentro} out={t_terc - 0.1} x={960} y={540} text="no es mi opinión: es lo que pasa DENTRO de la carne" size={70} />,
  <Comanda key="t3" t={t} at={t_terc} out={ms(4) + 0.4} n="#3" head="OJO CON EL" title={["alguien te va", "a discutir"]} sc={0.85} />,
]);
void t_disc;
// ---- 4 · "Empecé a los 14, en Cantón, lavando wok en la cocina de un tío… vine para acá… 40 años… seis días por semana"
const t_14 = A("empece a los 14", 67.5), t_cant = A("en canton", 69.0), t_aca = A("despues vine para", 72.5), t_40 = A("40 anos en la cocina", 75.0);
gap(4, C("w01_quemador", me(4) - 0.7), (t) => [
  <Medida key="14" t={t} at={Math.max(me(4) + 0.1, t_14)} out={t_aca - 0.2} x={480} y={320} big="14 AÑOS" sub="CANTÓN · LAVANDO WOK" size={120} />,
  <Medida key="40" t={t} at={t_aca + 0.4} out={ms(5) + 0.3} x={1400} y={320} big="40 AÑOS" sub="RESTAURANTE FAMILIAR" size={120} />,
]);
void t_cant; void t_40;
// ---- 5 · "12 horas por día, frente al mismo fuego. El viejo Lau, el primer cocinero… quemaduras como pecas, toalla blanca en el hombro"
const t_12 = A("12 horas por dia", 79.0), t_lau = A("fue el viejo lau", 85.0), t_pecas = A("como pecas", 88.5), t_toal = A("una toalla blanca", 89.5), t_grit = A("no te gritaba", 95.5);
gap(5, C("a03_cicatriz", me(5) - 0.7), (t) => [
  <Tag key="vl" t={t} at={Math.max(me(5) + 0.2, t_lau)} x={1100} y={420} dx={260} dy={-190} text="EL VIEJO LAU" sub="EL PRIMER COCINERO" col={K.gold} out={t_pecas - 0.1} size={56} />,
  <Pensado key="pc" t={t} at={t_pecas} out={t_toal + 1.6} x={700} y={240} text="quemaduras chiquitas, como pecas" size={78} />,
  <Tag key="tb" t={t} at={t_toal + 0.3} x={900} y={520} dx={-260} dy={-170} text="TOALLA BLANCA" sub="SIEMPRE AL HOMBRO" col={K.cream} out={ms(6) + 0.3} size={50} />,
]);
void t_12; void t_grit;
// ---- 6 · "Este canal es nuevo. Si llegaste hasta acá, suscribite… vamos a la tabla. Secreto número 1"
const t_nuevo = A("este canal es nuevo", 102.0), t_susc = A("suscribete", 104.5), t_tabla = A("vamos a la tabla", 108.5), t_s1 = A("secreto numero 1", 111.0);
shot(me(6) - 0.7, ms(7) + 0.4, VW.wide, push(VW.wide, 0.3, -4));
st(me(6) - 1, ms(7) + 0.5, () => ({ ...WK, fire: 0.6 }));
gap(6, (t) => W(t), (t) => [
  <Pensado key="cn" t={t} at={Math.max(me(6) + 0.1, t_nuevo)} out={t_susc - 0.1} x={960} y={260} text="este canal es nuevo" size={96} />,
  <Suscribir key="sb" t={t} at={t_susc - 0.3} press={t_susc + 0.8} out={t_tabla - 0.2} x={960} y={760} />,
  <Comanda key="c1" t={t} at={t_s1 - 0.4} out={ms(7) + 1.6} n={1} head="SECRETO" title={["el cuchillo va", "contra la fibra"]} />,
]);
// ---- 7 · "falda, o vacío… una carne barata con fibra larga. ¿Ves estas líneas? … como un manojo de hilos. Eso es el músculo"
const t_fald = A("es falda o vacio", 117.5), t_lineas = A("ves estas lineas", 123.0), t_manojo = A("como un manojo de hilos", 125.6), t_musc = A("eso es el musculo", 127.5);
shot(t_manojo - 0.6, ms(8) + 0.4, VW.carneEnd, push(VW.carneEnd, 0.2, -3));
st(t_manojo - 1, ms(8) + 0.5, () => ({ carne: { on: 1 } }));
gap(7, split(C("m01_falda_grano", me(7) - 0.7), (t) => W(t), t_manojo, 960, 540), (t) => [
  <Chips key="fv" t={t} at={me(7) + 0.1} items={["FALDA", "VACÍO", "LA QUE TENGAS"]} out={t_lineas - 0.1} y={180} />,
  <Tag key="ln" t={t} at={t_lineas + 0.2} x={960} y={540} dx={-280} dy={-200} text="LAS LÍNEAS" sub="TODAS PARA EL MISMO LADO" col={K.gold} out={t_manojo - 0.3} size={54} />,
  <Pensado key="mh" t={t} at={t_manojo + 0.3} out={ms(8) + 0.3} x={960} y={880} text="un manojo de hilos" size={100} col={K.gold} />,
]);
void t_fald; void t_musc;
// ---- 8 · "esos hilos los tienen que romper tus dientes. Eso es la goma. Si cortás atravesado… hilos cortitos de 3 o 4 mm"
const t_dien = A("los tienen que romper tus dientes", 137.0), t_goma = A("eso es la goma", 139.0), t_atr = A("si cortas atravesado", 140.3), t_cuch = A("el cuchillo hace el trabajo", 142.5), t_34 = A("3 o 4 milimetros", 147.0);
shot(me(8) - 0.7, t_atr, VW.carneSide, push(VW.carneSide, 0.15));
shot(t_atr + 0.5, ms(9) + 0.4, VW.carneTop, push(VW.carneTop, 0.2, -4));
st(me(8) - 1, ms(9) + 0.5, (t) => ({ carne: { on: 1, along: e(t, me(8), me(8) + 1.5) * (1 - e(t, t_atr, t_atr + 0.6)), slice: e(t, t_atr + 0.4, t_atr + 1.6) } }));
gap(8, (t) => W(t), (t) => [
  <Tag key="dn" t={t} at={me(8) + 0.2} x={960} y={540} dx={-300} dy={-220} text="A LO LARGO" sub="HILOS ENTEROS" col={K.cream} out={t_goma} size={54} />,
  <Sello key="gm" t={t} at={t_goma} text="LA GOMA" x={960} y={820} out={t_atr + 0.3} rot={-7} size={140} />,
  <SiCard key="ct" t={t} at={t_atr + 0.6} x={960} y={200} out={t_34 - 0.2} txt="CONTRA LA FIBRA" w={560} />,
  <Pensado key="ch" t={t} at={t_cuch} out={t_34 - 0.2} x={960} y={880} text="el cuchillo trabaja antes que tus dientes" size={74} />,
]);
void t_dien;
// ---- 9 · "medio dura. 30 minutos en el congelador. No congelada, firme… el cuchillo entra derecho y no la aplasta"
const t_30 = A("30 minutos en el congelador", 157.5), t_firme = A("no congelada firme", 159.5), t_derec = A("entra derecho", 161.5);
gap(9, C("m02_firme_frio", me(9) - 0.7), (t) => [
  <Medida key="30" t={t} at={Math.max(me(9) + 0.1, t_30)} out={t_firme - 0.1} x={1400} y={320} big="30 MIN" sub="EN EL CONGELADOR" size={140} />,
  <NoCard key="cg" t={t} at={t_firme} x={620} y={760} out={ms(10) + 0.3} txt="CONGELADA" />,
  <SiCard key="fm" t={t} at={t_firme + 0.5} x={1300} y={760} out={ms(10) + 0.3} txt="FIRME" />,
]);
void t_derec;
// ---- 10 · "la carne se corta mirándola, no mirando el cuchillo" (Lau) → SECRETO 2: la carne tiene que tomar agua · "toda la vida te dijeron que hay que secarla"
const t_mira = A("la carne se corta mirandola", 171.0), t_s2 = A("secreto numero 2", 175.5), t_raro = A("esto suena raro", 177.0), t_seca = A("hay que secarla", 181.0);
gap(10, C("m03_corte_contra", me(10) - 0.7), (t) => [
  <Fortuna key="lm" t={t} at={me(10) + 0.1} out={t_s2 - 0.2} text="La carne se corta mirándola, no mirando el cuchillo." who="EL VIEJO LAU" y={860} size={50} />,
  <Comanda key="c2" t={t} at={t_s2 - 0.2} out={t_raro + 2.0} n={2} head="SECRETO" title={["la carne tiene", "que tomar agua"]} />,
  <NoCard key="sc" t={t} at={t_seca - 0.2} x={960} y={820} out={ms(11) + 0.3} txt="SECARLA" />,
]);
// ---- 11 · "a la carne cortada le damos de beber: ½ kg, 3 cucharadas de agua fría… masajeás 1-2 minutos hasta que el agua desaparece"
const t_beber = A("le damos de beber", 188.5), t_3c = A("3 cucharadas de agua fria", 191.5), t_masa = A("la masajeas con la mano", 194.0), t_12m = A("uno dos minutos", 196.0), t_desap = A("el agua desaparece", 198.0);
gap(11, C("m05_agua_masaje", me(11) - 0.7), (t) => [
  <Medida key="3c" t={t} at={Math.max(me(11) + 0.2, t_3c)} out={t_12m - 0.1} x={1400} y={300} big="3 CDAS" sub="AGUA FRÍA · ½ KG DE CARNE" size={140} />,
  <Medida key="12" t={t} at={t_12m} out={ms(12) + 0.3} x={520} y={300} big="1–2 MIN" sub="MASAJE DESPACITO" size={130} />,
  <Tag key="ds" t={t} at={t_desap} x={960} y={620} dx={260} dy={-200} text="NI UNA GOTA" sub="EN EL FONDO DEL BOL" col={BLUE} out={ms(12) + 0.3} size={50} />,
]);
void t_beber; void t_masa;
// ---- 12 · "¿por qué? cuando la carne toca el fuego las fibras se aprietan y exprimen el jugo, como un trapo mojado… sigue jugosa"
const t_toca = A("cuando la carne toca el fuego", 205.0), t_apr = A("las fibras se aprietan", 207.4), t_trapo = A("un trapo mojado", 211.0), t_jug = A("sigue jugosa", 213.0);
shot(me(12) - 0.7, ms(13) + 0.4, VW.carne, VW.carneC);
st(me(12) - 1, ms(13) + 0.5, (t) => ({ carne: { on: 1, heat: e(t, t_toca, t_toca + 1.2), squeeze: e(t, t_apr, t_apr + 1.6), water: 1 } }));
gap(12, (t) => W(t), (t) => [
  <Tag key="fg" t={t} at={t_toca + 0.2} x={960} y={600} dx={-300} dy={-220} text="EL FUEGO" col="#ff8a3d" out={t_apr} size={60} />,
  <Tag key="ap" t={t} at={t_apr + 0.2} x={960} y={540} dx={300} dy={-220} text="SE APRIETAN" sub="Y EXPRIMEN EL JUGO" col={K.gold} out={t_trapo} size={54} />,
  <Pensado key="tm" t={t} at={t_trapo} out={ms(13) + 0.3} x={960} y={880} text="como cuando retorcés un trapo mojado" size={78} />,
]);
void t_jug;
// ---- 13 · "si la carne no puede guardar esa agua, la larga… carne gris hirviendo en su jugo" → SECRETO 3 (el que el patrón cuidaba como plata)
const t_guard = A("si la carne no puede guardar", 219.5), t_gris2 = A("la carne gris hirviendo", 224.0), t_need = A("necesitas el secreto numero 3", 228.0), t_s3 = A("secreto numero 3", 230.0);
shot(me(13) - 0.7, t_need, VW.carneC, push(VW.carneC, 0.15));
shot(t_need + 0.6, ms(14) + 0.4, VW.polvos, VW.lata);
st(me(13) - 1, ms(14) + 0.5, (t) => (t < t_need + 0.3 ? { carne: { on: 1, heat: 1, squeeze: 1, water: 1 } } : { ...WK, glowPolvo: 4 }));
gap(13, (t) => W(t), (t) => [
  <Tag key="la" t={t} at={me(13) + 0.2} x={960} y={540} dx={-300} dy={-220} text="LA LARGA" sub="APENAS TOCA LA SARTÉN" col={BLUE} out={t_gris2} size={54} />,
  <Sello key="g2" t={t} at={t_gris2} text="GRIS" x={960} y={800} out={t_need} rot={-8} size={150} />,
  <Comanda key="c3" t={t} at={t_s3 - 0.4} out={ms(14) + 1.6} n={3} head="SECRETO" title={["la lata blanca", "sin etiqueta"]} />,
]);
void t_guard;
// ---- 14 · "una lata blanca, sin etiqueta, al lado de la sal. Los mozos pensaban que era sal fina… si alguien pregunta, es maicena. No era maicena."
const t_lata = A("habia una lata blanca", 236.0), t_sal = A("al lado de la sal", 239.0), t_mozos = A("los mozos pensaban", 240.5), t_cli = A("los clientes nunca la vieron", 242.5), t_preg = A("si alguien pregunta es maicena", 245.6);
gap(14, C("m06_lata_blanca", me(14) - 0.7, 0, [1.02, 1.12]), (t) => [
  <Tag key="se" t={t} at={Math.max(me(14) + 0.2, t_lata)} x={960} y={520} dx={-280} dy={-200} text="SIN ETIQUETA" sub="AL LADO DE LA SAL" col={K.cream} out={t_mozos} size={56} />,
  <Pensado key="sf" t={t} at={t_mozos} out={t_cli + 1.0} x={960} y={230} text="los mozos: «es sal fina»" size={84} />,
  <Fortuna key="pm" t={t} at={t_preg - 0.2} out={ms(15) + 0.4} text="Si alguien pregunta, es maicena." who="EL PATRÓN" y={860} />,
]);
void t_sal;
// ---- 15 · "½ kg: media cucharadita rasa, unos tres gramos, nada más. Se disuelven en las 3 cucharadas de agua del secreto 2"
const t_med = A("media cucharadita rasa", 256.5), t_3g = A("tres gramos", 259.9), t_dis = A("se disuelven", 261.0);
gap(15, C("m07_bicarb_cuchara", me(15) - 0.7), (t) => [
  <Medida key="md" t={t} at={Math.max(me(15) + 0.1, t_med)} out={ms(16) + 0.3} x={1380} y={300} big="½ CDITA RASA" sub="PARA ½ KG DE CARNE" size={120} />,
  <Medida key="3g" t={t} at={t_3g} out={ms(16) + 0.3} x={520} y={760} big="≈ 3 g" sub="NADA MÁS" col={BLUE} size={140} />,
  <Tag key="dv" t={t} at={t_dis + 0.3} x={960} y={540} dx={-300} dy={-200} text="DISUELTO" sub="EN LAS 3 CDAS DE AGUA" col={BLUE} out={ms(16) + 0.3} size={46} />,
]);
// ---- 16 · "Ahora te explico qué pasa adentro… un cliente que era químico… La carne es un poquito ácida. Las proteínas… pegadas, apretadas"
const t_adentro = A("te explico que pasa adentro", 270.0), t_quim = A("que era quimico", 274.5), t_acida = A("un poquito acida", 277.5), t_prot = A("las proteinas de la fibra", 278.5), t_peg = A("pegadas apretadas", 282.0);
shot(me(16) - 0.7, ms(17) + 0.4, VW.carneEnd, VW.carneC);
st(me(16) - 1, ms(17) + 0.5, (t) => ({ carne: { on: 1, squeeze: 0.25 + 0.35 * e(t, t_peg, t_peg + 1.2) } }));
gap(16, (t) => W(t), (t) => [
  <Pensado key="qm" t={t} at={Math.max(me(16) + 0.1, t_quim - 0.5)} out={t_acida - 0.1} x={960} y={240} text="me lo explicó un cliente químico" size={80} />,
  <Tag key="ac" t={t} at={t_acida} x={960} y={560} dx={-300} dy={-220} text="UN POQUITO ÁCIDA" col="#ff8a3d" out={ms(17) + 0.3} size={54} />,
  <Tag key="pt" t={t} at={t_prot + 0.4} x={960} y={540} dx={300} dy={-200} text="PROTEÍNAS" sub="PEGADAS · APRETADAS" col={K.gold} out={ms(17) + 0.3} size={54} />,
]);
void t_adentro;
// ---- 17 · "…exprimen el agua para afuera. El bicarbonato es lo contrario del ácido… las proteínas se empujan, se separan"
const t_contra = A("es lo contrario del acido", 290.0), t_emp = A("empiezan a empujar", 295.0), t_sepa = A("se separan", 298.0);
shot(me(17) - 0.7, ms(18) + 0.4, VW.carneC, VW.carneEnd);
st(me(17) - 1, ms(18) + 0.5, (t) => ({ carne: { on: 1, squeeze: 0.6 * (1 - e(t, t_contra, t_contra + 1.5)), soda: e(t, t_contra, t_contra + 2.5), water: 1 } }));
gap(17, (t) => W(t), (t) => [
  <Tag key="bi" t={t} at={t_contra} x={960} y={560} dx={-300} dy={-220} text="BICARBONATO" sub="LO CONTRARIO DEL ÁCIDO" col={BLUE} out={t_emp} size={60} />,
  <Pensado key="em" t={t} at={t_emp} out={ms(18) + 0.3} x={960} y={880} text="se empujan · se separan · queda lugar" size={80} col={BLUE} />,
]);
void t_sepa;
// ---- 18 · "ya no se pueden apretar tanto. No exprimen. jugosa, suave… esa textura sedosa que solamente comías en el restaurante"
const t_noexp = A("no exprimen", 303.5), t_jugosa = A("la carne queda jugosa", 304.0), t_sedosa = A("esa textura sedosa", 309.5);
shot(me(18) - 0.7, ms(19) + 0.4, VW.carneSide, push(VW.carneSide, 0.25, -4));
st(me(18) - 1, ms(19) + 0.5, (t) => ({ carne: { on: 1, soda: 1, heat: e(t, me(18), me(18) + 1.5), squeeze: 0.15, water: 1 } }));
gap(18, (t) => W(t), (t) => [
  <Tag key="el" t={t} at={me(18) + 0.3} x={960} y={600} dx={-300} dy={-220} text="EL AGUA SE QUEDA" col={BLUE} out={t_jugosa + 0.4} size={56} />,
  <Chips key="js" t={t} at={t_jugosa + 0.4} items={["JUGOSA", "SUAVE", "SEDOSA"]} out={ms(19) + 0.3} y={830} />,
]);
void t_noexp; void t_sedosa;
// ---- 19 · "…como si fuera lomo. ¿No me creés? La prueba de mi sobrino… dos bols, 200 gramos de la misma carne en cada uno"
const t_crees = A("no me crees", 317.0), t_sobr = A("a mi sobrino", 319.5), t_bols = A("dos bols", 324.0), t_200 = A("200 gramos", 325.0);
gap(19, C("m09_dos_bols", me(19) - 0.7), (t) => [
  <Pensado key="lm" t={t} at={me(19) + 0.05} out={t_crees - 0.1} x={960} y={240} text="…como si fuera lomo" size={96} col={K.gold} />,
  <Tag key="sb" t={t} at={t_sobr} x={960} y={500} dx={-280} dy={-190} text="LA PRUEBA" sub="DEL SOBRINO" col={K.gold} out={t_bols} size={56} />,
  <Medida key="20" t={t} at={t_200} out={ms(20) + 0.3} x={960} y={250} big="200 g + 200 g" sub="LA MISMA CARNE · CORTADA IGUAL" size={120} />,
]);
// ---- 20 · "20 minutos. Las dos a la misma sartén… un minuto y medio. La de la izquierda sale chiquita, arrugada… charco de jugo gris"
const t_1m = A("un minuto y medio", 338.5), t_izq = A("la de la izquierda sale chiquita", 340.5), t_charco = A("un charco de jugo gris", 345.0);
gap(20, C("m10_dos_sartenes", me(20) - 0.7), (t) => [
  <NoCard key="iz" t={t} at={me(20) + 0.1} x={520} y={180} out={ms(21) + 0.3} txt="SÓLO AGUA" cross={1e9} />,
  <SiCard key="de" t={t} at={me(20) + 0.4} x={1400} y={180} out={ms(21) + 0.3} txt="+ BICARBONATO" w={480} />,
  <Medida key="1m" t={t} at={t_1m} out={t_izq + 0.6} x={960} y={540} big="1½ MIN" sub="MISMO FUEGO" size={130} />,
  <Tag key="ch" t={t} at={t_charco} x={520} y={760} dx={120.0} dy={-160} text="CHARCO GRIS" col="#b9aea6" out={ms(21) + 0.3} size={50} />,
]);
// ---- 21 · la balanza: la izquierda perdió como un tercio, la derecha mucho menos · "el jugo que quedó adentro" · el sobrino se quedó callado
const t_pesas = A("las pesas en la balanza", 350.0), t_ter3 = A("perdio como un tercio", 354.5), t_jadent = A("adentro de la carne en vez", 359.0), t_call = A("se quedo callado", 365.5);
shot(me(21) - 0.7, ms(22) + 0.4, VW.wide2, push(VW.wide2, 0.25, -4));
st(me(21) - 1, ms(22) + 0.5, () => ({ ...WK, fire: 0.5 }));
gap(21, (t) => W(t), (t) => [
  <Balanza key="bz" t={t} at={me(21) - 0.1} drop={t_ter3 - 0.8} out={t_call - 0.3} x={960} y={520} />,
  <Pensado key="sc" t={t} at={t_call} out={ms(22) + 0.3} x={960} y={540} text="mi sobrino se quedó callado" size={92} col={K.gold} />,
]);
void t_pesas; void t_jadent;
// ---- 22 · "Ahora la discusión: ¿bicarbonato en la comida? ¡qué asco! va a tener gusto a jabón… y tiene razón a medias, si le ponés mucho"
const t_asco = A("bicarbonato en la comida", 372.5), t_jabon = A("gusto a jabon", 375.0), t_medias = A("tiene razon a medias", 377.0), t_mucho = A("si le pones mucho", 378.5);
gap(22, C("w10_polvos", me(22) - 0.7), (t) => [
  <Pensado key="as" t={t} at={Math.max(me(22) + 0.05, t_asco)} out={t_medias - 0.1} x={960} y={250} text="¿bicarbonato en la comida? ¡qué asco!" size={84} />,
  <Sello key="jb" t={t} at={t_jabon} text="GUSTO A JABÓN" x={960} y={780} out={t_medias + 0.2} rot={-5} size={110} col="#7d6f66" />,
  <Tag key="mu" t={t} at={t_mucho} x={960} y={560} dx={280.0} dy={-200} text="SÓLO SI" sub="LE PONÉS MUCHO" col={K.gold} out={ms(23) + 0.3} size={50} />,
]);
// ---- 23 · "no se siente nada, lo que se siente es la carne. Y si se te va la mano — una cucharada entera — no la tires"
const t_siente = A("lo que se siente es la carne", 385.0), t_mano = A("se te va la mano", 389.5), t_cda = A("una cucharada entera", 391.5), t_tires = A("no la tires", 392.8);
gap(23, C("m08_bicarb_carne", me(23) - 0.7), (t) => [
  <Pensado key="sn" t={t} at={me(23) + 0.05} out={t_mano - 0.1} x={960} y={240} text="lo que se siente es la carne" size={92} col={K.gold} />,
  <NoCard key="ce" t={t} at={t_cda} x={960} y={760} out={ms(24) + 0.3} txt="1 CUCHARADA ENTERA" w={620} />,
]);
void t_siente; void t_tires;
// ---- 24 · "la carne del día que venía muy dura: más bicarbonato, 15 minutos y enjuague" → SECRETO 4: la maicena, al final y poquita
const t_dura = A("venia muy dura", 400.5), t_15 = A("15 minutos y enjuague", 403.0), t_s4 = A("secreto numero 4", 405.0), t_final = A("pero al final", 407.5);
gap(24, C("m25_enjuague", me(24) - 0.7), (t) => [
  <Pasos key="en" t={t} out={t_s4 - 0.2} items={[{ at: t_dura, txt: "CARNE MUY DURA" }, { at: t_15 - 0.3, txt: "MÁS BICARBONATO" }, { at: t_15 + 0.3, txt: "15 MIN" }, { at: t_15 + 0.9, txt: "ENJUAGUE" }]} y={860} size={40} />,
  <Comanda key="c4" t={t} at={t_s4 - 0.3} out={ms(25) + 1.6} n={4} head="SECRETO" title={["la maicena:", "al final y poquita"]} />,
]);
void t_final;
// ---- 25 · "la maicena no ablanda nada. No entra en la carne, se queda afuera como un abrigo… para tres cosas: uno, protege del fuego fuerte"
const t_noabl = A("no ablanda nada", 413.5), t_abrigo = A("como un abrigo", 418.0), t_tres = A("para tres cosas", 420.0);
shot(me(25) - 0.7, ms(26) + 0.4, VW.carneSide, VW.carne);
st(me(25) - 1, ms(26) + 0.5, (t) => ({ carne: { on: 1, soda: 1, coat: e(t, t_abrigo - 0.4, t_abrigo + 1.4) } }));
gap(25, (t) => W(t), (t) => [
  <NoCard key="na" t={t} at={me(25) + 0.1} x={960} y={200} out={t_abrigo - 0.2} txt="NO ENTRA EN LA CARNE" w={620} cross={me(25) + 1.0} />,
  <Tag key="ab" t={t} at={t_abrigo + 0.4} x={960} y={540} dx={-300} dy={-220} text="UN ABRIGO" sub="SE QUEDA AFUERA" col={K.cream} out={t_tres} size={60} />,
]);
void t_noabl;
// ---- 26 · "la salsa se agarra a la carne… Pero va después del bicarbonato y del agua, nunca antes. Si ponés la maicena primero, tapás la carne"
const t_desp = A("va despues del bicarbonato", 437.5), t_prim = A("si pones la maicena primero", 440.5), t_tapas = A("tapas la carne", 442.3);
shot(me(26) - 0.7, ms(27) + 0.4, VW.carneC, push(VW.carneC, 0.2));
st(me(26) - 1, ms(27) + 0.5, (t) => (t < t_prim ? { carne: { on: 1, soda: 1, coat: 1 } } : { carne: { on: 1, soda: 0, coat: 1, squeeze: 0.4 * e(t, t_tapas, t_tapas + 1) } }));
gap(26, (t) => W(t), (t) => [
  <Pasos key="or" t={t} out={t_prim - 0.1} items={[{ at: t_desp, txt: "1 · AGUA + BICARBONATO" }, { at: t_desp + 0.8, txt: "2 · MAICENA" }]} y={860} size={46} />,
  <NoCard key="mp" t={t} at={t_prim} x={960} y={220} out={ms(27) + 0.3} txt="MAICENA PRIMERO" w={560} />,
  <Tag key="tp" t={t} at={t_tapas + 0.2} x={960} y={600} dx={300} dy={-200} text="EL AGUA NO ENTRA" col={BLUE} out={ms(27) + 0.3} size={52} />,
]);
// ---- 27 · el orden: 1 cda de soja clara · 1 cdita de maicena, no más (la Libreta va en AVFX)
gap(27, C("m12_soja_maicena_aceite", me(27) - 0.7));
// ---- 28 · "ese aceite del final: que las tajadas no se peguen… si se pegan hacen un bloque y el bloque hierve" · "¿y la clara de huevo?"
const t_sola = A("cada tajada sola", 468.0), t_bloque = A("el bloque hierve", 472.5), t_clara = A("y la clara de huevo", 474.5);
gap(28, C("w03_aceite", me(28) - 0.7), (t) => [
  <Tag key="sp" t={t} at={me(28) + 0.2} x={960} y={560} dx={-300} dy={-200} text="QUE NO SE PEGUEN" col={K.gold} out={t_sola + 1.6} size={56} />,
  <Sello key="bq" t={t} at={t_bloque - 0.6} text="BLOQUE = HIERVE" x={960} y={800} out={ms(29) + 0.3} rot={-6} size={110} />,
]);
void t_clara;
// ---- 29 · "la clara hace lo mismo que la maicena pero más gruesa… para el pollo y el pescado… media clara para medio kilo"
const t_grues = A("pero mas gruesa", 481.5), t_pollo = A("para el pollo y el pescado", 486.0), t_mclara = A("media clara para medio kilo", 490.5);
gap(29, C("m13_clara_pollo", me(29) - 0.7), (t) => [
  <Pensado key="cq" t={t} at={me(29) + 0.05} out={t_pollo - 0.2} x={960} y={240} text="«¿y la clara de huevo, señor Wong?»" size={80} />,
  <Tag key="pp" t={t} at={t_pollo + 0.2} x={960} y={560} dx={-280} dy={-200} text="POLLO · PESCADO" sub="LOS DELICADOS" col={K.cream} out={t_mclara} size={54} />,
  <Medida key="mc" t={t} at={t_mclara} out={ms(30) + 0.3} x={1380} y={320} big="½ CLARA" sub="PARA ½ KG" size={130} />,
]);
void t_grues;
// ---- 30 · "La clara sola, sin bicarbonato, no ablanda nada. El abrigo no es el secreto. El secreto está adentro." · la maicena primero, con apuro
const t_abno = A("el abrigo no es el secreto", 500.0), t_aden = A("el secreto esta adentro", 502.0), t_apuro = A("porque tenia apuro", 506.0), t_prob = A("probo una tajada", 509.0);
gap(30, C("a04_hora_pico", me(30) - 0.7), (t) => [
  <NoCard key="ab" t={t} at={t_abno - 0.2} x={960} y={220} out={t_aden - 0.1} txt="EL ABRIGO" w={460} />,
  <Pensado key="ad" t={t} at={t_aden} out={t_apuro - 0.4} x={960} y={540} text="el secreto está ADENTRO" size={110} col={K.gold} />,
  <Pensado key="ap" t={t} at={t_apuro - 0.2} out={ms(31) + 0.3} x={960} y={860} text="…una vez, con apuro, la maicena primero" size={74} />,
]);
void t_prob;
// ---- 31 · "Tres kilos de ajo, nunca más me olvidé del orden" → SECRETO 5: la carne pasa por aceite antes del wok
const t_3kg = A("tres kilos de ajo", 513.0), t_olv = A("nunca mas me olvide", 515.5), t_s5 = A("secreto numero 5", 517.6);
gap(31, C("m14_ajo_castigo", me(31) - 0.7), (t) => [
  <Medida key="3k" t={t} at={Math.max(me(31) + 0.05, t_3kg)} out={t_s5 - 0.3} x={1380} y={320} big="3 KG DE AJO" sub="TODA LA NOCHE" size={120} />,
  <Comanda key="c5" t={t} at={t_s5 - 0.2} out={ms(32) + 1.6} n={5} head="SECRETO" title={["pasa por aceite", "antes del wok"]} />,
]);
void t_olv;
// ---- 32 · "aceite tibio, unos 130 grados. La metés, la separás con los palillos… 30–40 segundos… todavía un poquito rosada, a escurrir"
const t_tib = A("no caliente tibio", 528.5), t_130 = A("130 grados", 531.5), t_pal = A("la separas con los palillos", 534.5), t_3040 = A("30 40 segundos", 536.0), t_ros = A("un poquito rosada", 539.5);
gap(32, C("m16_pasar_aceite", me(32) - 0.7), (t) => [
  <Medida key="13" t={t} at={Math.max(me(32) + 0.1, t_130 - 0.2)} out={t_3040 - 0.2} x={1400} y={300} big="130 °C" sub="TIBIO, NO CALIENTE" size={150} />,
  <Medida key="34" t={t} at={t_3040} out={ms(33) + 0.3} x={520} y={300} big="30–40 s" sub="ROSADITA → A ESCURRIR" size={140} />,
]);
void t_tib; void t_pal; void t_ros;
// ---- 33 · "Ese baño corto cocina la carne suavecito… la maicena se fija como una camisa fina… al final, fuego fuerte apenas un minuto"
const t_suav = A("cocina la carne suavecito", 544.5), t_cam = A("como una camisa", 547.5), t_1min = A("apenas un minuto con la salsa", 553.5);
shot(me(33) - 0.7, ms(34) + 0.4, VW.carne, push(VW.carne, 0.3, -5));
st(me(33) - 1, ms(34) + 0.5, (t) => ({ carne: { on: 1, soda: 1, coat: 1, heat: 0.35 + 0.3 * e(t, t_1min, t_1min + 1), squeeze: 0.1 } }));
gap(33, (t) => W(t), (t) => [
  <Pensado key="sv" t={t} at={Math.max(me(33) + 0.1, t_suav)} out={t_cam - 0.1} x={960} y={240} text="suavecito, sin violencia" size={96} />,
  <Tag key="cf" t={t} at={t_cam + 0.2} x={960} y={540} dx={-300} dy={-220} text="CAMISA FINA" sub="LA MAICENA SE FIJA" col={K.cream} out={t_1min} size={58} />,
  <Medida key="1m" t={t} at={t_1min} out={ms(34) + 0.3} x={1380} y={760} big="1 MIN" sub="FUEGO FUERTE + SALSA" size={130} />,
]);
// ---- 34 · el palillo: burbujitas chiquitas tranquilas = bien · tormenta de burbujas y humo = muy caliente · la maicena se quema
const t_burb = A("burbujitas chiquitas", 562.0), t_torm = A("una tormenta de burbujas", 566.5), t_quem = A("la maicena se quema", 570.1);
gap(34, C("m15_palillo_aceite", me(34) - 0.7), (t) => [
  <SiCard key="bt" t={t} at={me(34) + 0.1} x={560} y={180} out={ms(35) + 0.3} txt="BURBUJITAS TRANQUILAS" w={600} />,
  <NoCard key="tm" t={t} at={t_torm + 0.2} x={1360} y={180} out={ms(35) + 0.3} txt="TORMENTA + HUMO" w={520} cross={t_quem} />,
]);
void t_burb;
// ---- 35 · "Hay otro camino… gente que no quería fritura. Una olla con agua apenas hirviendo, una cucharada de aceite adentro. La carne 30 segundos"
const t_fri = A("no queria fritura", 579.5), t_olla = A("una olla con agua", 580.0), t_cacei = A("una cucharada de aceite adentro", 583.0), t_30s = A("la carne 30 segundos", 585.0);
gap(35, C("m17_agua_olla", me(35) - 0.7), (t) => [
  <Pensado key="sf" t={t} at={me(35) + 0.1} out={t_olla - 0.1} x={960} y={240} text="sin fritura" size={110} col={K.gold} />,
  <Pasos key="ol" t={t} out={ms(36) + 0.3} items={[{ at: t_olla, txt: "AGUA APENAS HIRVIENDO" }, { at: t_cacei, txt: "+ 1 CDA DE ACEITE" }, { at: t_30s, txt: "30 s" }]} y={860} size={44} />,
]);
void t_fri;
// ---- 36 · "un poquito menos de brillo, nada más" → SECRETO 6: el fuego final es corto y la sartén no se llena · la carne ya casi cocida
const t_s6 = A("secreto numero 6", 595.0), t_casi = A("la carne ya esta casi cocida", 601.0);
shot(me(36) - 0.7, ms(37) + 0.4, VW.wokLow, push(VW.wokLow, 0.25, -3));
st(me(36) - 1, ms(37) + 0.5, () => ({ fire: 1, smoke: 0.5, heatGlow: 0.6, tickets: 8 }));
gap(36, (t) => W(t), (t) => [
  <Comanda key="c6" t={t} at={Math.max(me(36) - 0.1, t_s6 - 0.2)} out={ms(37) + 1.2} n={6} head="SECRETO" title={["fuego corto,", "sartén sin llenar"]} />,
]);
void t_casi;
// ---- 37 · "la sartén más pesada… caliente de verdad: la gota baila y desaparece. Aceite, ajo, la carne, la salsa, un minuto y al plato"
const t_gota = A("la gota baila", 613.5), t_acei = A("una cucharada de aceite ajo", 617.0);
gap(37, C("w02_wok_humea", me(37) - 0.7), (t) => [
  <Tag key="gb" t={t} at={Math.max(me(37) + 0.2, t_gota)} x={960} y={560} dx={-300} dy={-220} text="LA GOTA BAILA" sub="Y DESAPARECE" col={BLUE} out={t_acei - 0.1} size={56} />,
  <Pasos key="ps" t={t} out={ms(38) + 0.3} items={[{ at: t_acei, txt: "ACEITE" }, { at: t_acei + 0.6, txt: "AJO" }, { at: t_acei + 1.2, txt: "CARNE" }, { at: t_acei + 1.8, txt: "SALSA" }, { at: t_acei + 2.6, txt: "1 MIN · AL PLATO" }]} y={860} size={42} />,
]);
// ---- 38 · "La sartén llena, medio kilo de carne cruda, todo junto… enfría la sartén, larga el jugo y se cocina hervida. Gris."
const t_llena = A("la sarten llena", 624.0), t_enfr = A("la carne enfria la sarten", 629.0), t_herv = A("se cocina hervida", 632.0), t_gris3 = A("gris", 633.2, );
gap(38, C("m22_sarten_llena", me(38) - 0.7), (t) => [
  <NoCard key="sl" t={t} at={me(38) + 0.1} x={960} y={200} out={t_enfr} txt="½ KG · TODO JUNTO" w={560} cross={me(38) + 1.2} />,
  <Tag key="ef" t={t} at={t_enfr + 0.2} x={960} y={560} dx={-300} dy={-220} text="ENFRÍA LA SARTÉN" sub="LARGA EL JUGO" col={BLUE} out={t_herv + 0.4} size={54} />,
  <Sello key="gr" t={t} at={t_gris3} text="GRIS" x={960} y={780} out={ms(39) + 0.3} rot={-8} size={150} />,
]);
void t_llena;
// ---- 39 · el fuego del restaurante es 3-4 veces el de casa → en tandas: 250 gramos por tanda · que vuelva a calentar · escuchá el sonido
const t_tand = A("se cocina en tandas", 642.0), t_250 = A("250 gramos por tanda", 643.0), t_vuel = A("vuelva a calentar", 648.5), t_son = A("escucha el sonido", 650.0);
gap(39, C("m23_tanda_hierro", me(39) - 0.7), (t) => [
  <Medida key="25" t={t} at={Math.max(me(39) + 0.1, t_250)} out={ms(40) + 0.3} x={1380} y={300} big="250 g" sub="POR TANDA, COMO MUCHO" size={150} />,
  <Pasos key="tn" t={t} out={ms(40) + 0.3} items={[{ at: t_vuel - 0.4, txt: "1ª TANDA" }, { at: t_vuel + 0.3, txt: "QUE VUELVA A CALENTAR" }, { at: t_vuel + 1.0, txt: "2ª TANDA" }]} y={880} size={40} />,
]);
void t_tand; void t_son;
// ---- 40 · "si suena como una pava… ya perdiste. Sacá la mitad." → SECRETO 7: la salsa del restaurante (carne con brócoli) · tacho de 5 litros
const t_mitad = A("saca la mitad", 658.0), t_s7 = A("secreto numero 7", 659.5), t_5l = A("un tacho de 5 litros", 670.0);
shot(me(40) - 0.7, ms(41) + 0.4, VW.soja, push(VW.soja, 0.25, -3));
st(me(40) - 1, ms(41) + 0.5, () => ({ ...WK, glowSoja: 3 }));
gap(40, (t) => W(t), (t) => [
  <Sello key="mi" t={t} at={me(40) + 0.05} text="SACÁ LA MITAD" x={960} y={780} out={t_s7 - 0.2} rot={-6} size={110} />,
  <Comanda key="c7" t={t} at={t_s7 - 0.2} out={t_5l - 0.3} n={7} head="SECRETO" title={["la salsa del", "restaurante"]} />,
  <Medida key="5l" t={t} at={t_5l} out={ms(41) + 0.3} x={960} y={760} big="5 LITROS" sub="TODAS LAS MAÑANAS" size={140} />,
]);
void t_mitad;
// ---- 41 · en medida de casa para ½ kg: 2 cdas soja clara · 1 cda ostras · ½ cdita soja oscura (la Libreta va en AVFX)
gap(41, C("m18_salsa_vaso", me(41) - 0.7));
// ---- 42 · "todo en un vasito antes de prender el fuego… el fuego final dura un minuto, no hay tiempo de abrir frascos"
const t_vaso = A("en un vasito antes", 694.0), t_dura1 = A("dura un minuto", 698.6), t_frasc = A("no hay tiempo de abrir frascos", 699.5);
shot(me(42) - 0.7, ms(43) + 0.4, VW.wide2, push(VW.wide2, 0.3, -4));
st(me(42) - 1, ms(43) + 0.5, () => ({ ...WK, fire: 0.4 }));
gap(42, (t) => W(t), (t) => [
  <Pensado key="ft" t={t} at={t_frasc} out={ms(43) + 0.3} x={600} y={880} text="no hay tiempo de abrir frascos" size={80} col={K.gold} />,
]);
void t_vaso; void t_dura1;
// ---- 43 · el brócoli: no va crudo (cuando está listo, la carne ya es una suela) · ramitos de un bocado · 1 minuto en agua hirviendo con sal y aceite
const t_crudo = A("no va crudo al wok", 710.0), t_suela = A("ya es una suela", 716.0), t_ram = A("ramitos chicos", 718.0);
gap(43, C("m19_brocoli", me(43) - 0.7), (t) => [
  <NoCard key="cr" t={t} at={t_crudo} x={960} y={200} out={t_ram - 0.2} txt="CRUDO AL WOK" w={480} />,
  <Sello key="su" t={t} at={t_suela} text="UNA SUELA" x={960} y={800} out={t_ram} rot={-6} size={120} />,
  <Medida key="1m" t={t} at={t_ram + 1.0} out={ms(44) + 0.3} x={1380} y={300} big="1 MIN" sub="AGUA HIRVIENDO · SAL · GOTAS DE ACEITE" size={130} />,
]);
// ---- 44 · "deja ese verde brillante como de foto… espera al costado… en el wok entra al final, sólo para calentarse"
const t_verde = A("ese verde brillante", 727.0), t_cost = A("espera al costado", 731.0), t_calen = A("solamente para calentarse", 735.5);
gap(44, C("m20_wok_carne_brocoli", me(44) - 0.7), (t) => [
  <Tag key="vb" t={t} at={me(44) + 0.1} x={960} y={540} dx={-300} dy={-220} text="VERDE BRILLANTE" col="#5fd17a" out={t_cost} size={58} />,
  <Pensado key="ca" t={t} at={t_calen - 1.2} out={ms(45) + 0.3} x={960} y={880} text="entra al final, sólo a calentarse" size={84} />,
]);
void t_verde;
// ---- 45 · Lau: "el que busca la soja con el wok prendido ya quemó el ajo" · la salsa por el BORDE, no en el medio · chilla y carameliza
const t_borde = A("la salsa se echa por el borde", 746.0), t_medio = A("no en el medio", 748.5), t_chilla = A("la salsa chilla", 751.5);
gap(45, C("m21_salsa_borde_carne", me(45) - 0.7), (t) => [
  <Fortuna key="lq" t={t} at={me(45) - 0.3} out={t_borde - 0.2} text="El que busca la soja con el wok prendido, ya quemó el ajo." who="EL VIEJO LAU" y={860} size={46} />,
  <NoCard key="md" t={t} at={t_medio} x={560} y={200} out={ms(46) + 0.3} txt="EN EL MEDIO" />,
  <SiCard key="bd" t={t} at={t_medio + 0.5} x={1360} y={200} out={ms(46) + 0.3} txt="POR EL BORDE" />,
  <Tag key="ch" t={t} at={t_chilla} x={960} y={600} dx={280.0} dy={-200} text="CHILLA · CARAMELIZA" col={K.gold} out={ms(46) + 0.3} size={50} />,
]);
// ---- 46 · ERROR 1: dejar la carne con bicarbonato toda la noche · después de 1-2 horas, blanda como esponja, como carne de lata
const t_e1 = A("error 1", 768.5), t_noche = A("toda la noche", 771.0), t_esponja = A("blanda como esponja", 775.0);
shot(me(46) - 0.7, ms(47) + 0.4, VW.bandejas, push(VW.bandejas, 0.25, -3));
st(me(46) - 1, ms(47) + 0.5, () => ({ trays: 6, frio: 1, tickets: 6 }));
gap(46, (t) => W(t), (t) => [
  <Comanda key="e1" t={t} at={Math.max(me(46) - 0.1, t_e1 - 0.3)} out={t_noche + 1.5} n="✗1" head="ERROR" title={["bicarbonato", "toda la noche"]} sc={0.9} />,
  <Medida key="12" t={t} at={t_noche + 1.6} out={ms(47) + 0.3} x={960} y={300} big="+1–2 HORAS" sub="BLANDA COMO ESPONJA" col="#b9aea6" size={130} />,
]);
void t_esponja;
// ---- 47 · "20 minutos, media hora como máximo" · ERROR 2: cocinarla de más · ¿ya pasó por el aceite o el agua? en el wok final es un minuto
const t_max = A("media hora como maximo", 780.0), t_e2 = A("error 2", 782.0), t_wok1 = A("en el wok final es un", 788.0);
gap(47, C("w07_wok_hei", me(47) - 0.7), (t) => [
  <Medida key="mx" t={t} at={me(47) + 0.05} out={t_e2 - 0.2} x={960} y={300} big="20–30 MIN" sub="COMO MÁXIMO" size={140} />,
  <NoCard key="e2" t={t} at={t_e2} x={960} y={200} out={ms(48) + 0.3} txt="✗2 · COCINARLA DE MÁS" w={680} cross={1e9} />,
]);
void t_max; void t_wok1;
// ---- 48 · "se aprieta y se seca. El bicarbonato ayuda, no hace milagros." · ERROR 3: la carne equivocada · la de guisar: nervio, cartílago
const t_mil = A("no hace milagros", 794.5), t_e3 = A("error 3", 796.0), t_guis = A("la carne de guisar", 803.0), t_nerv = A("nervio cartilago", 806.0);
gap(48, C("m26_carnes_buena_mala", me(48) - 0.7), (t) => [
  <Pensado key="mg" t={t} at={me(48) + 0.05} out={t_e3 - 0.2} x={960} y={240} text="ayuda, no hace milagros" size={96} />,
  <NoCard key="e3" t={t} at={t_e3} x={960} y={200} out={t_guis} txt="✗3 · LA CARNE EQUIVOCADA" w={720} cross={1e9} />,
  <Tag key="ng" t={t} at={t_guis + 0.3} x={560} y={560} dx={-120} dy={-200} text="DE GUISAR" sub="NERVIO · CARTÍLAGO" col="#b9aea6" out={ms(49) + 0.3} size={50} />,
]);
void t_mil; void t_nerv;
// ---- 49 · "fibra larga y poca grasa dura: falda, vacío, cuadril, peceto" · si quedó dura: mirá la tajada — ¿hilos largos a lo largo?
const t_lista = A("falda vacio cuadril", 813.0), t_barato = A("lo mas barato de esa lista", 815.5), t_tajada = A("mira la tajada de cerca", 822.0);
gap(49, C("m04_corte_mal", me(49) - 0.7), (t) => [
  <Chips key="ls" t={t} at={Math.max(me(49) + 0.05, t_lista)} items={["FALDA", "VACÍO", "CUADRIL", "PECETO"]} out={t_tajada - 0.2} y={180} />,
  <Tag key="lb" t={t} at={t_barato + 0.2} x={960} y={560} dx={300} dy={-200} text="LO MÁS BARATO" sub="ANDA PERFECTO" col={K.gold} out={t_tajada} size={54} />,
]);
// ---- 50 · "la cortaste a favor de la fibra: no es tu culpa, es el cuchillo" · hablemos de plata: no hay malos de la película, hay cuentas
const t_culpa = A("no es tu culpa es el cuchillo", 829.0), t_plata = A("hablemos de plata", 833.0), t_cuentas = A("hay cuentas", 836.5);
shot(me(50) - 0.7, ms(51) + 0.4, VW.cajas, push(VW.cajas, 0.25, -3));
st(me(50) - 1, ms(51) + 0.5, () => ({ ...WK, tickets: 11 }));
gap(50, (t) => W(t), (t) => [
  <Pensado key="cu" t={t} at={Math.max(me(50) + 0.05, t_culpa)} out={t_plata - 0.2} x={960} y={540} text="no es tu culpa: es el cuchillo" size={96} col={K.gold} />,
  <Comanda key="pl" t={t} at={t_plata} out={ms(51) + 0.5} n="$" head="LA CUENTA" title={["no hay malos,", "hay cuentas"]} sc={0.9} />,
]);
void t_cuentas;
// ---- 51 · el plato del restaurante trae 150 g de carne · en casa: 1 kg de falda + ½ cdita de bicarbonato (menos que un caramelo) + soja + brócoli = 6 platos
gap(51, C("w14_caja", me(51) - 0.7));
// ---- 52 · "Es la misma carne barata que usaba mi patrón. La diferencia nunca fue la carne, fue la lata blanca sin etiqueta." · los domingos…
const t_misma = A("es la misma carne barata", 862.5), t_dif = A("la diferencia nunca fue la carne", 866.0), t_lata2 = A("fue la lata blanca", 868.0), t_dom = A("los domingos", 871.5);
shot(me(52) - 0.7, t_dom, VW.lata, push(VW.lata, 0.3, -4));
shot(t_dom + 0.6, ms(53) + 0.4, VW.bandejas, push(VW.bandejas, 0.2));
st(me(52) - 1, ms(53) + 0.5, (t) => (t < t_dom + 0.3 ? { ...WK, glowPolvo: t > t_lata2 ? 4 : 0 } : { trays: 6, frio: 1 }));
gap(52, (t) => W(t), (t) => [
  <Pensado key="df" t={t} at={Math.max(me(52) + 0.05, t_dif)} out={t_lata2 - 0.1} x={960} y={240} text="nunca fue la carne" size={110} />,
  <Sello key="lb" t={t} at={t_lata2 + 0.3} text="LA LATA BLANCA" x={960} y={820} out={t_dom} rot={-6} size={120} col={K.blue} />,
  <Tag key="dm" t={t} at={t_dom + 0.3} x={960} y={540} dx={-280} dy={-200} text="LOS DOMINGOS" sub="1 KG CONTRA LA FIBRA" col={K.gold} out={ms(53) + 0.3} size={54} />,
]);
void t_misma;
// ---- 53 · "10 minutos cada noche, más rápido que el delivery" · esta semana: no los 7 de una — sólo dos cosas
const t_10 = A("minutos cada noche", 884.5), t_deliv = A("esperar el delivery", 887.5), t_dos = A("cambia solo dos cosas", 891.0);
shot(me(53) - 0.7, ms(54) + 0.4, VW.comandas, push(VW.comandas, 0.25, -4));
st(me(53) - 1, ms(54) + 0.5, () => ({ ...WK, tickets: 10 }));
gap(53, (t) => W(t), (t) => [
  <Semana key="sm" t={t} out={t_dos - 0.2} x={960} y={540} marks={[{ at: me(53) - 0.2, d: 6, txt: "cortar + marinar", col: K.jade }, { at: me(53) + 0.2, d: 0, txt: "carne con brócoli", col: K.red }, { at: me(53) + 0.6, d: 2, txt: "carne con verdeo", col: K.red }]} />,
  <Medida key="10" t={t} at={t_10} out={t_dos - 0.2} x={1500} y={200} big="10 MIN" sub="MÁS RÁPIDO QUE EL DELIVERY" size={110} />,
  <Libreta key="2c" t={t} out={ms(54) + 0.4} x={960} y={160} title="ESTA SEMANA · SÓLO DOS COSAS" rows={[{ at: t_dos + 0.2, amt: "1.", item: "cortá contra la fibra" }, { at: ms(54) - 1.0, amt: "2.", item: "½ cdita bicarbonato + 3 cdas agua" }]} w={980} />,
]);
void t_deliv;
// ---- 54 · "vas a ver la diferencia en el primer bocado… la persona que te discutió va a pedir más" · ¿cuál es tu error de siempre?
const t_boc = A("en el primer bocado", 901.0), t_pedir = A("va a pedir mas", 904.5), t_q = A("cual es tu error de siempre", 907.5), t_gr = A("se te pone gris", 910.0);
gap(54, C("m24_plato_final", me(54) - 0.7, 0, [1.0, 1.07]), (t) => [
  <Pensado key="pb" t={t} at={t_boc} out={t_pedir + 1.2} x={960} y={250} text="…y va a pedir más" size={100} col={K.gold} />,
  <Comanda key="qq" t={t} at={t_q - 0.4} out={ms(55) + 2.0} n="?" head="CONTAME ABAJO" title={["¿cuál es TU error", "de siempre con", "la carne salteada?"]} sc={0.95} />,
]);
void t_gr;
// ---- 55 · "lo arreglo en un video" · suscribite + campanita · el próximo: los 3 secretos del arroz frito del restaurante
const t_arr = A("lo arreglo en un video", 917.5), t_sus = A("suscribete", 919.5), t_camp = A("toca la campanita", 921.0), t_arroz = A("del arroz frito", 924.5);
shot(me(55) - 0.7, ms(56) + 0.4, VW.wokTop, push(VW.wokTop, 0.25, -4));
st(me(55) - 1, ms(56) + 0.5, () => ({ ...WK, fire: 0.9, smoke: 0.5, hei: 0.4, arroz: { rice: 1, brown: 1 }, egg: 1, eggBrown: 0.3, peas: 1, greens: 1 }));
gap(55, (t) => W(t), (t) => [
  <Suscribir key="sb" t={t} at={Math.min(me(55) - 0.2, t_sus)} press={t_sus + 0.6} out={t_arroz - 0.3} x={680} y={800} />,
  <Campana key="cp" t={t} at={t_sus + 0.6} ring={t_camp + 0.2} out={t_arroz - 0.3} x={1380} y={300} />,
  <Tag key="ar" t={t} at={t_arroz - 0.3} x={960} y={560} dx={300.0} dy={-220} text="PRÓXIMO VIDEO" sub="LOS 3 SECRETOS DEL ARROZ FRITO" col={K.gold} out={ms(56) + 0.4} size={56} />,
]);
void t_arr;
// ---- 56 · "El viejo Lau murió hace muchos años, nunca escribió nada, todo lo que sabía estaba en sus manos. Yo no quiero que esto se pierda conmigo"
const t_murio = A("el viejo lau murio", 933.5), t_manos = A("estaba en sus manos", 937.5), t_pierda = A("no quiero que esto se pierda", 939.0);
gap(56, C("c01_atardecer", me(56) - 0.7, 0, [1.0, 1.06]), (t) => [
  <Pensado key="mn" t={t} at={t_manos} out={t_pierda - 0.2} x={960} y={880} text="todo estaba en sus manos" size={92} col={K.gold} />,
]);
void t_murio;
// ---- 57 · cierre: "Andá a la cocina, amigo, y cortá contra la fibra." → negro
gap(57, (t) => W(t), (t) => [<AbsoluteFill key="fo" style={{ background: "#000", opacity: e(t, me(57) - 0.4, FULL_END) }} />]);

keys.sort((a, b) => a.t - b.t);
setKeys(keys);

// línea de tiempo de las tomas reales (para la mezcla: el sonido nativo del clip suena donde se ve). [k, desde, hasta, segundo del clip en "desde"]
export const CLIP_TL = (): [string, number, number, number][] => {
  const out: [string, number, number, number][] = [];
  const walk = (bg: BG, a: number, b: number) => {
    if (bg.parts) { walk(bg.parts[0], a, Math.min(b, bg.parts[2])); walk(bg.parts[1], Math.max(a, bg.parts[2] - 0.6), b); return; }
    if (bg.clip && b > a) out.push([bg.clip.k, a, b, bg.clip.from + (a - bg.clip.a)]);
  };
  G.forEach((g) => walk(g.bg, g.a - 0.6, g.b));
  return out;
};

// ---------------- piezas sobre el AVATAR (al costado, sin tapar la cara) y las que cruzan ventanas ----------------
const t_or = A("primero el agua con el bicarbonato", 447.5), t_soc = A("una cucharada de salsa de soja clara", 453.0), t_mzc = A("una cucharadita de maicena no", 456.0), t_acc = A("una cucharada de aceite por encima", 459.5);
const t_r1 = A("dos cucharadas de salsa de", 676.5), t_r2 = A("una cucharada de salsa de ostras", 679.0), t_r3 = A("media cucharadita de salsa de soja", 681.5), t_r4 = A("una cucharadita de azucar", 686.5), t_r5 = A("cucharadita de maicena y cuatro", 688.8), t_r6 = A("cuatro cucharadas de agua", 690.0);
const t_pr = A("un plato de carne con brocoli en el restaurante", 838.0), t_150 = A("150 gramos de carne", 847.0), t_kg = A("con un kilo de falda", 849.0), t_bic = A("menos que un caramelo", 853.5), t_soy = A("un poco de salsa de soja", 855.0), t_6 = A("seis platos por el precio", 858.5);
const AVFX: ((t: number) => React.ReactNode)[] = [
  (t) => <LowerThird key="lt" t={t} at={A("me llamo wong", 63.4)} out={me(4)} name="SEÑOR WONG" l2="66 AÑOS · 40 EN LA COCINA" l2at={A("tengo 66 anos", 64.4)} />,
  (t) => <Sello key="bc" t={t} at={A("bicarbonato de sodio", 249.4)} text="BICARBONATO DE SODIO" x={960} y={930} out={me(15)} rot={-3} size={84} col={K.blue} />,
  (t) => <Tag key="ct" t={t} at={A("la cajita que vos tenes", 251.6)} x={1500} y={420} dx={-120.0} dy={-160} text="LA CAJITA" sub="DE LA ALACENA" col={K.cream} out={me(15)} size={46} />,
  (t) => <Pensado key="co" t={t} at={A("como gente en un colectivo", 283.0)} out={me(17)} x={1460} y={240} text="un colectivo lleno" size={78} />,
  (t) => <Medida key="20m" t={t} at={A("20 minutos", 334.0)} out={me(20) - 0.2} x={1520} y={300} big="20 MIN" sub="LAS DOS" size={120} />,
  (t) => <Libreta key="3c" t={t} out={t_prim - 0.2} x={1480} y={120} title="EL ABRIGO SIRVE PARA" sc={0.8} rows={[{ at: A("uno protege la superficie", 419.0), amt: "1.", item: "proteger del fuego" }, { at: A("dos le da ese brillo", 424.0), amt: "2.", item: "el brillo sedoso" }, { at: A("y tres cuando llega la salsa", 429.2), amt: "3.", item: "que la salsa se agarre" }]} />,
  (t) => <Libreta key="or" t={t} out={ms(28) + 0.6} x={1480} y={110} title="EL ORDEN · ½ KG" sc={0.78} rows={[{ at: t_or, amt: "1.", item: "agua + bicarbonato · 20 min" }, { at: t_soc, amt: "2.", item: "1 cda soja clara" }, { at: t_mzc, amt: "3.", item: "1 cdita maicena, no más" }, { at: t_acc, amt: "4.", item: "1 cda aceite arriba" }]} w={700} />,
  (t) => <Libreta key="sa" t={t} out={me(42) - 0.4} x={1480} y={90} title="LA SALSA · ½ KG DE CARNE" sc={0.74} rows={[{ at: t_r1, amt: "2 cdas", item: "soja clara" }, { at: t_r2, amt: "1 cda", item: "salsa de ostras" }, { at: t_r3, amt: "½ cdita", item: "soja oscura" }, { at: t_r4, amt: "1 cdita", item: "azúcar" }, { at: t_r5, amt: "1 cdita", item: "maicena" }, { at: t_r6, amt: "4 cdas", item: "agua o caldo" }]} w={680} />,
  (t) => <Cuenta$ key="rs" t={t} out={ms(52) + 0.4} x={480} y={130} title="RESTAURANTE" rows={[{ at: t_pr, item: "1 PLATO", v: "= 1 KG DE FALDA" }, { at: t_150, item: "CARNE ADENTRO", v: "150 g" }]} total={{ at: t_150 + 1.0, v: "1 PLATO" }} rot={-2} sc={0.82} />,
  (t) => <Cuenta$ key="cs" t={t} out={ms(52) + 0.4} x={1440} y={110} title="EN TU CASA" col={K.jade} rows={[{ at: t_kg, item: "1 KG DE FALDA", v: "✓" }, { at: t_bic, item: "½ CDITA BICARBONATO", v: "< 1 caramelo" }, { at: t_soy, item: "SOJA + BRÓCOLI", v: "✓" }]} total={{ at: t_6, v: "6 PLATOS" }} rot={2} sc={0.82} />,
  (t) => <Medida key="wk" t={t} at={A("anda a la cocina", 944.5)} out={FULL_END} x={1500} y={880} big="CONTRA LA FIBRA" sub="Y MEDIA CUCHARADITA" size={80} />,
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
