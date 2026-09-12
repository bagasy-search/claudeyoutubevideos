// Entry solo-vezegakr5r53 para Remotion (farm). ENTRY=src/index_vezegakr5r53.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVez, TOTAL_FRAMES_VEZ } from "./_fed6/VideoEdit/Main_vezegakr5r53";

const VezRoot: React.FC = () => (
  <Composition id="FedRomero" component={MainVez} durationInFrames={TOTAL_FRAMES_VEZ} fps={30} width={1920} height={1080} />
);

registerRoot(VezRoot);
