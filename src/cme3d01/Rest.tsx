// cme3d01 · DEL 1:39 AL FINAL (99 → 414,55 s). Misma vara que el minuto 1 (gary01): UN mundo (la cuadra + el garaje de
// Claudio, barrio3d.tsx) con UNA cámara que viaja tapada por el avatar o por las tomas, las piezas 2.5D en una capa aparte
// que cruza las transiciones, y CERO cortes secos. El CTA2 (pág. 56) entra y sale por el mismo mundo.
// Todo anclado a la palabra con at("frase") sobre los tiempos reales de la voz (caps.json). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PT, screenOf } from "./barrio3d";
import { World, Desc, Stamp } from "./Min1";
import { Cta2Body } from "./Cta2";
import { BigNum, COL, DrawX, Flash, FONT, HeatHaze, LowerThird, P, Portal, Receipt, Tag, Thermo, Vid, e, ei, s } from "./lib";
import { Versus, Words, CheckList } from "./comps2";
import { SocBadge, Eq, ErrCard, Paso, BulbRow, Formula } from "./rest_fx";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./rest_avail.json";

export const T0 = 99.0, TEND = 414.55;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// ---------- at("frase", después_de): segundo exacto en que la voz dice la frase ----------
const norm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9%]/g, "");
const WORDS = (CAPS as [string, number][]).flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: norm(x), t: ms / 1000 + j * 0.3 }))).filter((x) => x.w);
const at = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].t < after - 0.01) continue;
    let ok = true;
    for (let j = 0; j < ws.length; j++) if (!WORDS[i + j] || WORDS[i + j].w !== ws[j]) { ok = false; break; }
    if (ok) return WORDS[i].t;
  }
  throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
};

