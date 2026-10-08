// Banco de prueba del kit nuevo (fuhormiga). ENTRY=src/index_fukit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClAntRelay, ClBaitStation, ClAntDays } from "./claudio/ClHormiga";
const K: [React.FC<any>, any][] = [
  [ClAntRelay, {"mode": "share", "bed": "ref_fuhormiga.png"}],
  [ClAntRelay, {"mode": "spray", "bed": "ref_fuhormiga.png"}],
  [ClBaitStation, {"mode": "mix", "bed": "ref_fuhormiga.png"}],
  [ClBaitStation, {"mode": "station", "bed": "ref_fuhormiga.png"}],
  [ClAntDays, {"bed": "ref_fuhormiga.png"}]
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Fukit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
