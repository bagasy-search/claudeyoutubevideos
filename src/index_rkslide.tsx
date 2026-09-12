import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkslide, TOTAL_FRAMES_RKSLIDE } from "./VideoEdit/Main_rkslide";

const RootRkslide: React.FC = () => (
  <Composition id="Rkslide" component={MainRkslide} durationInFrames={TOTAL_FRAMES_RKSLIDE} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkslide);
