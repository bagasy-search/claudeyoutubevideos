import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainCme2, TOTAL_FRAMES_CME2 } from "./VideoEdit/Main_cme2";
const RootCme2: React.FC = () => (
  <><Composition id="Cme2" component={MainCme2} durationInFrames={TOTAL_FRAMES_CME2} fps={30} width={1920} height={1080} /></>
);
registerRoot(RootCme2);
