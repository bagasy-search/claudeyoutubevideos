import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxaire, TOTAL_FRAMES_PXAIRE } from "./VideoEdit/Main_pxaire";

const RootPxaire: React.FC = () => (
  <>
    <Composition id="PxAire" component={MainPxaire} durationInFrames={TOTAL_FRAMES_PXAIRE} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxaire);
