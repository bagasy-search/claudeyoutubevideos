import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainCme4, TOTAL_FRAMES_CME4 } from "./VideoEdit/Main_cme4";
const RootCme4: React.FC = () => (<><Composition id="Cme4" component={MainCme4} durationInFrames={TOTAL_FRAMES_CME4} fps={30} width={1920} height={1080} /></>);
registerRoot(RootCme4);
