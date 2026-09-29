// Prueba de los componentes nuevos (stills): npx remotion still src/index_olcast.tsx OlcKitTest --frame=N
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OlcPanCross3D } from "./OlcPanCross3D";
import { OlcPanRescue3D } from "./OlcPanRescue3D";
import { OlcStoreVsCamp, OlcSmokeLadder, OlcLayerCount, OlcFirstWeeks, OlcFixTable } from "./OlcCards";
import { OlcOvenStack, OlcHeatMap, OlcFlick, OlcRustCheck, OlcBriquette } from "./OlcScenes";
const L: [string, React.FC<any>, number, any?][] = [
  ["cross", OlcPanCross3D, 23], ["rescue", OlcPanRescue3D, 30], ["store", OlcStoreVsCamp, 10], ["smoke", OlcSmokeLadder, 17], ["layers", OlcLayerCount, 11],
  ["first", OlcFirstWeeks, 13], ["fix", OlcFixTable, 27], ["oven", OlcOvenStack, 21], ["heat", OlcHeatMap, 21], ["flick", OlcFlick, 6], ["rust", OlcRustCheck, 12], ["briq", OlcBriquette, 28],
];
export const KIT_TEST_FRAMES = L.reduce((a, [, , d]) => a + d * 30, 0);
export const KIT_OFFSETS = L.map(([n], i) => [n, L.slice(0, i).reduce((a, [, , d]) => a + d * 30, 0)] as const);
export const OlcKitTest: React.FC = () => (
  <AbsoluteFill>{L.map(([n, C, d, p], i) => <Sequence key={n} from={KIT_OFFSETS[i][1]} durationInFrames={d * 30}><C {...(p || {})} /></Sequence>)}</AbsoluteFill>
);
