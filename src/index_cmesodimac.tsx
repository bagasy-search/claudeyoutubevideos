import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainCmesodimac, TOTAL_FRAMES_CMESODIMAC } from "./cmesodimac/Main_cmesodimac";
const RootCmesodimac: React.FC = () => (
  <Composition id="Cmesodimac" component={MainCmesodimac} durationInFrames={TOTAL_FRAMES_CMESODIMAC} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmesodimac);
