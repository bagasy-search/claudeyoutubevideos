// rkopener · piezas 2.5D que viven encima del mundo, las tomas y el avatar (base cerpapeles, en inglés).
// Reloj de la voz (at), avatar por ventanas pagadas, tomas con empuje lento, barridos, sellos, cronómetro, descripción,
// portada y páginas REALES de la guía, comentario, la HUD de la cámara de seguridad.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import WORDS from "./words.json";
import { COL, FONT, P, Vid, e, ei, extrude, s, spr } from "./lib";

// ---------------- reloj de la voz ----------------
const norm = (x: string) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "");
const WN = (WORDS as { w: string; s: number }[]).map((x) => ({ w: norm(x.w), s: x.s }));
export const at = (ph: string, after = 0): number => {
  const q = norm(ph).split(" ").filter(Boolean);
  for (let i = 0; i < WN.length; i++) {
    if (WN[i].s < after) continue;
    if (q.every((w, j) => WN[i + j]?.w === w)) return WN[i].s;
  }
  throw new Error("at(): no encuentro «" + ph + "» en words.json");
};

const AV = AVAIL as { reel: boolean; reelLen?: number; ltx: string[] };
const LTX = new Set(AV.ltx); // tomas LTX ya bajadas (public/rkopener/ltx_<k>.mp4); si no, el cuadro clave img_<k>.jpg
// las tomas de la cámara de seguridad salen todas del mismo cuadro clave
const FB: Record<string, string> = { gancho_s1: "k_cam", gancho_s2: "k_cam", gancho_s3: "k_cam", plata_s1: "k_cam", plata_s2: "k_cam" };
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + (FB[k] ?? k));
const REEL_LEN = AV.reelLen ?? 301.8;
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const winAt = (t: number) => WIN.findIndex((w) => t >= w.ms && t < w.me);

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = AV.reel ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(REEL_LEN) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(REEL_LEN) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// toma real (LTX o cuadro clave) con empuje lento propio por plano
export const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number; dim?: number; from?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8, dim = 0, from = 0 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q, id = clip(k);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)`, filter: dim > 0 ? `brightness(${1 - dim})` : undefined }}><Vid id={id} from={from} at={id.startsWith("ltx_") ? a : undefined} /></AbsoluteFill>;
};
export const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)` }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)` }}>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// la HUD de la cámara de seguridad (CAM 1 · DRIVEWAY + hora que corre + REC)
export const CamHud: React.FC<{ t: number; t0: number; clock: number }> = ({ t, t0, clock }) => {
  const sec = Math.floor(clock + (t - t0)), hh = Math.floor(sec / 3600), mm = Math.floor(sec / 60) % 60, ss = sec % 60;
  const p2 = (n: number) => String(n).padStart(2, "0");
  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: "'Courier New', monospace" }}>
      <div style={{ position: "absolute", left: 60, top: 50, fontWeight: 700, fontSize: 40, color: "#e8f0e8", textShadow: "0 0 6px #000, 0 2px 4px #000", letterSpacing: 2 }}>CAM 1 · DRIVEWAY</div>
      <div style={{ position: "absolute", right: 60, top: 50, fontWeight: 700, fontSize: 40, color: "#e8f0e8", textShadow: "0 0 6px #000, 0 2px 4px #000", letterSpacing: 2 }}>{p2(hh)}:{p2(mm)}:{p2(ss)} AM</div>
      <div style={{ position: "absolute", left: 60, bottom: 50, display: "flex", alignItems: "center", gap: 14, fontWeight: 700, fontSize: 36, color: "#fff", textShadow: "0 0 6px #000" }}>
        <span style={{ width: 22, height: 22, borderRadius: 11, background: "#ff2d2d", opacity: Math.sin(t * 5) > 0 ? 1 : 0.2 }} />REC</div>
    </AbsoluteFill>
  );
};

export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at: a0, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, a0, 1.3), o = e(t, a0, a0 + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// cronómetro: la aguja da la vuelta y se clava en <n> <unit>
export const Stopwatch: React.FC<{ t: number; at: number; out: number; x: number; y: number; n: number; unit?: string; label?: string }> = ({ t, at: a0, out, x, y, n, unit = "SEC", label }) => {
  const k = Math.min(1.1, spr(t, a0, 0.9)), o = e(t, a0, a0 + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sweep = ei(t, a0 + 0.1, a0 + 1.4), ang = sweep * (360 + 60) - 90;
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
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: COL.ink, textShadow: extrude(10, "#3a2a14"), lineHeight: 1, whiteSpace: "nowrap" }}>{Math.round(sweep * n)} {unit}</div>
          {label && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.amber, letterSpacing: 3, marginTop: 10, textShadow: "0 3px 12px #000", whiteSpace: "nowrap" }}>{label}</div>}
        </div>
      </div>
    </div>
  );
};

// la descripción del video: el renglón 1 se ilumina (en pantalla NUNCA la URL: sólo el nombre y "first line")
export const Desc: React.FC<{ t: number; at: number; out: number; x?: number }> = ({ t, at: a0, out, x = 760 }) => {
  const k = spr(t, a0, 0.8), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, a0 + 0.4, a0 + 0.9), sweep = e(t, a0 + 0.4, a0 + 1.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: x, top: 600, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${8 + 3 * Math.sin(t * 0.8)}deg)`, width: 1000, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPTION</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 38, lineHeight: 1.3 }}>🔑 The Sleeping Key — Ray's car guide</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(840)}{L(900)}{L(620)}{L(760, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -480, top: -310, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>FIRST LINE OF THE DESCRIPTION ⬇</div>
    </div>
  );
};

