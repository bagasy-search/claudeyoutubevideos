import "./index.css";
import { Composition } from "remotion";
import { MainMohotoxico, TOTAL_FRAMES_MOHOTOXICO } from "./VideoEdit/Main_mohotoxico";
export const RootMohotoxico: React.FC = () => (<><Composition id="Mohotoxico" component={MainMohotoxico} durationInFrames={TOTAL_FRAMES_MOHOTOXICO} fps={30} width={1920} height={1080} /></>);
