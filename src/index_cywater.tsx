// Entry solo-Cywater para Remotion Studio / farm. Uso: ENTRY=src/index_cywater.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainCywater, TOTAL_FRAMES_CYWATER } from "./VideoEdit/Main_cywater";

const CywaterRoot: React.FC = () => (
  <Composition id="Cywater" component={MainCywater} durationInFrames={TOTAL_FRAMES_CYWATER} fps={30} width={1920} height={1080} />
);

registerRoot(CywaterRoot);
