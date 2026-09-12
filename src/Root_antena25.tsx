import "./index.css";
import { Composition } from "remotion";
import { MainAntena25, TOTAL_FRAMES_ANTENA25 } from "./VideoEdit/Main_antena25";

// Root MÍNIMO — solo el video "antena25 penetrante". Aísla del Root completo.
export const RootAntena25: React.FC = () => (
  <>
    <Composition id="Antena25" component={MainAntena25} durationInFrames={TOTAL_FRAMES_ANTENA25} fps={30} width={1920} height={1080} />
  </>
);
