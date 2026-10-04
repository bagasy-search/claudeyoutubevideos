import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupeanos, TOTAL_FRAMES_LUPEANOS } from "./VideoEdit/Main_lupeanos";

const RootLupeanos: React.FC = () => (
  <Composition id="Lupeanos" component={MainLupeanos} durationInFrames={TOTAL_FRAMES_LUPEANOS} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupeanos);
