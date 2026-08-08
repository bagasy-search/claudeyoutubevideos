// Entry aislado para renderizar RosemaryRub (THE ROSEMARY GLOVE · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainRosemaryRub, TOTAL_FRAMES_RUB } from "./VideoEdit/Main_rosemaryrub";
const Root = () => (
  <Composition id="RosemaryRub" component={MainRosemaryRub} durationInFrames={TOTAL_FRAMES_RUB} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
