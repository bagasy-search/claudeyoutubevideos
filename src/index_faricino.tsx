// Entry solo-Faricino para el FARM. Uso: ENTRY=src/index_faricino.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFaricino, TOTAL_FRAMES_FARICINO } from "./_fed6/VideoEdit/Main_faricino";

const FaricinoRoot: React.FC = () => (
  <Composition id="Faricino" component={MainFaricino} durationInFrames={TOTAL_FRAMES_FARICINO} fps={30} width={1920} height={1080} />
);

registerRoot(FaricinoRoot);
