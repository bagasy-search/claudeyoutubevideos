// Entry solo-vlhdvm2isyur para Remotion (farm). ENTRY=src/index_vlhdvm2isyur.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVlh, TOTAL_FRAMES_VLH } from "./_fed6/VideoEdit/Main_vlhdvm2isyur";

const VlhRoot: React.FC = () => (
  <Composition id="FedRomero" component={MainVlh} durationInFrames={TOTAL_FRAMES_VLH} fps={30} width={1920} height={1080} />
);

registerRoot(VlhRoot);
