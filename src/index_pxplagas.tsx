import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxplagas, TOTAL_FRAMES_PXPLAGAS } from "./VideoEdit/Main_pxplagas";

const RootPxplagas: React.FC = () => (
  <>
    <Composition id="PxPlagas" component={MainPxplagas} durationInFrames={TOTAL_FRAMES_PXPLAGAS} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootPxplagas);
