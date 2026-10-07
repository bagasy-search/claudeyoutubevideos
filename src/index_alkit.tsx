// Banco de prueba del kit Albañil (stills locales). ENTRY=src/index_alkit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClFoilTest, ClHouseMap, ClWardrobeGap, ClTapeTest } from "./claudio/ClAlbanil";
import { ClChapter, ClCheck } from "./claudio/ClCards";
import { ClHeatSides, ClShadeGap, ClCrossVent, ClThermo, ClEarthTube } from "./claudio/ClCalor";
import { ClWickWall, ClThreeDamp, ClPencilLine } from "./claudio/ClHumedad";
import { ClWaterWalk, ClHoseTest, ClMembrane } from "./claudio/ClGotera";
const B = "ref_algotera.png";
const K: [React.FC<any>, any][] = [
  [ClWaterWalk, { mode: "walk", bed: B }], [ClWaterWalk, { mode: "patch", bed: B }], [ClHoseTest, { zones: 4, hit: 1, bed: B }], [ClMembrane, { bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Alkit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
