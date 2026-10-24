import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World, setKeys, PT, FPS } from "./ojos3d";
// prueba de stills del mundo (no va al video): 0 = mesada general · 1 = frasco cerca con gota · 2 = bloque de piel
const VIEWS = [
  { p: [0.3, 1.08, 0.55], l: [0.05, 0.93, -0.2], fov: 32 },
  { p: [0.16, 1.02, 0.12], l: [0.07, 0.97, -0.16], fov: 30 },
  { p: [19.75, 1.55, 1.85], l: [20, 0.85, 0], fov: 32 },
] as const;
export const Test3D: React.FC = () => {
  const f = useCurrentFrame(), v = Math.floor(f / 30) % 3, t = f / FPS;
  setKeys([{ t: -1, p: [...VIEWS[v].p] as any, l: [...VIEWS[v].l] as any, fov: VIEWS[v].fov }, { t: 9999, p: [...VIEWS[v].p] as any, l: [...VIEWS[v].l] as any, fov: VIEWS[v].fov }]);
  return <AbsoluteFill style={{ background: "#000" }}>
    <World t={t} lamp={1} lift={v === 1 ? 1 : 0} dropForm={v === 1 ? 1 : 0} dropFall={0.3} lvl={0.8} glow={v === 1 ? 0.6 : 0.2} steam={1}
      piel={{ on: v === 2 ? 1 : 0, film: 0.6, loss: 1, press: 0, rub: 0, thick: 0 }} />
  </AbsoluteFill>;
};
