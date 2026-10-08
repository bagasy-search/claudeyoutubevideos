// Banco de prueba del kit nuevo (fucasero). ENTRY=src/index_fukit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClRoachHide, ClBoricBalls, ClRoachStation } from "./claudio/ClCasero";
const K: [React.FC<any>, any][] = [
  [ClRoachHide, {"mode": "hide", "bed": "ref_fucasero.png"}],
  [ClRoachHide, {"mode": "spray", "bed": "ref_fucasero.png"}],
  [ClRoachHide, {"mode": "bait", "bed": "ref_fucasero.png"}],
  [ClBoricBalls, {"bed": "ref_fucasero.png"}],
  [ClRoachStation, {"mode": "station", "bed": "ref_fucasero.png"}],
  [ClRoachStation, {"mode": "map", "bed": "ref_fucasero.png"}]
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Fukit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
