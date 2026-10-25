// cer30 · EL MOTOR de los videos largos de Claudio (papeles / joyas / llave). Todo sale de plan.json (lo arma
// D:/rtmp/cer30/tools/build_plan.py contra la voz y las ventanas pagadas del avatar) y de avwin.json.
// Capa base = avatar dentro de cada ventana; fuera, la toma del plan (foto con Ken Burns, clip agnes, la maqueta 3D,
// la maqueta en térmica o la maqueta oscurecida como fondo de un gráfico). Entre tomas: barrido; de maqueta a maqueta la
// cámara vuela; portal al avatar 0,35 s antes de cada ventana. Encima, los overlays del plan, cada uno con su frase.
// Audio fuera de Remotion (voz + sonido real de los clips se mezclan en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World, posesOf, PTS, SPOTS, WIDE, makeCam, type Key, type Pose, type Scene, type WorldState, type V3 } from "./world";
import { BigNum, COL, FONT, LowerThird, P, Portal, e, ei, extrude, s, setP, spr } from "./lib";

export type Ov = { k: string; a: number; b: number; args?: string; good?: boolean; items?: { a: number; tx: string; ok?: boolean }[] };
export type Plan = { end: number; shots: { a: number; v: string }[]; ov: Ov[] };
export type Win = { ms: number; me: number; off: number };
export type Cfg = {
  slug: string; scene: Scene; plan: Plan; win: Win[];
  avail: { reel: boolean; reelLen?: number; clips: Record<string, number> };
  desc: string;                                   // renglón 1 de la descripción (sin URL)
  replies: { f: string; tx: string }[];           // respuestas del comentario fijo
  three?: { ic: string; tx: string; sub: string }[];
  index?: { title: string; rows: [string, string][] };
  pages?: Record<string, { hl: string; n: number; bar: [number, number, number, number] }>; // "l4 61" → título real, nº de truco, caja del título (0-1)
};

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const on = (t: number, x: number, y = 1e9, f = 0.4) => e(t, x, x + f) * (1 - e(t, y, y + f));
const THERM_FILTER = (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="therm" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0.35 0.55 0.1 0 0  0.35 0.55 0.1 0 0  0.35 0.55 0.1 0 0  0 0 0 1 0" />
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.01 0.12 0.42 0.82 1 1 1" />
        <feFuncG type="table" tableValues="0.01 0.03 0.04 0.16 0.5 0.85 1" />
        <feFuncB type="table" tableValues="0.1 0.42 0.62 0.42 0.08 0.15 0.9" />
      </feComponentTransfer>
    </filter>
  </svg>
);

// ======================= piezas =======================
const Avatar: React.FC<{ t: number; win: Win[]; reel: boolean; reelLen: number }> = ({ t, win, reel, reelLen }) => {
  const cur = win.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : win.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = reel ? <>{win.map((w, i) => {
    const st = Math.max(0, s(w.off) - 10), last = s(reelLen) - st - 2;
    return (
      <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
        <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={last} active={(f) => f > last}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={st} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
      </Sequence>);
  })}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

const ThermHud: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ pointerEvents: "none", fontFamily: FONT }}>
    {[[40, 40, 1, 1], [1880, 40, -1, 1], [40, 1040, 1, -1], [1880, 1040, -1, -1]].map(([x, y, sx, sy], i) => (
      <div key={i} style={{ position: "absolute", left: sx > 0 ? x : x - 70, top: sy > 0 ? y : y - 70, width: 70, height: 70, borderLeft: sx > 0 ? "5px solid rgba(255,255,255,.85)" : undefined, borderRight: sx < 0 ? "5px solid rgba(255,255,255,.85)" : undefined, borderTop: sy > 0 ? "5px solid rgba(255,255,255,.85)" : undefined, borderBottom: sy < 0 ? "5px solid rgba(255,255,255,.85)" : undefined }} />
    ))}
    <div style={{ position: "absolute", left: 80, top: 66, display: "flex", alignItems: "center", gap: 16, fontWeight: 900, fontSize: 34, color: "#fff", letterSpacing: 4, textShadow: "0 2px 10px #000" }}>
      <span style={{ width: 22, height: 22, borderRadius: 11, background: "#ff2d2d", opacity: Math.sin(t * 5) > 0 ? 1 : 0.25 }} />REC · LO QUE VE EL LADRÓN</div>
    <div style={{ position: "absolute", right: 80, top: 260, width: 22, height: 520, borderRadius: 11, background: "linear-gradient(0deg,#08061a,#3a0a6b,#a3175e,#e4521b,#ffd23a,#fff)", boxShadow: "0 0 0 3px rgba(255,255,255,.6)" }} />
    <div style={{ position: "absolute", right: 116, top: 248, fontWeight: 800, fontSize: 26, color: "#fff" }}>BUSCA</div>
    <div style={{ position: "absolute", right: 116, top: 764, fontWeight: 800, fontSize: 26, color: "rgba(255,255,255,.7)" }}>IGNORA</div>
  </AbsoluteFill>
);

