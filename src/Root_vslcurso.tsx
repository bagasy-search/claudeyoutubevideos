import "./index.css";
import { Composition } from "remotion";
import { MainVslcurso, TOTAL_FRAMES_VSLCURSO } from "./VideoEdit/Main_vslcurso";
export const RootVslcurso: React.FC = () => (<><Composition id="Vslcurso" component={MainVslcurso} durationInFrames={TOTAL_FRAMES_VSLCURSO} fps={30} width={1920} height={1080} /></>);
