// megab01 · "(ES) China Is Building a 4,500 km Wall of Trees to Stop a Desert" (Megabuild). Documental narrado, sin avatar.
// Base = EDL de planos (foto con Ken Burns / clip agnes / mapa vectorial), overlays = cifras, rótulos y capítulos.
// Sin subtítulos corridos (regla del creador). El audio lo pone encfin (megab01_mix.wav).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import EDL from "./edl.json";
import { MapShot } from "./Maps";

import { C, FONTS } from "./theme";
const { OSW, INT } = FONTS;
const FPS = 30;
type Ov = [string, any, any, any?];
type Shot = { a: number; b: number; type: "img" | "clip" | "map"; src: string; rate?: number; kb: number; ov?: Ov };
const E = EDL as unknown as { end: number; shots: Shot[] };
export const TOTAL_S = E.end;

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const KB = [
  { s0: 1.06, s1: 1.17, x0: -2, x1: 2, y0: 0, y1: -1 },
  { s0: 1.17, s1: 1.06, x0: 2, x1: -1, y0: -1, y1: 1 },
  { s0: 1.05, s1: 1.15, x0: 1, x1: -2, y0: 1, y1: 0 },
  { s0: 1.14, s1: 1.05, x0: -1, x1: 1, y0: 1, y1: -1 },
];
const Photo: React.FC<{ src: string; dur: number; kb: number }> = ({ src, dur, kb }) => {
  const f = useCurrentFrame();
  const k = KB[kb % KB.length];
  const t = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const s = k.s0 + (k.s1 - k.s0) * t, x = k.x0 + (k.x1 - k.x0) * t, y = k.y0 + (k.y1 - k.y0) * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.ink }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s}) translate(${x}%, ${y}%)` }} />
    </AbsoluteFill>
  );
};
const Clip: React.FC<{ src: string; dur: number; rate: number; kb: number }> = ({ src, dur, rate, kb }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], kb % 2 ? [1.08, 1.02] : [1.02, 1.08], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.ink }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
    </AbsoluteFill>
  );
};

// ── overlays ──────────────────────────────────────────────────────────────
const fmt = (n: number) => Math.round(n).toLocaleString("de-DE");
const Count: React.FC<{ n: number; label: string; suf: string; dur: number }> = ({ n, label, suf, dur }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const out = interpolate(f, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const v = interpolate(f, [4, Math.min(40, dur * 0.6)], [0, n], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const big = fmt(v) + (suf || "");
  const size = big.length > 11 ? 150 : big.length > 7 ? 190 : 240;
  return (
    <AbsoluteFill style={{ opacity: inn * out, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(8,10,6,0.72) 0%, rgba(8,10,6,0.35) 55%, rgba(8,10,6,0) 80%)" }} />
      <div style={{ textAlign: "center", transform: `translateY(${(1 - inn) * 30}px)` }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: size, color: C.white, lineHeight: 1, letterSpacing: 2, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{big}</div>
        <div style={{ marginTop: 18, display: "inline-block", fontFamily: INT, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: C.ink, background: C.sand, padding: "8px 22px" }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};
const Loc: React.FC<{ t: string; s: string; dur: number }> = ({ t, s, dur }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const out = interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 90, bottom: 110, display: "flex", alignItems: "stretch" }}>
        <div style={{ width: 10, background: C.green, transform: `scaleY(${w})`, transformOrigin: "bottom" }} />
        <div style={{ marginLeft: 22, clipPath: `inset(0 ${100 - w * 100}% 0 0)`, background: "rgba(10,12,8,0.55)", padding: "12px 26px 14px 20px" }}>
          <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 60, color: C.white, letterSpacing: 3, lineHeight: 1.05 }}>{t}</div>
          {s ? <div style={{ fontFamily: INT, fontWeight: 700, fontSize: 28, color: C.sand, letterSpacing: 5, marginTop: 6 }}>{s}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
const Chap: React.FC<{ k: string; t: string; dur: number }> = ({ k, t, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const line = interpolate(f, [6, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const out = interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: a * out, justifyContent: "center", alignItems: "center", background: "linear-gradient(180deg, rgba(8,10,6,0.25), rgba(8,10,6,0.6))" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: INT, fontWeight: 700, fontSize: 34, letterSpacing: 14, color: C.green }}>{k}</div>
        <div style={{ width: 520 * line, height: 4, background: C.sand, margin: "18px auto 22px" }} />
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 118, color: C.white, letterSpacing: 4, lineHeight: 1, transform: `translateY(${(1 - a) * 24}px)`, textShadow: "0 6px 30px rgba(0,0,0,0.55)" }}>{t}</div>
      </div>
    </AbsoluteFill>
  );
};
const Dim: React.FC<{ t: string; s: string; dur: number }> = ({ t, s, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const out = interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: a * out, justifyContent: "flex-start", alignItems: "flex-end", padding: "110px 110px" }}>
      <div style={{ textAlign: "right", background: "rgba(10,12,8,0.55)", padding: "18px 30px", borderRight: `10px solid ${C.green}` }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 92, color: C.white, letterSpacing: 3, lineHeight: 1 }}>{t}</div>
        {s ? <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 56, color: C.sand, letterSpacing: 3, marginTop: 8 }}>{s}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
const Overlay: React.FC<{ ov: Ov; dur: number }> = ({ ov, dur }) => {
  const [k, a, b, c] = ov;
  if (k === "count") return <Count n={a} label={b} suf={c || ""} dur={dur} />;
  if (k === "loc") return <Loc t={a} s={b} dur={dur} />;
  if (k === "chap") return <Chap k={a} t={b} dur={dur} />;
  if (k === "dim") return <Dim t={a} s={b} dur={dur} />;
  return null;
};

export const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    {E.shots.map((s, i) => {
      const from = Math.round(s.a * FPS), to = Math.round(s.b * FPS), dur = Math.max(1, to - from);
      const ovDur = s.ov ? Math.min(dur, s.ov[0] === "loc" ? 120 : s.ov[0] === "chap" ? 100 : 110) : 0;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`${i} ${s.src}`}>
          {s.type === "img" ? <Photo src={s.src} dur={dur} kb={s.kb} /> : s.type === "clip" ? <Clip src={s.src} dur={dur} rate={s.rate || 1} kb={s.kb} /> : <MapShot kind={s.src} dur={dur} />}
          {s.ov ? <Sequence durationInFrames={ovDur} layout="none"><Overlay ov={s.ov} dur={ovDur} /></Sequence> : null}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
