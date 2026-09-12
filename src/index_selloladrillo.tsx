import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainSelloladrillo, TOTAL_FRAMES_SELLOLADRILLO } from "./VideoEdit/Main_selloladrillo";

// Entry AISLADO — solo la composición "Selloladrillo" (no toca src/index.ts compartido).
const RootSelloladrillo: React.FC = () => (
  <>
    <Composition id="Selloladrillo" component={MainSelloladrillo} durationInFrames={TOTAL_FRAMES_SELLOLADRILLO} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(RootSelloladrillo);
