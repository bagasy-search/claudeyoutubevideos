// suengano · minuto 1 (Remotion). Tiempos = segundos absolutos de captions_suengano.json.
// Esta versión arma 0-65 s con footage WOW de wow_lib/stock y placeholders de avatar (gris) hasta
// que llegue el avatar. HERO1 (55-65 s) = foto cenital de agnes + pins 17→1 en palabras.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { RK, LABEL_SANS, STAMP } from "../repkit/Rk";

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);

const Wow: React.FC<{ src: string; from: number; to: number }> = ({ src, from, to }) => (
  <Sequence from={fr(from)} durationInFrames={fr(to) - fr(from)}>
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  </Sequence>
);

// Placeholder de avatar hasta tener el mp4 real del presentador
const Avatar: React.FC<{ from: number; to: number }> = ({ from, to }) => (
  <Sequence from={fr(from)} durationInFrames={fr(to) - fr(from)}>
    <AbsoluteFill style={{ backgroundColor: "#6b6b6b" }} />
  </Sequence>
);

const PINS = ["DIECISIETE", "DIECISÉIS", "QUINCE", "CATORCE", "TRECE", "DOCE", "ONCE", "DIEZ", "NUEVE", "OCHO", "SIETE", "SEIS", "CINCO", "CUATRO", "TRES", "DOS", "UNO"];
const PIN_START = 56.4; // "...en el súper visto desde arriba" (captions 56,24-57,26)
const PIN_STEP = 0.5;  // 17 pins de 56,4 s a 64,9 s

// 55-65 s: foto cenital de agnes, push lento, pins 17→1 en palabras (no es un zoom congelado)
const Hero: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  const total = fr(to) - fr(from);
  const scale = interpolate(f, [0, total], [1.0, 1.08], { extrapolateRight: "clamp" });
  return (
    <Sequence from={fr(from)} durationInFrames={total}>
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
          <Img src={staticFile("img/suengano/hero1_cenital.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        {PINS.map((word, i) => {
          const at = PIN_START + i * PIN_STEP;
          const appear = interpolate(f, [fr(at) - fr(from), fr(at) - fr(from) + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const col = i % 4, row = Math.floor(i / 4);
          return (
            <div key={word} style={{
              position: "absolute", left: 150 + col * 380, top: 70 + row * 110,
              opacity: appear, transform: `scale(${0.85 + 0.15 * appear}) rotate(-2deg)`,
              background: i === 0 ? RK.price : "#FFFDF4", color: i === 0 ? "#FFFDF4" : RK.ink,
              fontFamily: LABEL_SANS, fontWeight: 800, fontSize: 50, letterSpacing: 3,
              padding: "12px 26px", borderRadius: 6, boxShadow: "0 12px 26px rgba(0,0,0,0.4)", whiteSpace: "nowrap",
            }}>{word}</div>
          );
        })}
      </AbsoluteFill>
    </Sequence>
  );
};

export const SuenganoMin1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Avatar from={0} to={0.6} />
    <Wow src="broll/suengano/w_produce.mp4" from={0.6} to={3.4} />
    <Avatar from={3.4} to={9.9} />
    <Wow src="broll/suengano/w010b.mp4" from={9.9} to={14.0} />
    <Wow src="broll/suengano/w014b.mp4" from={14.0} to={19.0} />
    <Avatar from={19.0} to={25.3} />
    <Wow src="broll/suengano/w025c.mp4" from={25.3} to={33.0} />
    <Wow src="broll/suengano/w033c.mp4" from={33.0} to={35.0} />
    <Wow src="broll/suengano/w033d.mp4" from={35.0} to={44.0} />
    <Avatar from={44.0} to={55.0} />
    <Hero from={55.0} to={65.0} />
  </AbsoluteFill>
);
