import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainPlatano, TOTAL_FRAMES_PLATANO } from "./VideoEdit/Main_platano";

// Entry MÍNIMO self-contained del video "platano" (cáscara de plátano).
const RootPlatano: React.FC = () => (
  <>
    <Composition
      id="Platano"
      component={MainPlatano}
      durationInFrames={TOTAL_FRAMES_PLATANO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootPlatano);
