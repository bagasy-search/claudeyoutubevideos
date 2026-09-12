import "./index.css";
import { Composition } from "remotion";
import { MainTecho7, TOTAL_FRAMES_TECHO7 } from "./VideoEdit/Main_techo7";
export const RootTecho7: React.FC = () => (<><Composition id="Techo7" component={MainTecho7} durationInFrames={TOTAL_FRAMES_TECHO7} fps={30} width={1920} height={1080} /></>);
