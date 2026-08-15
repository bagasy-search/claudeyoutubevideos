import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainTomatoes, TOTAL_FRAMES_TOMATOES } from "./VideoEdit/Main_tomatoes";
const TomatoesRoot: React.FC = () => (
  <Composition id="Tomatoes" component={MainTomatoes} durationInFrames={TOTAL_FRAMES_TOMATOES} fps={30} width={1920} height={1080} />
);
registerRoot(TomatoesRoot);
