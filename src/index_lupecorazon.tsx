import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupecorazon, TOTAL_FRAMES_LUPECORAZON } from "./VideoEdit/Main_lupecorazon";

const RootLupecorazon: React.FC = () => (
  <Composition id="Lupecorazon" component={MainLupecorazon} durationInFrames={TOTAL_FRAMES_LUPECORAZON} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupecorazon);
