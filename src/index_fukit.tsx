// Banco de prueba del kit nuevo (fufruta). ENTRY=src/index_fukit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClGlassTrap, ClDrainFactory, ClFlyCycle } from "./claudio/ClFruta";
const K: [React.FC<any>, any][] = [
  [ClGlassTrap, {"mode": "cone", "bed": "ref_fufruta.png"}],
  [ClGlassTrap, {"mode": "soap", "bed": "ref_fufruta.png"}],
  [ClDrainFactory, {"mode": "cups", "bed": "ref_fufruta.png"}],
  [ClDrainFactory, {"mode": "larvae", "bed": "ref_fufruta.png"}],
  [ClDrainFactory, {"mode": "clean", "bed": "ref_fufruta.png"}],
  [ClFlyCycle, {"bed": "ref_fufruta.png"}]
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Fukit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
