// Entry solo-vgv2q0an50ik para Remotion (Studio + farm). ENTRY=src/index_vgv2q0an50ik.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVgz, TOTAL_FRAMES_VGZ } from "./_fed6/VideoEdit/Main_vgv2q0an50ik";

const VgzRoot: React.FC = () => (
  <Composition id="FedMusculo" component={MainVgz} durationInFrames={TOTAL_FRAMES_VGZ} fps={30} width={1920} height={1080} />
);

registerRoot(VgzRoot);
