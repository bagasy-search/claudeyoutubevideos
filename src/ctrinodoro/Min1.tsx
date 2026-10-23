// ctrinodoro · MINUTO 1. Un solo hilo, todo anclado a la VOZ con at("frase"):
// (cold open LTX: el anillo que no sale, 13 s, si llegó) → avatar + la pastilla 3D → la pastilla ABRE el portal al baño en corte:
// la noche pasa en el reloj, las burbujas carcomen los estratos, el anillo se afloja y sale con UNA pasada → "Mira." →
// domingo, visitas, levantas la tapa → la línea en el corte → cloro, cepillo 1-2-10, la muñeca, descargas: "SIGUE AHÍ" →
// ¿cambiar el inodoro? NO → de noche: nadie te explicó qué es esa línea → 7 PASOS → recorrido por el baño (un objeto por paso).
// El avatar entra por IRIS en cada ventana pagada (avwin.json) y sale por latigazo: el fondo sigue debajo, sin cortes secos.
// Audio fuera de Remotion (voz + LTX + SFX se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BathWorld, makeCam, PT, EV0, Ev, win } from "./bano3d";
import { BigNum, COL, Card3D, Chips, DrawX, Flash, FONT, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";
import WORDS from "./words.json";
import AVW from "./avwin.json";

// ---------- tomas LTX que ya llegaron (si falta: la foto del primer cuadro con zoom lento) ----------
export const HAS: Record<string, boolean> = { g_anillo: true, m_tapa: false, m_cloro: false, m_descarga: false, p_pasada: false, p_jarro: false, c_echar: false, c_manana: false, c_cepillo: false };
export const REEL = true;   // true cuando llega el reel del avatar (public/ctrinodoro/reel0.mp4)
// cold open: el gancho LTX corre 13 s ANTES de la voz (sólo si llegó); todo lo de la voz se corre VO segundos
export const VO = HAS.g_anillo ? 13 : 0;

// ---------- at("frase"): segundo (de la composición) en que EMPIEZA la frase (primera aparición después de `desde`) ----------
const nrm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");
const WN = (WORDS as { w: string; s: number; e: number }[]).map((x) => ({ n: nrm(x.w), s: x.s + VO, e: x.e + VO }));
export const at = (frase: string, desde = 0, fin = false): number => {
  const q = frase.split(/\s+/).map(nrm).filter(Boolean);
  for (let i = 0; i < WN.length - q.length + 1; i++) {
    if (WN[i].s < desde - 0.01) continue;
    let ok = true; for (let k = 0; k < q.length; k++) if (WN[i + k].n !== q[k]) { ok = false; break; }
    if (ok) return fin ? WN[i + q.length - 1].e : WN[i].s;
  }
  throw new Error("at(): no está en la voz → " + frase);
};

// ---------- AVATAR: ventanas pagadas (avwin.json, en tiempo de VOZ → +VO), preroll de 10 cuadros ----------
type Wn = { ms: number; me: number; off: number };
export const WIN: Wn[] = (AVW as { win: Wn[] }).win.map((w) => ({ ...w, ms: w.ms + VO, me: w.me + VO }));
export const Avatar: React.FC<{ t: number; dark?: number; style?: React.CSSProperties }> = ({ t, dark = 0, style }) => {
  const face = REEL ? WIN.filter((w) => w.me > t - 1 && w.ms < t + 1).map((w) => (
    <Sequence key={w.ms} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (s(w.ms) >= 10 ? 10 : s(w.ms)))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  )) : <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  // ⛔ el avatar va SIEMPRE nítido: sin blur, sin halo ni borde difuminado (creador, 21-oct)
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}><AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>{face}</AbsoluteFill></AbsoluteFill>;
};
export const avIn = (t: number) => WIN.find((w) => t >= w.ms - 0.4 && t < w.me + 0.05);

// toma a cuadro completo: LTX si llegó, si no la foto con zoom lento
export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.03, 1.11] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 8);
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{HAS[k] ? <Vid id={"ltx_" + k} from={from} at={a} /> : <Vid id={"img_" + k} />}</AbsoluteFill>;
};

