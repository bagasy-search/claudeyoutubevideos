// Entry aislado para renderizar Federer10 (MORETONES SIN GOLPEARTE) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainFederer10, TOTAL_FRAMES_FED10 } from "./VideoEdit/Main_federer10";
const Root = () => (
  <Composition id="Federer10" component={MainFederer10} durationInFrames={TOTAL_FRAMES_FED10} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
