// Entry solo-Naillines para el FARM. Uso: ENTRY=src/index_naillines.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainNaillines, TOTAL_FRAMES_NAILLINES } from "./_fed6/VideoEdit/Main_naillines";

const NaillinesRoot: React.FC = () => (
  <Composition id="Naillines" component={MainNaillines} durationInFrames={TOTAL_FRAMES_NAILLINES} fps={30} width={1920} height={1080} />
);

registerRoot(NaillinesRoot);
