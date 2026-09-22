import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcsjuanetes, TOTAL_FRAMES_FCSJUANETES } from "./VideoEdit/Main_fcsjuanetes";

const RootFcsjuanetes: React.FC = () => (
  <Composition id="Fcsjuanetes" component={MainFcsjuanetes} durationInFrames={TOTAL_FRAMES_FCSJUANETES} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsjuanetes);
