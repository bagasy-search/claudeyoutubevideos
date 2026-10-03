import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRktoyota, TOTAL_FRAMES_RKTOYOTA } from "./VideoEdit/Main_rktoyota";

const RootRktoyota: React.FC = () => (
  <Composition id="Rktoyota" component={MainRktoyota} durationInFrames={TOTAL_FRAMES_RKTOYOTA} fps={30} width={1920} height={1080} />
);
registerRoot(RootRktoyota);
