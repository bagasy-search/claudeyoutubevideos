// Piezas del video miok01 — look "mogyoktang": azulejo blanco y menta, rosa de toalla, verde-azul del agua, llavero de locker.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadHand } from "@remotion/google-fonts/Gaegu";

const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["400", "700"], subsets: ["latin"] });
// hangul: subset de Gowun Batang (OFL) solo con las sílabas que se usan
const KR = "GowunSub";
if (typeof document !== "undefined" && !document.getElementById("mk-kr")) {
  const st = document.createElement("style"); st.id = "mk-kr";
  st.innerHTML = `@font-face{font-family:'${KR}';src:url('${staticFile("miok01/font/gowun_sub.woff2")}') format('woff2');font-weight:700;font-display:block;}`;
  document.head.appendChild(st);
}

export const C = { paper: "#F4F7F3", paper2: "#E2EEE9", ink: "#1D2B2E", ver: "#D45D72", indigo: "#1C6470", gold: "#E7B94C", white: "#FFFDF9", mint: "#A9DCCF", grout: "rgba(28,100,112,0.16)" };
export const FONTS = { SERIF, SANS, HAND, KR };
export const HAN = ["", "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱"];

export const hash = (n: number) => { let x = Math.imul(n + 1, 2654435761) >>> 0; x ^= x >>> 16; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489909) >>> 0; x ^= x >>> 16; return x >>> 0; };
const r01 = (seed: number, k: number) => (hash(seed * 31 + k * 977) % 100000) / 100000;

export const useKB = (seed: number, dur: number, clip = false) => {
  const f = useCurrentFrame();
  const out = (hash(seed) % 2) === 1;
  const sec = dur / 30;
  const rate = clip ? 0.006 + r01(seed, 1) * 0.008 : 0.018 + r01(seed, 1) * 0.022;
  const amp = Math.min(clip ? 0.08 : 0.2, rate * sec);
  const t = Easing.inOut(Easing.sin)(Math.min(1, Math.max(0, f / Math.max(1, dur))));
  const k = out ? 1 - t : t;
  const z = 1.06 + amp * k;
  const ox = 35 + r01(seed, 2) * 30, oy = 35 + r01(seed, 3) * 30;
  const ang = r01(seed, 4) * Math.PI * 2;
  return { transform: `translate(${Math.cos(ang) * 2 * k}%, ${Math.sin(ang) * 1.2 * k}%) scale(${z})`, transformOrigin: `${ox}% ${oy}%` } as React.CSSProperties;
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 58%, rgba(8,24,28,0.3) 100%)" }} />
);

export const Photo: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const kb = useKB(seed, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; seed: number; dur: number; clipDur?: number; minRate?: number }> = ({ src, seed, dur, clipDur, minRate = 0.75 }) => {
  const kb = useKB(seed, dur, true);
  const rate = clipDur && clipDur < dur / 30 + 0.1 ? Math.max(minRate, (clipDur - 0.15) / (dur / 30)) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

const useIn = (delay = 0, damping = 18) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
const useOut = (dur: number, len = 10) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); };
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// panel de azulejo: cerámica blanca con juntas, canto rosa arriba
export const Tile: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; cell?: number }> = ({ style, children, cell = 64 }) => (
  <div style={{ background: `linear-gradient(170deg, ${C.white} 0%, ${C.paper} 55%, ${C.paper2} 100%)`, position: "relative", overflow: "hidden", borderRadius: 18, boxShadow: "0 18px 50px rgba(0,0,0,0.38)", ...style }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.grout} 2px, transparent 2px), linear-gradient(90deg, ${C.grout} 2px, transparent 2px)`, backgroundSize: `${cell}px ${cell}px`, backgroundPosition: "-1px -1px" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: C.ver }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 28%)" }} />
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

// llavero de locker: ficha rosa con agujero, número y hangul
export const KeyTag: React.FC<{ n: number; size?: number; delay?: number; still?: boolean }> = ({ n, size = 110, delay = 0, still }) => {
  const f = useCurrentFrame();
  const p = still ? 1 : spring({ frame: f - delay, fps: 30, config: { damping: 9, mass: 0.7 } });
  const sw = still ? 0 : Math.sin((f - delay) / 7) * 5 * Math.max(0, 1 - (f - delay) / 50);
  return (
    <div style={{ width: size, height: size * 1.28, borderRadius: size * 0.5, background: `linear-gradient(160deg, #E97C8E, ${C.ver})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: size * 0.14,
      transformOrigin: "50% 8%", transform: `scale(${interpolate(p, [0, 1], [0.3, 1])}) rotate(${-6 + sw}deg)`, opacity: Math.min(1, p * 2), boxShadow: "0 8px 18px rgba(0,0,0,0.35), inset 0 -6px 10px rgba(120,20,40,0.25), inset 0 5px 8px rgba(255,255,255,0.35)", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: size * 0.1, width: size * 0.2, height: size * 0.2, borderRadius: "50%", background: "rgba(40,10,20,0.55)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size * 0.56, lineHeight: 1, color: C.white }}>{n}</div>
      <div style={{ fontFamily: KR, fontWeight: 700, fontSize: size * 0.2, color: "#FFE3E8", marginTop: size * 0.02 }}>{HAN[n]}</div>
    </div>
  );
};

