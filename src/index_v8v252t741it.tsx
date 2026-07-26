// Entry solo-v8v252t741it para Remotion (farm). ENTRY=src/index_v8v252t741it.tsx
// ⛔ NO registrar esta composición en src/Root.tsx: es un archivo compartido y otro agente lo pisa.
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV8, TOTAL_FRAMES_V8 } from "./_fed6/VideoEdit/Main_v8v252t741it";

const V8Root: React.FC = () => (
  <Composition id="FedManana" component={MainV8} durationInFrames={TOTAL_FRAMES_V8} fps={30} width={1920} height={1080} />
);

registerRoot(V8Root);
