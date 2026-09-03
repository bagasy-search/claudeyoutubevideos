// Entry solo-Drymouth60 para el FARM. Uso: ENTRY=src/index_drymouth60.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainDrymouth60, TOTAL_FRAMES_DRYMOUTH60 } from "./_fed6/VideoEdit/Main_drymouth60";

const Drymouth60Root: React.FC = () => (
  <Composition id="Drymouth60" component={MainDrymouth60} durationInFrames={TOTAL_FRAMES_DRYMOUTH60} fps={30} width={1920} height={1080} />
);

registerRoot(Drymouth60Root);
