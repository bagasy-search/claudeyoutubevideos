// Entry SOLO de v3iuzgxce9vg para Remotion (farm). ENTRY=src/index_v3iuzgxce9vg.tsx
// ⛔ No se registra nada en src/Root.tsx: es un archivo compartido y otro agente lo pisa.
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainUro, TOTAL_FRAMES_URO } from "./_fed6/VideoEdit/Main_v3iuzgxce9vg";

const UroRoot: React.FC = () => (
  <Composition
    id="FedNocturia"
    component={MainUro}
    durationInFrames={TOTAL_FRAMES_URO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(UroRoot);