// ---------- tiempos (todos de la voz) ----------
const T = {
  pastilla: at("pastilla"), noche: at("una noche entera"), anillo: at("el anillo marrón"), afloja: at("se afloja"), pasada: at("una sola pasada"),
  acidos: at("sin ácidos"), rodillas: at("sin dejarte"), mira: at("mira"), estas: at("estás en el baño"), tapa: at("levantas la tapa"), linea: at("esa línea marrón"),
  banera: at("como el anillo de una"), cloro: at("le echas cloro"), cepillo: at("le pasas el cepillo"), vez1: at("una vez"), dos: at("dos", at("una vez")), diez: at("diez", at("una vez")),
  muneca: at("te duele la muñeca"), descargas: at("descargas"), sigue: at("sigue ahí"), riera: at("como si se riera"), pensar: at("y empiezas a pensar"), cambiar: at("hay que cambiarlo"),
  noes: at("no es el inodoro"), nadie: at("nadie te explicó"), sola: at("se va casi sola"), siete: at("son siete pasos"),
  q1: at("qué es de verdad"), q2: at("cómo saber en dos"), q3: at("qué pastilla sirve"), q4: at("dónde va"), q5: at("la noche que hace"), q6: at("la pasada de la mañana"),
  q7: at("qué hacer con el sarro"), nunca: at("qué no hacer nunca"),
};
// el minuto 1 termina cuando cierra la ventana del avatar que sigue a "qué no hacer nunca" (ahí entra el cuerpo con su latigazo)
export const MIN1_END = (WIN.find((w) => w.me > T.nunca + 1.5) ?? { me: T.nunca + 6 }).me;
export const MIN1_FRAMES = s(MIN1_END);

// ---------- LA CÁMARA (una sola) ----------
type V3 = [number, number, number];
const V: Record<string, { p: V3; l: V3; fov: number }> = {
  ov: { p: [0.6, 1.3, 2.15], l: [0.05, 0.55, -0.3], fov: 38 },
  ring: { p: [0.0, 0.52, 0.66], l: [0, 0.29, -0.16], fov: 30 },
  macro: { p: [-0.06, 0.4, 0.52], l: [0.2, 0.3, 0.1], fov: 26 },
  macroB: { p: [0.05, 0.37, 0.28], l: [0, 0.3, -0.25], fov: 26 },
  clock: { p: [-0.5, 1.45, 0.5], l: [-0.95, 1.5, -0.68], fov: 34 },
  sink: { p: [0.95, 1.25, 0.55], l: [0.92, 0.88, -0.35], fov: 34 },
  tank: { p: [0.6, 1.55, 0.15], l: [0, 0.66, -0.42], fov: 34 },
  top: { p: [0.0, 1.2, 0.35], l: [0, 0.25, -0.02], fov: 34 },
};
const K = (t: number, v: string, arc?: number) => ({ t, ...V[v], arc });
const CAM = makeCam([
  K(0, "ov"), K(T.pastilla + 0.3, "ov"), K(T.noche + 0.4, "clock", 0.15), K(T.anillo + 0.3, "ring", 0.1), K(T.afloja + 0.5, "macroB"), K(T.pasada + 0.2, "ring"),
  K(T.acidos, "ov"), K(T.mira - 0.2, "ov"), K(T.linea + 0.3, "ring", 0.1), K(T.banera + 0.6, "macroB"), K(T.cloro, "ring"),
  K(T.nadie - 0.1, "ov"), K(T.nadie + 1.2, "ring", 0.15), K(T.sola + 0.6, "macroB"),
  K(T.q1 + 0.3, "macro", 0.1), K(T.q2 + 0.3, "macroB"), K(T.q3 + 0.5, "sink", 0.2), K(T.q4 + 0.5, "clock", 0.15), K(T.q5 + 0.5, "ring", 0.1), K(T.q6 + 0.5, "top"),
  K(T.q7 + 0.5, "macro", 0.1), K(T.nunca + 0.4, "tank", 0.1), K(400, "tank"),
]);

