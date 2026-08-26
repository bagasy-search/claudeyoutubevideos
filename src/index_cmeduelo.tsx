import { Composition, registerRoot } from "remotion";
import { MainCmeduelo, TOTAL_FRAMES_CMEDUELO } from "./VideoEdit/Main_cmeduelo";

const Root = () => (
  <Composition id="Cmeduelo" component={MainCmeduelo} durationInFrames={TOTAL_FRAMES_CMEDUELO}
    fps={30} width={1920} height={1080} />
);
registerRoot(Root);
