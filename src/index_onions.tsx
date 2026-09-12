import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainOnions, TOTAL_FRAMES_ONIONS } from "./VideoEdit/Main_onions";
const OnionsRoot: React.FC = () => (
  <Composition id="Onions" component={MainOnions} durationInFrames={TOTAL_FRAMES_ONIONS} fps={30} width={1920} height={1080} />
);
registerRoot(OnionsRoot);
