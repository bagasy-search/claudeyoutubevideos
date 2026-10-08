// Banco de stills del kit de la LLAVE (omkey). ENTRY=src/index_keykit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClFobHold, ClCoinCell } from "./claudio/ClLlave";
const B = "ref_omkey.png";
const K: [React.FC<any>, any][] = [
  [ClFobHold, { button: "unlock", tap: "unlocks the doors", result: "Every window rolls down", bed: B }],
  [ClFobHold, { button: "lock", result: "Every window rolls up", bed: B }],
  [ClCoinCell, { code: "CR2032", dealer: "$65", store: "$3", bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 210} durationInFrames={210}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Keykit" component={Main} durationInFrames={K.length * 210} fps={30} width={1920} height={1080} />);
