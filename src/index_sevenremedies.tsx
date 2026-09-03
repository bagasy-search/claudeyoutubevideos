// Entry solo-Sevenremedies para el FARM. Uso: ENTRY=src/index_sevenremedies.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainSevenremedies, TOTAL_FRAMES_SEVENREMEDIES } from "./_fed6/VideoEdit/Main_sevenremedies";

const SevenremediesRoot: React.FC = () => (
  <Composition id="Sevenremedies" component={MainSevenremedies} durationInFrames={TOTAL_FRAMES_SEVENREMEDIES} fps={30} width={1920} height={1080} />
);

registerRoot(SevenremediesRoot);
