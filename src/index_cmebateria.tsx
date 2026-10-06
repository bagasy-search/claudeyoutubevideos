import { Composition, registerRoot } from "remotion";
import { MainCmebateria, TOTAL_FRAMES_CMEBATERIA } from "./VideoEdit/Main_cmebateria";

const Root = () => (
  <Composition id="Cmebateria" component={MainCmebateria} durationInFrames={TOTAL_FRAMES_CMEBATERIA}
    fps={30} width={1920} height={1080} />
);
registerRoot(Root);
