// suoferta · FinalOferta: un solo Root para el farm, misma estructura que suprecio FinalPrecio.tsx.
// Voz = pista única, -14 LUFS (suofertacut_m14.wav). Avatar muteado (AvClip). 1920x1080, 30 fps.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Full, FULL_TOTAL_S } from "./Full";

export const FINAL_OFERTA_TOTAL_S = FULL_TOTAL_S;

export const FinalOferta: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Full />
    <Audio src={staticFile("suofertacut_m14.wav")} />
  </AbsoluteFill>
);
