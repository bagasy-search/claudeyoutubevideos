// Entry aislado para renderizar el video Federer7 (KIWI antes de dormir) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainFederer7, TOTAL_FRAMES_FED7 } from "./VideoEdit/Main_federer7";

const Root = () => (
  <Composition
    id="Federer7"
    component={MainFederer7}
    durationInFrames={TOTAL_FRAMES_FED7}
    fps={30}
    width={1920}
    height={1080}
  />
);
registerRoot(Root);