const GoodRing: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3)), k = Math.min(1.1, spr(t, at, 0.8)), pul = 1 + 0.06 * Math.sin(t * 6);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${(0.4 + 0.6 * Math.min(1, k)) * pul})` }}>
      <div style={{ width: 230, height: 230, borderRadius: "50%", border: "10px solid #3fe08a", boxShadow: "0 0 40px rgba(63,224,138,.8), inset 0 0 40px rgba(63,224,138,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#bfffd9", textShadow: "0 0 20px rgba(63,224,138,.9)" }}>✓</div>
    </div>
  );
};

// foto (img_<k>.jpg) con empuje lento, o clip agnes (clip_<k>.mp4) estirado a la ranura (cámara lenta hasta 0,5x; si aún
// falta, se congela el último cuadro: nunca negro). Clip que no llegó → su cuadro clave img_<k>.jpg.
const Shot: React.FC<{ k: string; kind: string; t: number; a: number; dur: number; i: number; clips: Record<string, number> }> = ({ k, kind, t, a, dur, i, clips }) => {
  const zin = i % 2 === 0, z = zin ? [1.03, 1.13] : [1.13, 1.03], ox = (i % 3 - 1) * 24, oy = zin ? -10 : 10;
  const q = e(t, a, a + dur + 0.6), sc = z[0] + (z[1] - z[0]) * q;
  const cd = kind === "clip" ? clips[k] : undefined;
  let media: React.ReactNode;
  if (cd) {
    const rate = clamp(cd / Math.max(0.5, dur), 0.5, 1), last = Math.max(1, Math.floor((cd - 0.1) / rate * 30));
    media = <Sequence from={s(a)} layout="none"><Freeze frame={last} active={(f) => f > last}><OffthreadVideo src={staticFile(P + "clip_" + k + ".mp4")} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></Sequence>;
  } else media = <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}>{media}</AbsoluteFill></AbsoluteFill>;
};

const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)` }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)` }}>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 96, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.35)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

const DocList: React.FC<{ t: number; items: { at: number; tx: string; ic: string }[]; out: number; x?: number }> = ({ t, items, out, x = 1230 }) => (
  <div style={{ position: "absolute", left: x, top: 120, perspective: 1300 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out + i * 0.04, out + i * 0.04 + 0.25));
      if (o <= 0.01) return null;
      return (
        <div key={i} style={{ opacity: o, display: "flex", alignItems: "center", gap: 22, margin: "0 0 18px", padding: "14px 30px 14px 20px", borderRadius: 16, width: 580,
          transform: `translateY(${(1 - Math.min(1, k)) * -160}px) rotateX(${(1 - Math.min(1, k)) * 60}deg) rotateY(-12deg) rotateZ(${(i % 2 ? 1 : -1) * 1.4}deg)`,
          background: "linear-gradient(180deg,#fbf7ec,#e8e1cf)", boxShadow: "0 26px 50px rgba(0,0,0,.55), inset 0 -3px 0 rgba(0,0,0,.08)", fontFamily: FONT }}>
          <div style={{ fontSize: 54, width: 70, textAlign: "center" }}>{it.ic}</div>
          <div style={{ fontWeight: 900, fontSize: items.length > 5 ? 38 : 44, color: "#1d2733", letterSpacing: 1 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

const Stopwatch: React.FC<{ t: number; at: number; out: number; x: number; y: number; n: number; label?: string }> = ({ t, at, out, x, y, n, label }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sweep = ei(t, at + 0.1, at + 1.4), ang = sweep * (360 + 60) - 90;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
      <div style={{ transform: `rotateY(${-18 + 6 * Math.sin(t)}deg) rotateX(8deg)`, display: "flex", alignItems: "center", gap: 34 }}>
        <svg width={300} height={340} viewBox="0 0 300 340" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
          <rect x={128} y={0} width={44} height={34} rx={8} fill="#c9ced3" />
          <circle cx={150} cy={190} r={140} fill="#d9dde1" /><circle cx={150} cy={190} r={124} fill="#fbfbf8" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={150 + 108 * Math.sin(i * 0.5236)} y1={190 - 108 * Math.cos(i * 0.5236)} x2={150 + 120 * Math.sin(i * 0.5236)} y2={190 - 120 * Math.cos(i * 0.5236)} stroke="#33404d" strokeWidth={i % 3 ? 3 : 7} />)}
          <line x1={150} y1={190} x2={150 + 100 * Math.cos((ang * Math.PI) / 180)} y2={190 + 100 * Math.sin((ang * Math.PI) / 180)} stroke={COL.red} strokeWidth={8} strokeLinecap="round" />
          <circle cx={150} cy={190} r={12} fill="#222" />
        </svg>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: COL.ink, textShadow: extrude(10, "#3a2a14"), lineHeight: 1 }}>{Math.round(sweep * n)} MIN</div>
          {label && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.amber, letterSpacing: 3, marginTop: 10, textShadow: "0 3px 12px #000" }}>{label}</div>}
        </div>
      </div>
    </div>
  );
};

const Subscribe: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = Math.min(1.1, spr(t, at - 0.3, 0.9)), o = e(t, at - 0.3, at - 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const click = e(t, at + 0.35, at + 0.5), done = t > at + 0.5, ring = t > at + 1.0 ? Math.sin((t - at) * 22) * 18 * (1 - e(t, at + 1.0, at + 2.2)) : 0;
  const cx = 1180 - 200 * e(t, at - 0.2, at + 0.35), cy = 700 - 120 * e(t, at - 0.2, at + 0.35);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * Math.min(1, k)) * (1 - 0.06 * click * (done ? 0 : 1))})`, display: "flex", gap: 26, alignItems: "center", fontFamily: FONT }}>
        <div style={{ padding: "26px 60px", borderRadius: 60, background: done ? "#3a3a3a" : "#e62117", color: "#fff", fontWeight: 900, fontSize: 64, letterSpacing: 3, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>{done ? "SUSCRITO ✓" : "SUSCRIBIRSE"}</div>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "rgba(250,248,242,.96)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, transform: `rotate(${ring}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>🔔</div>
      </div>
      <div style={{ position: "absolute", left: cx, top: cy, fontSize: 80, transform: `scale(${1 - 0.15 * click})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.6))" }}>👆</div>
    </AbsoluteFill>
  );
};

// la descripción: el renglón 1 se ilumina (en pantalla NUNCA la URL: sólo el nombre y "1ª línea")
const Desc: React.FC<{ t: number; at: number; out: number; text: string }> = ({ t, at, out, text }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 760, top: 560, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${8 + 3 * Math.sin(t * 0.8)}deg)`, width: 1060, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 38, lineHeight: 1.3 }}>{text}</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(880)}{L(940)}{L(660)}{L(800, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -500, top: -300, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA DE LA DESCRIPCIÓN 👇</div>
    </div>
  );
};

// la portada real del libro (portada_lN.png) que entra girando
const Cover: React.FC<{ t: number; at: number; out: number; n: string; x?: number; y?: number }> = ({ t, at, out, n, x = 1480, y = 520 }) => {
  const k = Math.min(1.1, spr(t, at, 0.8)), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 1600, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * 120 - 18 + 4 * Math.sin(t * 0.9)}deg) rotateX(4deg)`, width: 430, height: 600, borderRadius: 8, overflow: "hidden", boxShadow: "-18px 0 0 #c9c2b2, 0 60px 110px rgba(0,0,0,.7)" }}>
        <Img src={staticFile(P + "portada_" + n + ".png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: -230, top: 330, width: 460, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: COL.ink, letterSpacing: 2, opacity: e(t, at + 0.5, at + 0.8), textShadow: "0 3px 12px #000" }}>EL MÉTODO DEL CERRAJERO</div>
    </div>
  );
};

// una página REAL de la guía (pag_lN_P.png): entra girando, la cámara se acerca y subraya
const Page: React.FC<{ t: number; at: number; out: number; book: string; n: number; hl: string; truco?: number; bar?: [number, number, number, number] }> = ({ t, at: a0, out, book, n, hl, truco, bar = [0.15, 0.08, 0.7, 0.05] }) => {
  const k = Math.min(1.08, spr(t, a0, 0.7)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const zoom = ei(t, a0 + 0.8, a0 + 3.5), mark = e(t, a0 + 1.4, a0 + 2.2);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1800 }}>
      <div style={{ position: "absolute", left: 1180 - 330, top: 70, width: 660, transformOrigin: "50% 20%", transform: `rotateY(${(1 - Math.min(1, k)) * -80}deg) rotateX(${8 - 8 * zoom}deg) scale(${1 + 0.55 * zoom}) translateY(${120 * zoom}px)` }}>
        <Img src={staticFile(P + `pag_${book}_${n}.png`)} style={{ width: 660, borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }} />
        <div style={{ position: "absolute", left: 660 * bar[0] - 8, top: 854 * bar[1] - 6, height: 854 * bar[3] + 12, width: (660 * bar[2] + 16) * mark, background: "rgba(255,214,10,.45)", mixBlendMode: "multiply", borderRadius: 6 }} />
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 90, fontFamily: FONT, opacity: e(t, a0 + 0.5, a0 + 0.8) }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: COL.amber, letterSpacing: 4, textShadow: "0 3px 10px #000" }}>LIBRO {book.replace("l", "")} · {truco ? `TRUCO ${truco}` : `PÁGINA ${n}`}</div>
        <div style={{ fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 2, maxWidth: 500, textShadow: extrude(5, "rgba(0,0,0,.7)") }}>{hl}</div>
      </div>
    </AbsoluteFill>
  );
};

const PlaceTitle: React.FC<{ t: number; at: number; out: number; n: string; name: string; good?: boolean }> = ({ t, at: a0, out, n, name, good }) => {
  const k = Math.min(1.12, spr(t, a0, 0.85)), o = e(t, a0, a0 + 0.12) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const c = good ? "#7dffb4" : "#ff8a7a", edge = good ? "#0b3a22" : "#4a0c08";
  return (
    <div style={{ position: "absolute", left: 90, top: 110, opacity: o, fontFamily: FONT, perspective: 1200 }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70}deg)`, transformOrigin: "0 50%" }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: COL.ink, letterSpacing: 10, textShadow: "0 3px 12px #000" }}>{good ? "NÚMERO" : "LUGAR"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: c, textShadow: extrude(10, edge) }}>{n}</div>
          <div style={{ fontWeight: 900, fontSize: name.length > 30 ? 50 : 62, lineHeight: 1.05, color: "#fff", maxWidth: 820, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.7)"), clipPath: `inset(0 ${100 - 100 * e(t, a0 + 0.25, a0 + 0.7)}% 0 0)` }}>{name}</div>
        </div>
      </div>
    </div>
  );
};

