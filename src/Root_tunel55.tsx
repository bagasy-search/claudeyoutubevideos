import "./index.css";
import { Composition } from "remotion";
import { MainTunel55, TOTAL_FRAMES_TUNEL55 } from "./VideoEdit/Main_tunel55";

// Root MÍNIMO — solo el video "tunel55 penetrante". Aísla del Root completo.
export const RootTunel55: React.FC = () => (
  <>
    <Composition id="Tunel55" component={MainTunel55} durationInFrames={TOTAL_FRAMES_TUNEL55} fps={30} width={1920} height={1080} />
  </>
);
