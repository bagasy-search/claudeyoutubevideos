import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTesuiza, TOTAL_FRAMES_TESUIZA } from "./VideoEdit/Main_tesuiza";

const RootTesuiza: React.FC = () => (
  <Composition id="Tesuiza" component={MainTesuiza} durationInFrames={TOTAL_FRAMES_TESUIZA} fps={30} width={1920} height={1080} />
);
registerRoot(RootTesuiza);
