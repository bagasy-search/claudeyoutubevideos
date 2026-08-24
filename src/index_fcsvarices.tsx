import { Composition, registerRoot } from "remotion";
import { MainFcsvarices, TOTAL_FRAMES_FCSVARICES } from "./_fed6/VideoEdit/Main_fcsvarices";

const Root = () => (
  <>
    <Composition
      id="Fcsvarices"
      component={MainFcsvarices}
      durationInFrames={TOTAL_FRAMES_FCSVARICES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
registerRoot(Root);
