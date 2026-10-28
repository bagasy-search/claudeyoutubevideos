// tdccalor3 · piezas compartidas por el minuto 1 y el resto: el avatar, el mundo con barrido de movimiento, la toma LTX,
// el sello, el vaho, la escarcha de pantalla, el chip, el deslizamiento, la descripción y las preguntas que llueven.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { World as WorldRaw, camSpeed } from "./taller3d";
import AVW from "./avwin.json";
import REELJ from "./reel.json";
import LTXOK from "./ltx_ok.json";
import { COL, FONT, P, Vid, e, ei, extrude, s, spr } from "./lib";

const REEL = (REELJ as { reel: boolean }).reel;
export const OK = new Set(LTXOK as string[]);
type W = { ms: number; me: number; off: number };
export const WIN: W[] = (AVW as unknown as { win: W[] }).win;
// en la foto del avatar: la boca de su estufa-tambor (portal) y su ventana con escarcha
export const AV_STOVE = { x: 1390, y: 840 }, AV_WINDOW = { x: 490, y: 400 };

export const Avatar: React.FC<{ t: number; dark?: number }> = ({ t, dark = 0 }) => {
  // +14 cuadros: la Sequence sigue viva durante la transición de salida (si no, cuadros NEGROS)
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = REEL ? <><Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  // SIN desenfoque en el avatar (orden del creador 21-oct)
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>{face}</AbsoluteFill></AbsoluteFill>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// toma LTX (ultra real) con zoom lento; si todavía no llegó de la cola, se ve lo de abajo (children)
const CLIPLEN = 4.9;
export const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number]; from?: number; children?: React.ReactNode }> = ({ k, t, a, z = [1.03, 1.12], from = 0, children }) => {
  if (!OK.has(k)) return <>{children}</>;
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  // el clip LTX dura 5 s: abajo queda la foto, y el clip se funde a ella al terminar
  const op = 1 - e(t, a + CLIPLEN - 0.5, a + CLIPLEN - 0.05);
  return <>{children}{op > 0.001 && <AbsoluteFill style={{ transform: `scale(${sc})`, opacity: op }}><Sequence from={s(a)} durationInFrames={s(CLIPLEN)} layout="none"><Vid id={"ltx/" + k} from={from} /></Sequence></AbsoluteFill>}</>;
};
// foto (primer cuadro) con zoom lento
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number }> = ({ k, t, a, z = [1.04, 1.14], ox = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 6);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox * e(t, a, a + 6)}px)` }}><Img src={staticFile("img/" + P + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
};
// la toma con primer cuadro: si llegó el LTX va el clip; si no, la foto con zoom
export const Take: React.FC<{ k: string; img: string; t: number; a: number; z?: [number, number] }> = ({ k, img, t, a, z }) =>
  <Clip k={k} t={t} a={a} z={z}><Shot k={img} t={t} a={a} z={z} /></Clip>;

// sello que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// VAHO: bocanadas de aliento que salen de la boca del avatar (el frío dentro del taller)
export const Vaho: React.FC<{ t: number; a: number; b: number; x?: number; y?: number }> = ({ t, a, b, x = 905, y = 300 }) => {
  if (t < a || t > b + 2) return null;
  const puffs = [0, 1.25, 2.5, 3.6].map((d) => a + d).filter((p) => p < b);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{puffs.map((p, i) => {
    const k = (t - p) / 2.0; if (k < 0 || k > 1) return null;
    return <div key={i} style={{ position: "absolute", left: x + 40 * k + 10 * Math.sin(k * 5 + i), top: y - 120 * k, width: 70 + 220 * k, height: 50 + 140 * k, transform: "translate(-30%,-50%)", borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(235,243,255,.55), rgba(235,243,255,0) 70%)", filter: `blur(${6 + 18 * k}px)`, opacity: Math.sin(Math.PI * Math.min(1, k * 1.4)) * 0.85 }} />;
  })}</AbsoluteFill>;
};

// ESCARCHA DE PANTALLA: el frío trepa por los bordes del cuadro
export const FrostEdge: React.FC<{ amt: number }> = ({ amt }) => {
  if (amt <= 0.01) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", opacity: amt, boxShadow: `inset 0 0 ${120 + 120 * amt}px rgba(170,215,255,${0.45 * amt})` }} />;
};

export const Chip: React.FC<{ t: number; at: number; out: number; text: string; col?: string; x?: number; y?: number }> = ({ t, at, out, text, col = COL.amber, x = 110, y = 110 }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${Math.min(1.08, spr(t, at))})`, transformOrigin: "0 0", padding: "14px 30px", borderRadius: 40, background: "rgba(10,14,22,.92)", border: `3px solid ${col}`, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: col, boxShadow: "0 20px 40px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>;
};

