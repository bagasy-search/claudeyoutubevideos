// Comp.tsx — montaje PREMIUM de Cole Brennan Garage: mapea cada `kind` del contrato
// (factory/styles/premium-garage/kit.json) a su componente REAL de src/garage/GarageKit.tsx.
// La fábrica verifica contra kit.json que cada nombre exista como export y que este MAPA los cubra.
//  · los G* esperan URL: las props de imagen pasan por staticFile();
//  · los G* reparten entrada/salida con `totalF` → se les pasa la duración real del cue.
import React from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { GRegret, GPriceCut, GValueDrop, GGraveyard, GRecall, GTariff, GChecklist, GBigStat, GTimeline, GSplit, GHeadline, GWarnLamp, GReadout } from "../garage/GarageKit";

const MAPA: Record<string, React.FC<any>> = {
  GRegret, GPriceCut, GValueDrop, GGraveyard, GRecall, GTariff, GChecklist, GBigStat, GTimeline, GSplit, GHeadline, GWarnLamp, GReadout,
};

const IMAGEN = ["image", "leftImage", "rightImage"];
const sf = (p: string) => (/^https?:|^\//.test(p) ? p : staticFile(p));

export const Comp: React.FC<{ kind: string; props: Record<string, unknown> }> = ({ kind, props }) => {
  const { durationInFrames } = useVideoConfig();
  const C = MAPA[kind];
  if (!C) return null;
  const p: Record<string, unknown> = { ...props };
  for (const k of IMAGEN) if (typeof p[k] === "string" && p[k]) p[k] = sf(p[k] as string);
  return (
    <AbsoluteFill>
      <C durationInFrames={durationInFrames} totalF={durationInFrames} {...p} />
    </AbsoluteFill>
  );
};
