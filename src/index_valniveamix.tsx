import { Composition, registerRoot } from "remotion";
import { Video, FULL_FRAMES, MIN1_END } from "./valniveamix/Video";
const Root = () => (
  <>
    <Composition id="ValniveamixMin1" component={Video} durationInFrames={Math.ceil(MIN1_END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="ValniveamixFull" component={Video} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
