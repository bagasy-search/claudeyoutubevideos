import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./elmer01/Min1";
import { Elmer01, FULL_FRAMES } from "./elmer01/Rest";
const Root = () => (
  <>
    <Composition id="Elmer01" component={Elmer01} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Elmer01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
