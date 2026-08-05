// Entry aislado para renderizar Federer9 (10 COSAS QUE BAJAN LA TESTOSTERONA) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainFederer9, TOTAL_FRAMES_FED9 } from "./VideoEdit/Main_federer9";
const Root = () => (
  <Composition id="Federer9" component={MainFederer9} durationInFrames={TOTAL_FRAMES_FED9} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
