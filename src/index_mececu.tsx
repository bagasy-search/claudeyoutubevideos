import React from "react";
import { Composition, registerRoot } from "remotion";
import { World } from "./mececu/Min1";
import { Full, FULL_END } from "./mececu/Full";
// el video entero = un solo hilo armado desde plan.json
const Root = () => (
  <>
    <Composition id="MececuMundo" component={() => <World t={98.5} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Mececu" component={Full} durationInFrames={Math.round(FULL_END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
