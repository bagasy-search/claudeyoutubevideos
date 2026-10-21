import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES, MIN1_END } from "./cermarcas/Min1";
import { Rest, FULL_FRAMES } from "./cermarcas/Rest";
// el video entero: minuto 1 (aprobado) + el resto, con el mismo reloj absoluto
const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: "#05070c" }}>{t < MIN1_END ? <Min1 /> : <Rest t={t} />}</AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="CermarcasMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
