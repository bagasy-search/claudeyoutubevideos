import { Composition, registerRoot } from "remotion";
import { MainFcsdeterioro, TOTAL_FRAMES_FCSDETERIORO } from "./_fed6/VideoEdit/Main_fcsdeterioro";

const Root = () => (
  <>
    <Composition
      id="Fcsdeterioro"
      component={MainFcsdeterioro}
      durationInFrames={TOTAL_FRAMES_FCSDETERIORO}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(Root);
