// Entry solo-rowecastor para el FARM. Uso: ENTRY=src/index_rowecastor.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRowecastor, TOTAL_FRAMES_ROWECASTOR } from "./rowecastor/Main_rowecastor";

const RowecastorRoot: React.FC = () => (
  <Composition id="Rowecastor" component={MainRowecastor} durationInFrames={TOTAL_FRAMES_ROWECASTOR} fps={30} width={1920} height={1080} />
);

registerRoot(RowecastorRoot);
