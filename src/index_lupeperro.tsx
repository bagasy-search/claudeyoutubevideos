import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupeperro, TOTAL_FRAMES_LUPEPERRO } from "./VideoEdit/Main_lupeperro";

const RootLupeperro: React.FC = () => (
  <Composition id="Lupeperro" component={MainLupeperro} durationInFrames={TOTAL_FRAMES_LUPEPERRO} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupeperro);
