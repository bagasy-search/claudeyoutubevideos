// Entry MÍNIMO solo-V51. No registra nada más (aislamiento entre agentes).
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV51, TOTAL_FRAMES_V51 } from "./VideoEdit/Main_v51t03yxuzk7";

const V51Root: React.FC = () => (
  <Composition
    id="V51"
    component={MainV51}
    durationInFrames={TOTAL_FRAMES_V51}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(V51Root);
