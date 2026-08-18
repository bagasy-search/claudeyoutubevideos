// Entry aislado para renderizar RosemaryMask (THE GREEN FILLER (aloe) · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainAloeFiller, TOTAL_FRAMES_ALOE } from "./VideoEdit/Main_aloefiller";
const Root = () => (
  <Composition id="AloeFiller" component={MainAloeFiller} durationInFrames={TOTAL_FRAMES_ALOE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
