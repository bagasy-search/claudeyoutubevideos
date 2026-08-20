import "./index.css";
import { Composition } from "remotion";
import { MainAzotea2, TOTAL_FRAMES_AZOTEA2 } from "./VideoEdit/Main_azotea2";
export const RootAzotea2: React.FC = () => (<><Composition id="Azotea2" component={MainAzotea2} durationInFrames={TOTAL_FRAMES_AZOTEA2} fps={30} width={1920} height={1080} /></>);
