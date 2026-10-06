// Entry solo-Fedmorning60 para el FARM. Uso: ENTRY=src/index_fedmorning60.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFedmorning60, TOTAL_FRAMES_FEDMORNING60 } from "./_fed6/VideoEdit/Main_fedmorning60";

const Fedmorning60Root: React.FC = () => (
  <Composition id="Fedmorning60" component={MainFedmorning60} durationInFrames={TOTAL_FRAMES_FEDMORNING60} fps={30} width={1920} height={1080} />
);

registerRoot(Fedmorning60Root);
