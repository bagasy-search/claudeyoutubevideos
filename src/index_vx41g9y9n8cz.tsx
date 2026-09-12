import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVx41, TOTAL_FRAMES_VX41G9Y9N8CZ } from "./VideoEdit/Main_vx41g9y9n8cz";

// Entry AISLADO — solo la composición "Moho" (The Free Builder · moho $1 vinagre).
const RootVx41: React.FC = () => (
  <>
    <Composition id="Moho" component={MainVx41} durationInFrames={TOTAL_FRAMES_VX41G9Y9N8CZ} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootVx41);
