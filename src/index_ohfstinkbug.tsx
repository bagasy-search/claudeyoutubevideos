import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainOhfStinkbug, TOTAL_FRAMES_OHFSTINKBUG } from "./VideoEdit/Main_ohfstinkbug";

const RootOhfStinkbug: React.FC = () => (
  <Composition
    id="OhfStinkbug"
    component={MainOhfStinkbug}
    durationInFrames={TOTAL_FRAMES_OHFSTINKBUG}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootOhfStinkbug);