// texto cinético palabra por palabra (solo en golpes)
export const Kinetic: React.FC<{ lines: string[]; accent?: number; dur: number }> = ({ lines, accent = -1, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 9);
  let idx = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120, opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 420, background: "linear-gradient(0deg, rgba(6,22,26,0.6), rgba(6,22,26,0))" }} />
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", maxWidth: 1600 }}>
          {ln.split(" ").map((w, wi) => {
            const d = (idx++) * 4 + li * 6;
            const p = spring({ frame: f - d, fps: 30, config: { damping: 16, mass: 0.6 } });
            const acc = li === accent;
            return (
              <span key={wi} style={{ fontFamily: SERIF, fontWeight: acc ? 700 : 600, fontSize: acc ? 112 : 72, lineHeight: 1.1, color: acc ? C.white : "#E8F3EF",
                textShadow: shadow, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`, filter: `blur(${interpolate(p, [0, 1], [6, 0])}px)`,
                borderBottom: acc && wi === ln.split(" ").length - 1 ? `6px solid ${C.ver}` : undefined }}>{w}</span>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const LowerThird: React.FC<{ title: string; sub: string; kr?: string; dur: number }> = ({ title, sub, kr, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const w = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 380, background: "linear-gradient(0deg, rgba(6,22,26,0.55), rgba(6,22,26,0))" }} />
      <div style={{ position: "absolute", left: 110, bottom: 120, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 8, height: 118 * w, background: C.ver, borderRadius: 4 }} />
        <div style={{ clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 68, color: C.white, textShadow: shadow }}>{title}{kr ? <span style={{ fontFamily: KR, fontSize: 44, color: C.mint, marginLeft: 22 }}>{kr}</span> : null}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 5, color: "#DDEFEA", textShadow: shadow, textTransform: "uppercase" }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Place: React.FC<{ text: string; kr?: string; dur: number }> = ({ text, kr, dur }) => {
  const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 100, top: 90, display: "flex", alignItems: "center", gap: 18, transform: `translateY(${interpolate(p, [0, 1], [-30, 0])}px)`, opacity: p }}>
        <div style={{ width: 30, height: 30, borderRadius: "50% 50% 50% 0", background: C.ver, transform: "rotate(-45deg)", boxShadow: "0 3px 8px rgba(0,0,0,0.4)" }} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: C.white, textShadow: shadow }}>{text}</div>
        {kr ? <div style={{ fontFamily: KR, fontWeight: 700, fontSize: 42, color: C.mint, textShadow: shadow, marginLeft: 6 }}>{kr}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// etiqueta: azulejo chico que entra por la derecha
export const Tag: React.FC<{ text: string; kr?: string; dur: number; left?: boolean }> = ({ text, kr, dur, left }) => {
  const p = useIn(0, 16), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile cell={48} style={{ position: "absolute", ...(left ? { left: 110 } : { right: 110 }), bottom: 120, padding: "26px 34px 20px", transform: `translateX(${interpolate(p, [0, 1], [left ? -600 : 600, 0])}px) rotate(${left ? 1 : -1.2}deg)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: C.ink, display: "flex", alignItems: "baseline", gap: 16 }}>
          <span>{text}</span>{kr ? <span style={{ fontFamily: KR, fontWeight: 700, fontSize: 36, color: C.ver }}>{kr}</span> : null}
        </div>
      </Tile>
    </AbsoluteFill>
  );
};

export const Quote: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const chars = Math.round(interpolate(f, [4, 4 + text.length * 1.1], [0, text.length], CL));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110, opacity: o }}>
      <Tile cell={56} style={{ padding: "34px 50px 26px", maxWidth: 1500 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 60, color: C.ink }}>
          {text.slice(0, chars)}<span style={{ opacity: 0 }}>{text.slice(chars)}</span>
        </div>
      </Tile>
    </AbsoluteFill>
  );
};

