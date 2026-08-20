import "./index.css";
import { Composition } from "remotion";
import { MainOxidoporton, TOTAL_FRAMES_OXIDOPORTON } from "./VideoEdit/Main_oxidoporton";
export const RootOxidoporton: React.FC = () => (<><Composition id="Oxidoporton" component={MainOxidoporton} durationInFrames={TOTAL_FRAMES_OXIDOPORTON} fps={30} width={1920} height={1080} /></>);
