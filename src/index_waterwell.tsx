// Entry solo-Waterwell para Remotion Studio / farm. Uso: ENTRY=src/index_waterwell.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainWaterwell, TOTAL_FRAMES_WATERWELL } from "./VideoEdit/Main_waterwell";

const WaterwellRoot: React.FC = () => (
  <Composition id="Waterwell" component={MainWaterwell} durationInFrames={TOTAL_FRAMES_WATERWELL} fps={30} width={1920} height={1080} />
);

registerRoot(WaterwellRoot);
