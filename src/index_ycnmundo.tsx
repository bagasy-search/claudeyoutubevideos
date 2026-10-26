import React from "react";
import { Composition, registerRoot } from "remotion";
import { MundoYcn } from "./ycn/MundoYcn";

const Root = () => (
  <>
    <Composition id="MundoYcn" component={MundoYcn} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ set: "pistas", x: 1800, y: 600, zoom: 0.5, extra: {} }} />
  </>
);
registerRoot(Root);