// ---------- los EVENTOS del mundo ----------
const evAt = (t: number): Ev => {
  // gancho: la pastilla cae, pasa la noche en el reloj, las burbujas comen y UNA pasada se lleva el anillo
  if (t < T.estas) {
    const night = win(t, T.noche, T.anillo + 2.2);
    return { ...EV0, day: 0.2 + 0.7 * win(t, T.afloja, T.pasada), hour: 22 + 8 * night, glow: win(t, T.noche, T.noche + 0.4),
      tab: 1 - win(t, T.noche + 0.5, T.afloja), tabDrop: win(t, T.pastilla + 0.4, T.noche + 0.2), bub: win(t, T.noche, T.noche + 0.5) * (1 - win(t, T.pasada, T.pasada + 0.6)),
      cloud: win(t, T.noche + 0.3, T.afloja) * (1 - win(t, T.pasada + 0.4, T.acidos)), eat: win(t, T.anillo, T.afloja) * (1 - win(t, T.pasada, T.pasada + 0.3)),
      brown: 1 - 0.55 * win(t, T.anillo, T.afloja + 0.6) - 0.45 * win(t, T.pasada, T.pasada + 1.2), cal: 1 - 0.7 * win(t, T.pasada, T.pasada + 1.2),
      lift: win(t, T.afloja, T.pasada + 0.6), brush: win(t, T.pasada, T.pasada + 1.3) };
  }
  // el baño de siempre: la línea marrón (la tapa, el cloro, el cepillo que no puede)
  if (t < T.nadie - 0.2) return { ...EV0, day: 0.85, hour: 30, hi: win(t, T.linea, T.linea + 0.4) * (1 - win(t, T.banera + 1.5, T.cloro)) };
  // de noche: nadie te explicó qué es esa línea → cuando sabes lo que es, se va casi sola
  if (t < T.q1 - 0.3) return { ...EV0, day: 0.12, glow: 0.2, hi: win(t, T.nadie + 0.8, T.nadie + 1.4), bub: win(t, T.sola - 0.3, T.sola + 0.2) * 0.7, eat: win(t, T.sola, T.sola + 0.5),
    brown: 1 - 0.5 * win(t, T.sola, T.siete), lift: win(t, T.sola + 0.2, T.siete) * 0.5, cloud: win(t, T.sola, T.siete) * 0.4 };
  // el recorrido de los 7 pasos
  const night = win(t, T.q4 + 0.6, T.q5 + 1.5);
  return { ...EV0, day: 0.85 - 0.6 * win(t, T.q4, T.q4 + 0.6) * (1 - win(t, T.q6 - 0.3, T.q6)), hour: 22 + 8 * night, glow: win(t, T.q4, T.q4 + 0.3) * (1 - win(t, T.q6, T.q6 + 0.3)),
    hi: win(t, T.q1, T.q1 + 0.4) * (1 - win(t, T.q2 + 1.5, T.q3)), card: win(t, T.q2 + 0.2, T.q2 + 0.5) * (1 - win(t, T.q3 - 0.3, T.q3)),
    jar: win(t, T.q3 + 0.6, T.q3 + 1.0), tab: win(t, T.q4 - 0.6, T.q4 - 0.2) * (1 - win(t, T.q5 + 0.5, T.q6)), tabDrop: win(t, T.q4 - 0.2, T.q4 + 0.3),
    bub: win(t, T.q5, T.q5 + 0.4) * (1 - win(t, T.q6, T.q6 + 0.4)), eat: win(t, T.q5, T.q5 + 0.4) * (1 - win(t, T.q6, T.q6 + 0.3)), cloud: win(t, T.q5, T.q6) * (1 - win(t, T.q6 + 0.8, T.q7)),
    brown: 1 - 0.5 * win(t, T.q5, T.q6) - 0.5 * win(t, T.q6, T.q6 + 1.1), lift: win(t, T.q5 + 0.4, T.q6 + 0.6), brush: win(t, T.q6, T.q6 + 1.2) * (1 - win(t, T.q7 - 0.2, T.q7)),
    cal: 1 - 0.0 * t, level: 1 - 0.85 * win(t, T.q7, T.q7 + 0.8), paper: win(t, T.q7 + 0.7, T.q7 + 1.6),
    tank: win(t, T.nunca, T.nunca + 0.5), puck: 1 - win(t, T.nunca + 1.0, T.nunca + 1.8) };
};

