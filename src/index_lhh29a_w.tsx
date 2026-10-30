import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { World } from "./lhh29a/world";
const T: React.FC = () => <World t={useCurrentFrame() / 30} />;
registerRoot(() => <Composition id="World" component={T} durationInFrames={300} fps={30} width={1920} height={1080} />);
