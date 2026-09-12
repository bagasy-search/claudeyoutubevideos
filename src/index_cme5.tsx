import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainCme5, TOTAL_FRAMES_CME5 } from "./VideoEdit/Main_cme5";
const RootCme5: React.FC = () => (<><Composition id="Cme5" component={MainCme5} durationInFrames={TOTAL_FRAMES_CME5} fps={30} width={1920} height={1080} /></>);
registerRoot(RootCme5);
