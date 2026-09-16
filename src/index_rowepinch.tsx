// Entry solo-rowepinch para el FARM. Uso: ENTRY=src/index_rowepinch.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRowepinch, TOTAL_FRAMES_ROWEPINCH } from "./rowepinch/Main_rowepinch";

const RowepinchRoot: React.FC = () => (
  <Composition id="Rowepinch" component={MainRowepinch} durationInFrames={TOTAL_FRAMES_ROWEPINCH} fps={30} width={1920} height={1080} />
);

registerRoot(RowepinchRoot);
