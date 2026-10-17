// steel01_es — Archivo de Acero · "Por dentro del Karl-Gerät". Mismos planos que steel01 (public/steel01), voz y rótulos en español.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import data from "./data.json";

const { fontFamily: OSW } = loadFont("normal", { weights: ["500", "700"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["500", "600"] });
export const FPS = 30;
export const TOTAL = (data as any).total as number;
const sf = (p: string) => staticFile("steel01/" + p);
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EZ = Easing.bezier(0.33, 0, 0.2, 1);
const AMBER = "#ffb000", INK = "rgba(8,10,13,0.72)", STEEL = "#e8edf2";

type Shot = { n: string; f: number; d: number; clip: number; mv: string };
type Ov = { t: string; f: number; d: number; [k: string]: any };

// ───────── planos ─────────
const KB: Record<string, (p: number) => string> = {
  in: (p) => `scale(${1.04 + 0.1 * p})`,
  in2: (p) => `scale(${1.06 + 0.12 * p}) translate(${-1.2 * p}%, ${-0.8 * p}%)`,
  out: (p) => `scale(${1.16 - 0.1 * p})`,
  panR: (p) => `scale(1.12) translateX(${-2.6 + 5.2 * p}%)`,
  panL: (p) => `scale(1.12) translateX(${2.6 - 5.2 * p}%)`,
  up: (p) => `scale(1.12) translateY(${2.2 - 4.4 * p}%)`,
  down: (p) => `scale(1.12) translateY(${-2.2 + 4.4 * p}%)`,
};
const Still: React.FC<{ n: string; d: number; mv: string }> = ({ n, d, mv }) => {
  const f = useCurrentFrame();
  // planos largos: a la mitad, corte a un detalle de la misma imagen (punch-in) para no quedar quietos
  const half = d > 7 * FPS ? Math.floor(d / 2) : d;
  const second = f >= half;
  const p = second ? (f - half) / Math.max(1, d - half) : f / Math.max(1, half);
  const e = EZ(Math.min(1, Math.max(0, p)));
  const tf = second ? `scale(${1.42 + 0.08 * e}) translate(${(mv.length % 2 ? -1 : 1) * 6}%, 3%)` : (KB[mv] || KB.in)(e);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0b0d10" }}>
      <Img src={sf(`img/${n}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: tf }} />
    </AbsoluteFill>
  );
};
const ShotView: React.FC<{ s: Shot }> = ({ s }) => {
  if (!s.clip) return <Still n={s.n} d={s.d} mv={s.mv} />;
  const need = s.d / FPS;
  const rate = Math.max(0.5, Math.min(1, s.clip / need));
  const clipFrames = Math.min(s.d, Math.floor((s.clip / rate) * FPS) - 1);
  return (
    <AbsoluteFill>
      {clipFrames < s.d && (
        <Sequence from={clipFrames} durationInFrames={s.d - clipFrames} layout="none">
          <Still n={s.n} d={s.d - clipFrames} mv="in" />
        </Sequence>
      )}
      <Sequence durationInFrames={clipFrames} layout="none">
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <OffthreadVideo src={sf(`clips/${s.n}.mp4`)} muted playbackRate={rate}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.02)" }} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// ───────── gráficos ─────────
const useInOut = (d: number, inF = 12, outF = 10) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, inF], [0, 1], { ...CL, easing: EZ });
  const z = interpolate(f, [d - outF, d], [1, 0], { ...CL, easing: EZ });
  return { f, a: Math.min(a, z), slide: (1 - a) * 40 + (1 - z) * -20 };
};
const Type: React.FC<{ text: string; start: number; cps?: number }> = ({ text, start, cps = 1.6 }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor((f - start) * cps));
  return <>{text.slice(0, n)}<span style={{ opacity: n < text.length ? 1 : 0, color: AMBER }}>▌</span></>;
};
const Ticks: React.FC = () => (
  <>
    {[[0, 0, "Top", "Left"], [1, 0, "Top", "Right"], [0, 1, "Bottom", "Left"], [1, 1, "Bottom", "Right"]].map(([x, y, v, h], i) => (
      <div key={i} style={{ position: "absolute", [x ? "right" : "left"]: -8, [y ? "bottom" : "top"]: -8, width: 18, height: 18,
        [`border${v}`]: `3px solid ${AMBER}`, [`border${h}`]: `3px solid ${AMBER}` } as any} />
    ))}
  </>
);

const Big: React.FC<{ o: Ov }> = ({ o }) => {
  const { f, a, slide } = useInOut(o.d);
  const bar = interpolate(f, [6, 26], [0, 1], { ...CL, easing: EZ });
  return (
    <div style={{ position: "absolute", right: 90, top: 80, opacity: a, transform: `translateX(${slide}px)`, textAlign: "right",
      padding: "18px 30px 22px", background: INK, borderRight: `6px solid ${AMBER}` }}>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 112, color: STEEL, lineHeight: 1, letterSpacing: 1 }}>{o.v}</div>
      <div style={{ height: 4, background: AMBER, width: `${bar * 100}%`, marginLeft: "auto", margin: "12px 0 10px auto" }} />
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 26, color: AMBER, letterSpacing: 4 }}>{o.l}</div>
    </div>
  );
};
const Spec: React.FC<{ o: Ov }> = ({ o }) => {
  const { a, slide } = useInOut(o.d);
  return (
    <div style={{ position: "absolute", left: 90, bottom: 96, opacity: a, transform: `translateY(${-slide / 2}px)`,
      padding: "20px 30px", background: INK, maxWidth: 1100 }}>
      <Ticks />
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 56, color: STEEL, letterSpacing: 2, lineHeight: 1.05 }}>{o.a}</div>
      {o.b ? <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 26, color: AMBER, letterSpacing: 3, marginTop: 8 }}><Type text={o.b} start={8} /></div> : null}
    </div>
  );
};
const Loc: React.FC<{ o: Ov }> = ({ o }) => {
  const { a, slide } = useInOut(o.d);
  return (
    <div style={{ position: "absolute", left: 90, top: 80, opacity: a, transform: `translateX(${-slide}px)`, display: "flex", gap: 22, alignItems: "stretch" }}>
      <div style={{ width: 10, background: AMBER }} />
      <div style={{ background: INK, padding: "14px 26px 16px" }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 52, color: STEEL, letterSpacing: 3, lineHeight: 1.05 }}>{o.a}</div>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 24, color: AMBER, letterSpacing: 4, marginTop: 6 }}><Type text={o.b} start={6} /></div>
      </div>
    </div>
  );
};
const Chap: React.FC<{ o: Ov }> = ({ o }) => {
  const { f, a } = useInOut(o.d, 10, 10);
  const w = interpolate(f, [4, 22], [0, 1], { ...CL, easing: EZ });
  return (
    <AbsoluteFill style={{ opacity: a, background: "linear-gradient(90deg, rgba(6,8,10,0.82) 0%, rgba(6,8,10,0.55) 45%, rgba(6,8,10,0) 75%)" }}>
      <div style={{ position: "absolute", left: 120, top: 330 }}>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, color: AMBER, letterSpacing: 8 }}>CAPÍTULO {o.k}</div>
        <div style={{ height: 4, background: AMBER, width: 520 * w, margin: "18px 0 22px" }} />
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 104, color: STEEL, letterSpacing: 3, lineHeight: 1.0, maxWidth: 1250 }}>{o.a}</div>
        {o.b ? <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, color: STEEL, opacity: 0.8, letterSpacing: 5, marginTop: 20 }}>{o.b}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
const Title: React.FC<{ o: Ov }> = ({ o }) => {
  const { f, a } = useInOut(o.d, 12, 12);
  const sp = interpolate(f, [0, o.d], [26, 14], CL);
  return (
    <AbsoluteFill style={{ opacity: a, justifyContent: "flex-end", alignItems: "center", paddingBottom: 120,
      background: "linear-gradient(0deg, rgba(6,8,10,0.8) 0%, rgba(6,8,10,0) 45%)" }}>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 150, color: STEEL, letterSpacing: sp, lineHeight: 1 }}>{o.a}</div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 32, color: AMBER, letterSpacing: 6, marginTop: 18 }}>{o.b}</div>
    </AbsoluteFill>
  );
};
const Roster: React.FC<{ o: Ov }> = ({ o }) => {
  const { f, a } = useInOut(o.d, 10, 12);
  return (
    <div style={{ position: "absolute", right: 90, top: 130, opacity: a, background: INK, padding: "26px 36px", minWidth: 560 }}>
      <Ticks />
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 24, color: AMBER, letterSpacing: 6, marginBottom: 14 }}>KARL-GERÄT · CONSTRUIDOS</div>
      {o.items.map(([num, name, at]: [string, string, number], i: number) => {
        const k = interpolate(f, [at - o.f, at - o.f + 8], [0, 1], CL);
        return (
          <div key={i} style={{ display: "flex", gap: 26, opacity: k, transform: `translateX(${(1 - k) * 30}px)`, alignItems: "baseline", margin: "6px 0" }}>
            <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, color: AMBER, width: 70 }}>{num}</span>
            <span style={{ fontFamily: OSW, fontWeight: 700, fontSize: 48, color: STEEL, letterSpacing: 2 }}>{name}</span>
          </div>
        );
      })}
    </div>
  );
};
const Tally: React.FC<{ o: Ov }> = ({ o }) => {
  const { f, a } = useInOut(o.d, 10, 12);
  const missAt = o.miss ? o.miss - o.f : Math.floor(o.d * 0.55);
  const shown = Math.min(o.n, Math.floor(interpolate(f, [4, missAt - 4], [0, o.n], CL)) + 1);
  const x = interpolate(f, [missAt, missAt + 10], [0, 1], CL);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", opacity: a }}>
      <div style={{ background: INK, padding: "22px 34px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 14 }}>
          {Array.from({ length: o.n }).map((_, i) => (
            <div key={i} style={{ position: "relative", width: 34, height: 86, borderRadius: "17px 17px 4px 4px",
              background: i < shown ? "#9aa4ad" : "rgba(255,255,255,0.08)", border: `2px solid ${i < shown ? STEEL : "rgba(255,255,255,0.2)"}` }}>
              <div style={{ position: "absolute", inset: -6, opacity: x, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: OSW, fontWeight: 700, fontSize: 54, color: AMBER }}>✕</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 28, color: STEEL, letterSpacing: 5, marginTop: 16 }}>
          {shown} {o.l} <span style={{ color: AMBER, opacity: x }}>· 0 IMPACTOS</span>
        </div>
      </div>
    </div>
  );
};
const Next: React.FC<{ o: Ov }> = ({ o }) => {
  const { f, a } = useInOut(o.d, 14, 1);
  const w = interpolate(f, [8, 30], [0, 1], { ...CL, easing: EZ });
  return (
    <div style={{ position: "absolute", left: 90, bottom: 96, opacity: a, display: "flex", gap: 24, alignItems: "center" }}>
      <div style={{ background: AMBER, color: "#0b0d10", fontFamily: OSW, fontWeight: 700, fontSize: 44, padding: "10px 26px", letterSpacing: 4 }}>{o.a} ▸</div>
      <div style={{ background: INK, padding: "10px 26px", fontFamily: OSW, fontWeight: 700, fontSize: 56, color: STEEL, letterSpacing: 3,
        clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{o.b}</div>
    </div>
  );
};
const MAP: Record<string, React.FC<{ o: Ov }>> = { big: Big, spec: Spec, loc: Loc, chap: Chap, title: Title, roster: Roster, tally: Tally, next: Next };

export const Main: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const shots = (data as any).shots as Shot[];
  const ov = (data as any).ov as Ov[];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0d10" }}>
      {shots.map((s) => (
        <Sequence key={s.n} from={s.f} durationInFrames={s.d} premountFor={30}>
          <ShotView s={s} />
        </Sequence>
      ))}
      {ov.map((o, i) => {
        const C = MAP[o.t];
        return (
          <Sequence key={"o" + i} from={o.f} durationInFrames={o.d} layout="none">
            <C o={o} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", right: 40, bottom: 30, fontFamily: MONO, fontWeight: 600, fontSize: 18, letterSpacing: 6, color: STEEL, opacity: 0.55 }}>
        ARCHIVO DE ACERO
      </div>
      {!farm && <Audio src={staticFile("steel01_es.wav")} />}
    </AbsoluteFill>
  );
};
