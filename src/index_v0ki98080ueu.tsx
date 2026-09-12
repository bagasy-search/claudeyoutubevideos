import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV0ki, TOTAL_FRAMES_V0KI } from "./VideoEdit/Main_v0ki98080ueu";

// Entry AISLADO — solo la composición "Humedad" (Constructor Libre · humedad $2).
const RootV0ki: React.FC = () => (
  <>
    <Composition id="Humedad" component={MainV0ki} durationInFrames={TOTAL_FRAMES_V0KI} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootV0ki);
