// Entry solo-Turkeyneck para el FARM. Uso: ENTRY=src/index_turkeyneck.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainTurkeyneck, TOTAL_FRAMES_TURKEYNECK } from "./turkeyneck/Main_turkeyneck";

const TurkeyneckRoot: React.FC = () => (
  <Composition id="Turkeyneck" component={MainTurkeyneck} durationInFrames={TOTAL_FRAMES_TURKEYNECK} fps={30} width={1920} height={1080} />
);

registerRoot(TurkeyneckRoot);

