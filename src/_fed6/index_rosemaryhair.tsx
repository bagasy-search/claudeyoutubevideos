// Entry aislado para renderizar RosemaryHair (ROSEMARY for HAIR · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainRosemaryHair, TOTAL_FRAMES_HAIR } from "./VideoEdit/Main_rosemaryhair";
const Root = () => (
  <Composition id="RosemaryHair" component={MainRosemaryHair} durationInFrames={TOTAL_FRAMES_HAIR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
