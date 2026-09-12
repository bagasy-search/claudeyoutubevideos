// Entry solo-Herbs para Remotion Studio / farm. Uso: ENTRY=src/index_herbs.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainHerbs, TOTAL_FRAMES_HERBS } from "./VideoEdit/Main_herbs";

const HerbsRoot: React.FC = () => (
  <Composition id="Herbs" component={MainHerbs} durationInFrames={TOTAL_FRAMES_HERBS} fps={30} width={1920} height={1080} />
);

registerRoot(HerbsRoot);
