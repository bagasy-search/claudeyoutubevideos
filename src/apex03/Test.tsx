import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PolarIce } from "./compsA";
import { HudsonMap } from "./HudsonMap";
export const Test: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: "#000" }}>
    {t < 5 ? <PolarIce t={t} a={0} b={5} y0={1979} y1={2024} from={0.30} to={0.22} dur={3.5} pins={[{ at: 1, x: 0.5, y: 0.5, label: "NORTH POLE" }]} zoom={[1.0, 1.5, 0.5, 0.55]} />
      : <HudsonMap t0={5} keys={[{ at: 0, pos: [0, 30, 24], look: [0, 0, 1], fov: 34 }, { at: 4, pos: [0, 22, 18], look: [0, 0, 0], fov: 34 }]} pins={[{ at: 0.5, lon: -85.5, lat: 59, label: "HUDSON BAY", ring: false }, { at: 0.8, lon: -94.2, lat: 58.77, label: "CHURCHILL", ring: false }]} />}
  </AbsoluteFill>;
};
