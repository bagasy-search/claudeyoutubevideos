// Banco de prueba del kit Ole* (render de control: mide el costo de los 3D y la legibilidad antes del video).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ITEMS_A } from "./OleKitTestA";
import { ITEMS_B } from "./OleKitTestB";
import { ITEMS_C } from "./OleKitTestC";

const items = [...ITEMS_A, ...ITEMS_B, ...ITEMS_C];
export const OLE_KIT_TEST_FRAMES = Math.max(30, items.reduce((a, [d]) => a + d, 0));
export const OleKitTest: React.FC = () => {
  let t = 0;
  return <AbsoluteFill style={{ backgroundColor: "#E9D9B8" }}>{items.map(([d, el], i) => { const from = t; t += d; return <Sequence key={i} from={from} durationInFrames={d}>{el}</Sequence>; })}</AbsoluteFill>;
};
// Una sola composición por grupo (para renderizar stills sin depender de los otros grupos)
const group = (xs: [number, React.ReactNode][]) => () => { let t = 0; return <AbsoluteFill style={{ backgroundColor: "#E9D9B8" }}>{xs.map(([d, el], i) => { const from = t; t += d; return <Sequence key={i} from={from} durationInFrames={d}>{el}</Sequence>; })}</AbsoluteFill>; };
export const OleKitA = group(ITEMS_A), OleKitB = group(ITEMS_B), OleKitC = group(ITEMS_C);
export const framesOf = (xs: [number, React.ReactNode][]) => Math.max(30, xs.reduce((a, [d]) => a + d, 0));
export { ITEMS_A, ITEMS_B, ITEMS_C };
