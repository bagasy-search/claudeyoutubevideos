// Entry aislado para renderizar RosemaryWater (THE ROSEMARY GLASS · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainRosemaryWater, TOTAL_FRAMES_WATER } from "./VideoEdit/Main_rosemarywater";
const Root = () => (
  <Composition id="RosemaryWater" component={MainRosemaryWater} durationInFrames={TOTAL_FRAMES_WATER} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
