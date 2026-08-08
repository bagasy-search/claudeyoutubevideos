// Entry aislado para renderizar RosemaryGlove (THE ROSEMARY GLOVE · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainRosemaryGlove, TOTAL_FRAMES_ROSE } from "./VideoEdit/Main_rosemaryglove";
const Root = () => (
  <Composition id="RosemaryGlove" component={MainRosemaryGlove} durationInFrames={TOTAL_FRAMES_ROSE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
