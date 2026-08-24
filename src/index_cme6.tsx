import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainCme6, TOTAL_FRAMES_CME6 } from "./VideoEdit/Main_cme6";
const RootCme6: React.FC = () => (<><Composition id="Cme6" component={MainCme6} durationInFrames={TOTAL_FRAMES_CME6} fps={30} width={1920} height={1080} /></>);
registerRoot(RootCme6);
