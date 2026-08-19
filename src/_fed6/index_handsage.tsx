// Entry aislado para renderizar HandsAge (THE OVERNIGHT SPOT PROTOCOL · licorice/age spots · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainHandsAge, TOTAL_FRAMES_HANDS } from "./VideoEdit/Main_handsage";
const Root = () => (
  <Composition id="HandsAge" component={MainHandsAge} durationInFrames={TOTAL_FRAMES_HANDS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
