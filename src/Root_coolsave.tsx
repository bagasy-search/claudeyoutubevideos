import "./index.css";
import { Composition } from "remotion";
import { MainCoolsave, TOTAL_FRAMES_COOLSAVE } from "./VideoEdit/Main_coolsave";

// Root MÍNIMO — solo el video "coolsave penetrante". Aísla del Root completo.
export const RootCoolsave: React.FC = () => (
  <>
    <Composition id="Coolsave" component={MainCoolsave} durationInFrames={TOTAL_FRAMES_COOLSAVE} fps={30} width={1920} height={1080} />
  </>
);
