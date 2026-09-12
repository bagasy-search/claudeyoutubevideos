import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxgarden, TOTAL_FRAMES_PXGARDEN } from "./VideoEdit/Main_pxgarden";
const RootPxgarden: React.FC = () => (
  <><Composition id="PxGarden" component={MainPxgarden} durationInFrames={TOTAL_FRAMES_PXGARDEN} fps={30} width={1920} height={1080} /></>
);
registerRoot(RootPxgarden);
