// Entry solo-Recedinggums60 para el FARM. Uso: ENTRY=src/index_recedinggums60.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRecedinggums60, TOTAL_FRAMES_RECEDINGGUMS60 } from "./_fed6/VideoEdit/Main_recedinggums60";

const Recedinggums60Root: React.FC = () => (
  <Composition id="Recedinggums60" component={MainRecedinggums60} durationInFrames={TOTAL_FRAMES_RECEDINGGUMS60} fps={30} width={1920} height={1080} />
);

registerRoot(Recedinggums60Root);
