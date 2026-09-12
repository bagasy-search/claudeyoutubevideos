import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainMdpnsqn, TOTAL_FRAMES_MDPNSQN } from "./mdpnsqn/Main_mdpnsqn";
const RootMdpnsqn: React.FC = () => (
  <Composition id="Mdpnsqn" component={MainMdpnsqn} durationInFrames={TOTAL_FRAMES_MDPNSQN} fps={30} width={1920} height={1080} />
);
registerRoot(RootMdpnsqn);
