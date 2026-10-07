// Banco de prueba del kit Albañil (stills locales). ENTRY=src/index_alkit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClFoilTest, ClHouseMap, ClWardrobeGap, ClTapeTest } from "./claudio/ClAlbanil";
import { ClChapter, ClCheck } from "./claudio/ClCards";
import { ClHeatSides, ClShadeGap, ClCrossVent, ClThermo, ClEarthTube } from "./claudio/ClCalor";
import { ClWickWall, ClThreeDamp, ClPencilLine } from "./claudio/ClHumedad";
import { ClWaterWalk, ClHoseTest, ClMembrane } from "./claudio/ClGotera";
import { ClCoinTest, ClPlasterTell, ClCrackTypes, ClVFill } from "./claudio/ClGrieta";
const B = "ref_algrieta.png";
const K: [React.FC<any>, any][] = [
  [ClCoinTest, { result: "yes", bed: B }], [ClPlasterTell, { result: "whole", names: ["Pepe", "Lola"], bed: B }], [ClCrackTypes, { pick: -1, bed: B }], [ClVFill, { outside: true, bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Alkit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
