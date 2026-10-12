import { registerRoot, Composition } from "remotion";
import { Min1 } from "./suqueso/Min1";
import { Min2 } from "./suqueso/Min2";
import { Min3 } from "./suqueso/Min3";
import { Full, FULL_FRAMES } from "./suqueso/Full";
const Root: React.FC = () => (
  <>
    <Composition id="Min1" component={Min1} durationInFrames={1800} fps={30} width={1920} height={1080} />
    <Composition id="Min2" component={Min2} durationInFrames={12000} fps={30} width={1920} height={1080} />
    <Composition id="Min3" component={Min3} durationInFrames={28845} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
