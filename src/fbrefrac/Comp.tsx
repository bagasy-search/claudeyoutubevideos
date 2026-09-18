// Comp.tsx — puente entre los cues de la FÁBRICA y los componentes REALES del kit
// (`src/VideoEdit/scenes/`). Cada `kind` se importa de su ARCHIVO REAL, no de un barrel.
// GENERADO/COPIADO por factory/phases/60_build.mjs — el contrato vive en factory/styles/premium/kit.json.
//
// ⛔ Un componente que no está en el MAPA llega como `undefined` y React tira el error #130, que
//    NO dice qué componente fue — y como el import es nombrado, `tsc` tampoco lo marca. Por eso la
//    fábrica verifica contra kit.json que cada nombre exista como export REAL antes de emitir nada.
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

export const Comp: React.FC<{ kind: string; props: Record<string, unknown> }> = ({ kind, props }) => {
  const { durationInFrames } = useVideoConfig();
  const C = MAPA[kind];
  // No puede pasar: la fábrica lo caza antes. Si pasara, es preferible un cuadro vacío a matar el chunk.
  if (!C) return null;
  return (
    <AbsoluteFill>
      <C durationInFrames={durationInFrames} {...props} />
    </AbsoluteFill>
  );
};
