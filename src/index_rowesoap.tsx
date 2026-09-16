// Entry solo-Rowesoap para el FARM. Uso: ENTRY=src/index_rowesoap.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRowesoap, TOTAL_FRAMES_ROWESOAP } from "./rowesoap/Main_rowesoap";

const RowesoapRoot: React.FC = () => (
  <Composition id="Rowesoap" component={MainRowesoap} durationInFrames={TOTAL_FRAMES_ROWESOAP} fps={30} width={1920} height={1080} />
);

registerRoot(RowesoapRoot);
