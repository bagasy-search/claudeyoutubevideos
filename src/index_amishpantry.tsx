import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainAmishpantry, TOTAL_FRAMES_AMISHPANTRY } from "./VideoEdit/Main_amishpantry";
const AmishpantryRoot: React.FC = () => (
  <Composition id="Amishpantry" component={MainAmishpantry} durationInFrames={TOTAL_FRAMES_AMISHPANTRY} fps={30} width={1920} height={1080} />
);
registerRoot(AmishpantryRoot);
