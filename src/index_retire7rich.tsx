import { Composition, registerRoot } from "remotion";
import { MainRetire7, TOTAL_FRAMES_R7 } from "./VideoEdit/Main_retire7rich";

// Entry mínimo para el FARM (evita el OOM del Root grande). Registra SOLO esta comp.
const Root: React.FC = () => (
  <Composition id="Retire7" component={MainRetire7} durationInFrames={TOTAL_FRAMES_R7} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
