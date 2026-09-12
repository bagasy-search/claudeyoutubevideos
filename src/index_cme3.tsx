import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainCme3, TOTAL_FRAMES_CME3 } from "./VideoEdit/Main_cme3";
const RootCme3: React.FC = () => (<><Composition id="Cme3" component={MainCme3} durationInFrames={TOTAL_FRAMES_CME3} fps={30} width={1920} height={1080} /></>);
registerRoot(RootCme3);