const Chip: React.FC<{ t: number; at: number; out: number; good?: boolean; text?: string }> = ({ t, at: a0, out, good, text }) => {
  const k = Math.min(1.1, spr(t, a0)), o = e(t, a0, a0 + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `translateY(${(1 - Math.min(1, k)) * -90}px)`, display: "flex", alignItems: "center", gap: 18, padding: "14px 36px", borderRadius: 50, fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: "#fff",
        background: good ? "linear-gradient(180deg,#1f7a4d,#13452c)" : "linear-gradient(180deg,#a3221b,#5e0f0b)", boxShadow: `0 24px 50px rgba(0,0,0,.55), 0 0 30px ${good ? "rgba(63,224,138,.45)" : "rgba(255,60,40,.45)"}` }}>
        <span style={{ fontSize: 46 }}>{good ? "✓" : "✗"}</span>{text ?? (good ? "LO QUE YO HAGO" : "LO QUE HACE CASI TODO EL MUNDO")}
      </div>
    </div>
  );
};

const Rows: React.FC<{ t: number; out: number; y?: number; items: { at: number; tx: string; ok: boolean }[] }> = ({ t, out, y = 300, items }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, fontFamily: FONT }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at, 0.9)), o = e(t, it.at, it.at + 0.12) * (1 - e(t, out, out + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 300 : -300)}px)`, display: "flex", alignItems: "center", gap: 26, padding: "16px 44px", borderRadius: 22,
          background: "rgba(10,14,22,.86)", boxShadow: `0 0 0 4px ${it.ok ? "#3fe08a" : COL.red}, 0 30px 60px rgba(0,0,0,.55)` }}>
          <span style={{ fontWeight: 900, fontSize: 70, color: it.ok ? "#7dffb4" : "#ff6b5e" }}>{it.ok ? "✓" : "✗"}</span>
          <span style={{ fontWeight: 900, fontSize: items.length > 3 ? 50 : 60, color: "#fff", letterSpacing: 2 }}>{it.tx}</span>
        </div>
      );
    })}
  </div>
);

const Copies: React.FC<{ t: number; a: number; b: number; c: { ic: string; tx: string; sub: string }[] }> = ({ t, a, b, c }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", gap: 34, perspective: 1300, fontFamily: FONT }}>
    {c.map((it, i) => {
      const ai = a + i * Math.min(3, (b - a) / 4), k = Math.min(1.1, spr(t, ai, 0.9)), o = e(t, ai, ai + 0.12) * (1 - e(t, b, b + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `rotateX(${(1 - Math.min(1, k)) * 80}deg) translateY(${Math.sin(t * 1.5 + i) * 5}px)`, transformOrigin: "50% 100%", width: 460, padding: "20px 0 18px", borderRadius: 24, textAlign: "center",
          background: "linear-gradient(180deg,#1f6b45,#13452c)", boxShadow: "0 36px 70px rgba(0,0,0,.6), 0 0 0 3px rgba(125,255,180,.5)" }}>
          <div style={{ fontWeight: 900, fontSize: 46, color: "#bfffd9" }}>{i + 1}</div>
          <div style={{ fontSize: 90, lineHeight: 1.1 }}>{it.ic}</div>
          <div style={{ fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: 2, marginTop: 6 }}>{it.tx}</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: "rgba(255,255,255,.75)", letterSpacing: 2, marginTop: 4, padding: "0 16px" }}>{it.sub}</div>
        </div>
      );
    })}
  </div>
);

// la hoja de índice escrita a mano: renglón por renglón
const IndexSheet: React.FC<{ t: number; a: number; b: number; title: string; rows: [string, string][] }> = ({ t, a, b, title, rows }) => {
  const k = Math.min(1.08, spr(t, a, 0.7)), o = e(t, a, a + 0.15) * (1 - e(t, b, b + 0.3));
  if (o <= 0.01) return null;
  const step = Math.min(2.4, (b - a - 2) / Math.max(1, rows.length));
  return (
    <div style={{ position: "absolute", left: 960, top: 540, opacity: o, perspective: 1600 }}>
      <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 70 + 10}deg) rotateZ(-2deg)`, width: 1080, padding: "40px 60px 50px", borderRadius: 8,
        background: "repeating-linear-gradient(180deg,#fbf8ef 0 62px,#c9d6e6 62px 64px)", boxShadow: "0 60px 110px rgba(0,0,0,.7)", fontFamily: "'Segoe Print','Comic Sans MS',cursive" }}>
        <div style={{ fontWeight: 700, fontSize: 52, color: "#1b2a6b", borderBottom: "4px solid #c0392b", paddingBottom: 8 }}>{title}</div>
        {rows.map(([l, r], i) => {
          const ai = a + 1.2 + i * step, w = e(t, ai, ai + 0.9);
          return <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 42, color: "#1b2a6b", marginTop: 14, clipPath: `inset(0 ${100 - 100 * w}% 0 0)` }}><span>{l}</span><span>→ {r}</span></div>;
        })}
      </div>
    </div>
  );
};

