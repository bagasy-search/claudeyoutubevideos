// Entry solo-Cuellopavo para el FARM. Uso: ENTRY=src/index_cuellopavo.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainCuellopavo, TOTAL_FRAMES_CP } from "./_fed6/VideoEdit/Main_cuellopavo";

const CuellopavoRoot: React.FC = () => (
  <Composition id="Cuellopavo" component={MainCuellopavo} durationInFrames={TOTAL_FRAMES_CP} fps={30} width={1920} height={1080} />
);

registerRoot(CuellopavoRoot);
