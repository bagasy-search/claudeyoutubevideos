import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainOhfTermite, TOTAL_FRAMES_OHFTERMITE } from "./VideoEdit/Main_ohftermite";

const RootOhfTermite: React.FC = () => (
  <Composition
    id="OhfTermite"
    component={MainOhfTermite}
    durationInFrames={TOTAL_FRAMES_OHFTERMITE}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootOhfTermite);
