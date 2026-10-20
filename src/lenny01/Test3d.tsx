// stills de prueba del mundo 3D (cuadro n = preset n). Sólo para iterar; no va al video.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PipeWorld, K, FX } from "./pipe3d";
const P: { kf: K[]; fx: FX; hide?: string; post?: boolean }[] = [
  { kf: [{ t: 0, p: [0.2, 0.75, 1.9], l: [-0.05, 0.5, 0], fov: 38 }], fx: { basin: 0.9, grease: 0.5 } },
  { kf: [{ t: 0, p: [-0.12, 0.45, 0.42], l: [-0.15, 0.42, 0], fov: 36 }], fx: { grease: 1, debris: 1, scum: 0.6 } },
  { kf: [{ t: 0, p: [-0.12, 0.45, 0.42], l: [-0.15, 0.42, 0], fov: 36 }], fx: { grease: 0.8, mix: 1, fizz: 1, hot: 0.6 } },
  { kf: [{ t: 0, p: [0.0, 0.5, 0.75], l: [0.0, 0.5, 0], fov: 40 }], fx: { grease: 0.4, gas: 1, drip: 1 } },
  { kf: [{ t: 0, p: [6.5, -1.0, 7.5], l: [6.5, -1.5, 0], fov: 42 }], fx: { roots: 1, crack: 1, backup: 0.5 } },
  { kf: [{ t: 0, p: [-0.05, 0.55, 0.5], l: [-0.1, 0.5, 0], fov: 40 }], fx: { grease: 0.6, plunge: 1, escape: 1, basin: 0.3, metal: 1, rust: 1 } },
  { kf: [{ t: 0, p: [-0.19, 0.37, 0.16], l: [-0.19, 0.37, 0], fov: 36 }], fx: { grease: 1 }, post: false },
  { kf: [{ t: 0, p: [8.1, -2.45, 0.9], l: [8.3, -2.6, 0], fov: 36 }], fx: { roots: 1, crack: 1, backup: 0.7 } },
  { kf: [{ t: 0, p: [-0.19, 0.37, 0.16], l: [-0.19, 0.37, 0], fov: 36 }], fx: { grease: 1 }, post: false, hide: "gS" },
];
export const Test3d: React.FC = () => {
  const f = useCurrentFrame(), p = P[Math.min(P.length - 1, f)];
  return <AbsoluteFill style={{ background: "#000" }}><PipeWorld t={4 + f * 0.37} kf={p.kf} fx={p.fx} hide={p.hide} post={p.post ?? true} /></AbsoluteFill>;
};
