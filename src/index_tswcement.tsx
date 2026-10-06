import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTswcement, TOTAL_FRAMES_TSWCEMENT } from "./VideoEdit/Main_tswcement";

const RootTswcement: React.FC = () => (
  <Composition id="Tswcement" component={MainTswcement} durationInFrames={TOTAL_FRAMES_TSWCEMENT} fps={30} width={1920} height={1080} />
);
registerRoot(RootTswcement);
