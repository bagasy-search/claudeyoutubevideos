// Entry aislado para renderizar DarkSpots (THE MELANIN BRAKE · bearberry/arbutin · age spots · Dr. Federer Holistic Health) en el farm.
import { Composition, registerRoot } from "remotion";
import { MainDarkSpots, TOTAL_FRAMES_DS } from "./VideoEdit/Main_darkspots";
const Root = () => (
  <Composition id="DarkSpots" component={MainDarkSpots} durationInFrames={TOTAL_FRAMES_DS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
