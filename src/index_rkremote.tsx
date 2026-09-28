import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkremote, TOTAL_FRAMES_RKREMOTE } from "./VideoEdit/Main_rkremote";

const RootRkremote: React.FC = () => (
  <Composition id="Rkremote" component={MainRkremote} durationInFrames={TOTAL_FRAMES_RKREMOTE} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkremote);
