import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES, MIN1_END } from "./cerpapeles/Min1";
import { Rest, END } from "./cerpapeles/Rest";
// el video entero: un solo reloj global (Min1 y Rest leen el cuadro absoluto)
const Full: React.FC = () => (useCurrentFrame() / 30 < MIN1_END ? <Min1 /> : <Rest />);
const Root = () => (
  <>
    <Composition id="Cerpapeles" component={Full} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="CerpapelesMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
