import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainCmeurgente, TOTAL_FRAMES_CMEURGENTE } from "./cmeurgente/Main_cmeurgente";
const RootCmeurgente: React.FC = () => (
  <Composition id="Cmeurgente" component={MainCmeurgente} durationInFrames={TOTAL_FRAMES_CMEURGENTE} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmeurgente);
