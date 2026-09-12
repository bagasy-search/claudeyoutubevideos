import "./index.css";
import { Composition } from "remotion";
import { MainBrea50, TOTAL_FRAMES_BREA50 } from "./VideoEdit/Main_brea50";
export const RootBrea50: React.FC = () => (<><Composition id="Brea50" component={MainBrea50} durationInFrames={TOTAL_FRAMES_BREA50} fps={30} width={1920} height={1080} /></>);
