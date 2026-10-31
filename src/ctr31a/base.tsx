// ctr31a · BASE: at("frase") anclado a la voz · avatar (ventanas pagadas de avwin.json) · Shot (clips Veo de avatarity) ·
// Stage (el escenario de cada componente: la toma de ese momento desenfocada con paralaje, piso con charco de luz, haz que
// respira, motas de polvo). Todo es f(t): nada guarda estado entre cuadros. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, staticFile } from "remotion";
import { FONT, P, e, s, spr, extrude } from "./lib";
import WORDS from "./words.json";
import AVW from "./avwin.json";
import CLIPS from "./clips.json";

const nrm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");
const WN = (WORDS as { w: string; s: number; e: number }[]).map((x) => ({ n: nrm(x.w), s: x.s, e: x.e }));
export const END_VOZ = WN[WN.length - 1].e;
// segundo en que EMPIEZA la frase (primera aparición después de `desde`); fin = segundo en que TERMINA
export const at = (frase: string, desde = 0, fin = false): number => {
  const q = frase.split(/\s+/).map(nrm).filter(Boolean);
  for (let i = 0; i < WN.length - q.length + 1; i++) {
    if (WN[i].s < desde - 0.01) continue;
    let ok = true; for (let k = 0; k < q.length; k++) if (WN[i + k].n !== q[k]) { ok = false; break; }
    if (ok) return fin ? WN[i + q.length - 1].e : WN[i].s;
  }
  throw new Error("at(): no está en la voz → " + frase);
};

// ---------- clips Veo que llegaron (clips.json = ids; archivo public/ctr31a/v/<id>.mp4) ----------
export const HAS: Record<string, boolean> = Object.fromEntries((CLIPS as string[]).map((k) => [k, true]));
export const REEL = true;  // true cuando llega el reel del avatar (public/ctr31a/reel0.mp4)
// clips cuyo cuadro se cambia sin tocar la línea de tiempo (v008: frasco con etiqueta parecida a una marca real)
const ALIAS: Record<string, string> = { v008_promise: "v006_hook" };
export const Clip: React.FC<{ id: string; at: number; from?: number; style?: React.CSSProperties }> = ({ id, at: a, from = 0, style }) => (
  <Sequence from={s(a)} layout="none">
    <OffthreadVideo src={staticFile(P + "v/" + (ALIAS[id] ?? id) + ".mp4")} startFrom={s(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
  </Sequence>
);
// toma a cuadro completo con empuje lento 1 → 1,045 y deriva (nunca quieta)
export const Shot: React.FC<{ id: string; t: number; a: number; from?: number }> = ({ id, t, a, from = 0 }) => {
  const k = e(t, a, a + 9), sc = 1.0 + 0.045 * k, dx = 14 * Math.sin((t - a) * 0.21), dy = 6 * Math.sin((t - a) * 0.17 + 1);
  return <AbsoluteFill style={{ transform: `translate(${dx}px,${dy}px) scale(${sc})` }}><Clip id={id} at={a} from={from} /></AbsoluteFill>;
};

// ---------- AVATAR ----------
export const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const Avatar: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    {/* ⛔ el avatar va SIEMPRE nítido y entero: sin blur, sin halo, nada encima de la cara */}
    {REEL ? WIN.filter((w) => w.me > t - 1 && w.ms < t + 1).map((w) => (
      <Sequence key={w.ms} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}>
          <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (s(w.ms) >= 10 ? 10 : s(w.ms)))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />}
  </AbsoluteFill>
);

// ---------- ESCENARIO de cada componente ----------
// bg = id de clip Veo (si llegó) o de imagen (img/<id>.jpg); a = inicio del componente (para el hundimiento de la entrada)
const MOTES = Array.from({ length: 14 }, (_, i) => ({ x: (Math.sin(i * 91.7) * 0.5 + 0.5) * 1920, y: (Math.sin(i * 37.3) * 0.5 + 0.5) * 1080, r: 2 + (i % 4) * 1.6, sp: 0.3 + (i % 5) * 0.12 }));
// fondo real de cada pieza: Body le pasa un clip Veo sobrante (el más cercano a su frase) por contexto
export const BgCtx = React.createContext<string | undefined>(undefined);
export const Stage: React.FC<{ t: number; a: number; b: number; bg?: string; tint?: string; beam?: [number, number]; children?: React.ReactNode }> = ({ t, a, b, bg: bg0, tint = "#ffd9a8", beam = [960, 620], children }) => {
  const bgc = React.useContext(BgCtx), bg = bg0 ?? bgc;
  const sink = e(t, a - 0.1, a + 0.7), out = e(t, b - 0.18, b + 0.2);
  const par = (t - a) * 9;
  const bgEl = bg ? (HAS[bg] ? <Sequence from={s(a - 1)} layout="none"><Loop durationInFrames={s(15.4)} layout="none"><OffthreadVideo src={staticFile(P + "v/" + bg + ".mp4")} playbackRate={0.5} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Loop></Sequence> : bg.startsWith("img/") ? <Img src={staticFile(P + bg + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null) : null;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 60%, #2a2622 0%, #14110e 60%, #0b0907 100%)", overflow: "hidden" }}>
      {bgEl && <AbsoluteFill style={{ transform: `translateX(${-par}px) scale(${1.12 - 0.04 * sink})`, filter: `blur(${4 + 7 * sink}px) brightness(${1 - 0.42 * sink}) saturate(0.85)`, opacity: 1 - 0.3 * sink }}>{bgEl}</AbsoluteFill>}
      {/* piso cálido con charco de luz */}
      <div style={{ position: "absolute", left: -200, right: -200, top: 640, bottom: -100, background: `radial-gradient(50% 40% at ${beam[0] + 200}px 120px, ${tint}55 0%, ${tint}18 40%, transparent 70%), linear-gradient(180deg, rgba(40,32,24,0) 0%, rgba(30,24,18,.85) 30%, #120e0b 100%)`, opacity: sink }} />
      {/* haz cónico que respira */}
      <div style={{ position: "absolute", left: beam[0] - 520, top: -120, width: 1040, height: beam[1] + 220, background: `linear-gradient(180deg, ${tint}00 0%, ${tint}2a 70%, ${tint}00 100%)`, clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", opacity: sink * (0.55 + 0.15 * Math.sin(t * 1.3)), mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - 0.06 * out})`, filter: out > 0.02 ? `blur(${out * 14}px)` : undefined }}>{children}</AbsoluteFill>
      {/* motas de polvo en primer plano */}
      {MOTES.map((m, i) => {
        const y = (m.y - (t * 22 * m.sp) % 1200 + 1200) % 1200 - 60, x = m.x + 26 * Math.sin(t * m.sp + i);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: m.r * 2, height: m.r * 2, borderRadius: "50%", background: "rgba(255,236,205,.55)", filter: `blur(${i % 3}px)`, opacity: sink * 0.7 }} />;
      })}
    </AbsoluteFill>
  );
};

// rótulo grande (≤5 palabras), llega con resorte en su palabra, sale con la pieza
export const Rot: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; size?: number; col?: string; rot?: number; align?: "center" | "left" | "right" }> = ({ t, at: a, out, text, x, y, size = 68, col = "#f6efe2", rot = 0, align = "center" }) => {
  const k = spr(t, a, 1.1), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(${tx},-50%) translateY(${(1 - Math.min(1, k)) * 40}px) rotate(${rot + (1 - Math.min(1, k)) * 6}deg) scale(${0.85 + 0.15 * Math.min(1.04, k)})`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", letterSpacing: 1, textShadow: extrude(6, "rgba(0,0,0,.55)") }}>{text}</div>
  );
};
