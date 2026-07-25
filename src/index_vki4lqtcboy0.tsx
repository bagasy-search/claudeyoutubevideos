import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVki4, TOTAL_FRAMES_VKI4LQTCBOY0 } from "./VideoEdit/Main_vki4lqtcboy0";

// Entry AISLADO — solo la composición "AbuelaPlatos" (Abuela Rosa · 25 platos caseros olvidados).
const RootVki4: React.FC = () => (
  <>
    <Composition id="AbuelaPlatos" component={MainVki4} durationInFrames={TOTAL_FRAMES_VKI4LQTCBOY0} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootVki4);
