import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupebebes, TOTAL_FRAMES_LUPEBEBES } from "./VideoEdit/Main_lupebebes";

const RootLupebebes: React.FC = () => (
  <Composition id="Lupebebes" component={MainLupebebes} durationInFrames={TOTAL_FRAMES_LUPEBEBES} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupebebes);
