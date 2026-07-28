import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVkkh5, TOTAL_FRAMES_VKKH5EYTCP5L } from "./VideoEdit/Main_vkkh5eytcp5l";

// Entry AISLADO — solo la composición "OllaBarro" (Levi Lapp Jardín · truco amish de $5).
// No se registra en src/Root.tsx a propósito: es compartido y otro agente lo pisaría.
const RootVkkh5: React.FC = () => (
  <>
    <Composition id="OllaBarro" component={MainVkkh5} durationInFrames={TOTAL_FRAMES_VKKH5EYTCP5L} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(RootVkkh5);
