// Entry solo-vr4b7bsn4mcv para Remotion (Studio + farm). ENTRY=src/index_vr4b7bsn4mcv.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVR, TOTAL_FRAMES_VR } from "./_fed6/VideoEdit/Main_vr4b7bsn4mcv";

const VRRoot: React.FC = () => (
  <Composition id="FedRomero" component={MainVR} durationInFrames={TOTAL_FRAMES_VR} fps={30} width={1920} height={1080} />
);

registerRoot(VRRoot);
