// Entry solo-vlnljrhb5gbv para Remotion (Studio + farm). ENTRY=src/index_vlnljrhb5gbv.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVlnl, TOTAL_FRAMES_VLNL } from "./_fed6/VideoEdit/Main_vlnljrhb5gbv";

const VlnlRoot: React.FC = () => (
  <Composition id="FedPiernas" component={MainVlnl} durationInFrames={TOTAL_FRAMES_VLNL} fps={30} width={1920} height={1080} />
);

registerRoot(VlnlRoot);
