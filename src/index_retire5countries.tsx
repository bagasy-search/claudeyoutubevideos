import { Composition, registerRoot } from "remotion";
import { MainRetire5, TOTAL_FRAMES_RA } from "./VideoEdit/Main_retire5countries";

// Entry mínimo para el FARM (evita el OOM del Root grande). Registra SOLO esta comp.
const Root: React.FC = () => (
  <Composition id="Retire5" component={MainRetire5} durationInFrames={TOTAL_FRAMES_RA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
