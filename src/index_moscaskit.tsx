// Banco de prueba del kit nuevo ClMoscas (fumoscasf). ENTRY=src/index_moscaskit.tsx
// Cada componente va sobre un cuadro REAL del vlog (test_*.jpg) como cama, igual que en el render final.
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClFlyDoor, ClLemon10, ClTapeHigh, ClMoscasMap } from "./claudio/ClMoscas";
const K: [React.FC<any>, any, number][] = [
  [ClFlyDoor, { bed: "img/fumoscasf/test_88_0.jpg" }, 240],
  [ClLemon10, { bed: "img/fumoscasf/test_331_0.jpg" }, 360],
  [ClTapeHigh, { bed: "img/fumoscasf/test_426_0.jpg" }, 360],
  [ClMoscasMap, { bed: "img/fumoscasf/test_631_0.jpg" }, 270],
];
const OFF = K.reduce<number[]>((a, [, , d], i) => [...a, (a[i - 1] ?? 0) + (K[i - 1]?.[2] ?? 0)], []);
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {K.map(([C, p, d], i) => (<Sequence key={i} from={OFF[i]} durationInFrames={d}><C {...p} /></Sequence>))}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="MoscaKit" component={Main} durationInFrames={OFF[3] + 270} fps={30} width={1920} height={1080} />);
