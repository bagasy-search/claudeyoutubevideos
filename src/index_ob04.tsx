import React from "react";
import { Composition, registerRoot } from "remotion";
import { PruebaB } from "./owen/b/Prueba";
import { Ob04, OB04 } from "./ob04/Full";

const Root = () => (
  <>
    <Composition id="Full" component={Ob04 as any} durationInFrames={OB04.total} fps={30} width={1920} height={1080} />
    <Composition id="PruebaB" component={PruebaB as any} durationInFrames={300} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
