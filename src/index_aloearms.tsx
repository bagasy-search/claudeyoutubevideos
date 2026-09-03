// Entry solo-Aloearms para el FARM. Uso: ENTRY=src/index_aloearms.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainAloearms, TOTAL_FRAMES_ALOEARMS } from "./_fed6/VideoEdit/Main_aloearms";

const AloearmsRoot: React.FC = () => (
  <Composition id="Aloearms" component={MainAloearms} durationInFrames={TOTAL_FRAMES_ALOEARMS} fps={30} width={1920} height={1080} />
);

registerRoot(AloearmsRoot);
