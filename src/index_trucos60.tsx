// Entry solo-Trucos60 para el FARM. Uso: ENTRY=src/index_trucos60.tsx
// Aísla este render del Root.tsx compartido (que otros agentes editan en paralelo y que
// hoy importa un Main_oxidotanico que no está ni en disco ni en git → rompería el bundle).
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainTrucos60, TOTAL_FRAMES_T60 } from "./_fed6/VideoEdit/Main_trucos60";

const Trucos60Root: React.FC = () => (
  <Composition id="Trucos60" component={MainTrucos60} durationInFrames={TOTAL_FRAMES_T60} fps={30} width={1920} height={1080} />
);

registerRoot(Trucos60Root);
