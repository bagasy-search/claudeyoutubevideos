import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPintermo, TOTAL_FRAMES_PINTERMO } from "./pintermo/Main_pintermo";

const Root: React.FC = () => (
  <Composition id="Pintermo" component={MainPintermo}
    durationInFrames={TOTAL_FRAMES_PINTERMO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