// mundo 3D con blur de movimiento real (velocidad de cámara proyectada)
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = CAM.camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><BathWorld t={t} ev={evAt(t)} cam={CAM} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const scr = (t: number, q: V3) => CAM.screenOf(t, q);

// ================= PIEZAS =================
// la PASTILLA 3D: bloque blanco con capa azul, gira y brilla; después se convierte en el portal
const Tablet3D: React.FC<{ t: number; at: number; x: number; y: number; sc?: number; out?: number }> = ({ t, at, x, y, sc = 1, out = 1e9 }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const ry = -38 + 30 * Math.sin((t - at) * 0.9), rx = 28 + Math.sin(t * 1.3) * 5, W = 300 * sc, H = 200 * sc, D = 110 * sc;
  const grain = "radial-gradient(rgba(0,0,0,.07) 1px, transparent 1.4px) 0 0/7px 7px, radial-gradient(rgba(255,255,255,.9) 1px, transparent 1.6px) 3px 4px/9px 9px";
  const face = (bg: string, w: number, h: number, tr: string, extra?: React.ReactNode) => <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, background: bg, transform: tr, borderRadius: 18 * sc, boxShadow: "inset 0 0 30px rgba(0,0,0,.18)", overflow: "hidden" }}>{extra}</div>;
  const top = <div style={{ position: "absolute", inset: 0 }}><div style={{ position: "absolute", left: 0, right: 0, top: "58%", bottom: 0, background: "linear-gradient(180deg,#2f7fe0,#1b56a8)" }} /></div>;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, transform: `scale(${Math.min(1.06, k)})` }}>
      <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        {face(`${grain}, linear-gradient(135deg,#ffffff,#dfe3e7)`, W, H, `translateZ(${D / 2}px)`, top)}
        {face("#e9ecef", W, H, `rotateY(180deg) translateZ(${D / 2}px)`)}
        {face(`${grain}, linear-gradient(180deg,#e9edf0 58%,#2a72cf 58%)`, D, H, `rotateY(90deg) translateZ(${W / 2}px)`)}
        {face(`${grain}, linear-gradient(180deg,#d9dee3 58%,#1f5fb3 58%)`, D, H, `rotateY(-90deg) translateZ(${W / 2}px)`)}
        {face(`${grain}, #f7f8f9`, W, D, `rotateX(90deg) translateZ(${H / 2}px)`)}
        {face("#1b56a8", W, D, `rotateX(-90deg) translateZ(${H / 2}px)`)}
      </div>
      <div style={{ position: "absolute", left: -W * 0.7, top: -H * 0.9, width: W * 1.4, height: H * 1.8, background: "radial-gradient(circle, rgba(140,200,255,.35), transparent 65%)", mixBlendMode: "screen", pointerEvents: "none" }} />
    </div>
  );
};

// cartel que se escribe solo (frase grande con subrayado que se dibuja)
export const Line: React.FC<{ t: number; at: number; out: number; text: string; y?: number; size?: number; col?: string; strike?: number }> = ({ t, at, out, text, y = 150, size = 84, col = COL.ink, strike }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, at, at + 0.45));
  const st = strike === undefined ? 0 : e(t, strike, strike + 0.25);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 4, color: col, textShadow: extrude(8, "rgba(0,0,0,.6)") }}>
      <span style={{ position: "relative" }}>{text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span>
        {st > 0 && <span style={{ position: "absolute", left: -10, top: "52%", height: 14, width: `calc(${st * 100}% + 20px)`, background: COL.red, borderRadius: 7, boxShadow: "0 0 18px rgba(255,60,40,.7)" }} />}
      </span>
      <div style={{ margin: "6px auto 0", height: 8, width: `${60 * e(t, at + 0.3, at + 0.7)}%`, borderRadius: 4, background: COL.amber, boxShadow: `0 0 18px ${COL.amber}` }} />
    </div>
  );
};

