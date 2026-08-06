import "./index.css";
import { Composition } from "remotion";
import { MainPlatano, TOTAL_FRAMES_PLATANO } from "./VideoEdit/Main_platano";

// Root MÍNIMO — solo el video "platano" (cáscara de plátano). Aísla del Root completo.
export const RootPlatano: React.FC = () => (
  <>
    <Composition id="Platano" component={MainPlatano} durationInFrames={TOTAL_FRAMES_PLATANO} fps={30} width={1920} height={1080} />
  </>
);
