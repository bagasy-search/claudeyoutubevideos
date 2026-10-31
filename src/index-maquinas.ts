import React from "react";
import { registerRoot, Composition } from "remotion";
import "./index.css";
import { MainMaquinas, TOTAL_FRAMES_MAQ } from "./VideoEdit/Main_maquinas";

// Entry AISLADO de #8 Crónicas Perdidas — "7 Máquinas Antiguas Que Hoy No Podríamos Construir".
const RootMaquinasEntry: React.FC = () =>
  React.createElement(Composition, {
    id: "Maquinas",
    component: MainMaquinas,
    durationInFrames: TOTAL_FRAMES_MAQ,
    fps: 30,
    width: 1920,
    height: 1080,
  });

registerRoot(RootMaquinasEntry);