// ---------- tomas: mp4 de agnes si llegó; si no la foto con movimiento 2.5D ----------
const HAS = AVAIL as { clips: string[]; reel: boolean; dur?: Record<string, number> };
const Clip: React.FC<{ k: string; a: number; z?: [number, number]; dur?: number; pan?: number }> = ({ k, a, z = [1.04, 1.13], dur = 7, pan = 0 }) => {
  const t = useCurrentFrame() / 30, q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  // clip agnes (3 s en cámara lenta) ARRIBA de su foto: si el plano dura más que el clip, se funde a la foto y no queda en negro
  const cd = HAS.dur?.[k] ?? 3, img = <Img src={staticFile(P + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  const inner = HAS.clips.includes(k) ? <>{img}<Sequence from={s(a)} durationInFrames={s(cd)} layout="none"><AbsoluteFill style={{ opacity: 1 - e(t, a + cd - 0.35, a + cd - 0.05) }}><Vid id={"ag_" + k} /></AbsoluteFill></Sequence></> : img;
  return <AbsoluteFill style={{ transform: `scale(${sc}) translateX(${pan * (q - 0.5)}px)` }}>{inner}</AbsoluteFill>;
};

// ---------- avatar: las ventanas pagadas del reel (preroll 10 cuadros, cola 0,65 s para salir con transición) ----------
const WINS = (AVW as { ms: number; me: number; off: number }[]);
const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = HAS.reel ? WINS.filter((w) => w.ms >= T0 - 1).map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.62)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 44% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
// blur del avatar / del mundo mientras hay una pieza pesada encima: tramos [desde, hasta]
const soft = (t: number, spans: [number, number][], amt = 14) => spans.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 0.35) * (1 - e(t, b, b + 0.35))), 0) * amt;
const Wd: React.FC<{ t: number; blur?: number }> = ({ t, blur = 0 }) => (
  <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - blur / 40})` : undefined, transform: blur > 0.2 ? "scale(1.03)" : undefined }}><World t={t} /></AbsoluteFill>
);

// ---------- transiciones entre bases ----------
type Tr = "whip" | "whipL" | "portal" | "zoom" | "flip" | "push" | "light" | "cut";
const DUR: Record<Tr, number> = { whip: 0.5, whipL: 0.5, portal: 0.6, zoom: 0.55, flip: 0.6, push: 0.55, light: 0.5, cut: 0 };
const HB: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>;
const transition = (tr: Tr, k: number, prev: React.ReactNode, cur: React.ReactNode, p: [number, number]) => {
  const L: React.ReactNode[] = [];
  if (tr === "whip" || tr === "whipL") {
    const out = k < 0.5, k2 = out ? k * 2 : (1 - k) * 2, b = Math.round(90 * k2), d = tr === "whip" ? -1 : 1, id = `wb${b}`;
    L.push(<AbsoluteFill key="w" style={{ transform: `translateX(${(out ? d : -d) * k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={0} /> : null}{out ? prev : cur}</AbsoluteFill>);
    if (k2 > 0.4) L.push(<AbsoluteFill key="wl" style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.5) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} />);
  } else if (tr === "portal") {
    L.push(<AbsoluteFill key="pp">{prev}</AbsoluteFill>);
    L.push(<Portal key="pc" x={p[0]} y={p[1]} r={ei(k, 0, 1) * 0.999 + 0.001}>{cur}</Portal>);
  } else if (tr === "zoom") {
    const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k)), id = `zb${b}`;
    L.push(<AbsoluteFill key="zc" style={{ transform: `scale(${1.35 - 0.35 * z})` }}>{cur}</AbsoluteFill>);
    L.push(<AbsoluteFill key="zp" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, transform: `scale(${1 + 3.2 * z})`, opacity: 1 - e(k, 0.35, 0.9), filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={b} /> : null}{prev}</AbsoluteFill>);
  } else if (tr === "flip") {
    const out = k < 0.5, a = out ? ei(k * 2, 0, 1) * 88 : (1 - ei((k - 0.5) * 2, 0, 1)) * -88; // 88 y no 90: de canto el canvas mide 0 y ThreeCanvas nunca se crea (chunk 29 del farm)
    L.push(<AbsoluteFill key="fb" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a222c, #05070a)" }} />);
    L.push(<AbsoluteFill key="ff" style={{ perspective: 2200 }}><AbsoluteFill style={{ transform: `translateZ(${-Math.sin(Math.PI * k) * 500}px) rotateY(${a}deg)`, borderRadius: 30 * Math.sin(Math.PI * k), overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.8)" }}>{out ? prev : cur}</AbsoluteFill></AbsoluteFill>);
  } else if (tr === "push") {
    const z = ei(k, 0, 1), b = Math.round(60 * Math.sin(Math.PI * k)), id = `pb${b}`;
    L.push(<AbsoluteFill key="up" style={{ transform: `translateY(${-z * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={0} y={b} /> : null}{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="uc" style={{ transform: `translateY(${(1 - z) * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{cur}</AbsoluteFill>);
  } else if (tr === "light") {
    L.push(<AbsoluteFill key="lp">{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="lc" style={{ opacity: e(k, 0.25, 0.75) }}>{cur}</AbsoluteFill>);
    const g = Math.sin(Math.PI * k);
    L.push(<AbsoluteFill key="ll" style={{ background: `radial-gradient(ellipse 80% 70% at ${30 + 40 * k}% 45%, rgba(255,236,200,${0.95 * g}), rgba(255,170,90,${0.35 * g}) 50%, transparent 80%)`, mixBlendMode: "screen" }} />);
  } else L.push(<AbsoluteFill key="c">{cur}</AbsoluteFill>);
  return L;
};

// ---------- anclas (segundo exacto de cada frase) ----------
const A = {
  p59: at("59%", 100), p41: at("41%", 104), tercer: at("ni al tercer", 110), pinza: at("agarre la pinza", 112), medir: at("a medir todo", 114),
  refri: at("no fue el refrigerador", 118), inv: at("fue el inversor", 119), cajita: at("la cajita", 123), v12: at("los 12 voltios", 124), nada: at("no tenga nada", 128),
  gasta: at("prendido gasta", 131), w15: at("15 vatios", 132), nadaP: at("parece nada", 134), por24: at("por 24", 136), h360: at("son 360", 138), tercio: at("casi un tercio", 140),
  tirado: at("tirado", 142), err1: at("primer error", 144), ridic: at("ridiculo", 147), apagas: at("lo apagas", 148), boton: at("un boton", 150), err2: at("segundo error", 151),
  noche1: at("la primera noche", 153), am3: at("a las 3 de la manana", 155), compr: at("compresor", 156), cable: at("con el cable", 160), finito: at("finito", 162), fusible0: at("sin fusible", 163),
  borne: at("toque el borne", 164), quemaba: at("quemaba", 165), a70: at("70 amperios", 167), mitad: at("aguanta la mitad", 170), dormido: at("me quedo dormido", 172),
  garaje: at("se quema el garaje", 175), mm6: at("6 milimetros", 177), term: at("terminales prensados", 179), fus125: at("fusible de 125", 180), nunca: at("nunca mas", 184),
  exacta: at("la bateria exacta", 186), litio: at("es de litio", 190), lifepo: at("lifepo", 192), v12b: at("12 voltios y 100", 194), wh1280: at("1280", 196), focos: at("12 focos", 200),
  unaHora: at("una hora", 203), noMucho: at("no es mucho", 204), orden: at("el orden importa", 206), costo: at("me costo", 209), b280: at("280", 212), i120: at("120", 214),
  c35: at("35", 220), c60: at("60", 225), p28: at("la pinza 28", 226), m12: at("enchufe 12", 228), t535: at("535", 230), gen: at("menos que un generador", 234),
  sinGas: at("sin gasolina", 237), ruido: at("sin ruido", 238), humo: at("sin humo", 239), ahoraOrden: at("y ahora el orden", 240), truco: at("el truco", 242),
  p1: at("primero el refrigerador", 244), noTodo: at("no todo el dia", 246), botellas: at("botellas de agua", 247), m40: at("40 minutos", 249), h4: at("cada 4 horas", 250),
  puerta: at("la puerta cerrada", 252), termo: at("el termometro", 254), g35: at("entre 3 y 5", 255), w200: at("200 vatios", 256), w1000: at("1000", 259),
  p2: at("segundo las luces", 260), led: at("tres focos led", 262), de7: at("de 7 a 11", 265), p3: at("tercero el internet", 267), router: at("el router", 269), w9: at("9 vatios", 270),
  dosH: at("dos horas", 272), cuatro: at("cuatro a la noche", 274), p4: at("cuarto el ventilador", 276), usb: at("uno usb", 278), chicos: at("la cama de los chicos", 281),
  w330: at("330", 283), w520: at("520", 287), midiendo: at("midiendo", 289), descubri: at("descubri otra cosa", 292), volvio0: at("cuando volvio la luz", 294), mitadF: at("mitad de mi factura", 297),
  burlete: at("burlete", 300), calent: at("el calentador", 301), termost: at("termostato", 302), aire: at("el aire", 303), filtro: at("filtro", 304),
  volvamos: at("volvamos al apagon", 326), dia3: at("el tercer dia", 327), h72: at("72 horas", 330), volvio: at("volvio a dar", 333), luz: at("la luz", 334), miré: at("mire la bateria", 335),
  p8: at("8%", 336), llego: at("llego", 337), carne: at("la carne", 339), leche: at("leche", 341), remedios: at("los remedios", 342), chicos3: at("los chicos durmieron", 344),
  vecino: at("el vecino", 347), u150: at("150", 350), bolsa: at("una sola bolsa", 353), empieza: at("empieza esta semana", 356), sinComprar: at("sin comprar", 357),
  medidor: at("el medidor de enchufe", 360), u12: at("12 dolares", 361), h24: at("24 horas", 364), partida: at("punto de partida", 367), divide: at("divide", 369),
  cuantos: at("cuantos dias", 372), antes: at("antes de que se corte", 373), tres: at("tres cosas", 377), n1: at("no uses el cable", 379), n2: at("no dejes el inversor", 382),
  n3: at("nunca nunca", 385), gas: at("largan gas", 388), lfp: at("la de litio", 390), tablas: at("las tablas", 394), plan72: at("el plan de 72", 396), link: at("el link esta", 399),
  proximo: at("proximo video", 403), sinRed: at("sin luz de la red", 405), panel: at("solo panel", 408), soy: at("soy claudio", 409), vemos: at("nos vemos", 410),
};
export const ANCHORS = A;

// ---------- LA LÍNEA DE TIEMPO DE BASES ----------
type Beat = { a: number; tr: Tr; p?: [number, number]; k?: string; r: (t: number) => React.ReactNode };
const av = (ms: number) => WINS.reduce((b, w) => (Math.abs(w.ms - ms) < Math.abs(b.ms - ms) ? w : b)).ms;
const AV = (ms: number, tr: Tr, opt: { spans?: [number, number][]; edge?: boolean; p?: [number, number] } = {}): Beat => ({
  a: av(ms), tr, p: opt.p, r: (t) => <Avatar t={t} blur={soft(t, opt.spans ?? [])} dark={soft(t, opt.spans ?? [], 0.35)} edge={opt.edge ? 0.8 : 0} />,
});
const CL = (a: number, k: string, tr: Tr, p?: [number, number], z?: [number, number], extra?: (t: number) => React.ReactNode, pan = 0): Beat => ({ a, tr, p, k, r: (t) => <AbsoluteFill><Clip k={k} a={a} z={z} pan={pan} />{extra?.(t)}</AbsoluteFill> });
const WB = (a: number, tr: Tr, opt: { p?: [number, number]; spans?: [number, number][]; amt?: number } = {}): Beat => ({ a, tr, p: opt.p, r: (t) => <Wd t={t} blur={soft(t, opt.spans ?? [], opt.amt ?? 8)} /> });
const scr = (t: number, q: [number, number, number]) => screenOf(t, q);
const INV: [number, number, number] = [-1.75, 1.55, -2.15], TERM: [number, number, number] = [-1.97, 0.86, -1.49], CABLE: [number, number, number] = [-2.05, 1.15, -1.75];

const BEATS: Beat[] = [
  { a: T0, tr: "cut", r: (t) => <Wd t={t} /> },                                     // = último cuadro del minuto 1 (la calle, amanece)
  AV(99.42, "light", { spans: [[A.p59 - 0.2, 105.0]] }),
  // 1 · el 59 %: la batería de cerca, las rayitas bajan
  WB(105.031, "zoom", { p: [960, 560] }),
  CL(A.pinza - 0.25, "r_pinza_inv", "whip", undefined, [1.03, 1.12]),
  AV(117.711, "portal", { p: [960, 480], spans: [[A.refri, 122.3]] }),
  // 2 · el inversor: la cajita en la pared que gasta prendida
  WB(122.211, "zoom", { p: [700, 420] }),
  AV(133.594, "light", { spans: [[A.por24 - 0.2, 138.2]] }),
  WB(138.094, "flip", { spans: [[138.094, A.err1 + 2.6]], amt: 9 }),
  CL(A.apagas - 0.25, "r_boton_inv", "push", undefined, [1.05, 1.14]),
  AV(151.625, "whipL", { spans: [[A.err2 - 0.1, 155.9]] }),
  // 3 · las 3 de la mañana: el compresor y el cable finito al rojo
  WB(155.852, "light"),
  CL(A.borne - 0.2, "r_borne_caliente", "zoom", [960, 600], [1.05, 1.16], (t) => <HeatHaze t={t} amt={0.6}><AbsoluteFill /></HeatHaze>),
  AV(166.945, "whip", { spans: [[A.a70 - 0.2, 171.5]] }),
  WB(171.445, "push", { spans: [[A.mitad - 0.1, A.garaje - 0.3]], amt: 7 }),
  CL(A.mm6 - 0.5, "r_prensa", "whip", undefined, [1.04, 1.12]),
  CL(A.fus125 - 0.3, "r_fusible", "whipL", undefined, [1.04, 1.13]),
  AV(184.721, "light"),
  // 4 · la batería exacta
  WB(187.938, "zoom", { p: [960, 540] }),
  AV(200.0, "portal", { p: [960, 600], spans: [[A.focos - 0.2, 204.6]] }),
  // 5 · cuánto costó: la casa en corte de fondo + el ticket
  WB(204.5, "flip", { spans: [[A.costo - 0.2, 236.2]], amt: 7 }),
  AV(217.0, "whip", { spans: [[217.0, 220.7]] }),
  WB(220.621, "zoom", { p: [960, 540], spans: [[220.0, 236.2]], amt: 7 }),
  AV(235.97, "light", { spans: [[235.97, 239.5]] }),
  // 6 · el orden: todo apagado, se prende de a uno
  WB(239.383, "push", { spans: [[239.383, A.p1 - 0.2]], amt: 5 }),
  CL(A.botellas - 0.4, "r_botellas", "whip", undefined, [1.03, 1.12]),
  CL(A.m40 - 0.3, "r_horario", "zoom", [960, 540], [1.04, 1.13]),
  AV(254.375, "portal", { p: [960, 520], spans: [[A.termo - 0.1, 258.9]] }),
  WB(258.875, "flip", { spans: [[258.875, A.p2 + 0.4]], amt: 7 }),
  AV(269.708, "whip"),
  WB(274.164, "zoom", { p: [960, 500] }),
  CL(A.p4 - 0.2, "r_ventilador_usb", "push", undefined, [1.04, 1.12]),
  AV(283.116, "light", { spans: [[A.w330 - 0.2, 287.7]] }),
  WB(287.616, "flip", { spans: [[A.w520 - 0.3, A.descubri + 1.0]], amt: 7 }),
  AV(297.962, "zoom", { p: [960, 540], spans: [[A.mitadF - 0.2, 302.5]] }),
  WB(302.462, "light", { spans: [[A.burlete - 0.2, 308.6]], amt: 6 }),
  // CTA2 · pág. 56: mismo mundo, misma cámara → entra sin corte
  { a: 308.8, tr: "cut", r: (t) => <Cta2Body t={t} /> },
  AV(328.52, "whip", { spans: [[A.h72 - 0.2, 334.5]] }),
  // 7 · el tercer día: la cuadra se vuelve a encender, 8 %, llegó
  WB(334.463, "portal", { p: [960, 420] }),
  CL(A.carne - 0.25, "r_leche", "whip", undefined, [1.03, 1.11]),
  AV(347.161, "light"),
  CL(351.024, "r_vecino_bolsa", "zoom", [960, 540], [1.03, 1.12], undefined, 60),
  AV(360.925, "portal", { p: [960, 520] }),
  CL(364.418, "r_medidor", "whip", undefined, [1.04, 1.13]),
  WB(A.divide - 0.35, "flip", { spans: [[A.divide - 0.4, 377.9]], amt: 8 }),
  AV(377.85, "zoom", { p: [960, 540] }),
  // 8 · las tres que nunca
  WB(381.476, "whip"),
  AV(393.622, "light", { spans: [[A.lfp - 0.2, 397.0]] }),
  // 9 · la guía otra vez + el link + cierre
  WB(399.077, "push", { spans: [[A.link - 0.2, 405.4]], amt: 5 }),
  AV(405.4, "zoom", { p: [960, 540] }),
];

// ---------- LA CAPA DE PIEZAS (cruza las transiciones) ----------
const pieces = (t: number) => {
  const inv = scr(t, INV), term = scr(t, TERM), cab = scr(t, CABLE), fr = scr(t, [2.95, 1.6, -1.7]), bulb = scr(t, PT.bulb), rt = scr(t, PT.router);
  return [
    <BigNum key="d2" t={t} at={98.1} text="DÍA 2" size={200} y={420} out={99.45} />,
    // 1
    <SocBadge key="soc1" t={t} at={A.p59 - 0.1} out={A.pinza - 0.4} steps={[{ at: A.p59 - 0.1, v: 80 }, { at: A.p59, v: 59, note: "8 DE LA MAÑANA" }, { at: A.p41, v: 59, note: "−41% EN UNA NOCHE" }]} />,
    <Words key="t3" t={t} items={[{ at: A.tercer, txt: "NI AL TERCER DÍA", col: COL.red }]} out={A.pinza - 0.4} y={880} size={92} />,
    <Words key="md" t={t} items={[{ at: A.medir, txt: "APARATO POR APARATO" }]} out={117.6} y={150} size={84} />,
    <Words key="rf" t={t} items={[{ at: A.refri + 0.3, txt: "¿EL REFRIGERADOR?" }]} out={A.inv + 0.9} y={180} size={100} />,
    t > A.inv && t < A.inv + 1.2 ? <DrawX key="rfx" t={t} at={A.inv} x={500} y={110} w={920} h={150} /> : null,
    <Words key="iv" t={t} items={[{ at: A.inv + 0.4, txt: "EL INVERSOR", col: COL.amber }]} out={122.1} y={880} size={120} />,
    // 2
    <Tag key="cj" t={t} at={A.cajita} x={inv.x} y={inv.y} dx={260} dy={-170} text="LA CAJITA" sub="12 V → CORRIENTE DE CASA" col={COL.amber} out={A.nada - 0.2} size={66} />,
    <Words key="sn" t={t} items={[{ at: A.nada + 0.2, txt: "SIN NADA CONECTADO…" }]} out={A.gasta - 0.1} y={170} size={92} />,
    <Stamp key="pg" t={t} at={A.gasta + 0.15} text="PRENDIDO = GASTA" x={960} y={180} rot={-5} size={90} col={COL.amber} out={A.w15 - 0.1} />,
    <BigNum key="15" t={t} at={A.w15} text="15 W" x={1440} y={300} size={200} col={COL.amber} edge="#5a3200" sub="EL MÍO" out={A.por24 - 0.25} />,
    <Words key="pn" t={t} items={[{ at: A.nadaP, txt: "PARECE NADA" }]} out={A.por24 - 0.25} y={900} size={84} />,
    <Eq key="eq" t={t} out={A.tercio - 0.2} terms={[{ at: A.por24 - 0.6, txt: "15 W" }, { at: A.por24 + 0.35, txt: "24 h" }, { at: A.h360, txt: "360 Wh", col: COL.red, op: "=" }]} />,
    <SocBadge key="soc2" t={t} at={A.tercio - 0.1} out={A.err1 - 0.1} x={960} y={470} steps={[{ at: A.tercio - 0.1, v: 41 }, { at: A.tercio + 0.3, v: 29, note: "CASI UN TERCIO" }, { at: A.tirado, v: 29, note: "TIRADO, HACIENDO NADA" }]} />,
    <ErrCard key="e1" t={t} at={A.err1} n={1} txt="INVERSOR PRENDIDO SIN USO" out={A.apagas - 0.3} y={540} />,
    <Words key="ar" t={t} items={[{ at: A.ridic - 0.1, txt: "EL ARREGLO ES RIDÍCULO", col: COL.ice }]} out={A.apagas - 0.3} y={880} size={80} />,
    <Words key="bt" t={t} items={[{ at: A.boton, txt: "UN BOTÓN", col: "#38ff7a" }]} out={151.5} y={880} size={130} />,
    <ErrCard key="e2" t={t} at={A.err2 + 0.1} n={2} txt="FUE PEOR · LA PRIMERA NOCHE" out={155.7} />,
    // 3
    <BigNum key="3am" t={t} at={A.am3} text="3:00 AM" x={420} y={210} size={150} col={COL.ice2} edge="#1d3a52" out={A.cable - 0.2} />,
    <Tag key="cp" t={t} at={A.compr} x={fr.x} y={fr.y} dx={-260} dy={-120} text="ARRANCA EL COMPRESOR" col={COL.ice} out={A.cable - 0.2} />,
    <Tag key="fn" t={t} at={A.finito} x={term.x} y={term.y} dx={300} dy={-90} text="FINITO" sub="Y SIN FUSIBLE" col={COL.red} out={A.borne - 0.25} size={64} />,
    <Words key="qm" t={t} items={[{ at: A.quemaba, txt: "QUEMABA", col: COL.red }]} out={166.9} y={170} size={130} />,
    <BigNum key="70" t={t} at={A.a70} text="70 A" x={960} y={430} size={260} col={COL.red} edge="#4a0d08" sub="EL ARRANQUE · 1 SEGUNDO" out={171.6} />,
    <Versus key="vs1" t={t} at={A.mitad - 0.1} out={A.garaje - 0.3} title="AMPERIOS" L={{ label: "EL ARRANQUE", val: "70 A", h: 0.9, col: COL.red }} R={{ label: "EL CABLE FINITO", val: "~35 A", h: 0.45, col: "#b9c7d6", mark: "x" }} />,
    <Stamp key="sq" t={t} at={A.garaje + 0.3} text="SE QUEMA EL GARAJE" x={960} y={520} rot={-6} size={100} out={A.mm6 - 0.6} />,
    <Tag key="mm" t={t} at={A.mm6 + 0.2} x={980} y={560} dx={260} dy={-200} text="CABLE DE 6 mm" col={COL.ice} out={A.fus125 - 0.35} />,
    <Tag key="tp" t={t} at={A.term} x={900} y={660} dx={-280} dy={-150} text="TERMINALES PRENSADOS" col={COL.ice} out={A.fus125 - 0.35} />,
    <Tag key="fu" t={t} at={A.fus125 + 0.2} x={960} y={560} dx={260} dy={-200} text="FUSIBLE 125 A" sub="PEGADO A LA BATERÍA" col={COL.amber} out={184.6} />,
    <Words key="nm" t={t} items={[{ at: A.nunca, txt: "NUNCA MÁS CALENTÓ", col: "#38ff7a" }]} out={187.8} y={880} size={90} />,
    // 4
    <Words key="lf" t={t} items={[{ at: A.lifepo, txt: "LiFePO4", col: "#38ff7a" }, { at: A.v12b, txt: "12 V" }, { at: A.v12b + 1.0, txt: "100 Ah" }]} out={A.wh1280 - 0.2} y={900} size={96} />,
    <Tag key="li" t={t} at={A.litio} x={scr(t, [-1.75, 0.6, -1.37]).x} y={scr(t, [-1.75, 0.6, -1.37]).y} dx={-300} dy={-180} text="LITIO HIERRO FOSFATO" col="#38ff7a" out={A.lifepo - 0.15} />,
    <BigNum key="1280" t={t} at={A.wh1280} text="1280 Wh" x={960} y={300} size={210} col="#38ff7a" edge="#0e4a24" out={A.focos - 0.25} />,
    <BulbRow key="br" t={t} at={A.focos - 0.1} off={A.noMucho - 0.1} out={A.noMucho + 1.2} label="12 FOCOS DE 100 W · UNA HORA" />,
    <Words key="nmu" t={t} items={[{ at: A.noMucho, txt: "NO ES MUCHO" }]} out={A.orden - 0.2} y={880} size={110} />,
    <Stamp key="oi" t={t} at={A.orden + 0.3} text="EL ORDEN > LA BATERÍA" x={960} y={480} rot={-5} size={92} col={COL.amber} out={A.costo - 0.3} />,
    <Receipt key="rc" t={t} title="MI KIT · EN US$" cur="" rows={[{ at: A.b280, item: "BATERÍA", $: 280 }, { at: A.i120, item: "INVERSOR", $: 120 }, { at: A.c35, item: "CABLE+FUSIBLE", $: 35 }, { at: A.c60, item: "CARGADOR", $: 60 }, { at: A.p28 + 0.4, item: "PINZA", $: 28 }, { at: A.m12 + 0.4, item: "MEDIDOR", $: 12 }]} totalAt={A.t535} x={1130} y={90} sc={1.4} out={A.gen - 0.3} />,
    <Versus key="vg" t={t} at={A.gen - 0.1} out={A.ahoraOrden - 0.2} title="LO QUE CUESTA" L={{ label: "MI SISTEMA", val: "535 US$", h: 0.55, col: "#38ff7a", mark: "ok" }} R={{ label: "GENERADOR DECENTE", val: "MÁS", h: 0.85, col: "#b9c7d6", mark: "x" }} />,
    <Words key="sg" t={t} items={[{ at: A.sinGas, txt: "SIN GASOLINA" }, { at: A.ruido, txt: "SIN RUIDO" }, { at: A.humo, txt: "SIN HUMO" }]} out={A.ahoraOrden - 0.2} y={930} size={70} />,
    // 6
    <Words key="ao" t={t} items={[{ at: A.ahoraOrden + 0.2, txt: "EL ORDEN" }, { at: A.truco, txt: "= EL TRUCO", col: COL.amber }]} out={A.p1 - 0.2} y={180} size={120} />,
    <Paso key="s1" t={t} at={A.p1} n={1} name="REFRIGERADOR" val="PERO NO TODO EL DÍA" valAt={A.noTodo} out={A.botellas - 0.5} />,
    <Tag key="bo" t={t} at={A.botellas + 0.3} x={960} y={560} dx={260} dy={-200} text="BOTELLAS CONGELADAS" col={COL.ice} out={A.m40 - 0.35} />,
    <BigNum key="40" t={t} at={A.m40} text="40 MIN" x={1440} y={260} size={150} col={COL.ice2} edge="#1d3a52" sub="CADA 4 HORAS" out={254.3} />,
    <Words key="pc" t={t} items={[{ at: A.puerta, txt: "PUERTA CERRADA" }]} out={A.termo - 0.1} y={170} size={100} />,
    <Thermo key="th" t={t} at={A.g35 - 0.3} x={1380} y={300} from={3} to={5} dur={1.2} out={258.8} />,
    <Versus key="v2" t={t} at={A.w200 - 0.1} out={A.p2 - 0.2} title="REFRIGERADOR · Wh POR DÍA" L={{ label: "CON EL HORARIO", val: "200", h: 0.2, col: "#38ff7a", mark: "ok" }} R={{ label: "TODO EL DÍA", val: "1000", h: 0.95, col: COL.red, mark: "x" }} />,
    <Paso key="s2" t={t} at={A.p2} n={2} name="LUCES" val="3 LED DE 7 W" valAt={A.led} out={269.6} />,
    <Tag key="711" t={t} at={A.de7} x={bulb.x} y={bulb.y} dx={240} dy={120} text="DE 7 A 11 PM" col={COL.amber} out={269.6} />,
    <Paso key="s3" t={t} at={A.p3} n={3} name="INTERNET" val="ROUTER 9 W" valAt={A.w9} out={A.p4 - 0.3} />,
    <Words key="rh" t={t} items={[{ at: A.dosH, txt: "2 H A LA MAÑANA" }, { at: A.cuatro, txt: "+ 4 H A LA NOCHE", col: COL.amber }]} out={A.p4 - 0.3} y={900} size={76} />,
    <Tag key="rtg" t={t} at={A.dosH - 0.3} x={rt.x} y={rt.y} dx={260} dy={-140} text="SÓLO A HORARIO" col={COL.ice} out={A.p4 - 0.3} />,
    <Paso key="s4" t={t} at={A.p4} n={4} name="VENTILADOR USB" val="5 W · TODA LA NOCHE" valAt={A.usb} out={283.0} />,
    <BigNum key="330" t={t} at={A.w330} text="330 Wh" x={960} y={330} size={210} col="#38ff7a" edge="#0e4a24" sub="TODO JUNTO, POR DÍA" out={A.w520 - 0.3} />,
    <Versus key="v3" t={t} at={A.w520 - 0.1} out={A.midiendo + 0.8} title="Wh POR DÍA" L={{ label: "CON EL ORDEN", val: "330", h: 0.55, col: "#38ff7a", mark: "ok" }} R={{ label: "ANTES", val: "520", h: 0.88, col: COL.red, mark: "x" }} />,
    <Words key="dc" t={t} items={[{ at: A.descubri, txt: "Y DESCUBRÍ OTRA COSA…", col: COL.amber }]} out={297.9} y={540} size={96} />,
    <Words key="mf" t={t} items={[{ at: A.mitadF, txt: "CASI LA MITAD DE MI FACTURA", col: COL.red }]} out={302.4} y={880} size={80} />,
    <CheckList key="cl" t={t} title="LOS 3 QUE MÁS GASTAN" rows={[{ at: A.burlete - 0.2, txt: "REFRIGERADOR: BURLETE" }, { at: A.termost - 0.2, txt: "CALENTADOR: AL MÁX." }, { at: A.filtro - 0.3, txt: "AIRE: FILTRO TAPADO" }]} out={308.55} x={1120} y={240} />,
    // 7
    <Words key="va" t={t} items={[{ at: A.volvamos, txt: "VOLVAMOS AL APAGÓN" }]} out={A.h72 - 0.3} y={170} size={92} />,
    <BigNum key="72" t={t} at={A.h72} text="72 HORAS" x={960} y={300} size={180} col={COL.ice2} edge="#1d3a52" sub="EL TERCER DÍA · 8 DE LA NOCHE" out={334.4} />,
    <Words key="vl" t={t} items={[{ at: A.luz, txt: "VOLVIÓ LA LUZ", col: "#ffd27a" }]} out={A.miré - 0.1} y={180} size={130} />,
    <Flash key="fl" t={t} at={336.15} peak={0.35} w={0.4} col="#ffe2b0" />,
    <SocBadge key="soc3" t={t} at={A.p8 - 0.3} out={A.carne - 0.3} steps={[{ at: A.p8 - 0.3, v: 8 }, { at: A.llego + 0.2, v: 8, note: "LLEGÓ. JUSTO." }]} />,
    <Stamp key="lg" t={t} at={A.llego + 0.25} text="LLEGÓ" x={700} y={300} rot={-8} size={130} col="#38ff7a" out={A.carne - 0.35} />,
    <Words key="ok" t={t} items={[{ at: A.carne + 0.2, txt: "CARNE CONGELADA ✓", col: COL.ice }, { at: A.leche, txt: "LECHE FRÍA ✓", col: COL.ice }, { at: A.remedios, txt: "REMEDIOS A 4 °C ✓", col: "#38ff7a" }]} out={347.0} y={900} size={66} />,
    <Words key="ch" t={t} items={[{ at: A.chicos3, txt: "LOS CHICOS DURMIERON", col: "#38ff7a" }, { at: A.chicos3 + 1.4, txt: "LAS 3 NOCHES" }]} out={351.0} y={170} size={84} />,
    <BigNum key="150" t={t} at={A.u150} text="−150 US$" x={1400} y={260} size={170} col={COL.red} edge="#4a0d08" sub="EL VECINO · A LA BASURA" out={A.empieza - 0.2} />,
    <Words key="es" t={t} items={[{ at: A.empieza, txt: "EMPIEZA ESTA SEMANA", col: "#38ff7a" }, { at: A.sinComprar, txt: "SIN COMPRAR LA BATERÍA" }]} out={360.8} y={170} size={84} />,
    <Tag key="me" t={t} at={A.u12 - 0.2} x={1100} y={560} dx={260} dy={-200} text="MEDIDOR DE ENCHUFE" sub="12 US$" col={COL.amber} out={364.3} />,
    <Words key="24" t={t} items={[{ at: A.h24, txt: "24 HORAS · REFRIGERADOR" }]} out={A.partida - 0.2} y={880} size={80} />,
    <Words key="pp" t={t} items={[{ at: A.partida, txt: "TU PUNTO DE PARTIDA", col: COL.amber }]} out={A.divide - 0.3} y={880} size={90} />,
    <Formula key="fm" t={t} at={A.divide} ex={3.9} exAt={A.cuantos} out={377.8} />,
    <Words key="an" t={t} items={[{ at: A.antes, txt: "ANTES DEL CORTE, NO DESPUÉS" }]} out={377.8} y={880} size={80} />,
    // 8
    <Words key="3c" t={t} items={[{ at: A.tres, txt: "3 COSAS QUE NUNCA", col: COL.red }]} out={381.4} y={880} size={100} />,
    <ErrCard key="n1" kind="NUNCA" t={t} at={A.n1} n={1} txt="EL CABLE FINITO DE LA CAJA" out={A.n2 - 0.3} />,
    <Tag key="n1t" t={t} at={A.n1 + 0.8} x={term.x} y={term.y} dx={240} dy={-180} text="SE CALIENTA" col={COL.red} out={A.n2 - 0.3} />,
    <ErrCard key="n2" kind="NUNCA" t={t} at={A.n2} n={2} txt="EL INVERSOR PRENDIDO SIN NADA" out={A.n3 - 0.3} />,
    <ErrCard key="n3" kind="NUNCA" t={t} at={A.n3} n={3} txt="BATERÍA DE AUTO DENTRO DE CASA" out={393.5} />,
    <Stamp key="gs" t={t} at={A.gas + 0.1} text="LARGA GAS AL CARGAR" x={960} y={340} rot={-6} size={86} out={393.5} />,
    <Words key="lfp" t={t} items={[{ at: A.lfp + 0.2, txt: "LiFePO4: NO LARGA GAS ✓", col: "#38ff7a" }]} out={A.tablas - 0.2} y={880} size={110} />,
    // 9
    <Words key="gd" t={t} items={[{ at: A.tablas, txt: "TABLAS PARA MEDIR TU CASA" }, { at: A.plan72, txt: "+ PLAN DE 72 HORAS", col: COL.amber }]} out={A.link - 0.3} y={170} size={72} />,
    <Desc key="ds" t={t} at={A.link} out={405.55} />,
    <LowerThird key="lt" t={t} at={A.proximo} out={TEND - 0.6} name="CLAUDIO MENDOZA" l2="PRÓXIMO: CARGARLA SIN RED NI PANELES" l2at={A.sinRed} />,
  ];
};

// tomas para la mezcla: cada CL arranca su audio nativo en `a` y suena hasta el próximo beat (agnes no trae audio)
export const clipPlan = () => BEATS.map((b, i) => ({ k: b.k, a: +b.a.toFixed(3), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(3) })).filter((x) => x.k);
export const beatTable = () => BEATS.map((b, i) => ({ i, a: +b.a.toFixed(2), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(2), tr: b.tr, k: b.k ?? "" }));

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  if (t < T0 + 0.4) return null;   // hasta 99,42 manda el minuto 1
  let i = 0; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++;
  const b = BEATS[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
  const base = i > 0 && k < 1 ? transition(b.tr, k, BEATS[i - 1].r(t), b.r(t), b.p ?? [960, 540]) : [<AbsoluteFill key="b">{b.r(t)}</AbsoluteFill>];
  const fin = 1 - e(t, TEND - 0.7, TEND - 0.05);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fin }}>
        {base}
        {pieces(t)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
