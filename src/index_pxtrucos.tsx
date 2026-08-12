import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxtrucos, TOTAL_FRAMES_PXTRUCOS } from "./VideoEdit/Main_pxtrucos";

const RootPxtrucos: React.FC = () => (
  <>
    <Composition id="PxTrucos" component={MainPxtrucos} durationInFrames={TOTAL_FRAMES_PXTRUCOS} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxtrucos);
