// Entry solo-rowefreeze para el FARM. Uso: ENTRY=src/index_rowefreeze.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRowefreeze, TOTAL_FRAMES_ROWEFREEZE } from "./rowefreeze/Main_rowefreeze";

const RowefreezeRoot: React.FC = () => (
  <Composition id="Rowefreeze" component={MainRowefreeze} durationInFrames={TOTAL_FRAMES_ROWEFREEZE} fps={30} width={1920} height={1080} />
);

registerRoot(RowefreezeRoot);
