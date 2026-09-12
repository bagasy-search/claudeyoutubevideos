// Entry aislado para renderizar el video Federer8 (7 EJERCICIOS TESTOSTERONA +40) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainFederer8, TOTAL_FRAMES_FED8 } from "./VideoEdit/Main_federer8";

const Root = () => (
  <Composition
    id="Federer8"
    component={MainFederer8}
    durationInFrames={TOTAL_FRAMES_FED8}
    fps={30}
    width={1920}
    height={1080}
  />
);
registerRoot(Root);
