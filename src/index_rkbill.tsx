import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkbill, TOTAL_FRAMES_RKBILL } from "./VideoEdit/Main_rkbill";

const RootRkbill: React.FC = () => (
  <Composition id="Rkbill" component={MainRkbill} durationInFrames={TOTAL_FRAMES_RKBILL} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkbill);
