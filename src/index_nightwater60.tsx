// Entry solo-Nightwater60 para el FARM. Uso: ENTRY=src/index_nightwater60.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainNightwater60, TOTAL_FRAMES_NIGHTWATER60 } from "./nightwater60/Main_nightwater60";

const Nightwater60Root: React.FC = () => (
  <Composition id="Nightwater60" component={MainNightwater60} durationInFrames={TOTAL_FRAMES_NIGHTWATER60} fps={30} width={1920} height={1080} />
);

registerRoot(Nightwater60Root);
