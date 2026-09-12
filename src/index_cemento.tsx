// Entry MÍNIMO solo-Cemento para Remotion Studio. Uso: npx remotion studio src/index_cemento.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainCemento, TOTAL_FRAMES_CEMENTO } from "./VideoEdit/Main_cemento";

const CementoRoot: React.FC = () => (
  <Composition id="Cemento" component={MainCemento} durationInFrames={TOTAL_FRAMES_CEMENTO} fps={30} width={1920} height={1080} />
);

registerRoot(CementoRoot);
