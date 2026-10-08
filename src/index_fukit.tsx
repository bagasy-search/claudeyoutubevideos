// Banco de prueba del kit Fumigador (stills locales). ENTRY=src/index_fukit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClHidden50, ClFridgeBack, ClPeroxide, ClTrailMap } from "./claudio/ClFumigador";
import { ClChapter, ClCheck } from "./claudio/ClCards";
import { ClDoorGap, ClBarrierLine, ClPerimeter30 } from "./claudio/ClPuerta";
const B = "ref_fu30.png";
const K: [React.FC<any>, any][] = [
  [ClDoorGap, { mode: "light", bed: B }], [ClDoorGap, { mode: "sealed", bed: B }], [ClBarrierLine, { mode: "line", bed: B }], [ClBarrierLine, { mode: "herbs", bed: B }],
  [ClBarrierLine, { mode: "dog", bed: B }], [ClPerimeter30, { mode: "bridges", bed: B }], [ClPerimeter30, { mode: "clean", bed: B }],
  [ClHidden50, { hidden: 50, bed: B }], [ClFridgeBack, { mode: "find", bed: B }], [ClFridgeBack, { mode: "fixed", bed: B }], [ClPeroxide, { mode: "contact", bed: B }],
  [ClPeroxide, { mode: "gone", bed: B }], [ClTrailMap, { mode: "trail", bed: B }], [ClTrailMap, { mode: "erase", bed: B }], [ClTrailMap, { mode: "bait", bed: B }],
  [ClChapter, { n: 1, title: "La casa de los Ramírez", sub: "dos fumigaciones perdidas", bed: B }], [ClCheck, { title: "La botella", items: ["500 ml de agua oxigenada", "1 gota de detergente"], bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Fukit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
