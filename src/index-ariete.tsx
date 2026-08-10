import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainAriete, TOTAL_FRAMES_ARIETE } from "./VideoEdit/Main_ariete";

// Entry AISLADO — solo el video "Ariete" (bomba de ariete, Constructor Libre). Composición inline
// para que el farm la encuentre sin depender del Root.tsx compartido.
const RootAriete: React.FC = () => (
  <Composition id="Ariete" component={MainAriete} durationInFrames={TOTAL_FRAMES_ARIETE} fps={30} width={1920} height={1080} />
);

registerRoot(RootAriete);
