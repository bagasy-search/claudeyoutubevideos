import "./index.css";
import { Composition } from "remotion";
import { MainGrietas, TOTAL_FRAMES_GRIETAS } from "./VideoEdit/Main_grietas";
export const RootGrietas: React.FC = () => (<><Composition id="Grietas" component={MainGrietas} durationInFrames={TOTAL_FRAMES_GRIETAS} fps={30} width={1920} height={1080} /></>);