export const Counter: React.FC<{ to: number; from?: number; prefix?: string; suffix: string; label: string; dur: number; right?: boolean }> = ({ to, from = 0, prefix = "", suffix, label, dur, right }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const v = Math.round(interpolate(f, [4, Math.min(dur - 20, 70)], [from, to], { ...CL, easing: Easing.out(Easing.quad) }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 440, background: "linear-gradient(0deg, rgba(6,22,26,0.6), rgba(6,22,26,0))" }} />
      <div style={{ position: "absolute", ...(right ? { right: 120, textAlign: "right" } : { left: 120 }), bottom: 110, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`, opacity: p }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 176, lineHeight: 0.9, color: C.white, textShadow: shadow }}>{prefix}{v}<span style={{ fontSize: 68, marginLeft: 16, color: C.mint }}>{suffix}</span></div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: "#DDEFEA", textShadow: shadow, marginTop: 12 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

// ficha del estudio: fuente real, lo que ella dice
export const Stat: React.FC<{ title: string; lines: string[]; foot: string; dur: number }> = ({ title, lines, foot, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile style={{ position: "absolute", left: 110, top: 150, width: 760, padding: "52px 50px 38px", transform: `translateX(${interpolate(p, [0, 1], [-900, 0])}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: C.ver }}>THE STUDY</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 60, lineHeight: 1.05, color: C.ink, margin: "10px 0 20px" }}>{title}</div>
        {lines.map((l, i) => { const q = spring({ frame: f - 12 - i * 16, fps: 30, config: { damping: 18 } }); return <div key={i} style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 42, color: C.indigo, opacity: q, transform: `translateX(${(1 - q) * 30}px)`, marginBottom: 6 }}>{l}</div>; })}
        <div style={{ height: 2, background: "rgba(29,43,46,0.3)", margin: "20px 0 14px" }} />
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: C.ink, opacity: 0.8 }}>{foot}</div>
      </Tile>
    </AbsoluteFill>
  );
};

