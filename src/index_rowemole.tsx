// Entry solo-rowemole para el FARM. Uso: ENTRY=src/index_rowemole.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRowemole, TOTAL_FRAMES_ROWEMOLE } from "./rowemole/Main_rowemole";

const RowemoleRoot: React.FC = () => (
  <Composition id="Rowemole" component={MainRowemole} durationInFrames={TOTAL_FRAMES_ROWEMOLE} fps={30} width={1920} height={1080} />
);

registerRoot(RowemoleRoot);
