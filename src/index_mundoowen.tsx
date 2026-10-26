import React from "react";
import { Composition, registerRoot } from "remotion";
import { MundoOwen } from "./owen/MundoOwen";

const Root = () => (
  <>
    <Composition id="MundoOwen" component={MundoOwen} durationInFrames={1110} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
