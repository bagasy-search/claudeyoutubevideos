import "./index.css";
import { Composition } from "remotion";
import { MohoPilot, PILOT_FRAMES } from "./VideoEdit/MohoPilot";

export const RootMohoPilot: React.FC = () => (
  <Composition id="MohoPilot" component={MohoPilot} durationInFrames={PILOT_FRAMES}
    fps={30} width={1920} height={1080} />
);
