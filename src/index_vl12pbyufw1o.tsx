// Entry solo-vl12pbyufw1o (Studio + farm). ENTRY=src/index_vl12pbyufw1o.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVL, TOTAL_FRAMES_VL } from "./_fed6/VideoEdit/Main_vl12pbyufw1o";

const VLRoot: React.FC = () => (
  <Composition id="FedPielVL" component={MainVL} durationInFrames={TOTAL_FRAMES_VL} fps={30} width={1920} height={1080} />
);

registerRoot(VLRoot);
