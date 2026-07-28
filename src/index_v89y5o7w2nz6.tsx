import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV89, TOTAL_FRAMES_V89 } from "./_fed6/VideoEdit/Main_v89y5o7w2nz6";

const V89Root: React.FC = () => (
  <Composition
    id="FedAgua"
    component={MainV89}
    durationInFrames={TOTAL_FRAMES_V89}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(V89Root);
