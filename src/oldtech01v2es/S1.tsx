import React from "react";
import { AbsoluteFill } from "remotion";
import { Maqueta } from "./Maqueta";
import { BATH } from "./Maqueta";
export const S1: React.FC = () => (
  <AbsoluteFill style={{ background: "#c9dcea" }}>
    <Maqueta t0={0} keys={[
      { at: 0, pos: [-22, 17, 15], look: [-10, 0, -2], fov: 34 },
      { at: 6, pos: [-3, 21, 16], look: [6, 0, -3], fov: 34 },
      { at: 10, pos: [16, 20, 13], look: [6, 0, -3], fov: 34 },
    ]} ring={{ at: 5, x: BATH[0], z: BATH[1], label: "LAS TERMAS", sub: "calentado desde abajo" }} />
  </AbsoluteFill>
);
