// Entry solo-Amishdolly para Remotion Studio / farm. Uso: ENTRY=src/index_amishdolly.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainAmishdolly, TOTAL_FRAMES_AMISHDOLLY } from "./VideoEdit/Main_amishdolly";

const AmishdollyRoot: React.FC = () => (
  <Composition id="Amishdolly" component={MainAmishdolly} durationInFrames={TOTAL_FRAMES_AMISHDOLLY} fps={30} width={1920} height={1080} />
);

registerRoot(AmishdollyRoot);
