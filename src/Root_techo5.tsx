import "./index.css";
import { Composition } from "remotion";
import { MainTecho5, TOTAL_FRAMES_TECHO5 } from "./VideoEdit/Main_techo5";

// Root MÍNIMO — solo el video "techo5". Aísla del Root completo.
export const RootTecho5: React.FC = () => (
  <>
    <Composition id="Techo5" component={MainTecho5} durationInFrames={TOTAL_FRAMES_TECHO5} fps={30} width={1920} height={1080} />
  </>
);
