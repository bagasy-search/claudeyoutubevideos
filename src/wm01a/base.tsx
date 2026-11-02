// wm01a · BASE: at("frase") anclado a la voz · avatar (ventanas pagadas de avwin.json) · Shot (clip Veo desde su punto de entrada) ·
// Stage (el escenario de cada componente: el clip de ese momento se hunde, se oscurece y queda desenfocado con paralaje detrás).
// Todo es f(t): nada guarda estado entre cuadros. Render SÓLO en el farm; stills SÓLO por still.mjs.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { FONT, P, e, s, spr, extrude } from "./lib";
import WORDS from "./words.json";
import AVW from "./avwin.json";

const nrm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const WN = (WORDS as { w: string; s: number; e: number }[]).map((x) => ({ n: nrm(x.w), s: x.s, e: x.e }));
// segundo en que EMPIEZA la frase (primera aparición después de `desde`); fin = segundo en que TERMINA
export const at = (frase: string, desde = 0, fin = false): number => {
  // texto pegado: el ASR a veces junta dos palabras en un token («about $37»)
  const q = nrm(frase);
  for (let i = 0; i < WN.length; i++) {
    if (WN[i].s < desde - 0.01 || !WN[i].n || !(q.startsWith(WN[i].n) || WN[i].n.startsWith(q))) continue;
    let acc = "", j = i; while (j < WN.length && acc.length < q.length) acc += WN[j++].n;
    if (acc.startsWith(q)) return fin ? WN[j - 1].e : WN[i].s;
  }
  throw new Error("at(): no está en la voz → " + frase);
};

// ---------- clip Veo: archivo public/wm01a/v/<id>.mp4, arranca en `o` segundos del clip cuando la línea llega a `a` ----------
export const Clip: React.FC<{ id: string; a: number; o?: number; rate?: number; style?: React.CSSProperties }> = ({ id, a, o = 0, rate = 1, style }) => (
  <Sequence from={s(a)} layout="none">
    <OffthreadVideo src={staticFile(P + "v/" + id + ".mp4")} startFrom={s(o)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
  </Sequence>
);
// toma a cuadro completo: empuje lento 1 → 1,035 y deriva mínima (Veo ya trae su propio movimiento)
export const Shot: React.FC<{ id: string; t: number; a: number; o?: number; push?: boolean }> = ({ id, t, a, o = 0, push = true }) => {
  const k = push ? e(t, a, a + 8) : 0, sc = 1.0 + 0.035 * k, dx = push ? 8 * Math.sin((t - a) * 0.21) : 0;
  return <AbsoluteFill style={{ transform: `translateX(${dx}px) scale(${sc})`, background: "#0b0907" }}><Clip id={id} a={a} o={o} /></AbsoluteFill>;
};

// ---------- AVATAR ----------
export const REEL = true;   // true cuando llega el reel del avatar (public/wm01a/reel0.mp4)
export const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const Avatar: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    {/* ⛔ el avatar va SIEMPRE nítido y entero: corte seco, sin blur, nada encima de la cara */}
    {REEL ? WIN.filter((w) => w.me > t - 1 && w.ms < t + 1).map((w) => (
      <Sequence key={w.ms} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}>
          <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (s(w.ms) >= 10 ? 10 : s(w.ms)))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
  </AbsoluteFill>
);

// ---------- ESCENARIO de cada componente ----------
// bg = {id, o, a}: el clip que estaba en pantalla justo antes (Body lo pasa por contexto) — sigue corriendo, se hunde y se oscurece.
export type Bg = { id: string; o: number; a: number } | undefined;
export const BgCtx = React.createContext<Bg>(undefined);
const MOTES = Array.from({ length: 16 }, (_, i) => ({ x: (Math.sin(i * 91.7) * 0.5 + 0.5) * 1920, y: (Math.sin(i * 37.3) * 0.5 + 0.5) * 1080, r: 1.6 + (i % 4) * 1.3, sp: 0.3 + (i % 5) * 0.12 }));
export const Stage: React.FC<{ t: number; a: number; b: number; tint?: string; dim?: number; children?: React.ReactNode }> = ({ t, a, b, tint = "#ffd9a8", dim = 0.5, children }) => {
  const bg = React.useContext(BgCtx);
  const sink = e(t, a - 0.05, a + 0.8), out = e(t, b - 0.3, b + 0.05), par = (t - a) * 7;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 60%, #2b2620 0%, #15110d 60%, #0b0907 100%)", overflow: "hidden" }}>
      {bg && <AbsoluteFill style={{ transform: `translateX(${-par}px) scale(${1.03 + 0.09 * sink})`, filter: `blur(${1 + 7 * sink}px) brightness(${1 - dim * 0.72 * sink}) saturate(${1 - 0.18 * sink})` }}>
        <Clip id={bg.id} a={bg.a} o={bg.o} rate={1} />
      </AbsoluteFill>}
      <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 50% 55%, transparent 40%, rgba(8,6,4,${0.45 * sink}) 100%)` }} />
      <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.02 ? `blur(${out * 10}px)` : undefined }}>{children}</AbsoluteFill>
      {bg && MOTES.map((m, i) => {
        const y = (m.y - (t * 20 * m.sp) % 1200 + 1200) % 1200 - 60, x = m.x + 24 * Math.sin(t * m.sp + i);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: m.r * 2, height: m.r * 2, borderRadius: "50%", background: `${tint}aa`, filter: `blur(${i % 3}px)`, opacity: sink * 0.45 * (1 - out) }} />;
      })}
    </AbsoluteFill>
  );
};

// rótulo (≤5 palabras) — sólo cuando el texto no puede vivir dentro de un objeto
export const Rot: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; size?: number; col?: string }> = ({ t, at: a, out, text, x, y, size = 64, col = "#f6efe2" }) => {
  const k = spr(t, a, 1.1), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 34}px) scale(${0.88 + 0.12 * Math.min(1.04, k)})`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: extrude(5, "rgba(0,0,0,.55)") }}>{text}</div>;
};
