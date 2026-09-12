import "./index.css";
import { Composition } from "remotion";
import { MainSelloladrillo, TOTAL_FRAMES_SELLOLADRILLO } from "./VideoEdit/Main_selloladrillo";

// Root MÍNIMO — solo el video "sellar ladrillo / chimenea". Aísla del Root completo.
export const RootSelloladrillo: React.FC = () => (
  <>
    <Composition id="Selloladrillo" component={MainSelloladrillo} durationInFrames={TOTAL_FRAMES_SELLOLADRILLO} fps={30} width={1920} height={1080} />
  </>
);