// paso numerado de "la tarde completa"
const Step: React.FC<{ t: number; a: number; b: number; n: string; tx: string }> = ({ t, a, b, n, tx }) => {
  const k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.12) * (1 - e(t, b, b + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 90, bottom: 110, opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * -400}px)`, display: "flex", alignItems: "center", gap: 26, fontFamily: FONT }}>
      <div style={{ width: 150, height: 150, borderRadius: 75, background: "linear-gradient(180deg,#ffd23a,#e0a800)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 96, color: "#2a1d00", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>{n}</div>
      <div style={{ padding: "18px 36px", borderRadius: 20, background: "rgba(10,14,22,.88)", fontWeight: 900, fontSize: 56, color: "#fff", letterSpacing: 2, maxWidth: 1300, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
        <div style={{ fontSize: 26, color: COL.amber, letterSpacing: 5 }}>PASO {n}</div>{tx}
      </div>
    </div>
  );
};

const Comment: React.FC<{ t: number; at: number; out: number; q: string; replies: { f: string; tx: string }[] }> = ({ t, at: a0, out, q, replies }) => {
  const k = Math.min(1.1, spr(t, a0, 0.8)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = Math.round(q.length * e(t, a0 + 0.3, a0 + 2.6)), reply = a0 + 3.0;
  return (
    <div style={{ position: "absolute", left: 360, top: 170, width: 1200, opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, fontFamily: FONT }}>
      <div style={{ padding: "34px 44px", borderRadius: 28, background: "rgba(250,248,242,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontWeight: 900, fontSize: 30, color: "#b03a2e", letterSpacing: 3 }}>💬 ESCRÍBEMELO EN LOS COMENTARIOS</div>
        <div style={{ fontWeight: 800, fontSize: 52, color: "#1d2733", marginTop: 14, lineHeight: 1.2, minHeight: 130 }}>{q.slice(0, n)}<span style={{ opacity: Math.sin(t * 9) > 0 ? 1 : 0 }}>|</span></div>
      </div>
      {replies.map((r, i) => {
        const ai = reply + i * 0.6, kk = Math.min(1.1, spr(t, ai)), oo = e(t, ai, ai + 0.12);
        return <div key={i} style={{ opacity: oo, transform: `translateX(${(1 - Math.min(1, kk)) * 200}px)`, marginTop: 22, marginLeft: 80 + i * 30, display: "inline-flex", alignItems: "center", gap: 18, padding: "14px 30px", borderRadius: 40, background: "rgba(10,14,22,.9)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontWeight: 800, fontSize: 36, color: "#fff", marginRight: 1000 }}>
          <span style={{ fontSize: 44 }}>{r.f}</span>{r.tx}</div>;
      })}
    </div>
  );
};

// ======================= el video =======================
export const makeVideo = (cfg: Cfg) => {
  setP(cfg.slug + "/");
  const { plan, win, scene } = cfg, END = plan.end, B = [...plan.shots].sort((x, y) => x.a - y.a), OV = plan.ov;
  const POSE = posesOf(scene), PT = PTS[scene];
  const reelLen = cfg.avail.reelLen ?? 1e9;
  const RW = win.map((w) => [w.ms, w.me] as [number, number]);
  const winAt = (t: number) => RW.findIndex(([a0, b0]) => t >= a0 && t < b0);
  const beatAt = (t: number) => { let lo = 0, hi = B.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (B[m].a <= t) lo = m; else hi = m - 1; } return lo; };
  const kindOf = (v: string) => v.split(":")[0];
  const isWorld = (v: string) => ["w", "t", "g"].includes(kindOf(v));
  const poseOf = (v: string): Pose => { const [k, n] = v.split(":"); return k === "g" ? POSE[WIDE] : POSE[n] ?? POSE[WIDE]; };
  const push = (q: Pose, k = 0.12): Pose => ({ p: q.p.map((v, i) => v + (q.l[i] - v) * k) as V3, l: q.l, fov: q.fov - 2 });

  // cámara: vuela de pose en pose (si viene de otra toma de la maqueta) y empuja despacio
  const KEYS: Key[] = [];
  {
    let prev: Pose | null = null;
    B.forEach((b, i) => {
      const end = i < B.length - 1 ? B[i + 1].a : END;
      if (!isWorld(b.v)) { prev = null; return; }
      const q = poseOf(b.v), fly = prev && end - b.a > 2.2 ? 1.1 : 0;
      if (prev) KEYS.push({ t: b.a, ...prev });
      KEYS.push({ t: b.a + fly, ...q, arc: 0.03 });
      prev = kindOf(b.v) === "g" ? q : push(q, 0.1 + Math.min(0.12, (end - b.a) * 0.01));
      KEYS.push({ t: end - 0.01, ...prev });
    });
  }
  const CAM = makeCam(KEYS, PT.center);

  const by = (k: string) => OV.filter((o) => o.k === k);
  const THERM = by("therm").map((o) => [o.a, o.b] as [number, number]);
  const thermAt = (t: number, i: number) => kindOf(B[i].v) === "t" || THERM.some(([x, y]) => t >= x && t < y);
  const ANIM = by("anim"), HEAT = by("heat"), HEATALL = by("heatall"), GOOD = by("good"), TRAIL = by("trail");
  const stAt = (t: number, th: boolean): WorldState => {
    const anim: Record<string, number> = {}, heat: Record<string, number> = {}, good: Record<string, number> = {};
    for (const o of ANIM) if (o.args) anim[o.args] = Math.max(anim[o.args] ?? 0, on(t, o.a, o.b, 0.7));
    for (const o of HEAT) if (o.args) heat[o.args] = Math.max(heat[o.args] ?? 0, on(t, o.a, o.b));
    for (const o of HEATALL) { const v = on(t, o.a, o.b); if (v > 0) SPOTS[scene].forEach((k, i) => { heat[k] = Math.max(heat[k] ?? 0, on(t, o.a + i * 0.35, o.b)); }); void v; }
    for (const o of GOOD) if (o.args) good[o.args] = Math.max(good[o.args] ?? 0, on(t, o.a, o.b));
    const trail = TRAIL.reduce((m, o) => Math.max(m, t >= o.a && t < o.b + 0.4 ? e(t, o.a, o.b) * (1 - e(t, o.b, o.b + 0.4)) : 0), 0);
    return { lamps: th ? 0.05 : 1, anim, heat, good, trail, hot: th ? "#ffffff" : "#ff3a2a" };
  };

  const WorldR: React.FC<{ t: number; i: number }> = ({ t, i }) => {
    const th = thermAt(t, i), g = kindOf(B[i].v) === "g";
    const filt = [th ? "url(#therm)" : "", g ? "brightness(0.42) blur(5px)" : ""].join(" ").trim();
    return (
      <AbsoluteFill>
        {THERM_FILTER}
        <AbsoluteFill style={{ filter: filt || undefined, transform: g ? "scale(1.04)" : undefined }}><World t={t} cam={CAM} st={stAt(t, th)} scene={scene} /></AbsoluteFill>
        {th && <ThermHud t={t} />}
        {th && GOOD.map((o, j) => { if (t < o.a - 0.2 || t > o.b + 0.4 || !o.args || !PT[o.args]) return null; const q = CAM.screenOf(t, PT[o.args]); return <GoodRing key={"gr" + j} t={t} at={o.a} out={o.b} x={q.x} y={q.y} />; })}
      </AbsoluteFill>
    );
  };

  const Visual: React.FC<{ i: number; t: number }> = ({ i, t }) => {
    const b = B[i], end = i < B.length - 1 ? B[i + 1].a : END, [kind, k] = b.v.split(":");
    if (kind === "img" || kind === "clip") return <Shot k={k} kind={kind} t={t} a={b.a} dur={end - b.a} i={i} clips={cfg.avail.clips} />;
    return <WorldR t={t} i={i} />;
  };

  const Av: React.FC<{ t: number }> = ({ t }) => <Avatar t={t} win={win} reel={cfg.avail.reel} reelLen={reelLen} />;

  const overlay = (o: Ov, t: number, j: number): React.ReactNode => {
    if (t < o.a - 0.5 || t > o.b + 0.8) return null;
    const key = o.k + j, args = o.args ?? "";
    switch (o.k) {
      case "place": { const [n, ...r] = args.split(" "); return <PlaceTitle key={key} t={t} at={o.a + 0.1} out={o.b} n={n} name={r.join(" ")} good={o.good ?? +n >= 6} />; }
      case "chip": { const [g, ...r] = args.split(" "); return <Chip key={key} t={t} at={o.a} out={o.b} good={g === "good"} text={r.length ? r.join(" ") : undefined} />; }
      case "stamp": return <Stamp key={key} t={t} at={o.a} out={o.b} text={args} x={960} y={300} size={args.length > 20 ? 72 : 90} />;
      case "big": return <BigNum key={key} t={t} at={o.a} out={o.b} text={args} size={args.length > 14 ? 120 : 200} />;
      case "lower": { const [n, l2 = ""] = args.split("|").map((x) => x.trim()); return <LowerThird key={key} t={t} at={o.a} out={o.b} name={n} l2={l2} l2at={o.a + 0.6} />; }
      case "watch": { const [n, ...r] = args.split(" "); return <Stopwatch key={key} t={t} at={o.a} out={o.b} x={1300} y={540} n={+n} label={r.join(" ") || undefined} />; }
      case "docs": return <DocList key={key} t={t} out={o.b} items={(o.items ?? []).map((it) => { const [ic, ...r] = it.tx.split(" "); return { at: it.a, ic, tx: r.join(" ") }; })} />;
      case "rows": return <Rows key={key} t={t} out={o.b} y={(o.items ?? []).length > 3 ? 220 : 300} items={(o.items ?? []).map((it) => ({ at: it.a, tx: it.tx, ok: !!it.ok }))} />;
      case "sub": return <Subscribe key={key} t={t} at={o.a + 0.3} out={o.b} />;
      case "desc": return <Desc key={key} t={t} at={o.a} out={o.b} text={cfg.desc} />;
      case "cover": return <Cover key={key} t={t} at={o.a} out={o.b} n={args || "l4"} />;
      case "book": { const [bk, n] = args.split(" "), pg = cfg.pages?.[args]; return <Page key={key} t={t} at={o.a} out={o.b} book={bk} n={+n} hl={pg?.hl ?? "EL MÉTODO DEL CERRAJERO"} truco={pg?.n} bar={pg?.bar} />; }
      case "step": { const [n, ...r] = args.split(" "); return <Step key={key} t={t} a={o.a} b={o.b} n={n} tx={r.join(" ")} />; }
      case "comment": return <Comment key={key} t={t} at={o.a} out={o.b} q={args} replies={cfg.replies} />;
      case "index": return cfg.index ? <IndexSheet key={key} t={t} a={o.a} b={o.b} title={cfg.index.title} rows={cfg.index.rows} /> : null;
      case "three": return cfg.three ? <Copies key={key} t={t} a={o.a} b={o.b} c={cfg.three} /> : null;
      default: return null; // heat / heatall / good / anim / therm / trail van al estado del mundo
    }
  };

  const Full: React.FC = () => {
    const t = useCurrentFrame() / 30;
    const L: React.ReactNode[] = [];
    const wi = winAt(t), bi = beatAt(t);
    if (wi >= 0) L.push(<Av key="av" t={t} />);
    else {
      const prevW = RW.find(([, e0]) => t >= e0 && t < e0 + 0.38);
      const b = B[bi], startedInWin = winAt(b.a) >= 0 || RW.some(([, e0]) => Math.abs(e0 - b.a) < 0.4);
      if (prevW) L.push(<Swipe key="sx" t={t} a={prevW[1]} b={prevW[1] + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 3 === 0} from={<Av t={t} />} to={<Visual i={bi} t={t} />} />);
      else if (bi > 0 && t < b.a + 0.38 && !startedInWin && !(isWorld(B[bi - 1].v) && isWorld(b.v)))
        L.push(<Swipe key={"sb" + bi} t={t} a={b.a} b={b.a + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 4 === 1} from={<Visual i={bi - 1} t={t} />} to={<Visual i={bi} t={t} />} />);
      else L.push(<Visual key={"v" + bi} i={bi} t={t} />);
      const nextW = RW.find(([s0]) => t >= s0 - 0.35 && t < s0);
      if (nextW) L.push(<Portal key="pw" x={960} y={540} r={ei(t, nextW[0] - 0.35, nextW[0])}><Av t={t} /></Portal>);
    }
    OV.forEach((o, j) => { const n = overlay(o, t, j); if (n) L.push(n); });
    const fade = e(t, END - 1.2, END - 0.1);
    if (fade > 0) L.push(<AbsoluteFill key="fd" style={{ background: "#000", opacity: fade }} />);
    return <AbsoluteFill style={{ background: "#000" }}>{L}</AbsoluteFill>;
  };
  return { Full, END, frames: Math.round(END * 30) };
};
