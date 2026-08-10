import "./index.css";
import { Composition } from "remotion";
import { MainRadiador, TOTAL_FRAMES_RADIADOR } from "./VideoEdit/Main_radiador";
export const RootRadiador: React.FC = () => (<><Composition id="Radiador" component={MainRadiador} durationInFrames={TOTAL_FRAMES_RADIADOR} fps={30} width={1920} height={1080} /></>);
