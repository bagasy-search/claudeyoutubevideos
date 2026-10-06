// Entry solo-Puntofascia para el FARM. Uso: ENTRY=src/index_puntofascia.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainPuntofascia, TOTAL_FRAMES_PF } from "./_fed6/VideoEdit/Main_puntofascia";

const PuntofasciaRoot: React.FC = () => (
  <Composition id="Puntofascia" component={MainPuntofascia} durationInFrames={TOTAL_FRAMES_PF} fps={30} width={1920} height={1080} />
);

registerRoot(PuntofasciaRoot);