// la portada real de la guía que entra girando
export const Cover: React.FC<{ t: number; at: number; out: number; x: number; y: number; w?: number }> = ({ t, at: a0, out, x, y, w = 430 }) => {
  const k = Math.min(1.1, spr(t, a0, 0.8)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 1600, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * 120 - 18 + 4 * Math.sin(t * 0.9)}deg) rotateX(4deg)`, width: w, height: w * 1.414, borderRadius: 8, overflow: "hidden", boxShadow: "-18px 0 0 #c9c2b2, 0 60px 110px rgba(0,0,0,.7)" }}>
        <Img src={staticFile(P + "guia_cover.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
};

// una página REAL de la guía en 3D: entra girando, la cámara se acerca al recuadro y lo marca
export const Page: React.FC<{ t: number; at: number; out: number; n: number; hl: string; box: [number, number, number, number] }> = ({ t, at: a0, out, n, hl, box }) => {
  const k = Math.min(1.08, spr(t, a0, 0.7)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const zoom = ei(t, a0 + 0.8, a0 + 3.5), mark = e(t, a0 + 1.4, a0 + 2.2);
  const [bx, by, bw, bh] = box, cy = (by + bh / 2) / 933;
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1800 }}>
      <div style={{ position: "absolute", left: 960 - 330, top: 70, width: 660, transformOrigin: `50% ${Math.round(cy * 100)}%`, transform: `rotateY(${(1 - Math.min(1, k)) * -80}deg) rotateX(${8 - 8 * zoom}deg) scale(${1 + 0.6 * zoom}) translateY(${(0.45 - cy) * 500 * zoom}px)` }}>
        <Img src={staticFile(P + `pag${n}.png`)} style={{ width: 660, borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }} />
        <div style={{ position: "absolute", left: bx, top: by, height: bh, width: bw * mark, background: "rgba(255,214,10,.33)", mixBlendMode: "multiply", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: bx - 8, top: by - 8, width: bw + 16, height: bh + 16, borderRadius: 10, boxShadow: `0 0 0 ${4 * mark}px rgba(255,180,40,.9)`, opacity: mark }} />
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 90, fontFamily: FONT, opacity: e(t, a0 + 0.5, a0 + 0.8) }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: COL.amber, letterSpacing: 4, textShadow: "0 3px 10px #000" }}>THE SLEEPING KEY · PAGE {n}</div>
        <div style={{ fontWeight: 900, fontSize: 52, color: "#fff", letterSpacing: 2, maxWidth: 560, textShadow: extrude(5, "rgba(0,0,0,.7)") }}>{hl}</div>
      </div>
    </AbsoluteFill>
  );
};

// título de cada arreglo: "FIX" + número grande + nombre que se escribe
export const PlaceTitle: React.FC<{ t: number; at: number; out: number; n: string; name: string; lbl?: string; good?: boolean }> = ({ t, at: a0, out, n, name, lbl = "FIX", good = true }) => {
  const k = Math.min(1.12, spr(t, a0, 0.85)), o = e(t, a0, a0 + 0.12) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const c = good ? "#7dffb4" : "#ff8a7a", edge = good ? "#0b3a22" : "#4a0c08";
  return (
    <div style={{ position: "absolute", left: 90, top: 110, opacity: o, fontFamily: FONT, perspective: 1200 }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70}deg)`, transformOrigin: "0 50%" }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: COL.ink, letterSpacing: 10, textShadow: "0 3px 12px #000" }}>{lbl}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: c, textShadow: extrude(10, edge) }}>{n}</div>
          <div style={{ fontWeight: 900, fontSize: 62, lineHeight: 1.05, color: "#fff", maxWidth: 760, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.7)"), clipPath: `inset(0 ${100 - 100 * e(t, a0 + 0.25, a0 + 0.7)}% 0 0)` }}>{name}</div>
        </div>
      </div>
    </div>
  );
};

