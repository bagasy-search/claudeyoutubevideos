import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVqr, TOTAL_FRAMES_VQR } from "./VideoEdit/Main_vqrzeb6lg0ul";

// Entry AISLADO — solo la composición "Humedad4" (El Constructor Libre · bote de $4).
const RootVqr: React.FC = () => (
  <>
    <Composition id="Humedad4" component={MainVqr} durationInFrames={TOTAL_FRAMES_VQR} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootVqr);
