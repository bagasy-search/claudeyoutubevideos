import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale2, TOTAL_FRAMES_DALE2 } from "./VideoEdit/Main_dale2";

const RootDale2: React.FC = () => (
  <Composition id="Dale2" component={MainDale2} durationInFrames={TOTAL_FRAMES_DALE2} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale2);
