import { Composition, registerRoot } from "remotion";
import { Mainvwtchhlmzl7f, TOTAL_FRAMES_VWTCHHLMZL7F } from "./VideoEdit/Main_vwtchhlmzl7f";
import "./style.css";

const Root: React.FC = () => (
  <Composition
    id="Peroxido"
    component={Mainvwtchhlmzl7f}
    durationInFrames={TOTAL_FRAMES_VWTCHHLMZL7F}
    fps={30}
    width={1920}
    height={1080}
  />
);
registerRoot(Root);
