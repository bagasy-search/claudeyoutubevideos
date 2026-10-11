// Banco de prueba del kit Rhonda en el FARM (antes del render completo): cada componente 5 s con props y assets REALES del video en curso.
// rhgrout: junta 3D (todos los modos) + presupuesto sellado, mapa del piso, cepillo alambre vs nylon + rótulo y palabra clave.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { RhGroutJoint3D, RhQuoteStamp, RhFloorMap, RhBrushCompare } from "./RhGrout";
import { RhKicker, RhPop } from "./RhOverlays";

const I = (n: string) => `img/rhgrout/${n}.jpg`;
const Over: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <AbsoluteFill><Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />{children}</AbsoluteFill>
);
export const KIT: [React.FC<any>, any][] = [
  [RhGroutJoint3D, { mode: "mop", bed: I("r_mopping"), labels: { week: "THE REASON", grout: "Grout" } }],
  [RhGroutJoint3D, { mode: "paste", bed: I("r_push"), labels: { pore: "Little holes", dirt: "The dirt", paste: "Paste" } }],
  [RhGroutJoint3D, { mode: "clean", bed: I("r_push"), labels: { tile: "Glaze, like glass", grout: "Sand + cement", pore: "Tiny holes" } }],
  [RhGroutJoint3D, { mode: "drop", bed: I("r_push"), labels: { tile: "Sits there", grout: "Gone" } }],
  [RhGroutJoint3D, { mode: "seal", bed: I("r_sealing"), labels: { seal: "Sealer fills the holes" } }],
  [RhQuoteStamp, { bed: I("r_client"), price: "$1,200", job: "Grind out + regrout", stamp: "NOT NEEDED", instead: "a box of baking soda" }],
  [RhFloorMap, { bed: I("r_satisfied"), title: "3 WORST SPOTS", zones: [{ label: "STOVE", x: 0.2, y: 0.3 }, { label: "SINK", x: 0.6, y: 0.25 }, { label: "BACK DOOR", x: 0.82, y: 0.78 }] }],
  [RhBrushCompare, { img: I("r_knees"), wire: "✕ Wire brush", nylon: "✓ Nylon brush" }],
  [() => <Over bg={I("r_wow")}><Sequence durationInFrames={75}><RhKicker txt="LIVE TEST" hand /></Sequence><Sequence from={75}><RhKicker txt="WET + GRIT = MUD" red side="r" /></Sequence><Sequence from={40} durationInFrames={30}><RhPop txt="NEVER" /></Sequence></Over>, {}],
];
export const RhKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {KIT.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
  </AbsoluteFill>
);
