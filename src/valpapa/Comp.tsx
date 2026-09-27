// Comp.tsx — montaje PREMIUM de Doctora Valeria Alcázar: mapea cada `kind` del contrato
// (factory/styles/premium-valeria/kit.json) a su componente REAL. La fábrica verifica contra kit.json que
// cada nombre exista como export antes de emitir nada, y que este MAPA los cubra a todos.
//
// Diferencias con el Comp.tsx del premium genérico:
//  · los Val* esperan una URL, no una ruta de public/: las props de imagen pasan por staticFile();
//  · los Val* reparten su entrada/salida con `totalF` → se les pasa la duración real del cue.
import React from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { ValChapter, ValHero, ValStat, ValQuote, ValMolecule, ValStep, ValBeforeAfter, ValChecklist, ValCta, ValBgContext } from "../valeria/ValeriaKit";
import { ValTalk, ValRecipeCard, ValNightTracker } from "../valeria/ValOverlays";

const MAPA: Record<string, React.FC<any>> = {
  ValTalk, ValRecipeCard, ValNightTracker,
  ValChapter, ValHero, ValStat, ValQuote, ValMolecule, ValStep, ValBeforeAfter, ValChecklist, ValCta,
};

const IMAGEN = ["image", "imageA", "imageB", "bg"];
const sf = (p: string) => (/^https?:|^\//.test(p) ? p : staticFile(p));

export const Comp: React.FC<{ kind: string; props: Record<string, unknown> }> = ({ kind, props }) => {
  const { durationInFrames } = useVideoConfig();
  const C = MAPA[kind];
  if (!C) return null;
  const p: Record<string, unknown> = { ...props };
  // ValStat trae suffix '%' por defecto: sin suffix explícito, un stat de unidades mentiría.
  if (kind === "ValStat" && typeof p.suffix !== "string") p.suffix = "";
  for (const k of IMAGEN) if (typeof p[k] === "string" && p[k]) p[k] = sf(p[k] as string);
  // foto de fondo con profundidad para las escenas de pantalla completa (ver ValBgContext)
  const bg = (p.bg || p.image || p.imageA) as string | undefined;
  delete p.bg;
  return (
    <AbsoluteFill>
      <ValBgContext.Provider value={bg}>
        <C durationInFrames={durationInFrames} totalF={durationInFrames} {...p} />
      </ValBgContext.Provider>
    </AbsoluteFill>
  );
};
