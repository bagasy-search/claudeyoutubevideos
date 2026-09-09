import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainOhfCardboard, TOTAL_FRAMES_OHFCARDBOARD } from "./VideoEdit/Main_ohfcardboard";

const RootOhfCardboard: React.FC = () => (
  <Composition
    id="OhfCardboard"
    component={MainOhfCardboard}
    durationInFrames={TOTAL_FRAMES_OHFCARDBOARD}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootOhfCardboard);
