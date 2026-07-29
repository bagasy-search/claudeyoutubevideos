import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainV55lhde2f1a4, TOTAL_FRAMES_V55LHDE2F1A4 } from "./VideoEdit/Main_v55lhde2f1a4";

const V55lhde2f1a4Root: React.FC = () => (
  <Composition
    id="V55LHDE2F1A4"
    component={MainV55lhde2f1a4}
    durationInFrames={TOTAL_FRAMES_V55LHDE2F1A4}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(V55lhde2f1a4Root);
