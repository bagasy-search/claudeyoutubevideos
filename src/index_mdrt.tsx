import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdRt, TOTAL_FRAMES_MDRT } from "./VideoEdit/Main_mdrt";
const RootMdRt: React.FC = () => (
  <Composition id="MdRt" component={MainMdRt} durationInFrames={TOTAL_FRAMES_MDRT} fps={30} width={1920} height={1080} />
);
registerRoot(RootMdRt);
