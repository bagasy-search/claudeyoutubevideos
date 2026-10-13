// ArchiveFilm.tsx — METRAJE REAL de archivo a pantalla completa, con su crédito y el chip "REAL FOOTAGE".
// Lo monta rksafe_build SOLO para cada plano `real` cuyo item en `_v3/<slug>_real.mjs` trae `credit`
// (sin crédito confirmado no hay clip: licencias.md manda). También se puede usar a mano como componente.
//
// ⛔ OffthreadVideo muteado (el audio real del clip va al máster por scripts/backfire_mix.mjs).
// ⛔ El chip REAL FOOTAGE entra y se va (2,6 s): es una firma, no un cartel fijo que tape la toma.
// ⛔ Nada de cámara lenta: metraje real a 1x. Push muy leve (1,5 %/s tope) para que no se vea congelado.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { W, F_TYPE, Credit, KindChip, Grade, rnd } from "./Stage";

export const ArchiveFilm: React.FC<{
  src: string;
  credit?: string;          // "USFWS · public domain" · "Jane Doe · CC BY 4.0"
  chip?: string;            // default "REAL FOOTAGE"; "" lo apaga
  caption?: string;         // opcional: "Queensland · 1935" (máquina de escribir, abajo a la izquierda)
  rate?: number;
  seed?: number;
  durF?: number;
  durationInFrames?: number;
  startFrom?: number;       // cuadros a saltear del archivo (si el plano real arranca más adentro)
}> = ({ src, credit, chip = "REAL FOOTAGE", caption, rate = 1, seed = 1, durF, durationInFrames, startFrom = 0 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: seq } = useVideoConfig();
  const D = Math.max(12, durF ?? durationInFrames ?? seq);
  const amp = Math.min(0.06, 0.012 * (D / fps));
  const acerca = rnd(seed * 5 + 3) < 0.6;
  const z = interpolate(f, [0, D], acerca ? [1.0, 1 + amp] : [1 + amp, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ox = 42 + rnd(seed * 11 + 1) * 16, oy = 40 + rnd(seed * 13 + 7) * 16;
  const chipA = interpolate(f, [4, 14, 2.4 * fps, 2.4 * fps + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const credA = interpolate(f, [6, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: W.ink0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} startFrom={startFrom}
        style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`, transform: `scale(${z.toFixed(4)})` }} />
      <Grade vignette={0.35} />
      {chip ? <KindChip text={chip} a={chipA} /> : null}
      {caption ? (
        <div style={{ position: "absolute", left: 40, bottom: 30, opacity: credA }}>
          <div style={{ fontFamily: F_TYPE, fontSize: 30, color: W.white, background: "rgba(11,12,10,.6)", padding: "6px 14px", letterSpacing: 1.5 }}>{caption}</div>
        </div>
      ) : null}
      <Credit text={credit} a={credA} />
    </AbsoluteFill>
  );
};
