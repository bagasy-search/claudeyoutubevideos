import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainMdFreezer, TOTAL_FRAMES_MDFREEZER } from "./VideoEdit/Main_mdfreezer";

const RootMdFreezer: React.FC = () => (
  <Composition id="MdFreezer" component={MainMdFreezer} durationInFrames={TOTAL_FRAMES_MDFREEZER} fps={30} width={1920} height={1080} />
);
registerRoot(RootMdFreezer);
