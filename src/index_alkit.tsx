// Banco de prueba del kit Albañil (stills locales). ENTRY=src/index_alkit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClFoilTest, ClHouseMap, ClWardrobeGap, ClTapeTest } from "./claudio/ClAlbanil";
import { ClChapter, ClCheck } from "./claudio/ClCards";
const B = "ref_almoho.png";
const K: [React.FC<any>, any][] = [
  [ClFoilTest, { result: "out", bed: B }], [ClFoilTest, { result: "all", bed: B, title: "Tres resultados" }], [ClHouseMap, { done: ["dormitorio"], next: "arriba", bed: B }],
  [ClWardrobeGap, { bed: B, label: "5 cm" }], [ClTapeTest, { result: "paint", bed: B }], [ClChapter, { n: 1, title: "¿De dónde viene el agua?", sub: "antes de limpiar nada", bed: B }], [ClCheck, { title: "Lo que necesita", items: ["Vinagre blanco", "Mascarilla N95"], bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Alkit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
