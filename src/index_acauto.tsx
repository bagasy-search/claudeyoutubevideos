// Entry solo-Acauto para Remotion Studio. Uso: npx remotion studio src/index_acauto.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainAcauto, TOTAL_FRAMES_ACAUTO } from "./VideoEdit/Main_acauto";

const AcautoRoot: React.FC = () => (
  <Composition id="Acauto" component={MainAcauto} durationInFrames={TOTAL_FRAMES_ACAUTO} fps={30} width={1920} height={1080} />
);

registerRoot(AcautoRoot);
