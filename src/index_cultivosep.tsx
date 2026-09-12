import { Composition, registerRoot } from "remotion";
import { MainCultivosep, TOTAL_FRAMES_CULTIVOSEP } from "./VideoEdit/Main_cultivosep";

export const CultivosepRoot: React.FC = () => (
  <Composition
    id="Cultivosep"
    component={MainCultivosep}
    durationInFrames={TOTAL_FRAMES_CULTIVOSEP}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(CultivosepRoot);
