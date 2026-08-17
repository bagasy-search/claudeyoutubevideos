import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxpest, TOTAL_FRAMES_PXPEST } from "./VideoEdit/Main_pxpest";
const RootPxpest: React.FC = () => (
  <><Composition id="PxPest" component={MainPxpest} durationInFrames={TOTAL_FRAMES_PXPEST} fps={30} width={1920} height={1080} /></>
);
registerRoot(RootPxpest);