// deslizamiento lateral con desenfoque (A sale, B entra); el lado que es el avatar va sin blur
export const Slide: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number }> = ({ t, a, b, from, to, dir = 1 }) => {
  const k = ei(t, a, b), mb = Math.sin(k * Math.PI) * 40;
  const isAv = (x: React.ReactNode) => React.isValidElement(x) && x.type === Avatar;
  return <>
    <AbsoluteFill style={{ transform: `translateX(${-dir * k * 1920}px)`, filter: mb > 1 && !isAv(from) ? `blur(${mb}px)` : undefined }}>{from}</AbsoluteFill>
    {k > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)`, filter: mb > 1 && !isAv(to) ? `blur(${mb}px)` : undefined }}>{to}</AbsoluteFill>}
  </>;
};

// la descripción del video: el renglón 1 se ilumina (nunca la URL hablada; en pantalla sólo el nombre de la guía)
export const Desc: React.FC<{ t: number; at: number; out: number; x?: number; scale?: number }> = ({ t, at, out, x = 1180, scale = 0.86 }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.7, at + 1.2), sweep = e(t, at + 0.7, at + 1.7);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: x, top: 640, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-12 + 4 * Math.sin(t * 0.8)}deg) scale(${scale})`, width: 1240, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 40, lineHeight: 1.25 }}>🔥 El Invierno Sin Gas · mis 5 manuales, paso a paso</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(980)}{L(1040)}{L(760)}{L(900, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -560, top: -170, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA ➜</div>
    </div>
  );
};

// LAS PREGUNTAS QUE LLOVIERON: tarjetas de comentario que caen y se apilan, una por pregunta
export const Questions: React.FC<{ t: number; out: number; qs: { at: number; txt: string; who: string }[] }> = ({ t, out, qs }) => {
  const o = 1 - e(t, out, out + 0.3); if (o <= 0.01) return null;
  return <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>{qs.map((q, i) => {
    const k = spr(t, q.at, 0.9); if (t < q.at) return null;
    const x = [1080, 1240, 1000, 1200][i % 4], y = 170 + i * 175, r = [-4, 3, -2, 4][i % 4];
    return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - Math.min(1, k)) * -500}px) rotate(${r}deg)`, background: "rgba(18,20,24,.95)", borderRadius: 22, padding: "18px 28px", boxShadow: "0 40px 80px rgba(0,0,0,.65)", fontFamily: FONT, width: 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: ["#ffb257", "#6fb4ff", "#7dff9e", "#ff7a8a"][i % 4], color: "#111", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{q.who[1].toUpperCase()}</div>
        <div style={{ color: "rgba(255,255,255,.6)", fontWeight: 800, fontSize: 24 }}>{q.who}</div>
      </div>
      <div style={{ marginTop: 10, color: "#fff", fontWeight: 800, fontSize: 40, lineHeight: 1.2 }}>{q.txt}</div>
    </div>;
  })}</AbsoluteFill>;
};

// el balde agujereado: el calor (agua naranja) se va por los agujeros
export const LeakyBucket: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1460, y = 560 }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const lvl = 1 - e(t, at + 0.4, out);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1, spr(t, at, 0.9))})`, opacity: o }}>
    <svg width={420} height={460} viewBox="0 0 420 460">
      <defs><clipPath id="bk"><path d="M60 80 L360 80 L320 400 L100 400 Z" /></clipPath></defs>
      <rect x={0} y={400 - 320 * lvl} width={420} height={460} fill="#ff7a2a" clipPath="url(#bk)" opacity={0.9} />
      <path d="M60 80 L360 80 L320 400 L100 400 Z" fill="none" stroke="#c9cdd2" strokeWidth={12} strokeLinejoin="round" />
      <path d="M70 80 Q210 -10 350 80" fill="none" stroke="#9aa1a8" strokeWidth={8} />
      {[[130, 300], [210, 340], [290, 310], [170, 220], [260, 250]].map(([cx, cy], i) => <g key={i}>
        <circle cx={cx} cy={cy} r={9} fill="#111" />
        {lvl * 320 > 400 - cy && <path d={`M${cx} ${cy} q ${i % 2 ? 30 : -30} 40 ${i % 2 ? 40 : -40} ${60 + 20 * Math.sin(t * 8 + i)}`} stroke="#ffb257" strokeWidth={8} fill="none" strokeLinecap="round" />}
      </g>)}
    </svg>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COL.amber, textShadow: extrude(5, "#5a2a00") }}>{Math.round(lvl * 20)} °C</div>
  </div>;
};
