import "./index.css";
import { Composition } from "remotion";
import { MainRecalentados, TOTAL_FRAMES_RECAL } from "./VideoEdit/Main_recalentados";

export const RootRecal: React.FC = () => (
  <>
    <Composition id="Recalentados" component={MainRecalentados} durationInFrames={TOTAL_FRAMES_RECAL} fps={30} width={1920} height={1080} />
  </>
);
