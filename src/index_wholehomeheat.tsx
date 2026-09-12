// Entry solo-Wholehomeheat para Remotion Studio / farm. Uso: ENTRY=src/index_wholehomeheat.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainWholehomeheat, TOTAL_FRAMES_WHOLEHOMEHEAT } from "./VideoEdit/Main_wholehomeheat";

const WholehomeheatRoot: React.FC = () => (
  <Composition id="Wholehomeheat" component={MainWholehomeheat} durationInFrames={TOTAL_FRAMES_WHOLEHOMEHEAT} fps={30} width={1920} height={1080} />
);

registerRoot(WholehomeheatRoot);
