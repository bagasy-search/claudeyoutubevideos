// stills de prueba del mundo 3D (cuadro n = preset n). Sólo para iterar; no va al video.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ToiletWorld, K, FX } from "./toilet3d";
const c = (p: number[], l: number[], fov = 38): K[] => [{ t: 0, p, l, fov }];
const P: { kf: K[]; fx: FX }[] = [
  { kf: c([-0.05, 0.5, 1.7], [-0.03, 0.36, 0]), fx: { bowl: 0.8, dirty: 0.6, paper: 1, clog: 1 } },
  { kf: c([-0.1, 0.27, 0.62], [-0.08, 0.24, 0]), fx: { clog: 1, bowl: 0.5, dirty: 0.5, plunger: 1, pump: 1 } },
  { kf: c([-0.22, 0.31, 0.06], [-0.05, 0.37, -0.1], 50), fx: { scale: 0.7, jets: 1 } },
  { kf: c([0.16, 0.62, 0.6], [0.16, 0.6, 0]), fx: { flap: 1, tank: 0.6 } },
  { kf: c([-0.12, 0.25, 0.55], [-0.1, 0.22, 0]), fx: { siphon: 1, jet: 1, jets: 1, flush: 1 } },
  { kf: c([-0.12, 0.28, 0.6], [-0.1, 0.25, 0]), fx: { auger: 1, clog: 1, bowl: 0.3 } },
  { kf: c([0.2, 0.05, 0.6], [0.12, -0.05, 0]), fx: { wax: 1 } },
  { kf: c([-0.45, 0.33, 0.2], [-0.4, 0.36, 0], 40), fx: { vinegar: 1, scale: 0.8, tape: 1 } },
];
export const Test3d: React.FC = () => {
  const f = useCurrentFrame(), p = P[Math.min(P.length - 1, f)];
  return <AbsoluteFill style={{ background: "#000" }}><ToiletWorld t={4 + f * 0.37} kf={p.kf} fx={p.fx} /></AbsoluteFill>;
};
