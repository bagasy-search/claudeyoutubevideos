// Entry solo-rowehair para el FARM. Uso: ENTRY=src/index_rowehair.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRowehair, TOTAL_FRAMES_ROWEHAIR } from "./rowehair/Main_rowehair";

const RowehairRoot: React.FC = () => (
  <Composition id="Rowehair" component={MainRowehair} durationInFrames={TOTAL_FRAMES_ROWEHAIR} fps={30} width={1920} height={1080} />
);

registerRoot(RowehairRoot);
