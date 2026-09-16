// Entry solo-rfsoap para el FARM. Uso: ENTRY=src/index_rfsoap.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRfsoap, TOTAL_FRAMES_RFSOAP } from "./rfsoap/Main_rfsoap";

const RfsoapRoot: React.FC = () => (
  <Composition id="Rfsoap" component={MainRfsoap} durationInFrames={TOTAL_FRAMES_RFSOAP} fps={30} width={1920} height={1080} />
);

registerRoot(RfsoapRoot);
