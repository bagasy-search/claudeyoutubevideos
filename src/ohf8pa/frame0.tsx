// ohf8pa · CUADRO 0 = la miniatura sin texto, rehecha en 3D: el plenum y los conductos plateados de sótano, la mano sobre la manija del damper y un termómetro.
// F0 s después: CORTE SECO al avatar.
import React from "react";
import { H } from "./hkit";
import { Scene3D } from "./h3d";
import { Hand } from "./okit";
import { Galv, Lever, Round, Therm } from "./ductkit";

export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="none" wall="brick" wallZ={-0.9} bg="#1a1712" key1={[0.8, 1.5, 1.6]} warm={0.9}
  cam={{ at: [0.05, 0.36, 0], az: [0.32, 0.3], el: [0.04, 0.05], r: [1.42, 1.38], fov: 32 }}>{() => <>
  <Galv s={[2.8, 0.5, 0.6]} p={[0.1, 0.92, -0.45]} seams={5} />
  <Galv s={[0.9, 0.9, 0.72]} p={[-1.15, 0.5, -0.45]} seams={1} />
  <Round l={1.2} r={0.15} p={[0.18, 0.2, 0]} />
  <Lever p={[0.18, 0.28, 0.15]} ang={0.32} s={1.5} />
  <Hand p={[0.34, 0.2, 0.22]} rot={[0, -0.2, 2.25]} s={1.05} bend={0.5} />
  <Therm p={[-0.42, 0.34, 0.1]} rot={[0, 0.28, 0.05]} v={62} s={2.2} />
</>}</Scene3D>;
