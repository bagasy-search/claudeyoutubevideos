import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainPxappliance, TOTAL_FRAMES_PXAPPLIANCE } from "./VideoEdit/Main_pxappliance";
const RootPxappliance: React.FC = () => (
  <><Composition id="PxAppliance" component={MainPxappliance} durationInFrames={TOTAL_FRAMES_PXAPPLIANCE} fps={30} width={1920} height={1080} /></>
);
registerRoot(RootPxappliance);
