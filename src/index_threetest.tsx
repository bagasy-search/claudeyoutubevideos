import { Composition, registerRoot } from "remotion";
import { MainThreeTest, TOTAL_FRAMES_3DTEST } from "./VideoEdit/Main_three_test";

const Root: React.FC = () => (
  <Composition id="ThreeTest" component={MainThreeTest} durationInFrames={TOTAL_FRAMES_3DTEST} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
