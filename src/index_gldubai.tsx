import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainGldubai, TOTAL_FRAMES_GLDUBAI } from "./VideoEdit/Main_gldubai";

const RootGldubai: React.FC = () => (
  <Composition id="Gldubai" component={MainGldubai} durationInFrames={TOTAL_FRAMES_GLDUBAI} fps={30} width={1920} height={1080} />
);
registerRoot(RootGldubai);
