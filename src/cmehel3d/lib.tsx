// cmehel3d · utilidades: at("frase") sobre la voz real (Groq), avatar por ventanas pagadas, tomas LTX (o su cuadro clave mientras no llegan).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { e, FONT, COL, spr, extrude } from "../cme3d01/lib";

export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);
export const P = "cmehel3d/";

// ---------- at("frase", después_de): segundo exacto en que la voz dice la frase ----------
const norm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9%]/g, "");
const WORDS = (CAPS as { text: string; startMs: number }[]).map((c) => ({ w: norm(c.text), t: c.startMs / 1000 })).filter((x) => x.w);
export const at = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].t < after - 0.01) continue;
    let ok = true;
    for (let j = 0; j < ws.length; j++) if (!WORDS[i + j] || WORDS[i + j].w !== ws[j]) { ok = false; break; }
    if (ok) return WORDS[i].t;
  }
  throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
};

const HAS = AVAIL as { clips: string[]; reel: boolean; dur?: Record<string, number> };

// ---------- avatar: ventanas pagadas del reel (preroll 10 cuadros, cola 0,65 s para salir con transición) ----------
export const WINS = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const Avatar: React.FC<{ t: number; blur?: number; dark?: number }> = ({ t, blur = 0, dark = 0 }) => {
  const face = HAS.reel ? WINS.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- toma LTX: el mp4 si llegó (sonido nativo va en la mezcla, acá muda); si no, su cuadro clave con empuje lento ----------
export const Take: React.FC<{ k: string; a: number; from?: number; z?: [number, number]; dur?: number }> = ({ k, a, from = 0, z = [1.0, 1.06], dur = 8 }) => {
  const t = useCurrentFrame() / FPS, sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  const inner = HAS.clips.includes(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + "ltx/" + k + ".mp4")} startFrom={s(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "ff/" + k.replace(/_s\d+$/, "") + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill>;
};

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

// lectura del tester: display LCD verde que vive AL LADO del tester real (nunca encima), con la cifra que se asienta
export const Lcd: React.FC<{ t: number; at: number; out: number; v: string; x: number; y: number; label?: string; unit?: string; col?: string }> = ({ t, at, out, v, x, y, label = "EN REPOSO", unit = "V", col = "#b6ff7a" }) => {
  const k = Math.min(1.08, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  // la cifra "busca" unos décimos antes de asentarse, como un tester de verdad
  const settle = e(t, at + 0.15, at + 0.9), shown = settle < 1 && Math.sin(t * 40) > 0 ? v.replace(/\d$/, (d) => String((+d + 1) % 10)) : v;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
      <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * -60 - 10}deg) scale(${0.7 + 0.3 * k})`, padding: "18px 30px 14px", borderRadius: 18, background: "linear-gradient(180deg,#1d2b1a,#0d140b)", boxShadow: "0 30px 60px rgba(0,0,0,.7), inset 0 0 0 3px #3b4a34", fontFamily: "'Courier New', monospace" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: "rgba(182,255,122,.7)" }}>{label}</div>
        <div style={{ fontWeight: 900, fontSize: 118, color: col, lineHeight: 1, textShadow: `0 0 22px ${col}88` }}>{shown}<span style={{ fontSize: 60, marginLeft: 10 }}>{unit}</span></div>
      </div>
    </div>
  );
};

// texto grande de una línea arriba (con extrusión)
export const Head: React.FC<{ t: number; at: number; out: number; text: string; y?: number; size?: number; col?: string }> = ({ t, at, out, text, y = 130, size = 70, col = COL.ink }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 6, color: col, opacity: o, transform: `scale(${0.85 + 0.15 * Math.min(1, spr(t, at))})`, textShadow: extrude(6, "#000") }}>{text}</div>;
};
