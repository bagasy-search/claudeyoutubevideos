import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxtrucosFm, TOTAL_FRAMES_PXTRUCOS_FM } from "./VideoEdit/Main_pxtrucos_firstmin";

// Entry SOLO del primer minuto (trailer) de pxtrucos, para preview en el farm.
const RootPxtrucosFm: React.FC = () => (
  <>
    <Composition
      id="PxTrucosFirstMin"
      component={MainPxtrucosFm}
      durationInFrames={TOTAL_FRAMES_PXTRUCOS_FM}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootPxtrucosFm);
