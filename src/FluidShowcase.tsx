// SHOWCASE compacto del kit federer-fluid (dr-federer) — SIN avatar. Encadena 9 componentes de
// FedererKit con su contenido demo por defecto (usa las imágenes de public/med/, que existen).
// Salta LowerThird (único que necesita avatar). ~29s. Para el visualizador del panel.
import React from "react";
import { AbsoluteFill, Series } from "remotion";
import {
  FedChapter, FedHero, FedStat, FedQuote, FedMolecule,
  FedStep, FedBeforeAfter, FedChecklist, FedCta,
} from "./FedererKit";

const SEG = 96; // 3.2s @30fps
const SCENES = [
  <FedChapter />, <FedHero />, <FedStat />, <FedMolecule />,
  <FedStep />, <FedBeforeAfter />, <FedChecklist />, <FedQuote />, <FedCta />,
];
export const FLUID_SHOWCASE_FRAMES = SEG * SCENES.length;

export const FluidShowcase: React.FC = () => (
  <AbsoluteFill style={{ background: "#020409" }}>
    <Series>
      {SCENES.map((node, i) => (
        <Series.Sequence key={i} durationInFrames={SEG}>
          {node}
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
