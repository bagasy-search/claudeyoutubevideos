import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRfpharmacy, TOTAL_FRAMES_RFPHARMACY } from "./rfpharmacy/Main_rfpharmacy";

const RootRfpharmacy: React.FC = () => (
  <Composition id="Rfpharmacy" component={MainRfpharmacy} durationInFrames={TOTAL_FRAMES_RFPHARMACY} fps={30} width={1920} height={1080} />
);
registerRoot(RootRfpharmacy);
