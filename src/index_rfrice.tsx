import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRfrice, TOTAL_FRAMES_RFRICE } from "./rfrice/Main_rfrice";

const RootRfrice: React.FC = () => (
  <Composition id="Rfrice" component={MainRfrice} durationInFrames={TOTAL_FRAMES_RFRICE} fps={30} width={1920} height={1080} />
);
registerRoot(RootRfrice);
