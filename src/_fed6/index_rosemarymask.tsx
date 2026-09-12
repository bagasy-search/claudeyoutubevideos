// Entry aislado para renderizar RosemaryMask (THE ROSEMARY NIGHT MASK · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainRosemaryMask, TOTAL_FRAMES_MASK } from "./VideoEdit/Main_rosemarymask";
const Root = () => (
  <Composition id="RosemaryMask" component={MainRosemaryMask} durationInFrames={TOTAL_FRAMES_MASK} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
