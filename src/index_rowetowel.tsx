// Entry solo-rowetowel para el FARM. Uso: ENTRY=src/index_rowetowel.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRowetowel, TOTAL_FRAMES_ROWETOWEL } from "./rowetowel/Main_rowetowel";

const RowetowelRoot: React.FC = () => (
  <Composition id="Rowetowel" component={MainRowetowel} durationInFrames={TOTAL_FRAMES_ROWETOWEL} fps={30} width={1920} height={1080} />
);

registerRoot(RowetowelRoot);
