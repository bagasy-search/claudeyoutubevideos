import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainCme1, TOTAL_FRAMES_CME1 } from "./VideoEdit/Main_cme1";
const RootCme1: React.FC = () => (<><Composition id="Cme1" component={MainCme1} durationInFrames={TOTAL_FRAMES_CME1} fps={30} width={1920} height={1080} /></>);
registerRoot(RootCme1);
