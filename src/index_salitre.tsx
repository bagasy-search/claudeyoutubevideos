// Entry solo-Salitre para Remotion Studio. Uso: npx remotion studio src/index_salitre.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainSalitre, TOTAL_FRAMES_SALITRE } from "./VideoEdit/Main_salitre";

const SalitreRoot: React.FC = () => (
  <Composition id="Salitre" component={MainSalitre} durationInFrames={TOTAL_FRAMES_SALITRE} fps={30} width={1920} height={1080} />
);

registerRoot(SalitreRoot);
