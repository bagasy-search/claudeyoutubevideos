import "./index.css";
import React from "react";
import {Composition, registerRoot} from "remotion";
import {MainCmecalor, TOTAL_FRAMES_CMECALOR} from "./cmecalor/Main_cmecalor";
const RootCmecalor: React.FC = () => <Composition id="Cmecalor" component={MainCmecalor} durationInFrames={TOTAL_FRAMES_CMECALOR} fps={30} width={1920} height={1080} />;
registerRoot(RootCmecalor);
