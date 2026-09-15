import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFarinon, TOTAL_FRAMES_FARINON } from "./VideoEdit/Main_farinon";

const RootFarinon: React.FC = () => (
  <Composition id="Farinon" component={MainFarinon} durationInFrames={TOTAL_FRAMES_FARINON} fps={30} width={1920} height={1080} />
);
registerRoot(RootFarinon);
