// Entry solo-Legstrength90 para el FARM. Uso: ENTRY=src/index_legstrength90.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainLegstrength90, TOTAL_FRAMES_LEGSTRENGTH90 } from "./_fed6/VideoEdit/Main_legstrength90";

const Legstrength90Root: React.FC = () => (
  <Composition id="Legstrength90" component={MainLegstrength90} durationInFrames={TOTAL_FRAMES_LEGSTRENGTH90} fps={30} width={1920} height={1080} />
);

registerRoot(Legstrength90Root);
