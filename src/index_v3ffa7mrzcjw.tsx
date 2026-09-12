// Entry solo-v3ffa7mrzcjw para Remotion (Studio + farm). ENTRY=src/index_v3ffa7mrzcjw.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV3z, TOTAL_FRAMES_V3Z } from "./_fed6/VideoEdit/Main_v3ffa7mrzcjw";

const V3zRoot: React.FC = () => (
  <Composition id="FedPiel" component={MainV3z} durationInFrames={TOTAL_FRAMES_V3Z} fps={30} width={1920} height={1080} />
);

registerRoot(V3zRoot);
