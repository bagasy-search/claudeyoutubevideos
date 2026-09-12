import { Composition, registerRoot } from "remotion";
import { MainHierbacolon, TOTAL_FRAMES_HIERBACOLON } from "./_fed6/VideoEdit/Main_hierbacolon";

export const HierbacolonRoot: React.FC = () => (
  <>
    <Composition id="Hierbacolon" component={MainHierbacolon} durationInFrames={TOTAL_FRAMES_HIERBACOLON} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(HierbacolonRoot);
