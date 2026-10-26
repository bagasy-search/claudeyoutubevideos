// The Last Census · sesión lc-a: comp de revisión del mundo Duluth (stills).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MundoCensus } from "./census/lca/MundoCensus";

const Root = () => (
  <Composition id="MundoCensus" component={MundoCensus as any} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ set: "panorama", x: 1200, y: 600, zoom: 0.5, sp: {} }} />
);
registerRoot(Root);
