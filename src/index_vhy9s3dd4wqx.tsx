// Entry solo-vhy9s3dd4wqx para Remotion (farm). ENTRY=src/index_vhy9s3dd4wqx.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVHY, TOTAL_FRAMES_VHY } from "./_fed6/VideoEdit/Main_vhy9s3dd4wqx";

const VhyRoot: React.FC = () => (
  <Composition id="FedPiernas" component={MainVHY} durationInFrames={TOTAL_FRAMES_VHY} fps={30} width={1920} height={1080} />
);

registerRoot(VhyRoot);
