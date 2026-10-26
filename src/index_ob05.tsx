import React from "react";
import { Composition, registerRoot } from "remotion";
import { PruebaB } from "./owen/b/Prueba";
import { Ob05, OB05 } from "./ob05/Full";

const Root = () => (
  <>
    <Composition id="Full" component={Ob05 as any} durationInFrames={OB05.total} fps={30} width={1920} height={1080} />
    <Composition id="PruebaB" component={PruebaB as any} durationInFrames={300} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
