// Entry solo-Creatininegreens para el FARM. Uso: ENTRY=src/index_creatininegreens.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainCreatininegreens, TOTAL_FRAMES_CREATININEGREENS } from "./_fed6/VideoEdit/Main_creatininegreens";

const CreatininegreensRoot: React.FC = () => (
  <Composition id="Creatininegreens" component={MainCreatininegreens} durationInFrames={TOTAL_FRAMES_CREATININEGREENS} fps={30} width={1920} height={1080} />
);

registerRoot(CreatininegreensRoot);
