import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkcard, TOTAL_FRAMES_RKCARD } from "./VideoEdit/Main_rkcard";

const RootRkcard: React.FC = () => (
  <Composition id="Rkcard" component={MainRkcard} durationInFrames={TOTAL_FRAMES_RKCARD} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkcard);
