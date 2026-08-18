import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRavietnam, TOTAL_FRAMES_RAV } from "./VideoEdit/Main_ravietnam";
const RavietnamRoot: React.FC = () => (
  <Composition id="Ravietnam" component={MainRavietnam} durationInFrames={TOTAL_FRAMES_RAV} fps={30} width={1920} height={1080} />
);
registerRoot(RavietnamRoot);
