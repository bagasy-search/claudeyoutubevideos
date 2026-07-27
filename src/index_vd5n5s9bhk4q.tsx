// Entry solo-vd5n5s9bhk4q para Remotion (farm). ENTRY=src/index_vd5n5s9bhk4q.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVd5, TOTAL_FRAMES_VD5 } from "./_fed6/VideoEdit/Main_vd5n5s9bhk4q";

const Vd5Root: React.FC = () => (
  <Composition id="FedRomero" component={MainVd5} durationInFrames={TOTAL_FRAMES_VD5} fps={30} width={1920} height={1080} />
);

registerRoot(Vd5Root);
