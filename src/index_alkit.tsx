// Banco de prueba del kit Albañil (stills locales). ENTRY=src/index_alkit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClFoilTest, ClHouseMap, ClWardrobeGap, ClTapeTest } from "./claudio/ClAlbanil";
import { ClChapter, ClCheck } from "./claudio/ClCards";
import { ClHeatSides, ClShadeGap, ClCrossVent, ClThermo, ClEarthTube } from "./claudio/ClCalor";
const B = "ref_alfresco.png";
const K: [React.FC<any>, any][] = [
  [ClHeatSides, { mode: "three", bed: B }], [ClShadeGap, { mode: "both", bed: B }], [ClCrossVent, { fan: true, bed: B }], [ClThermo, { from: 38, to: 31, label: "el cuarto de arriba", sub: "7 grados menos", bed: B }], [ClEarthTube, { mode: "good", bed: B }], [ClEarthTube, { mode: "short", bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Alkit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
