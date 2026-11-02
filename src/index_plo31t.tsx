// plo31t: generado por _dstest/ds_full.mjs (no editar a mano)
import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Tramo0 } from "./plo31t/Tramo0";
import { Tramo1 } from "./plo31t/Tramo1";
import { Tramo2 } from "./plo31t/Tramo2";
import { Tramo3 } from "./plo31t/Tramo3";
import { Tramo4 } from "./plo31t/Tramo4";
import { Tramo5 } from "./plo31t/Tramo5";
import { Tramo6 } from "./plo31t/Tramo6";
import { Tramo7 } from "./plo31t/Tramo7";
import { Tramo8 } from "./plo31t/Tramo8";
import { Tramo9 } from "./plo31t/Tramo9";
import { Escena_0_39_continuo } from "./plo31t/F_Escena_0_39_continuo";
const T: { a: number; b: number; C: React.FC<{ t: number }> }[] = [
  { a: 0, b: 38.54, C: Escena_0_39_continuo },
  { a: 0, b: 178.99, C: Tramo0 },
  { a: 178.99, b: 365.851, C: Tramo1 },
  { a: 365.851, b: 531.561, C: Tramo2 },
  { a: 531.561, b: 722.129, C: Tramo3 },
  { a: 722.129, b: 904.03, C: Tramo4 },
  { a: 904.03, b: 1083.972, C: Tramo5 },
  { a: 1083.972, b: 1260.559, C: Tramo6 },
  { a: 1260.559, b: 1440.914, C: Tramo7 },
  { a: 1440.914, b: 1625.588, C: Tramo8 },
  { a: 1625.588, b: 1833.006, C: Tramo9 },
];
const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const x = T.find((r) => t >= r.a && t < r.b) ?? T[T.length - 1];
  return <AbsoluteFill style={{ background: "#000" }}><x.C t={t} /></AbsoluteFill>;
};
const Root = () => <Composition id="Full" component={Full} durationInFrames={54990} fps={30} width={1920} height={1080} />;
registerRoot(Root);
