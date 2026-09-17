// Entry solo-facafecanas para el FARM. Uso: ENTRY=src/index_facafecanas.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFacafecanas, TOTAL_FRAMES_FACAFECANAS } from "./facafecanas/Main_facafecanas";

const FacafecanasRoot: React.FC = () => (
  <Composition id="Facafecanas" component={MainFacafecanas} durationInFrames={TOTAL_FRAMES_FACAFECANAS} fps={30} width={1920} height={1080} />
);

registerRoot(FacafecanasRoot);
