// Banco de prueba de los componentes NUEVOS del video cllavabo (sarro del lavabo), 5 s cada uno.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClFaucet3D, ClDropDry, ClAerator, ClMaterials, ClAcidBase, ClWrapGuide } from "./ClLavabo";

export const KITSL: [React.FC<any>, any][] = [
  [ClFaucet3D, { mode: "grow", labels: { a: "Base", b: "Boca", c: "Desagüe" } }],
  [ClFaucet3D, { mode: "wrap", labels: { a: "Venda de vinagre" } }],
  [ClFaucet3D, { mode: "bag", labels: { b: "Bolsita, 1 hora" } }],
  [ClFaucet3D, { mode: "clean" }],
  [ClDropDry, {}],
  [ClAerator, { mode: "clog" }],
  [ClMaterials, { hi: 1 }],
  [ClAcidBase, { hi: "cloro" }],
  [ClWrapGuide, {}],
];
export const ClKitLavabo: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{KITSL.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}</AbsoluteFill>;
