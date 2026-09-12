import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcsclavo, TOTAL_FRAMES_FCSCLAVO } from "./VideoEdit/Main_fcsclavo";

const RootFcsclavo: React.FC = () => (
  <Composition id="Fcsclavo" component={MainFcsclavo} durationInFrames={TOTAL_FRAMES_FCSCLAVO} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsclavo);