// pastilla arriba (✗ rojo / ✓ verde)
export const Chip: React.FC<{ t: number; at: number; out: number; good?: boolean; text: string }> = ({ t, at: a0, out, good, text }) => {
  const k = Math.min(1.1, spr(t, a0)), o = e(t, a0, a0 + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `translateY(${(1 - Math.min(1, k)) * -90}px)`, display: "flex", alignItems: "center", gap: 18, padding: "14px 36px", borderRadius: 50, fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: "#fff",
        background: good ? "linear-gradient(180deg,#1f7a4d,#13452c)" : "linear-gradient(180deg,#a3221b,#5e0f0b)", boxShadow: `0 24px 50px rgba(0,0,0,.55), 0 0 30px ${good ? "rgba(63,224,138,.45)" : "rgba(255,60,40,.45)"}` }}>
        <span style={{ fontSize: 46 }}>{good ? "✓" : "✗"}</span>{text}
      </div>
    </div>
  );
};

// filas ✓ / ✗ que entran con su frase
export const Rows: React.FC<{ t: number; out: number; y?: number; items: { at: number; tx: string; ok: boolean }[] }> = ({ t, out, y = 300, items }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, fontFamily: FONT }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at, 0.9)), o = e(t, it.at, it.at + 0.12) * (1 - e(t, out, out + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 300 : -300)}px)`, display: "flex", alignItems: "center", gap: 26, padding: "16px 44px", borderRadius: 22,
          background: "rgba(10,14,22,.86)", boxShadow: `0 0 0 4px ${it.ok ? "#3fe08a" : COL.red}, 0 30px 60px rgba(0,0,0,.55)` }}>
          <span style={{ fontWeight: 900, fontSize: 70, color: it.ok ? "#7dffb4" : "#ff6b5e" }}>{it.ok ? "✓" : "✗"}</span>
          <span style={{ fontWeight: 900, fontSize: 58, color: "#fff", letterSpacing: 2 }}>{it.tx}</span>
        </div>
      );
    })}
  </div>
);

// frase grande palabra por palabra
export const Quote: React.FC<{ t: number; at: number; out: number; text: string; col?: string; y?: number; size?: number }> = ({ t, at: a0, out, text, col = "#fff", y = 400, size = 96 }) => {
  const w = text.split(" "), o = 1 - e(t, out, out + 0.3);
  if (t < a0 || o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.12, color: col, letterSpacing: 2, opacity: o }}>
      {w.map((x, i) => { const ai = a0 + i * 0.12, k = Math.min(1.1, spr(t, ai)); return <span key={i} style={{ display: "inline-block", margin: "0 14px", opacity: e(t, ai, ai + 0.08), transform: `translateY(${(1 - Math.min(1, k)) * 60}px)`, textShadow: extrude(7, "rgba(0,0,0,.65)") }}>{x}</span>; })}
    </div>
  );
};

// la pregunta para comentar (tarjeta tipo comentario, se escribe sola) + respuestas que llegan
export const Comment: React.FC<{ t: number; at: number; out: number; reply: number }> = ({ t, at: a0, out, reply }) => {
  const k = Math.min(1.1, spr(t, a0, 0.8)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const q = "Was there a remote on your visor? Be honest.", n = Math.round(q.length * e(t, a0 + 0.3, a0 + 2.4));
  const rs = ["yes… two of them 😬", "it's on my key ring now", "never thought about the door from the garage"];
  return (
    <div style={{ position: "absolute", left: 60, top: 600, width: 820, opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, fontFamily: FONT }}>
      <div style={{ padding: "34px 44px", borderRadius: 28, background: "rgba(250,248,242,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontWeight: 900, fontSize: 30, color: "#b03a2e", letterSpacing: 3 }}>💬 TELL ME IN THE COMMENTS</div>
        <div style={{ fontWeight: 800, fontSize: 56, color: "#1d2733", marginTop: 14, lineHeight: 1.2, minHeight: 140 }}>{q.slice(0, n)}<span style={{ opacity: Math.sin(t * 9) > 0 ? 1 : 0 }}>|</span></div>
      </div>
      {rs.map((r, i) => {
        const ai = reply + i * 0.6, kk = Math.min(1.1, spr(t, ai)), oo = e(t, ai, ai + 0.12);
        return <div key={i} style={{ opacity: oo, transform: `translateX(${(1 - Math.min(1, kk)) * 200}px)`, marginTop: 22, marginLeft: 80 + i * 30, display: "inline-flex", alignItems: "center", gap: 18, padding: "14px 30px", borderRadius: 40, background: "rgba(10,14,22,.9)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontWeight: 800, fontSize: 36, color: "#fff", marginRight: 1000 }}>
          <span style={{ fontSize: 40 }}>👤</span>{r}</div>;
      })}
    </div>
  );
};

// controles remotos en fila (cada uno es una llave): se cuentan y se tachan
export const Remotes: React.FC<{ t: number; ats: number[]; labels: string[]; out: number; y?: number; cross?: number }> = ({ t, ats, labels, out, y = 560, cross = 1e9 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 40, perspective: 1300, fontFamily: FONT }}>
    {ats.map((a0, i) => {
      const k = Math.min(1.1, spr(t, a0, 0.9)), o = e(t, a0, a0 + 0.12) * (1 - e(t, out, out + 0.3)), x = e(t, cross + i * 0.15, cross + i * 0.15 + 0.2);
      return (
        <div key={i} style={{ opacity: o, transform: `rotateY(${(1 - Math.min(1, k)) * 90 + (i - (ats.length - 1) / 2) * 6}deg) translateY(${Math.sin(t * 1.6 + i) * 6}px)`, width: 330, padding: "26px 0 22px", borderRadius: 24, textAlign: "center", position: "relative",
          background: "linear-gradient(180deg, rgba(250,248,242,.97), rgba(226,222,212,.97))", boxShadow: "0 36px 70px rgba(0,0,0,.6)" }}>
          <div style={{ margin: "0 auto", width: 90, height: 130, borderRadius: 18, background: "linear-gradient(180deg,#9aa0a6,#6c7277)", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {[0, 1, 2].map((b) => <div key={b} style={{ width: 46, height: 18, borderRadius: 9, background: "#3a3f44" }} />)}
          </div>
          <div style={{ fontWeight: 900, fontSize: 34, color: "#1d2733", letterSpacing: 2, marginTop: 14 }}>{labels[i]}</div>
          <div style={{ fontWeight: 900, fontSize: 30, color: COL.red, letterSpacing: 2 }}>= A KEY</div>
          {x > 0 && <svg width={330} height={300} style={{ position: "absolute", left: 0, top: 0 }}><line x1={30} y1={30} x2={30 + 270 * x} y2={30 + 240 * x} stroke={COL.red} strokeWidth={16} strokeLinecap="round" /></svg>}
        </div>
      );
    })}
  </div>
);
