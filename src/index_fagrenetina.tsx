import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFagrenetina, TOTAL_FRAMES_FAGRENETINA } from "./VideoEdit/Main_fagrenetina";

const RootFagrenetina: React.FC = () => (
  <Composition id="Fagrenetina" component={MainFagrenetina} durationInFrames={TOTAL_FRAMES_FAGRENETINA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFagrenetina);
