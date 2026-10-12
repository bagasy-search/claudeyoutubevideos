// suprecio · FinalPrecio: un solo Root para el farm.
// Tiempo de salida F (s): [0,1.52) minuto 1 desde 9,70 · [1.52,3.12) cobertura WOW en el corte · [3.12,fin) video desde 16,74 (= 60-962 con el minuto 1 en 16,74-60).
// Voz v2 (sin 11,22-15,14), -14 LUFS, como única pista.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";
import { fr } from "../ckeggs/Base";
import { Min1 } from "./Min1";
import { Full2 } from "./Full2";

const DUR = 948.38;
const Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("broll/suprecio/wow/w3_cinta.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

export const FinalPrecio: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* 0 - 1,52 s: minuto 1 desde 9,70 */}
    <Sequence from={0} durationInFrames={fr(1.52)}>
      <Sequence from={-fr(9.70)}><Min1 /></Sequence>
    </Sequence>
    {/* 1,52 - 3,12 s: cobertura en el corte (11,22-15,14 quitado de la voz) */}
    <Sequence from={fr(1.52)} durationInFrames={fr(1.6)}><Cover /></Sequence>
    {/* 3,12 s en adelante: T = F - 3,12 + 16,74 (minuto 1 hasta 60 s, luego Full2) */}
    <Sequence from={fr(3.12)} durationInFrames={fr(DUR - 3.12)}>
      <Sequence from={-fr(16.74)}>
        <Sequence from={0} durationInFrames={fr(60)}><Min1 /></Sequence>
        <Sequence from={0} durationInFrames={fr(962)}><Full2 bg={false} /></Sequence>
      </Sequence>
    </Sequence>
    <Audio src={staticFile("supreciocut_v2_m14.wav")} />
  </AbsoluteFill>
);
