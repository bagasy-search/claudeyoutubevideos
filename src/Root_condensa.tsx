import "./index.css";
import { Composition } from "remotion";
import { MainCondensa, TOTAL_FRAMES_CONDENSA } from "./VideoEdit/Main_condensa";
export const RootCondensa: React.FC = () => (<><Composition id="Condensa" component={MainCondensa} durationInFrames={TOTAL_FRAMES_CONDENSA} fps={30} width={1920} height={1080} /></>);
