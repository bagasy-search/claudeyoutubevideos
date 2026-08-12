import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxjardin, TOTAL_FRAMES_PXJARDIN } from "./VideoEdit/Main_pxjardin";

const RootPxjardin: React.FC = () => (
  <>
    <Composition id="PxJardin" component={MainPxjardin} durationInFrames={TOTAL_FRAMES_PXJARDIN} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxjardin);
