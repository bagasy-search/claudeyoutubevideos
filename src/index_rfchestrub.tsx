// Entry solo-rfchestrub para el FARM. Uso: ENTRY=src/index_rfchestrub.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRfchestrub, TOTAL_FRAMES_RFCHESTRUB } from "./rfchestrub/Main_rfchestrub";

const RfchestrubRoot: React.FC = () => (
  <Composition id="Rfchestrub" component={MainRfchestrub} durationInFrames={TOTAL_FRAMES_RFCHESTRUB} fps={30} width={1920} height={1080} />
);

registerRoot(RfchestrubRoot);
