// Entry solo-Nightprotein para el FARM. Uso: ENTRY=src/index_nightprotein.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainNightprotein, TOTAL_FRAMES_NIGHTPROTEIN } from "./_fed6/VideoEdit/Main_nightprotein";

const NightproteinRoot: React.FC = () => (
  <Composition id="Nightprotein" component={MainNightprotein} durationInFrames={TOTAL_FRAMES_NIGHTPROTEIN} fps={30} width={1920} height={1080} />
);

registerRoot(NightproteinRoot);
