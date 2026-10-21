import React from "react";
import { AbsoluteFill, Composition, Sequence, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./ortega01/Min1";
import { Rest, FULL_FRAMES } from "./ortega01/Rest";
import { CtaPrueba } from "./ortega01/CtaPrueba";
// el video entero: minuto 1 (aprobado) + el resto; el resto usa el segundo absoluto
const Full: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Rest />
    <Sequence durationInFrames={MIN1_FRAMES}><Min1 /></Sequence>
  </AbsoluteFill>
);
const Root = () => (
  <>
    <Composition id="Ortega01CTA" component={CtaPrueba} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="Ortega01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Ortega01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
