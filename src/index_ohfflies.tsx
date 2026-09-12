import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainOhfFlies, TOTAL_FRAMES_OHFFLIES } from "./VideoEdit/Main_ohfflies";

const RootOhfFlies: React.FC = () => (
  <Composition
    id="OhfFlies"
    component={MainOhfFlies}
    durationInFrames={TOTAL_FRAMES_OHFFLIES}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootOhfFlies);
