// Entry propio de `friogranero` — el entry compartido de remotion lo pisan otras sesiones.
// ⛔ Se pasa SIEMPRE por ENTRY=src/index_friogranero.tsx al farm.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFrioMin1, TOTAL_FRAMES_MIN1, FPS } from "./frio/Main_friogranero_min1";
import { Vitrina, TOTAL_VITRINA } from "./frio/Vitrina";

const Root: React.FC = () => (
  <>
    <Composition
      id="FrioMin1"
      component={MainFrioMin1}
      durationInFrames={TOTAL_FRAMES_MIN1}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="FrioVitrina"
      component={Vitrina}
      durationInFrames={TOTAL_VITRINA}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
