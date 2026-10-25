import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, FULL_END } from "./enrm02/Full";
const Root = () => <Composition id="Full" component={Full} durationInFrames={Math.round(FULL_END * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
