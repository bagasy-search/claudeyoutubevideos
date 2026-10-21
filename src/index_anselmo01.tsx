import React from "react";
import { Composition, Sequence, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./anselmo01/Min1";
import { Rest, FULL_FRAMES } from "./anselmo01/Rest";
// el video entero: el minuto 1 y el resto son UNA sola toma (el mismo mundo y la misma cámara)
const Full = () => (<><Sequence durationInFrames={MIN1_FRAMES} layout="none"><Min1 /></Sequence><Rest /></>);
const Root = () => (
  <>
    <Composition id="Anselmo01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Anselmo01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
