import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupelechuza, TOTAL_FRAMES_LUPELECHUZA } from "./VideoEdit/Main_lupelechuza";

const RootLupelechuza: React.FC = () => (
  <Composition id="Lupelechuza" component={MainLupelechuza} durationInFrames={TOTAL_FRAMES_LUPELECHUZA} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupelechuza);
