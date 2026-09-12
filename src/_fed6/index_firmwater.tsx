// Entry aislado para renderizar FirmWater (THE COLLAGEN LOCK (hibiscus) · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainFirmWater, TOTAL_FRAMES_FW } from "./VideoEdit/Main_firmwater";
const Root = () => (
  <Composition id="FirmWater" component={MainFirmWater} durationInFrames={TOTAL_FRAMES_FW} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
