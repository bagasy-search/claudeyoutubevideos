import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainIajapan, TOTAL_FRAMES_IAJAPAN } from "./VideoEdit/Main_iajapan";

const RootIajapan: React.FC = () => (
  <Composition id="Iajapan" component={MainIajapan} durationInFrames={TOTAL_FRAMES_IAJAPAN} fps={30} width={1920} height={1080} />
);
registerRoot(RootIajapan);
