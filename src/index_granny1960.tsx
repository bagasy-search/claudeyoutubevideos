// Entry solo-Granny1960 para el FARM. Uso: ENTRY=src/index_granny1960.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainGranny1960, TOTAL_FRAMES_GRANNY1960 } from "./_fed6/VideoEdit/Main_granny1960";

const Granny1960Root: React.FC = () => (
  <Composition id="Granny1960" component={MainGranny1960} durationInFrames={TOTAL_FRAMES_GRANNY1960} fps={30} width={1920} height={1080} />
);

registerRoot(Granny1960Root);
