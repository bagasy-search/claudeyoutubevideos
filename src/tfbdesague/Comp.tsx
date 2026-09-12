// Comp.tsx — puente entre los cues del build y los componentes REALES del kit del nicho casero
// (`src/VideoEdit/scenes/`). Cada `kind` se importa de su ARCHIVO REAL, no de un barrel.
//
// ⛔ Un componente que no está en el barrel llega como `undefined` y React tira el error #130, que
//    NO dice qué componente fue — y como el import es nombrado, `tsc` tampoco lo marca. Por eso el
//    build verifica que cada nombre exista como export REAL en su archivo antes de emitir nada.
// ⛔ `StatBig` NO vive en un archivo con su nombre: está dentro de `DataViz.tsx`.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

import { AvatarScrimText } from "../VideoEdit/scenes/AvatarScrimText";
import { BarCompare } from "../VideoEdit/scenes/BarCompare";
import { Checklist } from "../VideoEdit/scenes/Checklist";
import { CrossSection } from "../VideoEdit/scenes/CrossSection";
import { StatBig } from "../VideoEdit/scenes/DataViz";
import { FloatingInsert } from "../VideoEdit/scenes/FloatingInsert";
import { KineticQuote } from "../VideoEdit/scenes/KineticQuote";
import { MistakeCard } from "../VideoEdit/scenes/MistakeCard";
import { ProcessSteps } from "../VideoEdit/scenes/ProcessSteps";
import { RuleNumberScene } from "../VideoEdit/scenes/RuleNumberScene";
import { SagaTimeline } from "../VideoEdit/scenes/SagaTimeline";
import { SignaturePhrase } from "../VideoEdit/scenes/SignaturePhrase";
import { SizeScale } from "../VideoEdit/scenes/SizeScale";
import { StepTracker } from "../VideoEdit/scenes/StepTracker";
import { VsCard } from "../VideoEdit/scenes/VsCard";

const MAPA: Record<string, React.FC<any>> = {
  AvatarScrimText, BarCompare, Checklist, CrossSection, StatBig, FloatingInsert,
  KineticQuote, MistakeCard, ProcessSteps, RuleNumberScene, SagaTimeline,
  SignaturePhrase, SizeScale, StepTracker, VsCard,
};

/** Los que se dibujan ENCIMA de lo que haya (no reemplazan el plano). */
export const OVERLAY = new Set(["FloatingInsert", "StepTracker", "AvatarScrimText"]);

export const Comp: React.FC<{ kind: string; props: Record<string, unknown> }> = ({ kind, props }) => {
  const { durationInFrames } = useVideoConfig();
  const C = MAPA[kind];
  if (!C) {
    // No puede pasar: el build lo caza antes. Si pasara, es preferible un cuadro vacío a matar el chunk.
    return null;
  }
  return (
    <AbsoluteFill>
      <C durationInFrames={durationInFrames} {...props} />
    </AbsoluteFill>
  );
};
