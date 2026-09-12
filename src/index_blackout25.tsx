// Entry solo-Blackout25 para Remotion Studio / farm. Uso: ENTRY=src/index_blackout25.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainBlackout25, TOTAL_FRAMES_BLACKOUT25 } from "./VideoEdit/Main_blackout25";

const Blackout25Root: React.FC = () => (
  <Composition id="Blackout25" component={MainBlackout25} durationInFrames={TOTAL_FRAMES_BLACKOUT25} fps={30} width={1920} height={1080} />
);

registerRoot(Blackout25Root);
