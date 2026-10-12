import React from "react";
import { registerRoot, Composition } from "remotion";
import { FinalOferta, FINAL_OFERTA_TOTAL_S as FULL_TOTAL_S } from "./suoferta/FinalOferta";

const Root: React.FC = () =>
  React.createElement(Composition, {
    id: "FinalOferta",
    component: FinalOferta,
    durationInFrames: Math.round(FULL_TOTAL_S * 30),
    fps: 30,
    width: 1920,
    height: 1080,
  });
registerRoot(Root);
