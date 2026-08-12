import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxtecnicos, TOTAL_FRAMES_PXTECNICOS } from "./VideoEdit/Main_pxtecnicos";

const RootPxtecnicos: React.FC = () => (
  <>
    <Composition id="PxTecnicos" component={MainPxtecnicos} durationInFrames={TOTAL_FRAMES_PXTECNICOS} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxtecnicos);
