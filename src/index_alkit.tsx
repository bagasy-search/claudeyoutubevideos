// Banco de prueba del kit Albañil (stills locales). ENTRY=src/index_alkit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClFoilTest, ClHouseMap, ClWardrobeGap, ClTapeTest } from "./claudio/ClAlbanil";
import { ClChapter, ClCheck } from "./claudio/ClCards";
import { ClHeatSides, ClShadeGap, ClCrossVent, ClThermo, ClEarthTube } from "./claudio/ClCalor";
import { ClWickWall, ClThreeDamp, ClPencilLine } from "./claudio/ClHumedad";
const B = "ref_alhumedad.png";
const K: [React.FC<any>, any][] = [
  [ClWickWall, { mode: "rise", bed: B }], [ClWickWall, { mode: "trap", bed: B }], [ClWickWall, { mode: "breathe", bed: B }], [ClWickWall, { mode: "planter", bed: B }], [ClThreeDamp, { pick: -1, bed: B }], [ClPencilLine, { result: "up", bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Alkit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
