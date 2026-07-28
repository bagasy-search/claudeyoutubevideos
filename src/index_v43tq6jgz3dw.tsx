// Entry solo-v43tq6jgz3dw para Remotion (farm). ENTRY=src/index_v43tq6jgz3dw.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV43, TOTAL_FRAMES_V43 } from "./_fed6/VideoEdit/Main_v43tq6jgz3dw";

const V43Root: React.FC = () => (
  <Composition id="FedCanas" component={MainV43} durationInFrames={TOTAL_FRAMES_V43} fps={30} width={1920} height={1080} />
);

registerRoot(V43Root);
