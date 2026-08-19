// Entry solo-NightSerum para el FARM. Uso: ENTRY=src/index_nightserum.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainNightserum, TOTAL_FRAMES_NS } from "./_fed6/VideoEdit/Main_nightserum";

const NightserumRoot: React.FC = () => (
  <Composition id="NightSerum" component={MainNightserum} durationInFrames={TOTAL_FRAMES_NS} fps={30} width={1920} height={1080} />
);

registerRoot(NightserumRoot);
