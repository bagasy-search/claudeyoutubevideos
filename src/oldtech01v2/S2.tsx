import React from "react";
import { AbsoluteFill } from "remotion";
import { ClayMap } from "./ClayMap";
export const S2: React.FC = () => (
  <AbsoluteFill style={{ background: "#8fb6c8" }}>
    <ClayMap t0={0} keys={[
      { at: 0, pos: [0, 62, 34], look: [1, 0, 2], fov: 34 },
      { at: 2.2, pos: [5.4, 5.5, 5.5], look: [4.6, 0.6, -0.6], fov: 34 },
    ]} pins={[{ at: 1.0, lon: 12.8, lat: 46.8, label: "THE EASTERN ALPS", sub: "January" }]} />
  </AbsoluteFill>
);
