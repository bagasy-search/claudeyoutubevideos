import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVgn0, TOTAL_FRAMES_VGN0PNKZK0A7 } from "./VideoEdit/Main_vgn0pnkzk0a7";

// Entry AISLADO — solo la composición "Moho3" (The Free Builder · moho $3 agua oxigenada).
const RootVgn0: React.FC = () => (
  <>
    <Composition id="Moho3" component={MainVgn0} durationInFrames={TOTAL_FRAMES_VGN0PNKZK0A7} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootVgn0);
