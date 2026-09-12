import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxhvac, TOTAL_FRAMES_PXHVAC } from "./VideoEdit/Main_pxhvac";

const RootPxhvac: React.FC = () => (
  <>
    <Composition id="PxHvac" component={MainPxhvac} durationInFrames={TOTAL_FRAMES_PXHVAC} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxhvac);