// sticker 3D brillante con icono (luna / reloj)
export const Sticker: React.FC<{ t: number; at: number; out: number; x: number; y: number; icon: "luna" | "reloj"; text: string; col: string }> = ({ t, at, out, x, y, icon, text, col }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const sweep = ((t - at) * 0.7) % 1, h = e(t, at + 0.2, at + 1.6);
  const ic = icon === "luna"
    ? <svg width={110} height={110}><circle cx={55} cy={55} r={40} fill="#ffe7a3" /><circle cx={74} cy={44} r={36} fill="#22305a" /></svg>
    : <svg width={110} height={110}><circle cx={55} cy={55} r={44} fill="#fff" stroke="#22252b" strokeWidth={6} /><path d={`M55 55 L55 15 A40 40 0 ${h > 0.5 ? 1 : 0} 1 ${55 + 40 * Math.sin(h * Math.PI)} ${55 - 40 * Math.cos(h * Math.PI)} Z`} fill={COL.amber} /></svg>;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - Math.min(1, k)) * -80 + Math.sin(t) * 6}deg) rotateZ(-4deg) scale(${Math.min(1.05, k)})` }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, padding: "18px 34px 18px 22px", borderRadius: 40, background: `linear-gradient(160deg, ${col}, #1a2236)`, border: "5px solid #fff", boxShadow: "0 30px 60px rgba(0,0,0,.6), 0 10px 0 #c9cfd8", overflow: "hidden" }}>
        {ic}
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.5)"), whiteSpace: "nowrap" }}>{text}</div>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 90, left: `${-20 + sweep * 140}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)", transform: "skewX(-20deg)" }} />
      </div>
    </div>
  );
};

// sello rojo que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// número de paso que sale del objeto 3D (recorrido)
const Step: React.FC<{ t: number; at: number; out: number; n: number; text: string; q: V3; dx?: number; dy?: number; col?: string }> = ({ t, at: a, out, n, text, q, dx = 200, dy = -140, col = COL.amber }) => {
  const fl = !!avIn(t), p = fl ? { x: 1250, y: 330 } : scr(t, q), k = spr(t, a, 1.1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.2));
  if (o <= 0.01) return null;
  const lw = 120 + text.length * 36, ex = fl ? Math.min(1250, 1850 - lw) : dx >= 0 ? Math.min(p.x + dx, 1870 - lw) : Math.max(p.x + dx, 50 + lw), ey = fl ? 330 : Math.max(80, Math.min(1000, p.y + dy));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {!fl && <line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * Math.min(1, k)} y2={p.y + (ey - p.y) * Math.min(1, k)} stroke={col} strokeWidth={4} />}
        {!fl && <circle cx={p.x} cy={p.y} r={10} fill={col} style={{ filter: `drop-shadow(0 0 12px ${col})` }} />}
      </svg>
      <div style={{ position: "absolute", left: ex, top: ey, transform: `translate(${fl || dx >= 0 ? 0 : -100}%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, transformOrigin: fl || dx >= 0 ? "0 50%" : "100% 50%", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 96, height: 96, borderRadius: 24, background: col, color: "#1b1205", fontFamily: FONT, fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 30px rgba(0,0,0,.55), inset 0 -6px 0 rgba(0,0,0,.2)" }}>{n}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};

// contador de pasadas del cepillo (1 · 2 · 10) que golpea
const Count: React.FC<{ t: number; marks: [number, string][]; out: number }> = ({ t, marks, out }) => {
  const cur = marks.filter(([a]) => t >= a).pop();
  if (!cur || t > out + 0.3) return null;
  const k = spr(t, cur[0], 1.4), o = 1 - e(t, out, out + 0.25);
  return <div style={{ position: "absolute", right: 170, top: 170, opacity: o, transform: `scale(${2 - Math.min(1, k)}) rotate(${-6 + (1 - Math.min(1, k)) * 20}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 210, color: COL.amber, textShadow: extrude(14, "#5a3a10") }}>{cur[1]}<span style={{ fontSize: 70 }}>×</span></div>;
};

