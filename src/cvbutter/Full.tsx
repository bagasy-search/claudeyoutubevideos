// cvbutter · prueba de 60 s del molde Coach Carnivore Cam (14-oct-2026) en Claudio Vaquero (EN).
// Molde: youtu.be/nOI8wh8qxYs + youtu.be/1cXQQhcKvYI → cuadro 0 = Claudio hablando (regla Bertha), montaje del
// resultado (6 tomas de ~0,8 s), set FIJO de manos cenitales (misma mesa de tablones y tabla), avatar en plano abierto,
// texto mínimo: 1-3 palabras en mayúsculas condensadas (blanco + amarillo) y un panel negro de ingredientes con tildes.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, spring } from "remotion";
import { LABEL } from "../lkit/core";
import P from "./plan.json";

const FPS = 30, fr = (s: number) => Math.round(s * FPS);
const YEL = "#F5C518";
type Shot = { a: number; b: number; k: string; av?: boolean; z?: "w" | "c"; off?: number; clipDur?: number };
type Word = { a: number; b: number; txt: string; hi?: string; pos?: "l" | "r" | "c"; y?: number };
type Panel = { a: number; b: number; head: string; rows: { t: number; txt: string; dim?: boolean }[] };
const PL = P as unknown as { end: number; shots: Shot[]; words: Word[]; panel: Panel; audio?: string };

const ShotV: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(), d = fr(s.b - s.a), u = f / Math.max(1, d);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  if (s.av) {
    // plano abierto: empuje casi imperceptible · primer plano: recorte al torso/cara
    const sc = s.z === "c" ? 1.45 + 0.03 * u : 1.0 + 0.035 * u;
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: s.z === "c" ? "50% 28%" : "50% 45%" }}>
          <OffthreadVideo src={staticFile("cvbutter/av.mp4")} startFrom={fr(s.off || 0)} muted style={st} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  // clip de manos/resultado: si el casillero es más largo que el clip, se estira (más lento), nunca se congela
  const rate = s.clipDur && s.clipDur < s.b - s.a ? s.clipDur / (s.b - s.a) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.03 + 0.04 * u})` }}>
        {s.clipDur ? <OffthreadVideo src={staticFile(`cvbutter/clips/${s.k}.mp4`)} playbackRate={rate} muted style={st} />
          : <Img src={staticFile(`cvbutter/img/${s.k}.png`)} style={st} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 1-3 palabras que salen con la voz; la palabra `hi` va en amarillo
const Words: React.FC<{ w: Word }> = ({ w }) => {
  const f = useCurrentFrame(), d = fr(w.b - w.a);
  const u = spring({ frame: f, fps: FPS, config: { damping: 14, stiffness: 200, mass: 0.7 } });
  const o = Math.min(1, u * 2) * (1 - Math.max(0, Math.min(1, (f - (d - 5)) / 5)));
  const pos = w.pos || "l";
  return (
    <AbsoluteFill style={{ justifyContent: w.y ? "flex-start" : "center", paddingTop: w.y ? `${w.y}%` : 0, alignItems: pos === "l" ? "flex-start" : pos === "r" ? "flex-end" : "center", paddingLeft: 150, paddingRight: 150 }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 118, lineHeight: 1, letterSpacing: 1, color: "#fff", opacity: o,
        transform: `translateY(${(1 - u) * 30}px)`, textShadow: "0 6px 24px rgba(0,0,0,0.55)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {w.txt.split(" ").map((x, i) => <span key={i} style={{ color: w.hi && w.hi.toUpperCase().split(" ").includes(x.toUpperCase()) ? YEL : "#fff" }}>{x} </span>)}
      </div>
    </AbsoluteFill>
  );
};

// panel negro a la derecha con renglones que se tildan en su palabra (la lista de ingredientes del molde)
const PanelV: React.FC<{ p: Panel }> = ({ p }) => {
  const f = useCurrentFrame(), d = fr(p.b - p.a);
  const inn = spring({ frame: f, fps: FPS, config: { damping: 16, stiffness: 140 } }), out = Math.max(0, Math.min(1, (f - (d - 7)) / 7));
  return (
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 700, background: "rgba(8,8,8,0.92)", transform: `translateX(${(1 - inn + out) * 720}px)`,
      display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", gap: 34 }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 84, color: YEL, letterSpacing: 1, borderBottom: `4px solid ${YEL}`, paddingBottom: 14 }}>{p.head}</div>
      {p.rows.map((r, i) => {
        const k = spring({ frame: f - (fr(r.t) - fr(p.a)), fps: FPS, config: { damping: 13, stiffness: 190 } });
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, k * 2), transform: `translateX(${(1 - k) * 40}px)` }}>
            <svg width={74} height={74} viewBox="0 0 62 62"><circle cx={31} cy={31} r={29} fill={r.dim ? "#5d6b5d" : "#2FB34A"} />
              <path d="M 17 32 L 27 42 L 45 21" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, k)} /></svg>
            <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 70, color: r.dim ? "#b9b9b9" : "#fff", textTransform: "uppercase" }}>{r.txt}</span>
          </div>
        );
      })}
    </div>
  );
};

export const TOTAL_S = PL.end;
export const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {PL.shots.map((s, i) => <Sequence key={i} from={fr(s.a)} durationInFrames={fr(s.b) - fr(s.a)}><ShotV s={s} /></Sequence>)}
    <Sequence from={fr(PL.panel.a)} durationInFrames={fr(PL.panel.b) - fr(PL.panel.a)}><PanelV p={PL.panel} /></Sequence>
    {PL.words.map((w, i) => <Sequence key={"w" + i} from={fr(w.a)} durationInFrames={fr(w.b) - fr(w.a)}><Words w={w} /></Sequence>)}
    <Audio src={staticFile(PL.audio || "cvbutter/voz.wav")} />
  </AbsoluteFill>
);