// termómetro del baño
export const Thermo: React.FC<{ deg: number; label: string; sub: string; subAt: number; dur: number }> = ({ deg, label, sub, subAt, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const t = interpolate(f, [6, 46], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const v = Math.round(20 + (deg - 20) * t);
  const s = interpolate(f, [subAt, subAt + 12], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 900, background: "linear-gradient(270deg, rgba(6,22,26,0.6), rgba(6,22,26,0))" }} />
      <div style={{ position: "absolute", right: 150, top: 150, display: "flex", alignItems: "center", gap: 36, opacity: p, transform: `translateX(${(1 - p) * 80}px)` }}>
        <div style={{ width: 62, height: 430, borderRadius: 31, background: C.white, border: `4px solid ${C.ink}`, position: "relative", overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.45)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${12 + 80 * t}%`, background: `linear-gradient(0deg, ${C.ver}, #F0899A)` }} />
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", right: 0, width: 20, height: 3, background: C.ink, top: 50 + i * 62 }} />)}
        </div>
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 168, lineHeight: 0.9, color: C.white, textShadow: shadow }}>{v}°C</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#DDEFEA", textShadow: shadow }}>{label}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: "#FFD9DF", textShadow: shadow, marginTop: 14, opacity: s, transform: `translateY(${(1 - s) * 16}px)` }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// reloj de arena del sauna: la arena baja hasta pasar la mitad
export const Sand: React.FC<{ label: string; sub?: string; dur: number }> = ({ label, sub, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 14), o = useOut(dur, 10);
  const t = interpolate(f, [18, dur - 12], [0, 0.62], CL);
  const flip = interpolate(f, [2, 18], [180, 0], { ...CL, easing: Easing.out(Easing.back(1.3)) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 820, background: "linear-gradient(270deg, rgba(6,22,26,0.6), rgba(6,22,26,0))" }} />
      <div style={{ position: "absolute", right: 170, top: 140, opacity: p, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 190, height: 330, position: "relative", transform: `rotate(${flip}deg)`, filter: "drop-shadow(0 14px 26px rgba(0,0,0,0.5))" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, borderRadius: 8, background: "#B98A55" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, borderRadius: 8, background: "#B98A55" }} />
          <div style={{ position: "absolute", left: 22, right: 22, top: 22, height: 143, clipPath: "polygon(0 0, 100% 0, 56% 100%, 44% 100%)", background: "rgba(255,255,255,0.55)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${88 * (1 - t)}%`, background: C.ver }} />
          </div>
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, height: 143, clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)", background: "rgba(255,255,255,0.55)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${88 * t}%`, background: C.ver }} />
          </div>
          {f > 18 && <div style={{ position: "absolute", left: 93, top: 160, width: 4, height: 120, background: C.ver, opacity: 0.9 }} />}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: C.white, textShadow: shadow, marginTop: 18 }}>{label}</div>
        {sub ? <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#DDEFEA", textShadow: shadow }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// saludo / exclamación en hangul, sílaba por sílaba
export const Greet: React.FC<{ kr: string; en: string; dur: number }> = ({ kr, en, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", left: 120, top: 150, opacity: o }}>
      <div style={{ display: "flex", gap: 6 }}>
        {[...kr].map((c, i) => { const q = spring({ frame: f - i * 3, fps: 30, config: { damping: 10 } }); return <span key={i} style={{ fontFamily: KR, fontWeight: 700, fontSize: 150, color: C.white, textShadow: shadow, opacity: q, display: "inline-block", transform: `translateY(${(1 - q) * 40}px) rotate(${(1 - q) * -12}deg)` }}>{c}</span>; })}
      </div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 54, color: "#FFD9DF", textShadow: shadow, opacity: interpolate(f, [14, 26], [0, 1], CL) }}>{en}</div>
    </div>
  );
};

// lista corta que se escribe línea por línea (1-2-3)
export const Three: React.FC<{ head: string; items: string[]; marks: number[]; dur: number; right?: boolean }> = ({ head, items, marks, dur, right }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile style={{ position: "absolute", ...(right ? { right: 110 } : { left: 110 }), top: 190, width: 600, padding: "50px 46px 34px", transform: `translateX(${(1 - p) * (right ? 760 : -760)}px) rotate(${right ? 1 : -1}deg)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, letterSpacing: 6, fontSize: 22, color: C.ver, marginBottom: 14 }}>{head}</div>
        {items.map((it, i) => {
          const n = Math.round(interpolate(f, [marks[i], marks[i] + it.length * 1.1], [0, it.length], CL));
          const q = spring({ frame: f - marks[i], fps: 30, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 8, opacity: f >= marks[i] ? 1 : 0.18 }}>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: C.ver, transform: `scale(${0.6 + 0.4 * q})`, display: "inline-block" }}>{i + 1}</span>
              <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: C.indigo }}>{it.slice(0, n)}<span style={{ opacity: 0 }}>{it.slice(n)}</span></span>
            </div>
          );
        })}
      </Tile>
    </AbsoluteFill>
  );
};

// semana: 7 azulejos, se llenan los días de lavado
export const Week: React.FC<{ marks: number[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 10);
  const D = ["M", "T", "W", "T", "F", "S", "S"], ON = [1, 5, 3]; // martes, sábado y (verano) jueves
  const n = marks.reduce((a, m) => (f >= m ? a + 1 : a), 0);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 460, background: "linear-gradient(0deg, rgba(6,22,26,0.7), rgba(6,22,26,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
        <div style={{ display: "flex", gap: 14 }}>
          {D.map((d, i) => {
            const k = ON.indexOf(i); const on = k >= 0 && k < n; const q = on ? spring({ frame: f - marks[k], fps: 30, config: { damping: 10 } }) : 0;
            return (
              <div key={i} style={{ width: 118, height: 118, borderRadius: 14, background: on ? (k === 2 ? C.gold : C.ver) : C.paper, border: `3px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.12 * Math.sin(q * Math.PI)})`,
                boxShadow: "0 8px 18px rgba(0,0,0,0.4), inset 0 4px 6px rgba(255,255,255,0.5)", fontFamily: SANS, fontWeight: 700, fontSize: 44, color: on ? C.white : "rgba(29,43,46,0.45)" }}>{d}</div>
            );
          })}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: C.white, textShadow: shadow }}>{n >= 3 ? "Three times in summer" : "Twice a week"}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Soft: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const p = useIn(0, 20), o = useOut(dur, 12);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130, opacity: o * p }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 64, color: C.white, textShadow: shadow, borderBottom: `4px solid ${C.ver}`, paddingBottom: 8 }}>{text}</div>
    </AbsoluteFill>
  );
};
