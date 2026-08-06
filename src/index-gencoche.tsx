import { registerRoot, Composition } from "remotion";
import "./index.css";
import { MainGencoche, TOTAL_FRAMES_GENCOCHE } from "./VideoEdit/Main_gencoche";

// Entry AISLADO del video "gencoche" (evita el bundle roto del Root completo en el farm).
const RootGencoche: React.FC = () => (
  <>
    <Composition id="Gencoche" component={MainGencoche} durationInFrames={TOTAL_FRAMES_GENCOCHE} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootGencoche);
