import "./index.css";
import { Composition } from "remotion";
import { MainLampara, TOTAL_FRAMES_LAMPARA } from "./VideoEdit/Main_lampara";
export const RootLampara: React.FC = () => (<><Composition id="Lampara" component={MainLampara} durationInFrames={TOTAL_FRAMES_LAMPARA} fps={30} width={1920} height={1080} /></>);
