import "./index.css";
import { Composition } from "remotion";
import { MainOxidotanico, TOTAL_FRAMES_OXIDOTANICO } from "./VideoEdit/Main_oxidotanico";
export const RootOxidotanico: React.FC = () => (<><Composition id="Oxidotanico" component={MainOxidotanico} durationInFrames={TOTAL_FRAMES_OXIDOTANICO} fps={30} width={1920} height={1080} /></>);