// ================= EL FONDO (lo que se ve cuando no está el avatar) =================
const Base: React.FC<{ t: number }> = ({ t }) => {
  if (t < VO) return <Shot k="g_anillo" t={t} a={0} z={[1.0, 1.06]} />;                                   // cold open LTX
  if (t < T.estas) return <World t={t} />;
  if (t < T.tapa) return <Shot k="m_visitas" t={t} a={T.estas} />;
  if (t < T.linea) return <Shot k="m_tapa" t={t} a={T.tapa} z={[1.0, 1.14]} />;
  if (t < T.cloro) return <World t={t} />;
  if (t < T.cepillo) return <Shot k="m_cloro" t={t} a={T.cloro} />;
  if (t < T.muneca) return <Shot k="g_anillo" t={t} a={T.cepillo} from={VO > 0 ? 3 : 0} z={[1.08, 1.16]} />;
  if (t < T.descargas) return <Shot k="m_muneca" t={t} a={T.muneca} />;
  if (t < T.pensar) return <Shot k="m_descarga" t={t} a={T.descargas} />;
  if (t < T.nadie - 0.2) return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2a3344, #0b0f16)" }} />;
  return <World t={t} />;
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [<Base key="base" t={t} />];
  const ring = scr(t, PT.ringBack);
  const A = avIn(t);
  // ===== EL AVATAR: entra por iris en cada ventana pagada y sale por latigazo (el fondo sigue debajo) =====
  const w = A;
  if (w) {
    const first = w.ms <= VO + 0.05;
    const r = first ? 1 : ei(t, w.ms - 0.35, w.ms + 0.15);
    const out = ei(t, w.me - 0.25, w.me + 0.03);
    const cx = Math.max(200, Math.min(1720, ring.x)), cy = Math.max(200, Math.min(880, ring.y));
    const av = (
      <AbsoluteFill style={{ transform: `translateX(${-out * 1920}px)`, filter: out > 0.02 && out < 0.98 ? `blur(${Math.sin(out * Math.PI) * 24}px)` : undefined }}>
        <Avatar t={Math.max(t, w.ms)} />
        {/* piezas sobre el avatar */}
        {w.ms <= VO + 0.05 && <Tablet3D t={t} at={T.pastilla - 0.05} x={1450} y={400} sc={0.85} out={w.me - 0.3} />}
        {w.ms <= VO + 0.05 && <Tag t={t} at={T.pastilla + 0.25} x={1450} y={470} dx={-160} dy={180} text="UNA PASTILLA" sub="DE LAVAVAJILLAS" col={COL.ice} out={w.me - 0.4} size={46} />}
        {t >= T.nunca - 0.5 && <Chips t={t} at={Math.max(T.nunca + 0.3, w.ms + 0.3)} items={["EL ANILLO", "2 CAPAS", "PASTILLA", "DE NOCHE", "LA NOCHE", "LA PASADA", "SARRO VIEJO"]} out={MIN1_END + 5} />}
      </AbsoluteFill>
    );
    if (r >= 0.999) L.push(<AbsoluteFill key="av">{av}</AbsoluteFill>);
    else if (r > 0) L.push(<Portal key="av" x={cx} y={cy} r={r}>{av}</Portal>);
  }

  // ===== piezas del fondo, por frase =====
  if (t >= VO && t < T.estas) {
    const ck = scr(t, PT.clock);
    L.push(<Sticker key="luna" t={t} at={T.noche} out={T.anillo - 0.1} x={ck.x + 380} y={ck.y + 40} icon="luna" text="TODA LA NOCHE" col="#3a4f8f" />);
    !A && L.push(<Tag key="sinD" t={t} at={T.noche + 0.7} x={ck.x} y={ck.y + 120} dx={180} dy={130} text="SIN DESCARGAR" col={COL.ice} out={T.anillo - 0.1} size={46} />);
    !A && L.push(<Tag key="anM" t={t} at={T.anillo + 0.35} x={ring.x} y={ring.y} dx={-240} dy={-200} text="AÑOS DE SARRO" col={COL.amber} out={T.afloja - 0.1} size={52} />);
    L.push(<BigNum key="afl" t={t} at={T.afloja} text="SE AFLOJA" y={180} size={120} col="#9df0b4" edge="#1f5a36" out={T.pasada - 0.1} />);
    L.push(<Line key="pas" t={t} at={T.pasada} out={T.acidos - 0.1} text="UNA SOLA PASADA" y={140} size={92} col={COL.amber} />);
    L.push(<Line key="aci" t={t} at={T.acidos} out={T.mira - 0.1} text="SIN ÁCIDOS FUERTES" y={130} size={76} strike={T.acidos + 0.5} />);
    L.push(<Line key="rod" t={t} at={T.rodillas} out={T.mira - 0.1} text="SIN DEJARTE LAS RODILLAS" y={820} size={64} />);
    L.push(<Line key="mira" t={t} at={T.mira} out={T.estas - 0.1} text="MIRA." y={140} size={100} col={COL.amber} />);
  }
  if (t >= T.estas && t < T.tapa) L.push(<Tag key="dom" t={t} at={T.estas + 0.2} x={1240} y={560} dx={160} dy={-220} text="DOMINGO" sub="VIENEN VISITAS" col={COL.ice} out={T.tapa - 0.15} size={58} />);
  if (t >= T.linea - 0.4 && t < T.cloro) {
    // la toma de la tapa se abre como iris sobre la línea del corte
    !A && L.push(<Tag key="lin" t={t} at={T.linea + 0.3} x={ring.x} y={ring.y} dx={250} dy={-210} text="DONDE LLEGA EL AGUA" col={COL.amber} out={T.banera - 0.1} size={52} />);
    !A && L.push(<Tag key="ban" t={t} at={T.banera + 0.2} x={ring.x} y={ring.y} dx={-250} dy={190} text="COMO UNA BAÑERA VIEJA" col={COL.ink} out={T.cloro - 0.1} size={46} />);
  }
  if (t >= T.cloro && t < T.cepillo) L.push(<Tag key="clo" t={t} at={T.cloro + 0.2} x={1000} y={520} dx={-260} dy={-220} text="CLORO" sub="SÓLO LE SACA EL COLOR" col={COL.ice} out={T.cepillo - 0.1} size={64} />);
  if (t >= T.cepillo && t < T.muneca) L.push(<Count key="cnt" t={t} marks={[[T.vez1, "1"], [T.dos, "2"], [T.diez, "10"]]} out={T.muneca - 0.15} />);
  if (t >= T.descargas && t < T.pensar) {
    L.push(<Stamp key="sig" t={t} at={T.sigue} text="SIGUE AHÍ" x={1350} y={300} rot={7} size={110} out={T.pensar - 0.2} />);
    L.push(<Tag key="rie" t={t} at={T.riera + 0.1} x={960} y={620} dx={-240} dy={180} text="…IGUALITO" col={COL.dim} out={T.pensar - 0.2} size={46} />);
  }
  if (t >= T.pensar && t < T.nadie) {
    const k = spr(t, T.pensar, 0.9), o = e(t, T.pensar, T.pensar + 0.15) * (1 - e(t, T.nadie - 0.4, T.nadie - 0.1));
    L.push(<Card3D key="nuevo" id="img_o_inodoro_nuevo" x={1250} y={170} w={620} h={349} ry={(1 - Math.min(1, k)) * 60 - 8} rx={4} z={(1 - Math.min(1, k)) * -1200} o={o} label="¿CAMBIARLO?" />);
    L.push(<DrawX key="xN" t={t} at={T.noes} x={1280} y={200} w={560} h={290} />);
    L.push(<Stamp key="noes" t={t} at={T.noes + 0.25} text="NO ES EL INODORO" x={1380} y={700} rot={-5} size={74} out={T.nadie - 0.3} />);
  }
  if (t >= T.nadie - 0.2 && t < T.q1 - 0.3) {
    L.push(<Flash key="flN" t={t} at={T.nadie - 0.15} peak={0.45} />);
    L.push(<Line key="nad" t={t} at={T.nadie} out={T.sola - 0.1} text="NADIE TE EXPLICÓ" y={130} size={84} col={COL.amber} />);
    !A && L.push(<Tag key="que" t={t} at={T.nadie + 1.2} x={ring.x} y={ring.y} dx={-250} dy={-190} text="¿QUÉ ES ESTA LÍNEA?" col={COL.amber} out={T.siete - 0.2} size={56} />);
    !A && L.push(<Tag key="sol" t={t} at={T.sola + 0.2} x={ring.x} y={ring.y} dx={240} dy={170} text="SE VA CASI SOLA" col="#9df0b4" out={T.siete} size={48} />);
    L.push(<BigNum key="siete" t={t} at={T.siete} text="7 PASOS" y={500} size={190} col={COL.amber} edge="#5a3a10" sub="UNO POR UNO" out={T.q1 - 0.2} />);
  }
  if (t >= T.q1 - 0.3 && t < MIN1_END) {
    L.push(<Step key="s1" t={t} at={T.q1 + 0.1} out={T.q2 - 0.1} n={1} text="QUÉ ES EL ANILLO" q={[0.19, 0.3, 0.11]} dx={-280} dy={-200} />);
    L.push(<Step key="s2" t={t} at={T.q2 + 0.1} out={T.q3 - 0.1} n={2} text="¿CUÁL DE LAS 2 CAPAS?" q={PT.ringBack} dx={250} dy={-200} col={COL.ice} />);
    L.push(<Step key="s3" t={t} at={T.q3 + 0.4} out={T.q4 - 0.1} n={3} text="QUÉ PASTILLA SIRVE" q={PT.box} dx={-300} dy={-200} />);
    L.push(<Step key="s4" t={t} at={T.q4 + 0.4} out={T.q5 - 0.1} n={4} text="DÓNDE Y A QUÉ HORA" q={PT.clock} dx={260} dy={-120} col={COL.ice} />);
    L.push(<Step key="s5" t={t} at={T.q5 + 0.3} out={T.q6 - 0.1} n={5} text="LA NOCHE TRABAJA" q={PT.ringBack} dx={-280} dy={-200} />);
    L.push(<Step key="s6" t={t} at={T.q6 + 0.3} out={T.q7 - 0.1} n={6} text="UNA PASADA" q={PT.ringBack} dx={260} dy={-200} col="#9df0b4" />);
    L.push(<Step key="s7" t={t} at={T.q7 + 0.4} out={T.nunca - 0.1} n={7} text="EL SARRO VIEJO" q={[0.19, 0.3, 0.11]} dx={-280} dy={-200} col={COL.ice} />);
    L.push(<Stamp key="nun" t={t} at={T.nunca + 0.2} text="QUÉ NO HACER NUNCA" x={960} y={860} rot={-5} size={80} out={T.nunca + 3.4} />);
    const tk = scr(t, PT.tank);
    !A && L.push(<Tag key="pk" t={t} at={T.nunca + 0.9} x={tk.x} y={tk.y} dx={240} dy={-160} text="¿CLORO EN EL TANQUE?" col={COL.red} out={MIN1_END + 5} size={46} />);
  }

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
