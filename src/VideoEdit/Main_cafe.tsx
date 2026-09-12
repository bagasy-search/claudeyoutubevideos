import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PatrickHand";
import data from "./cafe_beats.json";

const { fontFamily: HAND } = loadFont();

const FPS = 30;
const PAPER = "#FBFBF8";
const INK = "#1A1A1A";
const ACCENT = "#E63329";
const ms2f = (ms: number) => Math.round((ms / 1000) * FPS);
export const TOTAL_FRAMES_CAFE = ms2f((data as any).total);

type Word = { t: string; s: number; e: number };
type Beat = { img: string; startMs: number; endMs: number; words: Word[] };
const BEATS = (data as any).beats as Beat[];

// escena: imagen full con Ken-Burns SUAVE (zoom + paneo en una sola dirección, sin vibración)
const DoodleScene: React.FC<{ beat: Beat; durF: number; seed: number }> = ({ beat, durF, seed }) => {
  const f = useCurrentFrame();
  const op = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [durF - 8, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const p = f / durF; // 0→1 progreso del beat
  const zoomIn = seed % 2 === 0;
  const scale = zoomIn ? interpolate(p, [0, 1], [1.0, 1.07]) : interpolate(p, [0, 1], [1.07, 1.0]);
  const panX = interpolate(p, [0, 1], [seed % 3 === 0 ? -1.5 : 1.5, 0]); // paneo suave a 0
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Img src={staticFile(`img/${beat.img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${panX}%) scale(${scale})` }} />
    </AbsoluteFill>
  );
};

// subtítulos karaoke: la frase del beat actual, palabra activa resaltada al ms exacto
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const ms = (f / FPS) * 1000;
  const beat = BEATS.find((b) => ms >= b.startMs && ms < b.endMs);
  if (!beat || !beat.words.length) return null;
  const clean = (s: string) => s.replace(/^[¿¡"]+|["?!.,;:]+$/g, "");
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 320, background: "linear-gradient(to top, rgba(251,251,248,0.95), rgba(251,251,248,0))" }} />
      <div style={{ position: "relative", maxWidth: 1450, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", fontFamily: HAND, fontSize: 58, lineHeight: 1.2, padding: "0 60px" }}>
        {beat.words.map((w, i) => {
          const active = ms >= w.s && ms < w.e;
          const seen = ms >= w.s;
          return (
            <span key={i} style={{ color: active ? ACCENT : seen ? INK : "rgba(26,26,26,0.45)", transform: active ? "translateY(-3px) scale(1.06)" : "none", fontWeight: 400, display: "inline-block", textShadow: "0 2px 0 rgba(251,251,248,0.9)" }}>
              {clean(w.t)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const MainCafe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <Audio src={staticFile("cafe.wav")} />
      {BEATS.map((b, i) => {
        const from = ms2f(b.startMs);
        const durF = Math.max(1, ms2f(b.endMs) - ms2f(b.startMs));
        return (
          <Sequence key={i} from={from} durationInFrames={durF}>
            <DoodleScene beat={b} durF={durF} seed={i + 1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
