import "./index.css";
import { Composition } from "remotion";
import { MainImpermeacasero, TOTAL_FRAMES_IMPERMEACASERO } from "./VideoEdit/Main_impermeacasero";
export const RootImpermeacasero: React.FC = () => (<><Composition id="Impermeacasero" component={MainImpermeacasero} durationInFrames={TOTAL_FRAMES_IMPERMEACASERO} fps={30} width={1920} height={1080} /></>);
