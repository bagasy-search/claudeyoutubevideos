// Entry solo-Teamind60 para el FARM. Uso: ENTRY=src/index_teamind60.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainTeamind60, TOTAL_FRAMES_TEAMIND60 } from "./_fed6/VideoEdit/Main_teamind60";

const Teamind60Root: React.FC = () => (
  <Composition id="Teamind60" component={MainTeamind60} durationInFrames={TOTAL_FRAMES_TEAMIND60} fps={30} width={1920} height={1080} />
);
registerRoot(Teamind60Root);
