import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdRingRt, TOTAL_FRAMES_MDRINGRT } from "./VideoEdit/Main_mdringrt";
const RootMdRingRt: React.FC = () => (
  <Composition id="MdRingRt" component={MainMdRingRt} durationInFrames={TOTAL_FRAMES_MDRINGRT} fps={30} width={1920} height={1080} />
);
registerRoot(RootMdRingRt);
