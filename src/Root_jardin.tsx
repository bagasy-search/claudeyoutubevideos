import "./index.css";
import { Composition } from "remotion";
import { MainJardin, TOTAL_FRAMES_JARDIN } from "./VideoEdit/Main_jardin";
export const RootJardin: React.FC = () => (<><Composition id="Jardin" component={MainJardin} durationInFrames={TOTAL_FRAMES_JARDIN} fps={30} width={1920} height={1080} /></>);
