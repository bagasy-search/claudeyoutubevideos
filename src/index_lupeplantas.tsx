import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupeplantas, TOTAL_FRAMES_LUPEPLANTAS } from "./VideoEdit/Main_lupeplantas";

const RootLupeplantas: React.FC = () => (
  <Composition id="Lupeplantas" component={MainLupeplantas} durationInFrames={TOTAL_FRAMES_LUPEPLANTAS} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupeplantas);
