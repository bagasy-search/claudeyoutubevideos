import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupecolibri, TOTAL_FRAMES_LUPECOLIBRI } from "./VideoEdit/Main_lupecolibri";

const RootLupecolibri: React.FC = () => (
  <Composition id="Lupecolibri" component={MainLupecolibri} durationInFrames={TOTAL_FRAMES_LUPECOLIBRI} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupecolibri);
