import "./index.css";
import { Composition } from "remotion";
import { MainMaderaborato, TOTAL_FRAMES_MADERABORATO } from "./VideoEdit/Main_maderaborato";
export const RootMaderaborato: React.FC = () => (<><Composition id="Maderaborato" component={MainMaderaborato} durationInFrames={TOTAL_FRAMES_MADERABORATO} fps={30} width={1920} height={1080} /></>);
