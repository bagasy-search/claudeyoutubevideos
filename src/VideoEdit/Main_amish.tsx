import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/EBGaramond";
import data from "./amish_beats.json";

const { fontFamily: SERIF } = loadFont();

const FPS = 30;
const CREAM = "#EDE3CF";
const ms2f = (ms: number) => Math.round((ms / 1000) * FPS);
export const TOTAL_FRAMES_AMISH = ms2f((data as any).total);

type Beat = { img: string; startMs: number; endMs: number };
const BEATS = (data as any).beats as Beat[];

// cifras de énfasis (serif, fade) por índice de beat — NO subtítulos continuos
const EMPH: Record<number, string> = { 4: "≈ 10 °C", 9: "+ 1 año", 10: "$0 de luz" };

// grano de película sutil y ESTÁTICO (sin parpadeo = sin vibración)
const Grain: React.FC = () => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <filter id="amgrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
    <rect width="100%" height="100%" filter="url(#amgrain)" />
  </svg>
);

const Scene: React.FC<{ beat: Beat; durF: number; seed: number }> = ({ beat, durF, seed }) => {
  const f = useCurrentFrame();
  const op = Math.min(
    interpolate(f, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [durF - 14, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const p = f / durF;
  const scale = seed % 2 === 0 ? interpolate(p, [0, 1], [1.0, 1.05]) : interpolate(p, [0, 1], [1.05, 1.0]); // Ken Burns lento
  const emph = EMPH[seed - 1];
  const eop = interpolate(f, [10, 24, durF - 16, durF - 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Img
        src={staticFile(`img/${beat.img}.jpg`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, filter: "saturate(0.82) contrast(1.05) sepia(0.16) brightness(0.97)" }}
      />
      {/* viñeta cálida */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 48%, rgba(25,16,4,0.55) 100%)" }} />
      <Grain />
      {emph && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130 }}>
          <div style={{ opacity: eop, fontFamily: SERIF, fontSize: 96, fontWeight: 600, color: CREAM, letterSpacing: 1, textShadow: "0 3px 18px rgba(0,0,0,0.8)" }}>{emph}</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const MainAmish: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a140a" }}>
      <Audio src={staticFile("amish.wav")} />
      {BEATS.map((b, i) => {
        const from = ms2f(b.startMs);
        const durF = Math.max(1, ms2f(b.endMs) - ms2f(b.startMs));
        return (
          <Sequence key={i} from={from} durationInFrames={durF}>
            <Scene beat={b} durF={durF} seed={i + 1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
