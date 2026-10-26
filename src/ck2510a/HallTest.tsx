// sólo para stills de revisión del salón: cada escena 3 s
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HallWorld, sceneOf } from "./hall3d";
export const TEST = ["hook", "row", "table", "stairs", "clock", "pan:0", "pan:1", "pan:2", "pan:3", "pan:4", "pan:5", "pan:6", "card:3", "book:028", "book:033f028", "serve", "head", "coffee", "empty"];
export const HallTest: React.FC = () => {
  const t = useCurrentFrame() / 30, i = Math.min(TEST.length - 1, Math.floor(t / 3)), u = t - i * 3;
  return <AbsoluteFill style={{ background: "#000" }}><HallWorld t={t} sc={sceneOf(TEST[i], u)} /></AbsoluteFill>;
};
