// Entry solo-vtio42jf5tzj para Remotion (Studio + farm). ENTRY=src/index_vtio42jf5tzj.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVtio, TOTAL_FRAMES_VTIO } from "./_fed6/VideoEdit/Main_vtio42jf5tzj";

const VtioRoot: React.FC = () => (
  <Composition id="FedCreatinina" component={MainVtio} durationInFrames={TOTAL_FRAMES_VTIO} fps={30} width={1920} height={1080} />
);

registerRoot(VtioRoot);
