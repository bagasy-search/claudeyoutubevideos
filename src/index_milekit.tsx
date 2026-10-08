// Banco de stills del kit de las MILLAS (om500k). ENTRY=src/index_milekit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClOdoRace, ClFluidClock } from "./claudio/ClMillas";
const B = "ref_om500k.png";
const K: [React.FC<any>, any][] = [
  [ClOdoRace, { a: 130000, b: 500000, labelA: "Owner A", labelB: "Owner B", bed: B }],
  [ClFluidClock, { items: [{ name: "Brake fluid", years: 2 }, { name: "Coolant", years: 5 }], bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 240} durationInFrames={240}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Milekit" component={Main} durationInFrames={K.length * 240} fps={30} width={1920} height={1080} />);
